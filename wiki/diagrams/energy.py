"""Reaction energy (potential energy) diagrams.

```energy
reactants: {E: 40, label: "N2 + 3H2"}     # energies are relative numbers (any scale)
products:  {E: 15, label: "2NH3"}
ts: {E: 80, label: "Transition state"}    # optional (default: a hump above both)
catalyst: {E: 60, label: "with catalyst"} # optional dashed lower hump
show: [Ea, dH]                            # which arrows to draw (default both)
labels: {Ea: "Ea", dH: "ΔH"}              # optional arrow text
x_label: Reaction progress                # optional
y_label: Potential energy                 # optional
caption: optional
```
"""
from __future__ import annotations

from . import graph
from ._svg import DiagramError, as_list, num


def render(data: dict, **kw) -> str:
    if not isinstance(data, dict) or "reactants" not in data or "products" not in data:
        raise DiagramError("energy: needs `reactants` and `products` (each with E and label)")
    R = data["reactants"] if isinstance(data["reactants"], dict) else {"E": data["reactants"]}
    P = data["products"] if isinstance(data["products"], dict) else {"E": data["products"]}
    r, p = num(R.get("E"), None), num(P.get("E"), None)
    span = max(abs(r - p), 20)
    ts = data.get("ts") or {}
    t = num(ts.get("E"), max(r, p) + span * 0.9)
    show = as_list(data.get("show", ["Ea", "dH"]))
    labels = {"Ea": "Ea", "dH": "ΔH", **(data.get("labels") or {})}

    curves = [{"points": [[0, r], [1.6, r], [5, t], [8.4, p], [10, p]], "color": 1, "label_at": "none"}]
    cat = data.get("catalyst")
    if cat:
        c = num(cat.get("E") if isinstance(cat, dict) else cat, None)
        curves.append({"points": [[0, r], [1.6, r], [5, c], [8.4, p], [10, p]], "color": 2,
                       "style": "dashed", "label_at": "none"})
    anns = []
    lift = span * 0.1
    if isinstance(cat, dict) and cat.get("label"):
        anns.append({"text": cat["label"], "at": [6.4, (c + p) / 2 + span * 0.15], "anchor": "start"})
    if R.get("label"):
        anns.append({"text": R["label"], "at": [0.15, r + lift], "anchor": "start"})
    if P.get("label"):
        anns.append({"text": P["label"], "at": [9.2, p + lift]})
    if ts.get("label"):
        anns.append({"text": ts["label"], "at": [5, t + lift * 1.2]})
    if "Ea" in show:
        anns.append({"segment": {"from": [1.6, r], "to": [3.6, r]}})
        anns.append({"span": {"x": 3.4, "from": r, "to": t}, "text": labels["Ea"]})
    if "dH" in show:
        anns.append({"segment": {"from": [1.6, r], "to": [11.2, r]}})
        anns.append({"span": {"x": 10.8, "from": r, "to": p}, "text": labels["dH"]})
    lo = min(r, p, t) - span * 0.25
    hi = max(r, p, t) + span * 0.35
    g = {
        "size": data.get("size", [320, 210]),
        "x": {"label": data.get("x_label", "Reaction progress"), "min": 0, "max": 10},
        "y": {"label": data.get("y_label", "Potential energy"), "min": lo, "max": hi},
        "axes": "arrows",
        "curves": curves,
        "annotations": anns,
        "caption": data.get("caption"),
    }
    return graph.render(g, **kw).replace("diagram-graph", "diagram-energy", 1)
