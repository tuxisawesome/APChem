---
title: Manipulating K
unit: 3
description: Kc or Kp equations for different conditions — reversing a reaction, multiplying it by n, converting between Kp and Kc, and adding elementary steps.
sources:
  - {nb: "1", pages: "38-39, 49"}
dates: ["9/22/26", "9/25/26"]
tags: [equilibrium, Kc, Kp, Hess's law, mole fraction]
---

## Kc or Kp equations for different conditions

When you change how a reaction is written, its equilibrium constant changes in a predictable
way. Cases 1–4 all use the synthesis of ammonia, $\ce{N2(g) + 3H2(g) <=> 2NH3(g)}$.

| Case | What you do to the reaction | What happens to K |
|---|---|---|
| 1. Starting reaction | Nothing: $\ce{N2 + 3H2 <=> 2NH3}$ | $K_c$ |
| 2. Reverse the reaction | Flip it: $\ce{2NH3 <=> N2 + 3H2}$ | $K_c(\text{REV}) = \dfrac{1}{K_c}$ |
| 3. Multiply the reaction by 'n' | $n\ce{N2} + 3n\ce{H2} \rightleftharpoons 2n\ce{NH3}$ | $K_c('n') = (K_c)^n$ |
| 4. Switch between $K_p$ and $K_c$ | Use pressures instead of concentrations | $K_p = K_c(RT)^{\Delta n}$ |
| 5. Add elementary steps | Add the steps to get the main reaction | The K's are **multiplied** |

### 1. The starting reaction

The starting $K_c$ is written the usual way: products over reactants, each raised to its
coefficient.

!!! formula "Kc of N₂ + 3H₂ ⇌ 2NH₃"
    $$K_c = \frac{[\ce{NH3}]^2}{[\ce{N2}]\cdot[\ce{H2}]^3}$$

### 2. Reverse the reaction

Flipping the reaction to $\ce{2NH3(g) <=> N2(g) + 3H2(g)}$ turns the fraction upside down, so
the new constant is the **reciprocal** of the old one.

!!! formula memorize "Kc of a reversed reaction"
    $$K_c(\text{REV}) = \frac{[\ce{N2}]\cdot[\ce{H2}]^3}{[\ce{NH3}]^2} = \frac{1}{K_c}$$

### 3. If the reaction is multiplied by 'n'

Multiplying every coefficient by $n$ gives $n\ce{N2} + 3n\ce{H2} \rightleftharpoons 2n\ce{NH3}$.
Every exponent is multiplied by $n$, so the constant is **raised to the power $n$**.

!!! formula memorize "Kc of a reaction × n"
    $$K_c('n') = \frac{[\ce{NH3}]^{2n}}{[\ce{N2}]^n\cdot[\ce{H2}]^{3n}} = \left(\frac{[\ce{NH3}]^2}{[\ce{N2}]\cdot[\ce{H2}]^3}\right)^n = (K_c)^n$$

### 4. Relationship between Kp & Kc

$K_p$ uses partial pressures and $K_c$ uses concentrations. The gas laws in the sidebar connect
them: each pressure can be replaced by $[\ ]RT$.

<div class="cols sidebar" markdown>
<div markdown>

Start from $K_p$ for $\ce{N2(g) + 3H2(g) <=> 2NH3(g)}$:

$$K_p = \frac{(P_{\ce{NH3}})^2}{(P_{\ce{N2}})\cdot(P_{\ce{H2}})^3}$$

Replace each pressure with $[\ ]RT$:

$$K_p = \frac{[\ce{NH3}]^2\cdot(RT)^2}{[\ce{N2}]\cdot(RT)\cdot[\ce{H2}]^3\cdot(RT)^3}$$

The concentrations make $K_c$, and the $(RT)$ terms are left over:

$$K_p = K_c\cdot(RT)^{2-(1+3)}$$

</div>
<div markdown>

!!! formula "Gas laws"
    $$PV = nRT$$

    $$P = \frac{nRT}{V}$$

    $$P = [\ ]RT$$

</div>
</div>

The exponent is always (moles of gas in products) − (moles of gas in reactants):

!!! formula memorize "Kp–Kc relationship"
    $$K_p = K_c(RT)^{\Delta n}$$

!!! formula memorize "Δn"
    $$\Delta n = \Sigma n_{products} - \Sigma n_{reactants}$$

    (moles of gas)

### 5. Reaction happening in elementary steps (Hess's law application)

If the main reaction happens in **elementary steps**, you can build it out of the steps the same
way as Hess's law: change each step so it matches the main reaction, then add them.

!!! example "Example: building the main reaction from two steps"
    **Main reaction** (the ✓ species are the ones the steps have to match):

    $$\ce{C(s) + CO2(g)} + \overset{\checkmark}{\ce{2Cl2(g)}} \rightleftharpoons \overset{\checkmark}{\ce{2COCl2(g)}}$$

    **Elementary steps:**

    | Step | Elementary reaction | $K_p$ |
    |---|---|---|
    | i. | $\ce{COCl2(g) <=> CO + Cl2}$ | $K_{p_i} = 8.8\cdot10^{-12}$ |
    | ii. | $\ce{C(s) + CO2(g) <=> 2CO}$ | $K_{p_{ii}} = 2.4\cdot10^{-8}$ |

    **Operations to i:** flip it and multiply it by 2, so its constant becomes
    $\left(\dfrac{1}{K_{p_i}}\right)^2$.

    $$\text{i.}\quad \boxed{\ce{2CO}} + \ce{2Cl2 <=> 2COCl2}$$

    **No operations to ii:**

    $$\text{ii.}\quad \ce{C(s) + CO2(g)} \rightleftharpoons \boxed{\ce{2CO}}$$

    The boxed $\ce{2CO}$ is an **intermediate**: it must disappear when the steps are added.

    **Add i + ii.** The $\ce{2CO}$ on each side cancels:

    $$\text{Main:}\quad \cancel{\ce{2CO}} + \ce{2Cl2 + C(s) + CO2(g)} \rightleftharpoons \cancel{\ce{2CO}} + \ce{2COCl2}$$

    $$\ce{C(s) + CO2(g) + 2Cl2(g) <=> 2COCl2}$$

!!! formula "Adding reactions"
    When reactions are added, $K_p$ is multiplied:

    $$K_p = \left(\frac{1}{K_{p_i}}\right)^2\cdot K_{p_{ii}}$$

When reactions are added, $K_p$ is multiplied.
{.star}

## Mole fraction

The **mole fraction** tells you what share of all the moles in a mixture belongs to one
component.

!!! formula "Mole fraction"
    $$\text{Mole Fraction} = \frac{\text{mol component}}{\text{Total moles}}$$

$K_p = K_c(RT)^{\Delta n}$
{.star}
