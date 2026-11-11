---
title: Empirical & Molecular Formulas
unit: 1
description: Empirical vs. molecular formula, n = molecular mass ÷ empirical mass, the g → mol → mol ratio table with rounding rules, an iron oxide % composition example, and the unknown P & F compound example.
sources:
  - {nb: "1", pages: "5-10"}
dates: ["8/26/26", "8/27/26"]
tags: [empirical formula, molecular formula, ideal gas law]
---

!!! objective "Students will be able to"
    Calculate the empirical formula & molecular formula of a given compound, and then be able to
    use [Ideal Gas Equations](ideal-gas-equations.md) & Dalton's law of partial pressures to
    determine an unknown metal in a different problem.

## Empirical vs. molecular formula

A compound has two kinds of formula: the reduced ratio of its atoms, and the real number of atoms
in one molecule.

**Empirical formula**
:   The simplest mole ratio of elements in a compound. For example, CH.

**Molecular formula**
:   A multiple of the empirical formula. For example, C₂H₂ is 2 × CH.

To get from one to the other, find how many empirical units fit into the molecular mass:

!!! formula "Molecular formula from the empirical formula"
    $$\text{Molecular formula} = n(\text{Emp. formula})$$

    where

    $$n = \frac{\text{molecular mass}}{\text{empirical mass}}$$

    $n$ is always a whole number (an integer). The molecular mass will be given to you in a
    problem.

If the molecular mass isn't given directly, find it first, for example with the
[ideal gas equation](ideal-gas-equations.md) as in the P & F example below.

!!! example "Example: molecular formula from the empirical formula CH"
    If the empirical formula is CH and the molecular mass is 26 g/mol, what is the molecular
    formula?

    | Empirical mass | Molecular mass |
    |:-:|:-:|
    | $(\underset{\text{C}}{12.01} + \underset{\text{H}}{1.01})\ \text{g/mol} = 13.02\ \text{g/mol}$ | 26 g/mol |

    $$n = \frac{26\ \cancel{\text{g/mol}}}{13.02\ \cancel{\text{g/mol}}} \approx 2$$

    $\therefore$ Molecular formula: $(\ce{CH})_2 = \ce{C2H2}$

## Calculating an empirical formula

Set up a table with one row per element and work across it from left to right:
% element → g → mol → mol ratio → final mol ratio. The mol ratio column divides each element's
moles by the **lowest** number of moles, and the final column turns those into **whole numbers**.

