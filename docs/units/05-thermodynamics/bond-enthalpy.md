---
title: Bond Enthalpy
unit: 5
description: A third way to find ΔH°RXN — add up the bond enthalpies (H°b) of the bonds broken in the reactants and subtract the bonds formed in the products — with the C₂H₄ combustion example.
sources:
  - {nb: "1", pages: "93"}
  - {nb: "class-notes", pages: "97, 99"}
dates: ["11/13/26"]
tags: [bond enthalpy, enthalpy, ΔH, bonds, Lewis structures, combustion]
---

!!! objective "Students will be able to"
    - Apply the bond enthalpy concept to solve for the $\Delta H_{RXN}$.

## Bond enthalpy (Hb)

Every chemical bond takes energy to break. The amount for each kind of bond is its bond enthalpy.

**Bond enthalpy** ($H_b$)
:   The energy needed to break one mole of a particular bond (such as C–H) in the gas phase,
    in $\frac{kJ}{mol}$. Breaking a bond always takes energy, so bond enthalpies are positive.

To use bond enthalpies, first count the bonds from each molecule's Lewis structure. Methane,
$\ce{CH4}$, has **4 C–H bonds**:

```lewis
items:
  - id: ch4
    molecule:
      atoms:
        C: {at: [0, 0]}
        H1: {at: [0, -1]}
        H2: {at: [1, 0]}
        H3: {at: [0, 1]}
        H4: {at: [-1, 0]}
      bonds: [[C, H1], [C, H2], [C, H3], [C, H4]]
    label: "CH4: 4 C–H bonds"
  - text: "        "
  - id: o2
    molecule:
      atoms:
        O1: {at: [0, 0], lone: [n, w]}
        O2: {at: [1, 0], lone: [n, e]}
      bonds: [[O1, O2, 2]]
    label: "O2: 1 O=O (double) bond"
caption: Count the bonds in each Lewis structure
```

## Bond strength and length

The more bonds between two atoms, the stronger and shorter the bond, so the bigger its bond
enthalpy:

| Bond | Bond enthalpy | Strength | Length |
|---|:-:|---|---|
| Triple ($\equiv$) | highest | strongest | shortest |
| Double ($=$) | middle | | |
| Single ($-$) | lowest | weakest | longest |

$$\underbrace{\equiv}_{\text{strong, short}}\ >\ =\ >\ \underbrace{-}_{\text{weak, long}}$$

## ΔH°RXN from bond enthalpies

The **bond enthalpy of a RXN** ($\Delta H^{\circ}_{b}$) is the sum of the bond enthalpies of the
reactants minus the sum for the products:

!!! formula "Bond enthalpy of a RXN (ΔH°b)"
    $$\underset{RXN}{\Delta} H^{\circ}_{b} = \Sigma H^{\circ}_{b}\ \text{Reactants} - \Sigma H^{\circ}_{b}\ \text{Products}$$

    Each $H^{\circ}_b$ is multiplied by the number of moles of that bond (the coefficient times the
    number of those bonds in one molecule).

!!! note "Reactants − Products: backwards from ΔH°f"
    The reactants' bonds are **broken**, which takes energy ($+$). The products' bonds are
    **formed**, which releases energy ($-$). That's why this formula is **Reactants − Products**,
    the opposite order from the
    [enthalpy of formation formula](enthalpy.md#method-2-standard-enthalpy-of-formation)
    (products − reactants).

**Steps**

1. Balance the equation.
2. Draw the Lewis structure of each molecule.
3. Count each type of bond, times the coefficient.
4. Multiply each count (in mol) by its bond enthalpy, and add up the Reactants and the Products.
5. $\Delta H^{\circ}_{b}$ = Reactants − Products.

Bond enthalpies are averages over many molecules, so a $\Delta H$ from them is a close estimate.

!!! example "Example: combustion of C₂H₄"
    Calculate $\Delta H^{\circ}_{b}$ for:

    $$\ce{C2H4(g) + 3O2(g) -> 2CO2(g) + 2H2O(g)}$$

    **Draw the bonds** and count each type, times the coefficients:

    ```lewis
    items:
      - id: c2h4
        molecule:
          atoms:
            C1: {at: [0, 0]}
            C2: {at: [1, 0]}
            H1: {at: [-0.7, -0.7]}
            H2: {at: [-0.7, 0.7]}
            H3: {at: [1.7, -0.7]}
            H4: {at: [1.7, 0.7]}
          bonds: [[C1, C2, 2], [C1, H1], [C1, H2], [C2, H3], [C2, H4]]
        label: "4 C–H, 1 C=C"
      - op: "+"
      - text: "3"
      - id: o2
        molecule:
          atoms:
            O1: {at: [0, 0], lone: [n, w]}
            O2: {at: [1, 0], lone: [n, e]}
          bonds: [[O1, O2, 2]]
        label: "3 O=O"
      - op: "->"
      - text: "2"
      - id: co2
        molecule:
          atoms:
            O1: {at: [0, 0], lone: [n, w]}
            C: {at: [1, 0]}
            O2: {at: [2, 0], lone: [n, e]}
          bonds: [[O1, C, 2], [C, O2, 2]]
        label: "2 · 2 C=O"
      - op: "+"
      - text: "2"
      - id: h2o
        molecule:
          atoms:
            O: {at: [0, 0], lone: [nw, ne]}
            H1: {at: [-0.8, 0.6]}
            H2: {at: [0.8, 0.6]}
          bonds: [[O, H1], [O, H2]]
        label: "2 · 2 O–H"
    ```

    | Types of bonds | Reactants (broken) | Products (formed) |
    |---|---|---|
    | Count | 4 C–H, 1 C=C, 3 O=O | 4 C=O, 4 O–H |

    **Reactants** (bond enthalpies given in class):

    $$\Sigma H^{\circ}_b\ \text{Reactants} = 4\,mol \cdot \frac{413\,kJ}{mol} + 1\,mol \cdot \frac{602\,kJ}{mol} + 3\,mol \cdot \frac{498\,kJ}{mol} = 3748\,kJ$$

    **Products:**

    $$\Sigma H^{\circ}_b\ \text{Products} = 4\,mol \cdot \frac{732\,kJ}{mol} + 4\,mol \cdot \frac{463\,kJ}{mol} = 4780\,kJ$$

    **Reactants − Products:**

    $$\Delta H^{\circ}_{b} = (3748 - 4780)\,kJ$$

    $$\Delta H^{\circ}_{b} = -1032\ kJ/mol$$

    $\Delta H$ is negative, so the combustion is
    [exothermic](thermochemistry-basics.md#endothermic-vs-exothermic): the products' bonds release
    more energy than it took to break the reactants' bonds.
