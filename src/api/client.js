// Cliente de datos centralizado.
// Lee y escribe contra la API del servidor Express para que los datos
// sean visibles desde cualquier dispositivo en tiempo real.

const BASE = '/api/login-requests';

// ─── SSE subscription (Server-Sent Events) ────────────────────────────────────
const subscribers = new Set();
let sseSource = null;

function ensureSSE() {
  if (sseSource) return;
  sseSource = new EventSource('/api/events');

  sseSource.onmessage = (e) => {
    const event = JSON.parse(e.data);
    if (event.type === 'init') return; // handled on connect by list()
    subscribers.forEach((cb) => { try { cb(event); } catch {} });
  };

  sseSource.onerror = () => {
    sseSource.close();
    sseSource = null;
    // Reconnect after 3s
    setTimeout(ensureSSE, 3000);
  };
}

// ─── LoginRequest CRUD ────────────────────────────────────────────────────────
const LoginRequest = {
  async list(orderBy, limit) {
    let data;
    try {
      const res = await fetch(BASE);
      if (!res.ok) throw new Error(String(res.status));
      data = await res.json();
    } catch {
      return []; // server not ready yet — return empty, interval will retry
    }
    if (orderBy) {
      const desc = orderBy.startsWith('-');
      const field = desc ? orderBy.slice(1) : orderBy;
      data = data.sort((a, b) => {
        if (a[field] < b[field]) return desc ? 1 : -1;
        if (a[field] > b[field]) return desc ? -1 : 1;
        return 0;
      });
    }
    return typeof limit === 'number' ? data.slice(0, limit) : data;
  },

  async filter(query, orderBy, limit) {
    const all = await LoginRequest.list(orderBy);
    const filtered = all.filter((r) =>
      Object.entries(query || {}).every(([k, v]) => r[k] === v)
    );
    return typeof limit === 'number' ? filtered.slice(0, limit) : filtered;
  },

  async create(data) {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async update(id, patch) {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    return res.json();
  },

  async delete(id) {
    await fetch(`${BASE}/${id}`, { method: 'DELETE' });
    return { success: true };
  },

  subscribe(callback) {
    subscribers.add(callback);
    ensureSSE();
    return () => subscribers.delete(callback);
  },
};

// ─── Auth (sin backend real) ──────────────────────────────────────────────────
const auth = {
  async me() {
    return { id: 'local-user', email: 'demo@local', role: 'admin' };
  },
  logout() {},
  redirectToLogin() {},
};

export const client = { entities: { LoginRequest }, auth };
