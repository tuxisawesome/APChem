---
title: Salts & Buffers
unit: 4
description: What a salt is, whether a salt solution is acidic, basic or neutral, what a buffer is and how it resists added acid or base, the Henderson–Hasselbalch equation, and buffer pH problems (solved two ways).
sources:
  - {nb: "1", pages: "71-77"}
  - {nb: "class-notes", pages: "56-57, 59-74, 76-88, 94-96"}
dates: ["10/15/26", "10/19/26"]
tags: [buffers, salts, salt hydrolysis, Henderson-Hasselbalch, common ion, pKa, RICE]
---

!!! objective "Students will be able to"
    - Define buffer solutions and calculate the pH of the buffer solution resulting from a reaction.
    - Determine if the salt solution resulting from an acid–base reaction is acidic, basic or
      neutral.

!!! objective "Language objectives"
    - Buffer
    - pH, pOH
    - Write equation
    - Strong acids/bases and weak acids/bases, and ionization/reaction

## What is a salt?

When an acid and a base react, the **cation comes from the base** and the **anion comes from the
acid**. Together they make the salt.

```lewis
items:
  - {id: hcl, text: "HCl", label: SA}
  - op: "+"
  - {id: naoh, text: "NaOH", label: SB}
  - op: "->"
  - {id: nacl, text: "NaCl"}
  - op: "+"
  - {text: "H2O"}
arrows:
  - {from: naoh.top, to: nacl.top, label: "cation from base", bend: -34}
  - {from: hcl.bottom, to: nacl.bottom, label: "anion from acid", bend: 44}
caption: The salt's cation comes from the base and its anion from the acid
```

!!! formula "Salt"
    $$\text{Cation from base} + \text{Anion from acid} \;\Longrightarrow\; \text{Salt}$$

$\ce{NH3}$ has a lone pair, which is why it can pick up an $\ce{H+}$ and act as a base. {.star}

!!! teacher "Ms. Boppana"
    "The FREAKING lone pair!" — about $\ce{NH3}$

## Is the salt solution acidic, basic or neutral?

After the acid and base react, the salt is left dissolved in water. Each of its ions can react
with water (HOH) — a **hydrolysis** — and that decides the pH of the salt solution.

Only an ion that came from a **weak** acid or base reacts with HOH. An ion from a **strong** acid
or base doesn't — the SA or SB it would make just ionizes 100% again, so cross it out. {.star}

If the reacting ion makes $\ce{OH-}$, the solution is basic; if it makes $\ce{H+}$, it is acidic.

| Reaction | Example | Salt | Ion that reacts with HOH | Makes | Salt solution |
|---|---|---|---|---|---|
| **SA + SB** | $\ce{HCl + NaOH}$ | $\ce{NaCl}$ | none | — | **Neutral**, pH = 7 |
| **WA + SB** | $\ce{HF + NaOH}$ | $\ce{NaF}$ | $\ce{F-}$ (from the WA) | $\ce{OH-}$ | **Basic**, pH > 7 |
| **SA + WB** | $\ce{HCl + NH3}$ | $\ce{NH4Cl}$ | $\ce{NH4+}$ (from the WB) | $\ce{H+}$ | **Acidic**, pH < 7 |
| **WA + WB** | $\ce{HF + NH3}$ | $\ce{NH4F}$ | both | $\ce{H+}$ and $\ce{OH-}$ | Compare $K_a$ and $K_b$ |

```phscale
markers:
  - {pH: 4.5, label: "NH4Cl (SA + WB)"}
  - {pH: 9.5, label: "NaF (WA + SB)"}
caption: NaCl (SA + SB) sits right at 7; NH₄Cl is acidic and NaF is basic. The side of 7 is what matters, not the exact number.
```

!!! formula "Salt hydrolysis (ion + HOH)"
    $$\text{Anion from a WA:}\quad \ce{A- + HOH <=> HA + OH-} \quad (\text{basic})$$
    $$\text{Cation from a WB:}\quad \ce{NH4+ + HOH <=> NH4OH + H+} \quad (\text{acidic})$$

