"""MkDocs build hook for the AP Chem wiki.  (Registered in mkdocs.yml → hooks:)

What it does, in build order:
  on_config        load data/*.yml into `config.extra.wiki`, register diagram fences
  on_files         scan docs/units/**.md for `!!! formula "Name"` blocks (Formulas page)
  on_nav           remember nav order (used to sort pages in generated lists)
  on_page_markdown validate front matter of unit pages, expand <!-- wiki:… --> markers,
                   count words/diagrams for the home-page stats
  on_page_content  add ids to formula callouts, add the "From my notes" source chips
  on_page_context  finish the stats (all pages are processed by then)

Markers you can put in any page (each on its own line):
  <!-- wiki:formulas -->              every formula, grouped by unit → page (Formulas page)
  <!-- wiki:quotes -->                all quotes from data/quotes.yml
  <!-- wiki:units -->                 cards for all 11 units
  <!-- wiki:unit-header unit=3 -->    dates / exam chips for a unit
  <!-- wiki:unit-pages unit=3 -->     cards for the topic pages of a unit
  <!-- wiki:syllabus unit=3 -->       syllabus outline (from data/schedule.yml)
  <!-- wiki:resources -->             PDF cards with Preview / Download
  <!-- wiki:notebooks -->             list of scanned notebooks
  <!-- wiki:scans nb=10-2 -->         thumbnail gallery of one notebook

Validation (warnings → `mkdocs build --strict` fails):
  • unit topic pages need front matter: title, unit (matching the folder), sources
  • sources must point at real notebook pages (data/notebooks.yml)
  • unit topic pages need at least one `!!! formula` block, or `formulas: none`
  • diagram blocks must parse
"""
from __future__ import annotations

import datetime as dt
import html
import logging
import os
import posixpath
import re
import subprocess
import sys
from pathlib import Path

import yaml
from mkdocs.utils import get_relative_url
from mkdocs.utils.meta import get_data

sys.path.insert(0, os.path.dirname(__file__))
from diagrams import KINDS, DiagramError, error_box, render_block  # noqa: E402

log = logging.getLogger("mkdocs.hooks.chemwiki")
ROOT = Path(__file__).resolve().parent.parent

STATE: dict = {}

FORMULA_RE = re.compile(
    r'^(?P<indent>[ \t]*)(?P<mark>!!!|\?\?\?\+?)[ \t]+formula(?P<extra>(?:[ \t]+[\w-]+)*)[ \t]+"(?P<title>[^"]*)"[ \t]*$',
    re.M)
MARKER_RE = re.compile(r"^[ \t]*<!--\s*wiki:(?P<name>[\w-]+)(?P<args>[^>]*?)-->[ \t]*$", re.M)
FENCE_RE = re.compile(r"^\s*(`{3,}|~{3,})\s*(" + "|".join(KINDS) + r")\b", re.M)
UNIT_DIR_RE = re.compile(r"^units/(\d{2})-[^/]+/")


# ─── helpers ────────────────────────────────────────────────────────────────
def _dates_to_str(o):
    if isinstance(o, dict):
        return {k: _dates_to_str(v) for k, v in o.items()}
    if isinstance(o, list):
        return [_dates_to_str(v) for v in o]
    if isinstance(o, (dt.date, dt.datetime)):
        return o.isoformat()
    return o


def _load(name):
    p = ROOT / "data" / f"{name}.yml"
    if not p.exists():
        log.warning(f"data/{name}.yml is missing")
        return {}
    try:
        return _dates_to_str(yaml.safe_load(p.read_text(encoding="utf-8")) or {})
    except yaml.YAMLError as e:
        log.warning(f"data/{name}.yml has a YAML error: {e}")
        return {}


def slugify(s: str) -> str:
    s = html.unescape(str(s)).lower()
    s = re.sub(r"[₀-₉]", lambda m: str(ord(m.group(0)) - 0x2080), s)
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s or "formula"


def parse_pages(spec) -> list[int]:
    """'3', 3, '11-14', '3, 5-6' → [ints]"""
    out = []
    for part in str(spec).replace("–", "-").split(","):
        part = part.strip()
        if not part:
            continue
        if "-" in part:
            a, b = part.split("-", 1)
            out.extend(range(int(a), int(b) + 1))
        else:
            out.append(int(part))
    return out


