---
title: Nitrogen Bases & Ammonia
unit: 2
description: Why nitrogen-containing bases (ammonia and the amines) grab H⁺ with their lone pair — ammonia vs. amine, ammonia hydrolysis, amine + strong acid, and acetate ion → acetic acid.
sources:
  - {nb: "1", pages: "20-22, 33"}
  - {nb: "class-notes", pages: "12-14"}
dates: ["9/8/26", "9/16/26"]
tags: [bases, ammonia, amines, lone pair, hydrolysis, Lewis structures, acetic acid]
---

## Chemistry of N-containing bases

Ammonia and the amines act as bases because of one feature of nitrogen: its **lone pair**.

<div class="cols sidebar" markdown>
<div markdown>
**Nitrogen**

- Nitrogen is in **Group 5A**, so it has 5 valence electrons.
- Three electrons are unpaired and two are in a **lone pair**.

</div>
<div markdown>

```lewis
items:
  - molecule:
      atoms:
        N: {at: [0, 0], lone: [n], dots: [w, e, s]}
    label: "lone pair on top,\n3 unpaired e⁻"
```

</div>
</div>

The three unpaired electrons make the three bonds (to H or to carbon groups). Those bonds are
**not reacting**; the lone pair is the part that **reacts**.

!!! teacher "Ms. Boppana"
    "Freaking lone pair!" The lone pair on nitrogen is what reacts, every time.

```lewis
items:
  - molecule:
      atoms:
        N: {at: [0, 0], lone: [n], circle: [n]}
        H1: {at: [-1, 0]}
        H2: {at: [1, 0]}
        H3: {at: [0, 1]}
      bonds: [[N, H1], [N, H2], [N, H3]]
    label: "ammonia, NH3"
  - {text: "vs"}
  - molecule:
      atoms:
        N: {at: [0, 0], lone: [n], circle: [n]}
        Q1: {el: "?", at: [-1, 0]}
        Q2: {el: "?", at: [1, 0]}
        Q3: {el: "?", at: [0, 1]}
      bonds: [[N, Q1], [N, Q2], [N, Q3]]
    label: "amine\n(? = H or a carbon group)"
caption: "The circled lone pair is reacting; the bonds to H (or ?) are not reacting."
```

## Amines

**Amines** are made from ammonia by replacing H atoms with methyl groups ($\ce{CH3}$). Nitrogen
still makes three bonds, and its lone pair is untouched.

The names are easy to mix up, so count the m's:

<div class="mnemonic" markdown>

| Key | Name | What it is |
|---|---|---|
| a**mm**onia / a**mm**ine | ammonia (= ammine) | $\ce{NH3}$ itself |
| a**m**ine | amine | $\ce{NH3}$ with one or more H replaced by a carbon group |

</div>

Each "?" spot on nitrogen can be an H or a carbon group. The common carbon groups are:

| Group | Formula | Amine with one group |
|---|---|---|
| **methyl** | $\ce{CH3}$ | methylamine, $\ce{CH3NH2}$ |
| **ethyl** | $\ce{C2H5}$ | ethylamine, $\ce{C2H5NH2}$ |
| **propyl** | $\ce{C3H7}$ | propylamine, $\ce{C3H7NH2}$ |

The methyl amines (one, two or three $\ce{CH3}$ groups):

| Name | Formula | Made from $\ce{NH3}$ by |
|---|---|---|
| **ammine** (= ammonia) | $\ce{NH3}$ | (the starting molecule) |
| **methylamine** | $\ce{CH3NH2}$ | replacing 1 H with $\ce{CH3}$ |
| **dimethylamine** | $\ce{(CH3)2NH}$ | replacing 2 H with 2 ($\ce{CH3}$) |
| **trimethylamine** | $\ce{(CH3)3N}$ | replacing 3 H with 3 ($\ce{CH3}$) |

