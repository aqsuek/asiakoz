const BASE = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

function isKkPath(pathname = "") {
  return pathname === "/kk" || pathname.startsWith("/kk/");
}

function kkPrefix(pathname) {
  const p =
    pathname ??
    (typeof window !== "undefined" ? window.location.pathname : "/");
  return isKkPath(p) ? "/kk" : "";
}

/** Strip /kk prefix so routing matches the Vite base path. */
function stripKk(pathname = "") {
  let path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/kk") return "/";
  if (path.startsWith("/kk/")) return path.slice(3) || "/";
  return path;
}

export function homeUrl(hash = "") {
  const h = hash ? (hash.startsWith("#") ? hash : `#${hash}`) : "";
  const prefix = kkPrefix();
  if (!BASE) {
    return h ? `${prefix}/${h}` : `${prefix}/` || "/";
  }
  return `${prefix}${BASE}/${h}`;
}

export function doctorUrl(id) {
  const prefix = kkPrefix();
  if (!BASE) return `${prefix}/doctor/${id}/`;
  return `${prefix}${BASE}/doctor/${id}/`;
}

export function newsUrl() {
  const prefix = kkPrefix();
  if (!BASE) return `${prefix}/news/`;
  return `${prefix}${BASE}/news/`;
}

export function newsArticleUrl(slug) {
  const prefix = kkPrefix();
  if (!BASE) return `${prefix}/news/${slug}/`;
  return `${prefix}${BASE}/news/${slug}/`;
}

export function parseRoute(pathname = window.location.pathname) {
  const path = stripKk(pathname);

  const base = BASE || "";
  if (!base) {
    if (path === "/" || path === "/index.html") return { name: "home" };
    if (path === "/news" || path === "/news/") return { name: "news" };
    if (path.startsWith("/news/")) {
      const slug = path.slice("/news/".length).split("/")[0];
      if (slug) return { name: "news-article", slug };
    }
    if (path.startsWith("/doctor/")) {
      const id = path.slice("/doctor/".length).split("/")[0];
      if (id) return { name: "doctor", id };
    }
    return { name: "home" };
  }

  if (path === base || path === `${base}/index.html`) {
    return { name: "home" };
  }

  const newsBase = `${base}/news`;
  if (path === newsBase || path === `${newsBase}/`) {
    return { name: "news" };
  }
  if (path.startsWith(`${newsBase}/`)) {
    const slug = path.slice(`${newsBase}/`.length).split("/")[0];
    if (slug) return { name: "news-article", slug };
  }

  const docPrefix = `${base}/doctor/`;
  if (path.startsWith(docPrefix)) {
    const id = path.slice(docPrefix.length).split("/")[0];
    if (id) return { name: "doctor", id };
  }

  return { name: "home" };
}
