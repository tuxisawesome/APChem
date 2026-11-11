---
title: Reaction Quotient
unit: 3
description: The reaction quotient Q (calculated at time 0) and how comparing Q to K predicts whether the forward or reverse reaction is favored.
sources:
  - {nb: "1", pages: "40-43"}
  - {nb: "class-notes", pages: "15, 17-18, 45, 50"}
dates: ["9/23/26"]
tags: [equilibrium, Q, reaction quotient]
---

!!! objective "Students will be able to"
    Define Reaction Quotient (Q) and then be able to predict if the forward or reverse reaction
    is preferred.

## Reaction Quotient (Q)

The **reaction quotient (Q)** is calculated using the **initial concentrations** of the compounds
in a reaction, in a similar way to how K was calculated. For a general reaction
$aL + bM \rightleftharpoons cN + dO$:

!!! formula "Reaction quotient Q"
    $$Q = \frac{[N]_0^c\,[O]_0^d}{[L]_0^a\,[M]_0^b}$$

    $[\ ]_0$ = concentration at time 0, for $aL + bM \rightleftharpoons cN + dO$

For gases, the same quotient can be written with initial partial pressures. Compare $Q_p$ with
$K_p$, and $Q_c$ (concentrations) with $K_c$.

!!! formula "Reaction quotient Qp (gases)"
    $$Q_p = \frac{(P_N)_0^c\,(P_O)_0^d}{(P_L)_0^a\,(P_M)_0^b}$$

    $(P)_0$ = partial pressure at time 0

Q is calculated at time 0, K is calculated at equilibrium.
{.star}

Side by side, the two expressions look the same; only the time the concentrations are measured
is different.

<div class="cols ruled" markdown>
<div markdown>
**Q — at time 0**

$$Q = \frac{[N]_0^c\,[O]_0^d}{[L]_0^a\,[M]_0^b}$$
</div>
<div markdown>
**K — at equilibrium**

$$K = \frac{[N]_{eq}^c\,[O]_{eq}^d}{[L]_{eq}^a\,[M]_{eq}^b}$$
</div>
</div>

Both Q and K are **ratios of concentrations**, so they can be compared directly.

## Comparing Q and K: three cases

Comparing Q to K tells you which way the reaction has to go to reach equilibrium. Writing
products as $[P]$ and reactants as $[R]$:

| Case | Compared with equilibrium | Meaning | Which reaction is favored |
|---|---|---|---|
| ① $Q < K$ | $\dfrac{[P]_0}{[R]_0} < \dfrac{[P]_{eq}}{[R]_{eq}}$: less products, more reactants | In the initial state (Q) there are more reactants compared to products than at equilibrium. The reactants react to get to equilibrium. | **Forward** reaction favored (faster) |
| ② $Q > K$ | $\dfrac{[P]_0}{[R]_0} > \dfrac{[P]_{eq}}{[R]_{eq}}$: more products, less reactants | In the initial state (Q) there are more products compared to reactants than at equilibrium. The products reverse-react to get to equilibrium (until $Q = K$). | **Reverse** reaction favored (faster) |
| ③ $Q = K$ | $\dfrac{[P]_0}{[R]_0} = \dfrac{[P]_{eq}}{[R]_{eq}}$ | The forward and reverse reactions are going at the same rate. | Neither: the reaction is already at equilibrium |

Q always moves toward K. A small Q has to grow (make products); a big Q has to shrink (use up
products).

```graph
size: [320, 80]
axes: none
x: {min: 0, max: 10}
y: {min: 0, max: 2}
curves:
  - {points: [[0, 1], [10, 1]], smooth: false, color: ink, label_at: none}
annotations:
  - vline: 5
    text: "K (equilibrium)"
  - arrow: {from: [0.6, 1.35], to: [4.6, 1.35]}
  - arrow: {from: [9.4, 1.35], to: [5.4, 1.35]}
  - text: "Q < K: forward"
    at: [2.6, 1.6]
  - text: "Q > K: reverse"
    at: [7.4, 1.6]
  - text: "less products"
    at: [2.6, 0.35]
  - text: "more products"
    at: [7.4, 0.35]
caption: Q moves toward K — forward when Q < K, reverse when Q > K.
```

Q > K means the numerator is heavy = more products, so the products react (reverse reaction)
until Q = K.
{.star}

## Predicting the direction of a reaction

To predict the direction, calculate Q from the starting concentrations, then compare it with K.

!!! example "Example: synthesis of ammonia at 300°C"
    $$\ce{N2(g) + 3H2(g) <=> 2NH3} \qquad K_c = 0.052$$

    Predict the direction in which the reaction will proceed to reach equilibrium when the initial
    concentrations of $\ce{NH3}$, $\ce{N2}$ and $\ce{H2}$ are 0.001M, 0.0001M, and 0.002M
    respectively.

    $$Q = \frac{[\ce{NH3}]_0^2}{[\ce{N2}]_0\,[\ce{H2}]_0^3} = \frac{[0.001]^2}{[0.0001]\,[0.002]^3}$$

    $$Q = 1.25\cdot10^{6} > K = 0.052$$

    Since $Q > K$, the **reverse reaction is favored**. The numerator is heavy (far more
    $\ce{NH3}$ than at equilibrium), so $\ce{NH3}$ breaks down into $\ce{N2}$ and $\ce{H2}$ until
    $Q = K$.

!!! example "Example: Q < K"
    Same reaction and temperature ($K_c = 0.052$), but now the initial concentrations are 0.50M
    $\ce{N2}$, 0.40M $\ce{H2}$ and 0.0010M $\ce{NH3}$.

    $$Q = \frac{[\ce{NH3}]_0^2}{[\ce{N2}]_0\,[\ce{H2}]_0^3} = \frac{(0.0010)^2}{(0.50)\,(0.40)^3} = \frac{1.0\cdot10^{-6}}{0.032}$$

    $$Q = 3.1\cdot10^{-5} < K = 0.052$$

    Since $Q < K$, the **forward reaction is favored**: $\ce{N2}$ and $\ce{H2}$ react to make
    more $\ce{NH3}$.

!!! example "Example: Q = K"
    $\ce{N2O4(g) <=> 2NO2(g)}$ has $K_c = 0.020$ at a certain temperature. A flask contains
    0.080M $\ce{N2O4}$ and 0.040M $\ce{NO2}$.

    $$Q = \frac{[\ce{NO2}]_0^2}{[\ce{N2O4}]_0} = \frac{(0.040)^2}{0.080} = \frac{0.0016}{0.080} = 0.020$$

    Since $Q = K$, the mixture is **already at equilibrium**: the concentrations will not change.

## Q explains Le Chatelier

A stress on a reaction at equilibrium changes Q (or, for temperature, K). The reaction then
shifts until Q = K again, which is exactly what [Le Chatelier's principle](le-chatelier.md)
predicts. For $\ce{N2(g) + 3H2(g) <=> 2NH3(g)}$, starting at equilibrium:

| Stress | What happens to Q | Shift |
|---|---|---|
| Add $\ce{N2}$ or $\ce{H2}$ | The denominator gets bigger, so $Q < K$ | Forward |
| Remove $\ce{NH3}$ | The numerator gets smaller, so $Q < K$ | Forward |
| Add $\ce{NH3}$ | The numerator gets bigger, so $Q > K$ | Reverse |
| Halve the volume (pressure goes up) | Every $[\ ]$ doubles, so $Q$ is multiplied by $\dfrac{2^2}{2\cdot2^3} = \dfrac{1}{4}$ and $Q < K$ | Forward |
| Change the temperature | Q stays the same, but **K** changes | Toward the new K |
