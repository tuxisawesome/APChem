#!/usr/bin/env python3
"""Turn a scanned notebook PDF into per-page web images for the wiki.

Usage (from the repo root, with the venv active):

  More pages of a notebook that's already in the wiki (e.g. new scans of Notebook 1):
    python tools/add_notebook.py "path/to/new pages.pdf" --id 1 --append --dates "8/25/26 – 12/1/26"

  A brand-new notebook:
    python tools/add_notebook.py "path/to/Notebook 2.pdf" --id 2 --title "Notebook 2" --dates "12/2/26 – …"

What it does:
  1. Renders every page with `pdftoppm` (from poppler: `brew install poppler`).
  2. Saves  docs/assets/scans/<id>/pNN.webp        (full page, ~1360 px wide)
     and    docs/assets/scans/<id>/thumb/pNN.webp  (thumbnail, 320 px wide)
     With --append the new pages continue the numbering after the last existing page
     (so existing page numbers — and every wiki page citing them — stay the same).
     Without --append an existing notebook with that id is replaced.
  3. Adds/updates the notebook entry in data/notebooks.yml (page count, title, dates),
     which the wiki uses for source chips, the scans gallery and the stats.

For a brand-new notebook, also create docs/scans/<id>.md (copy docs/scans/1.md and change
the id) and add it to the `nav:` in mkdocs.yml under "Notebook Scans".
"""
from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import yaml
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SCANS = ROOT / "docs" / "assets" / "scans"
MANIFEST = ROOT / "data" / "notebooks.yml"

HEADER = """\
# Notebook manifest — one entry per scanned notebook.
# Written by tools/add_notebook.py (you can also edit titles/dates by hand).
# Page images live in docs/assets/scans/<id>/pNN.webp (thumbs in thumb/).
# Wiki pages cite these with front matter like:
#   sources:
#     - {nb: "1", pages: "43-46"}
# To add more pages to a notebook:  python tools/add_notebook.py NEW.pdf --id 1 --append
"""


def render(pdf: Path, out_dir: Path, dpi: int) -> list[Path]:
    if not shutil.which("pdftoppm"):
        sys.exit("pdftoppm not found — install poppler first (brew install poppler).")
    subprocess.run(
        ["pdftoppm", "-r", str(dpi), "-png", str(pdf), str(out_dir / "p")],
        check=True,
    )
    return sorted(out_dir.glob("p-*.png"))


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("pdf", type=Path)
    ap.add_argument("--id", required=True, help='Notebook id used in URLs and front matter, e.g. "1"')
    ap.add_argument("--title", help='Display title (default: keep the existing one, or "Notebook <id>")')
    ap.add_argument("--dates", default=None, help='Date range shown in the gallery, e.g. "8/25/26 – 9/16/26"')
    ap.add_argument("--append", action="store_true",
                    help="Add these pages after the notebook's existing pages instead of replacing it")
    ap.add_argument("--dpi", type=int, default=160)
    ap.add_argument("--quality", type=int, default=72)
    args = ap.parse_args()

    pdf = args.pdf.expanduser().resolve()
    if not pdf.exists():
        sys.exit(f"No such file: {pdf}")

    data = {"notebooks": []}
    if MANIFEST.exists():
        data = yaml.safe_load(MANIFEST.read_text()) or {"notebooks": []}
    existing = next((n for n in data.get("notebooks", []) if str(n.get("id")) == args.id), None)

    dest = SCANS / args.id
    thumbs = dest / "thumb"
    start = 1
    if args.append:
        if not existing or not dest.exists():
            sys.exit(f"--append: notebook {args.id!r} isn't in the wiki yet (run without --append first).")
        start = int(existing.get("pages", 0)) + 1
    elif dest.exists():
        shutil.rmtree(dest)
    thumbs.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory() as tmp:
        pages = render(pdf, Path(tmp), args.dpi)
        for i, png in enumerate(pages, start=start):
            name = f"p{i:02d}.webp"
            if (dest / name).exists():
                sys.exit(f"Refusing to overwrite {dest / name}")
            with Image.open(png) as im:
                im = im.convert("RGB")
                im.save(dest / name, "WEBP", quality=args.quality, method=6)
                th = im.copy()
                th.thumbnail((320, 10_000))
                th.save(thumbs / name, "WEBP", quality=60, method=6)
            print(f"  {args.id} {name}")

    total_pages = start - 1 + len(pages)
    nbs = [n for n in data.get("notebooks", []) if str(n.get("id")) != args.id]
    nbs.append({
        "id": args.id,
        "title": args.title or (existing or {}).get("title") or f"Notebook {args.id}",
        "pages": total_pages,
        "dates": args.dates if args.dates is not None else (existing or {}).get("dates", ""),
    })
    nbs.sort(key=lambda n: str(n["id"]))
    MANIFEST.write_text(HEADER + yaml.safe_dump({"notebooks": nbs}, sort_keys=False, allow_unicode=True))

    total = sum(p.stat().st_size for p in dest.rglob("*.webp"))
    added = f"pages {start}–{total_pages}" if args.append else f"{len(pages)} pages"
    print(f"Done: {added} → {dest.relative_to(ROOT)} ({total/1e6:.1f} MB total). Manifest updated.")


if __name__ == "__main__":
    main()
