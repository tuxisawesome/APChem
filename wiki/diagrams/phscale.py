"""pH scale bar (0–14) with acidic/basic zones, strength arrows and optional markers.

```phscale
markers:                       # optional pins on the scale
  - {pH: 2, label: "pH 2"}
  - {pH: 12, label: "pH 12"}
strength: true                 # show the "stronger acid / stronger base" arrows (default true)
caption: optional
```
"""
from __future__ import annotations

import itertools

from ._svg import FONT, BBox, DiagramError, arrow, as_list, figure, line, num, rich, svg_wrap

_ids = itertools.count(1)
STOPS = [(0, "#dc2626"), (3, "#f97316"), (5, "#facc15"), (7, "#22c55e"),
         (9, "#14b8a6"), (11, "#3b82f6"), (14, "#7c3aed")]


def render(data: dict, **_) -> str:
    data = data or {}
    if not isinstance(data, dict):
        raise DiagramError("phscale: expected a mapping (markers, strength, caption)")
    W, H = float(data.get("width", 520)), 24.0
    gid = f"ph-grad-{next(_ids)}"
    sx = lambda ph: ph / 14 * W  # noqa: E731
    out = [f'<defs><linearGradient id="{gid}" x1="0" y1="0" x2="1" y2="0">'
           + "".join(f'<stop offset="{p / 14:.3f}" stop-color="{c}"/>' for p, c in STOPS)
           + "</linearGradient></defs>",
           f'<rect x="0" y="0" width="{W:.1f}" height="{H:.1f}" rx="{H / 2:.1f}" fill="url(#{gid})"/>',
           f'<rect x="0" y="0" width="{W:.1f}" height="{H / 2:.1f}" rx="{H / 4:.1f}" fill="#ffffff" opacity=".25"/>']
    bb = BBox().add_rect(0, 0, W, H)
    # ticks + numbers
    for ph in range(15):
        x = sx(ph)
        out.append(line(x, H + 2, x, H + (8 if ph % 7 == 0 else 5), "dg-ink", 1.2))
        out.append(rich(str(ph), x, H + 21, FONT * 0.8, "middle",
                        "dg-text" if ph % 7 == 0 else "dg-text dg-muted-text", chem=False,
                        weight="700" if ph == 7 else None))
    bb.add(0, H + 24).add(W, H + 24)
    # neutral line
    x7 = sx(7)
    out.append(line(x7, -16, x7, H + 2, "dg-ink", 1.6))
    out.append(rich("7 · neutral", x7, -22, FONT * 0.85, "middle", "dg-text", chem=False, weight="600"))
    bb.add_text("7 · neutral", x7, -22, FONT * 0.85, "middle")
    # zones
    zy = H + 44
    out.append(rich("Acidic", sx(3.5), zy, FONT, "middle", "dg-text", chem=False, weight="700"))
    out.append(rich("Basic", sx(10.5), zy, FONT, "middle", "dg-text", chem=False, weight="700"))
    bb.add_text("Acidic", sx(3.5), zy, FONT, "middle")
    if data.get("strength", True):
        ay = zy + 18
        out.append(arrow(sx(6.6), ay, sx(0.3), ay, "dg-c2", "dg-c2-fill", 1.6, size=7))
        out.append(arrow(sx(7.4), ay, sx(13.7), ay, "dg-c1", "dg-c1-fill", 1.6, size=7))
        ty = ay + 16
        out.append(rich("weak", sx(6.6), ty, FONT * 0.78, "end", "dg-text dg-muted-text", chem=False))
        out.append(rich("strong", sx(0.3), ty, FONT * 0.78, "start", "dg-text dg-c2-text", chem=False))
        out.append(rich("weak", sx(7.4), ty, FONT * 0.78, "start", "dg-text dg-muted-text", chem=False))
        out.append(rich("strong", sx(13.7), ty, FONT * 0.78, "end", "dg-text dg-c1-text", chem=False))
        bb.add(0, ty + 4)
    # markers
    for m in as_list(data.get("markers")):
        if not isinstance(m, dict) or "pH" not in m:
            raise DiagramError("phscale: markers look like {pH: 2, label: \"text\"}")
        ph = num(m["pH"], None)
        if not 0 <= ph <= 14:
            raise DiagramError(f"phscale: marker pH {ph} is outside 0–14")
        x = sx(ph)
        out.append(f'<circle cx="{x:.1f}" cy="{H / 2:.1f}" r="6" fill="#fff" stroke="#1f1633" stroke-width="2"/>')
        if m.get("label"):
            out.append(line(x, -4, x, H / 2 - 6, "dg-ink", 1.2))
            out.append(rich(m["label"], x, -8, FONT * 0.8, "middle", "dg-text dg-label"))
            bb.add_text(m["label"], x, -8, FONT * 0.8, "middle")
    svg = svg_wrap("".join(out), bb, pad=14, label=data.get("caption") or "pH scale from 0 to 14")
    return figure(svg, "phscale", data.get("caption"))
