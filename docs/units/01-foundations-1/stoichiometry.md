---
title: Stoichiometry
unit: 1
description: The stoichiometry steps, from mole ratio to limiting/excess reagent, theoretical yield and % yield, worked through with NaOH + CaCl₂ — plus Avogadro's number, the per-1-mol-of-LR shortcut and examples that start from moles or molecules.
sources:
  - {nb: "1", pages: "1-4"}
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

Every limiting-reagent problem asks for the same four things: **LR, ER, TY, %Y**. {.star}

!!! formula "Grams to moles"
    $$\frac{\text{g}}{\text{mol mass}} = \text{moles}$$

    Rearranged to go back to grams: $\text{g} = \text{moles}\cdot(\text{mol mass})$.

!!! formula "Percent yield"
    $$\frac{[\text{Actual yield}]\cdot 100\%}{[\text{Theoretical yield}]} = \%\ \text{yield}$$

## Conversion chain

Grams, moles and particles are all ways of counting one substance. The **mole ratio** is the only
bridge from one substance to another, so every problem goes through moles.

!!! formula "Stoichiometry conversion chain"
    $$\text{g A} \xrightarrow{\ \div\ \text{mol mass}\ } \text{mol A} \xrightarrow{\ \text{mole ratio}\ } \text{mol B} \xrightarrow{\ \times\ \text{mol mass}\ } \text{g B}$$

    If the problem gives **molecules** (or atoms), change them to moles first with Avogadro's
    number.

!!! formula "Avogadro's number"
    $$1\ \text{mol} = 6.02\cdot10^{23}\ \text{particles (molecules, atoms or ions)}$$

    $$\text{mol} = \frac{\#\ \text{molecules}}{6.02\cdot10^{23}\ \text{molecules/mol}}$$

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

Focus on the LR: once you know it, every product amount (the theoretical yield) comes from the
LR's moles and the mole ratio. {.star}

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

## Shortcut: the "standard" (per 1 mol of LR)

Dividing every coefficient by the LR's coefficient rewrites the equation **per 1 mol of LR**. Each
other coefficient then becomes the number you multiply the LR's moles by.

!!! formula "Standard (equation per 1 mol of LR)"
    $$\text{mol X} = \frac{\text{coefficient of X}}{\text{coefficient of LR}}\cdot \text{mol LR}$$

For example, $\ce{4Ga + 3O2 -> 2Ga2O3}$ divided by 3 (the coefficient of $\ce{O2}$) becomes
$\tfrac{4}{3}\ \text{mol Ga} + 1\ \text{mol}\ \ce{O2} \rightarrow \tfrac{2}{3}\ \text{mol}\ \ce{Ga2O3}$.
This is used in the Ga example below.

## More worked examples

The same steps work when the problem gives moles or molecules instead of grams.

!!! example "Example: NaOH + CaCl₂ starting from moles"
    **Problem:** 0.25 mol of NaOH reacts with 0.07 mol of $\ce{CaCl2}$. Find the LR, the ER and
    the theoretical yield of NaCl in grams.

    $$\ce{2NaOH + 1CaCl2 -> 1Ca(OH)2 + 2NaCl}$$

    **LR and ER.** 0.07 mol $\ce{CaCl2}$ needs $0.07\ \text{mol}\cdot 2 = 0.14\ \text{mol NaOH}$,
    and we have 0.25 mol, so NaOH is left over.

    $\therefore$ $\ce{CaCl2}$ is the LR and NaOH is the ER.

    | NaOH (ER) | used (need) | unused |
    |:-:|:-:|:-:|
    | 0.25 mol | 0.14 mol | $0.25\ \text{mol} - 0.14\ \text{mol} = 0.11\ \text{mol}$ |

    **Theoretical yield.** Focus on the LR (0.07 mol $\ce{CaCl2}$):

    | Product | Mole ratio | TY (mol) | TY (g) |
    |---|:-:|:-:|:-:|
    | $\ce{Ca(OH)2}$ | 1 : 1 | 0.07 mol | $0.07\ \text{mol}\cdot 74.10\ \text{g/mol} = 5.19\ \text{g}$ |
    | $\ce{NaCl}$ | 1 : 2 | $0.07\ \text{mol}\cdot 2 = 0.14\ \text{mol}$ | $0.14\ \text{mol}\cdot 58.44\ \text{g/mol} = 8.18\ \text{g}$ |

    **b)** If the amount of NaCl made was 12.5 g, what is the % yield?

    $$\%\ \text{yield} = \frac{12.5\ \cancel{\text{g}}\cdot 100\%}{8.18\ \cancel{\text{g}}} = 152.81\%$$

    A % yield **above 100%** is a red flag: a reaction can't make more product than the LR allows.
    It usually means the product was still wet or impure, or something was weighed wrong.

!!! example "Example: 4Ga + 3O₂ → 2Ga₂O₃ (using the standard)"
    **Problem:** 0.5 mol of Ga reacts with 0.20 mol of $\ce{O2}$. How many moles of
    $\ce{Ga2O3}$ form, and how much Ga is left?

    $$\ce{4Ga + 3O2 -> 2Ga2O3}$$

    **Standard (per 1 mol $\ce{O2}$):**
    $\tfrac{4}{3}\ \text{mol Ga} + 1\ \text{mol}\ \ce{O2} \rightarrow \tfrac{2}{3}\ \text{mol}\ \ce{Ga2O3}$

    **LR and ER.** All 0.20 mol $\ce{O2}$ needs
    $\tfrac{4}{3}\cdot 0.20\ \text{mol} = 0.267\ \text{mol Ga}$. We have 0.5 mol Ga.

    $\therefore$ $\ce{O2}$ is the LR and Ga is the ER.

    **Product formed:**

    $$\ce{Ga2O3}:\quad \frac{2}{3}\cdot 0.20\ \text{mol} = \boxed{0.133\ \text{mol}\ \ce{Ga2O3}\ \text{formed}}$$

    | Ga (ER) | used | left |
    |:-:|:-:|:-:|
    | 0.5 mol | 0.267 mol | $0.5\ \text{mol} - 0.267\ \text{mol} = 0.233\ \text{mol}$ |

!!! example "Example: H₂ + Cl₂ starting from molecules"
    **Problem:** $2.0\cdot10^{23}$ molecules of $\ce{H2}$ react with excess $\ce{Cl2}$. How many
    grams of HCl form?

    $$\underset{\text{excess}}{\ce{1Cl2}} + \underset{\text{LR}}{\ce{1H2}} \rightarrow \ce{2HCl}$$

    **Molecules → mol** (Avogadro's number):

    $$2.0\cdot10^{23}\ \cancel{\text{molecules}}\ \ce{H2}\cdot\frac{1\ \text{mol}\ \ce{H2}}{6.02\cdot10^{23}\ \cancel{\text{molecules}}} = 0.332\ \text{mol}\ \ce{H2}$$

    **Mole ratio** ($1\ \text{mol}\ \ce{H2} \rightarrow 2\ \text{mol HCl}$):

    $$0.332\ \text{mol}\ \ce{H2} \rightarrow 2\cdot 0.332\ \text{mol HCl} = \boxed{0.664\ \text{mol HCl}}$$

    **mol → g:**

    $$0.664\ \cancel{\text{mol HCl}}\cdot\frac{36.5\ \text{g}}{1\ \cancel{\text{mol HCl}}} = \boxed{24.2\ \text{g HCl}}$$
