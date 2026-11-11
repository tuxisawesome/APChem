---
title: Amphoteric, Amphiprotic & Polyprotic Acids
unit: 4
description: Compounds that behave like both an acid and a base (amphoteric vs. amphiprotic), which H in an oxyacid is the acidic H⁺, what makes an oxyacid stronger (more O atoms, electronegativity, nearby Cl atoms), and monoprotic / diprotic / triprotic acids (with the overall K of H₃PO₄).
sources:
  - {nb: "1", pages: "59-61"}
dates: ["10/7/26", "10/8/26"]
tags: [amphoteric, amphiprotic, oxyacids, acid strength, electronegativity, polyprotic acids, sulfuric acid]
---

## Compounds that are both an acid and a base

When a compound behaves both like an acid and a base, it is said to be **amphoteric** or
**amphiprotic**. Which word to use depends on whether $\ce{H+}$ is involved:

<div class="tchart" markdown>
<div markdown>
**1. Amphoteric**

**No** $\ce{H+}$ is involved.

For example, $\ce{Al(OH)3}$ accepts a lone pair from $\ce{OH-}$ and becomes $\ce{Al(OH)4-}$:

```lewis
rows:
  - - {id: al, text: "Al(OH)3"}
    - op: "+"
    - id: oh
      molecule:
        atoms:
          OH: {el: OH, at: [0, 0], lone: [w], circle: [w], charge: "-"}
  - - op: "->"
    - text: "Al(OH)4-"
arrows:
  - {from: oh.OH.lone.w, to: al, bend: 45}
```
</div>
<div markdown>
**2. Amphiprotic**

$\ce{H+}$ **is** involved.

For example, $\ce{HSO4-}$ can either accept or donate an $\ce{H+}$:

$$\underbrace{\ce{HSO4-}}_{\substack{\ce{H+}\ \text{Acceptor}\\ \text{(base)}}} \ce{-> H2SO4}$$

$$\underbrace{\ce{HSO4-}}_{\substack{\ce{H+}\ \text{Donor}\\ \text{(acid)}}} \ce{-> SO4^2-}$$
</div>
</div>

## Which H in an oxyacid is the acidic H⁺ ion

Not every H in an oxyacid comes off as $\ce{H+}$. Acetic acid ($\ce{CH3COOH}$) shows which one
does:

<div class="cols ruled" markdown>
<div markdown>
**Acetic Acid** — $\ce{CH3COOH}$

```lewis
rows:
  - - molecule:
        atoms:
          C1: {at: [0, 0]}
          C2: {at: [1, 0]}
          H1: {at: [-1, 0]}
          H2: {at: [0, -1]}
          H3: {at: [0, 1]}
          O1: {at: [1, -1], lone: [w, e]}
          O2: {at: [2, 0], lone: [n, s]}
          H4: {at: [3, 0]}
        bonds: [[C1, H1], [C1, H2], [C1, H3], [C1, C2], [C2, O1, 2], [C2, O2], [O2, H4]]
  - - op: "<=>"
  - - molecule:
        atoms:
          C1: {at: [0, 0]}
          C2: {at: [1, 0]}
          H1: {at: [-1, 0]}
          H2: {at: [0, -1]}
          H3: {at: [0, 1]}
          O1: {at: [1, -1], lone: [w, e]}
          O2: {at: [2, 0], lone: [n, s, e], charge: "-"}
        bonds: [[C1, H1], [C1, H2], [C1, H3], [C1, C2], [C2, O1, 2], [C2, O2]]
    - op: "+"
    - text: "H+"
```
</div>
<div markdown>
The **hydrogen attached to the oxygen** in an oxyacid is the "acidic" $\ce{H+}$ ion.

!!! formula "Acetic acid ionization (acidic H on O)"
    $$\ce{CH3COOH <=> CH3COO- + H+}$$
</div>
</div>

## Strength of oxyacids

!!! objective "Students will be able to"
    Determine the strength of oxyacids based on the number of oxygen atoms present in a molecule.

The acidic H of an oxyacid sits on an oxygen ($\ce{H-O-X}$). How easily that $\ce{H+}$ comes off
depends on how hard the rest of the molecule **pulls electrons away from the O–H bond**:

- The **more electron density is pulled away** from the O–H bond, the weaker that bond gets.
- The weaker the O–H bond, the more easily $\ce{H+}$ leaves.
- $\therefore$ larger $K_a$ = **stronger acid**.

In $\ce{H2SO4}$, the very electronegative O atoms pull electrons away from S and from both H atoms,
so both $\ce{H+}$ come off:

