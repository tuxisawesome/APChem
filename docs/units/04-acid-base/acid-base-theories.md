---
title: Acid–Base Theories
unit: 4
description: The three acid–base theories — 1. Arrhenius, 2. Lowry–Brønsted (with conjugate acid–base pairs) and 3. Lewis (electron pairs).
sources:
  - {nb: "10-2", pages: "22-26"}
dates: ["10/7/26"]
tags: [acids, bases, Arrhenius, Lowry–Brønsted, conjugate pairs, Lewis]
---

There are three acid–base theories. Each one defines an acid and a base in a different way:

| # | Theory | Acid | Base |
|---|---|---|---|
| 1 | **Arrhenius** | increases $[\ce{H+}]$ in aqueous solution | increases $[\ce{OH-}]$ in aqueous solution |
| 2 | **Lowry–Brønsted** | $\ce{H+}$ (proton) donor = **LB acid** | $\ce{H+}$ (proton) acceptor = **LB base** |
| 3 | **Lewis** | e⁻ pair acceptor = **Lewis acid** | e⁻ pair donor = **Lewis base** |

## 1. Arrhenius acid/base theory

The Arrhenius theory looks at $[\ce{H+}]$ and $[\ce{OH-}]$ in **aqueous solutions**.

**Arrhenius acid**
:   A compound that increases $[\ce{H+}]$ in aqueous solution.

**Arrhenius base**
:   A compound that increases $[\ce{OH-}]$ in aqueous solution.

!!! example "Example: an Arrhenius acid and an Arrhenius base"
    **Acid** — $\ce{HCl}$ adds $\ce{H+}$ to the water, which shows up as hydronium:

    $$\ce{HCl + H2O -> Cl- +}\ \underbrace{\ce{H3O+}}_{\text{Hydronium}}$$

    **Base** — $\ce{NaOH}$ adds $\ce{OH-}$ to the water:

    $$\ce{NaOH + H2O -> Na+ + OH- + H2O}$$

## 2. Lowry–Brønsted acid/base theory

The Lowry–Brønsted (LB) *conjugate* acid/base theory is about passing an $\ce{H+}$ (a proton)
from one compound to another.

**LB acid**
:   An $\ce{H+}$ (proton) **donor**.

**LB base**
:   An $\ce{H+}$ (proton) **acceptor**.

!!! example "Example: HCl gives its proton to NH₃"
    $$\ce{HCl + NH3 -> NH4Cl}$$

    Showing only the $\ce{H+}$ that moves:

    $$\ce{H+ + NH3 -> NH4+}$$

    - $\ce{HCl}$ donated a proton, therefore it is a **LB acid**.
    - $\ce{NH3}$ received a proton, therefore it is a **LB base**.

### How to recognise conjugate acid–base pairs

In an LB reaction, the **main acid/base** on the left turn into their **conjugate acid/base**
on the right:

!!! formula "LB reaction: main acid/base → conjugate acid/base"
    $$\underbrace{\ce{HCl + NaOH}}_{\text{Main acid/base}} \;\ce{->}\; \underbrace{\ce{HOH + NaCl}}_{\text{conjugate acid/base}}$$

To find the pairs:

Check molecules with equal "–" ion {.star}

Each main species is paired with the conjugate that has the same "–" ion. Together they are the
**acid-base conjugates**:

$$
\underbrace{
\begin{array}{ccc}
\underline{\text{main}} & & \underline{\text{conjugate}} \\[2pt]
\ce{HCl} & \ce{->} & \ce{Cl-} \\
\text{LB Acid} & & \ce{H+}\ \text{Acceptor} \\
\ce{H+}\ \text{Donor} & & \text{conj. base}
\end{array}
}_{\text{Acid-base conjugates}}
\qquad \text{(Equal ``–'' ion ``}\ce{Cl-}\text{'')}
$$

$$
\underbrace{
\begin{array}{ccc}
\underline{\text{main}} & & \underline{\text{conjugate}} \\[2pt]
\ce{NaOH}\ (\ce{OH-}) & \ce{->} & \ce{HOH} \\
\ce{H+}\ \text{acceptor} & & \text{conjugate} \\
\text{LB base} & & \text{acid}
\end{array}
}_{\text{Acid-base conjugates}}
\qquad \text{(Equal ``–'' ion ``}\ce{OH-}\text{'')}
$$

The main acid always becomes the conjugate **base**, and the main base becomes the conjugate
**acid**:

!!! formula "Main acid → conjugate base, main base → conjugate acid"
    $$
    \begin{aligned}
    \text{Main acid} &\longrightarrow \text{conjugate base} &&(\ce{HCl -> Cl-})\\
    \text{Main base} &\longrightarrow \text{conjugate acid} &&(\ce{OH- -> HOH})
    \end{aligned}
    $$

