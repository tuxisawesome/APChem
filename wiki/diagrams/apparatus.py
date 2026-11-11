"""Labeled lab-equipment drawings (beakers, calorimeters, titration setups …).

```apparatus
parts:
  - type: beaker          # see PARTS below
    id: cup               # optional, used by labels (default: the type name)
    style: cup            # beaker only: beaker (default) | cup (cylinder, like a drawn cup)
    fill: 0.5             # liquid level 0–1 (0 = empty)
    liquid: blue          # purple | blue | clear | pink | green | amber | gray
    particles:            # optional particle picture inside the liquid
      - {text: "Na+", n: 4}
      - {text: "Cl-", n: 4, color: 2}
    label: "(under-label)"
labels:
  - {text: Surroundings, to: cup.wall, side: right}          # side: left | right | top | bottom
  - {text: "System\\n(Reaction)", to: cup.liquid, side: right, arrow: true}
caption: optional
```

PARTS and their label anchors (use `<id>.<anchor>`):
  beaker            wall, wall_left, liquid, surface, rim, bottom
  test-tube         tube, liquid, mouth, bottom
  erlenmeyer        neck, mouth, wall, liquid, surface
  volumetric-flask  neck, mark, bulb, liquid
  graduated-cylinder  cylinder, liquid, surface, base
  burette           tube, solution, stopcock, tip, top
  titration         burette, titrant, stopcock, tip, drop, flask, solution, neck
  coffee-cup        cup, inner_cup, insulation, lid, thermometer, stirrer, liquid
  bomb-calorimeter  insulation, water, bomb, sample, wires, thermometer, stirrer, lid
  gas-collection    generator, reaction, tube, bubbles, cylinder, gas, water, trough
  scrap-paper       paper, column, fold, title   (side: right|left, title: "Decode FRQ")
  rod               rod, top, bottom              (a metal rod; hot: true adds heat waves)
Parts are laid out left→right; add `at: [x, y]` (px) to place one yourself.
"""
from __future__ import annotations

import math
import random

from ._svg import (FONT, BBox, DiagramError, arrow, as_list, esc, figure, line, rich,
                   svg_wrap, text_width)

LIQUIDS = {"purple", "blue", "clear", "pink", "green", "amber", "gray"}


def _liq(color):
    c = str(color or "blue")
    if c not in LIQUIDS:
        raise DiagramError(f"apparatus: liquid must be one of {', '.join(sorted(LIQUIDS))}")
    return f"dg-liquid dg-liquid-{c}"


def _meniscus(x0, x1, y, depth=3):
    """Surface line with a slight concave meniscus."""
    return f'<path d="M{x0:.1f},{y:.1f} Q{(x0 + x1) / 2:.1f},{y + depth:.1f} {x1:.1f},{y:.1f}" class="dg-liquid-surface" fill="none" stroke-width="1.6"/>'


