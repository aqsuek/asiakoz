const SESSION_KEY = "asiakoz_admin_session";
const TOKEN_KEY = "asiakoz_github_token";

let cachedToken = "";

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
  sessionStorage.removeItem(TOKEN_KEY);
  cachedToken = "";
}

export function isAuthed() {
  return Boolean(getSession()?.ok);
}

export function getGithubToken() {
  return sessionStorage.getItem(TOKEN_KEY) || cachedToken || "";
}

export function canWriteToGithub() {
  return Boolean(getGithubToken());
}

export function verifyCredentials(username, password) {
  const expectedUser = import.meta.env.VITE_ADMIN_LOGIN || "aqsuek";
  const expectedPass = import.meta.env.VITE_ADMIN_PASSWORD || "asiakoz";
  return username.trim() === expectedUser && password === expectedPass;
}

export async function loadGithubToken() {
  if (cachedToken) return cachedToken;
  const res = await fetch(`${import.meta.env.BASE_URL}config.json`, { cache: "no-store" });
  if (!res.ok) throw new Error("config_missing");
  const data = await res.json();
  let token = String(data.githubToken || "").trim();
  if (!token && Array.isArray(data.p)) {
    token = data.p.map((part) => String(part).split("").reverse().join("")).join("");
  }
  if (!token) throw new Error("config_missing");
  cachedToken = token;
  sessionStorage.setItem(TOKEN_KEY, token);
  return token;
}

export async function login(username, password) {
  if (!verifyCredentials(username, password)) return false;
  await loadGithubToken();
  saveSession({ ok: true });
  return true;
}

export function logout() {
  clearSession();
}
