import { isAuthed } from "../../lib/auth";

export default function handler(req, res) {
  const { listPosts, getPost, savePost, deletePost } = require("../../lib/posts");

  if (req.method === "GET") {
    const publishedOnly = req.query.public === "1";
    if (publishedOnly) {
      res.status(200).json({ ok: true, posts: listPosts({ publishedOnly: true }) });
      return;
    }
    if (!isAuthed(req)) {
      res.status(401).json({ ok: false });
      return;
    }
    res.status(200).json({ ok: true, posts: listPosts() });
    return;
  }

  if (!isAuthed(req)) {
    res.status(401).json({ ok: false });
    return;
  }

  if (req.method === "POST") {
    try {
      const post = savePost(req.body || {});
      res.status(200).json({ ok: true, post });
    } catch (err) {
      res.status(400).json({ ok: false, error: err.message || "save_failed" });
    }
    return;
  }

  if (req.method === "DELETE") {
    const id = String(req.query.id || "");
    if (!id || !deletePost(id)) {
      res.status(404).json({ ok: false });
      return;
    }
    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).json({ ok: false });
}
