#!/usr/bin/env python3
"""Turn a scanned notebook PDF into per-page web images for the wiki.

Usage (from the repo root, with the venv active):

    python tools/add_notebook.py "path/to/Notebook 10-3 - AP Chem.pdf" --id 10-3 \
        --title "Notebook 10-3" --dates "11/10/26 – 12/1/26"

What it does:
  1. Renders every page with `pdftoppm` (from poppler: `brew install poppler`).
  2. Saves  docs/assets/scans/<id>/pNN.webp        (full page, ~1360 px wide)
     and    docs/assets/scans/<id>/thumb/pNN.webp  (thumbnail, 320 px wide)
  3. Adds/updates the notebook entry in data/notebooks.yml
     (page count + title + dates), which the wiki uses for source chips,
     the scans gallery and the "notebook pages digitized" stat.

After running it, create docs/scans/<id>.md (copy an existing one) and add it
to the `nav:` in mkdocs.yml under "Notebook Scans".
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
#     - {nb: "10-2", pages: "11-14"}
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
    ap.add_argument("--id", required=True, help='Notebook id used in URLs and front matter, e.g. "10-3"')
    ap.add_argument("--title", help='Display title (default: "Notebook <id>")')
    ap.add_argument("--dates", default="", help='Date range shown in the gallery, e.g. "8/25/26 – 9/16/26"')
    ap.add_argument("--dpi", type=int, default=160)
    ap.add_argument("--quality", type=int, default=72)
    args = ap.parse_args()

    pdf = args.pdf.expanduser().resolve()
    if not pdf.exists():
        sys.exit(f"No such file: {pdf}")

    dest = SCANS / args.id
    thumbs = dest / "thumb"
    if dest.exists():
        shutil.rmtree(dest)
    thumbs.mkdir(parents=True)

    with tempfile.TemporaryDirectory() as tmp:
        pages = render(pdf, Path(tmp), args.dpi)
        for i, png in enumerate(pages, start=1):
            name = f"p{i:02d}.webp"
            with Image.open(png) as im:
                im = im.convert("RGB")
                im.save(dest / name, "WEBP", quality=args.quality, method=6)
                th = im.copy()
                th.thumbnail((320, 10_000))
                th.save(thumbs / name, "WEBP", quality=60, method=6)
            print(f"  {args.id} {name}")

    data = {"notebooks": []}
    if MANIFEST.exists():
        data = yaml.safe_load(MANIFEST.read_text()) or {"notebooks": []}
    nbs = [n for n in data.get("notebooks", []) if str(n.get("id")) != args.id]
    nbs.append({
        "id": args.id,
        "title": args.title or f"Notebook {args.id}",
        "pages": len(pages),
        "dates": args.dates,
    })
    nbs.sort(key=lambda n: str(n["id"]))
    MANIFEST.write_text(HEADER + yaml.safe_dump({"notebooks": nbs}, sort_keys=False, allow_unicode=True))

    total = sum(p.stat().st_size for p in dest.rglob("*.webp"))
    print(f"Done: {len(pages)} pages → {dest.relative_to(ROOT)} ({total/1e6:.1f} MB). Manifest updated.")


if __name__ == "__main__":
    main()
