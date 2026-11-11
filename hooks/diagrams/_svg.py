"""Shared helpers for the diagram renderers.

Every diagram is drawn in plain SVG with CSS classes (styled in
docs/assets/css/wiki.css) so it follows light/dark mode automatically:

    .dg-ink      main strokes/text (currentColor)
    .dg-muted    secondary strokes/text
    .dg-glass    glassware outlines
    .dg-accent   purple accent (arrows, highlights)
    .dg-c1..c4   series colors (purple, pink, teal, amber)
    .dg-liquid-* liquid fills (purple, blue, clear, pink, green, amber, gray)

Text in diagrams supports a small "chem markup" (see `rich()`):
    H2O, NO3^-, SO4^{2-}, [N2O4]   → automatic subscripts for formulas
    q_rxn, x_{1}, 10^{-12}          → explicit sub/superscripts
"""
from __future__ import annotations

import html
import math
import re
from typing import Iterable

FONT = 14  # base font size (px) for diagram text


class DiagramError(ValueError):
    """Raised for bad diagram input; shown to the author as a red box."""


def esc(s) -> str:
    return html.escape(str(s), quote=True)


def num(v, default=0.0) -> float:
    try:
        return float(v)
    except (TypeError, ValueError):
        if default is None:
            raise DiagramError(f"Expected a number, got {v!r}")
        return default


# ─── rich text ──────────────────────────────────────────────────────────────
_TOKEN = re.compile(r"(\s+)")
_FORMULA_TOKEN = re.compile(r"^[\[\(]*[0-9]*[A-Z][A-Za-z0-9()\[\]·]*[\]\)]*[,.;:]?$")


def _segments(text: str):
    """Split text into (string, mode) with mode in {'n','sub','sup'}."""
    out: list[tuple[str, str]] = []

    def push(s, mode):
        if not s:
            return
        if out and out[-1][1] == mode:
            out[-1] = (out[-1][0] + s, mode)
        else:
            out.append((s, mode))

    i = 0
    n = len(text)
    while i < n:
        ch = text[i]
        if ch in "_^" and i + 1 < n:
            mode = "sub" if ch == "_" else "sup"
            if text[i + 1] == "{":
                j = text.find("}", i + 2)
                if j == -1:
                    j = n
                push(text[i + 2:j], mode)
                i = j + 1
                continue
            # single "word": letters/digits, or a charge like 2-, +, 3+
            m = re.match(r"[0-9]*[+\-−]|[A-Za-z0-9]+", text[i + 1:])
            if m:
                push(m.group(0).replace("-", "−"), mode)
                i += 1 + len(m.group(0))
                continue
        if ch == "\\" and i + 1 < n and text[i + 1] in "_^{}\\":
            push(text[i + 1], "n")
            i += 2
            continue
        push(ch, "n")
        i += 1
    return out


_CHARGE_TAIL = re.compile(r"^(.*[A-Za-z0-9)\]])([+\-−])([\]),.;:]*)$")


def _auto_chem(seg_text: str) -> list[tuple[str, str]]:
    """In plain text, subscript digits inside formula-looking tokens (H2O → H₂O) and
    superscript a trailing charge sign (H3O+ → H₃O⁺, OH- → OH⁻)."""
    out: list[tuple[str, str]] = []
    for tok in _TOKEN.split(seg_text):
        charge, tail = "", ""
        m = _CHARGE_TAIL.match(tok) if tok else None
        if m and _FORMULA_TOKEN.match(m.group(1) + m.group(3)) and re.search(r"[A-Z]", m.group(1)):
            tok, charge, tail = m.group(1), m.group(2).replace("-", "−"), m.group(3)
        if tok and _FORMULA_TOKEN.match(tok) and (re.search(r"[A-Za-z)\]]\d", tok) or charge):
            # digits right after a letter or ) ] become subscripts
            parts = re.split(r"(?<=[A-Za-z)\]])(\d+)", tok)
            for k, p in enumerate(parts):
                if not p:
                    continue
                out.append((p, "sub" if k % 2 == 1 else "n"))
            if charge:
                out.append((charge, "sup"))
            if tail:
                out.append((tail, "n"))
        else:
            out.append((tok + charge + tail, "n"))
    return out


def segments(text, chem: bool = True):
    segs = []
    for s, mode in _segments(str(text)):
        if mode == "n" and chem:
            segs.extend(_auto_chem(s))
        else:
            segs.append((s, mode))
    return segs


def text_width(text, size: float = FONT, chem: bool = True) -> float:
    w = 0.0
    for s, mode in segments(text, chem):
        f = size * (0.72 if mode != "n" else 1.0)
        for c in s:
            if c in "il.,:;'|!()[]1 ":
                w += f * 0.32
            elif c in "MWmw@%":
                w += f * 0.82
            elif c.isupper() or c in "⇌→←⇨":
                w += f * 0.66
            else:
                w += f * 0.54
    return w