def fmt_pages(pages: list[int]) -> str:
    if not pages:
        return ""
    runs, start, prev = [], pages[0], pages[0]
    for p in pages[1:] + [None]:
        if p is not None and p == prev + 1:
            prev = p
            continue
        runs.append(f"{start}" if start == prev else f"{start}–{prev}")
        if p is not None:
            start = prev = p
    label = "p." if len(pages) == 1 else "pp."
    return f"{label} {', '.join(runs)}"


def parse_date(s):
    """'9/22/26' → date(2026, 9, 22); ISO strings also accepted."""
    s = str(s).strip()
    try:
        if "/" in s:
            m, d, y = (int(x) for x in s.split("/"))
            return dt.date(2000 + y if y < 100 else y, m, d)
        return dt.date.fromisoformat(s[:10])
    except Exception:
        return None


def nice_date(iso) -> str:
    d = parse_date(iso)
    return f"{d:%a} {d:%b} {d.day}" if d else str(iso)


def rel(target_src: str, page) -> str:
    """Relative markdown link from the current page's source file to another source file."""
    return posixpath.relpath(target_src, posixpath.dirname(page.file.src_uri) or ".")


def url_from(page, target_url: str) -> str:
    """Relative URL (for raw HTML) from the current page to a site path."""
    return get_relative_url(target_url, page.url)


def esc(s) -> str:
    return html.escape(str(s), quote=True)


def unit_by_number(n):
    for u in STATE["wiki"]["schedule"].get("units", []):
        if int(u["number"]) == int(n):
            return u
    return None


def _args(s: str) -> dict:
    return dict(re.findall(r"(\w+)=([\w.\-]+)", s or ""))


# ─── markdown normalization (forgiving authoring) ───────────────────────────
TRAILING_ATTR_RE = re.compile(r"^(?P<indent>[ \t]*)(?P<text>(?![#|>]|```|~~~).*\S)[ \t]+\{:?[ \t]*(?P<attr>\.[\w-]+(?:[ \t]+\.[\w-]+)*)[ \t]*\}[ \t]*$")
DISPLAY_MATH_RE = re.compile(r"^[ \t]*\$\$.*\$\$[ \t]*$")
FENCE_LINE_RE = re.compile(r"^[ \t]*(`{3,}|~{3,})")


def normalize_markdown(md: str) -> str:
    """Make two easy-to-miss syntax rules forgiving (outside code fences):
      • "Some text {.star}" on ONE line → attribute list moved to its own line
        (Python-Markdown only applies block attributes from a line of their own).
      • a single-line display equation "$$ … $$" gets blank lines around it
        (otherwise it isn't rendered as display math).
    """
    out: list[str] = []
    fence = None
    lines = md.split("\n")
    for i, ln in enumerate(lines):
        fm = FENCE_LINE_RE.match(ln)
        if fm:
            mark = fm.group(1)
            if fence is None:
                fence = mark[0] * 3
            elif mark.startswith(fence):
                fence = None
            out.append(ln)
            continue
        if fence:
            out.append(ln)
            continue
        m = TRAILING_ATTR_RE.match(ln)
        if m and not re.match(r"^[ \t]*([-*+]|\d+[.)])[ \t]", ln):
            out.append(f"{m.group('indent')}{m.group('text')}")
            out.append(f"{m.group('indent')}{{{m.group('attr')}}}")
            continue
        if DISPLAY_MATH_RE.match(ln):
            indent = ln[: len(ln) - len(ln.lstrip())]
            if out and out[-1].strip() and not out[-1].strip().startswith(("!!!", "???")):
                out.append("")
            out.append(ln)
            nxt = lines[i + 1] if i + 1 < len(lines) else ""
            if nxt.strip():
                out.append("")
            continue
        out.append(ln)
    return "\n".join(out)


