---
title: Thermochemistry
unit: 5
description: Heat in reactions — measuring heat through temperature change (Δt), energy units, water facts and specific heat, system vs. surroundings, and endothermic vs. exothermic.
sources:
  - {nb: "1", pages: "79-80"}
dates: ["11/10/26"]
tags: [thermochemistry, heat, specific heat, endothermic, exothermic, system, surroundings]
---

## Heat in reactions

**Thermochemistry** is about heat in reactions. Heat can be measured through
**temperature changes** ($\Delta t$, with a lowercase $t$ for temperature):

!!! formula "Temperature change Δt"
    $$\Delta t = t_{final} - t_{initial}$$

## Units

Heat is a form of energy, so it is measured in **joules (J)**:

!!! formula "Energy units"
    SI unit: $\dfrac{kg\cdot m^2}{s^2} = \text{Joule (J)}$

    $1000\ J = 1\ kJ$

    $1\ \text{calorie (cal)} = 4.184\ J$

## Water facts & specific heat

Specific heat (lowercase $c$) is measured per gram and per degree:

**Specific heat** ($c$)
:   The amount of heat required to increase the temperature of **1 g** by **1 °C**.
    Units: $\dfrac{J}{g\cdot {}^{\circ}C}$.

These are the facts about water to remember:

!!! formula "Water facts"
    - Boiling point: $100\ {}^{\circ}C$
    - Freezing point: $0\ {}^{\circ}C$
    - Density: $1\ \dfrac{g}{mL}$

!!! formula "Specific heat of water"
    $$c_{water} = 4.184\ \frac{J}{g\cdot {}^{\circ}C}$$

## System vs. surroundings

Two vocabulary words describe where the heat is:

**System**
:   The area on which the study is done (the reaction).

**Surroundings**
:   Anything that is in direct contact with the system.

```apparatus
parts:
  - {type: beaker, id: cup, style: cup, fill: 0.5, liquid: blue}
labels:
  - {text: Surroundings, to: cup.wall}
  - {text: "System\n(Reaction)", to: cup.liquid, arrow: true}
caption: System vs. surroundings
```

## Endothermic vs. exothermic

The direction the heat goes decides whether a reaction is endothermic or exothermic:

| | **Endothermic** | **Exothermic** |
|---|---|---|
| Heat is going from | the surroundings to the system | the system to the surroundings |
| The system is | **absorbing** heat ($q$) | **releasing** heat ($q$) |
| Heat is written as | a reactant | a product |

<div class="cols" markdown>
<div markdown>
!!! formula "Endothermic (q > 0, ΔH > 0)"
    $$
    \begin{gathered}
    \ce{A + B} + \text{Heat} \ce{-> C + D}\\
    q > 0,\quad \Delta H > 0
    \end{gathered}
    $$
</div>
<div markdown>
!!! formula "Exothermic (q < 0, ΔH < 0)"
    $$
    \begin{gathered}
    \ce{A + B -> C + D} + \text{Heat}\\
    q < 0,\quad \Delta H < 0
    \end{gathered}
    $$
</div>
</div>
