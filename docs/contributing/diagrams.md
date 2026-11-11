---
title: Diagram Reference
description: Every diagram type the wiki can draw, with the exact code that makes it.
---

Diagrams are written as small **YAML code blocks** — the build turns them into drawings that
follow light/dark mode. Each example below shows the code first, then the result. Copy, paste,
and change the values.

!!! tip "Text inside diagrams"
    Formulas get subscripts automatically: `H2O` → H₂O, `[N2O4]` → [N₂O₄].
    Use `^` for superscripts/charges and `_` for other subscripts: `SO4^{2-}`, `NH4^+`,
    `q_rxn`, `10^{-12}`. Use `\n` inside quotes for a line break.

If a block has a mistake, the page shows a red **Diagram error** box explaining what's wrong (and
the build check fails), so nothing broken gets published.

## `rice` — RICE tables

Two styles, just like in my notes: the ruled **grid** and the **compact** list.

````markdown
```rice
R: "1PCl5(g) <=> 1PCl3(g) + Cl2(g)"
I: [0.149M, 0.002175M, 0M]
C: [-xM, +xM, +xM]
E: [0.148M, 0.003175M, 0.001M]
labels:
  I: "Initial [ ] (M)(P)"
  C: "Change (x)"
  E: "Equilibrium [ ] (M)(P)"
note: "* Negative sign is for reacting/disappearing"
```
````

```rice
R: "1PCl5(g) <=> 1PCl3(g) + Cl2(g)"
I: [0.149M, 0.002175M, 0M]
C: [-xM, +xM, +xM]
E: [0.148M, 0.003175M, 0.001M]
labels:
  I: "Initial [ ] (M)(P)"
  C: "Change (x)"
  E: "Equilibrium [ ] (M)(P)"
note: "* Negative sign is for reacting/disappearing"
```

````markdown
```rice
style: compact
R: "N2 + 3H2 <=> 2NH3"
I: [1.0M, 3.0M, 0M]
C: [-x, -3x, +2x]
E: ["$1.0 - x$", "$3.0 - 3x$", "$2x$"]
```
````

```rice
style: compact
R: "N2 + 3H2 <=> 2NH3"
I: [1.0M, 3.0M, 0M]
C: [-x, -3x, +2x]
E: ["$1.0 - x$", "$3.0 - 3x$", "$2x$"]
```

## `graph` — sketch graphs

Curves are smoothed through the points you give. Coordinates are in whatever units you like.

````markdown
```graph
x: {label: t}
y: {label: Concentration, min: 0, max: 1}
curves:
  - {points: [[0, .95], [1.5, .55], [4, .38], [10, .36]], label: "[N2O4]", label_at: start, color: 1}
  - {points: [[0, 0], [1.5, .45], [4, .6], [10, .62]], label: "[NO2]", label_at: start, color: 2}
annotations:
  - span: {x: 8.5, from: .36, to: .62}
    text: Equilibrium
caption: Concentration vs. time — the concentrations stop changing, but they are NOT equal.
```
````

```graph
x: {label: t}
y: {label: Concentration, min: 0, max: 1}
curves:
  - {points: [[0, .95], [1.5, .55], [4, .38], [10, .36]], label: "[N2O4]", label_at: start, color: 1}
  - {points: [[0, 0], [1.5, .45], [4, .6], [10, .62]], label: "[NO2]", label_at: start, color: 2}
annotations:
  - span: {x: 8.5, from: .36, to: .62}
    text: Equilibrium
caption: Concentration vs. time — the concentrations stop changing, but they are NOT equal.
```

Other annotations: `callout` (text with a pointer), `arrow`, `text`, `hline` / `vline`
(dashed reference lines), `segment`, `point`. Add `ticks: [0, 7, 14]` to an axis for tick marks.

```graph
x: {label: t}
y: {label: Rate, min: 0, max: 1}
curves:
  - {points: [[0, .92], [2, .6], [5, .47], [10, .46]], label: "forward (N2O4)", label_at: start, color: 1}
  - {points: [[0, .04], [2, .3], [5, .44], [10, .46]], label: "reverse (NO2)", label_at: start, color: 2}
annotations:
  - callout: {at: [7.3, .8], to: [8, .47]}
    text: "equilibrium:\nrates are equal"
```

