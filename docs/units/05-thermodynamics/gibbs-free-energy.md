---
title: Gibbs Free Energy
unit: 5
description: Gibbs free energy (G = H − TS), ΔG = ΔH − TΔS as the test for spontaneity at constant temperature and pressure, and how it connects to Q and K (ΔRG = ΔRG° + RT ln Qp, ΔRG° = −RT ln Kp).
sources:
  - {nb: "class-notes", pages: "110-112"}
tags: [Gibbs free energy, ΔG, spontaneous, entropy, enthalpy, equilibrium constant, reaction quotient]
---

## Gibbs free energy (G)

Many chemical, physical and biological processes occur **under conditions of constant temperature
and pressure**. In such situations, it is useful and actually more practical to discuss spontaneity
using another thermodynamic quantity: the Gibbs free energy.

**Gibbs free energy** ($G$)
:   The thermodynamic quantity $G = H - TS$ (enthalpy minus absolute temperature times entropy),
    used to discuss whether a process at constant temperature and pressure is spontaneous.

!!! formula "Gibbs free energy"
    $$G = H - TS$$

    $H$ = the enthalpy of the system, $S$ = the entropy of the system, $T$ = the absolute
    temperature (K).

For a process occurring at constant temperature, the change in free energy can be expressed in terms
of the enthalpy and entropy changes:

!!! formula "ΔG = ΔH − TΔS"
    $$\Delta G = \Delta H - T\Delta S$$

    $\Delta S$ is usually in $\frac{J}{K}$ and $\Delta H$ in $kJ$: change one so the units match.

## ΔG and the second law

This equation can be rearranged:

$$\Delta G = -T \cdot \left(\frac{-\Delta H}{T} + \Delta S\right)$$

For a process occurring at constant pressure,
$\Delta S_{surr} = \dfrac{-\Delta H}{T}$ ([entropy of the surroundings](spontaneity-entropy.md#second-law-of-thermodynamics)),
and $\Delta S$ is $\Delta S_{sys}$. Hence, we conclude that:

!!! formula "ΔG and the entropy of the universe"
    $$\Delta G = -T \cdot (\Delta S_{surr} + \Delta S_{sys}) = -T \cdot \Delta S_{universe}$$

So $\Delta G$ always has the opposite sign of $\Delta S_{universe}$, and the
[second law](spontaneity-entropy.md#second-law-of-thermodynamics) becomes a rule about $\Delta G$:

!!! formula "Spontaneity: ΔSuniverse and ΔG"
    | $\Delta S_{universe}$ | $\Delta G$ (constant $T$ and $P$) | A process… |
    |:-:|:-:|---|
    | $> 0$ | $< 0$ | is spontaneous |
    | $= 0$ | $= 0$ | has reached equilibrium |
    | $< 0$ | $> 0$ | is non-spontaneous |

An equivalent statement of the second law: **during a spontaneous process occurring at constant
$T$ and $P$, the free energy of the system is steadily decreasing. When a system achieves
equilibrium, its free energy is minimum.**

## Reaction free energy, reaction quotient and the equilibrium constant

Gibbs free energy under **non-standard conditions** is calculated using the equation:

!!! formula "ΔRG under non-standard conditions"
    $$\Delta_R G = \Delta_R G^{\circ} + RT\ln Q_p$$

    $R$ = the gas constant ($8.314\ J\cdot K^{-1}\cdot mol^{-1}$), $T$ = the absolute temperature
    (K), $Q_p$ = the reaction quotient expressed in terms of the partial pressures of the reactants
    and products present at that time in the reaction mixture.

Calculate $Q$ using the **current** concentrations or partial pressures of the reactants and
products, raised to their stoichiometric coefficients: partial pressures for gases, molar
concentrations for solutions. For a general reaction $\ce{aA + bB <=> cC + dD}$,
$Q = \dfrac{[C]^c\,[D]^d}{[A]^a\,[B]^b}$ ([Reaction Quotient](../03-equilibrium/reaction-quotient.md#reaction-quotient-q)).

- $Q_p$ **increases** when the reaction proceeds in the forward direction.
- $Q_p$ **decreases** when the reaction proceeds in the reverse direction (from right to left).
- A reaction has reached equilibrium when $Q_p$ is equal to $K_p$, the equilibrium constant.

## ΔG° and K

The second law states that a reaction has reached equilibrium when $\Delta_R G = 0$. Hence at
chemical equilibrium:

$$0 = \Delta_R G^{\circ} + RT\ln K_p \qquad\text{or}\qquad \ln K_p = -\frac{\Delta_R G^{\circ}}{RT}$$

!!! formula "ΔRG° and K"
    $$\Delta_R G^{\circ} = -RT\ln K_p \qquad\text{or}\qquad K = e^{-\Delta G^{\circ}/RT}$$

How the values correspond:

| $\Delta G^{\circ}$ | $K$ | Under standard conditions… |
|:-:|:-:|---|
| $< 0$ (negative) | $K > 1$ | spontaneous: **products** are heavily favored at equilibrium |
| $> 0$ (positive) | $K < 1$ | non-spontaneous: **reactants** are favored at equilibrium |
| $= 0$ | $K = 1$ (exactly one) | at equilibrium |

## ΔRG, Q and K together

$$
\begin{aligned}
\Delta_R G &= \Delta_R G^{\circ} + RT\ln Q_p \\
\text{Recall that: } \Delta_R G^{\circ} &= -RT\ln K_p \\
\text{Hence, } \Delta_R G &= -RT\ln K_p + RT\ln Q_p
\end{aligned}
$$

!!! formula "ΔRG from Q and K"
    $$\Delta_R G = RT\ln\left(\frac{Q_p}{K_p}\right)$$

| $\dfrac{Q_p}{K_p}$ | $\ln\left(\dfrac{Q_p}{K_p}\right)$ | $\Delta_R G$ | The reaction… |
|:-:|:-:|:-:|---|
| $< 1$ (i.e. $Q_p < K_p$) | $< 0$ | $< 0$ | is spontaneous in the forward direction |
| $> 1$ (i.e. $Q_p > K_p$) | $> 0$ | $> 0$ | is non-spontaneous in the forward direction, or spontaneous in the reverse direction |
| $= 1$ (i.e. $Q_p = K_p$) | $0$ | $0$ | has reached equilibrium: products and reactants are present at their equilibrium concentrations |

These are the same three cases as [comparing Q and K](../03-equilibrium/reaction-quotient.md#comparing-q-and-k-three-cases):
$\Delta_R G$ explains *why* a reaction shifts toward equilibrium.
