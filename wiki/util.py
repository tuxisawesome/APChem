"""Small shared helpers for the wiki generator."""
from __future__ import annotations

import datetime as dt
import html
import posixpath
import re
from functools import lru_cache
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ICONS = Path(__file__).resolve().parent / "icons"


def esc(s) -> str:
    return html.escape(str(s), quote=True)


def slugify(s: str) -> str:
    s = html.unescape(str(s)).lower()
    s = re.sub(r"[₀-₉]", lambda m: str(ord(m.group(0)) - 0x2080), s)
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s or "section"


def parse_pages(spec) -> list[int]:
    """'3', 3, '11-14', '3, 5-6' → [ints]"""
    out = []
    for part in str(spec).replace("–", "-").split(","):
        part = part.strip()
        if not part:
            continue
        if "-" in part:
            a, b = part.split("-", 1)
            out.extend(range(int(a), int(b) + 1))
        else:
            out.append(int(part))
    return out


def fmt_pages(pages: list[int]) -> str:
    """[1,2,3,7] → 'pp. 1–3, 7'"""
    if not pages:
        return ""
    pages = sorted(set(pages))
    runs, start, prev = [], pages[0], pages[0]
    for p in pages[1:] + [None]:
        if p is not None and p == prev + 1:
            prev = p
            continue
        runs.append(f"{start}" if start == prev else f"{start}–{prev}")
        if p is not None:
            start = prev = p
    return f"{'p.' if len(pages) == 1 else 'pp.'} {', '.join(runs)}"


def parse_date(s):
    """'9/22/26' → date(2026, 9, 22); ISO strings also accepted."""
    s = str(s).strip()
    try:
        if "/" in s:
            m, d, y = (int(x) for x in s.split("/"))
            return dt.date(2000 + y if y < 100 else y, m, d)
        return dt.date.fromisoformat(s[:10])
    except Exception:
        return None


def nice_date(iso) -> str:
    d = parse_date(iso)
    return f"{d:%a} {d:%b} {d.day}" if d else str(iso)


def relurl(from_url: str, to_url: str) -> str:
    """Relative URL from the page at `from_url` to `to_url` (both site-root relative,
    directory-style: '' is the home page, 'units/03-equilibrium/' a page dir)."""
    from_dir = from_url if from_url.endswith("/") or from_url == "" else posixpath.dirname(from_url) + "/"
    base = "/" + from_dir
    target = "/" + to_url
    rel = posixpath.relpath(target, base)
    if (to_url == "" or to_url.endswith("/")) and not rel.endswith("/"):
        rel += "/"
    return rel


@lru_cache(maxsize=None)
def _icon_svg(name: str) -> str:
    p = ICONS / f"{name}.svg"
    if not p.exists():
        return ""
    return p.read_text(encoding="utf-8").strip()


def icon(name: str, cls: str = "") -> str:
    """Inline SVG icon from wiki/icons (Material Design Icons). '' if missing."""
    svg = _icon_svg(name)
    if not svg:
        return ""
    c = f'icon icon-{name} {cls}'.strip()
    return svg.replace("<svg ", f'<svg class="{c}" aria-hidden="true" focusable="false" ', 1)


# ─── TeX → plain text (search index + link previews) ────────────────────────
_TEX_SIMPLE = {
    "\\cdot": "·", "\\times": "×", "\\Delta": "Δ", "\\rightleftharpoons": "⇌", "\\rightarrow": "→",
    "\\longrightarrow": "→", "\\Longrightarrow": "⇒", "\\to": "→", "\\leftarrow": "←", "\\therefore": "∴",
    "\\propto": "∝", "\\%": "%", "\\#": "#", "\\Sigma": "Σ", "\\sum": "Σ", "\\checkmark": "✓",
    "\\geq": "≥", "\\leq": "≤", "\\neq": "≠", "\\approx": "≈", "\\circ": "°", "\\degree": "°",
    "\\\\": " ", "\\,": " ", "\\;": " ", "\\quad": " ", "\\qquad": " ", "\\ ": " ", "\\left": "", "\\right": "",
}


def _tex_math_to_plain(t: str) -> str:
    t = re.sub(r"\\ce\{((?:[^{}]|\{[^{}]*\})*)\}", r"\1", t)
    t = re.sub(r"\\(?:text|mathrm|mathbf|textbf|operatorname|boxed|cancel|underbrace)\{([^{}]*)\}", r"\1", t)
    t = re.sub(r"\\d?frac\{([^{}]*)\}\{([^{}]*)\}", r"(\1)/(\2)", t)
    for k in sorted(_TEX_SIMPLE, key=len, reverse=True):
        t = t.replace(k, _TEX_SIMPLE[k])
    t = re.sub(r"\\[a-zA-Z]+", "", t)
    t = t.replace("{", "").replace("}", "").replace("_", "").replace("&", "")
    t = re.sub(r"\^(?=\S)", "", t)
    for a, b in (("&lt;=&gt;", "⇌"), ("<=>", "⇌"), ("-&gt;", "→"), ("->", "→"), ("&lt;-", "←")):
        t = t.replace(a, b)
    return re.sub(r"\s{2,}", " ", t).strip()


def tex_to_plain(s: str) -> str:
    s = re.sub(r"\\\((.*?)\\\)", lambda m: _tex_math_to_plain(m.group(1)), s, flags=re.S)
    s = re.sub(r"\\\[(.*?)\\\]", lambda m: _tex_math_to_plain(m.group(1)), s, flags=re.S)
    return s


def html_to_text(h: str) -> str:
    """Rough HTML → text (drops SVG/scripts), with TeX simplified."""
    h = re.sub(r"<(script|style|svg)\b.*?</\1>", " ", h, flags=re.S | re.I)
    h = re.sub(r'<a [^>]*class="headerlink"[^>]*>.*?</a>', " ", h, flags=re.S)
    h = re.sub(r"<[^>]+>", " ", h)
    h = html.unescape(h)
    return re.sub(r"\s+", " ", tex_to_plain(h)).strip()
