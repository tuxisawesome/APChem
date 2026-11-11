---
title: Net Ionic Equations & Titration
unit: 2
description: Reactive vs. spectator ions, the steps for writing net ionic equations (strong and weak acid + base, precipitations), and titration with its mole ratio.
sources:
  - {nb: "1", pages: "18, 22"}
  - {nb: "class-notes", pages: "9, 14, 19, 21, 93-94, 96"}
dates: ["9/2/26", "9/8/26"]
tags: [net ionic equations, spectator ions, titration, precipitation]
---

## Reactive vs. spectator ions

When ionic compounds react in solution, only some of the ions actually take part.

**Reactive ions**
:   Ions that are active in a reaction. In acid (especially strong acids), $\ce{H+}$ is the
    reactive ion.

**Spectator ions**
:   Ions that do not participate in a reaction. **Group IA metals are always spectator ions.**

A **net ionic equation** keeps only the reactive ions and leaves the spectators out.

Net ionic equations are based on memorizing the [solubility chart](solubility-rules.md)! {.star}

## Steps to write a net ionic equation

Every net ionic equation (NIE) is built the same way, starting from the full molecular equation.

1. Write the balanced **molecular equation** (swap partners to predict the products). Tag every
   acid and base: SA, SB, WA, WB.
2. Write the **complete ionic equation**: split into ions only the things that really are ions in
   water (see the table below).
3. **Cross out** the spectator ions, the ones that appear unchanged on both sides.
4. **Reduce** the coefficients if they all share a factor.

| Split into ions? | What | Example |
|---|---|---|
| **Yes** | Strong acids (SA) | $\ce{HCl -> H+ + Cl-}$ |
| **Yes** | Strong bases (SB) | $\ce{KOH -> K+ + OH-}$ |
| **Yes** | Soluble ionic compounds (aq) | $\ce{NaCl(aq) -> Na+ + Cl-}$ |
| **No**, keep together | Weak acids (WA) | $\ce{HF}$, $\ce{CH3COOH}$ |
| **No**, keep together | Molecular compounds, including weak bases (WB) | $\ce{NH3}$, $\ce{CH3NH2}$ |
| **No**, keep together | Water | $\ce{HOH}$ |
| **No**, keep together | Solids and precipitates (s), gases (g) | $\ce{CaCO3(s)}$, $\ce{CO2(g)}$ |

## Net ionic equation: acid + base

When a strong acid meets a strong base, everything splits except the water, so only $\ce{H+}$ and
$\ce{OH-}$ are left.

!!! example "Example: NaOH + HCl"
    $$\ce{NaOH(aq) + HCl -> NaCl(aq) + H2O}$$

    $\ce{Na+}$ (a Group IA metal) and $\ce{Cl-}$ are spectators, so only $\ce{OH-}$ and $\ce{H+}$
    are left in the net ionic equation.

!!! formula "Net ionic: strong acid + strong base"
    $$\ce{OH- + H+ -> H2O}$$

!!! example "Example: H₂SO₄ + KOH (reduce the coefficients)"
    **a) Molecular equation**

    $$\underset{\text{SA}}{\ce{H2SO4}} + \underset{\text{SB}}{\ce{2KOH}} \rightarrow \ce{K2SO4 + 2HOH}$$

    **Complete ionic equation.** Everything splits except the water. $\ce{K+}$ (Group IA) and
    $\ce{(SO4)^2-}$ are spectators:

    $$\ce{2H+} + \cancel{\ce{(SO4)^2-}} + \cancel{\ce{2K+}} + \ce{2OH-} \rightarrow \cancel{\ce{2K+}} + \cancel{\ce{(SO4)^2-}} + \ce{2H2O}$$

    **b) NIE**

    $$\ce{2H+ + 2OH- -> 2H2O}$$

    All the coefficients share a factor of 2, so reduce:
    $\overset{\checkmark}{\ce{H+ + OH- -> H2O}}$, the same NIE as every strong acid + strong base.

### Weak acid + strong base

A **weak acid** only partly ionizes, so it stays together as a molecule in the NIE. Only the
$\ce{OH-}$ from the strong base reacts with it.

!!! formula "Net ionic: weak acid + strong base"
    $$\ce{HF + OH- -> F- + H2O}$$

    For example, HF + NaOH: HF stays together and $\ce{Na+}$ is a spectator.

!!! example "Example: HF + Sr(OH)₂"
    $$\underset{\text{WA}}{\ce{2HF}} + \underset{\text{SB}}{\ce{Sr(OH)2}} \rightarrow \ce{SrF2 + 2HOH}$$

    - HF is a **weak acid**, so it stays together.
    - $\ce{Sr(OH)2}$ is a **strong base** (Sr is a heavy metal), so it splits into
      $\ce{Sr^2+ + 2OH-}$.
    - $\ce{SrF2}$ is **insoluble** (like $\ce{CaF2}$), so it stays together as a solid.

    $$\ce{2HF + Sr^2+ + 2OH- -> SrF2(s) + 2H2O}$$

    Nothing appears unchanged on both sides, so there are no spectators and this is already the NIE.
    If the fluoride stayed dissolved (as with NaOH or KOH), the metal ion would be a spectator and
    the NIE would reduce to $\ce{HF + OH- -> F- + H2O}$.

