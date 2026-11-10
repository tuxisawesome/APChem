# AGENTS.md — how to work on this wiki

This repo is a **personal AP Chemistry notes wiki** (MkDocs + Material, hosted on GitHub Pages at
https://tuxisawesome.github.io/APChem/). The notes are digitized from handwritten notebooks.
This file tells AI assistants (and humans) everything needed to edit it safely.

## Golden rules

1. **Organize freely, but keep the notebook's conventions.** Choose the clearest order and your
   own headings (within and between pages). What must match the notebook is its *conventions*:
   terminology, notation, list styles, worked-example layouts and drawings (see "Note conventions").
   Keep all the content.
2. **Fix mistakes quietly.** Correct wrong chemistry and misspellings without leaving notes.
3. **Every equation/constant goes in a `!!! formula "Name"` box.** The Formulas page is built
   from these automatically. A topic page without any must declare `formulas: none`.
4. **Shared reference lists live in `snippets/`** (strong acids/bases, solubility charts, ion grid,
   -ous/-ic names) and are included with `--8<-- "file.md"`. Edit them there, once.
5. **Always run `mkdocs build --strict` before finishing.** It fails on: missing front matter,
   bad notebook page references, broken links, diagram errors, pages missing formula boxes.
6. Commit/push only when asked.

## Quick start

```bash
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
.venv/bin/mkdocs serve          # → http://127.0.0.1:8000/APChem/
.venv/bin/mkdocs build --strict # the same check CI runs
```

Deploys happen automatically on push to `main` (`.github/workflows/deploy.yml`).

## Where things are

| Path | What |
|---|---|
| `mkdocs.yml` | Site config + **`nav:`** (every page must be listed here) |
| `docs/units/NN-slug/` | One folder per syllabus unit: `index.md` + topic pages |
| `docs/formulas.md` | Formulas page (auto-filled by `<!-- wiki:formulas -->`) |
| `docs/memorize.md`, `study-skills.md`, `class-log.md`, `quotes.md`, `reference.md` | Toolkit pages |
| `docs/scans/` | Notebook scan galleries; images in `docs/assets/scans/<nb>/pNN.webp` |
| `docs/contributing/` | Human docs: editing guide, style guide, diagram reference (live gallery) |
| `data/quotes.yml` | Teacher quotes (home page + Quotes page) |
| `data/greetings.yml` | Home-page greetings (`{name}`, `{exam}`, `{days}` placeholders) |
| `data/schedule.yml` | Units, dates, syllabus sections, exam dates (countdowns + unit pages) |
| `data/resources.yml` | Reference PDFs (files in `docs/assets/resources/`) |
| `data/notebooks.yml` | Scanned notebooks (written by `tools/add_notebook.py`) |
| `snippets/` | Shared Markdown included in several pages |
| `hooks/chemwiki.py` | Build hook: data loading, markers, formula collection, validation, stats |
| `hooks/diagrams/` | Diagram kit (YAML code block → SVG). One module per kind |
| `overrides/` | Theme templates: `home.html` (home page), `main.html` |
| `docs/assets/css/wiki.css`, `docs/assets/js/wiki.js` | Styling and browser features |
| `tools/templates/` | Starting points for new topic/unit pages |

## Common tasks

### Add notes for a topic
1. Copy `tools/templates/topic.md` to `docs/units/NN-slug/new-topic.md`.
2. Fill the front matter: `title`, `unit` (must match folder number), `description`,
   `sources` (`{nb: "10-3", pages: "4-6"}`), `dates`, optional `tags`.
3. Write the notes following the conventions below. Put formulas in `!!! formula` boxes.
4. Add the page to `nav:` in `mkdocs.yml` under its unit.
5. Add the day's objectives/homework/assessments to `docs/class-log.md` and any teacher quotes to
   `data/quotes.yml`.
6. `mkdocs build --strict`.

### Add a new scanned notebook
```bash
.venv/bin/pip install -r tools/requirements.txt   # Pillow; also needs `brew install poppler`
.venv/bin/python tools/add_notebook.py "path/to/Notebook 10-3.pdf" --id 10-3 --dates "11/11/26 – 12/1/26"
```
Then create `docs/scans/10-3.md` (copy `docs/scans/10-2.md`, change the id) and add it to `nav:`.

### Add a quote / greeting / exam date / resource
Edit the YAML file in `data/` — the formats are described at the top of each file.

### Add a unit page or change dates
Units and sections come from `data/schedule.yml`; unit index pages just contain markers
(see `tools/templates/unit.md`).

## Wiki formatting (readability)

- Write clean wiki prose: short intro sentence per section, **bold** key terms, normal bullet
  lists (nested for sub-points). **Never start lines with → or ↳**, and **no bare "ex."** prefixes.
- Prefer **tables** for rules/comparisons/cases (e.g. Case | Meaning | Favored reaction) and
  **definition lists** (`**Term**` newline `:   definition`) for vocabulary.
- Arrows only in chemistry/math (reactions, conversion chains).

## Note conventions (match the notebook)

- **Front matter** title instead of a `# H1`. Choose your own headings and order.
- **Objectives:** `!!! objective "Students will be able to"`.
- **☆ starred facts:** a paragraph ending in `{.star}` → `Solids don't react! {.star}`.
- **Boxed "Memorize!" formulas:** `!!! formula memorize "Name"`. Non-formula memorize items:
  `!!! memorize "Title"`.
- **Teacher quotes in context:** `!!! teacher "Ms. Boppana"`. "AP Favorite!" items: `!!! ap "AP Favorite!"`.
- **Section end markers** (`<—— End of concentration ——>`): `End of concentration {.divider}`.
- **Boxed single words:** `<span class="boxed">NOT</span>`.
- **Sidebars / two-column layouts / T-charts:** `<div class="cols sidebar" markdown>` (or `cols`,
  `cols ruled`, `tchart`) with one `<div markdown>` per column.
- **Mnemonic tables:** wrap in `<div class="mnemonic" markdown>`.
- **Chemistry:** mhchem — `$\ce{N2 + 3H2 <=> 2NH3}$`, `$\ce{SO4^2-}$`, `$\ce{A ->[\Delta] B}$`.
  Math: `$K_c = \dfrac{[NH_3]^2}{[N_2]\cdot[H_2]^3}$`. Use `\cdot` for multiplication and for
  scientific notation: `$8.8\cdot10^{-12}$`. Display math: `$$ … $$` on its own lines.
- **Heat in equations:** the preferred format is heat written **as a term in the equation**
  (`A + B + (#kJ) ⇌ C + D`), not a separate ΔH.
- **Notation to keep:** RICE (never "ICE"); `HOH` for water when written that way; "LB acid/base"
  (Lowry–Brønsted); `[X]_0` (initial), `[X]_{eq}`; `K_c(\text{REV})`, `K_c('n')`, `K_{p,i}`;
  lowercase `t` for temperature in thermo; `C` (heat capacity) vs `c` (specific heat);
  explicit coefficient `1` in RICE rows; units carried through every step (`0.148M`);
  `#X` = oxidation number of X; ∴ before conclusions.
- **Worked examples** keep every step and unit; put them in `!!! example "Example: …"` boxes.
- **Strike-through / boxes / check marks inside equations:** `\cancel{}`, `\boxed{}`,
  `\overset{\checkmark}{}`; labels under groups: `\underbrace{…}_{\text{label}}`.

## Diagrams (fenced YAML → SVG)

Kinds: `rice`, `graph`, `energy`, `apparatus`, `lewis` (plus `mermaid` flowcharts).
Full syntax with live examples: `docs/contributing/diagrams.md`; each module's docstring in
`hooks/diagrams/` lists every option and anchor. Text in diagrams auto-subscripts formulas
(`H2O`, `NH4+`), and supports `^{}` / `_{}`.

Minimal examples:

````markdown
```rice
R: "1PCl5 <=> 1PCl3 + Cl2"
I: [0.149M, 0.002175M, 0M]
C: [-xM, +xM, +xM]
E: [0.148M, 0.003175M, 0.001M]
```

```apparatus
parts: [{type: beaker, id: cup, style: cup, fill: 0.5}]
labels:
  - {text: Surroundings, to: cup.wall}
  - {text: "System\n(Reaction)", to: cup.liquid, arrow: true}
```
````

To add a new kind: new module in `hooks/diagrams/` with `render(data) -> str`, register in
`hooks/diagrams/__init__.py → KINDS`, add an example to `docs/contributing/diagrams.md`.

## Page markers (expanded by the hook)

Put on their own line: `<!-- wiki:formulas -->`, `<!-- wiki:quotes -->`, `<!-- wiki:units -->`,
`<!-- wiki:unit-header unit=N -->`, `<!-- wiki:unit-pages unit=N -->`,
`<!-- wiki:syllabus unit=N -->`, `<!-- wiki:resources -->`, `<!-- wiki:notebooks -->`,
`<!-- wiki:scans nb=ID -->`.

## Browser features (docs/assets/js/wiki.js)

Greeting (`data/greetings.yml`, name in localStorage via Settings), random quote, study-time
tracker (localStorage `apchem.study`), countdowns (from `data/schedule.yml`), PDF preview modal
(`.rc-preview[data-pdf]`), scan lightbox (`.source-chip` / `.scan-open` with `data-nb`,
`data-pages`, `data-base`), Formulas filter, Settings page (`#wiki-settings`). Personal data
never leaves the browser.

## Notes on the stack

Material for MkDocs is in maintenance mode (end of life May 2027); its successor
**Zensical** reads the same `mkdocs.yml`. Hooks and custom fences may need porting if you migrate.
Versions are pinned in `requirements.txt`.
