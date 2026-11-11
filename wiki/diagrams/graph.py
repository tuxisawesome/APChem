"""Sketch-style graphs (concentration vs time, rate vs time, titration curves …).

```graph
size: [300, 200]                 # plot area in px (optional, default 300×200)
x: {label: t}                    # optional: min, max (auto from data otherwise)
y: {label: Concentration, min: 0, max: 1}
axes: plain                      # plain (default) | arrows | box | none
curves:
  - points: [[0, .95], [2, .55], [5, .38], [10, .36]]   # smoothed through these
    label: "[N2O4]"              # label text (chem markup ok)
    label_at: start              # start | end (default) | none | [x, y]
    color: 1                     # 1 purple · 2 pink · 3 teal · 4 amber · ink
    style: solid                 # solid | dashed | dotted
    smooth: true                 # false = straight segments
annotations:
  - span: {x: 8.5, from: .36, to: .6}       # vertical ↕ arrow between two y values
    text: Equilibrium
  - callout: {at: [9.2, .75], to: [8, .5]}   # text at `at`, leader line pointing to `to`
    text: "equilibrium\\nrate is equal"
  - arrow: {from: [1, .9], to: [3, .7]}      # optional heads: end | both
    text: optional
  - text: Some label
    at: [5, .9]                  # optional anchor: start | middle | end
  - hline: .5                    # dashed reference lines (vline: x)
    text: optional
  - point: [5, .38]
    text: optional
caption: optional
```
"""
from __future__ import annotations

from ._svg import (FONT, BBox, DiagramError, arrow, as_list, figure, line, monotone_path,
                   num, rich, svg_wrap)

COLORS = {"1": "dg-c1", "2": "dg-c2", "3": "dg-c3", "4": "dg-c4", "ink": "dg-ink",
          "purple": "dg-c1", "pink": "dg-c2", "teal": "dg-c3", "amber": "dg-c4"}
DASH = {"solid": None, "dashed": "7 5", "dotted": "2 4"}


def _pt(p, where):
    try:
        return float(p[0]), float(p[1])
    except Exception:
        raise DiagramError(f"graph: {where} should be a point like [x, y], got {p!r}")


