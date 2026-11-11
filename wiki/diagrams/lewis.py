"""Lewis / structural formulas and little reaction schemes with electron-flow arrows.

```lewis
items:                                   # one row; use `rows: [[...], [...]]` for several rows
  - id: nh3
    molecule:
      atoms:                             # grid units (1 = one bond length), y grows downward
        N:  {at: [0, 0], lone: [n]}      # lone pairs: n s e w ne nw se sw
        H1: {at: [-1, 0]}                # element = the id minus trailing digits (H1 → H), or set el:
        H2: {at: [0, 1]}
        H3: {at: [-0.7, -0.7]}
      bonds: [[N, H1], [N, H2], [N, H3]] # [a, b] single · [a, b, 2] double · [a, b, 3] triple
    brace: "Donates e⁻ pair: Base"       # curly brace + text under this item (or `label:` for plain text)
  - op: "+"                              # + · -> · <=> · => (hollow ⇨) ; optional above:/below: text
  - id: bh3
    molecule:
      atoms:
        B: {at: [0, 0]}
        Ha: {el: H, at: [0, -1]}
        Hb: {el: H, at: [1, 0]}
        Hc: {el: H, at: [0, 1]}
      bonds: [[B, Ha], [B, Hb], [B, Hc]]
    brace: "Accepts e⁻ pair: Acid"
  - text: "H+"                           # plain formula item (chem markup)
arrows:                                  # curved arrows: from/to = item (= item.top), item.bottom, item.ATOM, item.ATOM.lone.n
  - {from: nh3.N.lone.n, to: bh3.B, label: Docks, bend: -40}
braces:                                  # a brace spanning several items
  - {from: hcl, to: naoh, text: Main acid/base}
caption: optional
```
More atom options: `charge: "-"`, `circle: [n]` (circle that lone pair), `dots: [e]` (single electrons).
Molecule options: `bracket: true` + `charge: "+"` (bracketed ion), `scale: 0.9`.
Bond options as a mapping: `{from: N, to: B, order: 1, style: dative|dashed}`.
"""
from __future__ import annotations

import math
import re

from ._svg import (FONT, BBox, DiagramError, arrow, as_list, curved_arrow, esc, figure, line,
                   rich, svg_wrap, text_width)

UNIT = 40.0
DIRS = {"n": (0, -1), "s": (0, 1), "e": (1, 0), "w": (-1, 0),
        "ne": (0.72, -0.72), "nw": (-0.72, -0.72), "se": (0.72, 0.72), "sw": (-0.72, 0.72)}
ASIZE = 16.0  # atom font size


def _el(aid, spec):
    return str(spec.get("el") or re.sub(r"\d+$", "", aid) or aid) if isinstance(spec, dict) else str(spec)


def _radius(label, dx, dy):
    rx = text_width(label, ASIZE) / 2 + 3
    ry = 10.0
    if dx == 0 and dy == 0:
        return 0
    c, s = dx / math.hypot(dx, dy), dy / math.hypot(dx, dy)
    return 1 / math.sqrt((c / rx) ** 2 + (s / ry) ** 2)


