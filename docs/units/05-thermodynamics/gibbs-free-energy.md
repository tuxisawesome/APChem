---
title: Gibbs Free Energy
unit: 5
description: Gibbs free energy (G = H − T·S), ΔG°RXN = ΔH°RXN − T·ΔS°RXN as the test for spontaneity, ΔGRXN for non-standard conditions, and how ΔG°RXN connects to Q and K.
sources:
  - {nb: "1", pages: "96-98"}
  - {nb: "class-notes", pages: "110-112"}
dates: ["11/18/26"]
tags: [Gibbs free energy, ΔG, spontaneous, entropy, enthalpy, equilibrium constant, reaction quotient, non-standard conditions, reaction isotherm]
---

## Gibbs free energy (G)

Many chemical, physical and biological processes occur **under conditions of constant temperature
and pressure**. In such situations, it is useful and actually more practical to discuss spontaneity
using another thermodynamic quantity: the Gibbs free energy.

**Gibbs free energy** ($G$)
:   The thermodynamic quantity $G = H - T\cdot S$ (enthalpy minus absolute temperature times
    entropy), used to discuss whether a process at constant temperature and pressure is spontaneous.

!!! formula "Gibbs free energy"
    $$G = H - T\cdot S$$

    $H$ = the enthalpy of the system, $S$ = the entropy of the system, $T$ = the absolute
    temperature (K).

For a process occurring at constant temperature, the change in free energy can be expressed in terms
of the enthalpy and entropy changes:

!!! formula "Gibbs free energy equation"
    $$\Delta G^{\circ}_{RXN} = \underbrace{\Delta H^{\circ}_{RXN}}_{\text{at } 25^{\circ}C} - \underbrace{T}_{\text{any temp}}\cdot\underbrace{\Delta S^{\circ}_{RXN}}_{\text{at } 25^{\circ}C}$$

    Everything is at 1 atm (standard conditions). $T$ can be any temperature; it need not be
    25 °C. $\Delta S^{\circ}_{RXN}$ is usually in $\frac{J}{K}$ and $\Delta H^{\circ}_{RXN}$ in $kJ$: change one so the units
    match.

$\Delta G^{\circ}_{RXN}$ can also come straight from the free energies of the products and reactants,
each times its coefficient:

!!! formula "ΔG°RXN from products and reactants"
    $$\Delta G^{\circ}_{RXN} = \Sigma G^{\circ}_{P} - \Sigma G^{\circ}_{R}$$

## ΔG°RXN and the 2nd law

The Gibbs free energy equation can be rearranged:

$$\Delta G^{\circ}_{RXN} = -T \cdot \left(\frac{-\Delta H^{\circ}_{RXN}}{T} + \Delta S^{\circ}_{RXN}\right)$$

