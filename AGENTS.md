# AGENTS.md — how to work on this wiki

This repo is a **personal AP Chemistry notes wiki**, built by its own small static-site generator
(`wiki/`, Python) and hosted on GitHub Pages at https://tuxisawesome.github.io/APChem/. The notes are digitized from handwritten notebooks.
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
5. **Always run `.venv/bin/python -m wiki build --strict` before finishing.** It fails on: missing
   front matter, bad notebook page references, broken links/anchors, diagram errors, pages missing
   formula boxes, pages missing from the nav.
6. Commit/push only when asked.

## Quick start

```bash
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
.venv/bin/python -m wiki serve           # → http://127.0.0.1:8000/ (rebuilds + reloads on save)
.venv/bin/python -m wiki build --strict   # the same check CI runs (output: site/)
```

Deploys happen automatically on push to `main` (`.github/workflows/deploy.yml`).

## Where things are

| Path | What |
|---|---|
| `site.yml` | Site name/URL + **`nav:`** (every page must be listed here) |
| `docs/units/NN-slug/` | One folder per syllabus unit: `index.md` + topic pages |
| `docs/formulas.md` | Formulas page (auto-filled by `<!-- wiki:formulas -->`) |
| `docs/memorize.md`, `study-skills.md`, `class-log.md`, `quotes.md`, `reference.md` | Toolkit pages |
| `docs/glossary.md`, `molar-mass.md`, `focus.md`, `saved.md` | Tool pages: Glossary (built from the notes), Molar Mass Calculator, Focus Timer, Saved Pages |
| `docs/scans/` | Notebook scan galleries; images in `docs/assets/scans/<nb>/pNN.webp` |
| `docs/contributing/` | Human docs: editing guide, style guide, diagram reference (live gallery) |
| `data/quotes.yml` | Teacher quotes (home page + Quotes page) |
| `data/greetings.yml` | Home-page greetings (`{name}`, `{exam}`, `{days}` placeholders) |
| `data/schedule.yml` | Units, dates, syllabus sections, exam dates (countdowns + unit pages) |
| `data/resources.yml` | Reference PDFs (files in `docs/assets/resources/`) |
| `data/elements.yml` | Elements + atomic masses from the AP periodic table (Molar Mass Calculator) |
| `data/notebooks.yml` | Scanned notebooks (written by `tools/add_notebook.py`) |
| `snippets/` | Shared Markdown included in several pages |
| `wiki/core.py` | The generator: pages, nav, Markdown, links, validation, stats, search index |
| `wiki/markers.py` | `<!-- wiki:… -->` markers (formulas, quotes, units, scans, tags…) |
| `wiki/templating.py`, `wiki/templates/` | Page layout (Jinja): `base.html`, `page.html` (article), `home.html`, `404.html` |
| `wiki/diagrams/` | Diagram kit (YAML code block → SVG). One module per kind |
| `wiki/icons/` | SVG icons used by templates (`icon('name')`) |
| `docs/assets/css/wiki.css`, `docs/assets/js/wiki.js` | Styling and browser features |
| `wiki/pwa.py`, `wiki/templates/sw.js` | Installable offline app: manifest, service worker, offline list |
| `docs/assets/vendor/`, `docs/assets/icons/` | Bundled KaTeX + fonts (`tools/vendor_assets.py`), app icons (`tools/make_icons.py`) |
| `tools/templates/` | Starting points for new topic/unit pages |

## Common tasks

### Add notes for a topic
1. Copy `tools/templates/topic.md` to `docs/units/NN-slug/new-topic.md`.
2. Fill the front matter: `title`, `unit` (must match folder number), `description`,
   `sources` (`{nb: "10-3", pages: "4-6"}`), `dates`, optional `tags`.
3. Write the notes following the conventions below. Put formulas in `!!! formula` boxes.
4. Add the page to `nav:` in `site.yml` under its unit.
5. Add the day's objectives/homework/assessments to `docs/class-log.md` and any teacher quotes to
   `data/quotes.yml`.
6. `.venv/bin/python -m wiki build --strict`.