| | % element | g | mol | mol ratio | final mol ratio (whole #) |
|:-:|:-:|:-:|:-:|:-:|:-:|
| **X** | | $\text{g}_X$ | $\text{mol}_X = \dfrac{\text{g}}{\text{mol mass}}$ | $\dfrac{\text{mol X}}{\text{lowest mol}} = \#$ | whole # |
| **Y** | | $\text{g}_Y$ | $\text{mol}_Y = \dfrac{\text{g}}{\text{mol mass}}$ | $\dfrac{\text{mol Y}}{\text{lowest mol}} = \#$ | whole # |

The whole numbers become the subscripts of the **empirical formula (EF)**. Add up the atomic
masses in the EF to get the **EF mass**, which you need for $n$.

If the problem gives percentages, assume a **100 g sample**: then the % of each element is its
mass in grams (40.0% C becomes 40.0 g C). {.star}

!!! formula "Mole ratio (empirical formula)"
    $$\text{mol ratio} = \frac{\text{mol X}}{\text{lowest mol}} = \#$$

### Rounding rules

The numbers in a formula must be whole numbers. When a mole ratio ends in one of these decimals,
**multiply** the whole ratio instead of rounding it:

| Rule | Ratio you get | Multiply by | Work | Whole-number ratio |
|---|:-:|:-:|:-:|:-:|
| **0.5 × 2 rule** | 1.5 : 1 | × 2 | $(1.5)\times2 : 1\times2$ | 3 : 2 |
| **0.33 × 3 rule** | 1.33 : 1 | × 3 | $(1.33)\times3 : 1\times3 = 3.99 : 3$ | 4 : 3 |
| **0.25 × 4 rule** | 1.25 : 1 | × 4 | $(1.25)\times4 : 1\times4 = 5.00 : 4$ | 5 : 4 |

Multiply **every** number in the ratio, not just the one with the decimal. {.star}

All other decimals round like normal.

## Worked example: iron oxide from percent composition

This example fills in the whole table, including a mole ratio that needs the 0.5 × 2 rule.

**Problem:** An oxide of iron is 69.94% Fe and 30.06% O by mass. Find its empirical formula.

Assume a 100 g sample, so the percentages become grams:

| | % element | g | mol | mol ratio | final mol ratio (whole #) |
|:-:|:-:|:-:|:-:|:-:|:-:|
| **Fe** | 69.94% | 69.94 g | $\dfrac{69.94\ \text{g}}{55.85\ \text{g/mol}} = 1.252\ \text{mol}$ | $\dfrac{1.252}{1.252} = 1$ | $1\times2 = 2$ |
| **O** | 30.06% | 30.06 g | $\dfrac{30.06\ \text{g}}{16.00\ \text{g/mol}} = 1.879\ \text{mol}$ | $\dfrac{1.879}{1.252} = 1.50$ | $1.5\times2 = 3$ |

The O ratio ends in .5, so the **0.5 × 2 rule** multiplies both numbers by 2.

$\therefore$ EF $= \ce{Fe2O3}$

$$\text{EF mass} = 2(55.85) + 3(16.00) = 159.70\ \text{g/mol}$$

## Worked example: unknown P & F compound

This problem uses the ideal gas equation to find the molar mass, then a precipitate to find the
empirical formula.

**Problem:** A compound of P & F was heated until all of it converted to gas, with a volume of
378 cm³ at 77 °C and a pressure of 97.3 mmHg. The gas, whose mass was 0.2324 g, was treated with
$\ce{CaCl2}$ and heated until all the fluorine changed to $\ce{CaF2}$ (0.2631 g). Find the formula
of $\ce{P_{x}F_{y}}$.

### 1. Molar mass of the compound (PV = nRT)

First convert the givens into the units of $R$, using $760\ \text{mmHg} = 1\ \text{atm}$ and
$0\ {}^\circ\text{C} = 273.15\ \text{K}$.

| Given | Converted | Variable |
|---|---|:-:|
| 97.3 mmHg | 0.128 atm | $P$ |
| 77 °C | 350.15 K | $T$ |
| 378 cm³ | 0.378 L | $V$ |
| 0.2324 g $\ce{P_{x}F_{y}}$ | | mass |

Then solve $PV = nRT$ for $n$, with $R = 0.08206\ \dfrac{\text{L}\cdot\text{atm}}{\text{mol}\cdot\text{K}}$:

$$\begin{aligned} \frac{PV}{RT} = n &= \frac{(0.128\ \text{atm})(0.378\ \text{L})}{(350.15\ \text{K})\left(0.08206\ \frac{\text{L}\cdot\text{atm}}{\text{mol}\cdot\text{K}}\right)} \\ &= \text{mol compound} = 0.00168\ \text{mol} \end{aligned}$$

Molar mass is grams per mole:

$$\text{molar mass} = \frac{0.2324\ \text{g}}{0.00168\ \text{mol}} = \boxed{138.3\ \text{g/mol}}$$

### 2. Grams of F (from CaF₂)

All the fluorine ends up in the $\ce{CaF2}$, so the mass of $\ce{CaF2}$ tells how much F was in the
compound.

$$\ce{P_{x}F_{y} + CaCl2 -> CaF2}$$

With $\ce{CaF2} = 78.08\ \text{g/mol}$:

$$\frac{0.2631\ \text{g}}{78.08\ \text{g/mol}} = 0.003370\ \text{mol}\ \ce{CaF2}$$

$$0.003370\ \text{mol}\ \ce{CaF2}\cdot\frac{2\ \text{mol F}}{1\ \text{mol}\ \ce{CaF2}} = 0.006740\ \text{mol F}$$

$$0.006740\ \text{mol F}\cdot 19.00\ \text{g/mol} = 0.128\ \text{g F}$$

### 3. Grams of P

The compound is only P and F, so the rest of its mass is phosphorus.

| (P, F) compound | F |
|---|---|
| 0.2324 g | 0.00674 mol F |
| 138.3 g/mol | 0.128 g F |

$$\text{g P} = 0.2324\ \text{g} - 0.128\ \text{g} = 0.1044\ \text{g P}$$

$$\frac{0.1044\ \text{g}}{30.97\ \text{g/mol}} = 0.00337\ \text{mol P}$$

### 4. Mole ratio and empirical formula

Divide the moles to get the ratio of F to P:

$$\text{mole ratio: } \frac{\text{F}}{\text{P}} = \frac{0.00674}{0.00337} \approx \frac{2}{1}$$

$\therefore$ $2\text{F} = 1\text{P}$, so the empirical formula is $\ce{PF2}$.

$$\text{Empirical mass} = 30.97 + 2\cdot 19.00 = 68.97\ \text{g/mol}$$

### 5. Molecular formula

Compare the molar mass from step 1 with the empirical mass:

$$n = \frac{138.3\ \text{g/mol}}{68.97\ \text{g/mol}} \approx 2$$

$\therefore$ Molecular formula $= 2(\ce{PF2}) = \ce{P2F4}$
