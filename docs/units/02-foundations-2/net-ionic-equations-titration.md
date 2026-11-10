---
title: Net Ionic Equations & Titration
unit: 2
description: Reactive vs. spectator ions, writing net ionic equations (acid + base and a precipitation), and the titration setup with its mole ratio.
sources:
  - {nb: "10-1", pages: "18"}
  - {nb: "10-1", pages: "22"}
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

## Net ionic equation: acid + base

!!! example "Example: NaOH + HCl"
    $$\ce{NaOH(aq) + HCl -> NaCl(aq) + H2O}$$

    $\ce{Na+}$ (a Group IA metal) and $\ce{Cl-}$ are spectators, so only $\ce{OH-}$ and $\ce{H+}$
    are left in the net ionic equation.

!!! formula "Net ionic: strong acid + strong base"
    $$\ce{OH- + H+ -> H2O}$$

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
