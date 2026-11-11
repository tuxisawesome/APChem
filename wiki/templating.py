"""Turns built pages into HTML files using the Jinja templates in wiki/templates/."""
from __future__ import annotations

import json
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape
from markupsafe import Markup

from .util import esc, fmt_pages, icon, nice_date, parse_date, parse_pages, relurl, slugify

TEMPLATES = Path(__file__).resolve().parent / "templates"


class Renderer:
    def __init__(self, site, stats: dict):
        self.site, self.stats = site, stats
        self.env = Environment(loader=FileSystemLoader(str(TEMPLATES)), autoescape=select_autoescape(["html"]),
                               trim_blocks=True, lstrip_blocks=True)
        self.env.globals["icon"] = lambda name, cls="": Markup(icon(name, cls))
        self.env.filters["nice_date"] = nice_date
        sched = site.data["schedule"]
        public = {
            "quotes": site.data["quotes"], "greetings": site.data["greetings"], "course": sched.get("course", {}),
            "units": [{k: u.get(k) for k in ("number", "title", "short", "slug", "start", "end", "exam")}
                      for u in sched.get("units", [])],
            "events": sched.get("events", []), "default_name": site.config.get("default_name", ""),
        }
        self.public_json = Markup(json.dumps(public, ensure_ascii=False).replace("</", "<\\/"))

    # ── nav ──
    def nav_html(self, page) -> str:
        def contains(node):
            if node.get("page") is page:
                return True
            return any(contains(c) for c in node["children"])

        def render(nodes, depth):
            out = ['<ul class="nav-list">']
            for n in nodes:
                if n["kind"] == "page":
                    p = n["page"]
                    cur = ' aria-current="page"' if p is page else ""
                    out.append(f'<li class="nav-item{" is-active" if p is page else ""}"><a href="{esc(relurl(page.url, p.url))}"{cur}>'
                               f'{esc(n["title"])}</a></li>')
                    continue
                active = contains(n)
                open_ = active or (depth == 0 and n["title"] in ("Notes",)) or (depth == 0 and not n.get("page"))
                sp = n.get("page")
                label = (f'<a href="{esc(relurl(page.url, sp.url))}"{" aria-current=page" if sp is page else ""}>{esc(n["title"])}</a>'
                         if sp else f'<span>{esc(n["title"])}</span>')
                cls = "nav-section" + (" is-active" if active else "") + (" is-top" if depth == 0 else "")
                if n["children"]:
                    out.append(f'<li class="{cls}"><details{" open" if open_ else ""}><summary>{label}'
                               f'<span class="nav-chev">{icon("chevron-right")}</span></summary>'
                               f'{render(n["children"], depth + 1)}</details></li>')
                else:
                    out.append(f'<li class="{cls} is-leaf">{label}</li>')
            out.append("</ul>")
            return "".join(out)
        return render(self.site.nav, 0)

    def toc_html(self, page) -> str:
        if not page.toc:
            return ""
        out = ['<ol class="toc-list">']
        for t in page.toc:
            sub = ""
            if t["children"]:
                sub = '<ol>' + "".join(f'<li><a href="#{esc(c["id"])}">{esc(c["name"])}</a></li>' for c in t["children"]) + "</ol>"
            out.append(f'<li><a href="#{esc(t["id"])}">{esc(t["name"])}</a>{sub}</li>')
        out.append("</ol>")
        return "".join(out)

    # ── article extras ──
    def chips(self, page) -> list[dict]:
        out = []
        for s in page.meta.get("sources") or []:
            if not isinstance(s, dict) or "nb" not in s:
                continue
            try:
                pages = parse_pages(s.get("pages", ""))
            except ValueError:
                continue
            out.append({"nb": str(s["nb"]), "pages": ",".join(map(str, pages)), "title": self.site.nb_title(s["nb"]),
                        "label": f'{self.site.nb_title(s["nb"])} · {fmt_pages(pages)}',
                        "base": relurl(page.url, "assets/scans/")})
        return out

    def infobox(self, page) -> dict | None:
        meta = page.meta
        unit = self.site.unit_by_number(meta["unit"]) if meta.get("unit") else None
        chips = self.chips(page)
        if not (unit or chips):
            return None
        rows = []
        dates = meta.get("dates") or []
        dates = dates if isinstance(dates, list) else [dates]
        if dates:
            rows.append(("Class dates", esc(dates[0]) + (" – " + esc(dates[-1]) if len(dates) > 1 else "")))
        if unit and unit.get("exam"):
            ex = unit["exam"]
            rows.append(("Unit exam", f'{esc(ex.get("title", ""))}<br><small>{esc(nice_date(ex.get("date")))}</small>'))
        nf = len(self.site.formulas.get(page.src, []))
        if nf and unit:
            rows.append(("Formulas", f'<a href="{esc(relurl(page.url, "formulas/"))}#unit-{unit["number"]}">{nf} on this page</a>'))
        tags = [str(t) for t in meta.get("tags") or []]
        if page.updated:
            rows.append(("Last edited", esc(nice_date(page.updated))))
        title = f'Unit {unit["number"]} · {unit["title"]}' if unit else (page.crumbs[-1][0] if page.crumbs else page.title)
        title_url = relurl(page.url, f'units/{unit["slug"]}/') if unit else None
        return {"title": title, "title_url": title_url, "rows": [(k, Markup(v)) for k, v in rows],
                "chips": chips, "tags": [(t, relurl(page.url, "tags/") + f"#tag-{slugify(t)}") for t in tags]}

    def related(self, page) -> list:
        sec = page.section
        if not sec:
            return []
        out = []
        if sec.get("page") is not None and sec["page"] is not page:
            out.append(sec["page"])
        for c in sec["children"]:
            p = c.get("page")
            if p is not None and p is not page and c["kind"] == "page":
                out.append(p)
        return out[:12]

    # ── output ──
    def context(self, page) -> dict:
        is_home = page.meta.get("template") == "home.html"
        info = None if is_home else self.infobox(page)
        crumbs = [("Home", relurl(page.url, ""))] + [(t, relurl(page.url, u) if u is not None else None) for t, u in page.crumbs]
        hide = page.meta.get("hide") or []
        return {
            "site": self.site, "config": self.site.config, "stats": self.stats, "wiki": self.site.data,
            "page": page, "dev": self.site.dev, "public_json": self.public_json,
            "rel": lambda u: relurl(page.url, u),
            "nav_html": Markup(self.nav_html(page)),
            "toc_html": Markup(self.toc_html(page)) if "toc" not in hide else Markup(""),
            "content": Markup(page.html),
            "description": str(page.meta.get("description", "")),
            "crumbs": crumbs if page.url else [],
            "infobox": info,
            "related": [] if is_home else [(p.title, relurl(page.url, p.url), p.meta.get("description", "")) for p in self.related(page)],
            "backlinks": [(p.title, relurl(page.url, p.url)) for p in page.backlinks if p is not page],
            "prev": (page.prev.title, relurl(page.url, page.prev.url)) if page.prev else None,
            "next": (page.next.title, relurl(page.url, page.next.url)) if page.next else None,
            "has_mermaid": 'class="mermaid"' in page.html,
            "is_home": is_home,
        }

    def render_all(self):
        for page in self.site.pages.values():
            tpl = self.env.get_template(page.meta.get("template") or "page.html")
            html = tpl.render(**self.context(page))
            dest = self.site.out / page.url / "index.html" if page.url else self.site.out / "index.html"
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_text(html, encoding="utf-8")
        # 404 page: absolute URLs (it's served from any depth)
        tpl = self.env.get_template("404.html")
        base = "/" if self.site.dev else self.site.base_path
        html = tpl.render(site=self.site, config=self.site.config, base=base, public_json=self.public_json,
                          nav_html=Markup(""), dev=self.site.dev)
        (self.site.out / "404.html").write_text(html, encoding="utf-8")
