import { api } from "./api.js";

const SESSION_KEY = "assessoria_web_session_v1";

function getStorage() {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

export const authService = {
  getSession() {
    const storage = getStorage();
    if (!storage) return null;

    const raw = storage.getItem(SESSION_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      storage.removeItem(SESSION_KEY);
      return null;
    }
  },

  async login({ username, password }) {
    try {
      const data = await api.request("/auth/login", {
      method: "POST",
      body: { username, password }
    });

    const session = {
      ...data.user,
      loggedAt: new Date().toISOString()
    };

    api.setToken(data.token);
    getStorage()?.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
    } catch (error) { 
      console.log("Login error:", error);
      throw error instanceof Error ? error : new Error("Erro desconhecido");
    }
  
  },

  logout() {
    api.clearToken();
    getStorage()?.removeItem(SESSION_KEY);
  }
};
