import { isAuthed } from "../../../lib/auth";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false });
    return;
  }
  if (!isAuthed(req)) {
    res.status(401).json({ ok: false });
    return;
  }
  const { exportPublished } = require("../../../lib/posts");
  const result = exportPublished();
  res.status(200).json({ ok: true, ...result });
}
