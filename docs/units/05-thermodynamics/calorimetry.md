---
title: Calorimetry
unit: 5
description: How heat (q) is measured — coffee-cup vs. bomb calorimeters, heat capacity C vs. specific heat c, and the equations for the heat of a reaction (dissolution and combustion).
sources:
  - {nb: "1", pages: "81-83"}
dates: ["11/10/26"]
tags: [calorimetry, calorimeter, heat capacity, specific heat, q, dissolution, combustion]
---

## How to measure heat (q)

Heat ($q$) is measured with **calorimetry**, using a **calorimeter**.

**Calorimetry**
:   The process in which the heat of a reaction ($q_{rxn}$) can be calculated or measured.

**Calorimeter**
:   The device used to measure it.

## Two types of calorimeter

There are two types of calorimeter, a light one and a heavy one:

<div class="cols" markdown>
<div markdown>
A **coffee cup calorimeter** is made of **styrofoam** and is **lightweight**.

```apparatus
parts:
  - {type: coffee-cup, id: cc, fill: 0.55}
labels:
  - {text: Styrofoam, to: cc.cup, side: right}
caption: Coffee cup calorimeter
```

</div>
<div markdown>
A **bomb calorimeter** is made of **metal** and is **heavy**. It may or may not contain water.

```apparatus
parts:
  - {type: bomb-calorimeter, id: b}
labels:
  - {text: Metal, to: b.bomb, side: left}
  - {text: Water, to: b.water, side: right}
caption: Bomb calorimeter
```

</div>
</div>

## Heat capacity (C) vs. specific heat (c)

Uppercase $C$ and lowercase $c$ mean different things, so the case matters:

!!! formula "C (upper) vs c (lower)"
    | Symbol | Name | Of a… | Units |
    |---|---|---|---|
    | $C$ (upper) | **Heat capacity** | calorimeter | $\dfrac{J}{{}^{\circ}C}$ |
    | $c$ (lower) | **Specific heat** | substance | $\dfrac{J}{g\cdot {}^{\circ}C}$ |

**Heat capacity** ($C$)
:   The amount of heat ($q$) required to increase the temperature by **1 °C**.
    Units: $\dfrac{J}{{}^{\circ}C}$.

**Molar heat capacity** (of a substance)
:   Heat capacity with respect to **one mole**.

## Equations used to measure the heat of a reaction

These equations connect the heat ($q$) to the temperature change ($\Delta t$).

### Basic equations

All the $q$ values add up to zero:

!!! formula "Calorimetry energy balance"
    $$
    \begin{aligned}
    q_{system} + q_{surroundings} &= 0\\
    q_{reaction} + q_{calorimeter} &= 0
    \end{aligned}
    $$

### Formulas to calculate q

The heat is proportional to the temperature change, $q \propto \Delta t$. With the heat capacity
(uppercase $C$):

!!! formula "Heat from heat capacity (q = CΔt)"
    $$q = C\Delta t \qquad \text{(uppercase)}$$

The heat is also proportional to the mass, $q \propto m\cdot\Delta t$. With the specific heat
(lowercase $c$):

!!! formula "Heat from specific heat (q = mcΔt)"
    $$q = mc\cdot\Delta t \qquad \text{(lowercase)}$$

### Overall equation to calculate the heat of reaction

Putting both together gives the heat of reaction ($q_{rxn}$):

!!! formula "Heat of reaction (calorimeter + solution)"
    $$
    \begin{aligned}
    q_{rxn} + C\Delta t + mc\Delta t &= 0\\
    q_{rxn} + q_{calorimeter} + q_{solution} &= 0\\
    q_{rxn} &= -(C\Delta t + mc\Delta t)
    \end{aligned}
    $$

## Dissolution reaction

In a **dissolution reaction**, an ionic compound (salt) dissolves in water:
Ionic Compound (salt) + $\ce{H2O}$. In the $mc\Delta t$ term, both the salt and the water count:

!!! formula "Dissolution: m and c in mcΔt"
    $$
    \begin{aligned}
    m &= \text{mass}_{salt} + \text{mass}_{water}\\
    c &= \text{specific heat of water}
    \end{aligned}
    $$

## Combustion reaction

In a **combustion reaction**, a hydrocarbon burns in oxygen, and the heat of reaction is the
heat of combustion:

!!! formula "Combustion reaction heat"
    $$
    \begin{gathered}
    q_{reaction} = q_{combustion}\\
    \ce{C_{x}H_{y} + O2 -> CO2 + H2O}
    \end{gathered}
    $$
