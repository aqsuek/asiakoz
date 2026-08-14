const REPO = import.meta.env.VITE_GITHUB_REPO || "aqsuek/asiakoz";
const API = "https://api.github.com";

function headers(token) {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export async function readRepoJson(path, token) {
  const res = await fetch(`${API}/repos/${REPO}/contents/${path}`, {
    headers: token ? headers(token) : { Accept: "application/vnd.github+json" },
  });
  if (res.status === 404) return { data: [], sha: null };
  if (!res.ok) throw new Error(`read_failed:${path}`);
  const payload = await res.json();
  const text = atob(payload.content.replace(/\n/g, ""));
  return { data: JSON.parse(text), sha: payload.sha };
}

export async function writeRepoJson(path, data, token, sha) {
  const body = JSON.stringify(data, null, 2) + "\n";
  const content = btoa(unescape(encodeURIComponent(body)));
  const res = await fetch(`${API}/repos/${REPO}/contents/${path}`, {
    method: "PUT",
    headers: {
      ...headers(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: `admin: update ${path}`,
      content,
      sha: sha || undefined,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `write_failed:${path}`);
  }
  return res.json();
}

export async function readPublicJson(path) {
  const res = await fetch(`/${path.replace(/^\//, "")}`, { cache: "no-store" });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`public_read_failed:${path}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}
