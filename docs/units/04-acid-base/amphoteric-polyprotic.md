---
title: Amphoteric, Amphiprotic & Polyprotic Acids
unit: 4
description: Compounds that behave like both an acid and a base (amphoteric vs. amphiprotic), which H in an oxyacid is the acidic H⁺, and monoprotic / diprotic / triprotic acids.
sources:
  - {nb: "10-2", pages: "27-28"}
dates: ["10/7/26"]
tags: [amphoteric, amphiprotic, oxyacids, polyprotic acids, sulfuric acid]
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
:   Works the same way, with three protons and three steps.
