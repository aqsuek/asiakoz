import { isAuthed } from "../../lib/auth";
import { readEvents, summarize } from "../../lib/store";

export default function handler(req, res) {
  if (!isAuthed(req)) {
    res.status(401).json({ ok: false });
    return;
  }
  const days = Number(req.query.days || 7);
  res.status(200).json(summarize(readEvents(), Number.isFinite(days) ? days : 7));
}
