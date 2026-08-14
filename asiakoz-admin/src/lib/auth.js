const SESSION_KEY = "asiakoz_admin_session";

export function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(session) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function isAuthed() {
  const session = getSession();
  return Boolean(session?.passwordOk && session?.githubToken);
}

export function getGithubToken() {
  return getSession()?.githubToken || "";
}

export function verifyPassword(password) {
  const expected = import.meta.env.VITE_ADMIN_PASSWORD || "asiakoz";
  return password === expected;
}

export function login(password, githubToken) {
  if (!verifyPassword(password)) return false;
  if (!githubToken?.trim()) return false;
  saveSession({ passwordOk: true, githubToken: githubToken.trim() });
  return true;
}

export function logout() {
  clearSession();
}