```lewis
items:
  - {id: hl, text: "H+"}
  - {op: "     "}
  - id: sa
    molecule:
      atoms:
        H1: {at: [-2, 0]}
        O1: {at: [-1, 0], lone: [n, s]}
        S: {at: [0, 0]}
        O2: {at: [1, 0], lone: [n, s]}
        H2: {at: [2, 0]}
        O3: {at: [0, -1], lone: [n, w, e]}
        O4: {at: [0, 1], lone: [s, w, e]}
      bonds: [[H1, O1, dative], [S, O1, dative], [S, O2, dative], [S, O3, dative], [S, O4, dative], [H2, O2, dative]]
    label: "H2SO4"
  - {op: "     "}
  - {id: hr, text: "H+"}
arrows:
  - {from: sa.H1, to: hl, bend: -50}
  - {from: sa.H2, to: hr, bend: 50}
caption: Arrows on the bonds point toward the atom pulling the electrons; both H⁺ on O come off.
```

Three things make an oxyacid pull harder on the O–H electrons: **more O atoms**, a **more
electronegative central atom**, and **electronegative atoms nearby** (like Cl).

### More oxygen atoms → stronger acid

When the central atom is the same, each extra O atom pulls more electron density away from the
O–H bond, so the acid gets stronger.

| Acid | Name | O atoms | $K_a$ | Strength |
|---|---|:-:|---|---|
| $\ce{HClO}$ | hypochlorous acid | 1 | $3.5\cdot10^{-8}$ | weak |
| $\ce{HClO2}$ | chlorous acid | 2 | $1.2\cdot10^{-2}$ | weak |
| $\ce{HClO3}$ | chloric acid | 3 | very large | **strong** |
| $\ce{HClO4}$ | perchloric acid | 4 | very large | **strong** (strongest) |

!!! formula "Oxyacid strength: number of O atoms"
    $$\ce{HClO4} > \ce{HClO3} > \ce{HClO2} > \ce{HClO}$$
    Same central atom: more O atoms → larger $K_a$ → stronger acid.

The same rule explains the strong acid list: $\ce{H2SO4}$ (4 O) is strong but $\ce{H2SO3}$ (3 O)
is weak, and $\ce{HNO3}$ (3 O) is strong but $\ce{HNO2}$ (2 O) is weak.

### More electronegative central atom → stronger acid

When the number of O atoms is the same ($\ce{H-O-X}$), compare the **electronegativity (EN)** of
X. A more electronegative X pulls the electrons from O, and O pulls them from H:

```lewis
items:
  - id: hocl
    molecule:
      atoms:
        H: {at: [0, 0]}
        O: {at: [1, 0], lone: [n, s]}
        Cl: {at: [2, 0], lone: [n, s, e]}
      bonds: [[H, O, dative], [O, Cl, dative]]
    label: "HOCl"
  - op: "<=>"
  - {text: "H+"}
  - op: "+"
  - {text: "OCl-"}
caption: Cl pulls electron density from O, and O pulls it from H, so H⁺ comes off.
```

| Acid | X | EN of X | $K_a$ | |
|---|:-:|:-:|---|---|
| $\ce{HOCl}$ | Cl | 3.0 | $3.5\cdot10^{-8}$ | strongest |
| $\ce{HOBr}$ | Br | 2.8 | $2.5\cdot10^{-9}$ | |
| $\ce{HOI}$ | I | 2.5 | $2.3\cdot10^{-11}$ | |
| $\ce{HOH}$ | H | 2.1 | barely ionizes | weakest |

Going down the table, EN is **decreasing**, so $K_a$ is **decreasing** — a weaker acid.

!!! formula "Oxyacid strength: electronegativity of X (H–O–X)"
    $$K_a:\quad \ce{HOCl} > \ce{HOBr} > \ce{HOI} > \ce{HOH}$$
    Higher EN of X → larger $K_a$ → stronger acid.

### Electronegative atoms nearby: chloro-substituted acetic acids

The same pull works through a carbon chain. In the $\ce{-COOH}$ group, the C=O oxygen pulls
electrons from C, which pulls them from the O–H oxygen, which pulls them from H. Swapping H atoms
on the $\ce{CH3}$ for very electronegative **Cl** atoms pulls even more electron density away from
the O–H bond:

