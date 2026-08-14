let cache = null;
let cacheTs = 0;
const TTL = 60_000;

export function pickPostText(post, lang) {
  const ru = lang === "ru";
  return {
    title: (ru ? post.titleRu : post.titleKz) || post.titleRu || post.titleKz || "",
    excerpt: (ru ? post.excerptRu : post.excerptKz) || post.excerptRu || post.excerptKz || "",
    body: (ru ? post.bodyRu : post.bodyKz) || post.bodyRu || post.bodyKz || "",
  };
}

export function formatPostDate(value, lang) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString(lang === "ru" ? "ru-RU" : "kk-KZ", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function youtubeEmbedUrl(url = "") {
  const trimmed = String(url).trim();
  if (!trimmed) return null;
  try {
    const u = new URL(trimmed);
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

export async function loadPosts(force = false) {
  const now = Date.now();
  if (!force && cache && now - cacheTs < TTL) return cache;
  try {
    const res = await fetch(`${import.meta.env.BASE_URL || "/"}data/posts.json`, { cache: "no-store" });
    if (!res.ok) throw new Error("posts_fetch_failed");
    const data = await res.json();
    cache = Array.isArray(data) ? data : [];
    cacheTs = now;
    return cache;
  } catch {
    cache = [];
    cacheTs = now;
    return cache;
  }
}

export async function getPostBySlug(slug) {
  const posts = await loadPosts();
  return posts.find((p) => p.slug === slug) || null;
}
