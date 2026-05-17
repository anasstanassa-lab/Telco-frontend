// src/services/mockApi.js
// Drop-in mock that simulates the real API endpoints.
// Swap out for the real api.js when your backend is ready.

let idCounter = 10;

const rand = (min, max) => Math.floor(Math.random() * (max - min) + min);

const INITIAL_TARGETS = [
  { id: 1, url: "api.stripe.com",       status: "UP",   latency: 42,  uptime: 99.98 },
  { id: 2, url: "cdn.cloudflare.com",   status: "UP",   latency: 18,  uptime: 100   },
  { id: 3, url: "db.prod-cluster-01",   status: "DOWN", latency: null,uptime: 94.2  },
  { id: 4, url: "auth.okta.com",        status: "UP",   latency: 87,  uptime: 99.5  },
  { id: 5, url: "10.0.0.45:8080",       status: "UP",   latency: 220, uptime: 97.1  },
  { id: 6, url: "redis.cache-layer",    status: "UP",   latency: 5,   uptime: 100   },
];

let store = INITIAL_TARGETS.map((t) => ({
  ...t,
  lastChecked: new Date().toISOString(),
  history: Array.from({ length: 7 }, () => (t.latency ? rand(t.latency - 20, t.latency + 30) : null)),
}));

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/** GET /api/targets */
export const fetchTargets = async () => {
  await delay(400);
  // Simulate live latency fluctuations on each poll
  store = store.map((t) => {
    if (t.status === "DOWN") return { ...t, lastChecked: new Date().toISOString() };
    const newLatency = Math.max(1, t.latency + rand(-15, 20));
    return {
      ...t,
      latency: newLatency,
      history: [...t.history.slice(1), newLatency],
      lastChecked: new Date().toISOString(),
    };
  });
  return [...store];
};

/** POST /api/targets */
export const addTarget = async (url) => {
  await delay(500);
  const isUp = Math.random() > 0.15;
  const latency = isUp ? rand(10, 300) : null;
  const newTarget = {
    id: ++idCounter,
    url,
    status: isUp ? "UP" : "DOWN",
    latency,
    uptime: parseFloat((90 + Math.random() * 10).toFixed(2)),
    lastChecked: new Date().toISOString(),
    history: Array.from({ length: 7 }, () => (isUp ? rand(10, 300) : null)),
  };
  store = [newTarget, ...store];
  return newTarget;
};

/** DELETE /api/targets/:id */
export const deleteTarget = async (id) => {
  await delay(200);
  store = store.filter((t) => t.id !== id);
  return { success: true };
};