```lewis
items:
  - molecule:
      atoms:
        N: {at: [0, 0], lone: [n]}
        H1: {at: [-1, 0]}
        H2: {at: [1, 0]}
        H3: {at: [0, 1]}
      bonds: [[N, H1], [N, H2], [N, H3]]
    label: "ammine\n(= ammonia)"
  - molecule:
      atoms:
        N: {at: [0, 0], lone: [n]}
        Me: {el: CH3, at: [-1.4, 0]}
        H1: {at: [1, 0]}
        H2: {at: [0, 1]}
      bonds: [[N, Me], [N, H1], [N, H2]]
    label: "methylamine"
  - molecule:
      atoms:
        N: {at: [0, 0], lone: [n]}
        Me1: {el: CH3, at: [-1.4, 0]}
        H1: {at: [1, 0]}
        Me2: {el: CH3, at: [0, 1]}
      bonds: [[N, Me1], [N, H1], [N, Me2]]
    label: "dimethylamine"
  - molecule:
      atoms:
        N: {at: [0, 0], lone: [n]}
        Me1: {el: CH3, at: [-1.4, 0]}
        Me2: {el: CH3, at: [1.4, 0]}
        Me3: {el: CH3, at: [0, 1]}
      bonds: [[N, Me1], [N, Me2], [N, Me3]]
    label: "trimethylamine"
caption: Every amine keeps nitrogen's lone pair.
```

In ammonia, nitrogen bonds with 3 hydrogens and the lone pair is left untouched.

## Ammonia + water (hydrolysis)

In a **hydrolysis** reaction, a substance reacts with water (HOH).

!!! question "Ammonia in a hydrolysis reaction reacts with water. Give the balanced net ionic equation."
    Write the water as $\ce{H+}$ and $\ce{OH-}$:

    $$\ce{NH3} + \ce{H+}\,\ce{OH-}$$

### Why the H⁺ goes to the lone pair

!!! formula "Hydrogen ion"
    $$\text{Hydrogen ion} = \ce{H+} = \text{A proton}$$

- A hydrogen ion always wants 2 electrons in the 1s orbital.
- The lone pair on nitrogen is perfect for $\ce{H+}$.

```lewis
items:
  - id: nh3
    molecule:
      atoms:
        N: {at: [0, 0], lone: [n]}
        H1: {at: [-1, 0]}
        H2: {at: [1, 0]}
        H3: {at: [0, 1]}
      bonds: [[N, H1], [N, H2], [N, H3]]
  - op: "+"
  - id: hp
    molecule:
      atoms:
        H: {at: [0, 0], charge: "+"}
  - {text: "OH^-"}
  - op: "->"
  - molecule:
      bracket: true
      charge: "+"
      atoms:
        N: {at: [0, 0]}
        H1: {at: [-1, 0]}
        H2: {at: [1, 0]}
        H3: {at: [0, 1]}
        H4: {at: [0, -1]}
      bonds: [[N, H1], [N, H2], [N, H3], [N, H4]]
  - {text: "(OH)^-"}
arrows:
  - {from: nh3.N.lone.n, to: hp.H, bend: -45}
caption: The H⁺ latches onto nitrogen's lone pair, forming the ammonium ion.
```

### The equations

!!! formula "Ammonia hydrolysis (molecular eqn)"
    $$\ce{NH3 + HOH -> NH4OH}$$

    $\ce{NH4OH}$ is **ammonium hydroxide**. It is soluble (ammonium compounds always are), so in
    the net ionic eqn it is written as the ions $\ce{NH4+}$ and $\ce{OH-}$.

!!! formula "Ammonia hydrolysis (net ionic eqn)"
    $$\underbrace{\ce{NH3}}_{\text{Molecular}} + \underbrace{\ce{HOH}}_{\text{liquid}} \rightarrow \ce{NH4+ + OH-}$$

In the net ionic equation $\ce{NH3}$ stays together because it is molecular, and HOH stays
together because it is the liquid.

If it produces $\ce{OH-}$ it is basic. If it produces $\ce{H+}$ it is acidic. {.star}

There is more to come in [Acids & Bases](../04-acid-base/index.md).

## Amine + strong acid

An amine reacts with a strong acid the same way ammonia reacts with water: the $\ce{H+}$ latches
onto nitrogen's lone pair. With a strong acid there is a lot more $\ce{H+}$ to grab.