def render(data: dict, **_) -> str:
    if not isinstance(data, dict):
        raise DiagramError("graph: expected a mapping with `curves`")
    W, H = (as_list(data.get("size")) + [300, 200])[:2] if data.get("size") else (300, 200)
    W, H = float(W), float(H)
    xa = data.get("x") or {}
    ya = data.get("y") or {}
    curves = as_list(data.get("curves"))
    anns = as_list(data.get("annotations"))

    allx, ally = [], []
    for i, c in enumerate(curves):
        if not isinstance(c, dict) or "points" not in c:
            raise DiagramError(f"graph: curve {i + 1} needs `points`")
        for p in c["points"]:
            x, y = _pt(p, f"curve {i + 1} point")
            allx.append(x)
            ally.append(y)
    if not allx:
        allx, ally = [0, 1], [0, 1]
    xmin = num(xa.get("min"), min(allx))
    xmax = num(xa.get("max"), max(allx))
    ymin = num(ya.get("min"), min(0, min(ally)))
    ymax = num(ya.get("max"), max(ally) * 1.08 if max(ally) > 0 else 1)
    if xmax == xmin:
        xmax += 1
    if ymax == ymin:
        ymax += 1

    def sx(x):
        return (x - xmin) / (xmax - xmin) * W

    def sy(y):
        return H - (y - ymin) / (ymax - ymin) * H

    out = []
    bb = BBox().add_rect(0, 0, W, H)

    # axes
    axes = data.get("axes", "plain")
    if axes in ("plain", "arrows"):
        if axes == "arrows":
            out.append(arrow(0, H, 0, -8, cls="dg-ink", head_cls="dg-ink-fill", width=1.8, size=7))
            out.append(arrow(0, H, W + 8, H, cls="dg-ink", head_cls="dg-ink-fill", width=1.8, size=7))
            bb.add(W + 8, -8)
        else:
            out.append(f'<path d="M0,0 L0,{H:.1f} L{W:.1f},{H:.1f}" class="dg-ink" stroke-width="1.8" fill="none"/>')
    elif axes == "box":
        out.append(f'<rect x="0" y="0" width="{W:.1f}" height="{H:.1f}" class="dg-ink" stroke-width="1.4" fill="none"/>')

    # axis labels
    if xa.get("label"):
        out.append(rich(xa["label"], W / 2, H + 26, FONT, "middle", "dg-text dg-axis-label"))
        bb.add_text(xa["label"], W / 2, H + 26, FONT, "middle")
    if ya.get("label"):
        lab = str(ya["label"])
        out.append(rich(lab, 0, 0, FONT, "middle", "dg-text dg-axis-label",
                        extra=f' transform="translate({-30:.1f},{H / 2:.1f}) rotate(-90)"'))
        bb.add(-30 - FONT, H / 2)
    for key, axis, is_x in (("ticks", xa, True), ("ticks", ya, False)):
        for t in as_list(axis.get(key)):
            v, lab = (t if isinstance(t, (list, tuple)) else (t, t))
            v = float(v)
            if is_x:
                out.append(line(sx(v), H, sx(v), H + 5, "dg-ink", 1.2))
                out.append(rich(lab, sx(v), H + 18, FONT * 0.8, "middle", "dg-text dg-muted-text"))
            else:
                out.append(line(-5, sy(v), 0, sy(v), "dg-ink", 1.2))
                out.append(rich(lab, -8, sy(v) + 4, FONT * 0.8, "end", "dg-text dg-muted-text"))
                bb.add_text(lab, -8, sy(v) + 4, FONT * 0.8, "end")

    # curves
    for i, c in enumerate(curves):
        pts = sorted((_pt(p, "point") for p in c["points"]), key=lambda p: p[0])
        spts = [(sx(x), sy(y)) for x, y in pts]
        cls = COLORS.get(str(c.get("color", (i % 4) + 1)), "dg-c1")
        dash = DASH.get(c.get("style", "solid"))
        dash_attr = f' stroke-dasharray="{dash}"' if dash else ""
        if c.get("smooth", True):
            d = monotone_path(spts)
        else:
            d = "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in spts)
        out.append(f'<path d="{d}" class="{cls}" stroke-width="2.4" fill="none" stroke-linecap="round"{dash_attr}/>')
        for x, y in spts:
            bb.add(x, y)
        lab = c.get("label")
        where = c.get("label_at", "end")
        if lab and where != "none":
            if where == "start":
                x, y = spts[0]
                tx, ty, anc = -8, y + 5, "end"
                if abs(x) > 1:  # curve doesn't start on the y axis
                    tx, ty, anc = x - 6, y - 8, "end"
            elif where == "end":
                x, y = spts[-1]
                tx, ty, anc = x + 8, y + 5, "start"
            else:
                px, py = _pt(where, "label_at")
                tx, ty, anc = sx(px), sy(py), "middle"
            out.append(rich(lab, tx, ty, FONT, anc, f"dg-text {cls}-text"))
            bb.add_text(lab, tx, ty, FONT, anc)

    # annotations
    for a in anns:
        if not isinstance(a, dict):
            raise DiagramError(f"graph: annotation {a!r} should be a mapping")
        text = a.get("text")
        if "span" in a:
            s = a["span"]
            x = sx(num(s.get("x"), None))
            y1, y2 = sy(num(s.get("from"), None)), sy(num(s.get("to"), None))
            out.append(arrow(x, y1, x, y2, cls="dg-accent", head_cls="dg-accent-fill", heads="both", size=7, width=1.8))
            if text:
                out.append(rich(text, x + 8, (y1 + y2) / 2 + 5, FONT, "start", "dg-text dg-accent-text"))
                bb.add_text(text, x + 8, (y1 + y2) / 2 + 5)
        elif "callout" in a:
            c = a["callout"]
            ax, ay = _pt(c.get("at"), "callout.at")
            tx_, ty_ = _pt(c.get("to"), "callout.to")
            X, Y, TX, TY = sx(ax), sy(ay), sx(tx_), sy(ty_)
            lines = str(text or "").split("\n")
            out.append(arrow(X - 2, Y + 4 + (len(lines) - 1) * 17, TX, TY, cls="dg-accent", head_cls="dg-accent-fill", size=6, width=1.4))
            for k, ln in enumerate(lines):
                out.append(rich(ln, X, Y + k * 17, FONT, "start", "dg-text dg-accent-text"))
                bb.add_text(ln, X, Y + k * 17)
        elif "arrow" in a:
            ar = a["arrow"]
            fx, fy = _pt(ar.get("from"), "arrow.from")
            tx_, ty_ = _pt(ar.get("to"), "arrow.to")
            out.append(arrow(sx(fx), sy(fy), sx(tx_), sy(ty_), cls="dg-accent", head_cls="dg-accent-fill",
                             heads=ar.get("heads", "end"), size=7, width=1.6))
            bb.add(sx(fx), sy(fy)).add(sx(tx_), sy(ty_))
            if text:
                out.append(rich(text, sx(fx), sy(fy) - 6, FONT, "middle", "dg-text dg-accent-text"))
                bb.add_text(text, sx(fx), sy(fy) - 6, FONT, "middle")
        elif "segment" in a:
            sg = a["segment"]
            fx, fy = _pt(sg.get("from"), "segment.from")
            tx_, ty_ = _pt(sg.get("to"), "segment.to")
            out.append(line(sx(fx), sy(fy), sx(tx_), sy(ty_), "dg-muted", 1.3,
                            "5 4" if a.get("dashed", True) else None))
            bb.add(sx(fx), sy(fy)).add(sx(tx_), sy(ty_))
        elif "hline" in a or "vline" in a:
            if "hline" in a:
                y = sy(num(a["hline"], None))
                out.append(line(0, y, W, y, "dg-muted", 1.3, "5 4"))
                if text:
                    out.append(rich(text, W + 6, y + 5, FONT * 0.9, "start", "dg-text dg-muted-text"))
                    bb.add_text(text, W + 6, y + 5, FONT * 0.9)
            else:
                x = sx(num(a["vline"], None))
                out.append(line(x, 0, x, H, "dg-muted", 1.3, "5 4"))
                if text:
                    out.append(rich(text, x, -8, FONT * 0.9, "middle", "dg-text dg-muted-text"))
                    bb.add_text(text, x, -8, FONT * 0.9, "middle")
        elif "point" in a:
            px, py = _pt(a["point"], "point")
            X, Y = sx(px), sy(py)
            out.append(f'<circle cx="{X:.1f}" cy="{Y:.1f}" r="4" class="dg-accent-fill"/>')
            if text:
                out.append(rich(text, X + 8, Y - 8, FONT, "start", "dg-text"))
                bb.add_text(text, X + 8, Y - 8)
        elif "text" in a:
            px, py = _pt(a.get("at"), "text.at")
            anc = a.get("anchor", "middle")
            out.append(rich(text, sx(px), sy(py), FONT, anc, "dg-text"))
            bb.add_text(text, sx(px), sy(py), FONT, anc)
        else:
            raise DiagramError(f"graph: unknown annotation {a!r}")

    svg = svg_wrap("".join(out), bb, pad=12, label=data.get("caption") or ya.get("label", "graph"))
    return figure(svg, "graph", data.get("caption"))