For a process occurring at constant pressure,
$\Delta S_{surrounding} = \dfrac{-\Delta H^{\circ}_{RXN}}{T}$ ([entropy of the surroundings](spontaneity-entropy.md#second-law-of-thermodynamics)),
so $\Delta G^{\circ}_{RXN} = -T\cdot(\Delta S_{surrounding} + \Delta S^{\circ}_{RXN})$. Hence:

!!! formula "ΔG°RXN and the entropy of the universe"
    $$\Delta G^{\circ}_{RXN} = -T \cdot \Delta S^{\circ}_{universe}$$

So $\Delta G^{\circ}_{RXN}$ always has the opposite sign of $\Delta S^{\circ}_{universe}$, and the
[2nd law](spontaneity-entropy.md#second-law-of-thermodynamics) becomes a rule about $\Delta G^{\circ}_{RXN}$:

!!! formula "Spontaneity: ΔS°universe and ΔG°RXN"
    | $\Delta S^{\circ}_{universe}$ | $\Delta G^{\circ}_{RXN}$ | The reaction… |
    |:-:|:-:|---|
    | $> 0$ | $< 0$ | is spontaneous |
    | $< 0$ | $> 0$ | is not spontaneous |
    | $= 0$ | $= 0$ | is at equilibrium |

All reactions are proceeding to a stable state. An equivalent statement of the 2nd law:
**during a spontaneous process occurring at constant $T$ and $P$, the free energy of the system is
steadily decreasing. When a system achieves equilibrium, its free energy is minimum.**

## ΔGRXN for non-standard conditions

**Non-standard** conditions means the pressures or concentrations are not the standard values:

$$P \neq 1\ atm \qquad\qquad [\ ] \neq 1M$$

**Reaction isotherm** (van 't Hoff isotherm)
:   The equation $\Delta G_{RXN} = \Delta G^{\circ}_{RXN} + RT\cdot\ln(Q_p)$, which gives the free
    energy change of a reaction under non-standard conditions.

!!! formula memorize "Reaction isotherm: ΔGRXN under non-standard conditions"
    $$\Delta G_{RXN} = \Delta G^{\circ}_{RXN} + RT\cdot\ln(Q_p)$$

    $Q_c$ also works here. $R$ = the gas constant ($8.314\ J\cdot K^{-1}\cdot mol^{-1}$), $T$ = the
    absolute temperature (K).

$Q_p$ is the reaction quotient, from the partial pressures of the reactants and products present at
that time in the reaction mixture:

!!! formula "Reminder: Qp"
    $$Q_p = \frac{(P_1)^{coeff}\cdot(P_2)^{coeff}}{(R_1)^{coeff}\cdot(R_2)^{coeff}}$$

    $P_1, P_2$ = the products, $R_1, R_2$ = the reactants, each raised to its coefficient.

Calculate $Q$ using the **current** amounts: partial pressures for gases, molar concentrations for
solutions ([Reaction Quotient](../03-equilibrium/reaction-quotient.md#reaction-quotient-q)).

- $Q_p$ **increases** when the reaction proceeds in the forward direction.
- $Q_p$ **decreases** when the reaction proceeds in the reverse direction (from right to left).
- A reaction has reached equilibrium when $Q_p$ is equal to $K$, the equilibrium constant.

## ΔG°RXN and K

The 2nd law states that a reaction has reached equilibrium when $\Delta G_{RXN} = 0$. Hence at
chemical equilibrium:

$$0 = \Delta G^{\circ}_{RXN} + RT\cdot\ln(K) \qquad\text{or}\qquad \ln(K) = -\frac{\Delta G^{\circ}_{RXN}}{RT}$$

!!! formula "At equilibrium: ΔG°RXN and K"
    $$\Delta G^{\circ}_{RXN} = -RT\cdot\ln(K) \qquad\text{or}\qquad K = e^{-\frac{\Delta G^{\circ}_{RXN}}{RT}}$$

How the values correspond:

| $\Delta G^{\circ}_{RXN}$ | $K$ | Under standard conditions… |
|:-:|:-:|---|
| $< 0$ (negative) | $K > 1$ | spontaneous: **products** are heavily favored at equilibrium |
| $> 0$ (positive) | $K < 1$ | non-spontaneous: **reactants** are favored at equilibrium |
| $= 0$ | $K = 1$ (exactly one) | at equilibrium |

## ΔGRXN, Q and K together

$$
\begin{aligned}
\Delta G_{RXN} &= \Delta G^{\circ}_{RXN} + RT\cdot\ln(Q_p) \\
\text{Recall that: } \Delta G^{\circ}_{RXN} &= -RT\cdot\ln(K) \\
\text{Hence, } \Delta G_{RXN} &= -RT\cdot\ln(K) + RT\cdot\ln(Q_p)
\end{aligned}
$$

!!! formula "ΔGRXN from Q and K"
    $$\Delta G_{RXN} = RT\cdot\ln\left(\frac{Q_p}{K}\right)$$

| $\dfrac{Q_p}{K}$ | $\ln\left(\dfrac{Q_p}{K}\right)$ | $\Delta G_{RXN}$ | The reaction… |
|:-:|:-:|:-:|---|
| $< 1$ (i.e. $Q_p < K$) | $< 0$ | $< 0$ | is spontaneous in the forward direction |
| $> 1$ (i.e. $Q_p > K$) | $> 0$ | $> 0$ | is non-spontaneous in the forward direction, or spontaneous in the reverse direction |
| $= 1$ (i.e. $Q_p = K$) | $0$ | $0$ | has reached equilibrium: products and reactants are present at their equilibrium concentrations |

These are the same three cases as [comparing Q and K](../03-equilibrium/reaction-quotient.md#comparing-q-and-k-three-cases):
$\Delta G_{RXN}$ explains *why* a reaction shifts toward equilibrium.

End of thermodynamics {.divider}