# ─── formula scanning ───────────────────────────────────────────────────────
def scan_formulas(text: str) -> list[dict]:
    lines = text.split("\n")
    found = []
    for i, ln in enumerate(lines):
        m = FORMULA_RE.match(ln)
        if not m:
            continue
        ind = len(m.group("indent").expandtabs(4))
        body = []
        for nxt in lines[i + 1:]:
            if nxt.strip() == "":
                body.append("")
                continue
            if len(nxt.expandtabs(4)) - len(nxt.expandtabs(4).lstrip()) <= ind:
                break
            body.append(nxt.expandtabs(4)[ind + 4:] if len(nxt.expandtabs(4)) > ind + 4 else nxt.strip())
        while body and body[-1] == "":
            body.pop()
        extra = m.group("extra").split()
        found.append({"title": m.group("title"), "body": "\n".join(body), "memorize": "memorize" in extra})
    return found


# ─── hooks ──────────────────────────────────────────────────────────────────
def on_config(config):
    STATE.clear()
    wiki = {
        "quotes": _load("quotes").get("quotes", []),
        "greetings": _load("greetings").get("greetings", {}),
        "schedule": _load("schedule"),
        "resources": _load("resources").get("resources", []),
        "notebooks": _load("notebooks").get("notebooks", []),
    }
    STATE.update(wiki=wiki, formulas={}, page_ids={}, page_meta={}, page_stats={}, nav_order={},
                 file_urls={}, stats_done=False, current=None, citations={})
    config.extra["wiki"] = wiki
    sched = wiki["schedule"]
    config.extra["wiki_public"] = {
        "quotes": wiki["quotes"],
        "greetings": wiki["greetings"],
        "course": sched.get("course", {}),
        "units": [{k: u.get(k) for k in ("number", "title", "short", "slug", "start", "end", "exam")}
                  for u in sched.get("units", [])],
        "events": sched.get("events", []),
        "default_name": config.extra.get("default_name", ""),
    }

    # register the diagram fences with pymdownx.superfences
    sf = config.mdx_configs.setdefault("pymdownx.superfences", {})
    fences = sf.setdefault("custom_fences", [])
    have = {f.get("name") for f in fences}
    for kind in KINDS:
        if kind not in have:
            fences.append({"name": kind, "class": f"diagram-{kind}", "format": _make_fence(kind)})
    return config


def _make_fence(kind):
    def fmt(source, language, class_name, options, md, **kwargs):
        try:
            return render_block(kind, source)
        except DiagramError as e:
            where = STATE.get("current") or "?"
            log.warning(f"Diagram error in {where}: {e}")
            return error_box(kind, str(e), source)
    return fmt


def on_files(files, config):
    notebooks = {str(n["id"]): n for n in STATE["wiki"]["notebooks"]}
    for f in files.documentation_pages():
        STATE["file_urls"][f.src_uri] = f.url
        try:
            text = Path(f.abs_src_path).read_text(encoding="utf-8")
        except OSError:
            continue
        body, meta = get_data(text)
        STATE["page_meta"][f.src_uri] = meta or {}
        for s in (meta or {}).get("sources") or []:
            if isinstance(s, dict) and str(s.get("nb")) in notebooks:
                try:
                    for p in parse_pages(s.get("pages", "")):
                        STATE["citations"].setdefault((str(s["nb"]), p), []).append(f.src_uri)
                except ValueError:
                    pass
        if f.src_uri.startswith("units/"):
            forms = scan_formulas(body)
            used = set()
            for fm in forms:
                base = "f-" + slugify(fm["title"])
                fid, k = base, 2
                while fid in used:
                    fid, k = f"{base}-{k}", k + 1
                used.add(fid)
                fm["id"] = fid
            if forms:
                STATE["formulas"][f.src_uri] = forms
                STATE["page_ids"][f.src_uri] = [fm["id"] for fm in forms]
    return files


def on_nav(nav, config, files):
    order = 0
    for p in nav.pages:
        STATE["nav_order"][p.file.src_uri] = order
        order += 1
    return nav


