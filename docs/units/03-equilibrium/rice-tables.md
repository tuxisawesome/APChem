---
title: RICE Tables
unit: 3
description: When to use a RICE table and how to set one up, solve it, and use it to find Kc (PCl5 example), plus practice with coefficients, pressures and using K to find x.
sources:
  - {nb: "1", pages: "43-46"}
  - {nb: "class-notes", pages: "23, 28-29, 51"}
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

The RICE table organizes your data in **molarity** (M). For gases you can also fill it with
**partial pressures** (atm) and use it to find $K_p$, which is why the rows are labeled (M)(P).

!!! teacher "Ms. Boppana"
    "What you serve on your plate is how much you eat."

## Worked example: PCl₅ decomposition

This problem gives the initial amounts and one equilibrium amount, which is two of the three key
words, so it is solved with a RICE table.

!!! example "The problem"
    Gaseous $\ce{PCl5}$ decomposes according to the reaction $\ce{PCl5(g) <=> PCl3(g) + Cl2(g)}$. At
    300K, a 2L flask **initially** contained 0.00435 mol $\ce{PCl3}$ and 0.298 mol $\ce{PCl5}$. After
    the reaction system reached **equilibrium**, 0.002 mol $\ce{Cl2}$ was found in the flask.

    - **a)** Calculate the equilibrium concentrations of all species.
    - **b)** Calculate $K_c$.

### Step 1: Calculate molarity

The table needs concentrations, not moles, so divide each amount by the 2 L volume:

$$[\ce{PCl3}]_0 = \frac{0.00435\ \text{mol}}{2\ \text{L}} = 0.002175\text{M}$$

$$[\ce{PCl5}]_0 = \frac{0.298\ \text{mol}}{2\ \text{L}} = 0.149\text{M}$$

The $\ce{Cl2}$ was measured **at equilibrium**, so its molarity goes in the E row:

$$[\ce{Cl2}]_{eq} = \frac{0.002\ \text{mol}}{2\ \text{L}} = 0.001\text{M}$$

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
- Every coefficient is 1, so every change is $1\cdot x = 0.001\text{M}$: $-0.001\text{M}$ for
  $\ce{PCl5}$ (reacting) and $+0.001\text{M}$ for $\ce{PCl3}$ and $\ce{Cl2}$ (forming).
- Complete the table by adding down each column:
  $0.149\text{M} - 0.001\text{M} = 0.148\text{M}$ and
  $0.002175\text{M} + 0.001\text{M} = 0.003175\text{M}$.

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

**Answers:**

- **a)** $[\ce{PCl5}]_{eq} = 0.148\text{M}$, $[\ce{PCl3}]_{eq} = 0.003175\text{M}$,
  $[\ce{Cl2}]_{eq} = 0.001\text{M}$
- **b)** $K_c = 2.145\cdot10^{-5}$ (no units). K is much smaller than 1, so at 300K the mixture
  is mostly $\ce{PCl5}$: the reactant is favored.

## The RICE recipe

Every RICE problem follows the same steps as the PCl₅ example.

1. **Convert to molarity:** divide moles by liters (or use partial pressures in atm for $K_p$).
2. **R:** write the balanced reaction with every coefficient shown, including 1.
3. **I:** fill in the initial concentrations. A species that isn't there at the start is 0M.
4. **C:** write each change as $x$ times the coefficient. Going forward, reactants get $-$
   (disappearing) and products get $+$ (forming). If both sides start with something, compare
   [Q with K](reaction-quotient.md) first to find the direction.
5. **E:** add down each column.
6. **Solve for x:** use a column where you know both the start and the end, or put the E row into
   K when K is given.
7. **Plug the E row into the K expression.**

!!! formula "RICE table columns"
    $$[X]_{eq} = [X]_0 + \text{change}$$

    $$\text{change} = \pm(\text{coefficient})\cdot x$$

    $-$ for a species that reacts (disappears), $+$ for a species that forms.

## More RICE practice

These problems use the same recipe, with coefficients other than 1, pressures instead of
molarity, and K given instead of an equilibrium amount.

!!! example "Example: a coefficient of 2"
    A 1.00L flask initially contains 0.100 mol $\ce{N2O4}$ and no $\ce{NO2}$. At equilibrium,
    $[\ce{NO2}] = 0.040\text{M}$. Find $K_c$ for $\ce{N2O4(g) <=> 2NO2(g)}$.

    **Molarity:** $[\ce{N2O4}]_0 = \dfrac{0.100\ \text{mol}}{1.00\ \text{L}} = 0.100\text{M}$

    ```rice
    R: "1N2O4 <=> 2NO2"
    I: [0.100M, 0M]
    C: [-xM, +2xM]
    E: ["$0.100 - x$", 0.040M]
    ```

    **Solve for x** with the $\ce{NO2}$ column: $0\text{M} + 2x = 0.040\text{M}$, so
    $x = 0.020\text{M}$. The coefficient 2 means $\ce{NO2}$ forms twice as fast as $\ce{N2O4}$
    disappears.

    $$[\ce{N2O4}]_{eq} = 0.100\text{M} - 0.020\text{M} = 0.080\text{M}$$

    $$K_c = \frac{[\ce{NO2}]^2}{[\ce{N2O4}]} = \frac{(0.040\text{M})^2}{0.080\text{M}}\ ;\quad K_c = 0.020$$