### The four cases

Each case is written the same way: the acid–base reaction, then each ion of the salt with HOH.

!!! example "Example: SA + SB — HCl + NaOH"
    $$\overset{\text{SA}}{\ce{HCl}} + \overset{\text{SB}}{\ce{NaOH}} \ce{->[stoic step]} \ce{H2O + NaCl}$$

    $$\ce{Na+ + HOH ->} \cancel{\ce{NaOH + H+}} \qquad \ce{Cl- + HOH ->} \cancel{\ce{HCl + OH-}}$$

    $\ce{NaOH}$ is a SB and $\ce{HCl}$ is a SA, so neither ion reacts with water. Only
    $\ce{HOH + Na+ + Cl-}$ is left.

    $\therefore$ **Neutral**, pH = 7.

!!! example "Example: WA + SB — HF + NaOH"
    $$\overset{\text{WA}}{\ce{HF}} + \overset{\text{SB}}{\ce{NaOH}} \ce{->[stoic step]} \ce{NaF + HOH}$$

    ```lewis
    rows:
      - - {text: "HF", label: WA}
        - op: "+"
        - {text: "NaOH", label: SB}
        - op: "->"
        - {id: na, text: "Na+"}
        - {id: f, text: "F-"}
        - op: "+"
        - {text: "HOH"}
      - - {id: naoh2, text: "NaOH", label: "✗ SB"}
        - {text: "      "}
        - {id: prod, text: "HF + OH-", label: "✓ basic"}
    arrows:
      - {from: na.bottom, to: naoh2.top, label: HOH, bend: 30}
      - {from: f.bottom, to: prod.top, label: HOH, bend: -30}
    caption: Only the ion from the weak acid (F⁻) reacts with water
    ```

    $$\ce{Na+ + HOH ->} \cancel{\ce{NaOH + H+}} \qquad \ce{F- + HOH <=>} \overset{\text{WA}}{\ce{HF}} + \ce{OH-}\;\checkmark$$

    The increase in $[\ce{OH-}]$ makes pH > 7. $\therefore$ **Basic.**

    Any SB works the same way — for example, $\ce{LiOH + HF -> LiF + HOH}$: $\ce{Li+}$ does
    nothing, $\ce{F-}$ makes $\ce{OH-}$, so the $\ce{LiF}$ solution is basic.

!!! example "Example: SA + WB — HCl + NH₃"
    $$\overset{\text{SA}}{\ce{HCl}} + \overset{\text{WB}}{\ce{NH3}} \ce{->[stoic step]} \ce{NH4+ Cl-}$$

    $$\ce{NH4+ + HOH <=>} \overset{\text{WB}}{\ce{NH4OH}} + \ce{H+}\;\checkmark \qquad \ce{Cl- + HOH ->} \cancel{\ce{HCl + OH-}}$$

    $\ce{NH4OH}$ is just $\ce{NH3}$ in water ($\ce{NH3 + HOH}$), a weak base, so this reaction
    really happens. $\ce{HCl}$ is a SA, so $\ce{Cl-}$ does nothing.

    The $\ce{H+}$ makes pH < 7. $\therefore$ The salt solution is **acidic.**

!!! example "Example: WA + WB — HF + NH₃"
    Both are weak, so even the acid–base reaction is a double arrow:

    $$\overset{\text{WA}}{\ce{HF}} + \overset{\text{WB}}{\ce{NH3}} \ce{<=>} \ce{NH4F}$$

    Both ions came from weak partners, so **both** react with HOH:

    $$\ce{NH4+ + HOH <=> NH4OH + H+}\;\checkmark \qquad \ce{F- + HOH <=> HF + OH-}\;\checkmark$$

    Whichever ion reacts more wins. Compare $K_a$ of the cation with $K_b$ of the anion (using
    $K_b(\ce{NH3}) = 1.8\cdot10^{-5}$ and $K_a(\ce{HF}) = 7.2\cdot10^{-4}$):

    $$K_a(\ce{NH4+}) = \frac{1\cdot10^{-14}}{1.8\cdot10^{-5}} = 5.56\cdot10^{-10} \qquad K_b(\ce{F-}) = \frac{1\cdot10^{-14}}{7.2\cdot10^{-4}} = 1.39\cdot10^{-11}$$

    | Comparison | Salt solution |
    |---|---|
    | $K_a$ (cation) $>$ $K_b$ (anion) | Acidic |
    | $K_a$ (cation) $<$ $K_b$ (anion) | Basic |
    | $K_a$ (cation) $=$ $K_b$ (anion) | Neutral |

    $\therefore$ $5.56\cdot10^{-10} > 1.39\cdot10^{-11}$, so the $\ce{NH4F}$ solution is
    **slightly acidic.**

