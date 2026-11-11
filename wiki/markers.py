"""`<!-- wiki:NAME arg=value -->` markers, expanded before Markdown conversion.

Each function returns Markdown (or raw HTML blocks) that replaces the marker line.
  formulas                 every formula box from docs/units/**, grouped by unit → page
  quotes                   all quotes from data/quotes.yml
  units                    cards for all units (data/schedule.yml)
  unit-header unit=N       date / exam chips for a unit
  unit-pages unit=N        cards for the topic pages of a unit
  syllabus unit=N          syllabus outline for a unit
  resources                PDF cards with Preview / Download
  notebooks                cards for the scanned notebooks
  scans nb=ID              thumbnail gallery of one notebook
  tags                     every tag with the pages that use it
"""
from __future__ import annotations

import datetime as dt
import html
import re

from .util import esc, fmt_pages, icon, nice_date, parse_date, parse_pages, relurl, slugify


def _block(h: str) -> str:
    """Wrap raw HTML so Python-Markdown treats it as a block."""
    return "\n\n" + h.strip() + "\n\n"


def m_formulas(site, page, args):
    out, all_items, used = [], [], set()
    page.formula_ids = []
    groups = []
    for u in site.data["schedule"].get("units", []):
        n = int(u["number"])
        pages = [p for p in site.topic_pages() if int(p.meta.get("unit", 0) or 0) == n and p.src in site.formulas]
        if pages:
            groups.append((u, pages))
    for u, pages in groups:
        out.append(f'## Unit {u["number"]} · {u["title"]} {{ #unit-{u["number"]} }}\n')
        for p in pages:
            link = site.page_rel(page, p.src)
            out.append('<div class="formula-group" markdown>\n')
            out.append(f"### [{p.title}]({link})\n")
            for fm in site.formulas[p.src]:
                anchor = base = "fx-" + fm["id"][2:]
                k = 2
                while anchor in used:
                    anchor, k = f"{base}-{k}", k + 1
                used.add(anchor)
                all_items.append((fm["title"], anchor))
                page.formula_ids.append(anchor)
                extra = " memorize" if fm["memorize"] else ""
                body = "\n".join(("    " + ln) if ln else "" for ln in fm["body"].split("\n"))
                out.append(f'!!! formula{extra} "{fm["title"]}"\n{body}\n\n'
                           f'    [{icon("arrow-top-right")} In my notes]({link}#{fm["id"]}){{ .formula-src }}\n')
            out.append("</div>\n")
    if not groups:
        return '!!! note "No formulas yet"\n    Formulas from the notes pages will appear here automatically.\n'
    items = sorted(all_items, key=lambda x: re.sub(r"[^a-z0-9]", "", html.unescape(x[0]).lower()) or x[0])
    idx, letter = ['<div class="az-index">'], None
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
            'placeholder="Filter formulas… (e.g. Kp, molarity, q)" aria-label="Filter formulas"></div>'
            '<details class="az-details"><summary>A–Z index of formula names</summary>' + "".join(idx) + "</details>")
    return _block(head) + "\n".join(out)


QUOTE_CATS = [  # (category, filter label, section heading, anchor, one-line intro)
    ("quote", "Ms. Boppana", "Ms. Boppana's quotes", "quotes-boppana", "Things she said in class."),
    ("saying", "Sayings", "Classroom sayings", "quotes-sayings", "Lines from class worth remembering for the AP exam."),
    ("mnemonic", "Mnemonics", "Mnemonics", "quotes-mnemonics", "Memory tricks. The highlighted letters are the first letters of the list."),
]


def _mnemonic_html(text: str) -> str:
    """Highlight the first letter of each word: "No Smoking Pot" → N·S·P."""
    return re.sub(r"(?<![\w⁻])([A-Za-z])", r'<span class="mn-l">\1</span>', esc(text))