def _validate(page, markdown):
    src = page.file.src_uri
    m = UNIT_DIR_RE.match(src)
    if not m or src.endswith("index.md"):
        return
    meta = page.meta or {}
    for key in ("title", "unit", "sources"):
        if not meta.get(key):
            log.warning(f"{src}: front matter is missing `{key}` (see tools/templates/topic.md)")
    if meta.get("unit") and int(meta["unit"]) != int(m.group(1)):
        log.warning(f"{src}: `unit: {meta['unit']}` doesn't match its folder (unit {int(m.group(1))})")
    nbs = {str(n["id"]): int(n.get("pages", 0)) for n in STATE["wiki"]["notebooks"]}
    for s in meta.get("sources") or []:
        if not isinstance(s, dict) or "nb" not in s or "pages" not in s:
            log.warning(f"{src}: each source should look like {{nb: \"10-2\", pages: \"11-14\"}}")
            continue
        nb = str(s["nb"])
        if nb not in nbs:
            log.warning(f"{src}: source notebook {nb!r} is not in data/notebooks.yml")
            continue
        try:
            pages = parse_pages(s["pages"])
        except ValueError:
            log.warning(f"{src}: can't read pages {s['pages']!r}")
            continue
        bad = [p for p in pages if p < 1 or p > nbs[nb]]
        if bad:
            log.warning(f"{src}: notebook {nb} has {nbs[nb]} pages, but sources cite {bad}")
    if not FORMULA_RE.search(markdown) and str(meta.get("formulas", "")).lower() != "none":
        log.warning(f"{src}: no `!!! formula \"…\"` blocks. Put every equation/constant in a formula "
                    f"block (they feed the Formulas page), or add `formulas: none` to the front matter.")


def on_page_markdown(markdown, page, config, files):
    STATE["current"] = page.file.src_uri
    _validate(page, markdown)

    def repl(m):
        name, args = m.group("name"), _args(m.group("args"))
        fn = MARKERS.get(name)
        if not fn:
            log.warning(f"{page.file.src_uri}: unknown marker wiki:{name}")
            return m.group(0)
        return fn(page, args)

    markdown = MARKER_RE.sub(repl, markdown)
    markdown = normalize_markdown(markdown)

    # stats for unit topic pages
    src = page.file.src_uri
    if UNIT_DIR_RE.match(src) and not src.endswith("index.md"):
        no_fences = re.sub(r"^(`{3,}|~{3,}).*?^\1", " ", markdown, flags=re.S | re.M)
        words = len(re.findall(r"[A-Za-z][A-Za-z'’\-]*", re.sub(r"<[^>]+>", " ", no_fences)))
        kinds = [k for _, k in FENCE_RE.findall(markdown)]
        STATE["page_stats"][src] = {
            "words": words,
            "diagrams": len(kinds),
            "rice": kinds.count("rice"),
            "formulas": len(FORMULA_RE.findall(markdown)),
        }
    return markdown


def on_page_content(html_text, page, config, files):
    src = page.file.src_uri
    ids = STATE["page_ids"].get(src)
    if ids:
        it = iter(ids)

        def add_id(m):
            try:
                return f'{m.group(1)}id="{next(it)}" {m.group(2)}'
            except StopIteration:
                return m.group(0)

        html_text = re.sub(r'(<(?:div|details) )(class="(?:admonition )?formula[ "])', add_id, html_text)
        # tell MkDocs these anchors exist (so its link checker doesn't flag links to them)
        present = getattr(page, "present_anchor_ids", None)
        if isinstance(present, set):
            present.update(ids)
    # list items written as "- → text" / "- ↳ text": the arrow replaces the bullet
    html_text = re.sub(r"<li>(\s*(?:<p>)?\s*[→↳⇒])", r'<li class="arrow-li">\1', html_text)
    chips = _source_chips(page)
    return chips + html_text


def _source_chips(page) -> str:
    meta = page.meta or {}
    sources = meta.get("sources") or []
    if not sources:
        return ""
    base = url_from(page, "assets/scans/")
    chips = []
    for s in sources:
        if not isinstance(s, dict) or "nb" not in s:
            continue
        try:
            pages = parse_pages(s.get("pages", ""))
        except ValueError:
            continue
        chips.append(
            f'<button type="button" class="source-chip" data-nb="{esc(s["nb"])}" data-pages="{",".join(map(str, pages))}"'
            f' data-base="{esc(base)}" title="View the original notebook pages">'
            f'<span class="sc-icon" aria-hidden="true"></span>Notebook {esc(s["nb"])} · {fmt_pages(pages)}</button>')
    dates = meta.get("dates") or []
    dates_html = ""
    if dates:
        ds = [str(d) for d in (dates if isinstance(dates, list) else [dates])]
        dates_html = f'<span class="ps-dates">{esc(ds[0])}{" – " + esc(ds[-1]) if len(ds) > 1 else ""}</span>'
    return (f'<div class="page-sources"><span class="ps-label">From my notes</span>{"".join(chips)}'
            f'{dates_html}</div>')