def _particles(spec, x0, y0, x1, y1, seed=7):
    """Scatter labeled particles inside a rectangle (on a jittered grid, no overlaps)."""
    items = []
    for p in as_list(spec):
        if not isinstance(p, dict) or "text" not in p:
            raise DiagramError("apparatus: particles look like {text: \"Na+\", n: 3}")
        for _ in range(int(p.get("n", 1))):
            items.append(p)
    if not items:
        return ""
    rnd = random.Random(seed)
    rnd.shuffle(items)
    labels = [str(p["text"]) for p in items]
    r = max(8.0, max(text_width(t, 10) for t in labels) / 2 + 3)
    W, H = x1 - x0, y1 - y0
    while True:
        cols, rows = max(1, int(W // (2 * r + 3))), max(1, int(H // (2 * r + 3)))
        if cols * rows >= len(items) or r <= 6:
            break
        r -= 0.5
    cells = [(c, k) for k in range(rows) for c in range(cols)]
    rnd.shuffle(cells)
    cw, ch = W / cols, H / rows
    out = []
    for p, (c, k) in zip(items, cells):
        jx = rnd.uniform(-1, 1) * max(0, cw / 2 - r - 1)
        jy = rnd.uniform(-1, 1) * max(0, ch / 2 - r - 1)
        cx, cy = x0 + (c + .5) * cw + jx, y0 + (k + .5) * ch + jy
        cls = {"1": "dg-c1", "2": "dg-c2", "3": "dg-c3", "4": "dg-c4"}.get(str(p.get("color", 1)), "dg-c1")
        out.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}" class="dg-particle {cls}" stroke-width="1.3"/>')
        out.append(rich(str(p["text"]), cx, cy + 3.5, 10 if r >= 8 else 8, "middle", "dg-text dg-particle-text"))
    return "".join(out)


# ─── parts: each returns (svg, anchors, bbox) in local coords (0,0 = bottom-center) ───
def beaker(o):
    w, h = float(o.get("width", 100)), float(o.get("height", 120))
    fill = float(o.get("fill", 0.5))
    L, R = -w / 2, w / 2
    out, A = [], {}
    if o.get("style") == "cup":
        ry = w * 0.12
        if fill > 0:
            ly = -fill * (h - 8)
            out.append(f'<path d="M{L + 1:.1f},{ly:.1f} L{L + 1:.1f},0 A{w / 2 - 1:.1f},{ry:.1f} 0 0 0 {R - 1:.1f},0 L{R - 1:.1f},{ly:.1f} Z" class="{_liq(o.get("liquid"))}"/>')
            out.append(f'<ellipse cx="0" cy="{ly:.1f}" rx="{w / 2 - 1:.1f}" ry="{ry:.1f}" class="{_liq(o.get("liquid"))} dg-liquid-top"/>')
            if o.get("particles"):
                out.append(_particles(o["particles"], L + 4, ly + ry, R - 4, -4))
            A["surface"] = (R - 6, ly)
            A["liquid"] = (R - 4, ly / 2)
        out.append(f'<path d="M{L:.1f},{-h:.1f} L{L:.1f},0 A{w / 2:.1f},{ry:.1f} 0 0 0 {R:.1f},0 L{R:.1f},{-h:.1f}" class="dg-glass" fill="none" stroke-width="2.2"/>')
        out.append(f'<ellipse cx="0" cy="{-h:.1f}" rx="{w / 2:.1f}" ry="{ry:.1f}" class="dg-glass" fill="none" stroke-width="2.2"/>')
        A.update(wall=(R, -h * 0.7), wall_left=(L, -h * 0.7), rim=(R, -h), bottom=(0, ry))
        A.setdefault("liquid", (0, -h * 0.25))
        bb = BBox().add_rect(L, -h - ry, R, ry)
        return "".join(out), A, bb
    if fill > 0:
        ly = -fill * (h - 10)
        out.append(f'<path d="M{L + 1.5:.1f},{ly:.1f} L{L + 1.5:.1f},-6 Q{L + 1.5:.1f},-1.5 {L + 6:.1f},-1.5 L{R - 6:.1f},-1.5 Q{R - 1.5:.1f},-1.5 {R - 1.5:.1f},-6 L{R - 1.5:.1f},{ly:.1f} Q0,{ly + 4:.1f} {L + 1.5:.1f},{ly:.1f} Z" class="{_liq(o.get("liquid"))}"/>')
        out.append(_meniscus(L + 1.5, R - 1.5, ly, 4))
        if o.get("particles"):
            out.append(_particles(o["particles"], L + 3, ly + 4, R - 3, -3))
        A["surface"] = (R - 4, ly + 1)
        A["liquid"] = (R - 6, (ly - 2) / 2)
    out.append(f'<path d="M{L - 7:.1f},{-h - 4:.1f} Q{L:.1f},{-h - 2:.1f} {L:.1f},{-h + 6:.1f} L{L:.1f},-6 Q{L:.1f},0 {L + 6:.1f},0 L{R - 6:.1f},0 Q{R:.1f},0 {R:.1f},-6 L{R:.1f},{-h:.1f}" class="dg-glass" fill="none" stroke-width="2.2" stroke-linejoin="round"/>')
    for k, f in enumerate((0.3, 0.5, 0.7)):
        y = -h * f
        out.append(line(L + 4, y, L + (16 if k != 1 else 22), y, "dg-glass", 1.2))
    A.update(wall=(R, -h * 0.75), wall_left=(L, -h * 0.75), rim=(R, -h), bottom=(0, 0))
    A.setdefault("liquid", (0, -h * 0.25))
    return "".join(out), A, BBox().add_rect(L - 8, -h - 5, R, 0)


def test_tube(o):
    w, h = float(o.get("width", 26)), float(o.get("height", 110))
    fill = float(o.get("fill", 0.35))
    L, R, r = -w / 2, w / 2, w / 2
    out, A = [], {}
    if fill > 0:
        ly = -fill * (h - 6)
        out.append(f'<path d="M{L + 1.5:.1f},{ly:.1f} L{L + 1.5:.1f},{-r:.1f} A{r - 1.5:.1f},{r - 1.5:.1f} 0 0 0 {R - 1.5:.1f},{-r:.1f} L{R - 1.5:.1f},{ly:.1f} Z" class="{_liq(o.get("liquid"))}"/>')
        out.append(_meniscus(L + 1.5, R - 1.5, ly, 3))
        A["liquid"] = (R - 2, (ly - r) / 2)
    out.append(f'<path d="M{L - 3:.1f},{-h:.1f} L{L:.1f},{-h + 3:.1f} L{L:.1f},{-r:.1f} A{r:.1f},{r:.1f} 0 0 0 {R:.1f},{-r:.1f} L{R:.1f},{-h + 3:.1f} L{R + 3:.1f},{-h:.1f}" class="dg-glass" fill="none" stroke-width="2.2"/>')
    A.update(tube=(R, -h * 0.6), mouth=(R, -h), bottom=(0, 0))
    A.setdefault("liquid", (0, -r))
    return "".join(out), A, BBox().add_rect(L - 4, -h, R + 4, 0)


def _cone_half(y, base_half, neck_half, body_h):
    t = min(1, max(0, -y / body_h))
    return base_half + (neck_half - base_half) * t


def erlenmeyer(o):
    bw, body_h = float(o.get("width", 110)) / 2, float(o.get("height", 100))
    nw, neck_h = 13.0, 34.0
    fill = float(o.get("fill", 0.35))
    out, A = [], {}
    if fill > 0:
        ly = -fill * body_h * 0.9
        hw = _cone_half(ly, bw - 2, nw - 2, body_h)
        out.append(f'<path d="M{-hw:.1f},{ly:.1f} L{-(bw - 8):.1f},-2 L{bw - 8:.1f},-2 L{hw:.1f},{ly:.1f} Z" class="{_liq(o.get("liquid"))}"/>'
                   f'<path d="M{-(bw - 8):.1f},-2 Q{-(bw - 2):.1f},-2 {-(bw - 3.5):.1f},-6 L{-hw:.1f},{ly:.1f} Z M{bw - 8:.1f},-2 Q{bw - 2:.1f},-2 {bw - 3.5:.1f},-6 L{hw:.1f},{ly:.1f} Z" class="{_liq(o.get("liquid"))}"/>')
        out.append(_meniscus(-hw, hw, ly, 3))
        if o.get("particles"):
            out.append(_particles(o["particles"], -hw * 0.7, ly + 6, hw * 0.7, -4))
        A["liquid"] = (bw * 0.55, ly / 2)
        A["surface"] = (hw, ly)
    top = -body_h - neck_h
    out.append(f'<path d="M{-nw - 3:.1f},{top:.1f} L{-nw:.1f},{top + 3:.1f} L{-nw:.1f},{-body_h:.1f} L{-bw:.1f},-7 Q{-bw:.1f},0 {-bw + 7:.1f},0 L{bw - 7:.1f},0 Q{bw:.1f},0 {bw:.1f},-7 L{nw:.1f},{-body_h:.1f} L{nw:.1f},{top + 3:.1f} L{nw + 3:.1f},{top:.1f}" class="dg-glass" fill="none" stroke-width="2.2" stroke-linejoin="round"/>')
    A.update(neck=(nw, -body_h - neck_h / 2), mouth=(nw, top), wall=(bw * 0.62, -body_h * 0.45))
    A.setdefault("liquid", (0, -10))
    return "".join(out), A, BBox().add_rect(-bw, top, bw, 0)


def volumetric_flask(o):
    r = float(o.get("width", 90)) / 2
    neck_h, nw = 95.0, 8.0
    fill = float(o.get("fill", 0.6))
    cy = -r
    out, A = [], {}
    if fill > 0:
        ly = -fill * 2 * r * 0.95
        out.append(f'<clipPath id="vf-clip-{id(o)}"><circle cx="0" cy="{cy:.1f}" r="{r - 1.5:.1f}"/></clipPath>')
        out.append(f'<rect x="{-r:.1f}" y="{ly:.1f}" width="{2 * r:.1f}" height="{-ly:.1f}" class="{_liq(o.get("liquid"))}" clip-path="url(#vf-clip-{id(o)})"/>')
        A["liquid"] = (r * 0.6, (ly + 0) / 2 - 4)
    ang = math.asin(nw / r)
    x_top = nw
    y_top = cy - r * math.cos(ang)
    out.append(f'<path d="M{-nw:.1f},{y_top - neck_h:.1f} L{-nw:.1f},{y_top:.1f} A{r:.1f},{r:.1f} 0 1 0 {x_top:.1f},{y_top:.1f} L{nw:.1f},{y_top - neck_h:.1f}" class="dg-glass" fill="none" stroke-width="2.2"/>')
    out.append(line(-r * 0.75, 0, r * 0.75, 0, "dg-glass", 2.2))
    mark_y = y_top - neck_h * 0.55
    out.append(line(-nw - 4, mark_y, nw + 4, mark_y, "dg-accent", 1.6))
    A.update(neck=(nw, y_top - neck_h * 0.25), mark=(nw + 4, mark_y), bulb=(r, cy))
    A.setdefault("liquid", (0, cy))
    return "".join(out), A, BBox().add_rect(-r, y_top - neck_h, r, 0)


def graduated_cylinder(o):
    w, h = float(o.get("width", 40)), float(o.get("height", 180))
    fill = float(o.get("fill", 0.55))
    L, R = -w / 2, w / 2
    out, A = [], {}
    out.append(f'<path d="M{L - 14:.1f},0 L{R + 14:.1f},0 L{R + 10:.1f},-8 L{L - 10:.1f},-8 Z" class="dg-glass dg-glass-fill" stroke-width="1.8"/>')
    if fill > 0:
        ly = -8 - fill * (h - 18)
        out.append(f'<rect x="{L + 1.5:.1f}" y="{ly:.1f}" width="{w - 3:.1f}" height="{-8 - ly:.1f}" class="{_liq(o.get("liquid"))}"/>')
        out.append(_meniscus(L + 1.5, R - 1.5, ly, 4))
        A["liquid"] = (R - 2, (ly - 8) / 2)
        A["surface"] = (R, ly + 2)
    out.append(f'<path d="M{L - 4:.1f},{-h:.1f} L{L:.1f},{-h + 4:.1f} L{L:.1f},-8 M{R:.1f},-8 L{R:.1f},{-h:.1f}" class="dg-glass" fill="none" stroke-width="2.2"/>')
    for k in range(1, 10):
        y = -8 - k * (h - 18) / 10
        out.append(line(L + 3, y, L + (14 if k % 5 == 0 else 9), y, "dg-glass", 1.1))
    A.update(cylinder=(R, -h * 0.75), base=(R + 14, -4))
    A.setdefault("liquid", (0, -20))
    return "".join(out), A, BBox().add_rect(L - 14, -h, R + 14, 0)


def burette(o, liquid_default="purple"):
    w, h = float(o.get("width", 16)), float(o.get("height", 220))
    fill = float(o.get("fill", 0.7))
    L, R = -w / 2, w / 2
    tube_bottom = -34
    out, A = [], {}
    if fill > 0:
        ly = tube_bottom - fill * (h - 40)
        out.append(f'<rect x="{L + 1.5:.1f}" y="{ly:.1f}" width="{w - 3:.1f}" height="{tube_bottom - ly:.1f}" class="{_liq(o.get("liquid", liquid_default))}"/>')
        out.append(_meniscus(L + 1.5, R - 1.5, ly, 3))
        A["solution"] = (R, (ly + tube_bottom) / 2)
    out.append(f'<path d="M{L:.1f},{-h:.1f} L{L:.1f},{tube_bottom:.1f} L-2.5,-6 L-2.5,0 M{R:.1f},{-h:.1f} L{R:.1f},{tube_bottom:.1f} L2.5,-6 L2.5,0" class="dg-glass" fill="none" stroke-width="2"/>')
    for k in range(1, 12):
        y = tube_bottom - k * (h + tube_bottom) / 12
        out.append(line(L + 2, y, L + (8 if k % 5 == 0 else 5), y, "dg-glass", 1))
    sy = tube_bottom + 12
    out.append(f'<rect x="-14" y="{sy - 3:.1f}" width="28" height="6" rx="3" class="dg-accent-fill"/>')
    out.append(f'<circle cx="0" cy="{sy:.1f}" r="4.5" class="dg-glass dg-glass-fill" stroke-width="1.5"/>')
    A.update(tube=(R, -h * 0.75), stopcock=(14, sy), tip=(2.5, -2), top=(R, -h))
    A.setdefault("solution", (R, -h * 0.5))
    return "".join(out), A, BBox().add_rect(-14, -h, 14, 0)


def titration(o):
    fo = {"fill": o.get("flask_fill", 0.3), "liquid": o.get("flask_liquid", o.get("liquid", "clear")),
          "particles": o.get("particles")}
    bo = {"fill": o.get("burette_fill", 0.7), "liquid": o.get("burette_liquid", "purple"), "height": 210}
    fsvg, fa, fbb = erlenmeyer(fo)
    bsvg, ba, bbb = burette(bo)
    dy = fbb.y0 + 22  # burette tip sits inside the flask mouth
    out = [fsvg, f'<g transform="translate(0,{dy:.1f})">{bsvg}</g>']
    out.append(f'<path d="M0,{dy + 8:.1f} q-3.5,6 0,9 q3.5,-3 0,-9 Z" class="dg-liquid dg-liquid-{bo["liquid"]}"/>')
    # ring stand
    out.append(line(-80, 0, -80, dy - 220, "dg-muted", 3))
    out.append(line(-95, 0, -30, 0, "dg-muted", 4))
    out.append(line(-80, dy - 120, -10, dy - 120, "dg-muted", 2.5))
    A = {
        "burette": (ba["tube"][0], ba["tube"][1] + dy),
        "titrant": (ba["solution"][0], ba["solution"][1] + dy),
        "stopcock": (ba["stopcock"][0], ba["stopcock"][1] + dy),
        "tip": (ba["tip"][0], ba["tip"][1] + dy),
        "drop": (3, dy + 12),
        "flask": fa["wall"], "solution": fa["liquid"], "neck": fa["neck"],
    }
    bb = BBox().merge(fbb).add_rect(-95, dy - 220, 14, 0)
    return "".join(out), A, bb


def coffee_cup(o):
    tw, bw, h = 110.0, 80.0, 120.0
    fill = float(o.get("fill", 0.55))
    out, A = [], {}
    def cup(inset):
        t, b = tw / 2 - inset, bw / 2 - inset
        return f"M{-t:.1f},{-h + inset * 0.3:.1f} L{-b:.1f},{-inset:.1f} L{b:.1f},{-inset:.1f} L{t:.1f},{-h + inset * 0.3:.1f}"
    out.append(f'<path d="{cup(0)} Z" class="dg-foam" stroke-width="2"/>')
    out.append(f'<path d="{cup(9)}" class="dg-foam-inner" fill="none" stroke-width="1.6"/>')
    if fill > 0:
        ly = -9 - fill * (h - 30)
        t = tw / 2 - 9
        b = bw / 2 - 9
        hw = b + (t - b) * ((-ly - 9) / (h - 9 * 1.3))
        out.append(f'<path d="M{-hw:.1f},{ly:.1f} L{-b + 1:.1f},-10 L{b - 1:.1f},-10 L{hw:.1f},{ly:.1f} Z" class="{_liq(o.get("liquid"))}"/>')
        out.append(_meniscus(-hw, hw, ly, 3))
        if o.get("particles"):
            out.append(_particles(o["particles"], -b + 4, ly + 4, b - 4, -12))
        A["liquid"] = (hw - 8, (ly - 10) / 2)
    # lid
    out.append(f'<rect x="{-tw / 2 - 6:.1f}" y="{-h - 10:.1f}" width="{tw + 12:.1f}" height="10" rx="4" class="dg-foam" stroke-width="2"/>')
    # thermometer
    out.append(f'<rect x="12" y="{-h - 75:.1f}" width="8" height="{h + 30:.1f}" rx="4" class="dg-glass dg-glass-fill" stroke-width="1.6"/>')
    out.append(f'<circle cx="16" cy="{-h + 47 + 30:.1f}" r="6" class="dg-thermo"/>')
    out.append(f'<rect x="14.5" y="{-h - 40:.1f}" width="3" height="{h - 14:.1f}" class="dg-thermo"/>')
    # stirrer
    out.append(f'<path d="M-20,{-h - 55:.1f} L-20,-26 M-36,-26 L-4,-26" class="dg-ink" stroke-width="2" fill="none"/>')
    A.update(cup=(tw / 2 - 4, -h * 0.55), inner_cup=(tw / 2 - 12, -h * 0.75), insulation=(tw / 2 - 4, -h * 0.55),
             lid=(tw / 2 + 6, -h - 5), thermometer=(20, -h - 50), stirrer=(-20, -h - 40))
    A.setdefault("liquid", (0, -30))
    return "".join(out), A, BBox().add_rect(-tw / 2 - 6, -h - 75, tw / 2 + 6, 0)


def bomb_calorimeter(o):
    W, H = 180.0, 170.0
    L, R = -W / 2, W / 2
    wall = 14.0
    fill = float(o.get("fill", 0.78))
    out, A = [], {}
    out.append(f'<rect x="{L:.1f}" y="{-H:.1f}" width="{W:.1f}" height="{H:.1f}" rx="6" class="dg-insulation" stroke-width="2"/>')
    iL, iR, iT = L + wall, R - wall, -H + wall
    ly = -wall - fill * (H - 2 * wall)
    out.append(f'<rect x="{iL:.1f}" y="{iT:.1f}" width="{iR - iL:.1f}" height="{H - 2 * wall:.1f}" class="dg-inner-bg" stroke-width="1.6"/>')
    out.append(f'<rect x="{iL:.1f}" y="{ly:.1f}" width="{iR - iL:.1f}" height="{-wall - ly:.1f}" class="{_liq(o.get("liquid", "blue"))}"/>')
    out.append(_meniscus(iL, iR, ly, 2))
    # lid
    out.append(f'<rect x="{L - 6:.1f}" y="{-H - 10:.1f}" width="{W + 12:.1f}" height="12" rx="4" class="dg-insulation" stroke-width="2"/>')
    # bomb
    bw, bh = 62.0, 74.0
    bx, by = -bw / 2 - 8, -wall - 8 - bh
    out.append(f'<rect x="{bx:.1f}" y="{by:.1f}" width="{bw:.1f}" height="{bh:.1f}" rx="10" class="dg-metal" stroke-width="2"/>')
    out.append(f'<rect x="{bx - 4:.1f}" y="{by - 6:.1f}" width="{bw + 8:.1f}" height="10" rx="3" class="dg-metal" stroke-width="2"/>')
    # sample cup + ignition wires
    scx, scy = bx + bw / 2, by + bh - 18
    out.append(f'<path d="M{scx - 12:.1f},{scy - 8:.1f} L{scx - 9:.1f},{scy:.1f} L{scx + 9:.1f},{scy:.1f} L{scx + 12:.1f},{scy - 8:.1f}" class="dg-ink" stroke-width="1.8" fill="none"/>')
    out.append(f'<ellipse cx="{scx:.1f}" cy="{scy - 4:.1f}" rx="7" ry="3" class="dg-c4-fill"/>')
    out.append(f'<path d="M{scx - 6:.1f},{scy - 8:.1f} L{scx - 6:.1f},{-H - 40:.1f} M{scx + 6:.1f},{scy - 8:.1f} L{scx + 6:.1f},{-H - 40:.1f}" class="dg-c2" stroke-width="1.6" fill="none"/>')
    out.append(f'<path d="M{scx - 6:.1f},{scy - 8:.1f} q6,8 12,0" class="dg-c2" stroke-width="1.6" fill="none"/>')
    # thermometer
    tx = R - wall - 26
    out.append(f'<rect x="{tx - 4:.1f}" y="{-H - 60:.1f}" width="8" height="{H + 24:.1f}" rx="4" class="dg-glass dg-glass-fill" stroke-width="1.6"/>')
    out.append(f'<circle cx="{tx:.1f}" cy="{-H - 60 + H + 24 - 4:.1f}" r="6" class="dg-thermo"/>')
    out.append(f'<rect x="{tx - 1.5:.1f}" y="{-H - 30:.1f}" width="3" height="{H - 10:.1f}" class="dg-thermo"/>')
    # stirrer
    sx = L + wall + 16
    out.append(f'<path d="M{sx:.1f},{-H - 50:.1f} L{sx:.1f},{-wall - 14:.1f} M{sx - 10:.1f},{-wall - 14:.1f} L{sx + 10:.1f},{-wall - 14:.1f}" class="dg-ink" stroke-width="2" fill="none"/>')
    A.update(insulation=(R, -H * 0.5), water=(iR - 4, (ly - wall) / 2 + 10), bomb=(bx + bw, by + bh * 0.45),
             sample=(scx + 12, scy - 4), wires=(scx + 6, -H - 25), thermometer=(tx + 4, -H - 45),
             stirrer=(sx, -H - 40), lid=(R + 6, -H - 4), liquid=(iR - 4, (ly - wall) / 2 + 10))
    return "".join(out), A, BBox().add_rect(L - 6, -H - 60, R + 6, 0)


def gas_collection(o):
    out, A = [], {}
    # generator test tube (left)
    tsvg, ta, tbb = test_tube({"fill": o.get("fill", 0.35), "liquid": o.get("liquid", "amber"), "height": 100})
    gx = -150.0
    out.append(f'<g transform="translate({gx:.1f},0)">{tsvg}</g>')
    out.append(f'<rect x="{gx - 15:.1f}" y="-108" width="30" height="14" rx="3" class="dg-stopper"/>')
    # trough (right)
    tL, tR, tH = -10.0, 160.0, 64.0
    wl = -tH * 0.8
    out.append(f'<rect x="{tL:.1f}" y="{wl:.1f}" width="{tR - tL:.1f}" height="{-wl:.1f}" class="dg-liquid dg-liquid-blue"/>')
    out.append(f'<path d="M{tL:.1f},{-tH:.1f} L{tL:.1f},0 L{tR:.1f},0 L{tR:.1f},{-tH:.1f}" class="dg-glass" fill="none" stroke-width="2.2"/>')
    # inverted collection cylinder
    cx, cw, ch = 95.0, 40.0, 150.0
    cL, cR = cx - cw / 2, cx + cw / 2
    cb = -12.0  # mouth (open end) under water
    ct = cb - ch
    gas_level = ct + ch * 0.38
    out.append(f'<rect x="{cL + 1.5:.1f}" y="{gas_level:.1f}" width="{cw - 3:.1f}" height="{cb - gas_level:.1f}" class="dg-liquid dg-liquid-blue"/>')
    out.append(f'<rect x="{cL + 1.5:.1f}" y="{ct + 1.5:.1f}" width="{cw - 3:.1f}" height="{gas_level - ct - 1.5:.1f}" class="dg-gas"/>')
    out.append(f'<path d="M{cL:.1f},{cb:.1f} L{cL:.1f},{ct + 6:.1f} Q{cL:.1f},{ct:.1f} {cL + 6:.1f},{ct:.1f} L{cR - 6:.1f},{ct:.1f} Q{cR:.1f},{ct:.1f} {cR:.1f},{ct + 6:.1f} L{cR:.1f},{cb:.1f}" class="dg-glass" fill="none" stroke-width="2.2"/>')
    # delivery tube: up from stopper, across, down into trough, up into cylinder mouth
    out.append(f'<path d="M{gx:.1f},-108 L{gx:.1f},-140 Q{gx:.1f},-150 {gx + 10:.1f},-150 L{tL + 20:.1f},-150 Q{tL + 30:.1f},-150 {tL + 30:.1f},-140 L{tL + 30:.1f},-6 Q{tL + 30:.1f},2 {tL + 40:.1f},2 L{cx - 6:.1f},2 Q{cx:.1f},2 {cx:.1f},-6 L{cx:.1f},{cb - 6:.1f}" class="dg-tube" fill="none" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>')
    for k, (bx, by, r) in enumerate([(cx - 4, cb - 22, 3.5), (cx + 5, cb - 40, 4.5), (cx - 3, cb - 60, 3)]):
        out.append(f'<circle cx="{bx:.1f}" cy="{by:.1f}" r="{r:.1f}" class="dg-bubble" stroke-width="1.2"/>')
    A.update(generator=(gx + 13, -70), reaction=(gx + 11, -20), tube=(tL + 30, -110), bubbles=(cx + 9, cb - 40),
             cylinder=(cR, ct + ch * 0.6), gas=(cR, (ct + gas_level) / 2), water=(tR, wl / 2), trough=(tR, -tH * 0.2))
    A["liquid"] = A["water"]
    return "".join(out), A, BBox().add_rect(gx - 16, ct, tR, 2)


def scrap_paper(o):
    """Scrap paper folded into a narrow "decode column" (FRQ technique).
    Options: side (right - the default, how we fold it - or left), column (fraction of the
    width, default .36), title (written at the top of the column, default "Decode FRQ";
    use "" for none). Anchors: paper, column, fold, title."""
    w, h = float(o.get("width", 170)), float(o.get("height", 200))
    L, R = -w / 2, w / 2
    col = float(o.get("column", 0.36)) * w
    side = str(o.get("side", "right"))
    if side not in ("left", "right"):
        raise DiagramError("apparatus: scrap-paper side must be `left` or `right`")
    title = str(o.get("title", "Decode FRQ"))
    cx0, cx1 = (R - col, R) if side == "right" else (L, L + col)
    fold_x = cx0 if side == "right" else cx1
    mx0, mx1 = (L + 10, cx0 - 8) if side == "right" else (cx1 + 8, R - 10)
    out = [f'<rect x="{L:.1f}" y="{-h:.1f}" width="{w:.1f}" height="{h:.1f}" rx="3" class="dg-paper" stroke-width="1.8"/>',
           f'<rect x="{cx0:.1f}" y="{-h:.1f}" width="{col:.1f}" height="{h:.1f}" class="dg-accent-wash"/>',
           line(fold_x, -h + 4, fold_x, -4, "dg-accent", 1.8, "6 5")]
    top = -h + 10
    if title:
        size = min(12.0, (col - 10) / max(1.0, text_width(title, 1)))
        out.append(rich(title, (cx0 + cx1) / 2, -h + 8 + size, size, "middle", "dg-text dg-accent-text", weight="700"))
        out.append(line(cx0 + 6, -h + 14 + size, cx1 - 6, -h + 14 + size, "dg-accent", 1.1))
        top = -h + 14 + size
    # writing lines: work area on the open side, short "knowns" lines in the column
    for k in range(1, 10):
        y = -h + k * h / 10
        out.append(line(mx0, y, mx1, y, "dg-muted", 0.8))
        if y > top + 8:
            frac = 0.55 + 0.35 * ((k * 37) % 7) / 6
            out.append(line(cx0 + 8, y, cx0 + 8 + (col - 16) * frac, y, "dg-accent", 0.9))
    open_x = L if side == "right" else R
    A = {"paper": (open_x, -h * 0.5), "column": ((cx0 + cx1) / 2, -h * 0.5),
         "fold": (fold_x, -h * 0.82), "title": ((cx0 + cx1) / 2, -h + 6)}
    return "".join(out), A, BBox().add_rect(L, -h, R, 0)


def rod(o):
    """A metal rod, drawn standing on its bottom end with pencil-style shading.
    Options: width (default 16), height (default 130), hot (heat waves above it).
    To stand it in a container, give both parts an `at:` position. Anchors: rod, top, bottom."""
    w, h = float(o.get("width", 16)), float(o.get("height", 130))
    L, R = -w / 2, w / 2
    out = [f'<rect x="{L:.1f}" y="{-h:.1f}" width="{w:.1f}" height="{h:.1f}" rx="2.5" class="dg-metal" stroke-width="1.8"/>',
           f'<ellipse cx="0" cy="{-h:.1f}" rx="{w / 2:.1f}" ry="{w * 0.18:.1f}" class="dg-metal" stroke-width="1.4"/>']
    y = -h + 10.0
    while y < -4:
        out.append(line(L + 2.5, y + 5, R - 2.5, y, "dg-muted", 1.0))
        y += 8.0
    bb = BBox().add_rect(L, -h - w * 0.2, R, 0)
    if o.get("hot"):
        for k, dx in enumerate((-w * 0.55, 0.0, w * 0.55)):
            x0, y0 = dx, -h - 8 - (k % 2) * 3
            out.append(f'<path d="M{x0:.1f},{y0:.1f} q4,-5 0,-10 q-4,-5 0,-10" class="dg-c2" fill="none" stroke-width="1.6" stroke-linecap="round"/>')
        bb.add_rect(-w, -h - 32, w, 0)
    A = {"rod": (R, -h * 0.55), "top": (0, -h), "bottom": (0, 0)}
    return "".join(out), A, bb


PARTS = {
    "beaker": beaker, "test-tube": test_tube, "erlenmeyer": erlenmeyer,
    "volumetric-flask": volumetric_flask, "graduated-cylinder": graduated_cylinder,
    "burette": burette, "titration": titration, "coffee-cup": coffee_cup,
    "bomb-calorimeter": bomb_calorimeter, "gas-collection": gas_collection,
    "scrap-paper": scrap_paper, "rod": rod,
}


def render(data: dict, **_) -> str:
    if not isinstance(data, dict) or not data.get("parts"):
        raise DiagramError("apparatus: needs a `parts:` list")
    out, anchors = [], {}
    scene = BBox()
    cursor = 0.0
    for i, p in enumerate(as_list(data["parts"])):
        if isinstance(p, str):
            p = {"type": p}
        t = p.get("type")
        if t not in PARTS:
            raise DiagramError(f"apparatus: unknown part type {t!r}. Use one of: {', '.join(PARTS)}")
        svg, A, bb = PARTS[t](p)
        if "at" in p:
            ox, oy = float(p["at"][0]), float(p["at"][1])
        else:
            ox, oy = cursor - bb.x0, 0.0
        cursor = ox + bb.x1 + 60
        out.append(f'<g transform="translate({ox:.1f},{oy:.1f})">{svg}</g>')
        pid = str(p.get("id", t))
        for k, (x, y) in A.items():
            anchors[f"{pid}.{k}"] = (x + ox, y + oy)
        scene.add_rect(bb.x0 + ox, bb.y0 + oy, bb.x1 + ox, bb.y1 + oy)
        if p.get("label"):
            out.append(rich(p["label"], ox + (bb.x0 + bb.x1) / 2, oy + bb.y1 + 22, FONT, "middle", "dg-text"))
            scene.add_text(p["label"], ox + (bb.x0 + bb.x1) / 2, oy + bb.y1 + 22, FONT, "middle")
    single = len(as_list(data["parts"])) == 1
    full = BBox().merge(scene)
    used = {"left": [], "right": [], "top": [], "bottom": []}
    for lab in as_list(data.get("labels")):
        if not isinstance(lab, dict) or "text" not in lab or "to" not in lab:
            raise DiagramError("apparatus: each label needs `text` and `to` (like cup.wall)")
        key = str(lab["to"])
        if key not in anchors and single:
            key = f"{str(as_list(data['parts'])[0].get('id', as_list(data['parts'])[0].get('type')) if isinstance(as_list(data['parts'])[0], dict) else as_list(data['parts'])[0])}.{key}"
        if key not in anchors:
            raise DiagramError(f"apparatus: unknown anchor {lab['to']!r}. Available: {', '.join(sorted(anchors))}")
        ax, ay = anchors[key]
        side = lab.get("side", "right")
        dx, dy = (as_list(lab.get("offset")) + [0, 0])[:2]
        text = str(lab["text"])
        nlines = text.count("\n") + 1
        if side in ("left", "right"):
            ty = ay + float(dy)
            for prev in sorted(used[side]):
                if abs(ty - prev) < 22:
                    ty = prev + 24
            used[side].append(ty)
            if side == "right":
                tx = scene.x1 + 34 + float(dx)
                lx0 = tx - 6
                anc = "start"
            else:
                tx = scene.x0 - 34 + float(dx)
                lx0 = tx + 6
                anc = "end"
            ly0 = ty - 5
            out.append(_leader(lx0, ly0, ax, ay, lab.get("arrow", False)))
            for k, ln in enumerate(text.split("\n")):
                out.append(rich(ln, tx, ty + k * FONT * 1.2, FONT, anc, "dg-text dg-label"))
                full.add_text(ln, tx, ty + k * FONT * 1.2, FONT, anc)
        else:
            tx = ax + float(dx)
            if side == "top":
                ty = scene.y0 - 18 - (nlines - 1) * FONT * 1.2 + float(dy)
                ly0 = ty + 5 + (nlines - 1) * FONT * 1.2
            else:
                ty = scene.y1 + 30 + float(dy)
                ly0 = ty - FONT
            out.append(_leader(tx, ly0, ax, ay, lab.get("arrow", False)))
            for k, ln in enumerate(text.split("\n")):
                out.append(rich(ln, tx, ty + k * FONT * 1.2, FONT, "middle", "dg-text dg-label"))
                full.add_text(ln, tx, ty + k * FONT * 1.2, FONT, "middle")
    svg = svg_wrap("".join(out), full, pad=10, label=data.get("caption") or "lab apparatus")
    return figure(svg, "apparatus", data.get("caption"))


def _leader(x0, y0, x1, y1, with_arrow):
    if with_arrow:
        return arrow(x0, y0, x1, y1, cls="dg-accent", head_cls="dg-accent-fill", width=1.4, size=7)
    return (line(x0, y0, x1, y1, "dg-accent", 1.4) +
            f'<circle cx="{x1:.1f}" cy="{y1:.1f}" r="2.6" class="dg-accent-fill"/>')
