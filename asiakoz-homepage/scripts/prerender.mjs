#!/usr/bin/env node
// Prerender the React SPA pages (home, city branches, laser) into static HTML.
//
// Why: these pages ship an empty <div id="root"></div>. Google renders JS late,
// and AI search crawlers (ChatGPT, Perplexity, Claude) and Yandex mostly do not
// run JS at all, so the most important pages looked empty to them.
//
// How: serve the site root locally, open each page in headless Chrome, scroll
// it so lazy blocks appear, then write the rendered #root markup back into the
// page's index.html between prerender markers. React's createRoot() replaces
// it on load, so visitors get the same live app.
//
// Usage: node asiakoz-homepage/scripts/prerender.mjs [/path/ ...]
// Run it after any deploy-*.sh script (they already call it at the end).

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DEFAULT_PAGES = [
  "/", "/kk/",
  "/almaty/", "/kk/almaty/",
  "/aktau/", "/kk/aqtau/",
  "/shymkent/", "/kk/shymkent/",
  "/laser/", "/kk/laser/",
];
const pages = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_PAGES;

const ROOT_RE = /<div id="root">(?:<!--prerender:start-->[\s\S]*?<!--prerender:end-->)?<\/div>/;
const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript",
  ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".gif": "image/gif", ".ico": "image/x-icon", ".mp4": "video/mp4", ".woff2": "font/woff2",
};

function fileFor(urlPath) {
  let p = path.join(ROOT, decodeURIComponent(urlPath.split("?")[0]));
  if (!p.startsWith(ROOT)) return null;
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, "index.html");
  return fs.existsSync(p) ? p : null;
}

// Serve each page with an EMPTY root, so the snapshot never nests old output.
const server = http.createServer((req, res) => {
  const f = fileFor(req.url);
  if (!f) { res.writeHead(404); return res.end(); }
  const ext = path.extname(f).toLowerCase();
  res.writeHead(200, { "content-type": MIME[ext] || "application/octet-stream" });
  if (ext === ".html") {
    return res.end(fs.readFileSync(f, "utf8").replace(ROOT_RE, '<div id="root"></div>'));
  }
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(0, "localhost", r));
const origin = `http://localhost:${server.address().port}`;

const browser = await chromium.launch({ channel: "chrome", headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
// Keep analytics and ad pixels out of the snapshot run.
await ctx.route(/googletagmanager|google-analytics|doubleclick|facebook|mc\.yandex|connect\.facebook/, (r) => r.abort());

let failed = 0;
for (const p of pages) {
  const file = fileFor(p);
  if (!file) { console.error(`skip ${p}: no file`); failed++; continue; }
  const src = fs.readFileSync(file, "utf8");
  if (!ROOT_RE.test(src)) { console.log(`skip ${p}: not an SPA shell`); continue; }

  const page = await ctx.newPage();
  try {
    await page.goto(origin + p, { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForFunction(() => document.querySelector("#root")?.children.length > 0, null, { timeout: 15000 });
    // Scroll through so reveal-on-scroll blocks render their final state.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 600));
    });
    const html = await page.evaluate(() => {
      const root = document.querySelector("#root").cloneNode(true);
      root.querySelectorAll("script, iframe").forEach((n) => n.remove());
      // Media players must not autoplay twice; React re-creates them anyway.
      root.querySelectorAll("video").forEach((v) => { v.removeAttribute("autoplay"); v.setAttribute("preload", "none"); });
      return root.innerHTML;
    });
    const h1 = await page.$$eval("#root h1", (n) => n.length);
    const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    if (words < 100) throw new Error(`only ${words} words rendered`);

    const out = src.replace(ROOT_RE, () => `<div id="root"><!--prerender:start-->${html}<!--prerender:end--></div>`);
    fs.writeFileSync(file, out);
    console.log(`ok   ${p}  ${words} words, h1=${h1}`);
  } catch (e) {
    failed++;
    console.error(`FAIL ${p}: ${e.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();
server.close();
process.exit(failed ? 1 : 0);
