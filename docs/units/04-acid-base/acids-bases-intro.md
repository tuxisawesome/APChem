---
title: Acids and Bases
unit: 4
description: Review of acids and bases from Honors Chemistry — the hydronium ion vs. the hydrogen ion, and the strong acids and bases to memorize.
sources:
  - {nb: "10-2", pages: "21"}
dates: ["10/7/26"]
tags: [acids, bases, hydronium, hydrogen ion]
---

!!! objective "Students will be able to"
    Review the basics of Acids and Bases from Honors Chemistry.

!!! objective "Language Objectives"
    - Acid-base theories
    - Conjugate pairs
    - Strength of an acid or a base
    - Hydronium vs. Hydrogen ion
    - Water

## Hydronium ion vs. hydrogen ion

When a **hydrogen ion** ($\ce{H+}$) meets water, it bonds to one of the lone pairs on the
oxygen of $\ce{H2O}$ and becomes the **hydronium ion** ($\ce{H3O+}$):

```lewis
items:
  - {text: "H+", label: "Hydrogen\nion"}
  - op: "+"
  - molecule:
      atoms:
        O: {at: [0, 0], lone: [n, w]}
        H1: {at: [-0.8, 0.6]}
        H2: {at: [0.8, 0.6]}
      bonds: [[O, H1], [O, H2]]
    label: "(H2O)"
  - op: "=>"
  - molecule:
      bracket: true
      charge: "+"
      atoms:
        O: {at: [0, 0], lone: [n]}
        H1: {at: [-1, 0]}
        H2: {at: [-0.6, 0.8]}
        H3: {at: [0.6, 0.8]}
      bonds: [[O, H1], [O, H2], [O, H3]]
    label: "(H3O+)"
```

Because **1 mol $\ce{H+}$ can generate 1 mol $\ce{H3O+}$**, the two always come in equal amounts.

Their concentrations are the same! {.star}

!!! formula "Hydronium = hydrogen ion concentration"
    $$[\ce{H+}] = [\ce{H3O+}]$$

## Strong acids & bases (memorize)

These are the strong acids and bases to know by heart:

--8<-- "strong-acids-bases.md"