class Molecule:
    def __init__(self, spec: dict, where: str):
        if not isinstance(spec, dict) or "atoms" not in spec:
            raise DiagramError(f"lewis: {where} molecule needs `atoms`")
        self.scale = float(spec.get("scale", 1))
        self.atoms = {}
        for aid, a in spec["atoms"].items():
            a = a if isinstance(a, dict) else {"at": a}
            if "at" not in a:
                raise DiagramError(f"lewis: atom {aid} needs `at: [x, y]`")
            x, y = float(a["at"][0]) * UNIT * self.scale, float(a["at"][1]) * UNIT * self.scale
            self.atoms[str(aid)] = {"x": x, "y": y, "label": _el(str(aid), a), **a}
        self.bonds = []
        for b in as_list(spec.get("bonds")):
            if isinstance(b, dict):
                a1, a2, order, style = b.get("from"), b.get("to"), b.get("order", 1), b.get("style")
            else:
                b = list(b)
                a1, a2 = b[0], b[1]
                order = b[2] if len(b) > 2 else 1
                style = None
                if order in ("dative", "dashed"):
                    style, order = order, 1
            for x in (a1, a2):
                if str(x) not in self.atoms:
                    raise DiagramError(f"lewis: bond refers to unknown atom {x!r}")
            self.bonds.append((str(a1), str(a2), int(order), style))
        self.bracket = bool(spec.get("bracket"))
        self.charge = spec.get("charge")
        self._layout()

    def _lone_pos(self, a, d):
        dx, dy = DIRS[d]
        r = _radius(a["label"], dx, dy) + 5
        return a["x"] + dx * r, a["y"] + dy * r

    def _layout(self):
        bb = BBox()
        for a in self.atoms.values():
            bb.add_text(a["label"], a["x"], a["y"] + 6, ASIZE, "middle")
            for d in as_list(a.get("lone")) + as_list(a.get("dots")):
                if d not in DIRS:
                    raise DiagramError(f"lewis: lone pair direction {d!r} — use n s e w ne nw se sw")
                x, y = self._lone_pos(a, d)
                bb.add_rect(x - 5, y - 5, x + 5, y + 5)
        if self.bracket:
            bb = BBox().add_rect(bb.x0 - 8, bb.y0 - 6, bb.x1 + 8, bb.y1 + 6)
            if self.charge:
                bb.add_text(str(self.charge), bb.x1 + 2, bb.y0 + 6, FONT)
        self.bbox = bb

    def draw(self, ox, oy):
        out = []
        P = lambda a: (a["x"] + ox, a["y"] + oy)
        for a1, a2, order, style in self.bonds:
            A, B = self.atoms[a1], self.atoms[a2]
            (x1, y1), (x2, y2) = P(A), P(B)
            dx, dy = x2 - x1, y2 - y1
            L = math.hypot(dx, dy) or 1
            ux, uy = dx / L, dy / L
            r1 = _radius(A["label"], dx, dy) + 1
            r2 = _radius(B["label"], dx, dy) + 1
            sx1, sy1 = x1 + ux * r1, y1 + uy * r1
            sx2, sy2 = x2 - ux * r2, y2 - uy * r2
            if style == "dative":
                out.append(arrow(sx1, sy1, sx2, sy2, "dg-ink", "dg-ink-fill", 1.8, size=7))
                continue
            offs = {1: [0], 2: [-2.6, 2.6], 3: [-4, 0, 4]}.get(order, [0])
            for o in offs:
                nx, ny = -uy * o, ux * o
                out.append(line(sx1 + nx, sy1 + ny, sx2 + nx, sy2 + ny, "dg-ink", 1.8,
                                "4 3" if style == "dashed" else None))
        for aid, a in self.atoms.items():
            x, y = P(a)
            out.append(rich(a["label"], x, y + 6, ASIZE, "middle", "dg-text dg-atom"))
            if a.get("charge"):
                w = text_width(a["label"], ASIZE) / 2
                out.append(rich(str(a["charge"]).replace("-", "−"), x + w + 1, y - 6, 12, "start", "dg-text"))
            circled = set(as_list(a.get("circle")))
            for d in as_list(a.get("lone")):
                lx, ly = self._lone_pos(a, d)
                lx, ly = lx + ox, ly + oy
                ddx, ddy = DIRS[d]
                px, py = -ddy * 3.2, ddx * 3.2
                out.append(f'<circle cx="{lx + px:.1f}" cy="{ly + py:.1f}" r="2.1" class="dg-ink-fill"/>'
                           f'<circle cx="{lx - px:.1f}" cy="{ly - py:.1f}" r="2.1" class="dg-ink-fill"/>')
                if d in circled:
                    out.append(f'<circle cx="{lx:.1f}" cy="{ly:.1f}" r="7.5" class="dg-accent" fill="none" stroke-width="1.6"/>')
            for d in as_list(a.get("dots")):
                lx, ly = self._lone_pos(a, d)
                out.append(f'<circle cx="{lx + ox:.1f}" cy="{ly + oy:.1f}" r="2.1" class="dg-ink-fill"/>')
        if self.bracket:
            b = self.bbox
            x0, y0, x1, y1 = b.x0 + ox, b.y0 + oy, b.x1 + ox, b.y1 + oy
            if self.charge:
                x1 -= text_width(str(self.charge), FONT) + 2
            out.append(f'<path d="M{x0 + 6:.1f},{y0:.1f} L{x0:.1f},{y0:.1f} L{x0:.1f},{y1:.1f} L{x0 + 6:.1f},{y1:.1f}'
                       f' M{x1 - 6:.1f},{y0:.1f} L{x1:.1f},{y0:.1f} L{x1:.1f},{y1:.1f} L{x1 - 6:.1f},{y1:.1f}" class="dg-ink" stroke-width="1.6" fill="none"/>')
            if self.charge:
                out.append(rich(str(self.charge).replace("-", "−"), x1 + 2, y0 + 8, FONT, "start", "dg-text"))
        return "".join(out)

    def point(self, ref: list[str], ox, oy, where):
        aid = ref[0]
        if aid not in self.atoms:
            raise DiagramError(f"lewis: {where}: no atom {aid!r} (atoms: {', '.join(self.atoms)})")
        a = self.atoms[aid]
        if len(ref) >= 3 and ref[1] == "lone":
            x, y = self._lone_pos(a, ref[2])
            return x + ox, y + oy, 0
        return a["x"] + ox, a["y"] + oy, _radius(a["label"], 1, 0) + 4