def on_page_context(context, page, config, nav):
    if not STATE["stats_done"]:
        _finish_stats(config)
    return context


def _git_date():
    try:
        out = subprocess.run(["git", "log", "-1", "--format=%cs"], cwd=ROOT, capture_output=True,
                             text=True, timeout=5)
        if out.returncode == 0 and out.stdout.strip():
            return out.stdout.strip()
    except Exception:
        pass
    return dt.date.today().isoformat()


def _topic_pages():
    """[(src, meta)] for unit topic pages, in nav order."""
    pages = [(src, meta) for src, meta in STATE["page_meta"].items()
             if UNIT_DIR_RE.match(src) and not src.endswith("index.md")]
    pages.sort(key=lambda x: STATE["nav_order"].get(x[0], 10_000))
    return pages


def _finish_stats(config):
    ps = STATE["page_stats"]
    topics = _topic_pages()
    words = sum(s["words"] for s in ps.values())
    units = {}
    for src, meta in topics:
        units.setdefault(int(meta.get("unit", 0) or 0), []).append(src)
    recent = []
    for src, meta in topics:
        ds = meta.get("dates") or []
        ds = ds if isinstance(ds, list) else [ds]
        last = max((d for d in (parse_date(x) for x in ds) if d), default=None)
        recent.append({"title": meta.get("title", src), "url": STATE["file_urls"].get(src, ""),
                       "unit": meta.get("unit"), "date": last.isoformat() if last else "",
                       "date_label": f"{last.month}/{last.day}/{last:%y}" if last else ""})
    recent.sort(key=lambda r: r["date"], reverse=True)
    stats = {
        "topic_pages": len(topics),
        "words": words,
        "diagrams": sum(s["diagrams"] for s in ps.values()),
        "rice_tables": sum(s["rice"] for s in ps.values()),
        "formulas": sum(len(v) for v in STATE["formulas"].values()),
        "notebook_pages": sum(int(n.get("pages", 0)) for n in STATE["wiki"]["notebooks"]),
        "notebooks": len(STATE["wiki"]["notebooks"]),
        "units_covered": len([u for u in units if u]),
        "units_total": len(STATE["wiki"]["schedule"].get("units", [])),
        "reading_minutes": max(1, round(words / 200)),
        "last_updated": _git_date(),
        "unit_pages": {str(k): len(v) for k, v in units.items()},
        "recent": recent[:6],
        "quotes": len(STATE["wiki"]["quotes"]),
    }
    config.extra["wiki_stats"] = stats
    STATE["stats_done"] = True


# ─── search index clean-up ──────────────────────────────────────────────────
_TEX_SIMPLE = {
    "\\cdot": "·", "\\times": "×", "\\Delta": "Δ", "\\rightleftharpoons": "⇌", "\\rightarrow": "→",
    "\\longrightarrow": "→", "\\Longrightarrow": "⇒", "\\to": "→", "\\leftarrow": "←", "\\therefore": "∴",
    "\\propto": "∝", "\\%": "%", "\\#": "#", "\\Sigma": "Σ", "\\sum": "Σ", "\\checkmark": "✓",
    "\\geq": "≥", "\\leq": "≤", "\\neq": "≠", "\\approx": "≈", "\\circ": "°", "\\degree": "°",
    "\\,": " ", "\\;": " ", "\\quad": " ", "\\qquad": " ", "\\ ": " ", "\\left": "", "\\right": "",
}


def _tex_math_to_plain(t: str) -> str:
    t = re.sub(r"\\ce\{((?:[^{}]|\{[^{}]*\})*)\}", r"\1", t)
    t = re.sub(r"\\(?:text|mathrm|mathbf|textbf|operatorname|boxed|cancel|underbrace)\{([^{}]*)\}", r"\1", t)
    t = re.sub(r"\\d?frac\{([^{}]*)\}\{([^{}]*)\}", r"(\1)/(\2)", t)
    for k in sorted(_TEX_SIMPLE, key=len, reverse=True):
        t = t.replace(k, _TEX_SIMPLE[k])
    t = re.sub(r"\\[a-zA-Z]+", "", t)
    t = t.replace("{", "").replace("}", "").replace("_", "")
    t = re.sub(r"\^(?=\S)", "", t)
    for a, b in (("&lt;=&gt;", "⇌"), ("<=>", "⇌"), ("-&gt;", "→"), ("->", "→"), ("&lt;-", "←")):
        t = t.replace(a, b)
    return re.sub(r"\s{2,}", " ", t).strip()


