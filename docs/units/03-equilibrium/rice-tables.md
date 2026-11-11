---
title: RICE Tables
unit: 3
description: When to use a RICE table and how to set one up, solve it, and use it to find Kc (PCl5 example).
sources:
  - {nb: "1", pages: "43-46"}
dates: ["9/23/26", "9/24/26"]
tags: [equilibrium, RICE, Kc]
---

## When to use a RICE table

A **RICE table** (Reaction, Initial, Change, Equilibrium) keeps track of how every concentration
changes on the way to equilibrium. Watch for these key words in a problem:

**Initial $[\ ]$**
:   The concentration before the reaction starts, $[X]_0$.

**Change in $[\ ]$**
:   How much each concentration goes up or down, written with $x$.

**Equilibrium $[\ ]$**
:   The concentration once the reaction has settled, $[X]_{eq}$.

In a problem, if you come across **two out of the three** words above, use a RICE table.

!!! teacher "Ms. Boppana"
    "What you serve on your plate is how much you eat."

## Worked example: PCl₅ decomposition

This problem gives the initial amounts and one equilibrium amount, which is two of the three key
words, so it is solved with a RICE table.

!!! example "The problem"
    Gaseous $\ce{PCl5}$ decomposes according to the reaction $\ce{PCl5(g) <=> PCl3 + Cl2}$. At
    300K, a 2L flask initially contained 0.00435 mol $\ce{PCl3}$ and 0.298 mol $\ce{PCl5}$. After
    the reaction system reached equilibrium, 0.002 mol $\ce{Cl2}$ was found in the flask.

### Step 1: Calculate molarity

The table needs concentrations, not moles, so divide each amount by the 2 L volume:

$$[\ce{PCl3}]_0 = \frac{0.00435\ \text{mol}}{2\ \text{L}} = 0.002175\text{M}$$

$$[\ce{PCl5}]_0 = \frac{0.298\ \text{mol}}{2\ \text{L}} = 0.149\text{M}$$

### Step 2: Set up the RICE table

First fill in what you know: the initial concentrations and the equilibrium $[\ce{Cl2}]$.

```rice
R: "1PCl5 <=> 1PCl3 + 1Cl2"
I: [0.149M, 0.002175M, ""]
C: ["", "", ""]
E: ["", "", 0.001M]
labels:
  I: "Initial [ ]"
  C: "C"
  E: "Equilibrium"
```

Then fill in the change row with $x$. There is no $\ce{Cl2}$ at the start, so its initial value
is 0M.

```rice
R: "1PCl5 <=> 1PCl3 + Cl2"
I: [0.149M, 0.002175M, 0M]
C: ["*−xM", "+xM", "+xM"]
E: ["", "", 0.001M]
labels:
  I: "Initial [ ] (M)(P)"
  C: "Change (x)"
  E: "Equilibrium [ ] (M)(P)"
note: "* Negative sign is for reacting/disappearing"
```

### Step 3: Solve the puzzle

Use the column where you know both the start and the end to find $x$, then fill in the rest.

- Since $0\text{M} + x\text{M} = 0.001\text{M}$, $x = 0.001\text{M}$.
- Complete the table by adding down each column.

```rice
style: compact
R: "1PCl5 <=> 1PCl3 + Cl2"
I: [0.149M, 0.002175M, 0M]
C: [-xM, +xM, +xM]
E: [0.148M, 0.003175M, 0.001M]
```

$$[\ce{PCl5}]_{eq} = 0.148\text{M} \qquad [\ce{PCl3}]_{eq} = 0.003175\text{M}$$

### Step 4: Solve for Kc

Put the equilibrium concentrations into the $K_c$ expression.

!!! formula "Kc of PCl₅ ⇌ PCl₃ + Cl₂"
    $$K_c = \frac{[\ce{Cl2}]\,[\ce{PCl3}]}{[\ce{PCl5}]}$$

$$K_c = \frac{0.001\text{M}\cdot0.003175\text{M}}{0.148\text{M}}\ ;\quad K_c = 2.145\cdot10^{-5}$$
