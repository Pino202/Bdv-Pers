// Cliente local de datos.
// Persiste en localStorage y sincroniza entre pestañas vía BroadcastChannel.

const STORAGE_KEY = "app_login_requests";
const CHANNEL_NAME = "app_login_requests_channel";

const channel =
  typeof BroadcastChannel !== "undefined" ? new BroadcastChannel(CHANNEL_NAME) : null;

const subscribers = new Set();

const readAll = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

const writeAll = (records) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

const emit = (event) => {
  subscribers.forEach((cb) => {
    try { cb(event); } catch {}
  });
  if (channel) channel.postMessage(event);
};

if (channel) {
  channel.onmessage = (e) => {
    subscribers.forEach((cb) => {
      try { cb(e.data); } catch {}
    });
  };
}

const sortRecords = (records, orderBy) => {
  if (!orderBy) return records;
  const desc = orderBy.startsWith("-");
  const field = desc ? orderBy.slice(1) : orderBy;
  return [...records].sort((a, b) => {
    if (a[field] < b[field]) return desc ? 1 : -1;
    if (a[field] > b[field]) return desc ? -1 : 1;
    return 0;
  });
};

const matches = (record, query) => {
  return Object.entries(query || {}).every(([k, v]) => record[k] === v);
};

const LoginRequest = {
  async list(orderBy, limit) {
    const all = sortRecords(readAll(), orderBy);
    return typeof limit === "number" ? all.slice(0, limit) : all;
  },

  async filter(query, orderBy, limit) {
    const filtered = readAll().filter((r) => matches(r, query));
    const sorted = sortRecords(filtered, orderBy);
    return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
  },

  async create(data) {
    const records = readAll();
    const record = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      created_date: new Date().toISOString(),
      ...data,
    };
    records.unshift(record);
    writeAll(records);
    emit({ type: "create", id: record.id, data: record });
    return record;
  },

  async update(id, patch) {
    const records = readAll();
    const idx = records.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    records[idx] = { ...records[idx], ...patch, updated_date: new Date().toISOString() };
    writeAll(records);
    emit({ type: "update", id, data: records[idx] });
    return records[idx];
  },

  async delete(id) {
    const records = readAll().filter((r) => r.id !== id);
    writeAll(records);
    emit({ type: "delete", id });
    return { success: true };
  },

  subscribe(callback) {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  },
};

const auth = {
  async me() {
    // Sin backend: devolvemos un usuario demo.
    return { id: "local-user", email: "demo@local", role: "admin" };
  },
  logout() {
    // No-op en modo local.
  },
  redirectToLogin() {
    // No-op en modo local.
  },
};

export const client = {
  entities: { LoginRequest },
  auth,
};
