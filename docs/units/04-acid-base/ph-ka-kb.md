---
title: pH, Kw, Ka & Kb
unit: 4
description: Autoionization of water (Kw), the pH scale, pH/pOH, weak vs. strong (single vs. double arrow), and how Ka, Kb, pKa and pKb measure acid and base strength.
sources:
  - {nb: "1", pages: "62-66"}
dates: ["10/8/26", "10/9/26"]
tags: [pH, pOH, Kw, Ka, Kb, pKa, weak acids, strong acids]
---

## Water and Kw

Water is made of two ions, $\ce{H+}$ and $\ce{OH-}$. A tiny amount of water always splits into
those ions — this is the **auto-ionization of water**. The two equations below are the same
reaction, written two ways:

$$\ce{H2O <=>[$K_w$] H+ + OH-}$$

$$\underset{\substack{\text{H}^+\text{ donor}\\ =\text{ Acid}}}{\ce{HOH}} + \underset{\substack{\text{H}^+\text{ receiver}\\ =\text{ Base}}}{\ce{HOH}} \ce{<=>[$K_w$]} \ce{OH-} + \underset{\text{hydronium}}{\ce{H3O+}}$$

**$K_w$** is the **ionization product constant** for water.

!!! formula "Ion product of water (Kw)"
    $$\begin{aligned} K_w &= [\ce{OH-}][\ce{H+}] \\ K_w \text{ at } 25\,^\circ\text{C} &= 1\cdot10^{-14} \end{aligned}$$

!!! formula "[H⁺] and [OH⁻] from Kw"
    $$[\ce{H+}] = \frac{K_w}{[\ce{OH-}]} \qquad [\ce{OH-}] = \frac{K_w}{[\ce{H+}]}$$

The balance of $\ce{H+}$ and $\ce{OH-}$ tells you what kind of solution you have:

| Solution | Condition |
|---|---|
| **Neutral** | $[\ce{H+}] = [\ce{OH-}] = 1\cdot10^{-7}\,\text{M}$ |
| **Acidic** | $[\ce{H+}] > [\ce{OH-}]$ |
| **Basic** | $[\ce{OH-}] > [\ce{H+}]$ |

## The pH scale

The **pH scale** measures how acidic or basic a solution is. It runs from 0 to 14 with
**7 = neutral**; the farther from 7, the stronger the acid or base.

```phscale
markers:
  - {pH: 2, label: "pH 2"}
  - {pH: 5, label: "pH 5"}
  - {pH: 8, label: "pH 8"}
  - {pH: 12, label: "pH 12"}
caption: pH 2 is a stronger acid than pH 5; pH 12 is a stronger base than pH 8.
```

<div class="cols ruled" markdown>
<div markdown>

!!! formula "pH"
    $$\begin{aligned} \text{pH} &= -\log([\ce{H+}]) \\ [\ce{H+}] &= 10^{-\text{pH}} \\ \text{pH} &= 14 - \text{pOH} \end{aligned}$$

</div>
<div markdown>

!!! formula "pOH"
    $$\begin{aligned} \text{pOH} &= -\log([\ce{OH-}]) \\ [\ce{OH-}] &= 10^{-\text{pOH}} \\ \text{pOH} &= 14 - \text{pH} \end{aligned}$$

</div>
</div>

!!! formula memorize "pH + pOH"
    $$\text{pH} + \text{pOH} = 14$$

## Weak vs. strong: single or double arrow

**In weak acids and weak bases, ionization is NOT 100%!** {.star}

Weak acids and bases use "$\rightleftharpoons$" because both the forward and reverse reactions take
place. That decides how you solve the problem:

| Arrow | Used for | What it means for the math |
|---|---|---|
| "$\rightarrow$" single arrow | **Strong** acids and bases | Stoichiometry |
| "$\rightleftharpoons$" double arrow | **Weak** acids and bases | A **RICE table** is required → $K_a$, $K_b$ |

- **Always classify an acid as weak or strong** before you start.
- A **double arrow means a RICE table** is required.
- When getting $\ce{H+}$, use $K_a$; when getting $\ce{OH-}$, use $K_b$.

### Ka and Kb expressions

In the notes, **WA** = weak acid and **WB** = weak base (see [Calculating pH](calculating-ph.md)
for the full list of tags).

!!! formula "Acid ionization constant (Ka)"
    For a weak acid such as $\ce{HF}$:

    $$\overset{\text{WA}}{\ce{HF}} \ce{<=> H+ + F-} \qquad K_a = \frac{[\ce{H+}][\ce{F-}]}{[\ce{HF}]}$$

!!! formula "Base ionization constant (Kb)"
    For a weak base such as $\ce{NH3}$:

    $$\overset{\text{WB}}{\ce{NH3}} \ce{<=> NH4+ + OH-} \qquad K_b = \frac{[\ce{NH4+}][\ce{OH-}]}{[\ce{NH3}]}$$

For a weak acid the path is always: weak acid → RICE table → $K_a$ / $K_b$.

!!! example "Example: strong acid — 0.1 M HCl in 2 L"
    A strong acid ionizes completely, so it uses a single arrow:

    $$\ce{1HCl -> 1H+ + 1Cl-}$$

    $$0.1\,\text{M}\cdot2\,\text{L} = 0.2\ \text{mol HCl} \;\Longrightarrow\; 0.2\ \text{mol } \ce{H+}$$

    $$\frac{0.2\ \text{mol } \ce{H+}}{2\ \text{L}} = 0.1\,\text{M } \ce{H+} = [\ce{H+}] \qquad \text{pH} = 1$$

### Equations from words (life skill)

Even if one component is strong, use a **single arrow for the strong part** and a **double arrow
for the weak part**. Split the reaction into two steps:

!!! example "Example: dilute sulfuric acid reacts with methylamine"
    ① **Stoichiometry step** — the strong acid reacts completely:

    $$\overset{\text{SA}}{\ce{H2SO4}} + \overset{\text{WB}}{\ce{2CH3NH2}} \ce{->[stoic step]} \ce{2CH3NH3+ + SO4^2-}$$

    ② **Equilibrium step** — the product is a weak acid, so it needs a RICE table:

    $$\overset{\text{WA}}{\ce{CH3NH3+}} \ce{<=>[RICE]} \ce{CH3NH2 + H+}$$

## Strength from Ka and Kb

The values of $K_a$ and $K_b$ tell you how strong or weak an acid or base is.

- **The greater the $K_a$, the stronger the acid.** For example, $K_a = 2.5\cdot10^{-4}$ is a
  **stronger** acid than $K_a = 2.5\cdot10^{-8}$.
- The same applies to $K_b$: the greater the $K_b$, the stronger the base.

!!! formula memorize "Ka · Kb"
    $$K_a \cdot K_b = 1\cdot10^{-14}$$
    (for a conjugate acid–base pair at 25 °C, $K_a\cdot K_b = K_w$)

!!! formula "pKa and pKb"
    $$\text{p}K_a = -\log(K_a) \qquad \text{p}K_b = -\log(K_b)$$

If $K_a$ is smaller, $\text{p}K_a$ will be larger.

!!! teacher "Ms. Boppana"
    "If Ka is larger in value, pKa is smaller."

!!! formula memorize "pKa + pKb"
    $$\text{p}K_a + \text{p}K_b = 14$$
    **14 is the magic number.**

### Reminder: strong acids and bases

--8<-- "strong-acids-bases.md"
