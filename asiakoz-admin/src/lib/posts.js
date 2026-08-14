import { getGithubToken } from "./auth";
import { readPublicJson, readRepoJson, writeRepoJson } from "./github";

const ADMIN_FILE = "data/posts-admin.json";
const PUBLIC_FILE = "data/posts.json";

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

function normalizePost(input = {}, existing, allPosts = []) {
  const now = new Date().toISOString();
  const titleRu = String(input.titleRu || existing?.titleRu || "").trim();
  const titleKz = String(input.titleKz || existing?.titleKz || titleRu).trim();
  const id = existing?.id || input.id || `post-${Date.now()}`;
  const status = input.status === "published" ? "published" : "draft";
  const type = input.type === "vlog" ? "vlog" : "news";
  const baseSlug = slugify(input.slug || titleRu || titleKz || "post");

  return {
    id,
    slug: uniqueSlug(baseSlug, allPosts.filter((p) => p.id !== id), id),
    type,
    status,
    publishedAt: status === "published" ? input.publishedAt || existing?.publishedAt || now : existing?.publishedAt || null,
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

function publishedPayload(posts) {
  return posts
    .filter((p) => p.status === "published")
    .sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0))
    .map(({ id, slug, type, publishedAt, updatedAt, cover, videoUrl, titleRu, titleKz, excerptRu, excerptKz, bodyRu, bodyKz }) => ({
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
    }));
}

async function loadAdminPosts() {
  const token = getGithubToken();
  try {
    const { data } = await readRepoJson(ADMIN_FILE, token);
    if (Array.isArray(data) && data.length) return data;
  } catch {
    /* fall back to public file */
  }
  return readPublicJson(PUBLIC_FILE);
}

async function persistPosts(posts) {
  const token = getGithubToken();
  const [adminMeta, publicMeta] = await Promise.all([
    readRepoJson(ADMIN_FILE, token).catch(() => ({ sha: null })),
    readRepoJson(PUBLIC_FILE, token).catch(() => ({ sha: null })),
  ]);
  await writeRepoJson(ADMIN_FILE, posts, token, adminMeta.sha);
  await writeRepoJson(PUBLIC_FILE, publishedPayload(posts), token, publicMeta.sha);
  return posts;
}

export async function listPosts() {
  const posts = await loadAdminPosts();
  return posts.sort((a, b) => new Date(b.publishedAt || b.updatedAt || 0) - new Date(a.publishedAt || a.updatedAt || 0));
}

export async function savePost(input) {
  const posts = await loadAdminPosts();
  const existing = input.id ? posts.find((p) => p.id === input.id) : null;
  const post = normalizePost(input, existing, posts);
  if (!post.titleRu && !post.titleKz) throw new Error("title_required");
  const next = existing ? posts.map((p) => (p.id === post.id ? post : p)) : [...posts, post];
  await persistPosts(next);
  return post;
}

export async function deletePost(id) {
  const posts = await loadAdminPosts();
  const next = posts.filter((p) => p.id !== id);
  if (next.length === posts.length) return false;
  await persistPosts(next);
  return true;
}
