// src/services/api.js
import axios from "axios";

/** * VITE REQUIREMENT: 
 * 1. Use 'import.meta.env' instead of 'process.env'
 * 2. Ensure your variable in .env starts with 'VITE_'
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://telcopulse.duckdns.org";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: { "Content-Type": "application/json" },
  // Required for session-based auth cookies across domains (Amplify -> EC2)
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;

    // Auto-redirect on unauthenticated session
    if (status === 401 && typeof window !== "undefined") {
      const current = window.location.pathname + window.location.search + window.location.hash;
      const next = encodeURIComponent(current);
      const path = window.location.pathname;
      const isAuthPage = path === "/login" || path === "/signup";
      if (!isAuthPage) {
        window.location.assign(`/login?next=${next}`);
      }
    }

    const message =
      err.response?.data?.detail ||
      err.response?.data?.message ||
      err.message ||
      "Unknown error";
    return Promise.reject(Object.assign(new Error(message), { status }));
  }
);

// Maps backend snake_case fields → frontend camelCase fields
const mapTarget = (t) => ({
  id:          t.id,
  url:         t.url,
  status:      t.status,                    // "UP" | "DOWN" | "UNKNOWN"
  latency:     t.last_latency_ms ?? null,   // backend: last_latency_ms
  lastChecked: t.last_checked_at ?? null,   // backend: last_checked_at
  uptime:      t.uptime_percentage ?? 0,    // backend: uptime_percentage
  history:     t.history ?? [],
  userId:      t.user_id ?? null,           // backend: user_id (ownership)
});

/** GET /api/targets */
export const fetchTargets = () =>
  api.get("/api/targets").then((r) => r.data.items.map(mapTarget));

/** POST /api/targets */
export const addTarget = (url) =>
  api.post("/api/targets", { url, name: url }).then((r) => mapTarget(r.data));

/** DELETE /api/targets/:id */
export const deleteTarget = (id) =>
  api.delete(`/api/targets/${id}`).then((r) => r.data);

// ---- Session auth endpoints (no JWT) ----
export const login = (payload) => api.post("/auth/login", payload).then((r) => r.data);
export const signup = (payload) => api.post("/auth/signup", payload).then((r) => r.data);
export const logout = () => api.post("/auth/logout").then((r) => r.data);
export const fetchMe = () => api.get("/auth/me").then((r) => r.data);

// ---- Admin endpoints ----
export const fetchUsers = () => api.get("/admin/users").then((r) => r.data);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`).then((r) => r.data);

export default api;
