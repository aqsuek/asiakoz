"""Persist the appointment form loader on the five advertising landing pages."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SLUGS = ("laser", "kosoglazie", "katarakta-almaty", "vitrektomiya-almaty", "peresadka-rogovitsy-almaty")
TAGS = '\n  <script src="/js/lead-form-config.js?v=20261020-modal"></script>\n  <script src="/js/lead-form.js?v=20261020-modal"></script>\n'


def install():
    for prefix in ("", "kk"):
        for slug in SLUGS:
            path = ROOT / prefix / slug / "index.html"
            if not path.exists():
                raise RuntimeError(f"Missing advertising landing page: {path}")
            html = path.read_text(encoding="utf-8")
            updated = html.replace("lead-form-config.js?v=20261020\"", "lead-form-config.js?v=20261020-modal\"").replace("lead-form.js?v=20261020\"", "lead-form.js?v=20261020-modal\"")
            if updated != html:
                html = updated
                path.write_text(html, encoding="utf-8")
            if "/js/lead-form.js" not in html:
                html = html.replace("</body>", TAGS + "</body>")
                path.write_text(html, encoding="utf-8")


if __name__ == "__main__":
    install()
