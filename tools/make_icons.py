#!/usr/bin/env python3
"""Draw the app icons (Home Screen, install, favicon) from the flask logo in
docs/assets/img/flask.svg — same shapes, redrawn with Pillow so no SVG renderer is needed.

    .venv/bin/python tools/make_icons.py

Writes docs/assets/icons/:
  icon-192.png, icon-512.png      rounded purple tile (manifest "any")
  icon-maskable-512.png           full-bleed tile, flask inside the safe zone (manifest "maskable")
  apple-touch-icon.png            180×180 full-bleed (iOS rounds the corners itself)
  favicon-32.png                  small rounded tile
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "docs" / "assets" / "icons"
C0, C1 = (0x8B, 0x5C, 0xF6), (0xC0, 0x26, 0xD3)   # gradient: violet → fuchsia (top-left → bottom-right)
SS = 4                                            # supersampling for smooth edges


def gradient(size: int) -> Image.Image:
    g = Image.new("RGB", (64, 64))
    px = g.load()
    for y in range(64):
        for x in range(64):
            t = (x + y) / 126
            px[x, y] = tuple(round(a + (b - a) * t) for a, b in zip(C0, C1))
    return g.resize((size, size), Image.BICUBIC)


def corner(p1, c, p2, n=10):
    """Rounded corner from p1 to p2 bending toward corner point c (quadratic Bézier)."""
    return [((1 - t) ** 2 * p1[0] + 2 * (1 - t) * t * c[0] + t * t * p2[0],
             (1 - t) ** 2 * p1[1] + 2 * (1 - t) * t * c[1] + t * t * p2[1])
            for t in (k / n for k in range(n + 1))]


def flask(draw: ImageDraw.ImageDraw, ox: float, oy: float, s: float):
    """The flask from flask.svg (64-unit box) at offset (ox, oy) and scale s px/unit."""
    P = lambda pts: [(ox + x * s, oy + y * s) for x, y in pts]
    w = 4 * s
    # outline: neck lip, then the body (rounded bottom corners like the SVG's arcs)
    # (the slanted sides would meet the bottom at x = 13.53 and 50.47; the corners round off there)
    outline = [(28, 14), (28, 28)] + corner((17, 47), (13.53, 53), (20.5, 53)) \
        + corner((43.5, 53), (50.47, 53), (47, 47)) + [(36, 28), (36, 14)]
    for seg in ([(26, 14), (38, 14)], outline):
        pts = P(seg)
        draw.line(pts, fill="white", width=round(w), joint="curve")
        for x, y in (pts[0], pts[-1]):
            draw.ellipse([x - w / 2, y - w / 2, x + w / 2, y + w / 2], fill="white")
    # liquid
    liquid = [(21.5, 43), (42.5, 43), (45.7, 48.6), (44.9, 50.6), (43.9, 51), (20.1, 51), (19.1, 50.6), (18.3, 48.6)]
    draw.polygon(P(liquid), fill=(255, 255, 255, 217))
    for cx, cy, r in ((30, 38, 2), (35, 33, 1.4)):
        x, y = ox + cx * s, oy + cy * s
        draw.ellipse([x - r * s, y - r * s, x + r * s, y + r * s], fill="white")


def icon(size: int, rounded: bool, glyph: float) -> Image.Image:
    """glyph = how much of the tile the 64-unit flask box fills (1.0 = like flask.svg)."""
    S = size * SS
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    tile = gradient(S).convert("RGBA")
    if rounded:
        mask = Image.new("L", (S, S), 0)
        ImageDraw.Draw(mask).rounded_rectangle([0, 0, S - 1, S - 1], radius=S * 16 / 64, fill=255)
        img.paste(tile, (0, 0), mask)
    else:
        img.paste(tile, (0, 0))
    layer = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    s = S * glyph / 64
    off = (S - 64 * s) / 2
    flask(ImageDraw.Draw(layer), off, off + 1.5 * s, s)   # the flask sits slightly high in its box
    img = Image.alpha_composite(img, layer)
    return img.resize((size, size), Image.LANCZOS)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    icon(192, True, 1.0).save(OUT / "icon-192.png", optimize=True)
    icon(512, True, 1.0).save(OUT / "icon-512.png", optimize=True)
    icon(512, False, 0.78).save(OUT / "icon-maskable-512.png", optimize=True)
    icon(180, False, 0.92).convert("RGB").save(OUT / "apple-touch-icon.png", optimize=True)
    icon(32, True, 1.0).save(OUT / "favicon-32.png", optimize=True)
    for p in sorted(OUT.glob("*.png")):
        print(p.name, p.stat().st_size, "bytes")