def tex_to_plain(s: str) -> str:
    """Turn \\( … \\) / \\[ … \\] math in search-index text into readable plain text."""
    s = re.sub(r"\\\((.*?)\\\)", lambda m: _tex_math_to_plain(m.group(1)), s, flags=re.S)
    s = re.sub(r"\\\[(.*?)\\\]", lambda m: _tex_math_to_plain(m.group(1)), s, flags=re.S)
    return s


def on_post_build(config):
    """Make search results readable: replace raw TeX in the search index with plain text
    (still matches searches like "H2SO4")."""
    import json
    idx_path = Path(config.site_dir) / "search" / "search_index.json"
    if not idx_path.exists():
        return
    try:
        data = json.loads(idx_path.read_text(encoding="utf-8"))
        for doc in data.get("docs", []):
            for key in ("title", "text"):
                if isinstance(doc.get(key), str) and "\\" in doc[key]:
                    doc[key] = tex_to_plain(doc[key])
        idx_path.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
    except Exception as e:  # never break the build over search cosmetics
        log.info(f"search index clean-up skipped: {e}")


# ─── marker renderers (return Markdown) ─────────────────────────────────────
def m_formulas(page, args):
    out = []
    all_items = []  # (title, anchor)
    groups = []
    used = set()
    for u in STATE["wiki"]["schedule"].get("units", []):
        n = int(u["number"])
        pages = [(src, meta) for src, meta in _topic_pages() if int(meta.get("unit", 0) or 0) == n
                 and src in STATE["formulas"]]
        if not pages:
            continue
        groups.append((u, pages))
    for u, pages in groups:
        out.append(f'## Unit {u["number"]} · {u["title"]} {{ #unit-{u["number"]} }}\n')
        for src, meta in pages:
            link = rel(src, page)
            out.append(f'<div class="formula-group" markdown>\n')
            out.append(f'### [{meta.get("title", src)}]({link})\n')
            for fm in STATE["formulas"][src]:
                anchor = "fx-" + fm["id"][2:]
                k = 2
                base = anchor
                while anchor in used:
                    anchor, k = f"{base}-{k}", k + 1
                used.add(anchor)
                all_items.append((fm["title"], anchor))
                STATE["page_ids"].setdefault(page.file.src_uri, []).append(anchor)
                extra = " memorize" if fm["memorize"] else ""
                body = "\n".join(("    " + ln) if ln else "" for ln in fm["body"].split("\n"))
                out.append(f'!!! formula{extra} "{fm["title"]}"\n{body}\n\n'
                           f'    [:material-arrow-top-right: In my notes]({link}#{fm["id"]}){{ .formula-src }}\n')
            out.append("</div>\n")
    if not groups:
        return '!!! note "No formulas yet"\n    Formulas from the notes pages will appear here automatically.\n'
    # A–Z index
    items = sorted(all_items, key=lambda x: re.sub(r"[^a-z0-9]", "", html.unescape(x[0]).lower()) or x[0])
    idx = ['<div class="az-index">']
    letter = None
    for title, anchor in items:
        first = (re.sub(r"[^A-Za-z]", "", title)[:1] or "#").upper()
        if first != letter:
            if letter is not None:
                idx.append("</div>")
            idx.append(f'<div class="az-group"><span class="az-letter">{esc(first)}</span>')
            letter = first
        idx.append(f'<a href="#{anchor}">{esc(title)}</a>')
    idx.append("</div></div>")
    head = ('<div class="formula-tools"><input type="search" class="formula-filter" '
            'placeholder="Filter formulas… (e.g. Kp, molarity, q)" aria-label="Filter formulas"></div>\n\n'
            '<details class="az-details"><summary>A–Z index of formula names</summary>'
            + "".join(idx) + "</details>\n")
    return head + "\n" + "\n".join(out)


