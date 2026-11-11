---
title: Combustion Analysis
unit: 1
description: Deriving the empirical and molecular formula of a carbon compound from the grams of CO₂ and H₂O made when it burns, with worked C/H/O and C/H/N examples.
sources:
  - {nb: "1", pages: "11-12"}
dates: ["8/28/26"]
tags: [combustion analysis, empirical formula, molecular formula]
---

!!! objective "Students will be able to"
    Derive an empirical formula & molecular formula from data provided in the combustion of the
    compound.

## Vocabulary

**Combustion reaction**
:   A carbon compound reacting with $\ce{O2}$ when heated, making $\ce{CO2}$ and $\ce{H2O}$.

**[Empirical formula / molecular formula](empirical-molecular-formulas.md)**
:   The simplest mole ratio of the elements, and the whole-number multiple of it that is the real
    molecule.

## Combustion reaction

When a carbon compound burns, all of its carbon ends up in $\ce{CO2}$ and all of its hydrogen ends
up in $\ce{H2O}$.

!!! formula "Combustion reaction"
    $$\text{Hydrocarbon } (\ce{CH4}) + \ce{O2 ->[][\Delta] CO2 + H2O}$$

    The reactant can be a **hydrocarbon** (like $\ce{CH4}$) **or** a carbon compound with N or O
    or other elements. $\Delta$ means heated.

Working backward from the products to the formula of the compound is called
**combustion analysis**. These problems usually look like this:

| Usually given | Usually asked |
|---|---|
| g compound | Molecular formula |
| g $\ce{CO2}$ | Empirical formula |
| g $\ce{H2O}$ | |

## Steps to solve

Find the mass and moles of each element one at a time, then turn the moles into a formula.

### 1) Carbon: look at CO₂

All carbon in $\ce{CO2}$ is from the reactant, and each $\ce{CO2}$ has one C (1:1 ratio).

!!! formula "Combustion analysis — carbon (from CO₂)"
    $$\text{g}_{\ce{CO2}} \rightarrow \text{mol}_{\ce{CO2}} \xrightarrow[\text{1:1 ratio}]{} \text{mol C} \rightarrow \text{g carbon}$$

### 2) Hydrogen: look at H₂O

All hydrogen in $\ce{H2O}$ is from the reactant, and each $\ce{H2O}$ has two H (1:2 ratio).

!!! formula "Combustion analysis — hydrogen (from H₂O)"
    $$\text{g}_{\ce{H2O}} \rightarrow \text{mol}_{\ce{H2O}} \xrightarrow[\text{1:2 ratio}]{} \text{mol H} \rightarrow \text{g hydrogen}$$

### 3) Oxygen: by difference

If the compound contains C, H and O, the oxygen is whatever mass is left after subtracting carbon
and hydrogen.

!!! formula "Combustion analysis — oxygen (by difference)"
    $$\underset{(\text{C, H, O})}{\text{g}_{\text{comp.}}} - [\text{g carbon} + \text{g hydrogen}] = \text{g oxygen} \rightarrow \text{mol O}$$

### 4) Mole ratio

Write the moles of each element as a ratio:

$$\begin{array}{ccccc} \text{C} & : & \text{H} & : & \text{O} \\ \text{mol C} & : & \text{mol H} & : & \text{mol O} \end{array}$$

Divide all three by lowest mole
{.star}

