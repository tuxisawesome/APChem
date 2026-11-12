"""The wiki generator: docs/*.md → site/ (static HTML).

Build steps (Site.build):
  1. load site.yml + data/*.yml, discover docs/**/*.md, read front matter
  2. build the nav tree (site.yml → nav), breadcrumbs, prev/next
  3. scan formula boxes (Formulas page) and notebook citations (scan galleries)
  4. per page: validate front matter → expand <!-- wiki:… --> markers → normalize →
     Markdown → HTML (diagram fences, link rewriting) → post-process (formula ids)
  5. cross-page: backlinks, link/anchor validation, stats
  6. render templates (wiki/templates), copy assets, write search index + sitemap
"""
from __future__ import annotations

import json
import os
import posixpath
import re
import shutil
import subprocess
import sys
import xml.etree.ElementTree as etree
from dataclasses import dataclass, field
from pathlib import Path
from urllib.parse import urlparse

import markdown
import yaml
from jinja2 import Environment, FileSystemLoader, select_autoescape
from markdown.extensions import Extension
from markdown.treeprocessors import Treeprocessor

from . import markers
from .diagrams import KINDS, DiagramError, error_box, render_block
from .util import (ROOT, esc, fmt_pages, html_to_text, icon, parse_date, parse_pages, relurl,
                   slugify, tex_to_plain)

TEMPLATES = Path(__file__).resolve().parent / "templates"
FORMULA_RE = re.compile(
    r'^(?P<indent>[ \t]*)(?P<mark>!!!|\?\?\?\+?)[ \t]+formula(?P<extra>(?:[ \t]+[\w-]+)*)[ \t]+"(?P<title>[^"]*)"[ \t]*$',
    re.M)
MARKER_RE = re.compile(r"^[ \t]*<!--\s*wiki:(?P<name>[\w-]+)(?P<args>[^>]*?)-->[ \t]*$", re.M)
FENCE_KIND_RE = re.compile(r"^\s*(`{3,}|~{3,})\s*(" + "|".join(KINDS) + r")\b", re.M)
UNIT_DIR_RE = re.compile(r"^units/(\d{2})-[^/]+/")
TRAILING_ATTR_RE = re.compile(r"^(?P<indent>[ \t]*)(?P<text>(?![#|>]|```|~~~).*\S)[ \t]+\{:?[ \t]*(?P<attr>\.[\w-]+(?:[ \t]+\.[\w-]+)*)[ \t]*\}[ \t]*$")
DISPLAY_MATH_RE = re.compile(r"^[ \t]*\$\$.*\$\$[ \t]*$")
FENCE_LINE_RE = re.compile(r"^[ \t]*(`{3,}|~{3,})")


# ─── data model ─────────────────────────────────────────────────────────────
@dataclass
class Page:
    src: str                       # docs-relative source path, e.g. units/03-equilibrium/rice-tables.md
    path: Path
    meta: dict
    body: str                      # Markdown without the front matter
    url: str                       # site-relative URL ('' = home), e.g. units/03-equilibrium/rice-tables/
    title: str = ""
    nav_index: int = 100_000
    in_nav: bool = False
    crumbs: list = field(default_factory=list)      # [(title, url)] ancestors
    section: dict | None = None                     # parent nav node
    html: str = ""
    toc: list = field(default_factory=list)
    links: list = field(default_factory=list)       # [(target_src or None, fragment)]
    ids: set = field(default_factory=set)
    formulas: list = field(default_factory=list)
    formula_ids: list = field(default_factory=list)
    stats: dict = field(default_factory=dict)
    sections: list = field(default_factory=list)    # search: [(id, heading, text)]
    updated: str = ""
    prev: "Page | None" = None
    next: "Page | None" = None
    backlinks: list = field(default_factory=list)

    @property
    def is_topic(self) -> bool:
        return bool(UNIT_DIR_RE.match(self.src)) and not self.src.endswith("index.md")

    @property
    def unit(self) -> int | None:
        m = UNIT_DIR_RE.match(self.src)
        return int(m.group(1)) if m else None


def url_for(src: str) -> str:
    if src == "index.md":
        return ""
    if src.endswith("/index.md"):
        return src[: -len("index.md")]
    return src[:-3] + "/"