def m_quotes(page, args):
    cats = [("quote", "Ms. Boppana's Quotes"), ("saying", "Classroom Sayings"), ("mnemonic", "Mnemonics")]
    out = []
    for cat, title in cats:
        qs = [q for q in STATE["wiki"]["quotes"] if q.get("category", "quote") == cat]
        if not qs:
            continue
        out.append(f"## {title}\n")
        for q in qs:
            src = q.get("source") or {}
            where = ""
            if src.get("nb") and src.get("page"):
                scan = rel(f"scans/{src['nb']}.md", page)
                where = f" · [Notebook {src['nb']} p. {src['page']}]({scan}#p{int(src['page']):02d})"
            ctx = f"<br><small>{esc(q['context'])}</small>" if q.get("context") else ""
            out.append(f'<blockquote class="teacher-quote" markdown>\n<p class="tq-text">“{esc(q["text"])}”</p>\n'
                       f'<p class="tq-who">— {esc(q.get("who", "Ms. Boppana"))}{where}{ctx}</p>\n</blockquote>\n')
    return "\n".join(out)


def _unit_status(u):
    today = dt.date.today()
    s, e = parse_date(u["start"]), parse_date(u["end"])
    ex = parse_date((u.get("exam") or {}).get("date", u["end"]))
    if s and today < s:
        return "upcoming"
    if ex and today > ex:
        return "done"
    return "current"


def m_units(page, args):
    stats_pages = {}
    for src, meta in _topic_pages():
        stats_pages.setdefault(int(meta.get("unit", 0) or 0), 0)
        stats_pages[int(meta.get("unit", 0) or 0)] += 1
    out = ['<div class="grid cards unit-cards" markdown>\n']
    for u in STATE["wiki"]["schedule"].get("units", []):
        n = int(u["number"])
        link = rel(f"units/{u['slug']}/index.md", page)
        cnt = stats_pages.get(n, 0)
        status = _unit_status(u)
        badge = {"current": "Now", "done": "Done", "upcoming": "Upcoming"}[status]
        pages_txt = f"{cnt} page{'s' if cnt != 1 else ''} of notes" if cnt else "No notes yet"
        out.append(f'-   **[Unit {n} · {u["title"]}]({link})** <span class="unit-badge unit-{status}">{badge}</span>\n\n'
                   f'    ---\n\n    {nice_date(u["start"])} – {nice_date(u["end"])} · {pages_txt}\n')
    out.append("</div>\n")
    return "\n".join(out)


def m_unit_header(page, args):
    u = unit_by_number(args.get("unit", 0))
    if not u:
        return ""
    ex = u.get("exam") or {}
    parts = [f'<span class="uh-chip">:material-calendar-range: {nice_date(u["start"])} – {nice_date(u["end"])}</span>']
    if ex:
        parts.append(f'<span class="uh-chip uh-exam">:material-file-document-edit-outline: {esc(ex.get("title", "Exam"))} · '
                     f'{nice_date(ex.get("date"))}</span>')
    return '<div class="unit-header" markdown>\n' + " ".join(parts) + "\n</div>\n"


def m_unit_pages(page, args):
    n = int(args.get("unit", 0))
    pages = [(src, meta) for src, meta in _topic_pages() if int(meta.get("unit", 0) or 0) == n]
    if not pages:
        return ('!!! info "No notes yet"\n    Notes for this unit haven\'t been added yet. '
                "When they are, their pages will show up here automatically.\n")
    out = ['<div class="grid cards topic-cards" markdown>\n']
    for src, meta in pages:
        desc = meta.get("description", "")
        srcs = ", ".join(f"{s.get('nb')} {fmt_pages(parse_pages(s.get('pages', '')))}"
                         for s in (meta.get("sources") or []) if isinstance(s, dict))
        out.append(f'-   **[{meta.get("title", src)}]({rel(src, page)})**\n\n    ---\n\n    {desc}\n\n'
                   f'    <small>:material-notebook-outline: {esc(srcs)}</small>\n')
    out.append("</div>\n")
    return "\n".join(out)