### Add scanned notebook pages
All notes so far are in **one physical book, "Notebook 1"** (id `"1"`, pages in date order).
New scans of the same book are **appended** so existing page numbers never change:
```bash
.venv/bin/pip install -r tools/requirements.txt   # Pillow; also needs `brew install poppler`
.venv/bin/python tools/add_notebook.py "path/to/new pages.pdf" --id 1 --append --dates "8/25/26 – 12/1/26"
```
The new pages get the next numbers (84, 85, …); cite them as `{nb: "1", pages: "84-90"}`.
Only for a genuinely **new physical notebook**: run without `--append` and with a new id/title
(`--id 2 --title "Notebook 2"`), then create `docs/scans/2.md` (copy `docs/scans/1.md`, change
the id) and add it to `nav:`.

### Teacher's class notes (smart board)
Ms. Boppana's smart-board notes are their own notebook: **"Class Notes"** (id `class-notes`,
96 pages, ordered by unit — the table at the top of `docs/scans/class-notes.md` shows which page
ranges cover which topic). They're from a previous school year, so **never copy their dates**
into pages or the class log. When a wiki page uses material from them, cite it alongside the
student's notebook:
```yaml
sources:
  - {nb: "1", pages: "71-77"}
  - {nb: "class-notes", pages: "59-74"}
```
New board PDFs: `tools/add_notebook.py NEW.pdf --id class-notes --append`, then add a row to the
topic table in `docs/scans/class-notes.md`.

### Add a quote / greeting / exam date / resource
Edit the YAML file in `data/` — the formats are described at the top of each file.

### Add a unit page or change dates
Units and sections come from `data/schedule.yml`; unit index pages just contain markers
(see `tools/templates/unit.md`).

## Wiki formatting (readability)

- Write clean wiki prose: short intro sentence per section, **bold** key terms, normal bullet
  lists (nested for sub-points). **Never start lines with → or ↳**, and **no bare "ex."** prefixes.
- Prefer **tables** for rules/comparisons/cases (e.g. Case | Meaning | Favored reaction) and
  **definition lists** (`**Term**` newline `:   definition`) for vocabulary. Every definition list
  on a topic page is collected into the **Glossary** automatically, so write each vocabulary term
  that way (and keep definitions self-contained: no "see below").
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

Kinds: `rice`, `graph`, `energy`, `apparatus`, `lewis`, `phscale` (plus `mermaid` flowcharts).
Full syntax with live examples: `docs/contributing/diagrams.md`; each module's docstring in
`wiki/diagrams/` lists every option and anchor. Text in diagrams auto-subscripts formulas
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

To add a new kind: new module in `wiki/diagrams/` with `render(data) -> str`, register in
`wiki/diagrams/__init__.py → KINDS`, add an example to `docs/contributing/diagrams.md`.

## Page markers (expanded by the generator)

Put on their own line: `<!-- wiki:formulas -->`, `<!-- wiki:quotes -->`, `<!-- wiki:units -->`,
`<!-- wiki:unit-header unit=N -->`, `<!-- wiki:unit-pages unit=N -->`,
`<!-- wiki:syllabus unit=N -->`, `<!-- wiki:resources -->`, `<!-- wiki:notebooks -->`,
`<!-- wiki:scans nb=ID -->`, `<!-- wiki:tags -->`, `<!-- wiki:glossary -->` (every definition-list
term from the topic pages; pages using it render last), `<!-- wiki:molar-mass -->` (calculator +
`data/elements.yml`). To add one: a function in `wiki/markers.py`
(`fn(site, page, args) -> Markdown`), registered in `MARKERS`.

## Page layout (wiki/templates/page.html)

Every page is laid out like an encyclopedia article, built from its front matter and the nav:
breadcrumbs → title + `description` as the lead → an **infobox** (unit, source chips that open the
notebook scans, class dates, unit exam, formula count, last edited from git, `tags`) → the notes →
"More in this section", "What links here" (backlinks), previous/next. The right column is a
numbered **Contents** list of the page's `##`/`###` headings. So: keep `description` to one or two
plain sentences, give every page clear `##` headings, and link related pages with normal Markdown
links (`[RICE Tables](../03-equilibrium/rice-tables.md)`); links are checked at build time.

