// Arquitectura híbrida:
// - localStorage = almacén persistente del panel (nunca se borra al reiniciar servidor)
// - Servidor Express = relay cross-device en tiempo real (SSE + REST)
// - Polling de respaldo cada 3s si SSE falla (también dispara sonido)

const STORAGE_KEY = 'bdv_requests';
const BASE = '/api/login-requests';
const subscribers = new Set();

// ─── localStorage helpers ─────────────────────────────────────────────────────
function storageRead() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function storageWrite(records) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); } catch {}
}
function storageUpsert(record) {
  const records = storageRead();
  const idx = records.findIndex(r => r.id === record.id);
  if (idx >= 0) records[idx] = record; else records.unshift(record);
  storageWrite(records);
}
function storageRemove(id) {
  storageWrite(storageRead().filter(r => r.id !== id));
}

// ─── Event emitter ────────────────────────────────────────────────────────────
function emit(event) {
  subscribers.forEach(cb => { try { cb(event); } catch {} });
}

// ─── Track IDs seen since panel opened (for sound: only NEW records beep) ────
let knownIds = null; // null = not initialized yet

function initKnownIds() {
  if (knownIds !== null) return;
  knownIds = new Set(storageRead().map(r => r.id));
}

// Called for every record coming from the server (SSE or poll)
function processServerRecord(record) {
  initKnownIds();
  if (!knownIds.has(record.id)) {
    // Genuinely new record → save + fire event (triggers sound in Registro)
    knownIds.add(record.id);
    storageUpsert(record);
    emit({ type: 'create', id: record.id, data: record });
  } else {
    // Known record → just update storage silently
    storageUpsert(record);
  }
}

// ─── SSE (primary real-time channel) ─────────────────────────────────────────
let sseSource = null;

function ensureSSE() {
  if (sseSource) return;
  try {
    sseSource = new EventSource('/api/events');
    sseSource.onmessage = (e) => {
      const event = JSON.parse(e.data);
      if (event.type === 'init') {
        if (Array.isArray(event.records)) event.records.forEach(processServerRecord);
        return;
      }
      if (event.type === 'create') {
        processServerRecord(event.data);
      } else if (event.type === 'update') {
        storageUpsert(event.data);
        emit(event);
      } else if (event.type === 'delete') {
        storageRemove(event.id);
        if (knownIds) knownIds.delete(event.id);
        emit(event);
      }
    };
    sseSource.onerror = () => {
      sseSource.close();
      sseSource = null;
      setTimeout(ensureSSE, 3000);
    };
  } catch { /* SSE not supported or server down */ }
}

// ─── Background poll (SSE fallback — also triggers sound for new records) ────
let pollTimer = null;

async function serverPoll() {
  try {
    const res = await fetch(BASE, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return;
    const data = await res.json();
    if (Array.isArray(data)) data.forEach(processServerRecord);
  } catch { /* server unreachable — localStorage keeps the panel alive */ }
}

function startBackgroundPoll() {
  if (pollTimer) return;
  serverPoll(); // immediate first sync
  pollTimer = setInterval(serverPoll, 3000);
}

// ─── LoginRequest CRUD ────────────────────────────────────────────────────────
const LoginRequest = {
  // Reads from localStorage (always fast, never clears the panel)
  async list(orderBy, limit) {
    initKnownIds();
    let data = storageRead();
    if (orderBy) {
      const desc = orderBy.startsWith('-');
      const field = desc ? orderBy.slice(1) : orderBy;
      data = [...data].sort((a, b) => {
        if (a[field] < b[field]) return desc ? 1 : -1;
        if (a[field] > b[field]) return desc ? -1 : 1;
        return 0;
      });
    }
    return typeof limit === 'number' ? data.slice(0, limit) : data;
  },

  async filter(query, orderBy, limit) {
    const all = await LoginRequest.list(orderBy);
    const filtered = all.filter(r =>
      Object.entries(query || {}).every(([k, v]) => r[k] === v)
    );
    return typeof limit === 'number' ? filtered.slice(0, limit) : filtered;
  },

  async create(data) {
    // Try server first (cross-device relay)
    try {
      const res = await fetch(BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const record = await res.json();
        storageUpsert(record);
        if (knownIds) knownIds.add(record.id);
        return record;
      }
    } catch { /* server down */ }

    // Fallback: local-only (same-device panel still sees it)
    const record = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      created_date: new Date().toISOString(),
      ...data,
    };
    storageUpsert(record);
    if (knownIds) knownIds.add(record.id);
    emit({ type: 'create', id: record.id, data: record });
    return record;
  },

  async update(id, patch) {
    // Try server
    try {
      const res = await fetch(`${BASE}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        const updated = await res.json();
        storageUpsert(updated);
        return updated;
      }
    } catch { /* server down */ }

    // Fallback: update localStorage
    const records = storageRead();
    const idx = records.findIndex(r => r.id === id);
    if (idx < 0) return null;
    records[idx] = { ...records[idx], ...patch, updated_date: new Date().toISOString() };
    storageWrite(records);
    emit({ type: 'update', id, data: records[idx] });
    return records[idx];
  },

  async delete(id) {
    try { await fetch(`${BASE}/${id}`, { method: 'DELETE' }); } catch {}
    storageRemove(id);
    if (knownIds) knownIds.delete(id);
    emit({ type: 'delete', id });
    return { success: true };
  },

  subscribe(callback) {
    subscribers.add(callback);
    ensureSSE();
    startBackgroundPoll();
    return () => subscribers.delete(callback);
  },
};

// ─── Auth (sin backend real) ──────────────────────────────────────────────────
const auth = {
  async me() { return { id: 'local-user', email: 'demo@local', role: 'admin' }; },
  logout() {},
  redirectToLogin() {},
};

export const client = { entities: { LoginRequest }, auth };