def _quote_card(site, page, q) -> str:
    cat = q.get("category", "quote")
    text = _mnemonic_html(q["text"]) if cat == "mnemonic" else esc(q["text"])
    who = q.get("who") or ("Ms. Boppana" if cat == "quote" else "From class")
    foot = [f'<span class="qcard-who">{esc(who)}</span>']
    if q.get("context"):
        foot.append(f'<span class="qcard-ctx">{esc(q["context"])}</span>')
    links = []
    src = q.get("source") or {}
    if src.get("nb") and src.get("page"):
        nb, pg = str(src["nb"]), int(src["page"])
        links.append(f'<button type="button" class="source-chip" data-nb="{esc(nb)}" data-pages="{pg}" '
                     f'data-base="{esc(relurl(page.url, "assets/scans/"))}" data-title="{esc(site.nb_title(nb))}" '
                     f'title="See it in my notes">{icon("notebook-outline")}<span>{esc(site.nb_title(nb))} · p. {pg}</span></button>')
        topics = [site.pages[s] for s in dict.fromkeys(site.citations.get((nb, pg), [])) if s in site.pages and site.pages[s].is_topic]
        for t in topics[:2]:
            links.append(f'<a class="qcard-topic wiki-link" href="{esc(relurl(page.url, t.url))}">{icon("arrow-top-right")}{esc(t.title)}</a>')
    if links:
        foot.append(f'<span class="qcard-links">{"".join(links)}</span>')
    return (f'<figure class="qcard qcard-{esc(cat)}" id="{esc(q["id"])}" data-qcat="{esc(cat)}">'
            f'<span class="qcard-mark" aria-hidden="true">“</span>'
            f'<blockquote class="qcard-text">{text}</blockquote>'
            f'<figcaption class="qcard-foot">{"".join(foot)}</figcaption></figure>')


def m_quotes(site, page, args):
    quotes = site.data["quotes"]
    if not quotes:
        return "No quotes yet. Add them to `data/quotes.yml`.\n"
    counts = {c: sum(1 for q in quotes if q.get("category", "quote") == c) for c, *_ in QUOTE_CATS}
    first = quotes[0]
    spotlight = (
        '<section class="quote-spotlight" id="quote-spotlight" aria-live="polite">'
        '<div class="qs-kicker" id="qs-kicker">Quote of the day</div>'
        f'<blockquote class="qs-text" id="qs-text">{esc(first["text"])}</blockquote>'
        '<div class="qs-foot">'
        f'<div class="qs-who" id="qs-who">— {esc(first.get("who", "Ms. Boppana"))}</div>'
        '<div class="qs-actions">'
        f'<a class="btn" id="qs-find" href="#{esc(first["id"])}">{icon("arrow-down")}Find it below</a>'
        f'<button type="button" class="btn btn-primary" id="qs-shuffle">{icon("refresh")}Another</button>'
        '</div></div></section>')
    chips = [f'<button type="button" class="qt-chip" data-qfilter="all" aria-pressed="true">All <span>{len(quotes)}</span></button>']
    chips += [f'<button type="button" class="qt-chip" data-qfilter="{c}" aria-pressed="false">{esc(label)} <span>{counts[c]}</span></button>'
              for c, label, *_ in QUOTE_CATS if counts[c]]
    tools = (f'<div class="quote-tools"><div class="qt-filters" role="group" aria-label="Show">{"".join(chips)}</div>'
             f'<label class="qt-search">{icon("magnify")}<input type="search" id="qt-search" placeholder="Search quotes…" '
             'aria-label="Search quotes" autocomplete="off"></label></div>'
             '<p class="qt-empty" id="qt-empty" hidden>No quotes match that.</p>')
    out = [_block(spotlight + tools)]
    for cat, _label, heading, anchor, intro in QUOTE_CATS:
        qs = [q for q in quotes if q.get("category", "quote") == cat]
        if not qs:
            continue
        out.append(f"\n## {heading} {{ #{anchor} }}\n")
        cards = "".join(_quote_card(site, page, q) for q in qs)
        out.append(_block(f'<div class="quote-group" data-qcat="{cat}"><p class="qg-intro">{esc(intro)}</p>'
                          f'<div class="quote-grid">{cards}</div></div>'))
    return "\n".join(out)