The same idea sets the pH at the equivalence point of a titration — see
[Acid–Base Titrations](titrations.md).

## Buffers

A **buffer solution** is a solution whose pH doesn't change when small quantities of **strong**
acids or bases are added. It **maintains the pH of the solution at a constant value**.

For example, **blood is a buffer** — it stays constant at a pH of about 7.4 (its main buffer is
$\ce{H2CO3}$ / $\ce{HCO3-}$).

### How a buffer is made

A buffer always has a weak acid and its conjugate base (or a weak base and its conjugate acid)
that share a **common ion**.

The 2 compounds **must** have a common ion — no common ion, no buffer. {.star}

1. **Weak acid + conjugate weak base** (the salt of the weak acid). For example,
   $\ce{HF}$ + $\ce{NaF}$:

    ```lewis
    items:
      - {id: hf, text: "HF", label: WA}
      - op: "+"
      - {id: naf, text: "NaF", label: "salt of WA"}
    braces:
      - {from: hf, to: naf, text: "common ion: F-"}
    ```

2. **Weak base + conjugate weak acid** (the salt of the weak base). For example,
   $\ce{NH3}$ with $\ce{NH4+}$, made from $\ce{NH3 + HF -> NH4F}$ ($\ce{NH4F}$ = $\ce{NH4+ + F-}$).
   $\ce{NH4+}$ is just $\ce{NH3}$ with an $\ce{H+}$ on its lone pair, so the two share $\ce{NH3}$.
   Usually the $\ce{NH4+}$ comes from an ammonium salt such as $\ce{NH4Cl}$ or $\ce{NH4I}$.

More buffer pairs:

| Buffer | Weak part | Salt (conjugate) | Common ion |
|---|---|---|---|
| $\ce{HF + NaF}$ | WA $\ce{HF}$ | $\ce{NaF}$ | $\ce{F-}$ |
| $\ce{H2CO3 + NaHCO3}$ | WA $\ce{H2CO3}$ | $\ce{NaHCO3}$ | $\ce{HCO3-}$ |
| $\ce{CH3COOH + CH3COONa}$ | WA $\ce{CH3COOH}$ | $\ce{CH3COONa}$ | $\ce{CH3COO-}$ |
| $\ce{NH3 + NH4Cl}$ | WB $\ce{NH3}$ | $\ce{NH4Cl}$ | $\ce{NH4+}$ |

The two parts of a buffer **don't react with each other**: $\ce{HF + NaF}\ \nrightarrow$ (no
reaction). So when a buffer is just mixed, there is **no stoichiometry step** — the
concentrations go straight into Henderson–Hasselbalch (or a RICE table).

