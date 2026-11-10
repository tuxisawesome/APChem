# AP Chem Notes

My AP Chemistry notes (Ms. Boppana, 2026–27), digitized into a searchable wiki with diagrams,
an auto-built formula sheet, teacher quotes, study stats and the reference PDFs.

**Live site:** https://tuxisawesome.github.io/APChem/

## Preview locally

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/mkdocs serve
```

Then open http://127.0.0.1:8000/APChem/.

## Publish

Push to `main` — the GitHub Action in `.github/workflows/deploy.yml` builds the site with
`mkdocs build --strict` and deploys it. **One-time setup:** on GitHub open the repo's
**Settings → Pages** and set **Source** to **GitHub Actions**.

## Edit

- **Everything an editor (or AI) needs is in [`AGENTS.md`](AGENTS.md).**
- Friendly version with examples: `docs/contributing/` (also on the site under *Settings & Help*).
- Quotes, greetings, exam dates and reference PDFs live in `data/*.yml`.
- New scanned notebook → `tools/add_notebook.py` (see AGENTS.md).

Built with MkDocs + Material for MkDocs (pinned in `requirements.txt`). Material reaches end of life
in May 2027; its successor Zensical reads the same `mkdocs.yml`.