Important: if the main acid is **strong**, its conjugate base is **weaker**; if the main base is **strong**, its conjugate acid is **weaker**. {.star}

## 3. Lewis acid/base theory

The "Lewis" theory is about **electron (e⁻) pairs** instead of $\ce{H+}$.

**Lewis acid**
:   An e⁻ pair **acceptor**. The e⁻ pair acceptors are $\ce{H+}$ and the Gp. IIIA (B, Al)
    **e⁻ deficient compounds**, such as $\ce{BH3}$, $\ce{BF3}$ and $\ce{AlCl3}$.

**Lewis base**
:   An e⁻ pair **donor**. A Lewis base must have a **lone pair of electrons**, like the Group VA
    compound $\ce{NH3}$.

### NH₃ + BH₃

Nitrogen (Gp VA) shares its lone pair with boron in a **coordinate** bond (both shared e⁻ come
from N). Boron (Gp IIIA) only makes 3 single bonds.

<div class="cols sidebar" markdown>
<div markdown>

```lewis
items:
  - id: nh3
    molecule:
      atoms:
        N: {at: [0, 0], lone: [e]}
        H1: {at: [-0.75, -0.7]}
        H2: {at: [-1, 0]}
        H3: {at: [-0.75, 0.7]}
      bonds: [[N, H1], [N, H2], [N, H3]]
    brace: "Donates\ne⁻ pair: Base"
  - op: "+"
  - id: bh3
    molecule:
      atoms:
        B: {at: [0, 0]}
        Ha: {el: H, at: [0, -1]}
        Hb: {el: H, at: [1, 0]}
        Hc: {el: H, at: [0, 1]}
      bonds: [[B, Ha], [B, Hb], [B, Hc]]
    brace: "Accepts\ne⁻ pair: Acid"
arrows:
  - {from: nh3.N.lone.e, to: bh3.B, label: Docks, bend: -40}
```

</div>
<div markdown>
Boron has only **6 (not 8) valence electrons**. This is why it is **electron deficient**.
</div>
</div>

### Al(OH)₃ + OH⁻

By Arrhenius, both $\ce{Al(OH)3}$ and $\ce{NaOH}$ are bases. By Lewis, though, $\ce{Al(OH)3}$
accepts the lone pair from the $\ce{OH-}$ of $\ce{NaOH}$:

```lewis
rows:
  - - id: al
      molecule:
        atoms:
          Al: {at: [0, 0]}
          O1: {el: OH, at: [0, -1]}
          O2: {el: OH, at: [-1.3, 0]}
          O3: {el: OH, at: [0, 1]}
        bonds: [[Al, O1], [Al, O2], [Al, O3]]
      brace: "only 6 e⁻:\nelectron deficient"
    - {op: "      +      "}
    - id: oh
      molecule:
        bracket: true
        charge: "-"
        atoms:
          O: {at: [0, 0], lone: [w, n, s], circle: [w]}
          H: {at: [1, 0]}
        bonds: [[O, H]]
      brace: "Shares the\nlone pair"
  - - id: prod
      molecule:
        bracket: true
        charge: "-"
        atoms:
          Al: {at: [0, 0]}
          O1: {el: OH, at: [0, -1]}
          O2: {el: OH, at: [-1.3, 0]}
          O3: {el: OH, at: [0, 1]}
          O4: {el: OH, at: [1.8, 0]}
        bonds: [[Al, O1], [Al, O2], [Al, O3], [Al, O4]]
    - op: "="
    - text: "Al(OH)4-"
  - - {id: la, text: "e⁻ pair acceptor = Lewis Acid", size: 14}
    - {op: "  "}
    - {id: lb, text: "e⁻ pair donor = Lewis Base", size: 14}
arrows:
  - {from: oh.O.lone.w, to: al.Al, label: sharing, bend: 75}
  - {from: la, to: prod.Al, bend: -10}
  - {from: lb, to: prod.O4, bend: -20}
```

- $\ce{Al(OH)3}$ has only 6 e⁻ around Al, so it is electron deficient. It is the
  **e⁻ pair acceptor = Lewis acid**.
- $\ce{OH-}$ shares the lone pair. It is the **e⁻ pair donor = Lewis base**.

!!! teacher "Ms. Boppana"
    "The FREAKING lone pair!"

!!! formula "Lewis acid–base example: Al(OH)₃ + OH⁻"
    $$\underbrace{\ce{Al(OH)3}}_{\text{Lewis Acid}} + \underbrace{\ce{OH-}}_{\text{Lewis Base}} \;\ce{->}\; \ce{[Al(OH)4]-}$$
