---
title: Ideal Gas Equations
unit: 1
description: The three forms of the ideal gas equation, R and the unit conversions, and Dalton's law of partial pressures for a gas collected over water (with a density example and an unknown-metal example).
sources:
  - {nb: "1", pages: "5-6"}
  - {nb: "class-notes", pages: "3, 7"}
dates: ["8/26/26"]
tags: [gases, ideal gas law, Dalton's law]
---

!!! objective "Students will be able to"
    Calculate the empirical formula & molecular formula of a given compound, and then be able to
    use Ideal Gas Equations & Dalton's law of partial pressures to determine an unknown metal in a
    different problem.

## Vocabulary

**Ideal gas equations**
:   Three forms of $PV = nRT$ that relate pressure, volume, temperature and amount of a gas.

**Partial pressure**
:   The pressure one gas in a mixture would have if it were alone in the container.

**Dalton's law of partial pressures**
:   The sum of all partial pressures is the total pressure.

**[Empirical formula](empirical-molecular-formulas.md)**
:   The simplest mole ratio of elements in a compound.

**[Molecular formula](empirical-molecular-formulas.md)**
:   A multiple of the empirical formula.

## Ideal gas equations: 3 types

There are three forms of the ideal gas equation. Pick the one that matches what the problem gives
you: **moles**, **mass / molar mass**, or **density**.

Ideal gas equation is only for gases!
{.star}

!!! formula "Ideal gas equation — moles (n)"
    $$PV = nRT$$

    Use it when you know or want the **moles** ($n$ = moles of a gas).

!!! formula "Ideal gas equation — mass (m) & molar mass (M)"
    $$PV = \frac{mRT}{M}$$

    Use it with **mass** $m$ in g and **molar mass** $M$ in g/mol.

!!! formula "Ideal gas equation — density (D)"
    $$PM = DRT$$

    Use it with **density** $D$ in g/L ($M$ = molar mass in g/mol).

!!! formula "Gas constant R"
    $$R = 0.08206\ \frac{\text{L}\cdot\text{atm}}{\text{mol}\cdot\text{K}}$$

    Often rounded to $0.0821\ \frac{\text{L}\cdot\text{atm}}{\text{mol}\cdot\text{K}}$.

    | Symbol | Meaning | Unit |
    |:-:|---|---|
    | $P$ | Pressure | atm |
    | $V$ | Volume | L |
    | $T$ | Temperature | Kelvin (K) |
    | $n$ | Amount | mol |

## Conversions

Because $R$ uses atm, L and K, convert every given value into those units first.

!!! formula "Gas unit conversions (atm, L, K)"
    | Quantity | Conversion |
    |---|---|
    | Pressure | $1\ \text{atm} = 760\ \text{mmHg} = 760\ \text{torr} = 101.3\ \text{kPa} = 101300\ \text{Pa}$ |
    | Volume | $1000\ \text{mL} = 1000\ \text{cc} = 1\ \text{L}$ ($1\ \text{mL} = 1\ \text{cc} = 1\ \text{cm}^3$) |
    | Temperature | $T = 273.15 + {}^\circ\text{C}$ |

A full worked problem with $PV = nRT$ (finding the molar mass of an unknown gas) is the
[unknown P & F compound](empirical-molecular-formulas.md#worked-example-unknown-p-f-compound).

!!! example "Example: molar mass from density (PM = DRT)"
    **Problem:** A gas has a density of 1.25 g/L at 0 °C and 1.00 atm. Find its molar mass.

    | Given | Converted | Variable |
    |---|---|:-:|
    | 1.25 g/L | 1.25 g/L | $D$ |
    | 0 °C | 273.15 K | $T$ |
    | 1.00 atm | 1.00 atm | $P$ |

    Solve $PM = DRT$ for $M$:

    $$M = \frac{DRT}{P} = \frac{(1.25\ \frac{\text{g}}{\text{L}})\left(0.08206\ \frac{\text{L}\cdot\text{atm}}{\text{mol}\cdot\text{K}}\right)(273.15\ \text{K})}{1.00\ \text{atm}} = 28.0\ \text{g/mol}$$

    $\therefore$ The gas could be $\ce{N2}$ (28.02 g/mol).

## Dalton's law of partial pressures

In a mixture of gases, each gas pushes with its own **partial pressure**, and the sum of all
partial pressures is the total pressure. This matters when a gas is collected over water, because
the container ends up holding both the gas and water vapor.

```apparatus
parts:
  - {type: gas-collection, id: g}
labels:
  - {text: gas, to: g.tube, side: top}
  - {text: "Since the gas is collected over water,\nwe capture both our wanted gas\nand water vapor.", to: g.gas, side: right, arrow: true}
  - {text: H2O, to: g.water, side: right}
caption: Collecting a gas over water
```

!!! formula "Dalton's law of partial pressures"
    $$P_{total} = P_{gas} + P_{water}$$

    The sum of all partial pressures is the total pressure. For a gas collected over water,
    $P_{gas} = P_{total} - P_{water}$.

### Finding an unknown metal

Dalton's law and $PV = nRT$ together can identify a metal from the hydrogen gas it makes. Subtract
the water vapor first, then use only the gas's own pressure.

!!! example "Example: unknown metal from H₂ collected over water"
    **Problem:** 0.240 g of an unknown metal M reacts with excess HCl:
    $\ce{M + 2HCl -> MCl2 + H2}$. The $\ce{H2}$ is collected over water at 25 °C. The gas
    collected has a volume of 0.250 L and a total pressure of 758 mmHg. The vapor pressure of water
    at 25 °C is 23.8 mmHg. Identify the metal.

    **1. Partial pressure of $\ce{H2}$** (Dalton's law)

    $$P_{\ce{H2}} = P_{total} - P_{water} = 758\ \text{mmHg} - 23.8\ \text{mmHg} = 734.2\ \text{mmHg}$$

    $$734.2\ \cancel{\text{mmHg}}\cdot\frac{1\ \text{atm}}{760\ \cancel{\text{mmHg}}} = 0.9661\ \text{atm}$$

    **2. Moles of $\ce{H2}$** ($T = 273.15 + 25 = 298.15\ \text{K}$)

    $$n = \frac{PV}{RT} = \frac{(0.9661\ \text{atm})(0.250\ \text{L})}{\left(0.08206\ \frac{\text{L}\cdot\text{atm}}{\text{mol}\cdot\text{K}}\right)(298.15\ \text{K})} = 0.009872\ \text{mol}\ \ce{H2}$$

    **3. Moles of metal** (1 mol M : 1 mol $\ce{H2}$)

    $$0.009872\ \text{mol}\ \ce{H2}\cdot\frac{1\ \text{mol M}}{1\ \text{mol}\ \ce{H2}} = 0.009872\ \text{mol M}$$

    **4. Molar mass of the metal**

    $$\text{molar mass} = \frac{0.240\ \text{g}}{0.009872\ \text{mol}} = 24.3\ \text{g/mol}$$

    $\therefore$ The metal is **magnesium** (Mg, 24.31 g/mol).