def split_front_matter(text: str) -> tuple[dict, str]:
    if text.startswith("---"):
        m = re.match(r"^---[ \t]*\n(.*?)\n---[ \t]*(\n|$)", text, re.S)
        if m:
            meta = yaml.safe_load(m.group(1)) or {}
            return (meta if isinstance(meta, dict) else {}), text[m.end():]
    return {}, text


def _dates_to_str(o):
    import datetime as dt
    if isinstance(o, dict):
        return {k: _dates_to_str(v) for k, v in o.items()}
    if isinstance(o, list):
        return [_dates_to_str(v) for v in o]
    if isinstance(o, (dt.date, dt.datetime)):
        return o.isoformat()
    return o


# ─── Markdown: link rewriting ───────────────────────────────────────────────
class _LinkRewriter(Treeprocessor):
    def __init__(self, md, site: "Site", page: Page):
        super().__init__(md)
        self.site, self.page = site, page

    def run(self, root):
        for el in root.iter():
            attr = "href" if el.tag == "a" else "src" if el.tag in ("img", "source") else None
            if not attr or not el.get(attr):
                continue
            if "headerlink" in (el.get("class") or ""):
                continue
            new, internal = self.site.resolve_link(self.page, el.get(attr))
            if new is not None:
                el.set(attr, new)
            if internal and el.tag == "a":
                el.set("class", ((el.get("class") or "") + " wiki-link").strip())


class _LinkExtension(Extension):
    def __init__(self, site, page):
        super().__init__()
        self.site, self.page = site, page

    def extendMarkdown(self, md):
        md.treeprocessors.register(_LinkRewriter(md, self.site, self.page), "wiki_links", 1)