## Browser features (docs/assets/js/wiki.js)

Theme toggle (auto/light/dark, localStorage `apchem.theme`), search over `search-index.json`
(`/` or Ctrl/⌘ K), hover previews for links to other pages, Contents highlighting, mobile nav
drawer, greeting (`data/greetings.yml`, name in localStorage via Settings), random quote,
study-time tracker (localStorage `apchem.study`), countdowns (from `data/schedule.yml`), PDF preview
modal (`.rc-preview[data-pdf]`), scan lightbox (`.source-chip` / `.scan-open` with `data-nb`,
`data-pages`, `data-base`), Formulas filter, Settings page (`#wiki-settings`), 3D NH₃ on the home
page, and the app features below. Also:

- **Saved pages:** bookmark button by each page title (`apchem.bookmarks`), recently viewed
  (`apchem.recent`, last 12), listed on `saved/` (`#saved-pages`) and the home page (`#your-pages`).
- **Focus timer** (`focus/`, `#focus-timer`): Pomodoro state in `apchem.focus` (wall-clock times, so it
  survives page changes and closing the app), a top-bar `.focus-pill` while it runs. Finished or stopped
  focus time is added to `apchem.study` (the passive tracker pauses meanwhile); per-day sessions in
  `apchem.focusDays`.
- **Molar Mass Calculator** (`#molar-mass`): formula parser (brackets, hydrates, charges), breakdown,
  g ⇄ mol ⇄ particles with sig figs; recent formulas in `apchem.mmHistory`, `?f=` in the URL.
- **Glossary filter** (`.glossary-filter`).
- **Bottom tab bar** (`.tabbar` in `base.html`): only in the Home Screen app at ≤ 1023px
  (`html.standalone`); replaces the top bar's menu, search and Formulas buttons.

Settings → Export/Import carries study time, bookmarks, history and the focus log. Personal data
never leaves the browser.

## Installable offline app (PWA)

The site installs on a phone (Safari → Share → **Add to Home Screen**) and works offline.

- **Generated each build** by `wiki/pwa.py` (called at the end of `Site.build`):
  `manifest.webmanifest`, `sw.js` (from `wiki/templates/sw.js`) and `offline-media.json`.
  The service worker precaches **every page and asset** (~5 MB); scans and PDFs go into a separate
  `apchem-media` cache when opened, or all at once from Settings → **Save all for offline**.
  A page that isn't saved yet shows `docs/offline.md` (front matter `nav: false`).
- **Updates:** pages are network-first, so online visits always get the newest notes; a new build
  changes `sw.js`, which installs the new version and shows "The app was updated — Refresh".
  Settings → **Clear cache and refresh** deletes all caches and the service worker, then reloads
  (localStorage — name, settings, study time, reading position — is kept).
- **Asset URLs carry `?v=<hash>`**: in templates write `{{ self.root() }}{{ v('assets/…') }}`.
- **No CDNs:** KaTeX and the fonts are bundled in `docs/assets/vendor/` by
  `tools/vendor_assets.py` (pinned versions; re-run to update). Only Mermaid (2 pages) loads from
  jsDelivr, and the service worker keeps a copy. Don't add new CDN links.
- **Icons:** `docs/assets/icons/*.png`, drawn from the flask logo by `tools/make_icons.py`.
- **App extras in `wiki.js`** (`initPWA`): offline pill + toasts, back button when opened from the
  Home Screen, Share button on pages, Continue reading (localStorage `apchem.lastRead`), text size
  (`apchem.textScale` → CSS `--prose-scale`). iPhone safe areas use `--safe-top/-bottom/-left/-right`.

## Notes on the stack

No theme framework: Python-Markdown + pymdown-extensions (math, details, snippets, custom fences),
Jinja2 templates and PyYAML, pinned in `requirements.txt`. KaTeX (with mhchem) and the fonts are
bundled in `docs/assets/vendor/`; Mermaid loads from jsDelivr. All links in the output are
relative, so the site works at `/APChem/` on GitHub Pages and at `/` locally.