def _op(kind, x, y, above=None, below=None):
    """Draw an operator centered vertically at y starting at x; return (svg, width)."""
    k = str(kind)
    out = []
    if k == "+":
        out.append(rich("+", x + 9, y + 7, 20, "middle", "dg-text"))
        w = 18
    elif k in ("->", "→"):
        w = 44
        out.append(arrow(x + 2, y, x + w - 2, y, "dg-ink", "dg-ink-fill", 1.8, size=8))
    elif k in ("<=>", "⇌"):
        w = 44
        out.append(f'<path d="M{x + 2:.1f},{y - 3:.1f} L{x + w - 2:.1f},{y - 3:.1f} l-8,-6" class="dg-ink" stroke-width="1.8" fill="none"/>'
                   f'<path d="M{x + w - 2:.1f},{y + 3:.1f} L{x + 2:.1f},{y + 3:.1f} l8,6" class="dg-ink" stroke-width="1.8" fill="none"/>')
    elif k in ("=>", "⇨"):
        w = 50
        out.append(f'<path d="M{x + 2:.1f},{y - 5:.1f} L{x + 32:.1f},{y - 5:.1f} L{x + 32:.1f},{y - 12:.1f} L{x + 48:.1f},{y:.1f}'
                   f' L{x + 32:.1f},{y + 12:.1f} L{x + 32:.1f},{y + 5:.1f} L{x + 2:.1f},{y + 5:.1f} Z" class="dg-accent" fill="none" stroke-width="1.8" stroke-linejoin="round"/>')
    else:
        out.append(rich(k, x + 2, y + 6, 18, "start", "dg-text"))
        w = text_width(k, 18) + 4
    bb = BBox().add_rect(x, y - 12, x + w, y + 12)
    if above:
        out.append(rich(above, x + w / 2, y - 12, 12, "middle", "dg-text dg-accent-text"))
        bb.add_text(above, x + w / 2, y - 12, 12, "middle")
    if below:
        out.append(rich(below, x + w / 2, y + 24, 12, "middle", "dg-text dg-muted-text"))
        bb.add_text(below, x + w / 2, y + 24, 12, "middle")
    return "".join(out), w, bb


def _brace(x0, x1, y, text):
    """Horizontal curly brace (opening downward) from x0 to x1 at y, with text below."""
    m = (x0 + x1) / 2
    h = 7
    d = (f"M{x0:.1f},{y:.1f} Q{x0:.1f},{y + h:.1f} {x0 + h:.1f},{y + h:.1f} L{m - h:.1f},{y + h:.1f}"
         f" Q{m:.1f},{y + h:.1f} {m:.1f},{y + 2 * h:.1f} Q{m:.1f},{y + h:.1f} {m + h:.1f},{y + h:.1f}"
         f" L{x1 - h:.1f},{y + h:.1f} Q{x1:.1f},{y + h:.1f} {x1:.1f},{y:.1f}")
    out = f'<path d="{d}" class="dg-accent" fill="none" stroke-width="1.5"/>'
    bb = BBox().add_rect(x0, y, x1, y + 2 * h)
    for k, ln in enumerate(str(text).split("\n")):
        ty = y + 2 * h + 16 + k * 15
        out += rich(ln, m, ty, 13, "middle", "dg-text dg-label")
        bb.add_text(ln, m, ty, 13, "middle")
    return out, bb


