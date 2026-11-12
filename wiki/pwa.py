"""Installable, offline app (PWA) files, written after the pages are rendered:

  manifest.webmanifest   name, icons, colors, shortcuts (Home Screen install)
  sw.js                  service worker (from wiki/templates/sw.js): precaches every page and
                         asset, serves them offline, keeps scans/PDFs in a separate cache
  offline-media.json     every notebook scan + reference PDF with sizes, for
                         Settings → "Save all for offline"

Asset URLs in the templates carry ?v=<hash> (see asset_version), so a new page never gets an old
stylesheet or script from a cache.
"""
from __future__ import annotations

import datetime as dt
import hashlib
import json
import re
import subprocess
from functools import lru_cache
from pathlib import Path

from .util import ROOT

SW_TEMPLATE = Path(__file__).resolve().parent / "templates" / "sw.js"
MEDIA_DIRS = ("assets/scans/", "assets/resources/")   # big files: cached on demand / "Save all"
SKIP = (".DS_Store",)


@lru_cache(maxsize=None)
def _file_hash(path: str) -> str:
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()[:10]


def asset_version(docs: Path, rel: str) -> str:
    """Short content hash of docs/<rel>, used as ?v=… on asset URLs."""
    p = docs / rel
    return _file_hash(str(p)) if p.exists() else "0"


def build_info(root: Path = ROOT) -> dict:
    """Date + git commit shown in Settings ("Version 2026-11-12 · 1a2b3c4")."""
    try:
        commit = subprocess.run(["git", "rev-parse", "--short", "HEAD"], cwd=root, capture_output=True,
                                text=True, timeout=10).stdout.strip()
    except Exception:
        commit = ""
    return {"date": dt.date.today().isoformat(), "commit": commit}


def write_all(site) -> None:
    out = site.out
    _write_manifest(site, out)
    pages = sorted(p.url for p in site.pages.values() if p.meta.get("template") != "none")
    files = []
    for f in sorted(out.rglob("*")):
        if not f.is_file() or f.name in SKIP:
            continue
        rel = f.relative_to(out).as_posix()
        if rel.startswith(MEDIA_DIRS) or rel.endswith("index.html") or rel in ("sw.js", "sitemap.xml", ".nojekyll",
                                                                                 "offline-media.json", "404.html"):
            continue
        files.append(rel)
    # versioned asset URLs exactly as the pages request them (…/wiki.css?v=abc)
    versioned = set()
    for html in out.rglob("*.html"):
        for m in re.finditer(r'(?:href|src)="([^"]*assets/[^"?]+\?v=[0-9a-f]+)"', html.read_text(encoding="utf-8")):
            url = m.group(1)
            versioned.add(url[url.index("assets/"):])
    plain = {u.split("?")[0] for u in versioned}
    precache = ["./"] + [u for u in pages if u] + [f for f in files if f not in plain] + sorted(versioned)
    missing = [u for u in precache if not u.endswith("/") and u != "./" and not (out / u.split("?")[0]).exists()]
    for u in missing:
        site.warn(f"PWA: precache entry {u} does not exist in the built site")
    h = hashlib.sha256()
    for u in precache:
        h.update(u.encode())
        target = out / (u.split("?")[0] + ("index.html" if u.endswith("/") else "")) if u != "./" else out / "index.html"
        if target.exists():
            h.update(_file_hash(str(target)).encode())
    version = h.hexdigest()[:12]
    sw = SW_TEMPLATE.read_text(encoding="utf-8")
    sw = sw.replace("__VERSION__", version).replace("__PRECACHE__", json.dumps(precache, indent=0))
    (out / "sw.js").write_text(sw, encoding="utf-8")
    media = []
    for d in MEDIA_DIRS:
        for f in sorted((out / d).rglob("*")):
            if f.is_file() and f.name not in SKIP:
                media.append({"u": f.relative_to(out).as_posix(), "b": f.stat().st_size})
    (out / "offline-media.json").write_text(json.dumps({"files": media}), encoding="utf-8")
    site.pwa = {"version": version, "precache": len(precache), "media": len(media),
                "precache_bytes": sum((out / (u.split("?")[0])).stat().st_size for u in files)}


def _write_manifest(site, out: Path) -> None:
    name = site.config.get("site_name", "AP Chem")
    manifest = {
        "id": "./",
        "name": name,
        "short_name": site.config.get("short_name", "AP Chem"),
        "description": site.config.get("site_description", ""),
        "start_url": "./",
        "scope": "./",
        "display": "standalone",
        "orientation": "any",
        "background_color": "#f4f1fb",
        "theme_color": "#7c3aed",
        "lang": "en",
        "icons": [
            {"src": "assets/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any"},
            {"src": "assets/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"},
            {"src": "assets/icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"},
        ],
        "shortcuts": [
            {"name": "Formulas", "url": "formulas/"},
            {"name": "Memorize", "url": "memorize/"},
            {"name": "Teacher Quotes", "url": "quotes/"},
            {"name": "Class Log", "url": "class-log/"},
        ],
    }
    (out / "manifest.webmanifest").write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
