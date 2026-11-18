---
title: Spontaneity and Entropy
unit: 5
description: Spontaneous vs. non-spontaneous processes, entropy (S) as molecular disorder, the second law (ΔSsys + ΔSsurr > 0), the third law (S = 0 for a perfect crystal at 0 K), and what makes entropy bigger.
sources:
  - {nb: "class-notes", pages: "105, 107-109, 114-115"}
dates: ["11/16/26", "11/17/26"]
tags: [entropy, spontaneous, non-spontaneous, second law, third law, ΔS, Boltzmann, disorder, molar entropy]
---

## Vocabulary: spontaneous / non-spontaneous

Some processes happen on their own; their reverse needs a push from outside.

**Spontaneous process**
:   A process that occurs without the surroundings doing work on the system. The natural direction
    of a process is the direction in which it occurs "spontaneously", or "by itself", without any
    kind of external help.

**Non-spontaneous process**
:   The reverse of a spontaneous process: if a process occurs spontaneously from state A to state
    B, then the reverse process (from state B to state A) is non-spontaneous. It only happens with
    external help, such as energy from an outside source.

| | Reaction |
|---|---|
| **Spontaneous** | $\ce{C6H12O6(s) + 6O2(g) ->[{natural}][{process in a human body}] 6CO2(g) + 6H2O(l)}$ (glucose) |
| **Non-spontaneous** | $\ce{6CO2 + 6H2O ->[{sunlight}][{ext. source}] C6H12O6 + 6O2}$ (photosynthesis, the opposite RXN) |

The oxidation of glucose is a combustion reaction that occurs in our bodies: glucose oxidizes
spontaneously, providing the energy necessary to sustain life. The reverse reaction,
photosynthesis, occurs in plants only when sufficient energy is provided by the sun. Hence, the
reverse reaction is non-spontaneous.

A skier on a snow-covered slope is the same idea: sliding downhill happens on its own
(spontaneous), but getting back up the mountain takes a ski lift (non-spontaneous).

## Spontaneous reactions can be exo- or endothermic

A reaction doesn't have to release heat to be spontaneous. All three of these happen on their own,
yet none of them is exothermic:

| Process | $\Delta H^{\circ}$ | Spontaneous? |
|---|---|---|
| i) Dissolving a water-soluble salt: $\ce{NaCl(s) ->[H2O] Na+(aq) + Cl-(aq)}$ | $+3.9\ kJ$ (endothermic) | yes |
| ii) Decomposing $\ce{PCl5}$ in the gas phase: $\ce{PCl5(g) -> PCl3(g) + Cl2(g)}$ | $+87.9\ kJ$ (endothermic) | yes, at high temperature |
| iii) Mixing two non-reacting gases at low pressure: $\ce{CH4}_{(g,\,pure)} + \ce{H2}_{(g,\,pure)} \longrightarrow \ce{CH4}_{(g,\,mixed)} + \ce{H2}_{(g,\,mixed)}$ | $0$ | yes |

In iii), mixing changes the molecular environment. However, intermolecular interactions are
negligible, since gases behave ideally at low pressure. Hence, molecules have the same energy in
the pure and mixed states ($\Delta E = 0$ and $\Delta H = 0$), yet mixing of gases is spontaneous.

!!! note "Take away"
    In all cases, the spontaneous direction of a process is the direction in which there is an
    **overall increase in the level of disorder**.

**Entropy** ($S$)
:   The thermodynamic property that measures the level of molecular disorder of a system.

## Second law of thermodynamics

**Second law of thermodynamics**
:   A process is spontaneous when it results in an overall increase in the entropy of the system
    plus the surroundings.

Mathematically, the second law is expressed as:

!!! formula "Second law"
    $$\Delta S_{sys} + \Delta S_{surr} > 0$$

    $\Delta S_{sys} + \Delta S_{surr} = \Delta S_{universe}$: $> 0$ spontaneous, $= 0$ at
    equilibrium, $< 0$ not spontaneous.