def rich(text, x: float, y: float, size: float = FONT, anchor: str = "start",
         cls: str = "dg-text", chem: bool = True, weight: str | None = None,
         extra: str = "") -> str:
    """Return an SVG <text> element with sub/superscripts as tspans."""
    segs = segments(text, chem)
    parts = []
    offset = 0.0  # current baseline shift in px (positive = down)
    for s, mode in segs:
        target = {"n": 0.0, "sub": size * 0.32, "sup": -size * 0.45}[mode]
        dy = target - offset
        offset = target
        fs = f' font-size="{size * 0.72:.1f}"' if mode != "n" else ""
        dy_attr = f' dy="{dy:.1f}"' if abs(dy) > 0.01 else ""
        # non-breaking spaces: a whitespace-only tspan gets collapsed by the browser and its
        # dy (the baseline reset after a sub/superscript) would be lost
        parts.append(f"<tspan{dy_attr}{fs}>{esc(s).replace(' ', chr(160))}</tspan>")
    w = f' font-weight="{weight}"' if weight else ""
    return (f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size:.1f}" text-anchor="{anchor}"'
            f' class="{cls}"{w}{extra}>{"".join(parts)}</text>')


def multiline(text, x, y, size=FONT, anchor="start", cls="dg-text", chem=True, lh=1.25):
    lines = str(text).split("\n")
    return "".join(rich(line, x, y + i * size * lh, size, anchor, cls, chem) for i, line in enumerate(lines))


# ─── geometry / primitives ─────────────────────────────────────────────────
class BBox:
    def __init__(self):
        self.x0 = self.y0 = math.inf
        self.x1 = self.y1 = -math.inf

    def add(self, x, y):
        self.x0, self.y0 = min(self.x0, x), min(self.y0, y)
        self.x1, self.y1 = max(self.x1, x), max(self.y1, y)
        return self

    def add_rect(self, x0, y0, x1, y1):
        self.add(x0, y0)
        self.add(x1, y1)
        return self

    def add_text(self, text, x, y, size=FONT, anchor="start", chem=True):
        w = text_width(text, size, chem)
        if anchor == "middle":
            x0 = x - w / 2
        elif anchor == "end":
            x0 = x - w
        else:
            x0 = x
        lines = str(text).count("\n") + 1
        self.add_rect(x0, y - size * 0.9, x0 + w, y + size * 0.4 + (lines - 1) * size * 1.25)
        return self

    def merge(self, other: "BBox"):
        if other.x0 != math.inf:
            self.add_rect(other.x0, other.y0, other.x1, other.y1)
        return self

    @property
    def w(self):
        return self.x1 - self.x0

    @property
    def h(self):
        return self.y1 - self.y0

    @property
    def cx(self):
        return (self.x0 + self.x1) / 2

    @property
    def cy(self):
        return (self.y0 + self.y1) / 2

    def empty(self):
        return self.x0 == math.inf


def arrow_head(x, y, angle, size=8, cls="dg-ink-fill"):
    """Filled triangular arrow head with its tip at (x, y), pointing along angle (radians)."""
    a1 = angle + math.radians(155)
    a2 = angle - math.radians(155)
    p1 = (x + size * math.cos(a1), y + size * math.sin(a1))
    p2 = (x + size * math.cos(a2), y + size * math.sin(a2))
    return (f'<path d="M{x:.1f},{y:.1f} L{p1[0]:.1f},{p1[1]:.1f} L{p2[0]:.1f},{p2[1]:.1f} Z"'
            f' class="{cls}"/>')


def line(x1, y1, x2, y2, cls="dg-ink", width=1.6, dash=None, extra=""):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return (f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" class="{cls}"'
            f' stroke-width="{width}"{d}{extra}/>')


def arrow(x1, y1, x2, y2, cls="dg-ink", head_cls="dg-ink-fill", width=1.6, heads="end", size=8, dash=None):
    ang = math.atan2(y2 - y1, x2 - x1)
    # shorten the shaft so it doesn't poke through the head
    sx1, sy1, sx2, sy2 = x1, y1, x2, y2
    if heads in ("end", "both"):
        sx2 -= math.cos(ang) * size * 0.6
        sy2 -= math.sin(ang) * size * 0.6
    if heads in ("start", "both"):
        sx1 += math.cos(ang) * size * 0.6
        sy1 += math.sin(ang) * size * 0.6
    out = [line(sx1, sy1, sx2, sy2, cls, width, dash)]
    if heads in ("end", "both"):
        out.append(arrow_head(x2, y2, ang, size, head_cls))
    if heads in ("start", "both"):
        out.append(arrow_head(x1, y1, ang + math.pi, size, head_cls))
    return "".join(out)