!!! example "Example: a RICE table in pressures (Kp)"
    A flask is filled with $\ce{SO3}$ gas at 1.00 atm. It decomposes by
    $\ce{2SO3(g) <=> 2SO2(g) + O2(g)}$. At equilibrium, $P_{\ce{O2}} = 0.10\ \text{atm}$. Find
    $K_p$.

    The data are pressures, so the table is filled in atm.

    ```rice
    R: "2SO3 <=> 2SO2 + 1O2"
    I: [1.00 atm, 0 atm, 0 atm]
    C: [-2x atm, +2x atm, +x atm]
    E: ["$1.00 - 2x$", "$2x$", 0.10 atm]
    labels:
      I: "Initial (P)"
      C: "Change (x)"
      E: "Equilibrium (P)"
    ```

    **Solve for x** with the $\ce{O2}$ column: $0\ \text{atm} + x = 0.10\ \text{atm}$, so
    $x = 0.10\ \text{atm}$.

    $$P_{\ce{SO3}} = 1.00\ \text{atm} - 2(0.10\ \text{atm}) = 0.80\ \text{atm} \qquad P_{\ce{SO2}} = 2(0.10\ \text{atm}) = 0.20\ \text{atm}$$

    $$K_p = \frac{(P_{\ce{SO2}})^2\cdot(P_{\ce{O2}})}{(P_{\ce{SO3}})^2} = \frac{(0.20)^2\cdot(0.10)}{(0.80)^2}\ ;\quad K_p = 6.25\cdot10^{-3}$$

!!! example "Example: using K to find x"
    For $\ce{H2(g) + I2(g) <=> 2HI(g)}$, $K_c = 64$ at a certain temperature. A flask starts
    with 0.50M $\ce{H2}$, 0.50M $\ce{I2}$ and no $\ce{HI}$. Find every equilibrium concentration.

    No equilibrium amount is given, so the E row stays in terms of $x$ and K is used to solve
    for it.

    ```rice
    style: compact
    R: "1H2 + 1I2 <=> 2HI"
    I: [0.50M, 0.50M, 0M]
    C: [-xM, -xM, +2xM]
    E: ["$0.50 - x$", "$0.50 - x$", "$2x$"]
    ```

    $$K_c = \frac{[\ce{HI}]^2}{[\ce{H2}]\cdot[\ce{I2}]} = \frac{(2x)^2}{(0.50 - x)(0.50 - x)} = 64$$

    Both sides are perfect squares, so take the square root of each side:

    $$\frac{2x}{0.50 - x} = 8 \quad\Rightarrow\quad 2x = 4.0 - 8x \quad\Rightarrow\quad 10x = 4.0 \quad\Rightarrow\quad x = 0.40\text{M}$$

    $$[\ce{H2}]_{eq} = [\ce{I2}]_{eq} = 0.50\text{M} - 0.40\text{M} = 0.10\text{M} \qquad [\ce{HI}]_{eq} = 2(0.40\text{M}) = 0.80\text{M}$$

    **Check:** $\dfrac{(0.80)^2}{(0.10)(0.10)} = \dfrac{0.64}{0.010} = 64\ \checkmark$

!!! example "Example: when the reaction runs in reverse"
    Same reaction ($K_c = 64$), but the flask starts with only 1.00M $\ce{HI}$.

    With no reactants at the start, the denominator of Q is 0, so Q is huge and $Q > K$: the
    **reverse** reaction is favored. The signs in the change row flip: $\ce{HI}$ disappears
    ($-$) while $\ce{H2}$ and $\ce{I2}$ form ($+$).

    ```rice
    style: compact
    R: "1H2 + 1I2 <=> 2HI"
    I: [0M, 0M, 1.00M]
    C: [+xM, +xM, -2xM]
    E: ["$x$", "$x$", "$1.00 - 2x$"]
    ```

    $$\frac{(1.00 - 2x)^2}{x\cdot x} = 64 \quad\Rightarrow\quad \frac{1.00 - 2x}{x} = 8 \quad\Rightarrow\quad 1.00 = 10x \quad\Rightarrow\quad x = 0.10\text{M}$$

    $$[\ce{H2}]_{eq} = [\ce{I2}]_{eq} = 0.10\text{M} \qquad [\ce{HI}]_{eq} = 1.00\text{M} - 2(0.10\text{M}) = 0.80\text{M}$$

    This is the **same equilibrium** as the example above: 1.00M $\ce{HI}$ holds exactly the same
    atoms as 0.50M $\ce{H2}$ + 0.50M $\ce{I2}$, so equilibrium is reached from either side.