A buffer can also be **made by a reaction**: a weak acid plus a smaller amount of strong base. The
SB uses up part of the WA and turns it into the conjugate base, so what's left over is a WA + its
conjugate base — a buffer (see [Example: buffer from a reaction](#example-buffer-from-a-reaction)).

### How a buffer resists added acid or base

A buffer holds its pH because it has a part ready to react with each "intruder". Both are
stoichiometry steps — a strong acid or base reacts completely with a weak one.

!!! formula "Buffer vs. added strong acid / strong base"
    $$\text{Added SB:}\quad \overset{\text{WA}}{\ce{HA}} + \overset{\text{SB}}{\ce{OH-}} \ce{->[stoic step]} \ce{A- + HOH}$$
    $$\text{Added SA:}\quad \overset{\text{WB}}{\ce{A-}} + \overset{\text{SA}}{\ce{H+}} \ce{->[stoic step]} \ce{HA}$$

- **Added strong base** is used up by the **weak acid**: a little less HA, a little more A⁻.
- **Added strong acid** is used up by the **conjugate base**: a little less A⁻, a little more HA.
- The strong acid or base is traded for a weak one, and the ratio $\frac{[\text{B}]}{[\text{A}]}$
  only changes a little — so the pH barely moves. (Worked example:
  [Adding a strong base to a buffer](#adding-a-strong-base-to-a-buffer).)

### Henderson–Hasselbalch equation

The **Henderson–Hasselbalch equation** gives the pH of a buffer. It comes from the $K_a$
expression of the weak acid:

$$\text{weak acid:}\quad \ce{HA <=>[EQ step] H+ + A-} \qquad K_a = \frac{[\ce{H+}]_{eq}[\ce{A-}]_{eq}}{[\ce{HA}]_{eq}}$$

Solve for $[\ce{H+}]$:

$$[\ce{H+}] = \frac{K_a[\ce{HA}]}{[\ce{A-}]}$$

Take $-\log$ of both sides (the log of a product is a sum of logs):

$$\underbrace{-\log[\ce{H+}]}_{\text{pH}} = \underbrace{-\log K_a}_{\text{p}K_a} - \log\left(\frac{[\ce{HA}]}{[\ce{A-}]}\right)$$

$$\text{pH} = \text{p}K_a - \log\left(\frac{[\ce{HA}]}{[\ce{A-}]}\right)$$

Flipping the fraction flips the sign of the log, which gives the form to memorize:

!!! formula memorize "Henderson–Hasselbalch equation"
    $$\text{pH} = \text{p}K_a + \log\left(\frac{[\ce{A-}]}{[\ce{HA}]}\right) = \text{p}K_a + \log\left(\frac{[\text{Base}]}{[\text{Acid}]}\right)$$
    Base = the conjugate base, Acid = the weak acid — the two share a **common ion**.

!!! formula "Buffer with equal acid and base"
    If the ratio $\dfrac{[\text{B}]}{[\text{A}]} = 1$, then $\log\left(\dfrac{[\text{B}]}{[\text{A}]}\right) = \log(1) = 0$, so $\text{pH} = \text{p}K_a$.

For a **weak-base buffer** (like $\ce{NH3 + NH4Cl}$) use the same equation: Base = $\ce{NH3}$,
Acid = $\ce{NH4+}$, and $\text{p}K_a$ is the $\text{p}K_a$ of the conjugate acid $\ce{NH4+}$. If
the problem gives $K_b$, convert it first with $K_a\cdot K_b = 1\cdot10^{-14}$ (or
$\text{p}K_a = 14 - \text{p}K_b$) — see [pH, Kw, Ka & Kb](ph-ka-kb.md#strength-from-ka-and-kb).

## Example: buffer from a reaction

!!! example "Problem"
    $0.5\,\text{M}$, 1 L $\ce{CH3COOH}$ reacts with $0.1\,\text{M}$, 1 L $\ce{NaOH}$ solution. What
    is the pH of the solution if $K_a = 1.8\cdot10^{-5}$?

!!! teacher "Ms. Boppana"
    "You can use Henderson–Hasselbalch OR a RICE table. Your choice."

### Method 1: Henderson–Hasselbalch

**1. Net ionic equation.** The weak acid reacts with the strong base (stoichiometry step):

$$\overset{\text{WA}}{\ce{CH3COOH}} + \overset{\text{SB}}{\ce{OH-}} \ce{->} \ce{CH3COO- + HOH}$$

| | $\ce{CH3COOH}$ (ER) | $\ce{OH-}$ (LR) | $\ce{CH3COO-}$ | $\ce{HOH}$ |
|---|:-:|:-:|:-:|:-:|
| **mol** | 0.5 mol $>$ | 0.1 mol | 0.1 mol | 0.1 mol |
| **left over** | 0.4 mol | 0 | 0.1 mol | |

**2. Finish statement** — conclusion of the stoichiometry step (total volume = 2 L):

$$[\ce{CH3COOH}] = \frac{0.4\ \text{mol}}{2\ \text{L}} = 0.2\,\text{M} \qquad [\ce{CH3COO-}] = \frac{0.1\ \text{mol}}{2\ \text{L}} = 0.05\,\text{M} \qquad K_a = 1.8\cdot10^{-5}$$

**3. ID.** $\ce{CH3COOH}$ and $\ce{CH3COO-}$ share the common acetate group — it's a **buffer!**

**4. Henderson equation.**

$$\text{pH} = -\log(1.8\cdot10^{-5}) + \log\left(\frac{0.05\,\text{M}}{0.2\,\text{M}}\right)$$

$$\text{pH} = \boxed{4.14}$$

### Method 2: RICE table

Start at step 3 (after the stoichiometry step).

**3. ID.** $K_a$ was given, so start with the **acid**.

**4. RICE.**

```rice
style: compact
R: "CH3COOH <=> CH3COO- + H+"
I: [0.2M, 0.05M, "0"]
C: [-x, +x, +x]
E: ["$0.2 - x$", "$0.05 + x$", "$x$"]
```

$x$ is tiny next to 0.05 M and 0.2 M, so cross it out there:

$$K_a = 1.8\cdot10^{-5} = \frac{(0.05 + \cancel{x})\,x}{0.2 - \cancel{x}} \qquad x = \frac{1.8\cdot10^{-5}\cdot0.2\,\text{M}}{0.05} = 7.2\cdot10^{-5}\,\text{M} = [\ce{H+}]$$

$$\text{pH} = -\log(x) = -\log(7.2\cdot10^{-5}\,\text{M})$$

$$\text{pH} = \boxed{4.14}$$

Both methods give the same answer. {.star}

## More buffer examples

When a buffer is made by just mixing a weak acid (or base) with its salt, nothing reacts — skip the
stoichiometry step and use the concentrations directly.

!!! example "Example: HF + NaF buffer (solved two ways)"
    1 L of solution is 2.0 M $\ce{HF}$ and 1.5 M $\ce{NaF}$. What is the pH of the solution?
    ($K_a$ of $\ce{HF}$ $= 7.2\cdot10^{-4}$)

    **1. Equation.** $\overset{\text{WA}}{\ce{HF}} + \ce{NaF}\ \nrightarrow$ — no reaction.
    $\ce{NaF}$ is just $\cancel{\ce{Na+}}$ (spectator) $+\ \ce{F-}$.

    **2. ID.** $\ce{HF}$ and $\ce{F-}$ share the common ion $\ce{F-}$ — a **buffer!**

    $$\overset{\text{A}}{[\ce{HF}]} = 2.0\,\text{M} = \frac{2.0\ \text{mol}}{1\ \text{L}} \qquad \overset{\text{B}}{[\ce{F-}]} = 1.5\,\text{M} = \frac{1.5\ \text{mol}}{1\ \text{L}}$$

    **Method 1: Henderson–Hasselbalch.**

    $$\text{pH} = -\log(7.2\cdot10^{-4}) + \log\left(\frac{1.5\,\text{M}}{2.0\,\text{M}}\right) = 3.143 + (-0.125)$$

    $$\text{pH} = \boxed{3.02}$$

    **Method 2: RICE.** The common ion $\ce{F-}$ starts at 1.5 M, not 0:

    ```rice
    R: "HF <=> H+ + F-"
    I: [2.0M, "0", 1.5M]
    C: [-x, +x, +x]
    E: ["$2.0 - x$", "$x$", "$1.5 + x$"]
    ```

    $$K_a = 7.2\cdot10^{-4} = \frac{x\,(1.5 + \cancel{x})}{2.0 - \cancel{x}} \qquad x = \frac{7.2\cdot10^{-4}\cdot2.0\,\text{M}}{1.5} = 9.6\cdot10^{-4}\,\text{M} = [\ce{H+}]$$

    $$\text{pH} = -\log(9.6\cdot10^{-4}\,\text{M})$$

    $$\text{pH} = \boxed{3.02}$$

!!! example "Example: weak-base buffer — NH₃ + NH₄Cl"
    What is the pH of a solution that is 0.25 M $\ce{NH3}$ and 0.30 M $\ce{NH4Cl}$?
    ($K_b = 1.8\cdot10^{-5}$ for $\ce{NH3}$)

    **1. Reaction.** $\overset{\text{WB}}{\ce{NH3}} + \ce{NH4+}\,\cancel{\ce{Cl-}}\ \nrightarrow$ — no
    reaction. $\ce{NH3}$ and $\ce{NH4+}$ have the common part, so it's a **buffer** — use Henderson–Hasselbalch.

    **2. Get $\text{p}K_a$ (of $\ce{NH4+}$).** $K_b$ was given, but the equation needs $\text{p}K_a$:

    $$K_a = \frac{1\cdot10^{-14}}{K_b} = \frac{1\cdot10^{-14}}{1.8\cdot10^{-5}} = 5.56\cdot10^{-10} \qquad \text{p}K_a = -\log(5.56\cdot10^{-10}) = 9.26$$

    Check: $\text{p}K_b = -\log(1.8\cdot10^{-5}) = 4.74$, and $14 - 4.74 = 9.26$. ✓

    **3. Henderson–Hasselbalch.** Base = $[\ce{NH3}]$ = 0.25 M, Acid = $[\ce{NH4+}]$ = 0.30 M:

    $$\text{pH} = 9.26 + \log\left(\frac{0.25\,\text{M}}{0.30\,\text{M}}\right) = 9.26 - 0.0792$$

    $$\text{pH} = \boxed{9.18} \;\Rightarrow\; \text{basic}$$

!!! example "Example: acetic acid buffer — CH₃COOH + CH₃COO⁻"
    What is the pH of a buffer that is 0.25 M $\ce{CH3COO-}$ and 0.15 M $\ce{CH3COOH}$?
    ($K_a = 1.8\cdot10^{-5}$)

    $$\overset{\text{B}}{[\ce{CH3COO-}]} = 0.25\,\text{M} \qquad \overset{\text{A}}{[\ce{CH3COOH}]} = 0.15\,\text{M} \qquad \text{p}K_a = -\log(1.8\cdot10^{-5}) = 4.745$$

    $$\text{pH} = 4.745 + \log\left(\frac{0.25\,\text{M}}{0.15\,\text{M}}\right) = 4.745 + 0.2218 = 4.966$$

    $$\text{pH} = \boxed{4.97}$$

    More base than acid, so the pH is a little **above** $\text{p}K_a$.

## Adding a strong base to a buffer

When a strong acid or base is added to a buffer, solve it like the reaction example:
**stoichiometry step first** (the SB reacts completely with the WA), then
**Henderson–Hasselbalch** with what's left over. Both species are in the same volume, so moles
work just as well as molarity.

```apparatus
parts:
  - {type: beaker, id: b, fill: 0.6, liquid: clear}
labels:
  - {text: "SB: + 0.010 mol NaOH", to: b.rim, side: top, arrow: true}
  - {text: "WA: 0.40 mol HC2H3O2\nBase: 0.40 mol C2H3O2^-", to: b.liquid, side: right}
  - {text: "1 L", to: b.wall_left, side: left}
caption: A 1 L acetic acid buffer, before the NaOH reacts
```

!!! example "Example: adding NaOH to an acetic acid buffer"
    A 1 L buffer contains 0.40 mol $\ce{HC2H3O2}$ and 0.40 mol $\ce{C2H3O2-}$
    ($K_a = 1.8\cdot10^{-5}$).

    **a)** What is the pH of the buffer?<br>
    **b)** What is the pH after 0.010 mol $\ce{NaOH(s)}$ is added? (The volume doesn't change.)

    **a) The buffer.** The ratio $\frac{[\text{B}]}{[\text{A}]} = \frac{0.40}{0.40} = 1$, so pH = $\text{p}K_a$:

    $$\text{pH} = -\log(1.8\cdot10^{-5}) = \boxed{4.74}$$

    **b) 1. Stoichiometry step.** The SB reacts completely with the WA:

    $$\overset{\text{WA}}{\ce{HC2H3O2}} + \overset{\text{SB}}{\ce{OH-}} \ce{->[stoic step]} \ce{C2H3O2- + HOH}$$

    | | $\ce{HC2H3O2}$ (ER) | $\ce{OH-}$ (LR) | $\ce{C2H3O2-}$ | $\ce{HOH}$ |
    |---|:-:|:-:|:-:|:-:|
    | **mol** | 0.40 mol | 0.010 mol | 0.40 mol | |
    | **change** | −0.010 mol | −0.010 mol | +0.010 mol | |
    | **left over** | 0.39 mol | 0 | 0.41 mol | |

    **2. Conclusion of the stoichiometry step** (in 1 L):

    $$[\ce{HC2H3O2}] = \frac{0.39\ \text{mol}}{1\ \text{L}} = 0.39\,\text{M} \qquad [\ce{C2H3O2-}] = \frac{0.40\ \text{mol} + 0.010\ \text{mol}}{1\ \text{L}} = 0.41\,\text{M}$$

    **3. ID.** Still a WA + its conjugate base — still a **buffer**.

    **4. Henderson–Hasselbalch.**

    $$\text{pH} = -\log(1.8\cdot10^{-5}) + \log\left(\frac{0.41\,\text{M}}{0.39\,\text{M}}\right) = 4.745 + 0.0217$$

    $$\text{pH} = \boxed{4.77}$$

    The pH only went from 4.74 to 4.77. The same 0.010 mol of NaOH in 1 L of plain water would
    give $[\ce{OH-}] = 0.010\,\text{M}$, pOH = 2.00 and pH = 12.00 — a jump of 5 pH units.

Adding strong base a little at a time is exactly what happens when a weak acid is titrated — see
[Acid–Base Titrations](titrations.md).

## The ratio's deep meaning

The ratio in the Henderson–Hasselbalch equation is a ratio of **moles**, not just concentrations.
For example:

$$\frac{[\text{Base}]}{[\text{Acid}]} = 0.347 = \frac{0.347\,\text{M base}}{1\,\text{M acid}} = \frac{0.347\ \text{mol base}}{1\ \text{mol acid}}$$

The acid and base are in the same solution, so they always have the same volume — and the volume
cancels. For 2 M $\ce{H2CO3}$ mixed with 1.5 M $\ce{NaHCO3}$ (1 L), adding water changes only the
liters:

$$\text{pH} = \text{p}K_a + \log\left(\frac{1.5\ \text{mol} \,/\, \cancel{(1\ \text{L} + \ce{H2O})}}{2\ \text{mol} \,/\, \cancel{(1\ \text{L} + \ce{H2O})}}\right)$$

Adding more water to an already prepared buffer doesn't change its pH. {.star}

!!! example "Example: adding 500 mL of water to the HF + NaF buffer"
    What happens to the pH of the [HF + NaF buffer](#more-buffer-examples) (2.0 mol $\ce{HF}$ and
    1.5 mol $\ce{F-}$ in 1 L) when 500 mL of water is added?

    $$[\ce{HF}] = \frac{2.0\ \text{mol}}{1\ \text{L} + 0.5\ \text{L}} = 1.33\,\text{M} \qquad [\ce{F-}] = \frac{1.5\ \text{mol}}{1\ \text{L} + 0.5\ \text{L}} = 1.00\,\text{M}$$

    $$\frac{[\text{B}]}{[\text{A}]} = \frac{1.00\,\text{M}}{1.33\,\text{M}} = 0.750 = \frac{1.5\ \text{mol}}{2.0\ \text{mol}}$$

    $\therefore$ The mol ratio B/A stays the same, so the pH **does not change** — it is still 3.02.