Weak bases work the same way: an amine stays together and grabs the $\ce{H+}$ from a strong acid
(see [Amine + strong acid](nitrogen-bases-ammonia.md#amine-strong-acid)).

## Net ionic equation: precipitation

When two ionic solutions mix and the swapped partners form an insoluble solid, the net ionic
equation shows only the ions that make the solid. Here, sodium carbonate solution reacts with
calcium chloride solution.

| Compound | Formula | Ions |
|---|---|---|
| Sodium carbonate | $\ce{Na2CO3}$ | $\ce{Na^{+1}}\ \ce{(CO3)^{-2}}$ |
| Calcium chloride | $\ce{CaCl2}$ | $\ce{Ca^{+2}}\ \ce{Cl^{-1}}$ |

Swapping partners gives $\ce{Ca^2+}\ \ce{(CO3)^2-}$ and $\ce{Na^{+1}}\ \ce{Cl^{-1}}$.

!!! formula "Precipitation: Na₂CO₃ + CaCl₂ (molecular)"
    $$\ce{Na2CO3(aq) + CaCl2(aq) -> CaCO3(s) + 2NaCl(aq)}$$

<div class="cols ruled" markdown>
<div markdown>
**Net ionic eqn: cross out the spectators**

$$\cancel{\ce{2Na+}} + \ce{(CO3)^2-} + \ce{Ca^2+} + \cancel{\ce{2Cl-}}$$
$$\downarrow$$
$$\ce{CaCO3(s)} + \cancel{\ce{2Na+}} + \cancel{\ce{2Cl-}}$$

</div>
<div markdown>
$\ce{Na+}$ and $\ce{Cl-}$ are spectator ions, so the net ionic equation is:

!!! formula "Net ionic: CaCO₃ precipitation"
    $$\ce{Ca^2+ + (CO3)^2- -> CaCO3(s)}$$

</div>
</div>

The solubility chart decides which product is the solid. Here, $\ce{CaCO3}$ is insoluble because
$\ce{(CO3)^2-}$ is only soluble with Group 1A and $\ce{(NH4)+}$, while NaCl is soluble.

!!! example "Example: AgNO₃ + NaCl"
    $$\ce{AgNO3(aq) + NaCl(aq) -> AgCl(s) + NaNO3(aq)}$$

    Swapping partners gives **AgCl**, which is insoluble ($\ce{Cl-}$ is soluble *except* with
    $\ce{Ag+}$, $\ce{Pb^2+}$, $\ce{Hg2^2+}$), and **$\ce{NaNO3}$**, which is soluble (nitrates and
    Group 1A).

    $$\ce{Ag+} + \cancel{\ce{(NO3)-}} + \cancel{\ce{Na+}} + \ce{Cl-} \rightarrow \ce{AgCl(s)} + \cancel{\ce{Na+}} + \cancel{\ce{(NO3)-}}$$

!!! formula "Net ionic: AgCl precipitation"
    $$\ce{Ag+ + Cl- -> AgCl(s)}$$

## Titration

In a **titration**, the base (NaOH) drips from the burette into the acid and indicator in the
flask until the **equivalence point** is reached. Concentrations are given as molarity.

!!! formula "Molarity (Molar)"
    $$\text{Molar} = \text{Molarity} = \frac{\text{mol}}{\text{L}}$$

<div class="cols" markdown>
<div markdown>

!!! formula "Titration: H₂SO₄ + NaOH"
    $$\ce{H2SO4 + 2NaOH -> Na2SO4 + 2H2O}$$

The **mole ratio is 1 : 2**: 1 mole of acid and two moles of base reach the equivalence point.

</div>
<div markdown>

```apparatus
parts:
  - {type: titration, id: t, flask_liquid: clear, burette_liquid: clear}
labels:
  - {text: NaOH, to: t.titrant, side: right}
  - {text: Indicator, to: t.solution, side: left, arrow: true}
  - {text: Acid, to: t.solution, side: right}
caption: Titration — base (NaOH) in the burette, acid + indicator in the flask
```

</div>
</div>

### Titration calculations

A titration problem is stoichiometry with molarity: turn the known solution into moles, cross
over with the mole ratio, then turn moles back into the unknown volume (or molarity).

!!! formula "Titration chain (M · L → mol → mol ratio → L)"
    $$\text{mol B} = M_B\cdot \text{L}_B \xrightarrow{\ \text{mole ratio}\ } \text{mol A} \xrightarrow{\ \div\, M_A\ } \text{L}_A = \frac{\text{mol A}}{M_A}$$

!!! example "Example: H₃PO₄ + LiOH, volume of acid needed"
    **Problem:** How many mL of $7.48\cdot10^{-2}$ M $\ce{H3PO4}$ react completely with 0.115 L
    of 0.244 M LiOH?

    $$\ce{H3PO4 + 3LiOH -> Li3PO4 + 3H2O}$$

    | | $\ce{H3PO4}$ | $\ce{3LiOH}$ |
    |---|:-:|:-:|
    | **L** | ? L (mL) | 0.115 L |
    | **M** | $7.48\cdot10^{-2}$ M | 0.244 M |
    | **mol** | ? | $0.115\ \cancel{\text{L}}\cdot 0.244\ \dfrac{\text{mol}}{\cancel{\text{L}}} = 0.02806\ \text{mol}$ |

    **Mole ratio** (1 $\ce{H3PO4}$ : 3 LiOH):

    $$\text{mol}\ \ce{H3PO4} = \frac{0.02806\ \text{mol}}{3} = 0.009353\ \text{mol}\ \ce{H3PO4}$$

    **Volume of acid:**

    $$\text{L}_{\ce{H3PO4}} = \frac{\text{mol}}{M} = \frac{0.009353\ \cancel{\text{mol}}}{7.48\cdot10^{-2}\ \frac{\cancel{\text{mol}}}{\text{L}}} = 0.125\ \text{L} = \boxed{125\ \text{mL}}$$