```lewis
items:
  - id: a
    molecule:
      scale: 0.85
      atoms:
        C1: {at: [0, 0]}
        Ha: {el: H, at: [-1, 0]}
        Hb: {el: H, at: [0, -1]}
        Hc: {el: H, at: [0, 1]}
        C2: {at: [1, 0]}
        O1: {at: [1, -1], lone: [n, e]}
        O2: {at: [2, 0], lone: [n, s]}
        H: {at: [3, 0]}
      bonds: [[C1, Ha], [C1, Hb], [C1, Hc], [C1, C2], [C2, O1, 2], [O2, C2, dative], [H, O2, dative]]
    label: "a) CH3COOH"
  - op: "<"
  - id: b
    molecule:
      scale: 0.85
      atoms:
        C1: {at: [0, 0]}
        Ha: {el: H, at: [-1, 0]}
        Cl: {at: [0, -1], lone: [n, w, e]}
        Hc: {el: H, at: [0, 1]}
        C2: {at: [1, 0]}
        O1: {at: [1, -1], lone: [n, e]}
        O2: {at: [2, 0], lone: [n, s]}
        H: {at: [3, 0]}
      bonds: [[C1, Ha], [C1, Cl, dative], [C1, Hc], [C1, C2], [C2, O1, 2], [O2, C2, dative], [H, O2, dative]]
    label: "b) CH2ClCOOH"
  - op: "<"
  - id: c
    molecule:
      scale: 0.85
      atoms:
        C1: {at: [0, 0]}
        Ha: {el: H, at: [-1, 0]}
        Cl1: {el: Cl, at: [0, -1], lone: [n, w, e]}
        Cl2: {el: Cl, at: [0, 1], lone: [s, w, e]}
        C2: {at: [1, 0]}
        O1: {at: [1, -1], lone: [n, e]}
        O2: {at: [2, 0], lone: [n, s]}
        H: {at: [3, 0]}
      bonds: [[C1, Ha], [C1, Cl1, dative], [C1, Cl2, dative], [C1, C2], [C2, O1, 2], [O2, C2, dative], [H, O2, dative]]
    label: "c) CHCl2COOH"
caption: "Acid strength a < b < c: every Cl pulls more electron density away from the O–H bond."
```

| | Acid | Cl atoms | $K_a$ |
|---|---|:-:|---|
| a) | $\ce{CH3COOH}$ (acetic acid) | 0 | $1.8\cdot10^{-5}$ |
| b) | $\ce{CH2ClCOOH}$ (chloroacetic acid) | 1 | $1.4\cdot10^{-3}$ |
| c) | $\ce{CHCl2COOH}$ (dichloroacetic acid) | 2 | $5.1\cdot10^{-2}$ |
| | $\ce{CCl3COOH}$ (trichloroacetic acid) | 3 | $2.2\cdot10^{-1}$ |

!!! formula "Acid strength: chloro-substituted acetic acids"
    $$\ce{CCl3COOH} > \ce{CHCl2COOH} > \ce{CH2ClCOOH} > \ce{CH3COOH}$$
    More Cl atoms → more electron density pulled away from O–H → larger $K_a$ → stronger acid.

Anything that pulls electrons away from the O–H bond makes the $\ce{H+}$ come off more easily — a stronger acid. {.star}

## Monoprotic, diprotic & triprotic acids

Acids are named by how many protons ($\ce{H+}$) they give up, and they give them up one step
at a time.

**Monoprotic acid**
:   One proton, one step.

!!! formula "Monoprotic acid (one step)"
    $$\ce{HCl -> H+ + Cl-}$$

**Diprotic acid**
:   Two protons, two steps.

!!! formula "Diprotic acid steps (H₂SO₄)"
    1. $\ce{H2SO4 -> HSO4- + H+}$
    2. $\ce{HSO4- <=> SO4^2- + H+}$

In these steps, $\ce{H2SO4}$ is a **strong acid**, but $\ce{HSO4-}$ is a **weak acid**.

**Triprotic acid**
:   Three protons, three steps. Phosphoric acid, $\ce{H3PO4}$, is the classic example.

!!! formula "Triprotic acid steps (H₃PO₄)"
    1. $\ce{H3PO4 <=> H2PO4- + H+}$
    2. $\ce{H2PO4- <=> HPO4^2- + H+}$
    3. $\ce{HPO4^2- <=> PO4^3- + H+}$

$\ce{H3PO4}$ is a **weak acid**, so every step always uses the double arrow ($\rightleftharpoons$). {.star}

### Adding the steps (Hess's law application)

Adding the three ionization steps gives the overall reaction. Just like
[adding reactions](../03-equilibrium/manipulating-k.md) in equilibrium, the $K$ values
**multiply**.

| Step | Reaction | $K$ |
|---|---|---|
| 1 | $\ce{H3PO4 <=> H2PO4- + H+}$ | $K_1$ |
| 2 | $\ce{H2PO4- <=> HPO4^2- + H+}$ | $K_2$ |
| 3 | $\ce{HPO4^2- <=> PO4^3- + H+}$ | $K_3$ |
| **Sum** | $\ce{H3PO4 <=> PO4^3- + 3H+}$ | $K = K_1 K_2 K_3$ |

!!! formula "Overall K of a polyprotic acid"
    $$K = K_1 \cdot K_2 \cdot K_3$$
    The intermediates ($\ce{H2PO4-}$, $\ce{HPO4^2-}$) cancel when the steps are added.
