const fs = require("fs");
const path = require("path");

const FILE = path.join(process.cwd(), "data", "posts.json");
const EXPORT_FILE = path.join(process.cwd(), "..", "asiakoz-homepage", "public", "data", "posts.json");

function ensureFile() {
  const dir = path.dirname(FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]", "utf8");
}

function readPosts() {
  ensureFile();
  try {
    const raw = fs.readFileSync(FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writePosts(posts) {
  ensureFile();
  fs.writeFileSync(FILE, JSON.stringify(posts, null, 2), "utf8");
}

function slugify(text = "") {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function uniqueSlug(base, posts, excludeId) {
  let slug = base || "post";
  let n = 1;
  while (posts.some((p) => p.slug === slug && p.id !== excludeId)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

function normalizePost(input = {}, existing) {
  const now = new Date().toISOString();
  const titleRu = String(input.titleRu || existing?.titleRu || "").trim();
  const titleKz = String(input.titleKz || existing?.titleKz || titleRu).trim();
  const baseSlug = slugify(input.slug || titleRu || titleKz || "post");
  const posts = readPosts();
  const id = existing?.id || input.id || `post-${Date.now()}`;
  const status = input.status === "published" ? "published" : "draft";
  const type = input.type === "vlog" ? "vlog" : "news";

  return {
    id,
    slug: uniqueSlug(baseSlug, posts, id),
    type,
    status,
    publishedAt:
      status === "published"
        ? input.publishedAt || existing?.publishedAt || now
        : existing?.publishedAt || null,
    updatedAt: now,
    createdAt: existing?.createdAt || now,
    cover: String(input.cover || existing?.cover || "").trim() || null,
    videoUrl: String(input.videoUrl || existing?.videoUrl || "").trim() || null,
    titleRu,
    titleKz,
    excerptRu: String(input.excerptRu || existing?.excerptRu || "").trim(),
    excerptKz: String(input.excerptKz || existing?.excerptKz || "").trim(),
    bodyRu: String(input.bodyRu || existing?.bodyRu || "").trim(),
    bodyKz: String(input.bodyKz || existing?.bodyKz || "").trim(),
  };
}

function listPosts({ publishedOnly = false } = {}) {
  const posts = readPosts().sort((a, b) => {
    const ta = new Date(a.publishedAt || a.updatedAt || 0).getTime();
    const tb = new Date(b.publishedAt || b.updatedAt || 0).getTime();
    return tb - ta;
  });
  if (publishedOnly) return posts.filter((p) => p.status === "published");
  return posts;
}

function getPost(idOrSlug) {
  const posts = readPosts();
  return posts.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null;
}

function savePost(input) {
  const posts = readPosts();
  const existing = input.id ? posts.find((p) => p.id === input.id) : null;
  const post = normalizePost(input, existing);
  if (!post.titleRu && !post.titleKz) throw new Error("title_required");
  const next = existing ? posts.map((p) => (p.id === post.id ? post : p)) : [...posts, post];
  writePosts(next);
  return post;
}

function deletePost(id) {
  const posts = readPosts();
  const next = posts.filter((p) => p.id !== id);
  if (next.length === posts.length) return false;
  writePosts(next);
  return true;
}

function exportPublished() {
  const published = listPosts({ publishedOnly: true }).map(
    ({ id, slug, type, publishedAt, updatedAt, cover, videoUrl, titleRu, titleKz, excerptRu, excerptKz, bodyRu, bodyKz }) => ({
      id,
      slug,
      type,
      publishedAt,
      updatedAt,
      cover,
      videoUrl,
      titleRu,
      titleKz,
      excerptRu,
      excerptKz,
      bodyRu,
      bodyKz,
    }),
  );
  const dir = path.dirname(EXPORT_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(EXPORT_FILE, JSON.stringify(published, null, 2), "utf8");
  return { count: published.length, path: EXPORT_FILE };
}

module.exports = {
  readPosts,
  listPosts,
  getPost,
  savePost,
  deletePost,
  exportPublished,
};
