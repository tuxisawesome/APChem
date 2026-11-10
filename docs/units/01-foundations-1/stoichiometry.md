---
title: Stoichiometry
unit: 1
description: The stoichiometry steps, from mole ratio to limiting/excess reagent, theoretical yield and % yield, worked through with NaOH + CaCl₂.
sources:
  - {nb: "10-1", pages: "1-4"}
dates: ["8/25/26"]
tags: [stoichiometry, limiting reagent, percent yield]
---

**Stoichiometry** uses a balanced equation to connect the amounts of reactants and products. Every
problem follows the same chain of steps.

## Steps

1. Start with a completely **balanced equation**.
2. Read the **mole ratio** from the coefficients.
3. Use the formula to change **grams to moles**.
4. Determine:
    - the **limiting reagent (LR)**
    - the **excess reagent (ER)**
    - the **theoretical yield** (given by the LR)
5. Calculate the **% yield**.

!!! formula "Grams to moles"
    $$\frac{\text{g}}{\text{mol mass}} = \text{moles}$$

!!! formula "Percent yield"
    $$\frac{[\text{Actual yield}]\cdot 100\%}{[\text{Theoretical yield}]} = \%\ \text{yield}$$

## Key terms

**Limiting reagent (LR)**
:   The reactant that runs out first. The limiting reagent will dictate the theoretical yield.

**Excess reagent (ER)**
:   The reactant that has moles left over after the reaction.

**Theoretical yield**
:   The amount of product calculated from the LR. It is "theoretical" because we aren't
    calculating it in a lab.

**Actual yield**
:   The amount of product really made, for example the 8.56 g of NaCl in part b) below.

## Worked example: NaOH + CaCl₂

**Problem:** 8 g of NaOH reacts with 10 g of CaCl₂. What is the theoretical yield of Ca(OH)₂ in
grams?

$$\ce{NaOH + CaCl2 -> Ca(OH)2 + NaCl}$$

### 1. Balance the equation

Balancing comes first, because the coefficients give the mole ratio.

$$\ce{2NaOH + CaCl2 -> Ca(OH)2 + 2NaCl}$$

The balanced equation gives the **mole ratio**:

- For every mole of $\ce{CaCl2}$, two moles of $\ce{NaOH}$ are required.
- This reaction generates one mole of $\ce{Ca(OH)2}$ and two moles of $\ce{NaCl}$.

### 2. Convert grams to moles

Change each reactant's mass to moles with $\dfrac{\text{g}}{\text{mol mass}} = \text{moles}$.

| | $\ce{NaOH}$ | $\ce{CaCl2}$ |
|---|---|---|
| **Molar mass** | $22.99 + 16.00 + 1.01 = 40.00\ \text{g/mol}$ | $40.078 + 35.45\cdot 2 = 110.98\ \text{g/mol}$ |
| **Grams** | $8\ \text{g}$ | $10\ \text{g}$ |
| **Moles** | $\dfrac{8\ \text{g}}{40\ \text{g/mol}} = 0.2\ \text{mol}$ | $\dfrac{10\ \text{g}}{110.98\ \text{g/mol}} = 0.09\ \text{mol}$ |

### 3. Mole ratio

Divide both mole amounts by the smaller one to compare them with the 2 : 1 ratio from the equation.

<div class="cols sidebar" markdown>
<div markdown>
$$\frac{0.2}{0.09} : \frac{0.09}{0.09} \;\Longrightarrow\; \underset{\ce{NaOH}}{2.\dot{2}} : \underset{\ce{CaCl2}}{1}$$

Since the ratio is $\ce{2NaOH} : \ce{1CaCl2}$, every mol of $\ce{CaCl2}$ needs 2 mol $\ce{NaOH}$.

$\therefore$ $\ce{CaCl2}$ is the limiting reagent (LR).
</div>
<div markdown>
Sodium hydroxide is in excess: only $2 \times 0.09 = 0.18$ mol is used (2 mol for every 1 mol
$\ce{CaCl2}$), and $0.02$ mol is left over.

$\therefore$ It is the excess reagent (ER).
</div>
</div>

### 4. Theoretical yield

The limiting reagent (0.09 moles) will dictate the theoretical yield. Through the mole ratios, we
can determine that $2\cdot 0.09$ moles (0.18 moles) of $\ce{NaCl}$ is produced. The amounts are
written under each species:

| | $\ce{2NaOH}$ $+$ | $\ce{CaCl2}$ $\rightarrow$ | $\ce{Ca(OH)2}$ $+$ | $\ce{2NaCl}$ |
|---|:-:|:-:|:-:|:-:|
| **given** | 8 g | 10 g | ? g | |
| | ↓ (**ER**) | ↓ (**LR**) | | |
| **mol** | 0.2 mol | 0.09 mol $\xrightarrow[\text{1:1 ratio}]{}$ | 0.09 mol | 0.18 mol<br>(1:2 ratio) |
| | | | ↓ $\times 74.10\ \text{g/mol}$ | ↓ $\times 58.44\ \text{g/mol}$ |
| **mass** | | | 6.669 g | 10.519 g |

The 0.2 mol of $\ce{NaOH}$ (ER) splits into the part that reacts and the part left over:

| used | unused |
|:-:|:-:|
| $0.09 \times 2 = 0.18\ \text{mol}$ | $0.02\ \text{mol}$ |

$\therefore$ Theoretical yield of $\ce{Ca(OH)2}$ = 6.669 g (and of $\ce{NaCl}$ = 10.519 g ≈ 10.52 g).

### b) % yield

**b)** A student made 8.56 g of $\ce{NaCl}$. What is the % yield?

The 8.56 g the student made is the **actual yield**, and 10.52 g is the theoretical yield from
step 4.

$$\%\ \text{yield} = \frac{8.56\ \cancel{\text{g}}\cdot 100\%}{10.52\ \cancel{\text{g}}} = 81.37\%$$
