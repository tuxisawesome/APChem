---
title: Strong & Weak Acids, Neutralization
unit: 2
description: Strong vs. weak acids (one direction → vs. two directions ⇌), molarity with acetic acid examples, neutralization with the acid-spill example, and the reaction types key.
sources:
  - {nb: "1", pages: "15-17"}
dates: ["9/2/26"]
tags: [acids, strong acid, weak acid, molarity, neutralization, reaction types]
---

## Strong vs. weak acids

Acids are sorted by how much they **ionize** (split into ions) in **aqueous** solution, which
means a solution in water. In aqueous solution, **strong acids** dissociate completely into ions;
weak acids only partly do.

<div class="tchart" markdown>
<div markdown>
**Strong Acid**

- **100% ionization** in aqueous solutions.
    - Dilute HCl (HCl solution) has 100% ionization.
    - Concentrated HCl does not break apart.
- The reaction goes in **one direction** ($\rightarrow$).

!!! formula "Strong acid ionization (one direction)"
    $$\ce{HCl(aq) -> H+ + Cl-}$$

</div>
<div markdown>
**Weak Acid**

- **Partial ionization** in aqueous solutions.
- The reaction goes in **two directions** ($\rightleftharpoons$).

!!! formula "Weak acid ionization (two directions)"
    $$\ce{HF(aq) <=> H+ + F-}$$

</div>
</div>

### Concentrated vs. dilute

Whether a substance splits into ions depends on how much water surrounds it.

| Solution | Splits into ions? |
|---|---|
| **Concentrated** | No |
| **Dilute** | Yes |

Concentrated solids, liquids and gases don't break apart. {.star}

Only ionic compounds in solution may or may not break apart. {.star}

## Molarity

**Molarity** ("molar", M) measures the concentration of a solution: moles of solute per liter of
solution.

!!! formula "Molarity"
    $$\text{Molar}\ (M) = \frac{\text{mol}}{\text{L sln}}$$
    For example, $18M = \dfrac{18\ \text{mol}}{1\ \text{L}}$.

    Rearranged: $\text{mol} = M\cdot \text{L}$ and $\text{L} = \dfrac{\text{mol}}{M}$.

Molarity problems usually chain together two conversions: grams ↔ moles (with the molar mass) and
moles ↔ liters (with the molarity). Always change mL to L first.

!!! example "Example: molarity of an acetic acid solution"
    **Problem:** 22 g of acetic acid, $\ce{CH3COOH}$ (mol mass = 60 g/mol), is dissolved to make
    250 mL of solution. What is the molarity?

    $$\text{mol}\ \ce{CH3COOH} = \frac{22\ \cancel{\text{g}}}{60\ \cancel{\text{g}}/\text{mol}} = 0.367\ \text{mol}$$

    $$M = \frac{\text{mol}}{\text{L}} = \frac{0.367\ \text{mol}}{0.250\ \text{L}} = \boxed{1.47\ M}$$

!!! example "Example: grams of solute from molarity"
    **Problem:** How many grams of acetic acid ($60.05\ \text{g/mol}$) are in 30.0 mL of a
    2.5 M solution?

    $$\text{mol} = M\cdot\text{L} = 2.5\ \frac{\text{mol}}{\cancel{\text{L}}}\cdot 0.0300\ \cancel{\text{L}} = 0.075\ \text{mol}$$

    $$\text{g} = \text{mol}\cdot(\text{mol mass}) = 0.075\ \cancel{\text{mol}}\cdot 60.05\ \frac{\text{g}}{\cancel{\text{mol}}} = \boxed{4.50\ \text{g}}$$

Acetic acid is a **weak acid** (it's not on the strong acid list), so like HF its solutions only
partly ionize, in two directions (⇌).

## Neutralization

An acid and a base cancel each other out.

**Neutralize**
:   To make the solution neutral.

!!! formula "Neutralization"
    $$\text{Acid} + \text{Base} \rightarrow \text{Salt} + \text{Water}$$

!!! example "Example: neutralizing an acid spill with baking soda"
    A student accidentally spills a 1.00 L bottle of concentrated 18.0 M sulfuric acid ($\ce{H2SO4}$)
    on the floor of the laboratory. The student attempts to neutralize the spill by pouring a 5.00 kg
    box of baking soda (Sodium Bicarbonate, $\ce{NaHCO3}$) onto the acid.

    **What we are given:**

    | Substance | What we know | Moles |
    |---|---|---|
    | $\ce{H2SO4}$ | 1 L of 18M | $1\ \text{L} \cdot \dfrac{18\ \text{mol}}{1\ \text{L}} = 18\ \text{mol}\ \ce{H2SO4}$ |
    | $\ce{NaHCO3}$ | 5000 g of solid (concentrated) | found in step 3 |

    **Step 1 – Swap the partners.** The $\ce{H+}$ trades places with the $\ce{Na+}$, so it ends up
    with the $\ce{(HCO3)-}$:

    ```lewis
    items:
      - {id: h, text: "H^+"}
      - {text: "(SO4)^{2−}"}
      - op: "+"
      - {text: "Na^+"}
      - {id: hco3, text: "(HCO3)^-"}
    arrows:
      - {from: h, to: hco3, bend: -40}
    ```

    $$\ce{Na+}\ \ce{(SO4)^2-} + \ce{H+}\ \ce{(HCO3)-}$$
    $$\ce{Na2SO4 + H2CO3}$$

    **Step 2 – Balance the equation.**

    $$\ce{1H2SO4 + 2NaHCO3 -> Na2SO4 + 2H2CO3}$$

    **Step 3 – Find the moles of baking soda.** The molar mass of sodium bicarbonate is
    $84.008\ \text{g/mol}$.

    $$\text{mol}\ \ce{NaHCO3}:\quad 5000\ \text{g} \cdot \frac{1\ \text{mol}}{84.008\ \text{g}} = 59.52\ \text{mol}$$

    **Step 4 – Use the 1 : 2 mole ratio.**

    $$18\ \text{mol}\ \ce{H2SO4} \cdot \frac{2\ \text{mol}\ \ce{NaHCO3}}{1\ \text{mol}\ \ce{H2SO4}} = 36\ \text{mol}\ \ce{NaHCO3}$$

    $$59.52\ \text{mol} - 36\ \text{mol} = 23.5\ \text{mol}$$

    $\therefore$ 36 mol of $\ce{NaHCO3}$ is used and 23.5 mol is left unused.

!!! example "Example: the same reaction with calcium carbonate"
    Calcium carbonate neutralizes sulfuric acid the same way: the partners swap.

    $$\ce{CaCO3 + H2SO4 -> CaSO4 + H2CO3}$$
    $$\ce{Ca^2+}\ \ce{(CO3)^2-} + \ce{2H+}\ \ce{(SO4)^2-} \rightarrow \ce{CaSO4 + H2CO3}$$

## Reaction types key

The notebook sketches the four basic reaction types with boxes. With letters standing for the
boxes, they are:

!!! formula "Reaction types (generic forms)"
    | Generic form | Type |
    |---|---|
    | $A + B \rightarrow AB$ | **Synthesis** |
    | $AB \rightarrow A + B$ | **Decomposition** |
    | $AB + C \rightarrow CB + A$ | **Single Replacement** |
    | $AB + CD \rightarrow AD + CB$ | **Double Replacement** |