# ─── the site ───────────────────────────────────────────────────────────────
class Site:
    def __init__(self, root: Path = ROOT, out: Path | None = None, dev: bool = False):
        self.root = root
        self.docs = root / "docs"
        self.out = out or (root / "site")
        self.dev = dev
        self.warnings: list[str] = []
        self.config = yaml.safe_load((root / "site.yml").read_text(encoding="utf-8")) or {}
        self.data = self._load_data()
        self.pages: dict[str, Page] = {}
        self.nav: list[dict] = []
        self.order: list[Page] = []
        self.formulas: dict[str, list] = {}
        self.citations: dict = {}
        self.current: Page | None = None
        self.base_path = urlparse(self.config.get("site_url", "/")).path or "/"

    # ── setup ──
    def warn(self, msg: str):
        self.warnings.append(msg)

    def _load_data(self) -> dict:
        def load(name):
            p = self.root / "data" / f"{name}.yml"
            if not p.exists():
                self.warn(f"data/{name}.yml is missing")
                return {}
            try:
                return _dates_to_str(yaml.safe_load(p.read_text(encoding="utf-8")) or {})
            except yaml.YAMLError as e:
                self.warn(f"data/{name}.yml has a YAML error: {e}")
                return {}
        sched = load("schedule")
        quotes = [q for q in load("quotes").get("quotes", []) if isinstance(q, dict) and q.get("text")]
        used = set()
        for q in quotes:  # stable anchor per quote (Quotes page cards, quote-of-the-day links)
            base = "q-" + slugify(str(q["text"]))[:48].strip("-")
            qid, k = base, 2
            while qid in used:
                qid, k = f"{base}-{k}", k + 1
            used.add(qid)
            q["id"] = qid
        return {
            "quotes": quotes,
            "greetings": load("greetings").get("greetings", {}),
            "schedule": sched,
            "resources": load("resources").get("resources", []),
            "notebooks": load("notebooks").get("notebooks", []),
        }

    def discover(self):
        for path in sorted(self.docs.rglob("*.md")):
            src = path.relative_to(self.docs).as_posix()
            text = path.read_text(encoding="utf-8")
            try:
                meta, body = split_front_matter(text)
            except yaml.YAMLError as e:
                self.warn(f"{src}: front matter YAML error: {e}")
                meta, body = {}, text
            title = meta.get("title")
            if not title:
                m = re.search(r"^#\s+(.+)$", body, re.M)
                title = m.group(1).strip() if m else path.stem.replace("-", " ").title()
            self.pages[src] = Page(src=src, path=path, meta=meta, body=body, url=url_for(src), title=str(title))

    def build_nav(self):
        order = []

        def node_for(item, crumbs):
            if isinstance(item, str):
                return page_node(None, item, crumbs)
            if isinstance(item, dict) and len(item) == 1:
                title, value = next(iter(item.items()))
                if isinstance(value, str):
                    return page_node(title, value, crumbs)
                if isinstance(value, list):
                    sec = {"kind": "section", "title": str(title), "children": [], "page": None}
                    items = list(value)
                    if items and isinstance(items[0], str) and items[0].endswith("index.md"):
                        sec["page"] = self.pages.get(items[0])
                        if sec["page"] is None:
                            self.warn(f"site.yml nav: {items[0]} not found")
                        else:
                            sec["page"].in_nav = True
                            sec["page"].crumbs = list(crumbs)
                            sec["page"].nav_index = len(order)
                            order.append(sec["page"])
                        items = items[1:]
                    sub_crumbs = crumbs + [(str(title), sec["page"].url if sec["page"] else None)]
                    for it in items:
                        child = node_for(it, sub_crumbs)
                        if child:
                            child["parent"] = sec
                            sec["children"].append(child)
                    return sec
            self.warn(f"site.yml nav: can't read entry {item!r}")
            return None

        def page_node(title, src, crumbs):
            p = self.pages.get(src)
            if p is None:
                self.warn(f"site.yml nav: {src} not found in docs/")
                return None
            p.in_nav = True
            p.crumbs = list(crumbs)
            p.nav_index = len(order)
            order.append(p)
            return {"kind": "page", "title": str(title or p.title), "page": p, "children": []}

        for item in self.config.get("nav") or []:
            n = node_for(item, [])
            if n:
                self.nav.append(n)
        self.order = order
        for i, p in enumerate(order):
            p.prev = order[i - 1] if i > 0 else None
            p.next = order[i + 1] if i + 1 < len(order) else None

        def mark_parents(nodes, parent=None):
            for n in nodes:
                if n["kind"] == "page":
                    n["page"].section = parent
                elif n.get("page"):
                    n["page"].section = n
                mark_parents(n["children"], n if n["kind"] == "section" else parent)
        mark_parents(self.nav)
        for src, p in self.pages.items():
            if not p.in_nav and src not in ("404.md",) and p.meta.get("nav") is not False:
                self.warn(f"{src} is not in the nav (add it to site.yml)")

    def scan(self):
        nbs = {str(n["id"]) for n in self.data["notebooks"]}
        for src, p in self.pages.items():
            for s in p.meta.get("sources") or []:
                if isinstance(s, dict) and str(s.get("nb")) in nbs:
                    try:
                        for pg in parse_pages(s.get("pages", "")):
                            self.citations.setdefault((str(s["nb"]), pg), []).append(src)
                    except ValueError:
                        pass
            if src.startswith("units/"):
                forms = scan_formulas(p.body)
                used = set()
                for fm in forms:
                    base = "f-" + slugify(fm["title"])
                    fid, k = base, 2
                    while fid in used:
                        fid, k = f"{base}-{k}", k + 1
                    used.add(fid)
                    fm["id"] = fid
                if forms:
                    self.formulas[src] = forms
                    p.formula_ids = [fm["id"] for fm in forms]

    def git_dates(self):
        try:
            out = subprocess.run(["git", "log", "--format=@%cs", "--name-only", "--", "docs"],
                                 cwd=self.root, capture_output=True, text=True, timeout=20).stdout
        except Exception:
            out = ""
        latest, date = {}, None
        for line in out.splitlines():
            if line.startswith("@"):
                date = line[1:]
            elif line.strip() and date:
                latest.setdefault(line.strip(), date)
        for src, p in self.pages.items():
            p.updated = latest.get(f"docs/{src}", "")

    # ── links ──
    def resolve_link(self, page: Page, href: str):
        """Rewrite a link written relative to the page's .md file into a URL relative to the
        page's output URL. Returns (new_href or None, is_internal_page_link)."""
        if re.match(r"^[a-z][a-z0-9+.-]*:", href, re.I) or href.startswith(("/", "//")):
            return None, False
        if href.startswith("#"):
            page.links.append((page.src, href[1:]))
            return None, False
        path, _, frag = href.partition("#")
        path = path.split("?")[0]
        target = posixpath.normpath(posixpath.join(posixpath.dirname(page.src), path)) if path else page.src
        if target.endswith(".md"):
            tp = self.pages.get(target)
            if tp is None:
                self.warn(f"{page.src}: broken link to {href}")
                return None, False
            page.links.append((target, frag))
            new = relurl(page.url, tp.url) + (f"#{frag}" if frag else "")
            return new, True
        # static file (pdf, image…) or a directory URL
        fs = self.docs / target
        if not fs.exists():
            self.warn(f"{page.src}: link to missing file {href}")
            return None, False
        new = relurl(page.url, target + ("/" if fs.is_dir() else "")) + (f"#{frag}" if frag else "")
        return new, False

    # ── rendering ──
    def _fence(self, kind):
        def fmt(source, language, class_name, options, md, **kwargs):
            try:
                return render_block(kind, source)
            except DiagramError as e:
                self.warn(f"{self.current.src if self.current else '?'}: diagram error: {e}")
                return error_box(kind, str(e), source)
        return fmt

    def markdown_for(self, page: Page) -> markdown.Markdown:
        from pymdownx.superfences import fence_div_format
        fences = [{"name": "mermaid", "class": "mermaid", "format": fence_div_format}]
        fences += [{"name": k, "class": f"diagram-{k}", "format": self._fence(k)} for k in KINDS]
        return markdown.Markdown(
            extensions=["abbr", "admonition", "attr_list", "def_list", "footnotes", "md_in_html", "tables", "toc",
                        "pymdownx.arithmatex", "pymdownx.betterem", "pymdownx.caret", "pymdownx.mark",
                        "pymdownx.tilde", "pymdownx.details", "pymdownx.superfences", "pymdownx.snippets",
                        "pymdownx.highlight", _LinkExtension(self, page)],
            extension_configs={
                "toc": {"permalink": "#", "permalink_class": "headerlink", "permalink_title": "Link to this section"},
                "pymdownx.arithmatex": {"generic": True},
                "pymdownx.snippets": {"base_path": [str(self.root / "snippets")], "check_paths": True},
                "pymdownx.superfences": {"custom_fences": fences},
                "pymdownx.highlight": {"use_pygments": False},
            },
        )

    def render_page(self, page: Page):
        self.current = page
        self._validate(page)
        text = MARKER_RE.sub(lambda m: self._marker(page, m), page.body)
        text = normalize_markdown(text)
        if page.is_topic:
            no_fences = re.sub(r"^(`{3,}|~{3,}).*?^\1", " ", text, flags=re.S | re.M)
            words = len(re.findall(r"[A-Za-z][A-Za-z'’\-]*", re.sub(r"<[^>]+>", " ", no_fences)))
            kinds = [k for _, k in FENCE_KIND_RE.findall(text)]
            page.stats = {"words": words, "diagrams": len(kinds), "rice": kinds.count("rice"),
                          "formulas": len(FORMULA_RE.findall(text))}
        md = self.markdown_for(page)
        try:
            html = md.convert(text)
        except Exception as e:  # keep building; show the problem
            self.warn(f"{page.src}: Markdown error: {type(e).__name__}: {e}")
            html = f'<div class="diagram-error"><strong>Build error</strong><p>{esc(e)}</p></div>'
        page.toc = _toc(getattr(md, "toc_tokens", []))
        # formula ids
        if page.formula_ids:
            it = iter(page.formula_ids)

            def add_id(m):
                try:
                    return f'{m.group(1)}id="{next(it)}" {m.group(2)}'
                except StopIteration:
                    return m.group(0)
            html = re.sub(r'(<(?:div|details) )(class="(?:admonition )?formula[ "])', add_id, html)
        html = re.sub(r"<li>(\s*(?:<p>)?\s*[→↳⇒])", r'<li class="arrow-li">\1', html)
        # plain Markdown tables scroll sideways on small screens instead of overflowing
        html = re.sub(r"<table>(.*?)</table>", r'<div class="table-wrap"><table>\1</table></div>', html, flags=re.S)
        page.html = html
        page.ids = set(re.findall(r'\sid="([^"]+)"', html))
        page.sections = _search_sections(page, html)

    def _validate(self, page: Page):
        if not page.is_topic:
            return
        meta, src = page.meta, page.src
        for key in ("title", "unit", "sources"):
            if not meta.get(key):
                self.warn(f"{src}: front matter is missing `{key}` (see tools/templates/topic.md)")
        if meta.get("unit") and int(meta["unit"]) != page.unit:
            self.warn(f"{src}: `unit: {meta['unit']}` doesn't match its folder (unit {page.unit})")
        nbs = {str(n["id"]): int(n.get("pages", 0)) for n in self.data["notebooks"]}
        for s in meta.get("sources") or []:
            if not isinstance(s, dict) or "nb" not in s or "pages" not in s:
                self.warn(f'{src}: each source should look like {{nb: "1", pages: "43-46"}}')
                continue
            nb = str(s["nb"])
            if nb not in nbs:
                self.warn(f"{src}: source notebook {nb!r} is not in data/notebooks.yml")
                continue
            try:
                bad = [p for p in parse_pages(s["pages"]) if p < 1 or p > nbs[nb]]
            except ValueError:
                self.warn(f"{src}: can't read pages {s['pages']!r}")
                continue
            if bad:
                self.warn(f"{src}: notebook {nb} has {nbs[nb]} pages, but sources cite {bad}")
        if not FORMULA_RE.search(page.body) and str(meta.get("formulas", "")).lower() != "none":
            self.warn(f'{src}: no `!!! formula "…"` blocks. Put every equation/constant in a formula block '
                      f"(they feed the Formulas page), or add `formulas: none` to the front matter.")

    def _marker(self, page: Page, m):
        name = m.group("name")
        args = dict(re.findall(r"(\w+)=([\w.\-]+)", m.group("args") or ""))
        fn = markers.MARKERS.get(name)
        if not fn:
            self.warn(f"{page.src}: unknown marker wiki:{name}")
            return m.group(0)
        return fn(self, page, args)

    # ── helpers used by markers & templates ──
    def topic_pages(self) -> list[Page]:
        return sorted((p for p in self.pages.values() if p.is_topic), key=lambda p: p.nav_index)

    def unit_by_number(self, n):
        for u in self.data["schedule"].get("units", []):
            if int(u["number"]) == int(n):
                return u
        return None

    def nb_title(self, nb) -> str:
        for n in self.data["notebooks"]:
            if str(n["id"]) == str(nb):
                return str(n.get("title") or f"Notebook {nb}")
        return f"Notebook {nb}"

    def page_rel(self, page: Page, src: str) -> str:
        """Markdown-relative path from page's source file to another source file."""
        return posixpath.relpath(src, posixpath.dirname(page.src) or ".")

    # ── cross-page ──
    def link_checks(self):
        incoming: dict[str, set] = {}
        for p in self.pages.values():
            for target, frag in p.links:
                if target != p.src:
                    incoming.setdefault(target, set()).add(p.src)
                if frag and target in self.pages and frag not in self.pages[target].ids:
                    self.warn(f"{p.src}: link to {target}#{frag} — that anchor doesn't exist")
        for src, srcs in incoming.items():
            if src in self.pages:
                self.pages[src].backlinks = sorted((self.pages[s] for s in srcs), key=lambda q: q.nav_index)

    def stats(self) -> dict:
        topics = self.topic_pages()
        words = sum(p.stats.get("words", 0) for p in topics)
        units = {}
        for p in topics:
            units.setdefault(int(p.meta.get("unit", 0) or 0), []).append(p)
        recent = []
        for p in topics:
            ds = p.meta.get("dates") or []
            ds = ds if isinstance(ds, list) else [ds]
            last = max((d for d in (parse_date(x) for x in ds) if d), default=None)
            recent.append({"title": p.title, "url": p.url, "unit": p.meta.get("unit"),
                           "date": last.isoformat() if last else "",
                           "date_label": f"{last.month}/{last.day}/{last:%y}" if last else ""})
        recent.sort(key=lambda r: r["date"], reverse=True)
        dates = [p.updated for p in self.pages.values() if p.updated]
        return {
            "topic_pages": len(topics), "words": words,
            "diagrams": sum(p.stats.get("diagrams", 0) for p in topics),
            "rice_tables": sum(p.stats.get("rice", 0) for p in topics),
            "formulas": sum(len(v) for v in self.formulas.values()),
            "notebook_pages": sum(int(n.get("pages", 0)) for n in self.data["notebooks"]),
            "units_covered": len([u for u in units if u]),
            "units_total": len(self.data["schedule"].get("units", [])),
            "reading_minutes": max(1, round(words / 200)),
            "last_updated": max(dates) if dates else "",
            "unit_pages": {str(k): len(v) for k, v in units.items()},
            "recent": recent[:6],
        }

    # ── output ──
    def build(self) -> int:
        self.discover()
        self.build_nav()
        self.scan()
        self.git_dates()
        for p in sorted(self.pages.values(), key=lambda p: p.nav_index):
            self.render_page(p)
        self.link_checks()
        stats = self.stats()
        if self.out.exists():
            shutil.rmtree(self.out)
        self.out.mkdir(parents=True)
        self._copy_assets()
        from .templating import Renderer
        Renderer(self, stats).render_all()
        self._write_search_index()
        self._write_sitemap()
        (self.out / ".nojekyll").write_text("")
        from .pwa import write_all
        write_all(self)  # manifest, service worker, offline media list (after everything else exists)
        return len(self.pages)

    def _copy_assets(self):
        for path in self.docs.rglob("*"):
            if path.is_dir() or path.suffix == ".md" or path.name == ".DS_Store":
                continue
            dest = self.out / path.relative_to(self.docs)
            dest.parent.mkdir(parents=True, exist_ok=True)
            try:
                os.link(path, dest)
            except OSError:
                shutil.copy2(path, dest)

    def _write_search_index(self):
        docs = []
        for p in sorted(self.pages.values(), key=lambda p: p.nav_index):
            if p.meta.get("search") is False:
                continue
            section = " › ".join(t for t, _ in p.crumbs[1:]) if len(p.crumbs) > 1 else (p.crumbs[0][0] if p.crumbs else "")
            docs.append({"u": p.url, "t": p.title, "d": tex_to_plain(str(p.meta.get("description", ""))),
                         "s": section, "k": [str(t) for t in p.meta.get("tags") or []],
                         "h": [[i, h, t] for i, h, t in p.sections]})
        (self.out / "search-index.json").write_text(json.dumps({"pages": docs}, ensure_ascii=False), encoding="utf-8")

    def _write_sitemap(self):
        base = self.config.get("site_url", "").rstrip("/") + "/"
        urls = "".join(f"<url><loc>{esc(base + p.url)}</loc></url>" for p in self.order)
        (self.out / "sitemap.xml").write_text(
            f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{urls}</urlset>',
            encoding="utf-8")