def _unit_status(u):
    today = dt.date.today()
    s = parse_date(u["start"])
    ex = parse_date((u.get("exam") or {}).get("date", u["end"]))
    if s and today < s:
        return "upcoming"
    if ex and today > ex:
        return "done"
    return "current"


def m_units(site, page, args):
    counts = {}
    for p in site.topic_pages():
        counts[int(p.meta.get("unit", 0) or 0)] = counts.get(int(p.meta.get("unit", 0) or 0), 0) + 1
    cards = []
    for u in site.data["schedule"].get("units", []):
        n = int(u["number"])
        status = _unit_status(u)
        badge = {"current": "Now", "done": "Done", "upcoming": "Upcoming"}[status]
        cnt = counts.get(n, 0)
        pages_txt = f"{cnt} page{'s' if cnt != 1 else ''} of notes" if cnt else "No notes yet"
        href = relurl(page.url, f"units/{u['slug']}/")
        cards.append(f'<a class="card unit-card unit-{status}" href="{esc(href)}"><span class="card-num">{n}</span>'
                     f'<span class="card-body"><span class="card-title">{esc(u["title"])} '
                     f'<span class="unit-badge unit-{status}">{badge}</span></span>'
                     f'<span class="card-meta">{nice_date(u["start"])} – {nice_date(u["end"])} · {pages_txt}</span></span></a>')
    return _block(f'<div class="card-grid">{"".join(cards)}</div>')


def m_unit_header(site, page, args):
    u = site.unit_by_number(args.get("unit", 0))
    if not u:
        return ""
    ex = u.get("exam") or {}
    parts = [f'<span class="uh-chip">{icon("calendar-range")} {nice_date(u["start"])} – {nice_date(u["end"])}</span>']
    if ex:
        parts.append(f'<span class="uh-chip uh-exam">{icon("file-document-edit-outline")} {esc(ex.get("title", "Exam"))} · '
                     f'{nice_date(ex.get("date"))}</span>')
    return _block(f'<div class="unit-header">{"".join(parts)}</div>')


def m_unit_pages(site, page, args):
    n = int(args.get("unit", 0))
    pages = [p for p in site.topic_pages() if int(p.meta.get("unit", 0) or 0) == n]
    if not pages:
        return ('!!! info "No notes yet"\n    Notes for this unit haven\'t been added yet. '
                "When they are, their pages will show up here automatically.\n")
    cards = []
    for p in pages:
        srcs = ", ".join(f"{site.nb_title(s.get('nb'))} {fmt_pages(parse_pages(s.get('pages', '')))}"
                         for s in (p.meta.get("sources") or []) if isinstance(s, dict))
        cards.append(f'<a class="card topic-card" href="{esc(relurl(page.url, p.url))}">'
                     f'<span class="card-title">{esc(p.title)}</span>'
                     f'<span class="card-desc">{esc(p.meta.get("description", ""))}</span>'
                     f'<span class="card-meta">{icon("notebook-outline")} {esc(srcs)}</span></a>')
    return _block(f'<div class="card-grid topic-grid">{"".join(cards)}</div>')


def m_syllabus(site, page, args):
    u = site.unit_by_number(args.get("unit", 0))
    if not u:
        return ""
    lines = [f'???+ syllabus "From the syllabus — Unit {u["number"]}: {u["title"]}"']
    for r in u.get("reading") or []:
        lines.append(f"    {icon('book-open-variant')} **{r}**\n")
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
        lines.append(f"    {icon('file-document-edit-outline')} **{ex.get('title')}** — {nice_date(ex.get('date'))}"
                     f" (covers {ex.get('covers', '')})")
    return "\n".join(lines) + "\n"


