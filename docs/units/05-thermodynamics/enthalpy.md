---
title: Enthalpy
unit: 5
description: Enthalpy (H) and ΔH = qₚ, molar enthalpy, the standard enthalpy of reaction, and two ways to calculate ΔH°rxn — Hess's law and standard enthalpies of formation (ΔH°f).
sources:
  - {nb: "1", pages: "88-92"}
dates: ["11/11/26", "11/12/26"]
tags: [enthalpy, ΔH, molar enthalpy, heat of reaction, Hess's law, enthalpy of formation, standard state]
---

!!! objective "Students will be able to"
    - Define enthalpy ($H$) and the methods of calculating $\Delta H^{\circ}_{rxn}$.

## Enthalpy (H)

Enthalpy is how chemists name the heat of a reaction when the pressure stays the same.

**Enthalpy** ($H$)
:   The heat ($q$) of a reaction at constant pressure, such as a pressure of **1 atm**.

The heat measured at constant pressure ($q_p$) is the **enthalpy change** of the reaction:

!!! formula "Enthalpy change = heat at constant pressure"
    $$\Delta H = q_p \qquad (P = 1\ \text{atm})$$

A [coffee cup calorimeter](calorimetry.md#two-types-of-calorimeter) is open to the air, so the
heat it measures is at constant pressure: it measures $\Delta H$.

## Molar enthalpy

**Molar enthalpy**
:   The enthalpy of **one mole** of a substance (units $\dfrac{kJ}{mol}$).

## Standard enthalpy of reaction

The enthalpy change of a reaction is the enthalpy of the **products** minus the enthalpy of the
**reactants**:

!!! formula "Standard enthalpy of reaction (ΔH°rxn)"
    $$\Delta H^{\circ}_{rxn} = \Sigma H^{\circ}_{P} - \Sigma H^{\circ}_{R}$$

| Symbol | Means |
|:-:|---|
| $\Delta$ | change |
| ${}^{\circ}$ | at standard conditions (1 atm) |
| $H$ | enthalpy |
| $P$ | "products" (usually written as P) |
| $R$ | "reactants" (usually written as R) |

There are two methods of calculating $\Delta H^{\circ}_{rxn}$: Hess's law and standard enthalpies of
formation.

## Method 1: Hess's law

If the reaction you want can be built by **adding up other reactions**, its $\Delta H$ is the sum
of their $\Delta H$ values. Change each given reaction until it matches the overall reaction, and
change its $\Delta H$ the same way:

!!! formula "Hess's law: manipulating ΔH"
    | Change to the reaction | What happens to $\Delta H$ |
    |---|---|
    | Flip (reverse) it | $\Delta H_{rev} = -\Delta H$ |
    | Multiply it by $n$ | $n\cdot\Delta H$ |
    | Add reactions together | $\Delta H_{overall} = \Delta H_1 + \Delta H_2 + \cdots$ |

A species that shows up on both sides once the reactions are added is an **intermediate**: it is
made in one step and used up in the next, so it cancels. These are the same moves used to combine
equilibrium constants, except $K$ values multiply where $\Delta H$ values add
([Manipulating K](../03-equilibrium/manipulating-k.md#k-vs-h-the-same-moves-different-math)).

!!! example "Example: ΔH° for 2S + 3O₂ → 2SO₃"
    Consider the following reactions:

    $$
    \def\arraystretch{1.45}\begin{array}{lr}
    \text{i.}\ \ \ce{S(s) + O2(g) -> SO2(g)} & \qquad \Delta H^{\circ} = -297\ \text{kJ}\\
    \text{ii.}\ \ce{2SO3(g) -> 2SO2(g) + O2(g)} & \qquad \Delta H^{\circ} = 198\ \text{kJ}
    \end{array}
    $$

    Calculate $\Delta H^{\circ}$ for the overall reaction:

    $$\ce{2S(s) + 3O2(g) -> 2SO3(g)}$$

    **(i) × 2**, because the overall reaction has 2 S on the left:

    $$\ce{2S(s) + 2O2(g) -> 2SO2(g)} \qquad \Delta H^{\circ} = -297\cdot 2\ \text{kJ} = -594\ \text{kJ}$$

    **(ii) flip**, because the overall reaction has $\ce{2SO3}$ on the right:

    $$\ce{2SO2(g) + O2(g) -> 2SO3(g)} \qquad \Delta H^{\circ} = -(198\ \text{kJ}) = -198\ \text{kJ}$$

    **Add them.** $\ce{2SO2(g)}$ is the intermediate, so it cancels:

    $$
    \def\arraystretch{1.45}\begin{array}{lr}
    \ce{2S(s) + 2O2(g)} \longrightarrow \cancel{\ce{2SO2(g)}} & \qquad -594\ \text{kJ}\\
    +\ \cancel{\ce{2SO2(g)}} + \ce{O2(g)} \longrightarrow \ce{2SO3(g)} & \qquad -198\ \text{kJ}\\ \hline
    \ce{2S(s) + 3O2(g) -> 2SO3(g)} & \qquad \Delta H^{\circ} = -594 + (-198)\ \text{kJ}
    \end{array}
    $$

    $$\therefore\ \boxed{\Delta H^{\circ} = -792\ \text{kJ}}$$

## Method 2: Standard enthalpy of formation

The **standard enthalpy of formation** is written with the symbol $\Delta H_f^{\circ}$.

The superscript ${}^{\circ}$ means **standard conditions**. As always, standard conditions means
that the pressure is $P = 1\ \text{atm}$ (tables list the values at 25 °C, or 298 K).

**Standard enthalpy of formation** ($\Delta H_f^{\circ}$)
:   The enthalpy change when **one mole** of a compound is formed under standard conditions from its
    elements in their **stable standard state**.

For an element that is already in its stable state, the formation involves no change at all.
Thus $\Delta H_f^{\circ}$ of an element in its stable state is **zero**.

!!! formula "ΔH°f of an element in its standard state"
    $$\Delta H_f^{\circ}\ (\text{element in its stable standard state}) = 0$$

!!! memorize "Standard states — Memorize!"
    Pay special attention to these elements, because their standard states are:

    --8<-- "standard-states.md"

To get $\Delta H^{\circ}_{rxn}$, add up the $\Delta H_f^{\circ}$ of the products and subtract the
$\Delta H_f^{\circ}$ of the reactants, each times its coefficient:

!!! formula "ΔH°rxn from enthalpies of formation"
    $$\Delta H^{\circ}_{rxn} = \Sigma\, n\,\Delta H^{\circ}_{f}(P) - \Sigma\, m\,\Delta H^{\circ}_{f}(R)$$

    $n$, $m$ = the coefficients of the products and reactants in the balanced equation.

!!! example "Example: graphite → diamond"
    Given the following data for graphite and diamond at 298 K:

    $$
    \begin{aligned}
    \Delta H_f^{\circ}\ \ce{CO2}\ (\text{from graphite}) &= -94.05\ \tfrac{kcal}{mol}\\
    \Delta H_f^{\circ}\ \ce{CO2}\ (\text{from diamond}) &= -94.50\ \tfrac{kcal}{mol}
    \end{aligned}
    $$

    Consider the change $\ce{C(graphite) -> C(diamond)}$ at 298 K and 1 atm. What is the value of
    $\Delta H^{\circ}$ for the conversion of graphite to diamond?

    **Make equations** from the data:

    $$
    \def\arraystretch{1.45}\begin{array}{lr}
    \text{i.}\ \ \ce{C(graphite) + O2(g) -> CO2(g)} & \qquad \Delta H^{\circ} = -94.05\ \tfrac{kcal}{mol}\\
    \text{ii.}\ \ce{C(diamond) + O2(g) -> CO2(g)} & \qquad \Delta H^{\circ} = -94.50\ \tfrac{kcal}{mol}
    \end{array}
    $$

    **Main equation:** $\ce{C(graphite) -> C(diamond)}$

    **Hess's law:** keep (i) and flip (ii), so diamond ends up as a product. $\ce{O2}$ and $\ce{CO2}$
    cancel:

    $$
    \def\arraystretch{1.45}\begin{array}{lr}
    \ce{C(graphite)} + \cancel{\ce{O2(g)}} \longrightarrow \cancel{\ce{CO2(g)}} & \qquad -94.05\ \tfrac{kcal}{mol}\\
    +\ \cancel{\ce{CO2(g)}} \longrightarrow \ce{C(diamond)} + \cancel{\ce{O2(g)}} & \qquad -\left(-94.50\ \tfrac{kcal}{mol}\right) = 94.50\ \tfrac{kcal}{mol}\\ \hline
    \ce{C(graphite) -> C(diamond)} & \qquad \Delta H^{\circ} = -94.05 + 94.50\ \tfrac{kcal}{mol}
    \end{array}
    $$

    $$\therefore\ \boxed{\Delta H^{\circ} = +0.45\ \tfrac{kcal}{mol}}\ \ (\approx +1.9\ \tfrac{kJ}{mol})$$

    $\Delta H^{\circ}$ is positive, so turning graphite into diamond is
    [endothermic](thermochemistry-basics.md#endothermic-vs-exothermic): diamond has a little more
    enthalpy than graphite.