# ─── module helpers ─────────────────────────────────────────────────────────
def scan_formulas(text: str) -> list[dict]:
    lines = text.split("\n")
    found = []
    fence = None
    for i, ln in enumerate(lines):
        fm = FENCE_LINE_RE.match(ln)
        if fm:
            mark = fm.group(1)
            if fence is None:
                fence = mark[0] * 3
            elif mark.startswith(fence):
                fence = None
            continue
        if fence:
            continue
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


def normalize_markdown(md: str) -> str:
    """Forgiving authoring: "Text {.star}" on one line → attribute list on its own line;
    single-line "$$ … $$" gets blank lines around it."""
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
            if out and out[-1].strip() and not out[-1].strip().startswith(("!!!", "???")):
                out.append("")
            out.append(ln)
            nxt = lines[i + 1] if i + 1 < len(lines) else ""
            if nxt.strip():
                out.append("")
            continue
        out.append(ln)
    return "\n".join(out)


def _toc(tokens) -> list:
    def clean(name):
        return tex_to_plain(re.sub(r"<[^>]+>", "", name)).replace("&amp;", "&")
    out = []
    for t in tokens:
        if t["level"] == 1:
            out.extend(_toc(t.get("children", [])))
            continue
        out.append({"id": t["id"], "name": clean(t["name"]), "level": t["level"],
                    "children": [{"id": c["id"], "name": clean(c["name"]), "level": c["level"]}
                                 for c in t.get("children", []) if c["level"] <= 3]})
    return out


def _search_sections(page: Page, html: str) -> list:
    parts = re.split(r'(<h[23] id="[^"]+"[^>]*>.*?</h[23]>)', html, flags=re.S)
    sections = [["", page.title, ""]]
    for part in parts:
        m = re.match(r'<h[23] id="([^"]+)"[^>]*>(.*?)</h[23]>', part, re.S)
        if m:
            sections.append([m.group(1), html_to_text(m.group(2)).rstrip("#").strip(), ""])
        else:
            sections[-1][2] += " " + html_to_text(part)
    return [(i, h, t.strip()[:4000]) for i, h, t in sections if h or t.strip()]
