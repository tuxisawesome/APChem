---
title: Chemical Equilibrium
unit: 3
description: What chemical equilibrium is (rate of forward rxn = rate of reverse rxn), the graphs that show it, how to write Kc and Kp expressions, and what the size of K tells you.
sources:
  - {nb: "1", pages: "34-37"}
dates: ["9/22/26"]
tags: [equilibrium, Kc, Kp, activity]
---

!!! objective "Students will be able to"
    Define the state of equilibrium for chemical reactions and then be able to derive the
    expressions for equilibrium constant ($K_c$ or $K_p$) under several different conditions.

## What is chemical equilibrium?

A reversible reaction runs in both directions at once. The example used in class is dinitrogen
tetroxide breaking apart into nitrogen dioxide (and NO₂ joining back into N₂O₄):

$$\ce{N2O4(g) <=> 2NO2(g)}$$

The double arrow is really two half-arrows:

**$\rightharpoonup$ (top half-arrow)**
:   The **forward reaction** (reactants forming products).

**$\leftharpoondown$ (bottom half-arrow)**
:   The **reverse reaction** (products forming reactants).

**Equilibrium** in a chemical reaction is established when the rate of the forward reaction is
equal to the rate of the reverse reaction.

!!! formula "Condition for equilibrium"
    $$\text{Rate of forward rxn} = \text{Rate of reverse rxn}$$

Equilibrium is **dynamic**: both reactions keep going the whole time. The amounts stop changing
only because $\ce{NO2}$ is being made exactly as fast as it is being used up.

Misconception: at equilibrium, concentration of products $\neq$ concentration of reactants — the concentrations are NOT equal.
{.star}

<div class="tchart" markdown>
<div markdown>
**True at equilibrium**

- Rate of forward rxn $=$ rate of reverse rxn
- The concentrations stay **constant** (they stop changing)
- Both reactions are still happening
</div>
<div markdown>
**NOT true (misconceptions)**

- Concentration of reactants $[R]$ $=$ concentration of products $[P]$
- The reaction has stopped
</div>
</div>

## Graphs that show equilibrium

These two sketches show the same reaction ($\ce{N2O4(g) <=> 2NO2(g)}$) reaching equilibrium. In both
graphs, $[\ ]$ means **concentration**.

<div class="cols" markdown>
<div markdown>

```graph
x: {label: t}
y: {label: Concentration, min: 0, max: 1}
curves:
  - {points: [[0, .95], [0.8, .62], [2, .45], [4.5, .37], [10, .36]], label: "[N2O4]", label_at: start, color: 1}
  - {points: [[0, 0], [0.6, .32], [1.6, .5], [4, .6], [10, .62]], label: "[NO2]", label_at: start, color: 2}
annotations:
  - span: {x: 8.3, from: .36, to: .62}
    text: Equilibrium
caption: Concentration vs. t
```

</div>
<div markdown>

```graph
x: {label: t}
y: {label: Rate, min: 0, max: 1}
curves:
  - {points: [[0, .92], [1.5, .68], [3.5, .52], [6, .465], [10, .46]], label: "N2O4", label_at: start, color: 1}
  - {points: [[0, .02], [2, .24], [4.5, .39], [7, .455], [10, .46]], label: "NO2", label_at: start, color: 2}
annotations:
  - callout: {at: [7.6, .78], to: [8.4, .47]}
    text: "equilibrium\nrate is equal"
caption: Rate vs. t
```

</div>
</div>

- In the **concentration graph**, $[\ce{N2O4}]$ starts high and $[\ce{NO2}]$ starts at zero. Both
  level off, but at different heights: at equilibrium the concentrations stop changing, they do
  not become equal ($[\ ]_P \neq [\ ]_R$).
- In the **rate graph**, the forward rate falls and the reverse rate rises until they meet. Where
  the curves join, the rates are equal, and that is equilibrium.

## Measuring equilibrium quantitatively

To describe equilibrium with numbers, we use concentrations (for solutions) or pressures (for
gases).

!!! formula "Concentration [ ] and pressure (P)"
    $[\ ]$ = concentration in terms of Molarity $(M) = \dfrac{mol}{L}$

    $(P)$ = Pressure of a gas

!!! formula "Activity"
    $$\text{activity} = \frac{[\ ]}{1M},\ \ \frac{P}{1\,atm}$$

    Solids and liquids: activity $= 1$

There are two equilibrium constants, one for each kind of measurement:

**$K_c$**
:   Equilibrium constant for **concentration** ($[\ ]$).

