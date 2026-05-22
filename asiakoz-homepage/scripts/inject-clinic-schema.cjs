#!/usr/bin/env node
/**
 * Injects data/clinic-graph.json into index.html (replaces first ld+json block).
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../..");
const schemaPath = path.join(root, "data", "clinic-graph.json");
const schema = fs.readFileSync(schemaPath, "utf8").trim();

const files = process.argv.slice(2);
if (!files.length) {
  console.error("Usage: node inject-clinic-schema.js <index.html> [...]");
  process.exit(1);
}

const re = /<script type="application\/ld\+json">[\s\S]*?<\/script>/;

for (const file of files) {
  const abs = path.isAbsolute(file) ? file : path.resolve(process.cwd(), file);
  let html = fs.readFileSync(abs, "utf8");
  if (!re.test(html)) {
    console.error(`No ld+json block in ${abs}`);
    process.exit(1);
  }
  html = html.replace(
    re,
    `<script type="application/ld+json">\n${schema}\n    </script>`
  );
  fs.writeFileSync(abs, html);
  console.log("Injected clinic schema:", abs);
}