## `energy` — reaction energy diagrams

````markdown
```energy
reactants: {E: 40, label: "N2 + 3H2"}
products: {E: 15, label: "2NH3"}
ts: {E: 80}
catalyst: {E: 60, label: catalyzed}
caption: An exothermic reaction (ΔH < 0).
```
````

```energy
reactants: {E: 40, label: "N2 + 3H2"}
products: {E: 15, label: "2NH3"}
ts: {E: 80}
catalyst: {E: 60, label: catalyzed}
caption: An exothermic reaction (ΔH < 0).
```

## `apparatus` — labeled lab equipment

Pick parts, set the liquid level (`fill`), and point labels at named spots (`anchor`s).
Labels go on the `left`, `right`, `top` or `bottom`; add `arrow: true` for an arrowhead.

````markdown
```apparatus
parts:
  - {type: beaker, id: cup, style: cup, fill: 0.5, liquid: purple}
labels:
  - {text: Surroundings, to: cup.wall}
  - {text: "System\n(Reaction)", to: cup.liquid, arrow: true}
caption: System vs. surroundings
```
````

```apparatus
parts:
  - {type: beaker, id: cup, style: cup, fill: 0.5, liquid: purple}
labels:
  - {text: Surroundings, to: cup.wall}
  - {text: "System\n(Reaction)", to: cup.liquid, arrow: true}
caption: System vs. surroundings
```

<div class="cols" markdown>
<div markdown>

```apparatus
parts:
  - {type: coffee-cup, id: cc, fill: 0.55}
labels:
  - {text: Thermometer, to: cc.thermometer, side: right}
  - {text: Stirrer, to: cc.stirrer, side: left}
  - {text: "Styrofoam cups", to: cc.cup, side: right}
  - {text: "Solution (reaction)", to: cc.liquid, side: left, arrow: true}
caption: Coffee-cup calorimeter
```

</div>
<div markdown>

```apparatus
parts:
  - {type: bomb-calorimeter, id: b}
labels:
  - {text: Thermometer, to: b.thermometer, side: right}
  - {text: Stirrer, to: b.stirrer, side: left}
  - {text: Water, to: b.water, side: right}
  - {text: "Steel bomb", to: b.bomb, side: left}
  - {text: Sample, to: b.sample, side: right}
  - {text: Insulation, to: b.insulation, side: right}
caption: Bomb calorimeter
```

</div>
</div>

<div class="cols" markdown>
<div markdown>

```apparatus
parts:
  - {type: titration, id: t, flask_liquid: clear}
labels:
  - {text: "Burette (NaOH)", to: t.burette, side: right}
  - {text: Stopcock, to: t.stopcock, side: right}
  - {text: "Acid + indicator", to: t.solution, side: right}
caption: Titration setup
```

</div>
<div markdown>

```apparatus
parts:
  - {type: gas-collection, id: g}
labels:
  - {text: gas, to: g.gas, side: right, arrow: true}
  - {text: H2O, to: g.water, side: right}
  - {text: "Reaction", to: g.reaction, side: left}
caption: Collecting a gas over water
```

</div>
</div>

All parts: `beaker` (styles `beaker` / `cup`), `test-tube`, `erlenmeyer`, `volumetric-flask`,
`graduated-cylinder`, `burette`, `titration`, `coffee-cup`, `bomb-calorimeter`,
`gas-collection`, `scrap-paper`. Liquids: `purple`, `blue`, `clear`, `pink`, `green`,
`amber`, `gray`. Particle pictures go inside liquids:

```apparatus
parts:
  - {type: beaker, id: b, fill: 0.7, liquid: clear, particles: [{text: "Na+", n: 4, color: 1}, {text: "Cl-", n: 4, color: 2}]}
  - {type: volumetric-flask, id: v, fill: 0.55, liquid: blue}
  - {type: graduated-cylinder, id: g, fill: 0.6, liquid: green}
  - {type: scrap-paper, id: p}
labels:
  - {text: "NaCl(aq)", to: b.wall, side: top}
  - {text: "calibration mark", to: v.mark, side: top}
  - {text: "fold → Decode FRQ column", to: p.fold, side: top}
```

The full list of anchors for each part is in `hooks/diagrams/apparatus.py`.

