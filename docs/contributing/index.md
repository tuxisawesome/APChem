---
title: Editing the Wiki
description: How to add notes, quotes, dates and pages — by yourself or with an AI helper.
---

Everything on this site is plain text files in the repo, so it's easy to change — by hand or by
asking an AI (like Claude) to do it. The AI instructions live in **`AGENTS.md`** at the top of the
repo; AI helpers read it automatically.

## Asking an AI to add notes

Good requests look like this:

- *"Add my notes from Notebook 10-3 pages 1–6 (attached PDF) to Unit 5."*
- *"Add this quote from Ms. Boppana: '…'."*
- *"Exam #6 moved to Dec 22 — update the countdown."*
- *"Make a new page in Unit 6 about galvanic cells from these photos."*

The AI will split the scans into page images, write the pages using my notebook's conventions
(RICE tables, ☆ lines, formula boxes…), add them to the navigation, update the
[Formulas](../formulas.md) page automatically, log the class days, and run the build check.

## Where things live

| I want to… | Edit |
|---|---|
| Change or add notes | `docs/units/<unit>/<page>.md` (+ `nav:` in `site.yml` for new pages) |
| Add a teacher quote | `data/quotes.yml` |
| Change greetings | `data/greetings.yml` |
| Fix a unit/exam date | `data/schedule.yml` |
| Add a reference PDF | put it in `docs/assets/resources/` and add it to `data/resources.yml` |
| Add a scanned notebook | `python tools/add_notebook.py "Notebook.pdf" --id 10-3` |
| Change the look | `docs/assets/css/wiki.css` (styles), `wiki/templates/` (page layout) |

## Writing pages by hand

1. Copy `tools/templates/topic.md` into the right unit folder.
2. Fill in the front matter (title, unit, which notebook pages it came from).
3. Write the notes — see the [Style Guide](style-guide.md) for ☆ lines, formula boxes, columns, and
   the [Diagram Reference](diagrams.md) for beakers, graphs, RICE tables and Lewis structures.
4. Add the page to `nav:` in `site.yml`.
5. Preview with `python -m wiki serve`, and check with `python -m wiki build --strict` (it catches
   mistakes like a page without formula boxes, a broken link or a typo in a diagram).

## Publishing

Pushing to the `main` branch rebuilds and publishes the site automatically (about a minute).

## How the site is built

The wiki has its own small generator in the `wiki/` folder (plain Python, no theme framework):
it reads `site.yml`, the Markdown pages in `docs/` and the data files in `data/`, and writes the
finished site to `site/`. Each page gets breadcrumbs, an infobox with its notebook pages, a
Contents list, links to related pages and "What links here", and a search index.