def m_syllabus(page, args):
    u = unit_by_number(args.get("unit", 0))
    if not u:
        return ""
    lines = [f'???+ syllabus "From the syllabus — Unit {u["number"]}: {u["title"]}"']
    for r in u.get("reading") or []:
        lines.append(f"    :material-book-open-variant: **{r}**\n")
    for ch in u.get("chapters") or []:
        lines.append(f"    **{ch['title']}**\n")
        lines.append("    | § | Section | Notes |")
        lines.append("    |---|---|---|")
        for s in ch.get("sections") or []:
            note = str(s.get("note", "")).replace("|", "\\|")
            lines.append(f"    | {s.get('n', '')} | {s.get('title', '')} | {note} |")
        lines.append("")
    ex = u.get("exam") or {}
    if ex:
        lines.append(f"    :material-file-document-edit-outline: **{ex.get('title')}** — {nice_date(ex.get('date'))}"
                     f" (covers {ex.get('covers', '')})")
    return "\n".join(lines) + "\n"


def _mdi(name: str) -> str:
    """Inline SVG of a Material Design icon bundled with mkdocs-material ('' if missing)."""
    try:
        import material
        p = Path(material.__file__).parent / "templates" / ".icons" / "material" / f"{name}.svg"
        return p.read_text(encoding="utf-8")
    except Exception:
        return ""


def m_resources(page, args):
    out = ['<div class="resource-grid">']
    for r in STATE["wiki"]["resources"]:
        href = url_from(page, f"assets/resources/{r['file']}")
        icon = _mdi(r.get("icon") or "file-pdf-box") or _mdi("file-pdf-box")
        out.append(
            f'<div class="resource-card" data-tilt><div class="rc-icon">{icon}</div><div class="rc-title">{esc(r["title"])}</div>'
            f'<div class="rc-desc">{esc(r.get("description", ""))}</div><div class="rc-actions">'
            f'<button type="button" class="md-button rc-preview" data-pdf="{esc(href)}" data-title="{esc(r["title"])}">Preview</button>'
            f'<a class="md-button md-button--primary" href="{esc(href)}" download>Download</a></div></div>')
    out.append("</div>")
    return "".join(out) + "\n"


def m_notebooks(page, args):
    out = ['<div class="grid cards" markdown>\n']
    for n in STATE["wiki"]["notebooks"]:
        link = rel(f"scans/{n['id']}.md", page)
        thumb = url_from(page, f"assets/scans/{n['id']}/thumb/p01.webp")
        out.append(f'-   <img class="nb-cover" src="{thumb}" alt="" loading="lazy">\n\n'
                   f'    **[{n.get("title", n["id"])}]({link})**\n\n'
                   f'    {n.get("pages")} pages · {n.get("dates", "")}\n')
    out.append("</div>\n")
    return "\n".join(out)


def m_scans(page, args):
    nb = str(args.get("nb", ""))
    info = next((n for n in STATE["wiki"]["notebooks"] if str(n["id"]) == nb), None)
    if not info:
        log.warning(f"{page.file.src_uri}: wiki:scans — unknown notebook {nb!r}")
        return ""
    base = url_from(page, f"assets/scans/{nb}/")
    tiles = []
    for p in range(1, int(info.get("pages", 0)) + 1):
        used = STATE["citations"].get((nb, p), [])
        links = "".join(
            f'<a href="{esc(url_from(page, STATE["file_urls"].get(src, "")))}">'
            f'{esc(STATE["page_meta"].get(src, {}).get("title", src))}</a>' for src in used)
        tiles.append(
            f'<figure class="scan-tile" id="p{p:02d}">'
            f'<button type="button" class="scan-open" data-nb="{esc(nb)}" data-pages="{p}" data-base="{esc(url_from(page, "assets/scans/"))}">'
            f'<img src="{base}thumb/p{p:02d}.webp" alt="Notebook {esc(nb)} page {p}" loading="lazy"></button>'
            f'<figcaption><span class="st-num">p. {p}</span>{links}</figcaption></figure>')
    return f'<div class="scan-grid">{"".join(tiles)}</div>\n'


MARKERS = {
    "formulas": m_formulas,
    "quotes": m_quotes,
    "units": m_units,
    "unit-header": m_unit_header,
    "unit-pages": m_unit_pages,
    "syllabus": m_syllabus,
    "resources": m_resources,
    "notebooks": m_notebooks,
    "scans": m_scans,
}
