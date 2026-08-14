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
  return Boolean(getSession()?.ok);
}

export function getGithubToken() {
  return import.meta.env.VITE_GITHUB_TOKEN || "";
}

export function canWriteToGithub() {
  return Boolean(getGithubToken());
}

export function login(username, password) {
  const expectedUser = import.meta.env.VITE_ADMIN_LOGIN || "aqsuek";
  const expectedPass = import.meta.env.VITE_ADMIN_PASSWORD || "asiakoz";
  if (username.trim() !== expectedUser || password !== expectedPass) return false;
  saveSession({ ok: true });
  return true;
}

export function logout() {
  clearSession();
}
