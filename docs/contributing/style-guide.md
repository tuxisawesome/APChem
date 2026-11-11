---
title: Style Guide
description: How notes are written in this wiki so they look like my notebook.
---

Pages are organized in whatever order and with whatever headings explain things best — but they
always use **my notebook's conventions**: the same terms, notation, list styles, worked-example
layouts and drawings. This page shows the building blocks and the rules. (The same rules are in
`AGENTS.md` for AI helpers.)

## Page skeleton

Every topic page lives in its unit folder (`docs/units/03-equilibrium/…`) and starts with front
matter. Copy `tools/templates/topic.md` to start a new one.

```yaml
---
title: RICE Tables                      # page title (don't add a "# Heading" — the title is shown for you)
unit: 3                                 # must match the folder number
description: One sentence for cards and search.
sources:                                # which notebook pages this came from (opens the scans)
  - {nb: "1", pages: "43-46"}
dates: ["9/23/26", "9/24/26"]           # class dates, as written in the notebook
tags: [equilibrium, RICE]               # optional
---
```

Then write the notes with `##` / `###` headings — pick whatever order and headings explain the topic best.

## Writing rules

1. **Keep my terms and layout.** RICE (not ICE), "LB acid", `HOH` for water when I wrote it,
   $[X]_0$ for initial and $[X]_{eq}$ for equilibrium, $K_c$ / $K_p$ with my tags like
   $K_c(\text{REV})$, lowercase $t$ for temperature in thermo, $C$ (uppercase, heat capacity) vs
   $c$ (lowercase, specific heat).
2. **Scientific notation** the way I write it: $8.8\cdot10^{-12}$ (with `\cdot`, not ×).
3. **Carry units** through every step: $\frac{0.00435\ \text{mol}}{2\ \text{L}} = 0.002175\text{M}$.
4. **Write it like a wiki, not like scratch notes.** Use normal bullet lists (nested for
   sub-points) or full sentences — don't start lines with → or ↳. Turn label-style notes into
   **definition lists** or **tables** (rules, vocabulary, comparisons), give each section a short
   intro sentence, and bold the key terms. Arrows are only for chemistry and math (reactions,
   conversion chains like g → mol → g).
   - **No bare "ex."** — put worked examples in `!!! example "Example: …"` boxes, use an
     *Example* column in a table, or write "For example, …".
5. **Fix mistakes quietly** — correct wrong chemistry and spelling, but keep the structure.
6. **Every equation or constant goes in a formula box** (see below) — that's what fills the
   [Formulas](../formulas.md) page.

## Chemistry & math

| Write | Get |
|---|---|
| `$\ce{N2 + 3H2 <=> 2NH3}$` | $\ce{N2 + 3H2 <=> 2NH3}$ |
| `$\ce{HCl(aq) -> H+ + Cl-}$` | $\ce{HCl(aq) -> H+ + Cl-}$ |
| `$\ce{SO4^2-}$`, `$\ce{(NH4)+}$` | $\ce{SO4^2-}$, $\ce{(NH4)+}$ |
| `$\ce{A + B ->[\Delta] C}$` | $\ce{A + B ->[\Delta] C}$ |
| `$K_c = \dfrac{[NH_3]^2}{[N_2]\cdot[H_2]^3}$` | $K_c = \dfrac{[NH_3]^2}{[N_2]\cdot[H_2]^3}$ |
| `$\boxed{2CO}$` · `$\cancel{2CO}$` | $\boxed{2CO}$ · $\cancel{2CO}$ |
| `$\overset{\checkmark}{2Cl_2}$` | $\overset{\checkmark}{2Cl_2}$ |
| `$\underbrace{\ce{HCl + NaOH}}_{\text{Main acid/base}}$` | $\underbrace{\ce{HCl + NaOH}}_{\text{Main acid/base}}$ |
| `$\therefore$` | $\therefore$ |

Display equations go on their own line with `$$ … $$`.

## Callout boxes

```markdown
!!! formula "Ideal Gas Law"
    $$PV = nRT$$
    $R = 0.08206\ \frac{L\cdot atm}{mol\cdot K}$
```

!!! formula "Ideal Gas Law"
    $$PV = nRT$$
    $R = 0.08206\ \frac{L\cdot atm}{mol\cdot K}$

Boxed formulas I marked **"Memorize!"** get the `memorize` flag:

```markdown
!!! formula memorize "K꜀ of the reversed reaction"
    $$K_c(\text{REV}) = \frac{1}{K_c}$$
```

!!! formula memorize "K꜀ of the reversed reaction"
    $$K_c(\text{REV}) = \frac{1}{K_c}$$

!!! warning "Formula boxes are required"
    The build checks every topic page for at least one `!!! formula` box. A page with no formulas
    (like a naming page) must say `formulas: none` in its front matter. This keeps the Formulas
    page complete.

Other boxes:

```markdown
!!! objective "Students will be able to"
    Define the state of equilibrium…

!!! memorize "Text to memorize"
    Things to memorize that aren't formulas.

!!! teacher "Ms. Boppana"
    "What you serve on your plate is how much you eat."

!!! ap "AP Favorite!"
    Peroxides: O is −1.

!!! example "Example"
    A worked problem…
```

!!! objective "Students will be able to"
    Define the state of equilibrium…

!!! teacher "Ms. Boppana"
    "What you serve on your plate is how much you eat."

!!! ap "AP Favorite!"
    Peroxides: O is −1.

Add `???` instead of `!!!` to make a box collapsible (`???+` = starts open).

## Definition lists

```markdown
**System**
:   The area on which the study is done.

**Surroundings**
:   Anything in direct contact with the system.
```

**System**
:   The area on which the study is done.

**Surroundings**
:   Anything in direct contact with the system.

## ☆ lines, boxed words and dividers

```markdown
Solids don't react! {.star}

Solids and liquids are <span class="boxed">NOT</span> included.

End of concentration {.divider}
```

Solids don't react! {.star}

Solids and liquids are <span class="boxed">NOT</span> included.

End of concentration {.divider}

## Columns, sidebars and T-charts

```markdown
<div class="cols sidebar" markdown>
<div markdown>
Main notes…
</div>
<div markdown>
**Gas laws** (sidebar)

$PV = nRT$
</div>
</div>
```

<div class="cols sidebar" markdown>
<div markdown>
Main notes on the left, like the main part of the notebook page.
</div>
<div markdown>
**Gas laws**

$PV = nRT$
</div>
</div>

Use `cols` (equal columns), `cols ruled` (with a line between) or `cols sidebar`.
A **T-chart** (like Strong vs Weak Acid):

```markdown
<div class="tchart" markdown>
<div markdown>
**Strong Acid**

- 100% ionization
</div>
<div markdown>
**Weak Acid**

- Partial ionization
</div>
</div>
```

<div class="tchart" markdown>
<div markdown>
**Strong Acid**

- 100% ionization
</div>
<div markdown>
**Weak Acid**

- Partial ionization
</div>
</div>

Tables whose first column is a mnemonic key (like **No / Ch / B I Cl / So**) go inside
`<div class="mnemonic" markdown>` … `</div>` so the key letters stand out.

## Diagrams

Beakers, graphs, RICE tables, Lewis structures and more: see the
[Diagram Reference](diagrams.md).
