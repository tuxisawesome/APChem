---
title: Balancing Redox Reactions
unit: 2
description: Balancing redox reactions with half reactions in acidic (and neutral) medium (MnO₄⁻ + Fe²⁺ and H₂O₂ + Fe²⁺ examples), the extra (OH)⁻ step for basic medium, and finding n = mol e⁻.
sources:
  - {nb: "1", pages: "28-31, 33"}
  - {nb: "class-notes", pages: "27"}
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

Check the answer: both the **atoms** and the total **charge** must be the same on each side. In
the example above, the charge is $5(+2) + 8(+1) + (-1) = +17$ on the left and
$5(+3) + (+2) = +17$ on the right. {.star}

## Example: H₂O₂ + Fe²⁺ in acidic medium

When the problem gives a full molecular equation, first label the oxidation numbers to see what is
oxidized and what is reduced.

$$\ce{H2}\overset{-1}{\ce{O2}} + \overset{+2}{\ce{Fe}}\ce{Cl2} \rightarrow \overset{+3}{\ce{Fe}}\ce{Cl3} + \ce{H2}\overset{-2}{\ce{O}}$$

| Element | Change | What happened | ∴ |
|---|---|---|---|
| Fe | +2 → +3 | Loses e⁻: **oxidized** | $\ce{Fe^2+}$ is the reducing agent |
| O | −1 → −2 (peroxide → water) | Gains e⁻: **reduced** | $\ce{H2O2}$ is the oxidizing agent |

$\ce{Cl-}$ is a spectator ion, so the net ionic equation to balance is:

$$\ce{H2O2 + Fe^2+ -> Fe^3+ + H2O}$$

| Step | Oxidation Half Cell reaction | Reduction Half Cell reaction |
|---|---|---|
| 1 | $\ce{Fe^2+ -> Fe^3+}$ | $\ce{H2O2 -> H2O}$ |
| 2 | $\ce{Fe^2+ -> Fe^3+}$ | $\ce{H2O2 -> H2O}$ |
| 3 | $\ce{Fe^2+ -> Fe^3+}$ | $\ce{H2O2 -> 2H2O}$ |
| 4 | $\ce{Fe^2+ -> Fe^3+}$ | $\ce{2H+ + H2O2 -> 2H2O}$ |
| 5 | $\ce{Fe^2+ -> Fe^3+ + e-}$ | $\ce{2e- + 2H+ + H2O2 -> 2H2O}$ |
| 6 | $\ce{2Fe^2+ -> 2Fe^3+ + 2e-}$ | $\ce{2e- + 2H+ + H2O2 -> 2H2O}$ |
| | | **n = 2 mol e⁻** |

**Step 7 – Add both equations.** The 2e⁻ on each side cancel:

$$\ce{2Fe^2+} + \cancel{\ce{2e-}} + \ce{2H+ + H2O2} \rightarrow \ce{2Fe^3+} + \cancel{\ce{2e-}} + \ce{2H2O}$$

**Step 8 – Net equation**, boxed with n:

!!! formula "Redox: H₂O₂ + Fe²⁺ (acidic medium)"
    $$\boxed{\ce{2Fe^2+ + 2H+ + H2O2 -> 2Fe^3+ + 2H2O}} \qquad n = 2\ \text{mol}\ e^-$$

Charge check: $2(+2) + 2(+1) = +6$ on the left and $2(+3) = +6$ on the right.

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