def render(data: dict, **_) -> str:
    if not isinstance(data, dict):
        raise DiagramError("lewis: expected `items:` or `rows:`")
    rows = data.get("rows") or ([data["items"]] if "items" in data else None)
    if not rows:
        raise DiagramError("lewis: needs `items:` (one row) or `rows:` (list of rows)")
    out = []
    full = BBox()
    placed = {}  # id → dict(kind, obj, ox, oy, bbox)
    row_y = 0.0
    built_rows = []
    for ri, row in enumerate(rows):
        x = 0.0
        row_items = []
        for ii, it in enumerate(as_list(row)):
            if isinstance(it, str):
                it = {"op": it} if it in ("+", "->", "<=>", "=>", "→", "⇌", "⇨") else {"text": it}
            where = f"row {ri + 1} item {ii + 1}"
            if "molecule" in it:
                mol = Molecule(it["molecule"], where)
                bb = mol.bbox
                ox = x - bb.x0
                row_items.append(("mol", it, mol, ox, bb))
                x = ox + bb.x1 + 18
            elif "text" in it:
                size = float(it.get("size", 18))
                w = text_width(it["text"], size)
                bb = BBox().add_rect(0, -size * 0.75, w, size * 0.35)
                row_items.append(("text", it, None, x, bb))
                x += w + 18
            elif "op" in it:
                svg, w, bb = _op(it["op"], 0, 0, it.get("above"), it.get("below"))
                row_items.append(("op", it, None, x, bb))
                x += w + 16
            else:
                raise DiagramError(f"lewis: {where}: use `molecule:`, `text:` or `op:`")
        built_rows.append((row_items, x - 18))
    width = max(w for _, w in built_rows) if built_rows else 0
    for row_items, w in built_rows:
        shift = (width - w) / 2
        top = min((bb.y0 - (bb.cy if kind == "mol" else 0)) for kind, _, _, _, bb in row_items)
        oy_row = row_y - top
        row_bb = BBox()
        for kind, it, obj, ox, bb in row_items:
            ox += shift
            if kind == "mol":
                oy = oy_row - bb.cy
                out.append(obj.draw(ox, oy))
                ib = BBox().add_rect(bb.x0 + ox, bb.y0 + oy, bb.x1 + ox, bb.y1 + oy)
            elif kind == "text":
                size = float(it.get("size", 18))
                out.append(rich(it["text"], ox, oy_row + size * 0.35, size, "start", "dg-text dg-atom"))
                ib = BBox().add_rect(ox, oy_row - size * 0.6, ox + bb.w, oy_row + size * 0.45)
                oy = oy_row
            else:
                svg, _w, obb = _op(it["op"], ox, oy_row, it.get("above"), it.get("below"))
                out.append(svg)
                ib = obb
                oy = oy_row
            row_bb.merge(ib)
            if it.get("id"):
                placed[str(it["id"])] = {"kind": kind, "obj": obj, "ox": ox, "oy": oy, "bb": ib}
            # under-label or brace
            under = BBox().merge(ib)
            if it.get("brace"):
                svg, bbb = _brace(ib.x0, ib.x1, ib.y1 + 6, it["brace"])
                out.append(svg)
                row_bb.merge(bbb)
                under.merge(bbb)
            elif it.get("label"):
                lines = str(it["label"]).split("\n")
                for k, ln in enumerate(lines):
                    ty = ib.y1 + 18 + k * 15
                    out.append(rich(ln, ib.cx, ty, 13, "middle", "dg-text dg-muted-text"))
                    row_bb.add_text(ln, ib.cx, ty, 13, "middle")
                    under.add_text(ln, ib.cx, ty, 13, "middle")
            if it.get("id"):
                placed[str(it["id"])]["under"] = under  # item + its label/brace (for .bottom arrows)
        full.merge(row_bb)
        row_y = row_bb.y1 + 34

    def resolve(ref, where):
        parts = str(ref).split(".")
        if parts[0] not in placed:
            raise DiagramError(f"lewis: {where}: unknown id {parts[0]!r} (ids: {', '.join(placed) or 'none — add id: to items'})")
        p = placed[parts[0]]
        if len(parts) == 1 or parts[1] in ("top", "bottom"):
            b = p["bb"]
            if len(parts) > 1 and parts[1] == "bottom":
                u = p.get("under", b)
                return b.cx, u.y1 + 3, 0
            return b.cx, b.y0 - 2, 0
        if p["kind"] != "mol":
            raise DiagramError(f"lewis: {where}: {parts[0]!r} is not a molecule")
        return p["obj"].point(parts[1:], p["ox"], p["oy"], where)

    for k, br in enumerate(as_list(data.get("braces"))):
        a = placed.get(str(br.get("from")))
        b = placed.get(str(br.get("to")))
        if not a or not b:
            raise DiagramError(f"lewis: brace {k + 1}: unknown from/to id")
        y = max(a["bb"].y1, b["bb"].y1) + 6
        svg, bbb = _brace(min(a["bb"].x0, b["bb"].x0), max(a["bb"].x1, b["bb"].x1), y, br.get("text", ""))
        out.append(svg)
        full.merge(bbb)

    for k, ar in enumerate(as_list(data.get("arrows"))):
        where = f"arrow {k + 1}"
        x1, y1, _ = resolve(ar.get("from"), where)
        x2, y2, r2 = resolve(ar.get("to"), where)
        if r2:
            ang = math.atan2(y2 - y1, x2 - x1)
            x2 -= math.cos(ang) * r2
            y2 -= math.sin(ang) * r2
        bend = float(ar.get("bend", -36))
        svg, (lx, ly), (cx, cy) = curved_arrow(x1, y1, x2, y2, bend)
        out.append(svg)
        full.add(cx, cy).add(x1, y1).add(x2, y2)
        if ar.get("label"):
            ty = ly - 8 if bend < 0 else ly + 18
            out.append(rich(ar["label"], lx, ty, 13, "middle", "dg-text dg-accent-text", weight="600"))
            full.add_text(ar["label"], lx, ty, 13, "middle")

    svg = svg_wrap("".join(out), full, pad=12, label=data.get("caption") or "structure diagram")
    return figure(svg, "lewis", data.get("caption"))