def curved_arrow(x1, y1, x2, y2, bend=-30, cls="dg-accent", head_cls="dg-accent-fill", width=1.7, size=8):
    """Quadratic curved arrow; bend = perpendicular offset of the control point (px)."""
    mx, my = (x1 + x2) / 2, (y1 + y2) / 2
    dx, dy = x2 - x1, y2 - y1
    L = math.hypot(dx, dy) or 1
    nx, ny = -dy / L, dx / L
    cx, cy = mx + nx * bend, my + ny * bend
    ang = math.atan2(y2 - cy, x2 - cx)
    ex, ey = x2 - math.cos(ang) * size * 0.6, y2 - math.sin(ang) * size * 0.6
    path = (f'<path d="M{x1:.1f},{y1:.1f} Q{cx:.1f},{cy:.1f} {ex:.1f},{ey:.1f}" class="{cls}"'
            f' stroke-width="{width}" fill="none"/>')
    # label anchor point: the curve's midpoint (t = .5)
    lx = 0.25 * x1 + 0.5 * cx + 0.25 * x2
    ly = 0.25 * y1 + 0.5 * cy + 0.25 * y2
    return path + arrow_head(x2, y2, ang, size, head_cls), (lx, ly), (cx, cy)


def svg_wrap(body: str, bbox: BBox, pad: float = 12, label: str = "", max_width: float | None = None) -> str:
    x0, y0 = bbox.x0 - pad, bbox.y0 - pad
    w, h = bbox.w + 2 * pad, bbox.h + 2 * pad
    mw = max_width or w
    aria = f' role="img" aria-label="{esc(label)}"' if label else ' aria-hidden="true"'
    return (f'<svg class="dg" viewBox="{x0:.1f} {y0:.1f} {w:.1f} {h:.1f}" width="{w:.0f}"'
            f' style="max-width:min(100%,{mw:.0f}px)" xmlns="http://www.w3.org/2000/svg"{aria}>'
            f"{body}</svg>")


def chem_html(text) -> str:
    """Caption text as HTML with the same chem markup as diagram labels (H2O → H₂O, NH4^+ …)."""
    out = []
    for s, mode in segments(str(text)):
        e = esc(s)
        out.append(f"<sub>{e}</sub>" if mode == "sub" else f"<sup>{e}</sup>" if mode == "sup" else e)
    return "".join(out)


def figure(inner: str, kind: str, caption: str | None = None, extra_class: str = "") -> str:
    cap = f'<figcaption>{chem_html(caption)}</figcaption>' if caption else ""
    cls = f"diagram diagram-{kind} {extra_class}".strip()
    return f'<figure class="{cls}">{inner}{cap}</figure>'


def as_list(v) -> list:
    if v is None:
        return []
    if isinstance(v, (list, tuple)):
        return list(v)
    return [v]


def require(d: dict, key: str, where: str):
    if key not in d:
        raise DiagramError(f"{where}: missing required key `{key}`")
    return d[key]


def monotone_path(points: Iterable[tuple[float, float]]) -> str:
    """Smooth SVG path through points using monotone cubic interpolation
    (no overshoot — good for plateaus and hand-sketch-style curves)."""
    pts = list(points)
    n = len(pts)
    if n == 0:
        return ""
    if n == 1:
        return f"M{pts[0][0]:.1f},{pts[0][1]:.1f}"
    if n == 2:
        return f"M{pts[0][0]:.1f},{pts[0][1]:.1f} L{pts[1][0]:.1f},{pts[1][1]:.1f}"
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    d = []
    m = []
    for i in range(n - 1):
        dx = xs[i + 1] - xs[i]
        d.append((ys[i + 1] - ys[i]) / dx if dx else 0.0)
    m.append(d[0])
    for i in range(1, n - 1):
        if d[i - 1] * d[i] <= 0:
            m.append(0.0)
        else:
            m.append((d[i - 1] + d[i]) / 2)
    m.append(d[-1])
    for i in range(n - 1):
        if d[i] == 0:
            m[i] = m[i + 1] = 0.0
            continue
        a, b = m[i] / d[i], m[i + 1] / d[i]
        s = a * a + b * b
        if s > 9:
            t = 3 / math.sqrt(s)
            m[i], m[i + 1] = t * a * d[i], t * b * d[i]
    out = [f"M{xs[0]:.1f},{ys[0]:.1f}"]
    for i in range(n - 1):
        h = xs[i + 1] - xs[i]
        c1 = (xs[i] + h / 3, ys[i] + m[i] * h / 3)
        c2 = (xs[i + 1] - h / 3, ys[i + 1] - m[i + 1] * h / 3)
        out.append(f"C{c1[0]:.1f},{c1[1]:.1f} {c2[0]:.1f},{c2[1]:.1f} {xs[i + 1]:.1f},{ys[i + 1]:.1f}")
    return " ".join(out)
