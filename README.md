# Walter's AP Chem

My AP Chemistry notes (Ms. Boppana, 2026–27), digitized into a searchable wiki with diagrams,
an auto-built formula sheet, teacher quotes, study stats and the reference PDFs.

**Live site:** https://tuxisawesome.github.io/APChem/

## Preview locally

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python -m wiki serve
```

Then open http://127.0.0.1:8000/. Pages rebuild and the browser reloads when you save a file.

## Publish

Push to `main`: the GitHub Action in `.github/workflows/deploy.yml` runs
`python -m wiki build --strict` and deploys `site/`. **One-time setup:** on GitHub open the repo's
**Settings → Pages** and set **Source** to **GitHub Actions**.

## Edit

- **Everything an editor (or AI) needs is in [`AGENTS.md`](AGENTS.md).**
- Friendly version with examples: `docs/contributing/` (also on the site under *Settings & Help*).
- Quotes, greetings, exam dates and reference PDFs live in `data/*.yml`.
- New scanned notebook → `tools/add_notebook.py` (see AGENTS.md).

## How it's built

A small static-site generator written for this wiki lives in `wiki/` (Python: Markdown +
pymdown-extensions, Jinja2 templates, PyYAML; versions pinned in `requirements.txt`). There's no
theme framework to go end-of-life: the layout is `wiki/templates/`, the styles are
`docs/assets/css/wiki.css`, and the browser features are `docs/assets/js/wiki.js`.
