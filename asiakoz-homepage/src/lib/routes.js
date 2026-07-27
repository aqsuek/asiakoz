const BASE = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

export function homeUrl(hash = "") {
  const h = hash ? (hash.startsWith("#") ? hash : `#${hash}`) : "";
  return `${BASE}/${h}`;
}

export function doctorUrl(id) {
  return `${BASE}/doctor/${id}/`;
}

export function parseRoute(pathname = window.location.pathname) {
  let path = pathname.replace(/\/+$/, "") || "/";
  const base = BASE || "";

  if (path === base || path === `${base}/index.html` || path === "/") {
    return { name: "home" };
  }

  const prefix = `${base}/doctor/`;
  if (path.startsWith(prefix)) {
    const id = path.slice(prefix.length).split("/")[0];
    if (id) return { name: "doctor", id };
  }

  return { name: "home" };
}