[Gibbs free energy](gibbs-free-energy.md#g-and-the-second-law) turns these same three cases into a
test with $\Delta G$.

The entropy change of the **system** is the entropy of the reaction, from the standard entropies
($S^{\circ}$) in a table:

!!! formula "Entropy of reaction (ΔS°rxn)"
    $$\Delta S_{sys} = \Delta S^{\circ}_{rxn} = \Sigma\, n\,S^{\circ}\,(\text{products}) - \Sigma\, m\,S^{\circ}\,(\text{reactants})$$

    $n$, $m$ = the coefficients in the balanced equation. Units: $J\cdot K^{-1}\cdot mol^{-1}$ for $S^{\circ}$.

The entropy change of the **surroundings** comes from the heat they gain or lose:

!!! formula memorize "Entropy of the surroundings — Remember this!!!"
    $$\Delta S_{surr} = \frac{q_{surr}}{T}$$

At constant pressure, the surroundings gain the heat the system loses:
$q_{surr} = -q_{sys} = -\Delta H^{\circ}_{rxn}$. So:

!!! formula "ΔSsurr from ΔH°rxn"
    $$\Delta S_{surr} = \frac{-\Delta H^{\circ}_{rxn}}{T} \qquad (T \text{ in K})$$

An exothermic reaction ($\Delta H < 0$) heats the surroundings, so their entropy goes up.

## Third law of thermodynamics

### Entropy and the Boltzmann formula

The **Boltzmann equation** states that:

!!! formula "Boltzmann equation"
    $$S = k \cdot \ln(W)$$

    - $S$ = entropy of the system
    - $k$ = the Boltzmann constant, the ratio of the gas constant to Avogadro's number: $k = \dfrac{R}{N_a}$
    - $\ln$ = the natural logarithm
    - $W$ = the number of ways in which the atoms, ions or molecules of a system can be arranged
      without changing the system's energy

### A perfect crystal at 0 K

For example, consider a crystal of $\ce{CCl4}$ at 0 K. The crystal is a three-dimensional periodic
array of $\ce{CCl4}$ molecules:

```lewis
items:
  - id: crystal
    molecule:
      atoms:
        A1: {el: CCl4, at: [0, 0]}
        A2: {el: CCl4, at: [2.4, 0]}
        A3: {el: CCl4, at: [2.4, 2.2]}
        A4: {el: CCl4, at: [0, 2.2]}
        B1: {el: CCl4, at: [1.1, -1]}
        B2: {el: CCl4, at: [3.5, -1]}
        B3: {el: CCl4, at: [3.5, 1.2]}
        B4: {el: CCl4, at: [1.1, 1.2]}
      bonds: [[A1, A2], [A2, A3], [A3, A4], [A4, A1], [B1, B2], [B2, B3], [B3, B4], [B4, B1],
              [A1, B1], [A2, B2], [A3, B3], [A4, B4]]
    label: "One way to arrange it: W = 1"
caption: A crystal of CCl4 at 0 K
```

At 0 K, a crystal is so perfectly ordered that there is only **one** way to arrange its components.
When any two $\ce{CCl4}$ molecules switch positions, the crystal is still the same, because
$\ce{CCl4}$ molecules are indistinguishable. Hence, $W = 1$ and $S = k \cdot \ln(1) = 0$:

**Third law of thermodynamics**
:   The entropy of a perfectly ordered crystalline solid is equal to 0 at 0 K.

!!! formula "Third law"
    $$S = 0 \quad\text{for a perfectly ordered crystal at } 0\ K$$

## What affects entropy

**In summary:**

| Crystal State | | Liquid State | | Gas State |
|:-:|:-:|:-:|:-:|:-:|
| Order in crystal | $>$ | Order in liquid | $\gg$ | Order in gas |
| Entropy of a solid | $<$ | Entropy of a liquid | $\ll$ | Entropy of a gas |

!!! formula "Entropy of the phases"
    $$S_{solid} < S_{liquid} \ll S_{gas}$$

The entropy of matter also varies with:

| Factor | Entropy is higher when… |
|---|---|
| 1. Amount of Matter | there is more of it (more moles) |
| 2. Temperature | the temperature is higher (larger $W$) |
| 3. Pressure (at constant temperature) | the pressure is lower (larger $W$) |
| 4. Structure of Matter | the atoms or molecules are bigger |

### 1. Amount of matter

**Molar entropy** ($S_m$)
:   The entropy of one mole of a substance.

If a substance contains $n$ moles, its entropy is:

!!! formula "Entropy from molar entropy"
    $$S = n\cdot S_m$$

### 2. Temperature

As a substance is heated, its particles (atoms, molecules or ions) exhibit a larger range of
energies, motions and positions. Hence, the particles of a substance can be arranged in a more
diverse fashion when the temperature is increased (larger $W$). As a result, **the entropy of a pure
substance always increases with increasing temperature.**

### 3. Pressure

As a substance is compressed at constant temperature, its volume decreases (Boyle's law for gases).
Hence, increasing the pressure leads to a decrease in the number of possible sites that the
particles of that substance may occupy. Thus, increasing the pressure leads to a decrease in the
number of possible arrangements for the particles of that substance (lower $W$).

Hence, **increasing pressure lowers the entropy at constant temperature.**

### 4. Structure of matter

The entropy of a substance increases with the size of its constituents.

**Down a group:** consider the group 2 metals $\ce{Be(s)}$, $\ce{Mg(s)}$, $\ce{Ca(s)}$, $\ce{Sr(s)}$,
$\ce{Ba(s)}$ at 25 °C and 1 atm. Their molar entropies are, respectively:

$$9.5 < 32.7 < 41.6 < 54.4 < 62.5\ (J\cdot K^{-1}\cdot mol^{-1})$$

Hence, in a group the molar entropy increases from top to bottom.

**Molecule size:** now consider the gases $\ce{CH4(g)}$, $\ce{C2H6(g)}$, $\ce{C3H8(g)}$,
$\ce{C4H10(g)}$, $\ce{C5H12(g)}$ at 25 °C and 1 atm. Their molar entropies are, respectively:

$$186.3 < 229.6 < 270.2 < 310.1 < 349.0\ (J\cdot K^{-1}\cdot mol^{-1})$$

The molar entropy of molecules increases with their size, because larger molecules have more
chemical bonds and can store energy in more ways than smaller molecules.