!!! example "Example: methylamine + hydrochloric acid"
    $$\ce{CH3NH2 + HCl ->}$$

    | Reactant | What it is | In the ionic equation |
    |---|---|---|
    | $\ce{CH3NH2}$ (methylamine) | Weak base, **not an ionic compound** | Stays together |
    | $\ce{HCl}$ (hydrochloric acid) | **Strong acid**, soluble | Splits into ions: $\ce{H+ + Cl-}$ |

    ```lewis
    items:
      - id: ma
        molecule:
          atoms:
            Me: {el: CH3, at: [-1.4, 0]}
            N: {at: [0, 0], lone: [n]}
            H1: {at: [1, 0]}
            H2: {at: [0, 1]}
          bonds: [[Me, N], [N, H1], [N, H2]]
        label: "methylamine"
      - op: "+"
      - id: hp
        molecule:
          atoms:
            H: {at: [0, 0], charge: "+"}
      - op: "+"
      - {text: "Cl^-"}
      - op: "->"
      - molecule:
          bracket: true
          charge: "+"
          atoms:
            Me: {el: CH3, at: [-1.4, 0]}
            N: {at: [0, 0]}
            H1: {at: [1, 0]}
            H2: {at: [0, 1]}
            H3: {at: [0, -1]}
          bonds: [[Me, N], [N, H1], [N, H2], [N, H3]]
        label: "methylammonium"
      - op: "+"
      - {text: "Cl^-", label: "spectator ion"}
    arrows:
      - {from: ma.N.lone.n, to: hp.H, bend: -45}
    caption: The H⁺ from HCl latches onto the lone pair on nitrogen.
    ```

    $\ce{Cl-}$ is a spectator ion, so cross it out:

    $$\ce{CH3NH2 + H+} + \cancel{\ce{Cl-}} \rightarrow \ce{(CH3NH3)+} + \cancel{\ce{Cl-}}$$

!!! formula "Methylamine + strong acid (net ionic eqn)"
    $$\boxed{\ce{CH3NH2 + H+ -> (CH3NH3)+}}$$

    The product is the **methylammonium** ion.

Every nitrogen base does the same thing: base + $\ce{H+}$ makes its "-ammonium" ion.

!!! formula "Nitrogen base + H⁺ → ammonium ion"
    | Base | + $\ce{H+}$ → | Ion name |
    |---|---|---|
    | $\ce{NH3}$ | $\ce{(NH4)+}$ | ammonium |
    | $\ce{CH3NH2}$ | $\ce{(CH3NH3)+}$ | methylammonium |
    | $\ce{(CH3)2NH}$ | $\ce{((CH3)2NH2)+}$ | dimethylammonium |
    | $\ce{(CH3)3N}$ | $\ce{((CH3)3NH)+}$ | trimethylammonium |

## Acetate ion & acetic acid

The same thing happens with the **acetate ion**, $\ce{(CH3COO)-}$: an $\ce{H+}$ from HOH
latches onto a lone pair on the single-bonded oxygen, making **acetic acid**.

```lewis
items:
  - id: ac
    molecule:
      bracket: true
      charge: "-"
      atoms:
        Me: {el: CH3, at: [-1.4, 0]}
        C: {at: [0, 0]}
        O1: {at: [1, 0], lone: [n, e, s]}
        O2: {at: [0, 1], lone: [w, s]}
      bonds: [[Me, C], [C, O1], [C, O2, 2]]
    label: "Acetate ion"
  - op: "+"
  - id: hp
    molecule:
      atoms:
        H: {at: [0, 0], charge: "+"}
  - {text: "(OH)^-"}
  - op: "->"
  - molecule:
      atoms:
        Me: {el: CH3, at: [-1.4, 0]}
        C: {at: [0, 0]}
        O1: {at: [1, 0], lone: [e, s]}
        H: {at: [1, -1]}
        O2: {at: [0, 1], lone: [w, s]}
      bonds: [[Me, C], [C, O1], [C, O2, 2], [O1, H]]
    label: "= Acetic Acid\n(because of the H+)"
  - op: "+"
  - {text: "(OH)^-"}
arrows:
  - {from: ac.O1.lone.n, to: hp.H, bend: -45}
```

Single bond & Double bond will repel. {.star}

!!! formula "Acetate ion + HOH → acetic acid"
    $$\ce{(CH3COO)- + HOH -> CH3COOH + (OH)-}$$

Whenever you have a hydrogen ion it wants to latch onto a lone pair. {.star}
