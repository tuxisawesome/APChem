---
title: First Law of Thermodynamics
unit: 5
description: Energy is conserved — ΔE = q + w, the work done when a gas expands or contracts (w = −PΔV), ΔE @ constant P vs. @ constant V, and ΔE = ΔH − RTΔng for reactions with gases.
sources:
  - {nb: "class-notes", pages: "97, 102-104, 106"}
tags: [first law, internal energy, ΔE, work, PΔV, heat, constant pressure, constant volume, Δng]
---

!!! objective "Students will be able to"
    - Define the 1st law, [2nd law](spontaneity-entropy.md#second-law-of-thermodynamics) and
      [3rd law](spontaneity-entropy.md#third-law-of-thermodynamics) of thermodynamics.

## Energy is conserved

The first law is the law of conservation of energy, applied to a reaction and its surroundings.

**First law of thermodynamics**
:   Energy is conserved: it can't be created or destroyed, only transferred between the system and
    the surroundings. Any energy the system gains, the surroundings lose.

!!! formula "First law: energy of the universe"
    $$\Delta E_{system} + \Delta E_{SURR} = 0 = \Delta E_{universe}$$

Here the system is the RXN ([system vs. surroundings](thermochemistry-basics.md#system-vs-surroundings)).

## Internal energy: ΔE = q + w

A system's energy changes in two ways: by heat ($q$) and by work ($w$).

!!! formula "First law (ΔE = q + w)"
    $$\Delta E_{RXN} = q + w$$

    $q$ = heat changes in the system, $w$ = work.

**Heat** ($q$)
:   Energy that moves into or out of the system because of a temperature difference: $+$ when the
    system absorbs heat, $-$ when it releases heat.

**Work** ($w$)
:   Energy transferred when a force moves something, such as a gas pushing a piston: $-$ when the
    system does work on the surroundings, $+$ when the surroundings do work on the system.

| | **Expansion** | **Contraction** |
|---|---|---|
| Volume | $\Delta V > 0$ | $\Delta V < 0$ |
| Work | $w_{expansion} = (-)$ | $w_{contraction} = (+)$ |
| Energy goes | Sys → SURR | SURR → Sys |

## Work done by a gas (w = −PΔV)

When a gas expands, it pushes a piston up a distance $\Delta l$ against the outside pressure:

```apparatus
parts:
  - {type: piston, id: p, start: 0.3, end: 0.62}
labels:
  - {text: SURR, to: p.rod, side: right}
  - {text: "Final position", to: p.piston, side: left}
  - {text: "Initial position", to: p.initial, side: left}
  - {text: System, to: p.gas, side: right}
caption: A gas expanding against a piston
```

Work is force times distance. Pressure is force per area, so the force is $P \cdot A$, and the area
times the distance is the change in volume:

$$w = F \cdot \Delta l = (P \cdot A) \cdot \Delta l = P\Delta V$$

The expanding system **loses** that energy, so expansion work is negative:

!!! formula "Expansion work"
    $$w_{exp} = -P\Delta V$$

Putting it into the first law:

!!! formula "First law with expansion work"
    $$\Delta E = q - P\Delta V$$

## Constant pressure vs. constant volume

**@ const P**, the heat is the enthalpy change: $q_p = \Delta H_{RXN}$
([Enthalpy](enthalpy.md#enthalpy-h)). So:

!!! formula "ΔE @ constant P"
    $$\Delta E_{RXN} = \Delta H_{RXN} - P\Delta V$$

**@ constant V**, nothing moves: $\Delta V = 0$, so $P\Delta V = 0$ and $w = 0$. All the energy
change is heat:

!!! formula "ΔE = qv and ΔH = qp"
    $$\Delta E_{RXN} = q_v \qquad ; \qquad \Delta H_{RXN} = q_p$$

Comparing the heat @ constant V and @ constant P:

!!! formula "qv vs. qp"
    $$q_v = q_p - P\Delta V \qquad\text{OR}\qquad \Delta E_{RXN} = \Delta H_{RXN} - P\Delta V$$

| | **@ constant P** | **@ constant V** |
|---|---|---|
| Work | $w = -P\Delta V$ | $w = 0$ |
| The heat measured is | $q_p = \Delta H_{RXN}$ | $q_v = \Delta E_{RXN}$ |
| [Calorimeter](calorimetry.md#two-types-of-calorimeter) | coffee cup (open to the air) | bomb (sealed) |

## Reactions with gases (ΔE = ΔH − RTΔng)

Gases take up far more space than liquids or solids, so for a gas only the gas volume counts.

For example, boiling 1 mol of water, $\ce{1H2O(l) -> 1H2O(g)}$:

- $\Delta V = V_g - V_l$, and $V_g \gg V_l$, so $\Delta V \approx V_g$.
- From the [ideal gas law](../01-foundations-1/ideal-gas-equations.md), $V_g = \dfrac{RT}{P}$ for 1 mol.
- So $\Delta E_{RXN} = \Delta H_{RXN} - P \cdot \dfrac{RT}{P}$.

!!! formula "ΔE for 1 mol of gas formed"
    $$\Delta E_{RXN} = \Delta H_{RXN} - RT \qquad (\text{for 1 mol})$$

In a RXN having all gases, use the **change in moles of gas**, $\Delta n_g$:

!!! formula "ΔE for a RXN having all gases"
    $$\Delta E_{RXN} = \Delta H_{RXN} - RT\Delta n_g$$

!!! formula "Change in moles of gas (Δng)"
    $$\Delta n_g = \Sigma n_g\ \text{Products} - \Sigma n_g\ \text{Reactants}$$

    Count only the gases, using the coefficients.

The work done by the system is the same idea, written with $\Delta n_g$:

!!! formula "Work from Δng"
    $$w = -P_{ext}\Delta V = -RT\Delta n_g$$

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
