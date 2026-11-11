---
title: Calculating pH
unit: 4
description: The step-by-step method for finding the pH of strong acids, diprotic acids and weak bases — with tags, the stoichiometry step and the equilibrium (RICE) step.
sources:
  - {nb: "1", pages: "67-70"}
dates: ["10/13/26"]
tags: [pH, pOH, strong acids, weak bases, diprotic acids, RICE, tagging]
---

Every pH problem follows the same structure: **write the equation with tags**, then
**calculate**. The work has to be shown exactly this way.

--8<-- "grading-rules.md"

## Tags

Each species and arrow gets a **tag** written above it, so the reader can see which kind of
step it is.

**SA** / **SB**
:   Strong acid / strong base — reacts completely, single arrow ($\rightarrow$).

**WA** / **WB**
:   Weak acid / weak base — partial ionization, double arrow ($\rightleftharpoons$).

**stoic step**
:   Written over a single arrow: a stoichiometry step (amounts go straight across).

**EQ step**
:   Written over a double arrow, with **RICE table** under it: an equilibrium step solved with
    $K_a$ or $K_b$.

## Strong acid

!!! example "Example 1: What is the pH of a 0.1 M HCl solution?"
    **1. Equation (and tag).** Tags go above the species and the arrow.

    $$\underset{0.1\,\text{M}}{\overset{\text{SA}}{\ce{1HCl}}} \ce{->[stoic step]} \underset{0.1\,\text{M}}{\ce{1H+}} + \underset{0.1\,\text{M}}{\ce{1Cl-}} \qquad [\ce{H+}] = 0.1\,\text{M}$$

    **2. Calculate pH.**

    $$[\ce{H+}] = 0.1\,\text{M}$$

    $$\text{pH} = -\log[\ce{H+}] = -\log(0.1)$$

    $$\text{pH} = \boxed{1.00}$$

**Must show all work in this way!** {.star}

## Diprotic acid

A diprotic acid like $\ce{H2SO4}$ gives up its protons in two steps: the first is strong
(stoichiometry), the second is weak (equilibrium).

!!! example "Example 2: What is the pH of 0.2 M H₂SO₄?"
    **1. Equation.**

    ① The first proton comes off completely:

    $$\underset{0.2\,\text{M}}{\overset{\text{SA}}{\ce{1H2SO4}}} \ce{->[stoic step]} \underset{0.2\,\text{M}}{\ce{1H+}} + \underset{0.2\,\text{M}}{\ce{1HSO4-}}$$

    $$[\ce{H+}] = 0.2\,\text{M}, \quad [\ce{HSO4-}] = 0.2\,\text{M}$$

    ② The second proton is an equilibrium:

    $$\overset{\text{WA}}{\ce{HSO4-}} \ce{<=>[EQ step][RICE table]} \ce{H+ + SO4^2-}$$

    The **EQ step requires a $K_a$ value, which may not be provided in the problem!** Find it in
    the textbook: $K_a = 1.2\cdot10^{-2}$.

    ```rice
    style: compact
    R: "HSO4- <=> H+ + SO4^2-"
    I: [0.2M, 0.2M, "0"]
    C: [-x, +x, +x]
    E: ["$0.2 - x$", "$0.2 + x$", "$x$"]
    ```

    $$K_a = 1.2\cdot10^{-2} = \frac{(0.2 + x)(x)}{0.2 - x}$$

    Ignore the $+x$ and $-x$ next to 0.2 (they are small), so $x = 0.012$.

    **2. Solve.** $[\ce{H+}]$ comes from both steps — 0.2 M from the 1st step plus $x$ from the 2nd:

    $$[\ce{H+}] = 0.2 + x = 0.2 + 0.012 = 0.212\,\text{M}$$

    $$\text{pH} = -\log[\ce{H+}] = -\log(0.212)$$

    $$\text{pH} = \boxed{0.674}$$

## Weak base

A weak base reacts with water (HOH) to make $\ce{OH-}$, so it needs an EQ step, a RICE table
and $K_b$.

!!! example "Example 3: What is the pH of a 0.3 M NH₃ solution? (Kₐ = 1.8·10⁻⁵)"
    **1. Equation.**

    $$\underset{(aq)}{\overset{\text{WB}}{\ce{NH3}}} \ce{<=>[HOH, EQ step][RICE table]} \ce{NH4+ + (OH)-}$$

    ```rice
    style: compact
    R: "NH3 <=> NH4+ + (OH)-"
    I: [0.3M, "0", "0"]
    C: [-x, +x, +x]
    E: ["$0.3 - x$", "$x$", "$x = [\\ce{OH-}]$"]
    ```

    **2. Convert $K_a$ to $K_b$.** The problem gives $K_a$, but $\ce{OH-}$ needs $K_b$:

    $$K_b = \frac{1\cdot10^{-14}}{K_a} = \frac{1\cdot10^{-14}}{1.8\cdot10^{-5}} = 5.55\cdot10^{-10}$$

    **3. Solve.**

    $$K_b = 5.55\cdot10^{-10} = \frac{x^2}{0.3 - x} \qquad x = 1.29\cdot10^{-5}\,\text{M} = [\ce{OH-}]$$

    $$\text{pOH} = -\log[\ce{OH-}] = -\log(1.29\cdot10^{-5}) = 4.89$$

    $$\text{pH} = 14 - 4.89 = \boxed{9.11} \;\Rightarrow\; \text{basic}$$

!!! formula "Kb from Ka"
    $$K_b = \frac{1\cdot10^{-14}}{K_a}$$