**$K_p$**
:   Equilibrium constant for **pressure** ($(P)$).

Quantitatively, we can determine if a reaction is reaching equilibrium by calculating $K_c$ or
$K_p$.

$K_c$ or $K_p$ is constant for a given temperature for a given reaction.
{.star}

Two facts to remember about every $K_c$ and $K_p$:

- $K_c$ and $K_p$ have **NO units**. Every term in them is an activity, which is a ratio with the
  units divided out.
- $K_c$ and $K_p$ for a given reaction change **ONLY when the temperature changes**. Changing a
  concentration, the pressure or the volume makes the reaction shift (see
  [Le Chatelier](le-chatelier.md)), but it comes back to the same K.

## How to calculate Kc or Kp

Take a general reaction where every species is a gas, $aJ_{(g)} + bK_{(g)} \rightleftharpoons cL_{(g)} + dM_{(g)}$.
The constant is **products over reactants**, with each one raised to the power of its
coefficient.

!!! formula "Equilibrium constant Kc"
    $$\underset{[\ ]}{K_c} = \frac{[L]^c\cdot[M]^d}{[J]^a\cdot[K]^b}$$

    for $aJ + bK \rightleftharpoons cL + dM$

!!! formula "Equilibrium constant Kp"
    $$\underset{(P)}{K_p} = \frac{(P_L)^c\cdot(P_M)^d}{(P_J)^a\cdot(P_K)^b}$$

    for $aJ_{(g)} + bK_{(g)} \rightleftharpoons cL_{(g)} + dM_{(g)}$

### Solids and liquids are left out

In a $K_c$ or $K_p$ equation, **solids and liquids** are <span class="boxed">NOT</span> included
because their activity $= 1$.

Solids don't react!
{.star}

!!! example "Example: a solid in the equation"
    $$\ce{P4(s) + 5O2(g) <=> P4O10(s)}$$

    Both $\ce{P4}$ and $\ce{P4O10}$ are solids, so they count as 1 and only $\ce{O2}$ is left:

    $$K_c = \frac{1}{1\cdot[\ce{O2}]^5} = \frac{1}{[\ce{O2}]^5}$$

    $$K_p = \frac{1}{(P_{\ce{O2}})^5}$$

Everything that applies to $K_p$ applies to $K_c$.
{.star}

### Practice writing K expressions

The same three rules work for every reaction: products over reactants, coefficients become
powers, and solids and liquids are left out.

!!! example "Example: a coefficient becomes a power"
    $$\ce{N2O4(g) <=> 2NO2(g)}$$

    The coefficient 2 on $\ce{NO2}$ becomes a power of 2:

    $$K_c = \frac{[\ce{NO2}]^2}{[\ce{N2O4}]} \qquad K_p = \frac{(P_{\ce{NO2}})^2}{(P_{\ce{N2O4}})}$$

!!! example "Example: a solid that breaks down into a gas"
    $$\ce{CaCO3(s) <=> CaO(s) + CO2(g)}$$

    Both solids have activity $= 1$, so only the gas is left:

    $$K_c = \frac{1\cdot[\ce{CO2}]}{1} = [\ce{CO2}] \qquad K_p = P_{\ce{CO2}}$$

!!! example "Example: an aqueous reaction with liquid water"
    $$\ce{NH3(aq) + H2O(l) <=> NH4+(aq) + OH-(aq)}$$

    $\ce{H2O(l)}$ is a pure liquid, so it is left out. There are no gases, so only $K_c$ is
    written:

    $$K_c = \frac{[\ce{NH4+}]\cdot[\ce{OH-}]}{[\ce{NH3}]}$$

Only **gases** go into $K_p$; dissolved $(aq)$ species go into $K_c$ as concentrations.
{.star}

## What the size of K tells you

K is products over reactants, so its size shows which side the equilibrium mixture favors.

| Size of K | The fraction is… | At equilibrium there are mostly… |
|---|---|---|
| $K \gg 1$ (for example $3.1\cdot10^{14}$) | Numerator heavy | **Products** (products favored) |
| $K \approx 1$ | About balanced | Similar amounts of reactants and products |
| $K \ll 1$ (for example $2.145\cdot10^{-5}$) | Denominator heavy | **Reactants** (reactants favored) |

The two example values come from these notes: $3.1\cdot10^{14}$ is the $K_p$ found by
[adding elementary steps](manipulating-k.md), and $2.145\cdot10^{-5}$ is the $K_c$ of the
[PCl₅ RICE table](rice-tables.md).