The result is the **empirical formula**. From it, calculate the **empirical formula mass**. If a
ratio comes out as 1.5, 1.33 or 1.25, use the
[rounding rules](empirical-molecular-formulas.md#rounding-rules) instead of rounding.

### 5) Molecular formula

Use the molar mass of the compound to scale the empirical formula up to the molecular formula.

!!! formula "Combustion analysis — molecular formula"
    $$n = \frac{\text{molar mass}}{\text{emp. for. mass}}$$

    $$\text{Molecular formula} = n(\text{emp. formula})$$

## Worked examples

The first example uses all five steps; the second is a quick multiple-choice version where only
carbon and hydrogen can be found.

!!! example "Example: a C, H, O compound"
    **Problem:** A 0.3003 g sample of a compound containing C, H and O is burned, making
    0.4401 g of $\ce{CO2}$ and 0.1802 g of $\ce{H2O}$. The molar mass of the compound is
    60.05 g/mol. Find the empirical and molecular formulas.

    | Given | |
    |---|---|
    | g compound | 0.3003 g |
    | g $\ce{CO2}$ | 0.4401 g |
    | g $\ce{H2O}$ | 0.1802 g |
    | molar mass | 60.05 g/mol |

    **1) Carbon (from $\ce{CO2}$, 1 : 1 ratio)**

    $$0.4401\ \cancel{\text{g}\ \ce{CO2}}\cdot\frac{1\ \cancel{\text{mol}\ \ce{CO2}}}{44.01\ \cancel{\text{g}\ \ce{CO2}}}\cdot\frac{1\ \text{mol C}}{1\ \cancel{\text{mol}\ \ce{CO2}}} = 0.01000\ \text{mol C}$$

    $$0.01000\ \text{mol C}\cdot 12.01\ \text{g/mol} = 0.1201\ \text{g carbon}$$

    **2) Hydrogen (from $\ce{H2O}$, 1 : 2 ratio)**

    $$0.1802\ \cancel{\text{g}\ \ce{H2O}}\cdot\frac{1\ \cancel{\text{mol}\ \ce{H2O}}}{18.02\ \cancel{\text{g}\ \ce{H2O}}}\cdot\frac{2\ \text{mol H}}{1\ \cancel{\text{mol}\ \ce{H2O}}} = 0.02000\ \text{mol H}$$

    $$0.02000\ \text{mol H}\cdot 1.01\ \text{g/mol} = 0.0202\ \text{g hydrogen}$$

    **3) Oxygen (by difference)**

    $$0.3003\ \text{g} - [0.1201\ \text{g} + 0.0202\ \text{g}] = 0.1600\ \text{g oxygen}$$

    $$\frac{0.1600\ \text{g}}{16.00\ \text{g/mol}} = 0.01000\ \text{mol O}$$

    **4) Mole ratio** (divide all three by the lowest, 0.01000 mol)

    $$\begin{array}{ccccc} \text{C} & : & \text{H} & : & \text{O} \\ \dfrac{0.01000}{0.01000} & : & \dfrac{0.02000}{0.01000} & : & \dfrac{0.01000}{0.01000} \\ 1 & : & 2 & : & 1 \end{array}$$

    Empirical formula $= \ce{CH2O}$, empirical formula mass $= 12.01 + 2(1.01) + 16.00 = 30.03\ \text{g/mol}$

    **5) Molecular formula**

    $$n = \frac{60.05\ \text{g/mol}}{30.03\ \text{g/mol}} = 2$$

    $\therefore$ Molecular formula $= 2(\ce{CH2O}) = \ce{C2H4O2}$ (acetic acid, $\ce{CH3COOH}$)

!!! example "Example: which formula fits? (a C, H and N compound)"
    **Problem:** A compound of C, H and N burns to make 44 g of $\ce{CO2}$ and 45 g of
    $\ce{H2O}$. Which answer choice is the compound?

    $$44\ \cancel{\text{g}\ \ce{CO2}}\cdot\frac{1\ \cancel{\text{mol}\ \ce{CO2}}}{44.01\ \cancel{\text{g}\ \ce{CO2}}}\cdot\frac{1\ \text{mol C}}{1\ \cancel{\text{mol}\ \ce{CO2}}} = 1\ \text{mol C}$$

    $$45\ \cancel{\text{g}\ \ce{H2O}}\cdot\frac{1\ \cancel{\text{mol}\ \ce{H2O}}}{18.016\ \cancel{\text{g}\ \ce{H2O}}}\cdot\frac{2\ \text{mol H}}{1\ \cancel{\text{mol}\ \ce{H2O}}} = 5\ \text{mol H}$$

    Mole ratio C : H = 1 : 5, so the compound contains $\ce{CH5}$. Nitrogen doesn't show up in
    $\ce{CO2}$ or $\ce{H2O}$, so pick the choice with C : H = 1 : 5 plus N:

    $\therefore$ $\boxed{\ce{CH5N}}$, which is methylamine, $\ce{CH3NH2}$ (see
    [Nitrogen Bases & Ammonia](../02-foundations-2/nitrogen-bases-ammonia.md#amines)).