def m_resources(site, page, args):
    cards = []
    for r in site.data["resources"]:
        href = relurl(page.url, f"assets/resources/{r['file']}")
        ic = icon(r.get("icon") or "file-pdf-box") or icon("file-pdf-box")
        cards.append(
            f'<div class="resource-card" data-tilt><div class="rc-icon">{ic}</div><div class="rc-title">{esc(r["title"])}</div>'
            f'<div class="rc-desc">{esc(r.get("description", ""))}</div><div class="rc-actions">'
            f'<button type="button" class="btn rc-preview" data-pdf="{esc(href)}" data-title="{esc(r["title"])}">{icon("eye-outline")} Preview</button>'
            f'<a class="btn btn-primary" href="{esc(href)}" download>{icon("download")} Download</a></div></div>')
    return _block(f'<div class="resource-grid">{"".join(cards)}</div>')


def m_notebooks(site, page, args):
    cards = []
    for n in site.data["notebooks"]:
        href = relurl(page.url, f"scans/{n['id']}/")
        thumb = relurl(page.url, f"assets/scans/{n['id']}/thumb/p01.webp")
        cards.append(f'<a class="card nb-card" href="{esc(href)}"><img class="nb-cover" src="{esc(thumb)}" alt="" loading="lazy">'
                     f'<span class="card-title">{esc(n.get("title", n["id"]))}</span>'
                     f'<span class="card-meta">{n.get("pages")} pages · {esc(n.get("dates", ""))}</span></a>')
    return _block(f'<div class="card-grid">{"".join(cards)}</div>')


def m_scans(site, page, args):
    nb = str(args.get("nb", ""))
    info = next((n for n in site.data["notebooks"] if str(n["id"]) == nb), None)
    if not info:
        site.warn(f"{page.src}: wiki:scans — unknown notebook {nb!r}")
        return ""
    base = relurl(page.url, f"assets/scans/{nb}/")
    scans_base = relurl(page.url, "assets/scans/")
    title = site.nb_title(nb)
    tiles = []
    for p in range(1, int(info.get("pages", 0)) + 1):
        used = site.citations.get((nb, p), [])
        links = "".join(f'<a href="{esc(relurl(page.url, site.pages[s].url))}">{esc(site.pages[s].title)}</a>'
                        for s in used if s in site.pages)
        tiles.append(
            f'<figure class="scan-tile" id="p{p:02d}">'
            f'<button type="button" class="scan-open" data-nb="{esc(nb)}" data-title="{esc(title)}" data-pages="{p}" data-base="{esc(scans_base)}">'
            f'<img src="{base}thumb/p{p:02d}.webp" alt="{esc(title)} page {p}" loading="lazy"></button>'
            f'<figcaption><span class="st-num">p. {p}</span>{links}</figcaption></figure>')
    return _block(f'<div class="scan-grid">{"".join(tiles)}</div>')


def m_tags(site, page, args):
    tags = {}
    for p in sorted(site.pages.values(), key=lambda q: q.nav_index):
        for t in p.meta.get("tags") or []:
            tags.setdefault(str(t), []).append(p)
    if not tags:
        return "No tags yet.\n"
    cloud = "".join(f'<a class="tag-chip" href="#tag-{slugify(t)}">{esc(t)} <span>{len(ps)}</span></a>'
                    for t, ps in sorted(tags.items(), key=lambda kv: kv[0].lower()))
    out = [_block(f'<div class="tag-cloud">{cloud}</div>')]
    for t, ps in sorted(tags.items(), key=lambda kv: kv[0].lower()):
        items = "".join(f'<li><a href="{esc(relurl(page.url, p.url))}">{esc(p.title)}</a></li>' for p in ps)
        out.append(_block(f'<section class="tag-section" id="tag-{slugify(t)}"><h3>{icon("tag-outline")} {esc(t)}</h3><ul>{items}</ul></section>'))
    return "".join(out)


MARKERS = {
    "formulas": m_formulas, "quotes": m_quotes, "units": m_units, "unit-header": m_unit_header,
    "unit-pages": m_unit_pages, "syllabus": m_syllabus, "resources": m_resources,
    "notebooks": m_notebooks, "scans": m_scans, "tags": m_tags,
}
