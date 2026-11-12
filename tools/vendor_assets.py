#!/usr/bin/env python3
"""Download the site's third-party browser assets into docs/assets/vendor/ so the wiki (and the
offline app) never needs a CDN. Re-run after changing a version below.

    .venv/bin/python tools/vendor_assets.py

What it fetches (pinned):
  • KaTeX (math) from jsDelivr: CSS, JS, mhchem + auto-render, and the woff2 fonts.
    The CSS is rewritten to load only woff2 files.
  • Fonts (SIL Open Font License) from Google Fonts: Geist, Geist Mono, Newsreader (roman +
    italic), latin + latin-ext subsets only. Writes vendor/fonts/fonts.css with @font-face rules.
Mermaid is not vendored (used on two pages; the service worker caches it from jsDelivr).
"""
from __future__ import annotations

import json
import re
import shutil
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "docs" / "assets" / "vendor"
KATEX = "0.16.22"
FONTS_CSS = ("https://fonts.googleapis.com/css2?family=Geist:wght@300..800"
             "&family=Geist+Mono:wght@400..600"
             "&family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..600&display=swap")
KEEP_SUBSETS = {"latin", "latin-ext"}
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"


def get(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def vendor_katex():
    base = f"https://cdn.jsdelivr.net/npm/katex@{KATEX}/dist/"
    dest = OUT / "katex"
    if dest.exists():
        shutil.rmtree(dest)
    (dest / "fonts").mkdir(parents=True)
    (dest / "contrib").mkdir()
    for name in ("katex.min.js", "contrib/mhchem.min.js", "contrib/auto-render.min.js"):
        (dest / name).write_bytes(get(base + name))
    css = get(base + "katex.min.css").decode("utf-8")
    # keep only the woff2 source of each @font-face
    css = re.sub(r',url\(fonts/[^)]+\.woff\) format\("woff"\),url\(fonts/[^)]+\.ttf\) format\("truetype"\)', "", css)
    (dest / "katex.min.css").write_text(css, encoding="utf-8")
    listing = json.loads(get(f"https://data.jsdelivr.com/v1/package/npm/katex@{KATEX}/flat"))
    fonts = [f["name"] for f in listing["files"] if f["name"].startswith("/dist/fonts/") and f["name"].endswith(".woff2")]
    for f in fonts:
        (dest / "fonts" / Path(f).name).write_bytes(get(base + f[len("/dist/"):]))
    missing = [m for m in re.findall(r"url\(fonts/([^)]+)\)", css) if not (dest / "fonts" / m).exists()]
    if missing:
        sys.exit(f"KaTeX CSS references fonts that weren't downloaded: {missing}")
    print(f"KaTeX {KATEX}: {len(fonts)} fonts")


def vendor_fonts():
    dest = OUT / "fonts"
    if dest.exists():
        shutil.rmtree(dest)
    dest.mkdir(parents=True)
    css = get(FONTS_CSS).decode("utf-8")
    blocks = re.findall(r"/\*\s*([\w-]+)\s*\*/\s*(@font-face\s*\{[^}]*\})", css)
    out = ["/* Geist, Geist Mono and Newsreader (SIL Open Font License), latin + latin-ext.",
           "   Downloaded by tools/vendor_assets.py from Google Fonts. */"]
    n = 0
    for subset, block in blocks:
        if subset not in KEEP_SUBSETS:
            continue
        family = re.search(r"font-family:\s*'([^']+)'", block).group(1)
        style = re.search(r"font-style:\s*(\w+)", block).group(1)
        url = re.search(r"url\((https://[^)]+\.woff2)\)", block).group(1)
        fname = f"{family.lower().replace(' ', '-')}-{style}-{subset}.woff2"
        (dest / fname).write_bytes(get(url))
        out.append(block.replace(url, fname))
        n += 1
    (dest / "fonts.css").write_text("\n".join(out) + "\n", encoding="utf-8")
    print(f"Fonts: {n} files")


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    vendor_katex()
    vendor_fonts()
    total = sum(p.stat().st_size for p in OUT.rglob("*") if p.is_file())
    print(f"Done: {total / 1024:.0f} KB in {OUT.relative_to(ROOT)}")
