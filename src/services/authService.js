import { users } from "../data/users.js";

const SESSION_KEY = "assessoria_web_session_v1";

function getStorage() {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function publicUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
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

  login({ username, password }) {
    const normalizedUsername = String(username || "").trim().toLowerCase();
    const user = users.find(
      (item) =>
        item.username.toLowerCase() === normalizedUsername &&
        item.password === String(password || ""),
    );

    if (!user) {
      throw new Error("Usuário ou senha inválidos.");
    }

    const session = {
      ...publicUser(user),
      loggedAt: new Date().toISOString(),
    };

    getStorage()?.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  logout() {
    getStorage()?.removeItem(SESSION_KEY);
  },
};