## `lewis` — Lewis structures & reaction schemes

Atoms sit on a grid (1 = one bond length; **y grows downward**). Add lone pairs by direction
(`n s e w ne nw se sw`), circle a pair with `circle:`, bracket an ion with `bracket: true`.

````markdown
```lewis
items:
  - id: nh3
    molecule:
      atoms:
        N: {at: [0, 0], lone: [n]}
        H1: {at: [-1, 0]}
        H2: {at: [-0.6, 0.8]}
        H3: {at: [0.6, 0.8]}
      bonds: [[N, H1], [N, H2], [N, H3]]
    brace: "Donates e⁻ pair: Base"
  - op: "+"
  - id: bh3
    molecule:
      atoms:
        B: {at: [0, 0]}
        Ha: {el: H, at: [0, -1]}
        Hb: {el: H, at: [1, 0]}
        Hc: {el: H, at: [0, 1]}
      bonds: [[B, Ha], [B, Hb], [B, Hc]]
    brace: "Accepts e⁻ pair: Acid"
arrows:
  - {from: nh3.N.lone.n, to: bh3.B, label: Docks, bend: -45}
```
````

```lewis
items:
  - id: nh3
    molecule:
      atoms:
        N: {at: [0, 0], lone: [n]}
        H1: {at: [-1, 0]}
        H2: {at: [-0.6, 0.8]}
        H3: {at: [0.6, 0.8]}
      bonds: [[N, H1], [N, H2], [N, H3]]
    brace: "Donates e⁻ pair: Base"
  - op: "+"
  - id: bh3
    molecule:
      atoms:
        B: {at: [0, 0]}
        Ha: {el: H, at: [0, -1]}
        Hb: {el: H, at: [1, 0]}
        Hc: {el: H, at: [0, 1]}
      bonds: [[B, Ha], [B, Hb], [B, Hc]]
    brace: "Accepts e⁻ pair: Acid"
arrows:
  - {from: nh3.N.lone.n, to: bh3.B, label: Docks, bend: -45}
```

Operators: `+`, `->`, `<=>`, `=>` (the big hollow arrow), with optional `above:` / `below:` text.
Plain formulas use `text:`. A bracketed ion:

```lewis
items:
  - {text: "H+", label: Hydrogen ion}
  - op: "+"
  - molecule:
      atoms:
        O: {at: [0, 0], lone: [n, w]}
        H1: {at: [0.8, 0.6]}
        H2: {at: [-0.8, 0.6]}
      bonds: [[O, H1], [O, H2]]
    label: "(H2O)"
  - op: "=>"
  - molecule:
      bracket: true
      charge: "+"
      atoms:
        O: {at: [0, 0], lone: [n]}
        H1: {at: [-1, 0]}
        H2: {at: [0.8, 0.6]}
        H3: {at: [-0.2, 1]}
      bonds: [[O, H1], [O, H2], [O, H3]]
    label: "(H3O+)"
```

Double/triple bonds: `[C, O, 2]`. A coordinate bond drawn as an arrow: `[N, B, dative]`.
Several rows: use `rows: [[...items...], [...items...]]`. Braces across items:
`braces: [{from: id1, to: id2, text: "Main acid/base"}]`.

## Other visuals (no code block needed)

- **Math & equations:** `$\ce{N2 + 3H2 <=> 2NH3}$` → $\ce{N2 + 3H2 <=> 2NH3}$;
  `$K_c = \frac{[NH_3]^2}{[N_2][H_2]^3}$`. Boxes, cancels and labels work too:
  `$\boxed{2CO}$`, `$\cancel{2CO}$`, `$\underbrace{\ce{HCl + NaOH}}_{\text{Main acid/base}}$`
  → $\underbrace{\ce{HCl + NaOH}}_{\text{Main acid/base}}$
- **Flowcharts:** a ` ```mermaid ` block.
- **Columns, T-charts, ☆ lines, dividers:** see the [Style Guide](style-guide.md).

## Adding a new diagram type

1. Create `hooks/diagrams/<kind>.py` with a `render(data: dict) -> str` function (copy `rice.py`
   for a small example; use the helpers in `_svg.py`).
2. Add it to `KINDS` in `hooks/diagrams/__init__.py`. The build picks it up as a fence automatically.
3. Add an example to this page.
