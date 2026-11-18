---
title: First Law of Thermodynamics
unit: 5
description: Energy is conserved — ΔE = q + w, the signs of heat and work, the work done when a gas expands or contracts (w = −PΔV), ΔE at constant pressure vs. constant volume, and ΔE = ΔH − RTΔng for reactions with gases.
sources:
  - {nb: "class-notes", pages: "97, 102-104, 106, 113"}
dates: ["11/16/26", "11/17/26"]
tags: [first law, internal energy, ΔE, work, PΔV, heat, constant pressure, constant volume, Δng]
---

!!! objective "Students will be able to"
    - Define the 1st law, [2nd law](spontaneity-entropy.md#second-law-of-thermodynamics) and
      [3rd law](spontaneity-entropy.md#third-law-of-thermodynamics) of thermodynamics.

## Energy is conserved

The first law is the law of conservation of energy, applied to a reaction and its surroundings.

**First law of thermodynamics**
:   The energy of the universe is constant: energy can neither be created nor destroyed. It can
    only be changed from one form to another.

The first law can be said three ways:

1. "The energy of the universe is constant." Energy can neither be created nor destroyed; it can
   only be changed from one form to another.
2. "The change in the energy of a system is equal in magnitude, and opposite in sign, to the change
   in the energy of the surroundings of that system."
3. "The change in the energy of a system during a certain process is equal to the sum of the heat
   ($q$) and work ($w$) exchanged by the system and the surroundings": $\Delta E = w + q$.

Statement 2, as an equation:

!!! formula "First law: energy of the universe"
    $$\Delta E_{system} + \Delta E_{SURR} = 0 = \Delta E_{universe}$$

Here the system is the RXN ([system vs. surroundings](thermochemistry-basics.md#system-vs-surroundings)).

## Internal energy: ΔE = q + w

A system's energy changes in two ways: by heat ($q$) and by work ($w$).

!!! formula "First law (ΔE = q + w)"
    $$\Delta E_{RXN} = q + w$$

    $q$ = heat exchanged by the system, $w$ = work done on ($+$) or by ($-$) the system.

**Heat** ($q$)
:   Energy that moves into or out of the system because of a temperature difference: $+$ when heat
    flows into the system, $-$ when heat flows out of it.

**Work** ($w$)
:   Energy transferred when a force moves something, such as a gas pushing a piston: $+$ when it is
    work done on the system, $-$ when it is work done by the system during the process.

| | Heat flows | Process | In the absence of work |
|:-:|---|---|---|
| $q > 0$ | **into** the system (from the surroundings) | [endothermic](thermochemistry-basics.md#endothermic-vs-exothermic) | $\Delta E > 0$: the energy of the system increases |
| $q < 0$ | **out of** the system (into the surroundings) | exothermic | $\Delta E < 0$: the energy of the system decreases |

| | **Expansion** | **Contraction** |
|---|---|---|
| Volume | $\Delta V > 0$ | $\Delta V < 0$ |
| Work | $w_{expansion} = (-)$ | $w_{contraction} = (+)$ |
| Energy goes | Sys → SURR | SURR → Sys |

## Work done by a gas (w = −PΔV)

Consider the simple process of evaporation of water at a temperature of 373 K:

$$\ce{H2O(l) -> H2O(g)}$$

The vapor pushes a piston of area $A$ up a distance $\Delta l$ against the atmosphere's pressure
($P_{atm}$):

```apparatus
parts:
  - {type: piston, id: p, start: 0.3, end: 0.62}
labels:
  - {text: SURR, to: p.rod, side: right}
  - {text: "Area A", to: p.piston, side: right}
  - {text: "Final position", to: p.piston, side: left}
  - {text: "Initial position", to: p.initial, side: left}
  - {text: System, to: p.gas, side: right}
caption: A gas expanding against a piston
```

Work is force times displacement. The applied force is the pressure times the area, and the area
times the displacement is the change in volume:

$$
\begin{aligned}
F_{app} &= P_{atm}\cdot A \\
w &= F_{app}\cdot \Delta l \\
w &= (P_{atm}\cdot A)\cdot \Delta l = P_{atm}\cdot\Delta V
\end{aligned}
$$

Since it is the system doing work on the surroundings, $w$ is negative:

!!! formula "Expansion work"
    $$w = -P_{atm}\Delta V$$

    $P_{atm}$ = the outside (atmospheric) pressure the gas pushes against.

Putting it into the first law:

!!! formula "First law with expansion work"
    $$\Delta E = q - P\Delta V$$

## Constant pressure vs. constant volume

**At constant pressure**, the heat is the enthalpy change: $q_p = \Delta H_{RXN}$
([Enthalpy](enthalpy.md#enthalpy-h)). So:

!!! formula "ΔE at constant pressure"
    $$\Delta E_{RXN} = \Delta H_{RXN} - P\Delta V$$

**At constant volume**, nothing moves: $\Delta V = 0$, so $P\Delta V = 0$ and $w = 0$. All the energy
change is heat: $\Delta E = w + q = -P_{atm}\Delta V + q = q_v$.

!!! formula "ΔE = qv and ΔH = qp"
    $$\Delta E_{RXN} = q_v \qquad ; \qquad \Delta H_{RXN} = q_p$$

Comparing the heat at constant volume and at constant pressure:

!!! formula "qv vs. qp"
    $$q_v = q_p - P\Delta V \qquad\text{OR}\qquad \Delta E_{RXN} = \Delta H_{RXN} - P\Delta V$$

| | **Constant pressure** | **Constant volume** |
|---|---|---|
| Work | $w = -P\Delta V$ | $w = 0$ |
| The heat measured is | $q_p = \Delta H_{RXN}$ | $q_v = \Delta E_{RXN}$ |
| [Calorimeter](calorimetry.md#two-types-of-calorimeter) | coffee cup (open to the air) | bomb (sealed) |

## Reactions with gases (ΔE = ΔH − RTΔng)

Gases take up far more space than liquids or solids, so for a gas only the gas volume counts.

For the evaporation of 1 mol of water, $\ce{1H2O(l) -> 1H2O(g)}$:

- $V_{(g)} \ggg V_{(l)}$, so $\Delta V = V_{(g)} - V_{(l)} \approx V_{(g)}$.
- From the [ideal gas law](../01-foundations-1/ideal-gas-equations.md), $V_{(g)} = \dfrac{RT}{P}$ for 1 mol.
- So $w = -P_{atm}\cdot\dfrac{RT}{P} = -RT$, and $\Delta E_{RXN} = \Delta H_{RXN} - RT$.

!!! formula "Work for 1 mol of gas formed"
    $$w = -RT \qquad (\text{for 1 mol})$$

!!! formula "ΔE for 1 mol of gas formed"
    $$\Delta E_{RXN} = \Delta H_{RXN} - RT \qquad (\text{for 1 mol})$$

For a reaction, use the **change in moles of gas**, $\Delta n_g$:

!!! formula "Change in moles of gas (Δng)"
    $$\Delta n_g = \Sigma n_g\ \text{Products} - \Sigma n_g\ \text{Reactants}$$

    Count only the gases, using the coefficients.

!!! formula "Work from Δng"
    $$w = -P_{ext}\Delta V = -RT\Delta n_g$$

Hence, putting the work into the first law:

!!! formula "ΔE for a RXN with gases"
    $$\Delta E_{RXN} = \Delta H_{RXN} - RT\Delta n_g \qquad\text{or}\qquad q_v = q_p - RT\Delta n_g$$

!!! formula "Gas constant R (energy units)"
    $$R = 8.314\ \frac{J}{mol\,K}$$

    Use this value of $R$ with energy (J). $0.0821\ \frac{L\cdot atm}{mol\cdot K}$ is for gas-law
    problems in L and atm.

For example, in the synthesis of ammonia:

$$\ce{N2(g) + 3H2(g) -> 2NH3(g)}$$

- $\Sigma n_g$ Reactants $= 3 + 1 = 4$
- $\Sigma n_g$ Products $= 2$
- $\Delta n_g = 2 - 4 = -2$

$$w = -P_{ext}\Delta V = -P_{ext}(V_{products} - V_{reactants})$$

$V_{products} = 2RT/P$ and $V_{reactants} = 4RT/P$, since there are 4 mol of gas
(1 mol $\ce{N2}$ + 3 mol $\ce{H2}$):

$$\Rightarrow\ w = -(2 - 4)RT = +2RT$$

The gas contracts (4 mol of gas become 2), so the surroundings do work on the system and $w$ is
positive.
