---
title: Salts & Buffers
unit: 4
description: What a salt is, what a buffer is and how to make one, the Henderson–Hasselbalch equation, and a buffer pH problem solved two ways.
sources:
  - {nb: "1", pages: "71-77"}
dates: ["10/15/26", "10/19/26"]
tags: [buffers, salts, Henderson-Hasselbalch, common ion, pKa, RICE]
---

!!! objective "Students will be able to"
    Define buffer solutions and calculate the pH of the buffer solution resulting from a reaction.

!!! objective "Language objectives"
    - Buffer
    - pH, pOH
    - Write equation
    - Strong acids/bases and weak acids/bases, and ionization/reaction

## What is a salt?

When an acid and a base react, the **cation comes from the base** and the **anion comes from the
acid**. Together they make the salt.

```lewis
items:
  - {id: hcl, text: "HCl", label: SA}
  - op: "+"
  - {id: naoh, text: "NaOH", label: SB}
  - op: "->"
  - {id: nacl, text: "NaCl"}
  - op: "+"
  - {text: "H2O"}
arrows:
  - {from: naoh.top, to: nacl.top, label: "cation from base", bend: -34}
  - {from: hcl.bottom, to: nacl.bottom, label: "anion from acid", bend: 44}
caption: The salt's cation comes from the base and its anion from the acid
```

!!! formula "Salt"
    $$\text{Cation from base} + \text{Anion from acid} \;\Longrightarrow\; \text{Salt}$$

$\ce{NH3}$ has a lone pair, which is why it can pick up an $\ce{H+}$ and act as a base. {.star}

!!! teacher "Ms. Boppana"
    "The FREAKING lone pair!" — about $\ce{NH3}$

## Buffers

A **buffer solution** is a solution whose pH doesn't change when small quantities of **strong**
acids or bases are added.

For example, **blood is a buffer** — it stays constant at a pH of about 7.4.

### How a buffer is made

A buffer always has a weak acid and its conjugate base (or a weak base and its conjugate acid)
that share a **common ion**.

1. **Weak acid + conjugate weak base** (the salt of the weak acid). For example,
   $\ce{HF}$ + $\ce{NaF}$:

    ```lewis
    items:
      - {id: hf, text: "HF", label: WA}
      - op: "+"
      - {id: naf, text: "NaF", label: "salt of WA"}
    braces:
      - {from: hf, to: naf, text: "common ion: F-"}
    ```

2. **Weak base + conjugate weak acid** (the salt of the weak base). For example,
   $\ce{NH3}$ with $\ce{NH4+}$, made from $\ce{NH3 + HF -> NH4F}$ ($\ce{NH4F}$ = $\ce{NH4+ + F-}$).
   $\ce{NH4+}$ is just $\ce{NH3}$ with an $\ce{H+}$ on its lone pair, so the two share $\ce{NH3}$.

### Henderson–Hasselbalch equation

The **Henderson–Hasselbalch equation** gives the pH of a buffer. It comes from the $K_a$
expression of the weak acid:

$$\text{weak acid:}\quad \ce{HA <=> H+ + A-} \qquad [\ce{H+}] = \frac{K_a[\ce{HA}]}{[\ce{A-}]}$$

!!! formula memorize "Henderson–Hasselbalch equation"
    $$\text{pH} = \text{p}K_a + \log\left(\frac{[\ce{A-}]}{[\ce{HA}]}\right)$$

!!! formula "Buffer with equal acid and base"
    If the ratio $\dfrac{[\text{B}]}{[\text{A}]} = 1$, then $\text{pH} = \text{p}K_a$.

## Example: buffer from a reaction

!!! example "Problem"
    $0.5\,\text{M}$, 1 L $\ce{CH3COOH}$ reacts with $0.1\,\text{M}$, 1 L $\ce{NaOH}$ solution. What
    is the pH of the solution if $K_a = 1.8\cdot10^{-5}$?

### Method 1: Henderson–Hasselbalch

**1. Net ionic equation.** The weak acid reacts with the strong base (stoichiometry step):

$$\overset{\text{WA}}{\ce{CH3COOH}} + \overset{\text{SB}}{\ce{OH-}} \ce{->} \ce{CH3COO- + HOH}$$

| | $\ce{CH3COOH}$ (ER) | $\ce{OH-}$ (LR) | $\ce{CH3COO-}$ | $\ce{HOH}$ |
|---|:-:|:-:|:-:|:-:|
| **mol** | 0.5 mol $>$ | 0.1 mol | 0.1 mol | 0.1 mol |
| **left over** | 0.4 mol | 0 | 0.1 mol | |

**2. Finish statement** — conclusion of the stoichiometry step (total volume = 2 L):

$$[\ce{CH3COOH}] = \frac{0.4\ \text{mol}}{2\ \text{L}} = 0.2\,\text{M} \qquad [\ce{CH3COO-}] = \frac{0.1\ \text{mol}}{2\ \text{L}} = 0.05\,\text{M} \qquad K_a = 1.8\cdot10^{-5}$$

**3. ID.** $\ce{CH3COOH}$ and $\ce{CH3COO-}$ share the common acetate group — it's a **buffer!**

**4. Henderson equation.**

$$\text{pH} = -\log(1.8\cdot10^{-5}) + \log\left(\frac{0.05\,\text{M}}{0.2\,\text{M}}\right)$$

$$\text{pH} = \boxed{4.14}$$

### Method 2: RICE table

Start at step 3 (after the stoichiometry step).

**3. ID.** $K_a$ was given, so start with the **acid**.

**4. RICE.**

```rice
style: compact
R: "CH3COOH <=> CH3COO- + H+"
I: [0.2M, 0.05M, "0"]
C: [-x, +x, +x]
E: ["$0.2 - x$", "$0.05 + x$", "$x$"]
```

$$K_a = 1.8\cdot10^{-5} = \frac{(0.05 + x)\,x}{0.2 - x} \qquad x = 7.2\cdot10^{-5}\,\text{M}$$

$$\text{pH} = -\log(x) = -\log(7.2\cdot10^{-5}\,\text{M})$$

$$\text{pH} = \boxed{4.14}$$

Both methods give the same answer. {.star}

## The ratio's deep meaning

The ratio in the Henderson–Hasselbalch equation is a ratio of **moles**, not just concentrations.
For example:

$$\frac{[\text{Base}]}{[\text{Acid}]} = 0.347 = \frac{0.347\,\text{M base}}{1\,\text{M acid}} = \frac{0.347\ \text{mol base}}{1\ \text{mol acid}}$$

Adding more water to an already prepared buffer doesn't change its pH. {.star}
