---
title: Ideal Gas Equations
unit: 1
description: The three forms of the ideal gas equation, R and the unit conversions, and Dalton's law of partial pressures for a gas collected over water.
sources:
  - {nb: "1", pages: "5-6"}
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

    Use it when you know or want the **moles** ($n$).

!!! formula "Ideal gas equation — mass (m) & molar mass (M)"
    $$PV = \frac{mRT}{M}$$

    Use it with **mass** $m$ in g and **molar mass** $M$ in g/mol.

!!! formula "Ideal gas equation — density (D)"
    $$PM = DRT$$

    Use it with **density** $D$ in g/L ($M$ = molar mass in g/mol).

!!! formula "Gas constant R"
    $$R = 0.08206\ \frac{\text{L}\cdot\text{atm}}{\text{mol}\cdot\text{K}}$$

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
    | Volume | $1000\ \text{mL} = 1\ \text{L}$ |
    | Temperature | $T = 273.15 + {}^\circ\text{C}$ |

A full worked problem with $PV = nRT$ (finding the molar mass of an unknown gas) is the
[unknown P & F compound](empirical-molecular-formulas.md#worked-example-unknown-p-f-compound).

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

    The sum of all partial pressures is the total pressure.
