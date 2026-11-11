"""RICE tables (Reaction / Initial / Change / Equilibrium) — the way my notes lay them out.

```rice
R: "1PCl5 <=> 1PCl3 + Cl2"          # reaction; split on " + " and the arrow
I: [0.149M, 0.002175M, 0M]          # one value per species ("" = blank cell)
C: [-xM, +xM, +xM]
E: [0.148M, 0.003175M, 0.001M]
labels:                             # optional row labels (first letter is drawn big)
  I: "Initial [ ] (M)(P)"
  C: "Change (x)"
  E: "Equilibrium [ ] (M)(P)"
style: grid                         # grid (ruled table, default) | compact (R/I/C/E list with | bars)
note: "* Negative sign is for reacting/disappearing"   # optional footnote under the table
caption: optional caption
```

Values may contain inline math: "$1.0 - x$". Species are rendered with mhchem.
"""
from __future__ import annotations

import re

from ._svg import DiagramError, as_list, esc, figure

ARROWS = {"<=>": r"\rightleftharpoons", "⇌": r"\rightleftharpoons", "->": r"\rightarrow",
          "→": r"\rightarrow", "<-": r"\leftarrow"}
DEFAULT_LABELS = {"R": "Reaction", "I": "Initial", "C": "Change", "E": "Equilibrium"}
_MATH = re.compile(r"\$([^$]+)\$")


def _cell(v) -> str:
    if v is None:
        return ""
    s = str(v).strip()
    if not s:
        return ""
    out, last = [], 0
    for m in _MATH.finditer(s):
        out.append(_plain(s[last:m.start()]))
        out.append(f'<span class="arithmatex">\\({esc(m.group(1))}\\)</span>')
        last = m.end()
    out.append(_plain(s[last:]))
    return "".join(out)


def _plain(s: str) -> str:
    s = re.sub(r"(^|\s)-(?=[\dxX.])", lambda m: m.group(1) + "−", s)
    return esc(s)


def _parse_reaction(r) -> list[tuple[str, str]]:
    """'1PCl5 <=> 1PCl3 + Cl2' → [('1PCl5','<=>'), ('1PCl3','+'), ('Cl2','')]"""
    if isinstance(r, list):
        return [(str(x), "") for x in r]
    toks = re.split(r"\s+(\+|<=>|⇌|->|→|<-)\s+", str(r).strip())
    pairs = []
    for i in range(0, len(toks), 2):
        sp = toks[i]
        op = toks[i + 1] if i + 1 < len(toks) else ""
        pairs.append((sp, op))
    return pairs


def _label(row: str, text: str) -> str:
    text = str(text)
    if text[:1].upper() == row:
        return f'<span class="rice-letter">{esc(text[0])}</span>{esc(text[1:])}'
    return f'<span class="rice-letter">{row}</span> {esc(text)}'


def render(data: dict, **_) -> str:
    if not isinstance(data, dict):
        raise DiagramError("rice: expected keys R, I, C, E")
    if "R" not in data:
        raise DiagramError("rice: missing `R` (the reaction)")
    species = _parse_reaction(data["R"])
    n = len(species)
    labels = {**DEFAULT_LABELS, **(data.get("labels") or {})}
    style = data.get("style", "grid")
    if style not in ("grid", "compact"):
        raise DiagramError("rice: style must be `grid` or `compact`")

    rows = []
    # R row
    cells = []
    for sp, op in species:
        op_html = ""
        if op:
            op_tex = ARROWS.get(op, "+")
            op_html = f' <span class="rice-op arithmatex">\\({op_tex}\\)</span>'
        cells.append(f'<td><span class="arithmatex">\\(\\ce{{{esc(sp)}}}\\)</span>{op_html}</td>')
    rows.append(f'<tr class="rice-r"><th scope="row">{_label("R", labels["R"]) if style == "grid" else "<span class=rice-letter>R</span>"}</th>{"".join(cells)}</tr>')

    for key in ("I", "C", "E"):
        vals = as_list(data.get(key))
        if len(vals) > n:
            raise DiagramError(f"rice: row {key} has {len(vals)} values but the reaction has {n} species")
        vals += [""] * (n - len(vals))
        lab = _label(key, labels[key]) if style == "grid" else f'<span class="rice-letter">{key}</span>'
        tds = "".join(f"<td>{_cell(v)}</td>" for v in vals)
        rows.append(f'<tr class="rice-{key.lower()}"><th scope="row">{lab}</th>{tds}</tr>')

    note = data.get("note")
    note_html = f'<div class="rice-note">{_cell(note)}</div>' if note else ""
    table = (f'<div class="rice-wrap"><table class="rice rice-{style}">'
             f'<tbody>{"".join(rows)}</tbody></table>{note_html}</div>')
    return figure(table, "rice", data.get("caption"))
