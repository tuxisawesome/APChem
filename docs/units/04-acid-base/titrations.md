---
title: Acid–Base Titrations
unit: 4
description: Titration vocabulary, the four titration curves (SA + SB, WA + SB, WB + SA, WB + WA) and their pH at the equivalence point, finding pKa from the half-equivalence point, and choosing an indicator.
sources:
  - {nb: "1", pages: "18"}
  - {nb: "class-notes", pages: "52, 56-58, 93-96"}
tags: [titration, titration curves, equivalence point, half-equivalence point, indicators, pKa, buffers]
---

!!! objective "Students will be able to"
    Determine the $\text{p}K_a$ of a weak acid from a titration curve.

## What a titration is

**Titration** is a technique to determine the **concentration of an unknown solution**. A
solution of known concentration (the **titrant**) is added from a burette to a known volume of
the unknown solution (the **analyte**) until the reaction is complete. Knowing the volume of
titrant added lets us work out the concentration of the analyte.

In an **acid–base titration**, the titrant and the analyte are an acid and a base, and the
titration is followed by the **change of pH** as titrant is added. The setup (burette, flask,
indicator) and the mole-ratio math are on
[Net Ionic Equations & Titration](../02-foundations-2/net-ionic-equations-titration.md#titration).

### Titration vocabulary

These are the words used to describe every titration and titration curve.

**Titrant**
:   The solution of **known concentration** (and known volume added), in the burette. It is added
    to another solution whose concentration has to be determined.

**Titrand / analyte**
:   The solution whose **concentration has to be determined** (known volume, unknown
    concentration), in the flask.

**Equivalence point (EQ point)**
:   The point at which the amount of titrant added is **just enough to completely neutralize** the
    analyte. Moles of acid and moles of base match (by the mole ratio), so the solution only
    contains **salt and water**.

**Indicator**
:   A **weak acid or weak base** added to the analyte that **changes color** near the equivalence
    point, so you can see the equivalence point.

**End point**
:   The point at which the **indicator changes color**. A well-chosen indicator makes the end
    point land on the equivalence point.

**Titration curve**
:   A graph of the **pH of the analyte solution** (y-axis) against the **volume of titrant
    added** (x-axis).

**Half-equivalence point (½ EQ point)**
:   The point where **half** of the volume needed to reach the EQ point has been added. Half of the
    weak acid has been turned into its conjugate base, so $[\text{WA}] = [\text{C.B}]$ and
    $\text{pH} = \text{p}K_a$.

**Buffer region (buffering region)**
:   The flat part of a weak acid (or weak base) curve **before** the EQ point. The flask holds the
    weak acid **and** its conjugate base, which is a [buffer](buffers.md), so the pH changes only a
    little.

!!! formula "At the equivalence point"
    $$\text{mol acid} = \text{mol base} \quad (\text{by the mole ratio})$$
    $$\underbrace{\ce{HCl}}_{\text{acid}} + \underbrace{\ce{NaOH}}_{\text{base}} \ce{->[at EQ point]} \underbrace{\ce{NaCl}}_{\text{salt}} + \ce{H2O}$$

The end point is what you **see**; the EQ point is the **chemistry**. {.star}

!!! example "Example: finding the concentration of the analyte"
    **Problem:** 25.0 mL of HCl of unknown concentration is titrated with 0.100 M NaOH. The EQ
    point is reached after 20.0 mL of NaOH. What is $[\ce{HCl}]$?

    **1. Equation (and tags).** Mole ratio 1 : 1.

    $$\underset{\text{analyte}}{\overset{\text{SA}}{\ce{1HCl}}} + \underset{\text{titrant}}{\overset{\text{SB}}{\ce{1NaOH}}} \ce{->[stoic step]} \ce{NaCl + HOH}$$

    | | $\ce{HCl}$ | $\ce{NaOH}$ |
    |---|:-:|:-:|
    | **L** | 0.0250 L | 0.0200 L |
    | **M** | ? | 0.100 M |
    | **mol** | ? | $0.0200\ \cancel{\text{L}}\cdot 0.100\ \dfrac{\text{mol}}{\cancel{\text{L}}} = 0.00200\ \text{mol}$ |

    **2. Mole ratio** (1 HCl : 1 NaOH):

    $$0.00200\ \text{mol NaOH}\cdot\frac{1\ \text{mol HCl}}{1\ \text{mol NaOH}} = 0.00200\ \text{mol HCl}$$

    **3. Molarity of the analyte:**

    $$[\ce{HCl}] = \frac{0.00200\ \text{mol}}{0.0250\ \text{L}} = \boxed{0.0800\,\text{M}}$$

## Titration curves

A **titration curve** plots the pH of the analyte (y-axis) against the volume of titrant added
(x-axis). Its shape, and the pH at the EQ point, depend on whether the acid and base are strong or
weak. The EQ point is the **middle of the steep (vertical) jump**.

### 1. Strong acid + strong base

HCl is the **analyte** (in the flask) and NaOH is the **titrant** (in the burette).

<div class="cols" markdown>
<div markdown>

```graph
x: {min: 0, max: 90, ticks: [25, 50, 75]}
y: {label: pH, min: 0, max: 14, ticks: [2, 4, 6, 8, 10, 12]}
curves:
  - points: [[0, 1.0], [25, 1.48], [40, 1.95], [45, 2.28], [47.5, 2.59], [49, 3.0], [49.5, 3.3], [49.8, 3.7], [49.9, 4.0], [50, 7.0], [50.1, 10.0], [50.2, 10.3], [50.5, 10.7], [51, 11.0], [53, 11.43], [55, 11.68], [65, 12.12], [75, 12.3], [90, 12.46]]
annotations:
  - segment: {from: [0, 7], to: [50, 7]}
  - segment: {from: [50, 0], to: [50, 7]}
  - point: [50, 7]
    text: "EQ point (pH = 7)"
  - text: "Volume of titrant added (mL)"
    at: [45, -3.1]
caption: HCl (SA, analyte) titrated with NaOH (SB, titrant)
```

</div>
<div markdown>

$$\overset{\text{SA}}{\ce{HCl}} + \overset{\text{SB}}{\ce{NaOH}} \ce{->[stoic step]} \ce{NaCl + HOH}$$

- The pH starts very low and stays low (lots of $\ce{H+}$ left).
- Near the EQ point the pH shoots straight up — a **very tall vertical jump**.
- **pH at EQ point = 7** (neutral): only $\ce{NaCl}$ and water are left.
- No buffer region: a strong acid has no conjugate base to buffer with.

</div>
</div>

### 2. Weak acid + strong base

$\ce{CH3COOH}$ is the **analyte** and NaOH is the **titrant**.

<div class="cols" markdown>
<div markdown>

```graph
x: {min: 0, max: 90, ticks: [25, 50, 75]}
y: {label: pH, min: 0, max: 14, ticks: [2, 4, 6, 8, 10, 12]}
curves:
  - points: [[0, 2.87], [2, 3.37], [5, 3.79], [10, 4.14], [17, 4.45], [25, 4.74], [33, 5.03], [40, 5.34], [45, 5.7], [47, 5.94], [48, 6.12], [49, 6.43], [49.5, 6.74], [49.8, 7.13], [50, 8.72], [50.2, 10.3], [50.5, 10.7], [51, 11.0], [53, 11.43], [55, 11.68], [65, 12.12], [75, 12.3], [90, 12.46]]
annotations:
  - segment: {from: [0, 8.72], to: [50, 8.72]}
  - segment: {from: [50, 0], to: [50, 8.72]}
  - point: [50, 8.72]
    text: "EQ point (pH > 7)"
  - point: [25, 4.74]
  - text: "½ EQ point"
    at: [27, 3.4]
    anchor: start
  - arrow: {from: [5, 6.6], to: [45, 6.6], heads: both}
  - text: "buffer region"
    at: [25, 7.1]
  - text: "Volume of titrant added (mL)"
    at: [45, -3.1]
caption: CH3COOH (WA, analyte) titrated with NaOH (SB, titrant)
```

</div>
<div markdown>

$$\overset{\text{WA}}{\ce{CH3COOH}} + \overset{\text{SB}}{\ce{OH-}} \ce{->[stoic step]} \underset{\text{conj. base}}{\ce{CH3COO-}} + \ce{HOH}$$

- The pH starts higher than for a strong acid (a weak acid only partly ionizes).
- **Buffering happens** before the EQ point, so the curve is flat there.
- **½ EQ point:** $\text{pH} = \text{p}K_a$ of $\ce{CH3COOH}$ ($4.74$).
- The vertical jump is shorter than for SA + SB.
- **pH at EQ point > 7** (basic, about 9): the conjugate base $\ce{CH3COO-}$ is left.

</div>
</div>

### 3. Weak base + strong acid

$\ce{NH3}$ is the **analyte** and HCl is the **titrant**. Acid is being added to a base, so this
curve runs **downhill**.

<div class="cols" markdown>
<div markdown>

```graph
x: {min: 0, max: 90, ticks: [25, 50, 75]}
y: {label: pH, min: 0, max: 14, ticks: [2, 4, 6, 8, 10, 12]}
curves:
  - points: [[0, 11.13], [2, 10.63], [5, 10.21], [10, 9.86], [17, 9.55], [25, 9.26], [33, 8.97], [40, 8.66], [45, 8.3], [47, 8.06], [48, 7.88], [49, 7.57], [49.5, 7.26], [49.8, 6.87], [50, 5.3], [50.2, 3.7], [50.5, 3.3], [51, 3.0], [53, 2.54], [55, 2.32], [65, 1.88], [75, 1.7], [90, 1.54]]
annotations:
  - segment: {from: [0, 5.3], to: [50, 5.3]}
  - segment: {from: [50, 0], to: [50, 5.3]}
  - point: [50, 5.3]
    text: "EQ point (pH < 7)"
  - point: [25, 9.26]
    text: "½ EQ point"
  - arrow: {from: [5, 11.6], to: [45, 11.6], heads: both}
  - text: "buffer region"
    at: [25, 12.1]
  - text: "Volume of titrant added (mL)"
    at: [45, -3.1]
caption: NH3 (WB, analyte) titrated with HCl (SA, titrant)
```

</div>
<div markdown>

$$\overset{\text{WB}}{\ce{NH3}} + \overset{\text{SA}}{\ce{H+}} \ce{->[stoic step]} \underset{\text{conj. acid}}{\ce{NH4+}}$$

- The pH starts basic and drops as acid is added.
- $\ce{NH3}$ and $\ce{NH4+}$ make a buffer before the EQ point.
- **½ EQ point:** $\text{pOH} = \text{p}K_b$ of $\ce{NH3}$, so
  $\text{pH} = 14 - 4.74 = 9.26$.
- **pH at EQ point < 7** (acidic, about 5–6): the conjugate acid $\ce{NH4+}$ is left.

</div>
</div>

If the setup is flipped (HCl in the flask, $\ce{NH3}$ in the burette), the curve climbs instead
of dropping, but the EQ point is still **acidic** because $\ce{NH4Cl}$ is left either way.

### 4. Weak base + weak acid

$\ce{NH3}$ is the **analyte** and $\ce{CH3COOH}$ is the **titrant**.

<div class="cols" markdown>
<div markdown>

```graph
x: {min: 0, max: 90, ticks: [25, 50, 75]}
y: {label: pH, min: 0, max: 14, ticks: [2, 4, 6, 8, 10, 12]}
curves:
  - points: [[0, 11.13], [2, 10.63], [5, 10.21], [10, 9.86], [17, 9.55], [25, 9.26], [33, 8.97], [40, 8.66], [45, 8.3], [47, 8.06], [48, 7.88], [49, 7.57], [50, 7.0], [51, 6.44], [52, 6.14], [53, 5.96], [55, 5.74], [60, 5.44], [75, 5.04], [90, 4.84]]
annotations:
  - segment: {from: [0, 7], to: [50, 7]}
  - segment: {from: [50, 0], to: [50, 7]}
  - point: [50, 7]
    text: "EQ point (pH ≈ 7)"
  - text: "no sharp jump"
    at: [72, 10.2]
  - text: "Volume of titrant added (mL)"
    at: [45, -3.1]
caption: NH3 (WB, analyte) titrated with CH3COOH (WA, titrant)
```

</div>
<div markdown>

$$\overset{\text{WB}}{\ce{NH3}} + \overset{\text{WA}}{\ce{CH3COOH}} \ce{<=>} \ce{NH4+ + CH3COO-}$$

- The pH changes **gradually** — there is **no tall vertical jump**.
- That makes the EQ point hard to see, so an indicator is not useful here.
- **pH at EQ point ≈ 7** here, because $K_a$ of $\ce{CH3COOH}$ and $K_b$ of $\ce{NH3}$ are equal
  ($1.8\cdot10^{-5}$).

</div>
</div>

### pH at the equivalence point

At the EQ point the flask only holds the **salt + water**, so the pH there is the pH of that salt
solution (see [Is the salt solution acidic, basic or neutral?](buffers.md#is-the-salt-solution-acidic-basic-or-neutral)).

!!! formula "pH at the equivalence point"
    | Titration | pH at EQ point |
    |---|---|
    | SA + SB | $= 7$ (neutral) |
    | WA + SB | $> 7$ (basic) |
    | WB + SA | $< 7$ (acidic) |

- **SA + SB:** the ions of the salt ($\ce{Na+}$, $\ce{Cl-}$) don't react with HOH, so the
  solution is neutral.
- **WA + SB:** the conjugate base ($\ce{CH3COO-}$) is a weak base. It takes an $\ce{H+}$ from HOH
  and leaves $\ce{OH-}$ behind, so the solution is basic.
- **WB + SA:** the conjugate acid ($\ce{NH4+}$) is a weak acid. It gives off $\ce{H+}$, so the
  solution is acidic.

A weak acid titration ends basic; a weak base titration ends acidic. {.star}

!!! example "Example: pH at the EQ point of a weak acid titration"
    **Problem:** 20.0 mL of 0.100 M $\ce{CH3COOH}$ is titrated with 0.100 M NaOH
    ($K_a = 1.8\cdot10^{-5}$). What volume of NaOH reaches the EQ point, and what is the pH there?

    **1. Net ionic equation** (stoichiometry step). Moles of acid:
    $0.0200\ \text{L}\cdot 0.100\ \frac{\text{mol}}{\text{L}} = 0.00200\ \text{mol}$.

    $$\overset{\text{WA}}{\ce{CH3COOH}} + \overset{\text{SB}}{\ce{OH-}} \ce{->[stoic step]} \ce{CH3COO- + HOH}$$

    | | $\ce{CH3COOH}$ | $\ce{OH-}$ | $\ce{CH3COO-}$ | $\ce{HOH}$ |
    |---|:-:|:-:|:-:|:-:|
    | **mol** | 0.00200 mol | 0.00200 mol | 0 | |
    | **left over** | 0 | 0 | 0.00200 mol | |

    At the EQ point, mol $\ce{OH-}$ = mol acid, so the volume of NaOH is

    $$\frac{0.00200\ \cancel{\text{mol}}}{0.100\ \frac{\cancel{\text{mol}}}{\text{L}}} = 0.0200\ \text{L} = \boxed{20.0\ \text{mL}}$$

    **2. Finish statement** — total volume $= 20.0\ \text{mL} + 20.0\ \text{mL} = 0.0400\ \text{L}$:

    $$[\ce{CH3COO-}] = \frac{0.00200\ \text{mol}}{0.0400\ \text{L}} = 0.0500\,\text{M}$$

    **3. ID.** Only the conjugate base is left — it is a **weak base**, so use $K_b$:

    $$K_b = \frac{1\cdot10^{-14}}{K_a} = \frac{1\cdot10^{-14}}{1.8\cdot10^{-5}} = 5.56\cdot10^{-10}$$

    **4. EQ step (RICE).**

    $$\overset{\text{WB}}{\ce{CH3COO-}} \ce{<=>[HOH, EQ step][RICE table]} \ce{CH3COOH + OH-}$$

    ```rice
    style: compact
    R: "CH3COO- <=> CH3COOH + OH-"
    I: [0.0500M, "0", "0"]
    C: [-x, +x, +x]
    E: ["$0.0500 - x$", "$x$", "$x = [\\ce{OH-}]$"]
    ```

    $$K_b = 5.56\cdot10^{-10} = \frac{x^2}{0.0500 - x} \qquad x = 5.27\cdot10^{-6}\,\text{M} = [\ce{OH-}]$$

    $$\text{pOH} = -\log(5.27\cdot10^{-6}) = 5.28$$

    $$\text{pH} = 14 - 5.28 = \boxed{8.72} \;\Rightarrow\; \text{basic} \ (> 7)$$

## Titration curve for a weak acid (buffering happens)

A weak acid titration has a **buffer region**, and the most useful point on it is the
**half-equivalence point**. The table follows the curve from left to right.

| Region of the curve | What is in the flask | How to get the pH |
|---|---|---|
| **Start** (0 mL) | Weak acid only | RICE table with $K_a$ ([pH, Kw, Ka & Kb](ph-ka-kb.md)) |
| **Buffer region** | WA + its conjugate base = **buffer** | [Henderson–Hasselbalch](buffers.md#hendersonhasselbalch-equation) |
| **½ EQ point** | $[\text{WA}] = [\text{C.B}]$ | $\text{pH} = \text{p}K_a$ |
| **EQ point** | Conjugate base (salt) + HOH only | $K_b$ RICE table → pH $> 7$ |
| **After the EQ point** | Extra $\ce{OH-}$ from the strong base | Leftover $\ce{OH-}$ → pOH → pH |

A weak acid and its conjugate base together make a buffer, so buffering happens until the weak acid
runs out at the EQ point:

$$\underbrace{\overset{\text{WA}}{\boxed{\ce{HA}}}}_{\text{weak acid}} \ce{<=> H+ +} \underbrace{\boxed{\ce{A-}}}_{\text{conj. base of WA}} \qquad \text{WA} + \text{conj. base of WA} = \text{Buffer}$$

### Finding the pKa from the half-equivalence point

The curve below is a weak acid titrated with NaOH; the EQ point is at **20 mL**, so the
½ EQ point is at **10 mL**.

```graph
x: {min: 0, max: 32, ticks: [[10, "10 mL"], [20, "20 mL"], [30, "30 mL"]]}
y: {label: pH, min: 0, max: 14, ticks: [2, [4.74, "pK_a"], 6, 8, 10, 12]}
curves:
  - points: [[0, 2.87], [1, 3.46], [2, 3.79], [5, 4.26], [8, 4.56], [10, 4.74], [12, 4.92], [15, 5.22], [17, 5.49], [18, 5.7], [19, 6.02], [19.5, 6.33], [19.8, 6.74], [20, 8.72], [20.2, 10.7], [20.5, 11.09], [21, 11.39], [22, 11.68], [25, 12.05], [30, 12.3], [32, 12.36]]
annotations:
  - segment: {from: [0, 4.74], to: [10, 4.74]}
  - segment: {from: [10, 0], to: [10, 4.74]}
  - segment: {from: [20, 0], to: [20, 8.72]}
  - point: [10, 4.74]
  - point: [20, 8.72]
    text: "EQ point"
  - callout: {at: [11.5, 2.4], to: [10.4, 4.3]}
    text: "½ EQ point"
  - arrow: {from: [1.5, 6.7], to: [18.5, 6.7], heads: both}
  - text: "buffer region"
    at: [10, 7.3]
  - text: "Volume of NaOH added (mL)"
    at: [16, -3.1]
caption: "Titration curve for a WA: vol @ ½ EQ point = 10 mL, vol @ EQ point = 20 mL"
```

1. Find the **volume at the EQ point** — the middle of the vertical jump (here 20 mL of base).
2. Divide by 2 to get the **volume at the ½ EQ point** (here 10 mL).
3. Go up to the curve and across to the y-axis: the **pH at the ½ EQ point = $\text{p}K_a$** of the
   weak acid.

!!! formula "Volume at the half-equivalence point"
    $$\text{vol @ ½ EQ point} = \frac{\text{vol @ EQ point}}{2}$$

**Why pH = pKa there.** At the ½ EQ point, half of the weak acid has reacted with $\ce{OH-}$. For
example, with 0.00200 mol of HA and half as much $\ce{OH-}$ added:

| | $\ce{HA}$ (ER) | $\ce{OH-}$ (LR) | $\ce{A-}$ | $\ce{HOH}$ |
|---|:-:|:-:|:-:|:-:|
| **mol** | 0.00200 mol | 0.00100 mol | 0 | |
| **left over** | 0.00100 mol | 0 | 0.00100 mol | |

The weak acid left and the conjugate base made are equal, so the ratio in the
[Henderson–Hasselbalch equation](buffers.md#hendersonhasselbalch-equation) is 1:

$$\text{pH} = \text{p}K_a + \log\left(\frac{[\text{C.B}]}{[\text{WA}]}\right) = \text{p}K_a + \log\left(\frac{0.00100\ \text{mol}}{0.00100\ \text{mol}}\right) = \text{p}K_a + \underbrace{\log(1)}_{=\,0}$$

!!! formula "pH at the half-equivalence point (weak acid)"
    $$\text{pH @ ½ EQ point} = \text{p}K_a \text{ of the WA}$$
    $$K_a = 10^{-\text{p}K_a} = 10^{-(\text{pH @ ½ EQ point})}$$

!!! example "Example: pKa and Ka from a titration curve"
    **Problem:** In the curve above, the pH at 10 mL of NaOH is 4.74. Find $\text{p}K_a$ and
    $K_a$ of the weak acid.

    **1. Volume at the EQ point** (middle of the vertical jump): 20 mL.

    **2. Volume at the ½ EQ point:**

    $$\frac{20\ \text{mL}}{2} = 10\ \text{mL}$$

    **3. pH at the ½ EQ point** = $\text{p}K_a$:

    $$\text{p}K_a = 4.74$$

    **4. $K_a$:**

    $$K_a = 10^{-\text{p}K_a} = 10^{-4.74} = \boxed{1.8\cdot10^{-5}}$$

    $\therefore$ the weak acid is acetic acid, $\ce{CH3COOH}$ ($K_a = 1.8\cdot10^{-5}$).

### Weak base version

For a **weak base** titrated with a strong acid (curve 3), the same idea gives $\text{p}K_b$:
at the ½ EQ point $[\text{WB}] = [\text{C.A}]$.

!!! formula "pOH at the half-equivalence point (weak base)"
    $$\text{pOH @ ½ EQ point} = \text{p}K_b \text{ of the WB}$$
    $$\text{pH @ ½ EQ point} = 14 - \text{p}K_b$$

## Choosing an indicator

An **indicator** is itself a weak acid ($\ce{HIn}$) whose acid form and conjugate base form have
**different colors**:

$$\underset{\text{color 1}}{\ce{HIn}} \ce{<=> H+ +} \underset{\text{color 2}}{\ce{In-}}$$

It changes color when the pH is close to its own $\text{p}K_a$. To make the end point land on the
EQ point, pick an indicator whose **$\text{p}K_a$ matches the pH at the EQ point**.

!!! formula "Choosing an indicator"
    $$\text{p}K_a \text{ of the indicator} \approx \text{pH @ EQ point}$$
    The color change happens over about $\text{p}K_a \pm 1$.

| Indicator | $\text{p}K_a$ (about) | Color change | Good for |
|---|:-:|---|---|
| Methyl red | 5.0 | red → yellow | WB + SA (EQ point < 7) |
| Bromothymol blue | 7.0 | yellow → blue | SA + SB (EQ point = 7) |
| Phenolphthalein | 9.3 | colorless → pink | WA + SB (EQ point > 7) |

The vertical jump of a strong acid + strong base is so tall that any of these change color on the
jump. A weak base + weak acid curve has no jump, so no indicator works well.

## Area of confusion: EQ point vs. ½ EQ point

Both questions read a pH off a titration curve and call it a "$\text{p}K_a$", but they use
**different points** for **different things**:

| | **How to choose an indicator** | **Finding the pKa of a weak acid** |
|---|---|---|
| Which curve | Any titration curve | Titration curve for a WA (buffering) |
| Point that matters | **EQ point** (middle of the jump) | **½ EQ point** |
| Volume (x-axis) | vol @ EQ point | vol @ ½ EQ point $= \dfrac{\text{vol @ EQ point}}{2}$ |
| pH you read (y-axis) | pH @ EQ point | pH @ ½ EQ point |
| That pH equals… | $\text{p}K_a$ of the **indicator** | $\text{p}K_a$ of the **weak acid** |
| Why | The indicator changes color near its $\text{p}K_a$ | $[\text{WA}] = [\text{C.B}]$, and $\log(1) = 0$ |

EQ point → choose the indicator. ½ EQ point → pKa of the weak acid. {.star}
