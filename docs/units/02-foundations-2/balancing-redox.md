---
title: Balancing Redox Reactions
unit: 2
description: Balancing redox reactions with half reactions in acidic (and neutral) medium, the extra (OH)⁻ step for basic medium, and finding n = mol e⁻.
sources:
  - {nb: "1", pages: "28-31, 33"}
dates: ["9/11/26", "9/14/26", "9/16/26"]
tags: [redox, half reactions, balancing, acidic medium, basic medium]
---

!!! objective "Students will be able to"
    Balance a redox reaction in basic medium.

!!! memorize "Text to memorize"
    **lose** e⁻ oxidize, **gain** e⁻ reduce

## Half reactions

A redox reaction is balanced by splitting it into two **half reactions** (one oxidation, one
reduction), balancing each one, and then adding them back together. Along the way you find
**n**, the moles of electrons transferred.

!!! formula "n (moles of electrons transferred)"
    $$n = \text{mol}\ e^-\ \text{transferred}$$
    Box the final eqn w/ n = moles e⁻.

## Steps (acidic medium)

Acidic medium and neutral medium are balanced the same way. {.star}

1. Split the reaction into two parts (the oxidation and reduction half reactions).
2. Balance the atoms that are not O or H.
3. Balance oxygen by adding water: $1\ \ce{H2O}$ balances $1\ \text{O}$.
4. Balance hydrogen by adding $\ce{H+}$.
5. Balance charge by adding $\ce{e-}$.
6. Make the number of $\ce{e-}$ equal by multiplying by integer(s).
    - This gives n. In the example below, n = 5 mol e⁻.
7. Add both equations and reduce the coefficient ratio.
8. Find the net equation (and n).

Balancing adds to the **opposite** side. {.star}

## Example: MnO₄⁻ + Fe²⁺ in acidic medium

$$\ce{MnO4- + Fe^2+ -> Fe^3+ + Mn^2+}$$

Each row of the ledger applies one step to both half reactions.

| Step | Oxidation Half Cell reaction | Reduction Half Cell reaction |
|---|---|---|
| 1 | $\ce{Fe^2+ -> Fe^3+}$ | $\ce{MnO4- -> Mn^2+}$ |
| 2 | $\ce{Fe^2+ -> Fe^3+}$ | $\ce{MnO4- -> Mn^2+}$ |
| 3 | $\ce{Fe^2+ -> Fe^3+}$ | $\ce{MnO4- -> Mn^2+ + 4H2O}$ |
| 4 | $\ce{Fe^2+ -> Fe^3+}$ | $\ce{8H+ + MnO4- -> Mn^2+ + 4H2O}$ |
| 5 | $\ce{Fe^2+ -> Fe^3+ + e-}$ | $\ce{5e- + 8H+ + MnO4- -> Mn^2+ + 4H2O}$ |
| 6 | $\ce{5Fe^2+ -> 5Fe^3+ + 5e-}$ | $\ce{5e- + 8H+ + MnO4- -> Mn^2+ + 4H2O}$ |
| | | **n = 5 mol e⁻** |

**Step 7 – Add both equations.** The 5e⁻ on each side cancel:

$$\ce{5Fe^2+} + \cancel{\ce{5e-}} + \ce{8H+ + MnO4-} \rightarrow \ce{5Fe^3+} + \cancel{\ce{5e-}} + \ce{Mn^2+ + 4H2O}$$

**Step 8 – Net equation**, boxed with n:

!!! formula "Redox: MnO₄⁻ + Fe²⁺ (acidic medium)"
    $$\boxed{\ce{5Fe^2+ + 8H+ + MnO4- -> 5Fe^3+ + Mn^2+ + 4H2O}} \qquad n = 5\ \text{mol}\ e^-$$

!!! abstract "Summary"
    1. Divide the equation into oxidation & reduction reactions.
    2. Balance the other atoms (not O, H).
    3. Balance O by adding $\ce{H2O}$.
    4. Balance H by adding $\ce{H+}$.
    5. Balance charge by adding $\ce{e-}$.
    6. Balance $\ce{e-}$ by multiplying by an integer.
    7. Add both equations and reduce ratios if applicable.

    Box the final eqn w/ n = moles e⁻.

## Basic medium

Balance the reaction as if it were in acidic medium, then do one **added step**: add an equal #
of $\ce{(OH)-}$ for each $\ce{H+}$, to both sides. Each $\ce{H+}$ and $\ce{(OH)-}$ pair becomes
water.

!!! formula "Basic medium: H⁺ + (OH)⁻ → H₂O"
    $$\ce{H+ + (OH)- -> H2O}$$

!!! example "Example: Br⁻ + MnO₄⁻ in basic medium"
    Start from the equation balanced in acidic medium and add $2\ce{(OH)-}$ to both sides:

    $$\ce{Br-} + \ce{2MnO4-} + \underset{+\,2\ce{(OH)-}}{\ce{2H+}} \rightarrow \ce{BrO3-} + \ce{2MnO2} + \underset{+\,2\ce{(OH)-}}{\ce{H2O}}$$

    The $\ce{2H+}$ and $2\ce{(OH)-}$ combine into $\ce{2H2O}$:

    $$\ce{Br-} + \ce{2MnO4-} + \ce{2H2O} \rightarrow \ce{BrO3-} + \ce{2MnO2} + \ce{H2O} + \ce{2(OH)-}$$

    Cancel the $\ce{H2O}$ that appears on both sides, then box the final equation with n:

    $$\boxed{\ce{Br- + 2MnO4- + H2O -> BrO3- + 2MnO2 + 2(OH)-}} \qquad n = 6\ \text{mol}\ e^-$$
