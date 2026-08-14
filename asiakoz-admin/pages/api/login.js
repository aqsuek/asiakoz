import { isAuthed, expectedPassword, loginHeaders, logoutHeaders } from "../../lib/auth";

export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json({ ok: isAuthed(req) });
    return;
  }

  if (req.method === "DELETE") {
    res.writeHead(200, { ...logoutHeaders(), "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ ok: false });
    return;
  }

  const password = String(req.body?.password || "");
  if (password !== expectedPassword()) {
    res.status(401).json({ ok: false, error: "bad_password" });
    return;
  }

  res.writeHead(200, { ...loginHeaders(), "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: true }));
}
