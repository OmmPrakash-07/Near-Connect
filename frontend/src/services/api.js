const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const SESSION_KEY = "near-connect-session";

export function getStoredSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

export function storeSession(session) {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
}

async function request(path, options = {}) {
  const session = getStoredSession();
  const headers = { ...(options.headers || {}) };
  if (options.body) headers["Content-Type"] = "application/json";
  if (session?.token) headers.Authorization = `Bearer ${session.token}`;

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  } catch {
    throw new Error("Cannot reach the Near Connect server. Start the backend and try again.");
  }

  if (response.status === 204) return null;
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    if (response.status === 401) storeSession(null);
    throw new Error(data?.message || data || "The request could not be completed.");
  }
  return data;
}

export const api = {
  login: (payload) => request("/users/login", { method: "POST", body: JSON.stringify(payload) }),
  register: (payload) => request("/users/register", { method: "POST", body: JSON.stringify(payload) }),
  logout: () => request("/users/logout", { method: "POST" }),
  me: () => request("/users/me"),
  updateLocation: (payload) => request("/users/me/location", { method: "PUT", body: JSON.stringify(payload) }),
  updateProfile: (payload) => request("/users/me/profile", { method: "PUT", body: JSON.stringify(payload) }),
  nearby: (radius = 10) => request(`/users/nearby?radius=${encodeURIComponent(radius)}`),
  swipe: (targetUserId, action) => request("/swipes", {
    method: "POST",
    body: JSON.stringify({ targetUserId, action }),
  }),
  matches: () => request("/matches"),
  messages: (withUserId) => request(`/messages?withUserId=${encodeURIComponent(withUserId)}`),
  sendMessage: (receiverId, message) => request("/messages", {
    method: "POST",
    body: JSON.stringify({ receiverId, message }),
  }),
};
