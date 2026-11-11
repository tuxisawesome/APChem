---
title: Manipulating K
unit: 3
description: Kc or Kp equations for different conditions — reversing a reaction, multiplying it by n, converting between Kp and Kc, adding elementary steps — and partial pressures from mole fractions.
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

$n$ does not have to be a whole number: multiplying a reaction by $\frac{1}{2}$ means taking the
square root of K.
{.star}

!!! example "Example: K for different ways of writing the ammonia reaction"
    At 300°C, $\ce{N2(g) + 3H2(g) <=> 2NH3(g)}$ has $K_c = 0.052$. Every other way of writing
    the reaction gets its K from that one number:

    | Reaction as written | What was done | New $K_c$ |
    |---|---|---|
    | $\ce{N2 + 3H2 <=> 2NH3}$ | Starting reaction | $0.052$ |
    | $\ce{2NH3 <=> N2 + 3H2}$ | Reversed | $K_c(\text{REV}) = \dfrac{1}{0.052} = 19.2$ |
    | $\ce{2N2 + 6H2 <=> 4NH3}$ | Multiplied by 2 | $K_c('2') = (0.052)^2 = 2.7\cdot10^{-3}$ |
    | $\ce{1/2N2 + 3/2H2 <=> NH3}$ | Multiplied by $\frac{1}{2}$ | $(0.052)^{1/2} = 0.228$ |
    | $\ce{NH3 <=> 1/2N2 + 3/2H2}$ | Reversed and multiplied by $\frac{1}{2}$ | $\left(\dfrac{1}{0.052}\right)^{1/2} = 4.39$ |

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

    $R = 0.08206\ \dfrac{\text{L}\cdot\text{atm}}{\text{mol}\cdot\text{K}}$ and $T$ = temperature
    in Kelvin ($T = 273.15 + {}^\circ\text{C}$)

!!! formula memorize "Δn"
    $$\Delta n = \Sigma n_{products} - \Sigma n_{reactants}$$

    (moles of gas) = (sum of the coefficients of the gaseous products) − (sum of the
    coefficients of the gaseous reactants)

If $\Delta n = 0$ (the same moles of gas on both sides), then $(RT)^0 = 1$ and $K_p = K_c$.
{.star}

!!! example "Example: Kp of the ammonia synthesis at 300°C"
    $$\ce{N2(g) + 3H2(g) <=> 2NH3(g)} \qquad K_c = 0.052$$

    1. **Find Δn:** $\Delta n = 2 - (1 + 3) = -2$
    2. **Convert T to Kelvin:** $T = 273.15 + 300 = 573.15\ \text{K}$
    3. **Find RT:** $RT = 0.08206\ \dfrac{\text{L}\cdot\text{atm}}{\text{mol}\cdot\text{K}}\cdot573.15\ \text{K} = 47.03\ \dfrac{\text{L}\cdot\text{atm}}{\text{mol}}$
    4. **Plug in** (K has no units, so the units drop out):

    $$K_p = K_c(RT)^{\Delta n} = 0.052\cdot(47.03)^{-2} = \frac{0.052}{2212} = 2.35\cdot10^{-5}$$

    $\Delta n$ is negative, so $K_p$ comes out smaller than $K_c$.

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

    **Main reaction:** $K_p = ?$

    **Operations to i:** two operations — flip it and multiply it by 2 — so its constant becomes
    $K_{p_i,\text{new}} = \left(\dfrac{1}{K_{p_i}}\right)^2 = \left(\dfrac{1}{8.8\cdot10^{-12}}\right)^2$.

    $$\text{i.}\quad \boxed{\ce{2CO}} + \ce{2Cl2 <=> 2COCl2}$$

    **No operations to ii:**

    $$\text{ii.}\quad \ce{C(s) + CO2(g)} \rightleftharpoons \boxed{\ce{2CO}}$$

    The boxed $\ce{2CO}$ is an **intermediate**: it must disappear when the steps are added.

    **Add i + ii.** The $\ce{2CO}$ on each side cancels:

    $$\text{Main:}\quad \cancel{\ce{2CO}} + \ce{2Cl2 + C(s) + CO2(g)} \rightleftharpoons \cancel{\ce{2CO}} + \ce{2COCl2}$$

    $$\ce{C(s) + CO2(g) + 2Cl2(g) <=> 2COCl2}$$

    **Multiply the constants** of the two steps to get $K_p$ of the main reaction:

    $$K_{p,\text{overall}} = K_{p_i,\text{new}}\cdot K_{p_{ii}} = \left(\frac{1}{8.8\cdot10^{-12}}\right)^2\cdot2.4\cdot10^{-8}$$

    $$K_{p,\text{overall}} = (1.29\cdot10^{22})\cdot(2.4\cdot10^{-8}) = 3.1\cdot10^{14}$$

!!! formula "Adding reactions"
    When reactions are added, $K_p$ is multiplied:

    $$K_p = \left(\frac{1}{K_{p_i}}\right)^2\cdot K_{p_{ii}}$$

When reactions are added, $K_p$ is multiplied.
{.star}

### K vs ΔH: the same moves, different math

Hess's law and equilibrium constants use the same moves on a reaction (flip it, multiply it, add
steps), but $\Delta H$ changes by adding while K changes by multiplying.

!!! formula "Changing a reaction: K vs ΔH"
    | What you do to the reaction | $\Delta H$ (Hess's law) | $K$ |
    |---|---|---|
    | Reverse it | $-\Delta H$ (the heat term moves to the other side) | $\dfrac{1}{K}$ |
    | Multiply it by $n$ | $n\cdot\Delta H$ | $K^n$ |
    | Add steps together | $\Delta H_i + \Delta H_{ii}$ | $K_i\cdot K_{ii}$ |

## Mole fraction

The **mole fraction** tells you what share of all the moles in a mixture belongs to one
component.

!!! formula "Mole fraction"
    $$\text{Mole Fraction} = \frac{\text{mol component}}{\text{Total moles}}$$

In a mixture of gases, each gas's share of the moles is also its share of the total pressure
([Dalton's law](../01-foundations-1/ideal-gas-equations.md#daltons-law-of-partial-pressures)). That is how mole fractions give the
partial pressures that go into $K_p$.

!!! formula "Partial pressure from mole fraction"
    $$P_A = (\text{Mole Fraction})_A\cdot P_{total}$$

!!! example "Example: Kp from mole fractions"
    An equilibrium mixture for $\ce{N2O4(g) <=> 2NO2(g)}$ contains 0.60 mol $\ce{N2O4}$ and
    0.40 mol $\ce{NO2}$ at a total pressure of 2.0 atm. Find $K_p$.

    1. **Total moles:** $0.60\ \text{mol} + 0.40\ \text{mol} = 1.00\ \text{mol}$
    2. **Mole fractions:** $\ce{N2O4}$: $\dfrac{0.60\ \text{mol}}{1.00\ \text{mol}} = 0.60$;
       $\ce{NO2}$: $\dfrac{0.40\ \text{mol}}{1.00\ \text{mol}} = 0.40$
    3. **Partial pressures:** $P_{\ce{N2O4}} = 0.60\cdot2.0\ \text{atm} = 1.2\ \text{atm}$;
       $P_{\ce{NO2}} = 0.40\cdot2.0\ \text{atm} = 0.80\ \text{atm}$
    4. **Kp:**

    $$K_p = \frac{(P_{\ce{NO2}})^2}{(P_{\ce{N2O4}})} = \frac{(0.80)^2}{1.2} = 0.53$$

$K_p = K_c(RT)^{\Delta n}$
{.star}
