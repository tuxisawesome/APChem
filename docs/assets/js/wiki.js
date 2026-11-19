/* ──────────────────────────────────────────────────────────────────────────
   Walter's AP Chem — browser features (no framework, no build step)
   • theme (auto / light / dark)          • search (search-index.json)
   • mobile nav drawer                    • Contents highlighting
   • link previews on hover               • KaTeX + mhchem rendering
   • study-time tracker                   • home: greeting, quotes, stats, countdowns, 3D NH₃
   • PDF preview + notebook-scan lightbox • Formulas filter · Settings page
   • app: offline, updates, back/share, continue reading, text size, bottom tabs
   • saved pages + history              • focus timer (Pomodoro → study time)
   • Molar Mass Calculator              • Glossary filter
   • study tools panel (desktop): timer, calculator, bookmarks; stays put from page to page
   Data comes from <script id="wiki-data"> (built from data/*.yml by wiki/).
   Everything personal is stored ONLY in this browser (localStorage "apchem.*").
   ────────────────────────────────────────────────────────────────────────── */
(function () {
  "use strict";
  if (window.__apchem) return;
  window.__apchem = true;

  // ── basics ────────────────────────────────────────────────────────────────
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const html = document.documentElement;
  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem("apchem." + key); return v === null ? fallback : JSON.parse(v); }
      catch (e) { return fallback; }
    },
    set(key, value) { try { localStorage.setItem("apchem." + key, JSON.stringify(value)); } catch (e) { /* private mode */ } },
    del(key) { try { localStorage.removeItem("apchem." + key); } catch (e) { /* ignore */ } },
  };
  let DATA = {};
  try { DATA = JSON.parse($("#wiki-data").textContent); } catch (e) { DATA = {}; }
  const ROOT = new URL(($('meta[name="wiki-root"]') || {}).content || "./", location.href).href;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const DAY = 86400000;
  const pad = (n) => String(n).padStart(2, "0");
  const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parseISO = (s, time) => { if (!s) return null; const [y, m, d] = String(s).slice(0, 10).split("-").map(Number); const t = (time || "00:00").split(":").map(Number); return new Date(y, m - 1, d, t[0] || 0, t[1] || 0); };
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const daysBetween = (a, b) => Math.round((startOfDay(b) - startOfDay(a)) / DAY);
  const fmtDur = (sec) => { const m = Math.floor(sec / 60); if (m < 60) return `${m}m`; const h = Math.floor(m / 60); return `${h}h ${pad(m % 60)}m`; };
  const fmtDate = (d) => d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
  const prefs = () => Object.assign({ tracker: true, quoteCats: ["quote", "saying"] }, store.get("prefs", {}));
  const getName = () => (store.get("name", null) ?? DATA.default_name ?? "").trim();
  const now = () => (window.__apchemNow ? new Date(window.__apchemNow) : new Date()); // __apchemNow: testing hook
  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ICON = {
    close: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
    search: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.52 6.52 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5"/></svg>',
    share: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1 8 5h3v9h2V5h3m2 18H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3v2H6v12h12V9h-3V7h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2"/></svg>',
    "cellphone-arrow-down": '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M17 1H7a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2m0 18H7V5h10zm-1-6h-3V8h-2v5H8l4 4z"/></svg>',
    "bookmark-outline": '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m17 18-5-2.18L7 18V5h10m0-2H7a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2"/></svg>',
    bookmark: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M17 3H7a2 2 0 0 0-2 2v16l7-3 7 3V5a2 2 0 0 0-2-2"/></svg>',
    history: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 8H12v5l4.28 2.54.72-1.21-3.5-2.08zM13 3a9 9 0 0 0-9 9H1l3.96 4.03L9 12H6a7 7 0 0 1 7-7 7 7 0 0 1 7 7 7 7 0 0 1-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42A8.9 8.9 0 0 0 13 21a9 9 0 0 0 9-9 9 9 0 0 0-9-9"/></svg>',
    "chart-box-outline": '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 17H7v-7h2zm4 0h-2V7h2zm4 0h-2v-4h2zm2 2H5V5h14v14.1M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2"/></svg>',
    "alert-outline": '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 1 21h22M12 6l7.53 13H4.47M11 10v4h2v-4m-2 6v2h2v-2"/></svg>',
    "arrow-right": '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11v2h12l-5.5 5.5 1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5 16 11z"/></svg>',
  };

  const IS_IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const STANDALONE = html.classList.contains("standalone");
  let swReg = null, installPrompt = null;
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); installPrompt = e; window.dispatchEvent(new Event("apchem-install")); });

  // ── theme: auto → light → dark ───────────────────────────────────────────
  const THEMES = ["auto", "light", "dark"];
  const darkMQ = window.matchMedia("(prefers-color-scheme: dark)");
  const themePref = () => { const p = store.get("theme", "auto"); return THEMES.includes(p) ? p : "auto"; };
  function applyTheme(pref) {
    const dark = pref === "dark" || (pref === "auto" && darkMQ.matches);
    html.setAttribute("data-theme", dark ? "dark" : "light");
    html.setAttribute("data-theme-pref", pref);
    const label = { auto: "Theme: automatic (matches your device)", light: "Theme: light", dark: "Theme: dark" }[pref];
    $$(".theme-toggle").forEach((b) => { b.title = label + " — click to change"; b.setAttribute("aria-label", label + ". Click to change."); });
    $$("[data-set-theme]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.setTheme === pref)));
    // phone status bar / app title bar color follows the theme
    $$('meta[name="theme-color"]').forEach((m) => {
      const forDark = pref === "auto" ? (m.getAttribute("media") || "").includes("dark") : dark;
      m.setAttribute("content", forDark ? "#0f0f13" : "#ffffff");
    });
  }
  function setTheme(pref) { store.set("theme", pref); applyTheme(pref); }
  const onSchemeChange = () => { if (themePref() === "auto") applyTheme("auto"); };
  if (darkMQ.addEventListener) darkMQ.addEventListener("change", onSchemeChange); else if (darkMQ.addListener) darkMQ.addListener(onSchemeChange);
  document.addEventListener("click", (e) => {
    if (e.target.closest(".theme-toggle")) { const p = themePref(); setTheme(THEMES[(THEMES.indexOf(p) + 1) % THEMES.length]); }
    const s = e.target.closest("[data-set-theme]");
    if (s) setTheme(s.dataset.setTheme);
  });

  // ── nav drawer (small screens) ───────────────────────────────────────────
  function setNav(open) {
    document.body.classList.toggle("nav-open", open);
    const t = $(".nav-toggle"); if (t) t.setAttribute("aria-expanded", String(open));
    const s = $(".nav-scrim"); if (s) s.hidden = !open;
    if (open) { const a = $(".site-nav [aria-current]") || $(".site-nav a"); if (a) a.focus({ preventScroll: true }); }
  }
  document.addEventListener("click", (e) => {
    if (e.target.closest(".nav-toggle")) setNav(!document.body.classList.contains("nav-open"));
    else if (e.target.closest("[data-close-nav]")) setNav(false);
  });
  function revealActiveNav() {
    const sb = $(".site-nav"), a = $(".site-nav [aria-current]");
    if (!sb || !a) return;
    const r = a.getBoundingClientRect(), s = sb.getBoundingClientRect();
    if (r.top < s.top + 40 || r.bottom > s.bottom - 40) sb.scrollTop += r.top - s.top - sb.clientHeight / 3;
  }

  // ── KaTeX ────────────────────────────────────────────────────────────────
  function renderMath(root) {
    if (!root || !window.renderMathInElement) return;
    window.renderMathInElement(root, {
      delimiters: [{ left: "\\(", right: "\\)", display: false }, { left: "\\[", right: "\\]", display: true }],
      throwOnError: false, strict: false, ignoredClasses: ["sm-results", "link-preview"],
    });
  }

  // ── Contents: highlight the section you're reading ───────────────────────
  function initScrollSpy() {
    const links = $$(".toc-list a[href^='#']");
    if (!links.length) return;
    const byId = new Map();
    links.forEach((a) => { const id = decodeURIComponent(a.getAttribute("href").slice(1)); if (!byId.has(id)) byId.set(id, []); byId.get(id).push(a); });
    const heads = Array.from(byId.keys()).map((id) => document.getElementById(id)).filter(Boolean);
    let current = null, queued = false;
    function update() {
      queued = false;
      const line = parseFloat(getComputedStyle(html).scrollPaddingTop) || 80;
      let cur = null;
      for (const h of heads) { if (h.getBoundingClientRect().top - line <= 4) cur = h; else break; }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4 && heads.length) cur = heads[heads.length - 1];
      if (cur === current) return;
      current = cur;
      links.forEach((a) => a.classList.remove("is-active"));
      if (!cur) return;
      (byId.get(cur.id) || []).forEach((a) => {
        a.classList.add("is-active");
        const box = a.closest(".toc, .tb-contents-body"); // the Contents column, or its copy in the tools panel
        if (box && box.offsetParent) {
          const r = a.getBoundingClientRect(), s = box.getBoundingClientRect();
          if (r.top < s.top + 30 || r.bottom > s.bottom - 30) box.scrollTop += r.top - s.top - box.clientHeight / 2;
        }
      });
    }
    const queue = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    update();
  }
  // following a #link into a collapsed box opens it
  function openTarget() {
    if (!location.hash) return;
    let el = null;
    try { el = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch (e) { return; }
    for (let p = el && el.parentElement; p; p = p.parentElement) if (p.tagName === "DETAILS") p.open = true;
    if (el && el.closest("details:not([open])") === null) el.scrollIntoView();
  }
  window.addEventListener("hashchange", openTarget);

  // ── search ───────────────────────────────────────────────────────────────
  const norm = (s) => String(s || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  let indexPromise = null;
  function loadIndex() {
    if (!indexPromise) {
      indexPromise = fetch(ROOT + "search-index.json").then((r) => r.json()).then((j) => j.pages.map((p) => ({
        ...p, _t: norm(p.t), _d: norm(p.d), _k: norm((p.k || []).join(" ")), _s: norm(p.s),
        h: p.h.map(([id, head, text]) => ({ id, head, text, _h: norm(head), _x: norm(text) })),
      }))).catch(() => { indexPromise = null; return []; });
    }
    return indexPromise;
  }
  function countIn(hay, t, cap) { let n = 0, i = hay.indexOf(t); while (i !== -1 && n < cap) { n++; i = hay.indexOf(t, i + t.length); } return n; }
  function searchPages(pages, q) {
    const terms = norm(q).split(/[\s,]+/).filter(Boolean);
    if (!terms.length) return [];
    const phrase = terms.join(" ");
    const out = [];
    for (const p of pages) {
      let score = 0, ok = true;
      for (const t of terms) {
        let s = 0;
        if (p._t.includes(t)) s += new RegExp("(^|[^a-z0-9])" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).test(p._t) ? 14 : 9;
        if (p._k.includes(t)) s += 5;
        if (p._d.includes(t)) s += 4;
        if (p._s.includes(t)) s += 1;
        let body = 0;
        for (const h of p.h) { if (h._h.includes(t)) s += 4; body += Math.min(3, countIn(h._x, t, 3)) * 0.6; }
        s += Math.min(5, body); // lots of passing mentions shouldn't beat a page that's about it
        if (!s) { ok = false; break; }
        score += s;
      }
      if (!ok) continue;
      if (p._t.includes(phrase)) score += 20;
      if (p.u.startsWith("units/")) score += 2; // notes pages first
      const hits = p.h.filter((h) => h.id).map((h) => {
        let s = 0, all = true;
        for (const t of terms) { const a = h._h.includes(t) ? 6 : 0, b = countIn(h._x, t, 5); if (!a && !b) all = false; s += a + Math.min(5, b); }
        if (h._h.includes(phrase) || h._x.includes(phrase)) s += 6;
        return { h, s: all ? s : s * 0.3 };
      }).filter((x) => x.s >= 2).sort((a, b) => b.s - a.s).slice(0, 3);
      out.push({ p, score, hits });
    }
    return out.sort((a, b) => b.score - a.score).slice(0, 14);
  }
  function snippet(text, terms, len = 170) {
    if (!text) return "";
    const n = norm(text);
    let at = -1;
    for (const t of terms) { const i = n.indexOf(t); if (i !== -1 && (at === -1 || i < at)) at = i; }
    const start = at > 60 ? text.lastIndexOf(" ", at - 50) + 1 : 0;
    let s = text.slice(start, start + len);
    if (start + len < text.length) s = s.replace(/\s+\S*$/, "") + "…";
    return (start > 0 ? "…" : "") + s;
  }
  function highlight(text, terms) {
    let h = esc(text);
    const parts = terms.filter((t) => t.length > 0).map((t) => esc(t).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).sort((a, b) => b.length - a.length);
    if (!parts.length) return h;
    try { h = h.replace(new RegExp("(" + parts.join("|") + ")", "gi"), "<mark>$1</mark>"); } catch (e) { /* keep plain */ }
    return h;
  }
  let searchEl = null, lastFocus = null;
  function openSearch(initial) {
    if (searchEl) { $(".sm-input", searchEl).focus(); return; }
    lastFocus = document.activeElement;
    setNav(false);
    searchEl = document.createElement("div");
    searchEl.className = "search-modal";
    searchEl.innerHTML = `<div class="sm-backdrop" data-close-search></div>
      <div class="sm-box" role="dialog" aria-modal="true" aria-label="Search the wiki">
        <div class="sm-head">${ICON.search}<input class="sm-input" type="search" placeholder="Search all notes…" autocomplete="off" spellcheck="false" aria-label="Search" aria-controls="sm-results">
          <button type="button" class="sm-close" data-close-search>Esc</button></div>
        <div class="sm-results" id="sm-results" role="listbox"></div>
        <div class="sm-foot"><span><kbd>↑</kbd><kbd>↓</kbd> choose</span><span><kbd>Enter</kbd> open</span><span><kbd>Esc</kbd> close</span></div>
      </div>`;
    document.body.appendChild(searchEl);
    html.classList.add("wm-open");
    const input = $(".sm-input", searchEl), results = $(".sm-results", searchEl);
    let sel = 0;
    const items = () => $$(".sm-item", results);
    function select(i) {
      const list = items(); if (!list.length) return;
      sel = (i + list.length) % list.length;
      list.forEach((el, k) => { el.classList.toggle("is-selected", k === sel); el.setAttribute("aria-selected", String(k === sel)); });
      list[sel].scrollIntoView({ block: "nearest" });
    }
    function empty() {
      const tries = ["RICE", "H2SO4", "buffer", "Kp", "calorimetry", "oxidation number"];
      results.innerHTML = `<div class="sm-empty">Search every page, heading and formula.<br>Try ${tries.map((t) => `<a href="#" data-try="${esc(t)}">${esc(t)}</a>`).join(", ")}.</div>`;
    }
    async function run() {
      const q = input.value.trim();
      if (!q) { empty(); return; }
      const pages = await loadIndex();
      if (q !== input.value.trim()) return; // typed more meanwhile
      const terms = norm(q).split(/[\s,]+/).filter(Boolean);
      const found = searchPages(pages, q);
      if (!found.length) { results.innerHTML = `<div class="sm-empty">No results for <b>${esc(q)}</b>.</div>`; return; }
      results.innerHTML = found.map(({ p, hits }) => {
        const url = ROOT + p.u;
        const intro = p.h.find((h) => !h.id);
        const snip = p.d || snippet(intro ? intro.text : "", terms);
        return `<div class="sm-group"><a class="sm-item sm-page" role="option" href="${esc(url)}">` +
          (p.s ? `<span class="sm-crumb">${esc(p.s)}</span>` : "") +
          `<span class="sm-title">${highlight(p.t, terms)}</span>` + (snip ? `<span class="sm-snip">${highlight(snip, terms)}</span>` : "") + "</a>" +
          hits.map(({ h }) => `<a class="sm-item sm-hit" role="option" href="${esc(url + "#" + h.id)}"><span class="sm-h">${highlight(h.head, terms)}</span>` +
            `<span class="sm-snip">${highlight(snippet(h.text, terms), terms)}</span></a>`).join("") + "</div>";
      }).join("");
      select(0);
    }
    input.addEventListener("input", run);
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); select(sel + 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); select(sel - 1); }
      else if (e.key === "Enter") { const it = items()[sel]; if (it) { e.preventDefault(); it.click(); } }
    });
    results.addEventListener("click", (e) => {
      const t = e.target.closest("[data-try]");
      if (t) { e.preventDefault(); input.value = t.dataset.try; run(); input.focus(); return; }
      if (e.target.closest(".sm-item")) closeSearch(false);
    });
    results.addEventListener("mousemove", (e) => { const it = e.target.closest(".sm-item"); if (it) { const k = items().indexOf(it); if (k !== sel) select(k); } });
    searchEl.addEventListener("click", (e) => { if (e.target.closest("[data-close-search]")) closeSearch(true); });
    if (initial) input.value = initial;
    run();
    input.focus();
    loadIndex();
  }
  function closeSearch(restore) {
    if (!searchEl) return;
    searchEl.remove(); searchEl = null;
    if (!modal) html.classList.remove("wm-open");
    if (restore && lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.addEventListener("click", (e) => { if (e.target.closest("[data-open-search]")) { e.preventDefault(); openSearch(); } });
  document.addEventListener("keydown", (e) => {
    const typing = e.target.closest && e.target.closest("input, textarea, select, [contenteditable]");
    if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) { e.preventDefault(); searchEl ? closeSearch(true) : openSearch(); return; }
    if (e.key === "/" && !typing && !searchEl && !modal) { e.preventDefault(); openSearch(); return; }
    if (e.key === "Escape") {
      if (searchEl) closeSearch(true);
      else if (document.body.classList.contains("nav-open")) { setNav(false); const t = $(".nav-toggle"); if (t) t.focus(); }
    }
  });

  // ── link previews: hover a link to another wiki page ─────────────────────
  function initPreviews() {
    if (window.matchMedia("(hover: none)").matches) return;
    let timer = null, card = null, cur = null;
    const rootPath = new URL(ROOT).pathname;
    function hide() { clearTimeout(timer); cur = null; if (card) card.classList.remove("is-on"); }
    async function show(a) {
      const u = new URL(a.href, location.href);
      if (u.origin !== location.origin || !u.pathname.startsWith(rootPath)) return;
      const path = decodeURI(u.pathname.slice(rootPath.length)).replace(/index\.html$/, "");
      const pages = await loadIndex();
      if (cur !== a) return;
      const p = pages.find((x) => x.u === path);
      if (!p) return;
      const id = decodeURIComponent(u.hash.slice(1));
      const sec = id ? p.h.find((h) => h.id === id) : null;
      if (id && !sec && u.pathname === location.pathname) return;
      const intro = p.h.find((h) => !h.id);
      const firstText = intro && intro.text ? intro.text : ((p.h[1] || {}).text || "");
      const title = sec ? sec.head : p.t;
      const crumb = sec ? p.t : p.s;
      const text = sec ? sec.text : (p.d || firstText);
      if (!card) { card = document.createElement("div"); card.className = "link-preview"; card.setAttribute("role", "tooltip"); document.body.appendChild(card); }
      card.innerHTML = (crumb ? `<div class="lp-crumb">${esc(crumb)}</div>` : "") + `<div class="lp-title">${esc(title)}</div>` +
        (text ? `<p class="lp-text">${esc(text.length > 420 ? text.slice(0, 420).replace(/\s+\S*$/, "") + "…" : text)}</p>` : "");
      const r = a.getBoundingClientRect();
      const w = card.offsetWidth, h = card.offsetHeight;
      const left = Math.max(12, Math.min(r.left, window.innerWidth - w - 12));
      const below = r.bottom + 10 + h < window.innerHeight;
      card.style.left = left + window.scrollX + "px";
      card.style.top = (below ? r.bottom + 10 : r.top - h - 10) + window.scrollY + "px";
      void card.offsetWidth; // start the fade from the hidden state
      card.classList.add("is-on");
    }
    document.addEventListener("pointerover", (e) => {
      const a = e.target.closest && e.target.closest(".main a.wiki-link, .main .prose a[href]:not(.headerlink):not(.card):not(.btn)");
      if (!a || a === cur || e.pointerType === "touch") return;
      if (a.closest(".toc-mobile, .az-index, .crumbs")) return;
      hide(); cur = a;
      timer = setTimeout(() => show(a), 420);
    });
    document.addEventListener("pointerout", (e) => { if (cur && e.target.closest && e.target.closest("a") === cur && !cur.contains(e.relatedTarget)) hide(); });
    window.addEventListener("scroll", hide, { passive: true });
    document.addEventListener("click", hide);
  }

  // ── study tracker ────────────────────────────────────────────────────────
  const TICK = 5; // seconds
  let lastActivity = Date.now();
  ["mousemove", "keydown", "scroll", "touchstart", "click", "wheel"].forEach((ev) =>
    window.addEventListener(ev, () => { lastActivity = Date.now(); }, { passive: true }));
  function studyData() { const d = store.get("study", null); return d && d.days ? d : { days: {} }; }
  function tick() {
    if (!prefs().tracker) return;
    if (document.visibilityState !== "visible") return;
    if (Date.now() - lastActivity > 3 * 60 * 1000) return; // idle > 3 min: don't count
    if (focusing()) return; // a running focus session counts its own time (see creditFocus)
    const d = studyData();
    const k = dayKey();
    d.days[k] = (d.days[k] || 0) + TICK;
    store.set("study", d);
    if ($("#study-card")) renderStudy();
  }
  setInterval(tick, TICK * 1000);
  function studySummary() {
    const days = studyData().days;
    const today = startOfDay(now());
    const get = (d) => days[dayKey(d)] || 0;
    const monday = new Date(today); monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    let week = 0;
    for (let d = new Date(monday); d <= today; d.setDate(d.getDate() + 1)) week += get(d);
    const total = Object.values(days).reduce((a, b) => a + b, 0);
    let streak = 0;
    const d = new Date(today);
    if (get(d) < 60) d.setDate(d.getDate() - 1); // today not started yet → count from yesterday
    while (get(d) >= 60) { streak++; d.setDate(d.getDate() - 1); }
    const last14 = [];
    for (let i = 13; i >= 0; i--) { const x = new Date(today); x.setDate(today.getDate() - i); last14.push({ d: x, s: get(x) }); }
    return { today: get(today), week, total, streak, last14 };
  }
  function renderStudy() {
    if (!$("#st-today")) return;
    const s = studySummary();
    $("#st-today").textContent = fmtDur(s.today);
    $("#st-week").textContent = fmtDur(s.week);
    $("#st-total").textContent = fmtDur(s.total);
    $("#st-streak").textContent = s.streak;
    const max = Math.max(600, ...s.last14.map((x) => x.s));
    const bw = 14, gap = 5, h = 46;
    const bars = s.last14.map((x, i) => {
      const bh = Math.max(2, (x.s / max) * h);
      return `<rect x="${i * (bw + gap)}" y="${h - bh}" width="${bw}" height="${bh}" rx="3" class="${i === 13 ? "spark-today" : "spark-bar"}"><title>${fmtDate(x.d)}: ${fmtDur(x.s)}</title></rect>`;
    }).join("");
    $("#st-spark").innerHTML = `<svg viewBox="0 0 ${14 * (bw + gap) - gap} ${h}" preserveAspectRatio="none">${bars}</svg><div class="spark-axis"><span>2 wks ago</span><span>today</span></div>`;
  }

  // ── schedule helpers ─────────────────────────────────────────────────────
  function exams() {
    const list = [];
    (DATA.units || []).forEach((u) => { if (u.exam && u.exam.date) list.push({ title: u.exam.title, date: parseISO(u.exam.date), unit: u }); });
    (DATA.events || []).forEach((e) => list.push({ title: e.title, date: parseISO(e.date) }));
    const ap = (DATA.course || {}).ap_exam;
    if (ap) list.push({ title: ap.title, date: parseISO(ap.date, ap.time), ap: true });
    return list.filter((x) => x.date).sort((a, b) => a.date - b.date);
  }
  function currentUnit(t) {
    const units = DATA.units || [];
    for (const u of units) {
      const s = parseISO(u.start), e = parseISO((u.exam && u.exam.date) || u.end);
      if (s && e && t >= s && t < new Date(e.getTime() + DAY)) return { unit: u, start: s, end: e, state: "now" };
    }
    const next = units.map((u) => ({ u, s: parseISO(u.start) })).filter((x) => x.s > t).sort((a, b) => a.s - b.s)[0];
    return next ? { unit: next.u, start: next.s, state: "next" } : null;
  }
  const inDays = (date, t) => { const n = daysBetween(t, date); return n === 0 ? "today" : n === 1 ? "tomorrow" : `in ${n} days`; };

  // ── home page ────────────────────────────────────────────────────────────
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shortExam = (title) => String(title).replace(/\s+–.*$/, ""); // "Exam #5 – Thermodynamics" → "Exam #5"
  function greeting() {
    const G = DATA.greetings || {};
    const t = now();
    const h = t.getHours(), wd = t.getDay();
    const next = exams().find((x) => daysBetween(t, x.date) >= 0);
    const dleft = next ? daysBetween(t, next.date) : 99;
    let bucket;
    if (next && dleft === 0 && G.exam_today) bucket = "exam_today";
    else if (next && dleft <= 3 && G.exam_soon) bucket = "exam_soon";
    else if ((h >= 23 || h < 5) && G.late_night) bucket = "late_night";
    else if ((wd === 0 || wd === 6) && h >= 9 && h < 20 && G.weekend && Math.random() < 0.6) bucket = "weekend";
    else if (h < 12) bucket = "morning";
    else if (h < 17) bucket = "afternoon";
    else bucket = "evening";
    let line = pick(G[bucket] || ["Hello, {name}!"]);
    const name = getName();
    const examName = next ? (next.ap ? "The AP exam" : shortExam(next.title)) : "your exam";
    line = line.replace(/\{exam\}/g, examName).replace(/\{days\}/g, plural(dleft, "day"));
    line = line.charAt(0).toUpperCase() + line.slice(1);
    if (name) line = line.replace(/\{name\}/g, name);
    else line = line.replace(/\s*,\s*\{name\}/g, "").replace(/\{name\}\s*[,—-]?\s*/g, "").replace(/\s{2,}/g, " ");
    return line.replace(/\s+([?.!])/g, "$1").trim();
  }
  function renderGreeting() {
    const el = $("#home-greeting");
    if (!el) return;
    el.textContent = greeting();
    const t = now();
    const cu = currentUnit(t);
    const parts = [t.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })];
    if (cu) parts.push(cu.state === "now" ? `Unit ${cu.unit.number}: ${cu.unit.title}` : `Next up: Unit ${cu.unit.number} (${cu.unit.title})`);
    $("#home-sub").textContent = parts.join(" · ");
    const cur = $("#home-current-unit");
    if (cur && cu) { cur.href = ROOT + "units/" + cu.unit.slug + "/"; $("span", cur).textContent = `Unit ${cu.unit.number}`; }
    const prompt = $("#name-prompt");
    if (prompt) {
      prompt.hidden = !!getName() || store.get("namePromptDismissed", false);
      prompt.onsubmit = (e) => {
        e.preventDefault();
        const v = $("#name-prompt-input").value.trim();
        if (v) store.set("name", v);
        store.set("namePromptDismissed", true);
        prompt.hidden = true;
        renderGreeting();
      };
    }
  }
  // quote of the day: the same one all day (home page + Quotes page), from the kinds chosen in Settings
  function quotePool() {
    const cats = prefs().quoteCats;
    const qs = (DATA.quotes || []).filter((q) => cats.includes(q.category || "quote"));
    return qs.length ? qs : DATA.quotes || [];
  }
  function quoteOfDay() {
    const pool = quotePool();
    if (!pool.length) return null;
    let h = 0;
    for (const c of dayKey(now())) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return pool[h % pool.length];
  }
  function randomQuote(pool, current) {
    if (!pool.length) return null;
    let q = pick(pool);
    if (pool.length > 1 && current && q.id === current.id) q = pool[(pool.indexOf(q) + 1) % pool.length];
    return q;
  }
  let homeQuote = null;
  function renderQuote(random) {
    const box = $("#quote-card");
    if (!box) return;
    const q = random ? randomQuote(quotePool(), homeQuote) : quoteOfDay();
    if (!q) { box.hidden = true; return; }
    homeQuote = q;
    const txt = $("#quote-text");
    txt.classList.remove("qc-in"); void txt.offsetWidth; txt.classList.add("qc-in");
    txt.textContent = q.text;
    $("#quote-who").textContent = "— " + (q.who || "Ms. Boppana") + (q.context ? ` · ${q.context}` : "");
    const isToday = q === quoteOfDay();
    const kicker = $("#quote-kicker");
    if (kicker) kicker.textContent = isToday ? "Quote of the day" : "Random quote";
    // "All quotes" opens the Quotes page showing this same quote at the top
    const all = $("#quote-all");
    if (all) all.href = ROOT + "quotes/" + (isToday ? "" : "?q=" + encodeURIComponent(q.id));
  }
  function renderCountdowns() {
    const card = $("#countdown-card");
    if (!card) return;
    const t = now();
    const cu = currentUnit(t);
    const unitEl = $("#cd-unit"), bar = $("#cd-bar");
    if (cu && cu.state === "now") {
      const pct = Math.min(100, Math.max(0, ((t - cu.start) / (cu.end.getTime() + DAY - cu.start)) * 100));
      unitEl.innerHTML = `<span class="cd-label">Current unit</span><a href="${ROOT}units/${cu.unit.slug}/"><b>Unit ${cu.unit.number}</b> · ${esc(cu.unit.title)}</a><span class="cd-pct">${Math.round(pct)}% through</span>`;
      bar.style.width = pct.toFixed(1) + "%";
    } else if (cu) {
      unitEl.innerHTML = `<span class="cd-label">Next unit</span><a href="${ROOT}units/${cu.unit.slug}/"><b>Unit ${cu.unit.number}</b> · ${esc(cu.unit.title)}</a><span class="cd-pct">starts ${inDays(cu.start, t)}</span>`;
      bar.style.width = "0%";
    } else { unitEl.textContent = "All units done — good luck on the AP exam!"; }
    const upcoming = exams().filter((x) => daysBetween(t, x.date) >= 0);
    const nextExam = upcoming.find((x) => !x.ap && x.unit);
    const ap = upcoming.find((x) => x.ap);
    const rows = [];
    if (nextExam) rows.push(`<li><span class="cd-days">${daysBetween(t, nextExam.date)}<small>days</small></span><span class="cd-what"><b>${esc(nextExam.title)}</b><small>${fmtDate(nextExam.date)} · ${inDays(nextExam.date, t)}</small></span></li>`);
    if (ap) rows.push(`<li class="cd-ap"><span class="cd-days">${daysBetween(t, ap.date)}<small>days</small></span><span class="cd-what"><b>${esc(ap.title)}</b><small>${fmtDate(ap.date)}, ${ap.date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}</small></span></li>`);
    $("#cd-list").innerHTML = rows.join("") || "<li>No upcoming exams.</li>";
    $$(".unit-row").forEach((r) => {
      const s = parseISO(r.dataset.start), e = parseISO(r.dataset.end);
      r.classList.toggle("is-now", !!(s && e && t >= s && t < new Date(e.getTime() + DAY)));
      r.classList.toggle("is-done", !!(e && t >= new Date(e.getTime() + DAY)));
    });
  }
  function initHome() {
    if (!$("#home-greeting")) return;
    renderGreeting();
    renderQuote(false);
    renderCountdowns();
    renderStudy();
    const nb = $("#quote-next");
    if (nb) nb.onclick = () => renderQuote(true);
  }

  // ── modal (PDF preview + scans lightbox) ─────────────────────────────────
  let modal = null;
  function openModal(inner, cls) {
    closeModal();
    modal = document.createElement("div");
    modal.className = "wiki-modal " + (cls || "");
    modal.innerHTML = `<div class="wm-backdrop" data-close></div><div class="wm-box" role="dialog" aria-modal="true">${inner}</div>`;
    document.body.appendChild(modal);
    html.classList.add("wm-open");
    modal.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeModal(); });
    const f = $(".wm-close", modal); if (f) f.focus();
    return modal;
  }
  function closeModal() {
    if (!modal) return;
    modal.remove(); modal = null;
    if (!searchEl) html.classList.remove("wm-open");
  }
  document.addEventListener("keydown", (e) => {
    if (!modal) return;
    if (e.key === "Escape") closeModal();
    else if (modal.classList.contains("wm-lightbox")) {
      if (e.key === "ArrowRight") { const b = $(".lb-next", modal); if (b) b.click(); }
      if (e.key === "ArrowLeft") { const b = $(".lb-prev", modal); if (b) b.click(); }
    }
  });
  function openPdf(href, title) {
    const abs = new URL(href, location.href).href;
    // iPhone/iPad: an embedded PDF only shows its first page, so open the system PDF viewer instead
    if (IS_IOS) { window.open(abs, "_blank", "noopener"); return; }
    openModal(
      `<header class="wm-head"><b>${esc(title)}</b><span class="wm-actions">
         <a class="btn" href="${esc(abs)}" target="_blank" rel="noopener">Open in new tab</a>
         <a class="btn btn-primary" href="${esc(abs)}" download>Download</a>
         <button type="button" class="wm-close" data-close aria-label="Close">${ICON.close}</button></span></header>
       <iframe class="wm-pdf" src="${esc(abs)}#view=FitH" title="${esc(title)}"></iframe>`, "wm-pdfview");
  }
  function openLightbox(nb, pages, base, startIdx, title) {
    const nbName = title || `Notebook ${nb}`;
    let i = startIdx || 0;
    const m = openModal(`<header class="wm-head"><b class="lb-title"></b><span class="wm-actions">
        <a class="btn lb-all" href="${ROOT}scans/${encodeURIComponent(nb)}/">All pages</a>
        <a class="btn lb-full" target="_blank" rel="noopener">Full size</a>
        <button type="button" class="wm-close" data-close aria-label="Close">${ICON.close}</button></span></header>
      <div class="lb-stage"><button type="button" class="lb-nav lb-prev" aria-label="Previous page">‹</button>
        <img class="lb-img" alt=""><button type="button" class="lb-nav lb-next" aria-label="Next page">›</button></div>
      <div class="lb-strip"></div>`, "wm-lightbox");
    const baseURL = new URL(base, location.href).href;
    const src = (p) => `${baseURL}${nb}/p${pad(p)}.webp`;
    const strip = $(".lb-strip", m);
    strip.innerHTML = pages.map((p, k) => `<button type="button" data-k="${k}"><img src="${baseURL}${nb}/thumb/p${pad(p)}.webp" alt="p. ${p}" loading="lazy"><span>${p}</span></button>`).join("");
    function show() {
      const p = pages[i];
      $(".lb-img", m).src = src(p);
      $(".lb-img", m).alt = `${nbName}, page ${p}`;
      $(".lb-title", m).textContent = `${nbName} · page ${p}` + (pages.length > 1 ? `  (${i + 1} of ${pages.length})` : "");
      $(".lb-full", m).href = src(p);
      $(".lb-all", m).href = `${ROOT}scans/${encodeURIComponent(nb)}/#p${pad(p)}`;
      $(".lb-prev", m).disabled = i === 0;
      $(".lb-next", m).disabled = i === pages.length - 1;
      $$("button", strip).forEach((b, k) => b.classList.toggle("on", k === i));
      strip.hidden = pages.length < 2;
      $$(".lb-nav", m).forEach((b) => { b.hidden = pages.length < 2; });
    }
    $(".lb-prev", m).onclick = () => { if (i > 0) { i--; show(); } };
    $(".lb-next", m).onclick = () => { if (i < pages.length - 1) { i++; show(); } };
    strip.onclick = (e) => { const b = e.target.closest("button[data-k]"); if (b) { i = +b.dataset.k; show(); } };
    show();
  }
  document.addEventListener("click", (e) => {
    const pdf = e.target.closest(".rc-preview");
    if (pdf) { e.preventDefault(); openPdf(pdf.dataset.pdf, pdf.dataset.title || "Preview"); return; }
    const chip = e.target.closest(".source-chip, .scan-open");
    if (chip) {
      e.preventDefault();
      const pages = String(chip.dataset.pages || "1").split(",").map(Number).filter(Boolean);
      openLightbox(chip.dataset.nb, pages, chip.dataset.base || ROOT + "assets/scans/", 0, chip.dataset.title);
    }
  });

  // ── Formulas page filter ─────────────────────────────────────────────────
  // Formulas page: text filter + unit chips (?unit=N in the URL) + "Print" → two-column formula
  // sheets of exactly the formulas on screen, at most two pages per unit (styles: wiki.css § 24).
  function initFormulaFilter() {
    const input = $(".formula-filter");
    if (!input) return;
    const html = document.documentElement;
    html.classList.add("fx-page");
    const units = $$(".formula-unit"), chips = $$(".fx-unit"), printBtn = $(".fx-print");
    const n = (s) => norm(s).replace(/\s+/g, " ");
    let unit = new URLSearchParams(location.search).get("unit") || "all";
    if (!units.some((u) => u.dataset.unit === unit)) unit = "all";

    function apply() {
      const raw = input.value.trim(), q = n(raw);
      let shown = 0;
      units.forEach((u) => {
        const inUnit = unit === "all" || u.dataset.unit === unit;
        let anyU = false;
        $$(".formula-group", u).forEach((g) => {
          const title = n(($("h3", g) || {}).textContent || "");
          let any = false;
          $$(".admonition.formula", g).forEach((f) => {
            const hit = inUnit && (!q || n(f.textContent).includes(q) || title.includes(q));
            f.hidden = !hit;
            if (hit) { any = true; shown++; }
          });
          g.hidden = !any; anyU = anyU || any;
        });
        u.hidden = !anyU;
      });
      chips.forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.unit === unit)));
      // on a phone the chips are one swipeable row: keep the selected one in view (sideways only)
      const on = chips.find((c) => c.dataset.unit === unit), row = on && on.parentElement;
      if (row && row.scrollWidth > row.clientWidth) {
        const r = row.getBoundingClientRect(), c = on.getBoundingClientRect();
        if (c.left < r.left || c.right > r.right) row.scrollLeft += c.left - r.left - (r.width - c.width) / 2;
      }
      // the A–Z index and the Contents only list what's showing
      $$(".az-index a, .toc a[href^='#'], .toc-mobile a[href^='#']").forEach((a) => {
        const t = document.getElementById(decodeURIComponent(a.hash.slice(1)));
        const el = a.closest("li") || a;
        el.hidden = !!(t && t.closest("[hidden]"));
      });
      $$(".az-group").forEach((g) => { g.hidden = !$$("a", g).some((a) => !a.hidden); });
      ($(".fx-empty") || {}).hidden = shown > 0;
      const label = q ? `Print these ${shown} formula${shown === 1 ? "" : "s"}`
        : unit === "all" ? `Print all ${shown} formulas` : `Print Unit ${unit} formulas (${shown})`;
      if (printBtn) { $(".fx-print-label", printBtn).textContent = label; printBtn.disabled = !shown; }
      const url = new URL(location.href);
      if (unit === "all") url.searchParams.delete("unit"); else url.searchParams.set("unit", unit);
      if (url.href !== location.href) window.history.replaceState(window.history.state, "", url.href);
    }

    // Printing: each unit becomes its own formula sheet of at most two pages (one sheet of paper,
    // double-sided), in two columns. Browsers split CSS columns across printed pages unreliably (Safari
    // slices boxes and falls back to one column), so every page is built here, and a unit too long for
    // two pages is scaled down (--fx-s) until it fits.
    // The printed page in CSS px: the smaller of Letter and A4 with 0.5in margins, less a little height
    // to spare. Safari prints 1 CSS px as 0.8pt (other browsers 0.75pt), so its page holds fewer px.
    const ua = navigator.userAgent, webkit = /AppleWebKit/.test(ua) && !/Chrome|Chromium|Edg|OPR/.test(ua);
    const PAGE_W = webkit ? 654 : 698, PAGE_H = webkit ? 880 : 940;
    const MAX_PAGES = 2, SCALE_STEP = 0.02, MIN_SCALE = 0.1, GAP = 8;
    const PRINT_PX = 12.67, COL = (PAGE_W - 16) / 2 - 25, FULL = PAGE_W - 28, MIN_FIT = 0.72;   // 9.5pt formula text when printed
    const sheets = document.createElement("div");
    sheets.className = "fx-sheets";
    sheets.setAttribute("aria-hidden", "true");
    units[0].parentElement.append(sheets);
    const box = (cls) => { const d = document.createElement("div"); d.className = cls; return d; };
    function printCopy(el) {
      const c = el.cloneNode(true);
      [c, ...$$("[id]", c)].forEach((x) => x.removeAttribute("id"));
      $$(".formula-src, .headerlink", c).forEach((x) => x.remove());
      return c;
    }
    // Each formula's natural width at full print size, so it can stay in a column, shrink a little
    // (--fx-fit), or span both columns.
    function naturalWidths(forms) {
      html.classList.add("fx-measuring");
      const widths = new Map(forms.map((f) => {
        let w = 0;
        $$(".katex-display, table", f).forEach((el) => { w = Math.max(w, el.getBoundingClientRect().width); });
        return [f, w * PRINT_PX / (parseFloat(getComputedStyle(f).fontSize) || 16)];
      }));
      html.classList.remove("fx-measuring");
      return widths;
    }
    // One block per formula showing; a topic heading stays with its first formula.
    function unitBlocks(u) {
      const blocks = [];
      $$(".formula-group", u).filter((g) => !g.hidden).forEach((g) => {
        let h3 = $("h3", g);
        $$(".admonition.formula", g).filter((f) => !f.hidden).forEach((f) => {
          const el = box("fx-atom"), form = printCopy(f);
          if (h3) { el.append(printCopy(h3)); h3 = null; }
          el.append(form);
          blocks.push({ el, form, source: f });
        });
      });
      const widths = naturalWidths(blocks.map((b) => b.source));
      blocks.forEach((b) => { b.natural = widths.get(b.source); });
      return blocks;
    }
    function sheetHead(u, count) {
      const head = box("fx-sheet-head"), title = document.createElement("p"), sub = document.createElement("p");
      const raw = input.value.trim(), site = (($(".brand span") || {}).textContent || "").trim();
      title.className = "fx-sh-title";
      title.textContent = u.dataset.title;
      sub.className = "fx-sh-sub";
      sub.textContent = ["Formula sheet", site, `${count} formula${count === 1 ? "" : "s"}` + (raw ? ` matching “${raw}”` : ""),
        new Date().toLocaleDateString()].filter(Boolean).join(" · ");
      head.append(title, sub);
      return head;
    }
    // Sort blocks onto two-column pages. Needs each block's height (.h) and whether it spans the page (.wide).
    function packPages(head, blocks, gap) {
      const pages = [[head]];
      let room = PAGE_H - head.h - gap;
      const newPage = () => { pages.push([]); room = PAGE_H; };
      const page = () => pages[pages.length - 1];
      const height = (list) => list.reduce((s, b) => s + b.h + gap, -gap);
      const addCols = (parts) => {
        page().push({ cols: parts });
        room -= Math.max(...parts.map(height)) + gap;
      };
      let i = 0;
      while (i < blocks.length) {
        const b = blocks[i];
        if (b.wide) {
          if (b.h > room && page().length) newPage();
          page().push(b);
          room -= b.h + gap;
          i++;
          continue;
        }
        let end = i;
        while (end < blocks.length && !blocks[end].wide) end++;
        const run = blocks.slice(i, end);
        // fill the columns in order, each up to a height limit; returns how many blocks were placed
        const spread = (limit) => {
          const parts = [];
          let k = 0;
          for (let c = 0; c < 2; c++) {
            const from = k;
            let h = 0;
            while (k < run.length && h + run[k].h <= limit) { h += run[k].h + gap; k++; }
            parts.push(run.slice(from, k));
          }
          return { parts, placed: k };
        };
        // the rest of this run fits on the page: use the shortest columns that hold it all
        let lo = Math.max(...run.map((r) => r.h)), hi = Math.max(lo, height(run));
        for (let step = 0; step < 14; step++) {
          const mid = (lo + hi) / 2;
          if (spread(mid).placed === run.length) hi = mid; else lo = mid;
        }
        if (hi <= room) { addCols(spread(hi).parts); i = end; continue; }
        // otherwise fill the columns to the bottom of the page and carry on overleaf
        const { parts, placed } = spread(room);
        if (!placed && page().length) { newPage(); continue; }
        if (!placed) parts[0] = [run[0]];   // a box taller than a whole page still has to go somewhere
        addCols(parts);
        i += placed || 1;
        if (i < blocks.length) newPage();
      }
      return pages;
    }
    // The largest scale at which this unit fits on MAX_PAGES pages.
    function fitUnit(u) {
      const blocks = unitBlocks(u), head = { el: sheetHead(u, blocks.length) };
      const probe = box("fx-sheet"), cols = box("fx-cols"), col = box("fx-col");
      probe.append(head.el, cols);
      sheets.append(probe);
      cols.append(col, box("fx-col"));
      const attempt = (s) => {
        probe.style.setProperty("--fx-s", s);
        blocks.forEach((b) => {
          const w = b.natural * s;
          b.wide = w > COL / MIN_FIT;
          const fit = Math.min(1, (b.wide ? FULL : COL) / Math.max(w, 1));
          if (fit < 1) b.form.style.setProperty("--fx-fit", fit.toFixed(3)); else b.form.style.removeProperty("--fx-fit");
          (b.wide ? probe : col).append(b.el);
        });
        head.h = head.el.getBoundingClientRect().height;
        blocks.forEach((b) => { b.h = b.el.getBoundingClientRect().height; });
        return packPages(head, blocks, GAP * s * s);
      };
      let s = 1;
      if (attempt(1).length > MAX_PAGES) {
        let lo = MIN_SCALE, hi = 1;
        while (hi - lo > SCALE_STEP) {
          const mid = Math.round((lo + hi) * 50) / 100;
          if (attempt(mid).length <= MAX_PAGES) lo = mid; else hi = mid;
        }
        s = lo;
      }
      const pages = attempt(s);   // leaves every block sized for the scale chosen
      probe.remove();
      return { s, pages };
    }
    function buildSheets() {
      html.classList.add("fx-building");
      sheets.style.width = PAGE_W + "px";
      sheets.textContent = "";
      const fitted = units.filter((u) => !u.hidden).map(fitUnit);
      sheets.style.width = "";
      html.classList.remove("fx-building");
      fitted.forEach(({ s, pages }, n) => {
        pages.forEach((items) => {
          const sheet = box("fx-sheet");
          sheet.style.setProperty("--fx-s", s);
          items.forEach((item) => {
            if (!item.cols) { sheet.append(item.el); return; }
            const cols = box("fx-cols");
            item.cols.forEach((list) => { const c = box("fx-col"); c.append(...list.map((b) => b.el)); cols.append(c); });
            sheet.append(cols);
          });
          sheets.append(sheet);
        });
        // a one-page unit gets a blank back, so the next unit starts on its own sheet of paper
        if (pages.length === 1 && n < fitted.length - 1) {
          const blank = box("fx-sheet");
          blank.textContent = " ";
          sheets.append(blank);
        }
      });
    }

    input.oninput = apply;
    chips.forEach((c) => c.addEventListener("click", () => { unit = c.dataset.unit; apply(); }));
    if (printBtn) printBtn.addEventListener("click", () => window.print());
    window.addEventListener("beforeprint", () => { apply(); buildSheets(); });
    apply();
  }

  // Printing always uses the light colors (dark text on white paper), whatever the theme.
  function initPrint() {
    let restore = null;
    window.addEventListener("beforeprint", () => {
      const html = document.documentElement;
      if (html.getAttribute("data-theme") === "dark") { restore = "dark"; html.setAttribute("data-theme", "light"); }
    });
    window.addEventListener("afterprint", () => {
      if (restore) { document.documentElement.setAttribute("data-theme", restore); restore = null; }
    });
  }

  // ── Teacher Quotes page: quote of the day, filters, search ───────────────
  function initQuotesPage() {
    const spot = $("#quote-spotlight");
    if (!spot) return;
    const quotes = DATA.quotes || [];
    const cards = $$(".qcard"), groups = $$(".quote-group"), chips = $$(".qt-chip"), search = $("#qt-search");
    let filter = "all", shown = null;
    function showQuote(q) {
      if (!q) return;
      shown = q;
      const txt = $("#qs-text");
      txt.classList.remove("qc-in"); void txt.offsetWidth; txt.classList.add("qc-in");
      txt.textContent = q.text;
      $("#qs-who").innerHTML = "— " + esc(q.who || "Ms. Boppana") + (q.context ? `<small>${esc(q.context)}</small>` : "");
      $("#qs-kicker").textContent = q === quoteOfDay() ? "Quote of the day" : "Random quote";
      $("#qs-find").href = "#" + q.id;
    }
    // same quote as the home page: today's, or the one the home page's "All quotes" link passed along
    const wanted = new URLSearchParams(location.search).get("q");
    showQuote(quotes.find((q) => q.id === wanted) || quoteOfDay());
    $("#qs-shuffle").onclick = () => showQuote(randomQuote(quotes, shown));
    function apply() {
      const q = norm(search ? search.value.trim() : "");
      let any = false;
      cards.forEach((c) => {
        const hit = (filter === "all" || c.dataset.qcat === filter) && (!q || norm(c.textContent).includes(q));
        c.hidden = !hit; any = any || hit;
      });
      groups.forEach((g) => {
        const vis = $$(".qcard", g).some((c) => !c.hidden);
        g.hidden = !vis;
        const head = g.previousElementSibling;
        if (head && head.tagName === "H2") head.hidden = !vis;
      });
      $("#qt-empty").hidden = any;
    }
    chips.forEach((b) => { b.onclick = () => {
      filter = b.dataset.qfilter;
      chips.forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      apply();
    }; });
    if (search) search.addEventListener("input", apply);
    // "Find it below": make sure the card is showing, then highlight it
    $("#qs-find").addEventListener("click", () => {
      const id = $("#qs-find").getAttribute("href").slice(1);
      const card = document.getElementById(id);
      if (!card) return;
      if (card.hidden) {
        filter = "all"; if (search) search.value = "";
        chips.forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.qfilter === "all")));
        apply();
      }
      card.classList.remove("is-flash"); void card.offsetWidth; card.classList.add("is-flash");
    });
  }

  // ── app (PWA): offline, updates, toasts, back/share, continue reading ────
  // The service worker (sw.js, generated by wiki/pwa.py) saves every page for offline use.
  const MEDIA_CACHE = "apchem-media";
  const ROOT_PATH = new URL(ROOT).pathname;
  const pagePath = () => location.pathname.slice(ROOT_PATH.length);   // "units/05-thermodynamics/enthalpy/"
  const fmtMB = (b) => (b / 1048576 >= 10 ? Math.round(b / 1048576) : (b / 1048576).toFixed(1)) + " MB";
  let toastEl = null;
  function toast(msg, action, onAction, ms) {
    if (toastEl) toastEl.remove();
    const t = toastEl = document.createElement("div");
    t.className = "toast";
    t.setAttribute("role", "status");
    t.innerHTML = `<span class="toast-msg">${esc(msg)}</span>` +
      (action ? `<button type="button" class="btn btn-primary toast-act">${esc(action)}</button>` : "") +
      `<button type="button" class="toast-x" aria-label="Dismiss">${ICON.close}</button>`;
    document.body.appendChild(t);
    void t.offsetWidth;
    t.classList.add("is-on");
    if (action) $(".toast-act", t).onclick = () => { t.remove(); onAction(); };
    $(".toast-x", t).onclick = () => t.remove();
    if (ms) setTimeout(() => { if (t.isConnected) t.remove(); }, ms);
  }
  function initPWA() {
    // back button: an app opened from the Home Screen has no browser back button
    const back = $(".app-back");
    if (back && STANDALONE && pagePath() !== "") {
      back.hidden = false;
      back.onclick = () => { if (history.length > 1) history.back(); else location.href = ROOT; };
    }
    // share this page (iPhone share sheet, Android, Mac Safari…)
    const share = $(".share-btn");
    if (share && navigator.share) {
      share.hidden = false;
      share.onclick = () => navigator.share({ title: document.title, url: location.href.split("#")[0] }).catch(() => {});
    }
    // online / offline
    const pill = $(".offline-pill");
    const net = (quiet) => {
      if (pill) pill.hidden = navigator.onLine;
      if (!quiet) toast(navigator.onLine ? "Back online." : "You're offline. Saved pages still work.", null, null, 3500);
    };
    net(true);
    window.addEventListener("online", () => { net(false); if (swReg) swReg.update().catch(() => {}); });
    window.addEventListener("offline", () => net(false));
    // service worker: saves the site for offline use and picks up new versions
    const secure = location.protocol === "https:" || ["localhost", "127.0.0.1"].includes(location.hostname);
    if ("serviceWorker" in navigator && secure) {
      const hadController = !!navigator.serviceWorker.controller;
      navigator.serviceWorker.register(ROOT + "sw.js", { scope: ROOT }).then((reg) => {
        swReg = reg;
        // an app on the Home Screen may stay open for days: look for updates whenever it comes back
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible" && navigator.onLine) reg.update().catch(() => {});
        });
      }).catch(() => {});
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (hadController) toast("The app was updated with the newest notes.", "Refresh", () => location.reload());
        window.dispatchEvent(new Event("apchem-sw"));
      });
    }
    initReading();
  }
  // continue reading: remember the last notes page and how far down you were
  function initReading() {
    const path = pagePath();
    const last = store.get("lastRead", null);
    const card = $("#continue-reading");
    if (card && last && last.u && last.u !== path) {
      card.href = ROOT + last.u;
      $(".cr-title", card).textContent = last.t;
      $(".cr-bar span", card).style.width = Math.round((last.p || 0) * 100) + "%";
      card.hidden = false;
      card.onclick = () => { try { sessionStorage.setItem("apchem.resume", last.u); } catch (e) { /* private mode */ } };
    }
    const article = document.body.classList.contains("page-article") && $(".prose") && !["settings/", "offline/", "tags/"].includes(path);
    if (!article) return;
    let resume = null;
    try { resume = sessionStorage.getItem("apchem.resume"); sessionStorage.removeItem("apchem.resume"); } catch (e) { /* private mode */ }
    if (resume === path && last && last.u === path && !location.hash) {
      setTimeout(() => { window.scrollTo(0, (last.p || 0) * Math.max(0, html.scrollHeight - innerHeight)); }, 80);
    }
    const title = (($(".article-head h1") || {}).textContent || document.title).trim();
    const save = () => {
      const max = html.scrollHeight - innerHeight;
      store.set("lastRead", { u: path, t: title, p: max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0, at: Date.now() });
    };
    let timer = 0;
    window.addEventListener("scroll", () => { clearTimeout(timer); timer = setTimeout(save, 500); }, { passive: true });
    window.addEventListener("pagehide", save);
    setTimeout(save, 1500);
  }
  // Settings → App & offline
  async function mediaStatus() {
    const out = { total: 0, bytes: 0, saved: 0, list: [] };
    try {
      out.list = (await (await fetch(ROOT + "offline-media.json")).json()).files || [];
      out.total = out.list.length;
      out.bytes = out.list.reduce((a, f) => a + f.b, 0);
      if (window.caches) {
        const have = new Set((await (await caches.open(MEDIA_CACHE)).keys()).map((r) => new URL(r.url).pathname));
        out.list.forEach((f) => { f.saved = have.has(new URL(ROOT + f.u).pathname); });
        out.saved = out.list.filter((f) => f.saved).length;
      }
    } catch (e) { /* offline and never saved */ }
    return out;
  }
  async function refreshAppCard() {
    const card = $("#set-app");
    if (!card) return;
    const b = DATA.build || {};
    $("#app-version").textContent = "Version " + (b.date || "?") + (b.commit ? " · " + b.commit : "");
    const status = $("#app-status");
    if (!("serviceWorker" in navigator) || !window.caches) status.textContent = "This browser can't save pages for offline use.";
    else if (navigator.serviceWorker.controller) status.textContent = "✓ Offline ready: every notes page is saved on this device.";
    else status.textContent = "Getting offline ready… (this takes a few seconds the first time)";
    const inst = $("#app-install");
    if (STANDALONE) inst.innerHTML = "✓ Installed as an app on this device.";
    else if (IS_IOS) inst.innerHTML = "Install it: in Safari, tap <b>Share</b> " + ICON.share + " then <b>Add to Home Screen</b>.";
    else if (installPrompt) inst.innerHTML = '<button class="btn btn-primary" type="button" id="app-install-btn">' + icon("cellphone-arrow-down") + " Install app</button>";
    else inst.innerHTML = "Install it from your browser's menu (<b>Install app</b> or <b>Add to Home Screen</b>).";
    const ib = $("#app-install-btn");
    if (ib) ib.onclick = async () => { installPrompt.prompt(); await installPrompt.userChoice.catch(() => {}); installPrompt = null; refreshAppCard(); };
    const m = await mediaStatus();
    $("#app-save-all").textContent = m.saved >= m.total && m.total ? "✓ Everything saved" : `Save all for offline (${fmtMB(m.bytes)})`;
    $("#app-save-all").disabled = !!(m.total && m.saved >= m.total);
    let usage = "";
    try { const e = await navigator.storage.estimate(); usage = ` · ${fmtMB(e.usage || 0)} used on this device`; } catch (e) { /* not supported */ }
    $("#app-storage").textContent = `Scans & PDFs saved: ${m.saved} of ${m.total}${usage}`;
  }
  async function saveAllMedia() {
    const btn = $("#app-save-all"), bar = $("#app-progress");
    if (!window.caches) return;
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
    const m = await mediaStatus();
    const todo = m.list.filter((f) => !f.saved);
    if (!todo.length) { refreshAppCard(); return; }
    const cache = await caches.open(MEDIA_CACHE);
    const total = todo.reduce((a, f) => a + f.b, 0);
    let done = 0, failed = 0, next = 0;
    btn.disabled = true;
    bar.hidden = false; bar.max = total; bar.value = 0;
    const show = () => { bar.value = done; btn.textContent = `Saving… ${fmtMB(done)} of ${fmtMB(total)}`; };
    await Promise.all([0, 1, 2, 3].map(async () => {
      while (next < todo.length) {
        const f = todo[next++], url = ROOT + f.u;
        try {
          const res = await fetch(url, { cache: "no-cache" });
          if (res.ok) await cache.put(url, res); else failed++;
        } catch (e) { failed++; }
        done += f.b;
        show();
      }
    }));
    bar.hidden = true;
    btn.disabled = false;
    flash("#app-ok", failed ? `Saved, but ${failed} file(s) failed — try again when the connection is better.` : "✓ Everything is saved for offline.");
    refreshAppCard();
  }
  async function clearAndRefresh() {
    if (!confirm("Delete the app's saved copy and download everything fresh?\n\nYour name, settings, reading position and study time are kept. Saved scans will download again when you open them.")) return;
    try {
      if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
        await Promise.all((await navigator.serviceWorker.getRegistrations()).map((r) => r.unregister()));
      }
    } catch (e) { /* ignore */ }
    try { if (window.caches) await Promise.all((await caches.keys()).map((k) => caches.delete(k))); } catch (e) { /* ignore */ }
    location.reload();
  }
  // text size for the notes (A− / A+)
  const TEXT_STEPS = [0.85, 0.92, 1, 1.1, 1.2, 1.32, 1.45];
  function setTextScale(s) {
    store.set("textScale", s);
    if (s === 1) html.style.removeProperty("--prose-scale"); else html.style.setProperty("--prose-scale", s);
    const v = $("#ts-value"); if (v) v.textContent = Math.round(s * 100) + "%";
  }
  const icon = (name) => (ICON[name] || "");

  // ── saved pages: bookmarks + recently viewed (localStorage only) ─────────
  const NO_HISTORY = ["settings/", "offline/", "saved/"];
  const pageTitle = () => (($(".article-head h1") || {}).textContent || document.title).trim();
  const pageSection = () => { const c = $$(".crumbs a, .crumbs > span:not(.crumb-sep)"); return c.length > 1 ? c[c.length - 1].textContent.trim() : ""; };
  const listOf = (key) => { const v = store.get(key, []); return Array.isArray(v) ? v.filter((x) => x && typeof x.u === "string") : []; };
  const bookmarks = () => listOf("bookmarks");
  function relTime(t) {
    const s = (Date.now() - t) / 1000;
    if (s < 60) return "just now";
    if (s < 3600) return `${Math.floor(s / 60)} min ago`;
    if (s < 86400) return plural(Math.floor(s / 3600), "hour") + " ago";
    const d = Math.floor(s / 86400);
    return d === 1 ? "yesterday" : d < 7 ? `${d} days ago` : fmtDate(new Date(t));
  }
  const pageRow = (p, meta) => `<a class="recent-row" href="${esc(ROOT + p.u)}"><span class="rr-title">${esc(p.t || p.u)}</span>` +
    `<span class="rr-meta">${esc(meta || "")}</span></a>`;
  const canSave = () => document.body.classList.contains("page-article") && !!$(".article-head") && !NO_HISTORY.includes(pagePath());
  function toggleBookmark() {
    const path = pagePath();
    let list = bookmarks();
    if (list.some((b) => b.u === path)) {
      list = list.filter((b) => b.u !== path);
      toast("Removed from your saved pages.", null, null, 2500);
    } else {
      list.unshift({ u: path, t: pageTitle(), s: pageSection(), at: Date.now() });
      toast("Saved to your pages.", "View", () => { location.href = ROOT + "saved/"; }, 4000);
    }
    store.set("bookmarks", list);
    bookmarksChanged();
  }
  function syncBookmarkBtn() {
    const btn = $(".bookmark-btn");
    if (!btn || !canSave()) return;
    const on = bookmarks().some((b) => b.u === pagePath());
    btn.hidden = false;
    btn.setAttribute("aria-pressed", String(on));
    btn.title = on ? "Remove from saved pages" : "Save this page";
    btn.setAttribute("aria-label", btn.title);
  }
  // everywhere bookmarks show up: title button, home page, Saved Pages, tools panel
  let drawSavedPage = () => {};
  function bookmarksChanged() { syncBookmarkBtn(); renderYourPages(); drawSavedPage(); renderToolbarSaved(); }
  function initSaved() {
    const path = pagePath();
    const article = canSave();
    const btn = $(".bookmark-btn");
    if (btn && article) btn.onclick = toggleBookmark;
    syncBookmarkBtn();
    if (article) {
      const entry = { u: path, t: pageTitle(), s: pageSection(), at: Date.now() };
      store.set("recent", [entry].concat(listOf("recent").filter((r) => r.u !== path)).slice(0, 12));
      const bm = bookmarks(), i = bm.findIndex((b) => b.u === path); // keep saved titles current
      if (i >= 0 && (bm[i].t !== entry.t || bm[i].s !== entry.s)) { bm[i] = Object.assign(bm[i], { t: entry.t, s: entry.s }); store.set("bookmarks", bm); }
    }
    renderYourPages();
    renderSavedPage();
  }
  function renderYourPages() {
    const box = $("#your-pages");
    if (!box) return;
    const bm = bookmarks(), rec = listOf("recent");
    $("#yp-saved").hidden = !bm.length;
    $("#yp-recent").hidden = !rec.length;
    box.hidden = !bm.length && !rec.length;
    $("#yp-saved-list").innerHTML = bm.slice(0, 5).map((p) => pageRow(p, p.s)).join("") +
      (bm.length > 5 ? `<a class="yp-more" href="${ROOT}saved/">All ${bm.length} saved pages ${icon("arrow-right")}</a>` : "");
    $("#yp-recent-list").innerHTML = rec.slice(0, 5).map((p) => pageRow(p, relTime(p.at))).join("");
  }
  async function renderSavedPage() {
    const root = $("#saved-pages");
    if (!root) return;
    const draw = () => {
      const bm = bookmarks(), rec = listOf("recent");
      root.innerHTML = `
        <section class="set-card"><h3>${icon("bookmark-outline")} Saved pages <span class="sp-count">${bm.length || ""}</span></h3>
          ${bm.length ? `<div class="saved-list">${bm.map((p) => `<div class="saved-row">${pageRow(p, p.s)}<button type="button" class="icon-btn sp-remove" data-remove-bm="${esc(p.u)}" aria-label="Remove ${esc(p.t)} from saved pages" title="Remove">${ICON.close}</button></div>`).join("")}</div>`
            : `<p class="sp-empty">Nothing saved yet. Tap the bookmark ${icon("bookmark-outline")} next to any page's title to save it here.</p>`}
        </section>
        <section class="set-card"><h3>${icon("history")} Recently viewed</h3>
          ${rec.length ? `<div class="saved-list">${rec.map((p) => `<div class="saved-row">${pageRow(p, (p.s ? p.s + " · " : "") + relTime(p.at))}</div>`).join("")}</div>
            <div class="set-row"><button type="button" class="btn" id="sp-clear">Clear history</button></div>`
            : `<p class="sp-empty">Pages you read show up here.</p>`}
        </section>`;
      $$("[data-remove-bm]", root).forEach((b) => { b.onclick = () => { store.set("bookmarks", bookmarks().filter((x) => x.u !== b.dataset.removeBm)); bookmarksChanged(); }; });
      const clear = $("#sp-clear", root);
      if (clear) clear.onclick = () => { store.del("recent"); draw(); };
    };
    drawSavedPage = draw;
    draw();
    // refresh titles of saved pages that were renamed since (the search index is saved offline too)
    const pages = await loadIndex();
    if (!pages.length) return;
    const byUrl = new Map(pages.map((p) => [p.u, p.t]));
    let changed = false;
    const bm = bookmarks().map((b) => { const t = byUrl.get(b.u); if (t && t !== b.t) { changed = true; return Object.assign(b, { t }); } return b; });
    if (changed) { store.set("bookmarks", bm); draw(); }
  }

  // ── focus timer (Pomodoro): state in localStorage, so it keeps going across pages ──
  const FOCUS_PRESETS = [[25, 5], [50, 10], [15, 3]];
  const focusState = () => {
    const st = Object.assign({ mode: "focus", status: "idle", endsAt: 0, left: 0, preset: [25, 5], chime: true }, store.get("focus", {}));
    if (!Array.isArray(st.preset) || st.preset.length !== 2) st.preset = [25, 5];
    return st;
  };
  const phaseLen = (st, mode) => ((mode || st.mode) === "focus" ? st.preset[0] : st.preset[1]) * 60;
  const focusLeft = (st) => st.status === "running" ? Math.max(0, Math.ceil((st.endsAt - Date.now()) / 1000))
    : st.status === "paused" ? st.left : phaseLen(st);
  const focusing = () => { const st = focusState(); return st.mode === "focus" && st.status === "running"; };
  const mmss = (sec) => `${Math.floor(sec / 60)}:${pad(sec % 60)}`;
  const focusDays = () => { const f = store.get("focusDays", {}); return f && typeof f === "object" ? f : {}; };
  // finished (or stopped) focus time counts as study time, even if the screen was off
  function creditFocus(sec, finished) {
    sec = Math.round(sec);
    if (sec < 1 && !finished) return;
    const k = dayKey(), f = focusDays(), t = f[k] || { n: 0, s: 0 };
    t.s += sec; if (finished) t.n += 1;
    f[k] = t; store.set("focusDays", f);
    if (prefs().tracker) { const d = studyData(); d.days[k] = (d.days[k] || 0) + sec; store.set("study", d); }
  }
  let audioCtx = null;
  function unlockAudio() {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === "suspended") audioCtx.resume();
    } catch (e) { audioCtx = null; }
  }
  function chime() {
    if (!focusState().chime || !audioCtx) return;
    try {
      const t0 = audioCtx.currentTime;
      [659.25, 783.99, 1046.5].forEach((f, i) => {
        const o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.type = "sine"; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t0 + i * 0.18);
        g.gain.exponentialRampToValueAtTime(0.25, t0 + i * 0.18 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + i * 0.18 + 0.9);
        o.connect(g).connect(audioCtx.destination);
        o.start(t0 + i * 0.18); o.stop(t0 + i * 0.18 + 1);
      });
    } catch (e) { /* no audio */ }
  }
  function focusStart(mode) {
    unlockAudio();
    const st = focusState();
    if (mode) st.mode = mode;
    const left = st.status === "paused" && !mode ? st.left : phaseLen(st);
    store.set("focus", Object.assign(st, { status: "running", endsAt: Date.now() + left * 1000, left: 0 }));
    focusTick();
  }
  function focusPause() {
    const st = focusState();
    if (st.status !== "running") return;
    store.set("focus", Object.assign(st, { status: "paused", left: focusLeft(st), endsAt: 0 }));
    focusTick();
  }
  // stop the current phase: a stopped focus phase still counts the minutes done so far
  function focusStop(next) {
    const st = focusState();
    if (st.mode === "focus" && st.status !== "idle") creditFocus(phaseLen(st) - focusLeft(st), false);
    store.set("focus", Object.assign(st, { mode: next || "focus", status: "idle", endsAt: 0, left: 0 }));
    focusTick();
  }
  function focusFinish(st) {
    const len = phaseLen(st), was = st.mode;
    store.set("focus", Object.assign(st, { mode: was === "focus" ? "break" : "focus", status: "idle", endsAt: 0, left: 0 }));
    if (was === "focus") {
      creditFocus(len, true);
      toast(`Focus session done (+${fmtDur(len)} study time). Time for a break.`, "Start break", () => focusStart("break"));
    } else {
      toast("Break's over. Ready for another focus session?", "Start focus", () => focusStart("focus"));
    }
    chime();
  }
  let focusTimer = 0, baseTitle = document.title;
  function focusTick() {
    let st = focusState();
    if (st.status === "running" && Date.now() >= st.endsAt) { focusFinish(st); st = focusState(); }
    const left = focusLeft(st), active = st.status !== "idle";
    const pill = $(".focus-pill");
    if (pill) {
      pill.hidden = !active || pagePath() === "focus/" || (toolOpen() === "focus" && TOOLS_MQ.matches); // the panel shows the time
      pill.classList.toggle("is-break", st.mode === "break");
      pill.classList.toggle("is-paused", st.status === "paused");
      $(".fp-label", pill).textContent = st.mode === "break" ? "Break" : "";
      $(".fp-time", pill).textContent = mmss(left);
      pill.title = `${st.mode === "focus" ? "Focus" : "Break"}: ${mmss(left)} left${st.status === "paused" ? " (paused)" : ""}`;
    }
    const toolBtn = $('[data-tool-btn="focus"]');
    if (toolBtn) {
      toolBtn.style.setProperty("--fc-level", `${Math.round(focusLevel(st, left) * 100)}%`);
      toolBtn.classList.toggle("is-running", active);
      toolBtn.classList.toggle("is-break", st.mode === "break");
      toolBtn.classList.toggle("is-paused", st.status === "paused");
      toolBtn.title = active ? `Focus Timer: ${mmss(left)} left` : "Focus Timer";
    }
    const page = $("#focus-timer"), panel = $("#tb-focus");
    if (page) renderFocus(page, st, left, false);
    if (panel && toolOpen() === "focus") renderFocus(panel, st, left, true);
    clearInterval(focusTimer);
    if (st.status === "running") focusTimer = setInterval(focusTick, 1000);
  }
  // how full the vessel is: focus time fills it, a break drains it
  const focusLevel = (st, left) => { const p = left / phaseLen(st); return st.mode === "focus" ? 1 - p : p; };
  // The timer's vessel: a burette drips into it while you focus, and it bubbles and drains during a break.
  // The surface is a row of spring-linked columns that drops and bubbles disturb. It only animates while on screen.
  function createVessel(box) {
    const canvas = $(".fv-canvas", box), wet = $(".fv-wet", box), ctx = canvas.getContext("2d");
    const N = Math.round(Math.max(48, Math.min(120, box.clientWidth / 5.6))), STEP = 1 / 60;
    const hs = new Float32Array(N), vs = new Float32Array(N);
    const inPanel = !!box.closest("#tb-panel"), fullPage = !!box.closest(".fs");
    let K = 1, TIP_Y = 11, TOP = 6; // K scales the drops, burette and markings up in a taller vessel
    let CEIL = 0, LEFT = 0, RIGHT = 0; // the full-page vessel runs behind the top bar, sidebar and tools panel
    const FOCUS = [[124, 58, 237], [91, 33, 182]], BREAK = [[4, 120, 87], [6, 95, 70]], PAUSED = [[110, 104, 130], [88, 83, 106]];
    const lerp = (a, b, k) => a + (b - a) * k;
    const mix = (a, b, k) => a.map((x, i) => lerp(x, b[i], k));
    const rgb = (c, a = 1) => `rgba(${c.map(Math.round).join(",")},${a})`;
    const rand = (a, b) => a + Math.random() * (b - a);
    let W = 0, H = 0, dpr = 1, level = null, target = 0, state = { mode: "focus", status: "idle", minutes: 25 };
    let breakMix = 0, pauseMix = 0, amp = 0, clock = 0, acc = 0, raf = 0, last = 0, dripIn = 0.9, bubbleIn = 0, pendant = 0;
    let drops = [], bubbles = [], ink = {};
    const readInk = () => { const c = getComputedStyle(box); ink = { line: c.getPropertyValue("--line-2").trim(), label: c.getPropertyValue("--fg-3").trim() }; };
    const tipX = () => Math.round(fullPage ? LEFT + (W - LEFT - RIGHT) * 0.8 : W * 0.62); // beside the time, so drops don't fall through it
    function insets() {
      if (!fullPage) return;
      const nav = $(".site-nav"), bar = $(".topbar");
      CEIL = bar ? bar.offsetHeight : 0;
      LEFT = nav && TOOLS_MQ.matches ? nav.offsetWidth : 0;
      RIGHT = parseFloat(getComputedStyle(html).getPropertyValue("--tb-space")) || 0;
    }
    const surfaceY = () => H - level * (H - TOP);
    const colOf = (x) => Math.max(0, Math.min(N - 1, Math.round((x / W) * (N - 1))));
    function yAt(i) {
      const k = Math.min(1, level * 20); // an empty vessel has a flat, still floor
      const meniscus = 2.6 * K * (Math.exp(-i / 2.2) + Math.exp(-(N - 1 - i) / 2.2));
      const swell = (Math.sin(i * 0.34 + clock * 1.5) + 0.6 * Math.sin(i * 0.13 - clock * 0.9)) * amp * K;
      return surfaceY() + (hs[i] + swell - meniscus) * k;
    }
    function poke(i, force) {
      for (let j = -2; j <= 2; j++) { const c = i + j; if (c >= 0 && c < N) vs[c] += force * K * (1 - Math.abs(j) / 3); }
    }
    function step(dt) {
      clock += dt;
      const running = state.status === "running", calm = reduceMotion();
      level += (target - level) * (1 - Math.exp(-dt * 2.5));
      breakMix = lerp(breakMix, state.mode === "break" ? 1 : 0, 1 - Math.exp(-dt * 4));
      pauseMix = lerp(pauseMix, state.status === "paused" ? 1 : 0, 1 - Math.exp(-dt * 4));
      amp = lerp(amp, calm ? 0 : running ? 1 : 0.25, 1 - Math.exp(-dt * 3));
      for (let i = 0; i < N; i++) { vs[i] += -0.03 * hs[i] - 0.035 * vs[i]; hs[i] = Math.max(-9 * K, Math.min(9 * K, hs[i] + vs[i])); }
      for (let p = 0; p < 2; p++) for (let i = 1; i < N; i++) { const d = 0.12 * (hs[i] - hs[i - 1]); vs[i - 1] += d; vs[i] -= d; }
      // a drop swells at the burette tip, lets go, and lands with a splash
      pendant = 0;
      if (running && state.mode === "focus" && !calm && surfaceY() > TIP_Y + 8 * K) {
        dripIn -= dt;
        if (dripIn < 0.55) pendant = 1 - Math.max(0, dripIn) / 0.55;
        if (dripIn <= 0) { drops.push({ x: tipX(), y: TIP_Y + 2 * K, vx: 0, vy: 10, r: 2.4 * K, main: true }); dripIn = rand(1.3, 2); }
      }
      const splash = [];
      drops = drops.filter((d) => {
        d.vy += 620 * K * dt; d.x += d.vx * dt; d.y += d.vy * dt;
        const c = colOf(d.x);
        if (d.y < yAt(c)) return d.x > 0 && d.x < W;
        poke(c, d.main ? 1.9 : 0.25);
        if (d.main) for (let n = 0; n < 4 + (fullPage ? 3 : 0); n++) splash.push({ x: d.x, y: yAt(c) - 2, vx: rand(-48, 48) * K, vy: rand(-125, -55) * K, r: rand(0.8, 1.4) * K, main: false });
        return false;
      }).concat(splash);
      // bubbles rise through the liquid during a break, and all the time in the full-page vessel
      if (running && (state.mode === "break" || fullPage) && !calm && level > 0.08) {
        bubbleIn -= dt;
        if (bubbleIn <= 0) {
          bubbles.push({ x: rand(14, W - 34 * K), y: H - 2, r: rand(0.9, 2.1) * Math.min(K, 1.8), vy: rand(14, 28) * K, w: rand(0, 6) });
          bubbleIn = rand(0.25, 0.7) * Math.min(1, 270 / W) * (state.mode === "break" ? 1 : 2.5);
        }
      }
      bubbles = bubbles.filter((b) => {
        b.y -= b.vy * dt; b.x += Math.sin(clock * 3 + b.w) * 0.14;
        if (b.y > yAt(colOf(b.x)) + 2) return true;
        poke(colOf(b.x), -0.22);
        return false;
      });
    }
    function trace(lift) {
      ctx.beginPath(); ctx.moveTo(0, H);
      for (let i = 0; i < N; i++) ctx.lineTo((i / (N - 1)) * W, yAt(i) + lift(i));
      ctx.lineTo(W, H); ctx.closePath();
    }
    function ticks(line, label) {
      const min = state.minutes, by = min <= 5 ? 1 : min <= 10 ? 2 : min <= 25 ? 5 : 10, S = Math.min(K, 1.6), X = W - RIGHT;
      ctx.font = `500 ${Math.round(9 * S)}px Geist, system-ui, sans-serif`; ctx.textAlign = "right"; ctx.textBaseline = "middle";
      for (let m = by; m < min; m += by) {
        const y = Math.round(H - (m / min) * (H - TOP));
        ctx.fillStyle = line; ctx.fillRect(X - 9 * S, y, 9 * S, 1);
        ctx.fillStyle = label; ctx.fillText(String(m), X - 12 * S, y + 0.5);
      }
      // a tall vessel has room for a finer scale
      const fine = K > 1.5 ? (by >= 5 ? by / 5 : by === 2 ? 1 : 0) : 0;
      if (fine) for (let m = fine; m < min; m += fine) {
        if (m % by) { ctx.fillStyle = line; ctx.fillRect(X - 5 * S, Math.round(H - (m / min) * (H - TOP)), 5 * S, 1); }
      }
    }
    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ticks(ink.line, ink.label);
      const tone = (n) => mix(mix(FOCUS[n], BREAK[n], breakMix), PAUSED[n], pauseMix);
      const top = tone(0), wetNow = level > 0.002;
      if (wetNow) {
        trace((i) => (-2.5 + Math.sin(i * 0.22 + clock * 1.1) * 1.2 * amp) * K);
        ctx.fillStyle = rgb(top, 0.35); ctx.fill();
        trace(() => 0);
        const fill = ctx.createLinearGradient(0, surfaceY(), 0, H);
        fill.addColorStop(0, rgb(top)); fill.addColorStop(1, rgb(tone(1)));
        ctx.fillStyle = fill; ctx.fill();
        ctx.save(); ctx.clip();
        ticks("rgba(255,255,255,.5)", "rgba(255,255,255,.75)");
        ctx.fillStyle = "rgba(255,255,255,.4)";
        bubbles.forEach((b) => { ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill(); });
        ctx.restore();
        ctx.beginPath();
        for (let i = 0; i < N; i++) ctx.lineTo((i / (N - 1)) * W, yAt(i));
        ctx.strokeStyle = "rgba(255,255,255,.42)"; ctx.lineWidth = 1; ctx.stroke();
      }
      ctx.fillStyle = rgb(top);
      drops.forEach((d) => { ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill(); });
      const x = tipX();
      if (pendant > 0) { const r = 2.4 * K * pendant; ctx.beginPath(); ctx.arc(x, TIP_Y + r * 0.7, r, 0, Math.PI * 2); ctx.fill(); }
      ctx.beginPath(); ctx.moveTo(x - 4 * K, CEIL); ctx.lineTo(x + 4 * K, CEIL); ctx.lineTo(x + 1.5 * K, TIP_Y); ctx.lineTo(x - 1.5 * K, TIP_Y); ctx.closePath();
      ctx.fillStyle = ink.line; ctx.fill();
      // the white copy of the time shows only where the liquid covers it
      if (!wetNow) { wet.style.clipPath = "inset(100% 0 0 0)"; return; }
      const pts = [];
      for (let i = 0; i < N; i += 3) pts.push(`${((i / (N - 1)) * W).toFixed(1)}px ${yAt(i).toFixed(1)}px`);
      pts.push(`${W}px ${yAt(N - 1).toFixed(1)}px`, `${W}px ${H}px`, `0px ${H}px`);
      wet.style.clipPath = `polygon(${pts.join(",")})`;
    }
    const busy = () => state.status === "running" || drops.length || bubbles.length || Math.abs(target - level) > 0.002 ||
      vs.some((v) => Math.abs(v) > 0.01) || Math.abs(breakMix - (state.mode === "break" ? 1 : 0)) > 0.01 || Math.abs(pauseMix - (state.status === "paused" ? 1 : 0)) > 0.01;
    const onScreen = () => canvas.offsetParent && (!inPanel || toolOpen() === "focus");
    function fit() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || (w === W && h === H)) return;
      insets();
      W = w; H = h; K = Math.max(1, Math.min(2.4, H / 116)); TIP_Y = CEIL + 11 * K; TOP = CEIL + 6 * K;
      dpr = Math.min(W > 600 ? 1.5 : 2, window.devicePixelRatio || 1); // a full-page canvas doesn't need every pixel
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    }
    function frame(now) {
      raf = 0;
      if (!onScreen()) return;
      acc += Math.min(0.1, (now - last) / 1000); last = now;
      while (acc >= STEP) { step(STEP); acc -= STEP; }
      draw();
      if (busy() && !reduceMotion()) raf = requestAnimationFrame(frame);
    }
    const wake = () => { if (!raf && onScreen()) { last = performance.now(); raf = requestAnimationFrame(frame); } };
    readInk();
    new MutationObserver(() => { readInk(); insets(); wake(); }).observe(html, { attributes: true, attributeFilter: ["data-theme", "data-tool"] });
    // resizing clears a canvas, so redraw right away to avoid a blank frame
    if (window.ResizeObserver) new ResizeObserver(() => { fit(); if (level !== null && W) draw(); wake(); }).observe(box);
    return {
      set(s) {
        state = s; target = s.level;
        if (level === null || reduceMotion()) { // arriving on a page: already at the right level, no filling animation
          level = target; breakMix = s.mode === "break" ? 1 : 0; pauseMix = s.status === "paused" ? 1 : 0;
        }
        fit();
        wake();
      },
    };
  }
  const focusVesselHTML = () => `
    <div class="fv">
      <canvas class="fv-canvas" aria-hidden="true"></canvas>
      <div class="fv-read"><span class="fc-time" role="timer">25:00</span><span class="fc-status"><span class="fc-phase">Focus</span><span class="fc-sub"></span></span></div>
      <div class="fv-read fv-wet" aria-hidden="true"><span class="fc-time-wet">25:00</span><span class="fc-status"><span class="fc-phase-wet">Focus</span><span class="fc-sub-wet"></span></span></div>
    </div>`;
  const focusControlsHTML = () => `
    <div class="focus-actions">
      <button type="button" class="btn btn-primary fc-main">Start focus</button>
      <button type="button" class="btn fc-skip">Skip</button>
      <button type="button" class="btn fc-reset">Reset</button>
    </div>
    <div class="fc-opts">
      <div class="focus-presets" role="group" aria-label="Focus and break length">
        ${FOCUS_PRESETS.map((p, i) => `<button type="button" class="btn" data-preset="${i}" title="${p[0]} min focus, ${p[1]} min break" aria-label="${p[0]} minutes focus, ${p[1]} minutes break">${p[0]}/${p[1]}</button>`).join("")}
      </div>
      <label class="set-check" title="Play a chime when a session ends"><input type="checkbox" class="fc-chime"> Chime</label>
    </div>
    <div class="fc-stats">
      <span><b class="fc-n">0</b> sessions</span><span><b class="fc-today">0m</b> today</span><span><b class="fc-week">0m</b> this week</span>
    </div>`;
  // draws the timer on its page (#focus-timer) or in the tools panel (compact)
  function renderFocus(root, st, left, compact) {
    const q = (c) => $("." + c, root);
    if (!root.dataset.ready) {
      root.dataset.ready = "1";
      root.innerHTML = focusVesselHTML() + (compact ? focusControlsHTML() : `<div class="fs-dock">${focusControlsHTML()}</div>`);
      $$("[data-preset]", root).forEach((b) => { b.onclick = () => {
        const s = focusState();
        if (s.status !== "idle") return;
        store.set("focus", Object.assign(s, { preset: FOCUS_PRESETS[+b.dataset.preset] }));
        focusTick();
      }; });
      q("fc-main").onclick = () => { const s = focusState(); if (s.status === "running") focusPause(); else focusStart(); };
      q("fc-skip").onclick = () => { const s = focusState(); focusStop(s.mode === "focus" ? "break" : "focus"); focusStart(); };
      q("fc-reset").onclick = () => focusStop("focus");
      q("fc-chime").onchange = (e) => { store.set("focus", Object.assign(focusState(), { chime: e.target.checked })); if (e.target.checked) unlockAudio(); };
    }
    const len = phaseLen(st);
    root.classList.toggle("is-break", st.mode === "break");
    q("fc-phase").textContent = st.mode === "focus" ? "Focus" : "Break";
    q("fc-time").textContent = mmss(left);
    q("fc-sub").textContent = st.status === "paused" ? "Paused" : st.status === "running" ? `ends ${new Date(st.endsAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}` : "Ready";
    q("fc-main").textContent = st.status === "running" ? "Pause" : st.status === "paused" ? "Resume" : st.mode === "focus" ? "Start focus" : "Start break";
    q("fc-reset").disabled = st.status === "idle" && st.mode === "focus";
    $$("[data-preset]", root).forEach((b) => {
      const p = FOCUS_PRESETS[+b.dataset.preset];
      b.setAttribute("aria-pressed", String(p[0] === st.preset[0] && p[1] === st.preset[1]));
      b.disabled = st.status !== "idle";
    });
    q("fc-chime").checked = !!st.chime;
    const f = focusDays(), today = f[dayKey()] || { n: 0, s: 0 };
    const monday = startOfDay(now()); monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
    let week = 0;
    for (let d = new Date(monday); d <= now(); d.setDate(d.getDate() + 1)) week += (f[dayKey(d)] || {}).s || 0;
    q("fc-n").textContent = today.n;
    q("fc-today").textContent = fmtDur(today.s);
    q("fc-week").textContent = fmtDur(week);
    if (!compact) document.title = st.status === "running" ? `${mmss(left)} · ${st.mode === "focus" ? "Focus" : "Break"}` : baseTitle;
    ["time", "phase", "sub"].forEach((k) => { q(`fc-${k}-wet`).textContent = q(`fc-${k}`).textContent; });
    root._vessel = root._vessel || createVessel($(".fv", root));
    root._vessel.set({ level: focusLevel(st, left), mode: st.mode, status: st.status, minutes: len / 60 });
  }
  function initFocus() {
    focusTick();
    document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") focusTick(); });
    window.addEventListener("storage", (e) => { if (e.key === "apchem.focus") focusTick(); });
    // iOS only plays sound after a tap on this page: unlock audio on the first touch while a timer runs
    document.addEventListener("pointerdown", () => { if (focusState().status !== "idle") unlockAudio(); }, { once: true, passive: true });
  }

  // ── Molar Mass Calculator ────────────────────────────────────────────────
  const SUBSCRIPTS = /[₀₁₂₃₄₅₆₇₈₉]/g;
  function parseFormula(raw, EL) {
    let s = String(raw || "").replace(SUBSCRIPTS, (c) => String(c.charCodeAt(0) - 0x2080)).replace(/[·•∙⋅*]/g, ".").replace(/\s+/g, "");
    const notes = [];
    const state = /\((s|l|g|aq)\)$/i.exec(s);
    if (state) { s = s.slice(0, state.index); notes.push(`The state symbol (${state[1]}) doesn't change the molar mass.`); }
    const charge = /\^.*$|[+-]+$/.exec(s);
    if (charge && s.length > charge[0].length) { s = s.slice(0, charge.index); notes.push("The charge is ignored: electrons have almost no mass."); }
    if (!s) return null;
    const counts = {};
    const add = (into, from, k) => { Object.keys(from).forEach((e) => { into[e] = (into[e] || 0) + from[e] * k; }); };
    s.split(".").forEach((part, pi) => {
      if (!part) throw new Error(pi ? "Something is missing after the dot." : "Something is missing before the dot.");
      let i = 0;
      const num = () => { const m = /^\d+/.exec(part.slice(i)); if (!m) return 1; i += m[0].length; const n = parseInt(m[0], 10); if (!n) throw new Error("A number in a formula can't be 0."); return n; };
      const coef = num();
      const seq = (close) => {
        const c = {};
        while (i < part.length) {
          const ch = part[i];
          if (ch === "(" || ch === "[") { i++; const inner = seq(ch === "(" ? ")" : "]"); add(c, inner, num()); continue; }
          if (ch === ")" || ch === "]") {
            if (ch !== close) throw new Error(close ? `Expected "${close}" but found "${ch}".` : `There's a "${ch}" without a matching opening bracket.`);
            i++; return c;
          }
          const m = /^[A-Z][a-z]?/.exec(part.slice(i));
          if (!m) {
            if (/[a-z]/.test(ch)) throw new Error("Element symbols start with a capital letter: CO is carbon monoxide, Co is cobalt.");
            if (/\d/.test(ch)) throw new Error("A number has to come after an element or a bracket.");
            throw new Error(`"${ch}" can't be part of a formula.`);
          }
          const sym = m[0];
          if (!EL[sym]) throw new Error(`"${sym}" isn't an element symbol.`);
          if (EL[sym].v === null) throw new Error(`${EL[sym].name} (${sym}) has no atomic mass on the AP periodic table.`);
          i += sym.length;
          c[sym] = (c[sym] || 0) + num();
        }
        if (close) throw new Error(`Missing "${close}".`);
        return c;
      };
      add(counts, seq(""), coef);
    });
    const rows = Object.keys(counts).map((sym) => ({ sym, name: EL[sym].name, m: EL[sym].m, n: counts[sym], sub: counts[sym] * EL[sym].v }));
    const total = rows.reduce((a, r) => a + r.sub, 0);
    rows.forEach((r) => { r.pct = (r.sub / total) * 100; });
    return { rows, total, notes, display: s.replace(/\./g, "*") + (charge && charge[0].startsWith("^") ? charge[0] : charge ? "^" + charge[0] : "") };
  }
  // n significant figures, as TeX (8.8\cdot10^{-12}) for the KaTeX lines
  function sigTex(x, n = 4) {
    if (!isFinite(x)) return "?";
    const p = x.toPrecision(n); // "1.6e+2" when the sig figs can't be shown as a plain number
    if (x !== 0 && (Math.abs(x) >= 1e5 || Math.abs(x) < 1e-3 || p.includes("e"))) {
      const [a, b] = x.toExponential(n - 1).split("e");
      return `${a}\\cdot10^{${+b}}`;
    }
    return p.replace(/^(\d+)\.$/, "$1");
  }
  const sigText = (x, n = 4) => sigTex(x, n).replace("\\cdot10^{", "e").replace("}", "");
  function texInto(el, tex) {
    if (window.katex) { try { window.katex.render(tex, el, { throwOnError: false }); return; } catch (e) { /* fall through */ } }
    el.textContent = tex;
  }
  const MM_FIELDS = ["mm-g", "mm-mol", "mm-n"];
  function initMolarMass() {
    const root = $("#molar-mass");
    if (root) mountMolarMass(root, false);
  }
  // the calculator on its page, or compact in the tools panel (which remembers what's typed, from page to page)
  function mountMolarMass(root, compact) {
    const q = (c) => $("." + c, root);
    const EL = {};
    (DATA.elements || []).forEach(([s, name, m]) => { EL[s] = { name, m, v: m ? parseFloat(m) : null }; });
    const EXAMPLES = ["H2O", "C6H12O6", "Ca(NO3)2", "CuSO4·5H2O", "(NH4)3PO4", "Fe2(SO4)3"];
    const inputId = compact ? "tb-mm-input" : "mm-input";
    root.innerHTML = `
      <form class="mm-form" autocomplete="off">
        <label for="${inputId}">Formula</label>
        <div class="mm-row"><input id="${inputId}" class="mm-input" type="text" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="${compact ? "Type a formula, e.g. Ca(NO3)2" : "e.g. Ca(NO3)2 or CuSO4·5H2O"}">
          ${compact ? "" : `<button class="btn btn-primary" type="submit">Calculate</button>`}</div>
        <div class="mm-chips"></div>
      </form>
      <div class="mm-out" aria-live="polite"></div>`;
    const input = q("mm-input"), out = q("mm-out");
    let cur = null, curF = "", conv = { from: "", val: "" };
    const saveDraft = () => { if (compact) store.set("toolbarMolar", { f: input.value, from: conv.from, val: conv.val }); };
    const recentFormulas = () => listOf("mmHistory").map((x) => x.u);
    const chips = () => {
      const h = recentFormulas();
      const tries = compact && h.length ? [] : EXAMPLES.filter((f) => !h.includes(f));
      const label = (t) => (compact ? "" : `<span class="mm-chip-label">${t}</span>`);
      q("mm-chips").innerHTML = (h.length ? `${label("Recent")}${h.map((f) => `<button type="button" class="chip" data-f="${esc(f)}">${esc(f)}</button>`).join("")}` : "") +
        (tries.length ? `${label("Try")}${tries.map((f) => `<button type="button" class="chip" data-f="${esc(f)}">${esc(f)}</button>`).join("")}` : "");
      $$("[data-f]", root).forEach((b) => { b.onclick = () => { input.value = b.dataset.f; calc(true); }; });
    };
    const remember = (f) => { store.set("mmHistory", [{ u: f }].concat(listOf("mmHistory").filter((x) => x.u !== f)).slice(0, 6)); chips(); };
    function calc(save) {
      const f = input.value.trim();
      saveDraft();
      if (!compact) { try { window.history.replaceState(null, "", f ? "?f=" + encodeURIComponent(f) : location.pathname); } catch (e) { /* file:// */ } }
      if (!f) { out.innerHTML = ""; cur = null; return; }
      let r;
      try { r = parseFormula(f, EL); } catch (e) { out.innerHTML = `<p class="mm-error">${icon("alert-outline")} ${esc(e.message)}</p>`; cur = null; return; }
      if (!r) { out.innerHTML = ""; return; }
      cur = r; curF = f;
      const total = r.total.toFixed(2);
      out.innerHTML = `
        <div class="mm-result">
          <div class="mm-formula"></div>
          <div class="mm-total"><span>Molar mass</span><b>${total}</b> g/mol</div>
          <div class="mm-work"></div>
          ${r.notes.map((n) => `<p class="set-hint">${esc(n)}</p>`).join("")}
        </div>
        <div class="table-wrap"><table class="mm-table"><thead><tr><th>Element</th><th>Count</th><th>Atomic mass</th><th>Subtotal</th><th>Mass %</th></tr></thead>
          <tbody>${r.rows.map((x) => `<tr><td><b>${esc(x.sym)}</b> <span class="mm-name">${esc(x.name)}</span></td><td>${x.n}</td><td>${esc(x.m)}</td><td>${x.sub.toFixed((x.m.split(".")[1] || "").length)}</td><td>${x.pct.toFixed(2)}%</td></tr>`).join("")}</tbody>
          <tfoot><tr><td>Total</td><td></td><td></td><td>${total}</td><td>100%</td></tr></tfoot></table></div>
        <section class="mm-conv">
          <h3>Convert</h3>
          <div class="mm-conv-row">
            <label>Grams <input type="text" inputmode="decimal" class="mm-g" placeholder="g"></label>
            <label>Moles <input type="text" inputmode="decimal" class="mm-mol" placeholder="mol"></label>
            <label>Particles <input type="text" inputmode="decimal" class="mm-n" placeholder="${compact ? "3.01e23" : "e.g. 3.01e23"}"></label>
          </div>
          <div class="mm-chain"></div>
          <p class="set-hint mm-sf"></p>
        </section>`;
      texInto(q("mm-formula"), `\\ce{${r.display.replace(/[^A-Za-z0-9()[\]*^+\-]/g, "")}}`);
      texInto(q("mm-work"), r.rows.map((x) => (x.n === 1 ? x.m : `${x.n}(${x.m})`)).join(" + ") + ` = ${total}\\ \\text{g/mol}`);
      MM_FIELDS.forEach((id) => { q(id).oninput = () => { conv = { from: id, val: q(id).value }; saveDraft(); convert(id); }; });
      if (compact && conv.val) { q(conv.from).value = conv.val; convert(conv.from); } // keep the amount you typed
      if (save) remember(f);
    }
    // significant figures in a typed number ("50.0" → 3, "0.25" → 2, "3.01x10^23" → 3, "50" → 1)
    const sigOf = (v) => {
      const m = String(v).replace(/\s+/g, "").split(/[eE]|[x×*·]10/)[0].replace(/^[+-]/, "");
      let d = m.replace(".", "").replace(/^0+/, "");
      if (!m.includes(".")) d = d.replace(/0+$/, "");
      return d.length || 1;
    };
    const parseNum = (v) => {
      const s = String(v).replace(/\s+/g, "").replace(/,/g, "");
      const m = /^(\d*\.?\d+)(?:(?:[x×*·]10\^?|e)([+-]?\d+))?$/i.exec(s);
      return m ? parseFloat(m[1]) * Math.pow(10, m[2] ? +m[2] : 0) : NaN;
    };
    function convert(from) {
      if (!cur) return;
      const M = +cur.total.toFixed(2), NA = 6.022e23;
      const raw = q(from).value, val = parseNum(raw);
      const typed = sigOf(raw), sf = Math.min(4, Math.max(3, typed)); // like the number you typed, 3–4 sig figs
      const chain = q("mm-chain");
      if (!(val > 0)) { chain.innerHTML = ""; q("mm-sf").textContent = ""; return; }
      const mol = from === "mm-g" ? val / M : from === "mm-mol" ? val : val / NA;
      const g = mol * M, n = mol * NA;
      if (from !== "mm-g") q("mm-g").value = sigText(g, sf);
      if (from !== "mm-mol") q("mm-mol").value = sigText(mol, sf);
      if (from !== "mm-n") q("mm-n").value = sigText(n, sf);
      const Mt = `${M.toFixed(2)}\\ \\text{g}`, NAt = "6.022\\cdot10^{23}";
      const tex = from === "mm-g"
        ? `${sigTex(val, sf)}\\ \\text{g}\\cdot\\dfrac{1\\ \\text{mol}}{${Mt}} = ${sigTex(mol, sf)}\\ \\text{mol}\\cdot\\dfrac{${NAt}}{1\\ \\text{mol}} = ${sigTex(n, sf)}\\ \\text{particles}`
        : from === "mm-mol"
          ? `${sigTex(val, sf)}\\ \\text{mol}\\cdot\\dfrac{${Mt}}{1\\ \\text{mol}} = ${sigTex(g, sf)}\\ \\text{g} \\qquad ${sigTex(val, sf)}\\ \\text{mol}\\cdot\\dfrac{${NAt}}{1\\ \\text{mol}} = ${sigTex(n, sf)}\\ \\text{particles}`
          : `${sigTex(val, sf)}\\ \\text{particles}\\cdot\\dfrac{1\\ \\text{mol}}{${NAt}} = ${sigTex(mol, sf)}\\ \\text{mol}\\cdot\\dfrac{${Mt}}{1\\ \\text{mol}} = ${sigTex(g, sf)}\\ \\text{g}`;
      texInto(chain, tex);
      q("mm-sf").textContent = `Rounded to ${sf} significant figures${typed === sf ? ", like the number you typed" : ""}.`;
    }
    let t = 0;
    input.oninput = () => { saveDraft(); clearTimeout(t); t = setTimeout(() => calc(false), 250); };
    input.onblur = () => { if (cur && curF === input.value.trim()) remember(curF); };
    q("mm-form").onsubmit = (e) => { e.preventDefault(); calc(true); input.blur(); };
    chips();
    if (compact) {
      root._restore = () => {
        const s = store.get("toolbarMolar", null) || {};
        input.value = String(s.f || "");
        conv = MM_FIELDS.includes(s.from) ? { from: s.from, val: String(s.val || "") } : { from: "", val: "" };
        calc(false);
      };
      root._restore();
      return;
    }
    const fromUrl = new URLSearchParams(location.search).get("f");
    if (fromUrl) { input.value = fromUrl; calc(false); }
  }

  // ── Glossary filter ──────────────────────────────────────────────────────
  function initGlossaryFilter() {
    const input = $(".glossary-filter");
    if (!input) return;
    const count = $(".gl-count"), label = count ? count.textContent : "";
    let texts = null;
    input.oninput = () => {
      if (!texts) texts = new Map($$(".gl-entry").map((e) => [e, norm($("dt", e).textContent + " " + $$("dd:not(.gl-src)", e).map((d) => d.textContent).join(" ")).replace(/\s+/g, " ")]));
      const q = norm(input.value.trim()).replace(/\s+/g, " ");
      let shown = 0;
      $$(".gl-letter").forEach((sec) => {
        let any = false;
        $$(".gl-entry", sec).forEach((e) => { const hit = !q || texts.get(e).includes(q); e.hidden = !hit; if (hit) { any = true; shown++; } });
        sec.hidden = !any;
      });
      const empty = $(".gl-empty"); if (empty) empty.hidden = shown > 0;
      if (count) count.textContent = q ? `${shown} of ${count.dataset.total} terms` : label;
    };
  }

  // ── study tools panel: opened from the top bar, desktop only (see wiki.css) ──
  // What's open, what's typed and the scroll position are saved, so the panel looks the same on the next page.
  const TOOLS = {
    focus: { title: "Focus Timer", url: "focus/" },
    molar: { title: "Molar Mass Calculator", url: "molar-mass/" },
    saved: { title: "Bookmarks", url: "saved/" },
  };
  const TOOLS_MQ = window.matchMedia("(min-width: 1024px)");
  const toolOpen = () => html.getAttribute("data-tool") || "";
  // one line per page: title, then the short section name ("Unit 5")
  const tbItem = (p, meta, extra) => `<div class="tb-item${p.u === pagePath() ? " is-here" : ""}"><a class="tb-link" href="${esc(ROOT + p.u)}" title="${esc(p.t || p.u)}"><span class="tb-link-t">${esc(p.t || p.u)}</span><span class="tb-link-m">${esc(meta || "")}</span></a>${extra || ""}</div>`;
  const shortSection = (s) => String(s || "").split(" · ")[0];
  function renderToolbarSaved() {
    const root = $("#tb-saved"), save = $(".tb-save");
    if (!root) return;
    const bm = bookmarks(), on = bm.some((b) => b.u === pagePath());
    save.hidden = $("#tb-panel").dataset.showing !== "saved" || !canSave();
    save.setAttribute("aria-pressed", String(on));
    save.title = on ? "Remove this page" : "Save this page";
    save.setAttribute("aria-label", save.title);
    if (toolOpen() !== "saved") return;
    root.innerHTML = bm.length
      ? `<div class="tb-list">${bm.map((p) => tbItem(p, shortSection(p.s), `<button type="button" class="icon-btn sp-remove" data-remove-bm="${esc(p.u)}" aria-label="Remove ${esc(p.t)} from saved pages" title="Remove">${ICON.close}</button>`)).join("")}</div>`
      : `<p class="sp-empty">Nothing saved yet. Use the bookmark above to save this page.</p>`;
  }
  // copies this page's Contents into the panel (before initScrollSpy, so the current section is highlighted there too)
  function mountPanelContents() {
    const list = $(".toc .toc-list"), box = $(".tb-contents");
    if (!list || !box) return;
    $(".tb-contents-body", box).appendChild(list.cloneNode(true));
    box.hidden = false;
  }
  // pinned to the bottom of the panel, whichever tool is open
  function renderPanelRecent() {
    const box = $(".tb-recent");
    if (!box) return;
    const rec = listOf("recent").filter((r) => r.u !== pagePath()).slice(0, 5);
    box.hidden = !rec.length;
    $(".tb-recent-body", box).innerHTML = `<div class="tb-list">${rec.map((p) => tbItem(p, shortSection(p.s))).join("")}</div>`;
  }
  function showTool(tool) {
    if (tool) html.setAttribute("data-tool", tool); else html.removeAttribute("data-tool");
    $$("[data-tool-btn]").forEach((b) => b.setAttribute("aria-expanded", String(b.dataset.toolBtn === tool)));
    if (tool) {
      $("#tb-panel").dataset.showing = tool; // kept after closing, so the tool stays visible while the panel slides out
      $(".tb-title").textContent = TOOLS[tool].title;
      $(".tb-full").href = ROOT + TOOLS[tool].url;
    }
    if (tool === "molar") {
      const r = $("#tb-molar");
      if (!r.dataset.ready) { r.dataset.ready = "1"; mountMolarMass(r, true); }
    }
    renderToolbarSaved();
    focusTick();
  }
  // only clicks animate: arriving on a page or resizing the window never slides the panel
  let tbMoving = 0;
  function pickTool(tool) {
    html.classList.add("tb-moving");
    clearTimeout(tbMoving);
    tbMoving = setTimeout(() => html.classList.remove("tb-moving"), 340);
    showTool(tool);
    store.set("toolbar", tool);
  }
  function initToolbar() {
    const panel = $("#tb-panel");
    if (!panel) return;
    const body = $(".tb-body", panel);
    $$("[data-tool-btn]").forEach((b) => { b.onclick = () => {
      const tool = b.dataset.toolBtn, opening = toolOpen() !== tool;
      pickTool(opening ? tool : "");
      body.scrollTop = 0;
      if (opening && tool === "molar") $("#tb-molar .mm-input").focus({ preventScroll: true });
    }; });
    const collapse = () => { const b = $(`[data-tool-btn="${toolOpen()}"]`); pickTool(""); if (b) b.focus(); };
    $(".tb-collapse", panel).onclick = collapse;
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && toolOpen() && panel.contains(document.activeElement)) collapse(); });
    $(".tb-save", panel).onclick = toggleBookmark;
    $("#tb-saved").addEventListener("click", (e) => {
      const rm = e.target.closest("[data-remove-bm]");
      if (rm) { store.set("bookmarks", bookmarks().filter((x) => x.u !== rm.dataset.removeBm)); bookmarksChanged(); }
    });
    renderPanelRecent();
    window.addEventListener("storage", (e) => { if (e.key === "apchem.bookmarks") bookmarksChanged(); });
    showTool(toolOpen());
    const pos = store.get("toolbarScroll", null);
    if (pos && pos.tool === toolOpen()) body.scrollTop = pos.top;
    window.addEventListener("pagehide", () => store.set("toolbarScroll", { tool: toolOpen(), top: body.scrollTop }));
    // coming back with the Back button can show a frozen copy of the page: bring it up to date
    window.addEventListener("pageshow", (e) => {
      if (!e.persisted) return;
      const t = store.get("toolbar", "");
      showTool(TOOLS[t] && TOOLS_MQ.matches && t !== html.getAttribute("data-own-tool") ? t : "");
      const m = $("#tb-molar");
      if (m._restore) m._restore();
      renderPanelRecent();
      bookmarksChanged();
    });
  }

  // ── bottom tab bar (Home Screen app on a phone) ──────────────────────────
  function initTabbar() {
    const bar = $(".tabbar");
    if (!bar) return;
    const path = pagePath();
    const cur = path === "" ? "home" : path.startsWith("units/") ? "notes" : path === "formulas/" ? "formulas" : path === "saved/" ? "saved" : "";
    $$(".tab", bar).forEach((t) => { if (t.dataset.tab === cur) t.setAttribute("aria-current", "page"); });
    bar.addEventListener("click", (e) => {
      const t = e.target.closest(".tab");
      if (!t) return;
      if (t.dataset.tab === "notes") { setNav(!document.body.classList.contains("nav-open")); return; }
      if (document.body.classList.contains("nav-open")) setNav(false);
      // tapping the tab you're on scrolls back to the top, like an iPhone app
      if (t.tagName === "A" && t.getAttribute("aria-current") === "page") { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduceMotion() ? "auto" : "smooth" }); }
    });
  }

  // ── Settings page ────────────────────────────────────────────────────────
  function flash(sel, msg) { const el = $(sel); if (!el) return; el.textContent = msg; el.hidden = false; clearTimeout(el._t); el._t = setTimeout(() => { el.hidden = true; }, 2500); }
  function initSettings() {
    const root = $("#wiki-settings");
    if (!root) return;
    const p = prefs();
    const cats = [["quote", "Ms. Boppana's quotes"], ["saying", "Classroom sayings"], ["mnemonic", "Mnemonics"]];
    root.innerHTML = `
      <section class="set-card"><h3>Your name</h3>
        <p>Used in the home-page greeting. Saved only in this browser.</p>
        <form id="set-name" class="set-row"><input type="text" id="set-name-input" maxlength="40" placeholder="Your name" value="${esc(getName())}" aria-label="Your name">
          <button class="btn btn-primary" type="submit">Save</button>
          <button class="btn" type="button" id="set-name-clear">Clear</button></form>
        <p class="set-ok" id="set-name-ok" hidden>Saved ✓</p></section>
      <section class="set-card"><h3>Theme</h3>
        <p><b>Automatic</b> follows your device's light/dark setting. The sun/moon button in the top bar switches too.</p>
        <div class="set-row"><button class="btn" type="button" data-set-theme="auto">Automatic</button><button class="btn" type="button" data-set-theme="light">Light</button><button class="btn" type="button" data-set-theme="dark">Dark</button></div></section>
      <section class="set-card"><h3>Text size</h3>
        <p>Makes the notes bigger or smaller, handy for reading on a phone.</p>
        <div class="set-row"><button class="btn" type="button" data-text-step="-1" aria-label="Smaller text">A−</button>
          <span class="ts-value" id="ts-value">100%</span>
          <button class="btn" type="button" data-text-step="1" aria-label="Bigger text">A+</button>
          <button class="btn" type="button" data-text-step="0">Reset</button></div>
        <div class="prose ts-sample"><p>The <b>standard enthalpy of formation</b> of an element in its standard state is zero.</p></div></section>
      <section class="set-card" id="set-app"><h3>App &amp; offline</h3>
        <p id="app-status"></p>
        <p id="app-install"></p>
        <h4>Save everything for offline</h4>
        <p>Every notes page is saved automatically. Notebook scans and reference PDFs are saved once you open them, or all at once here.</p>
        <div class="set-row"><button class="btn btn-primary" type="button" id="app-save-all">Save all for offline</button>
          <button class="btn" type="button" id="app-remove-media">Remove saved scans</button></div>
        <progress class="app-progress" id="app-progress" max="1" value="0" hidden></progress>
        <p class="set-hint" id="app-storage"></p>
        <h4>Clear cache and refresh</h4>
        <p>If the app looks out of date, this deletes its saved copy and downloads everything fresh. Your name, settings, reading position and study time are kept.</p>
        <div class="set-row"><button class="btn danger" type="button" id="app-clear">Clear cache and refresh</button></div>
        <p class="set-ok" id="app-ok" hidden></p>
        <p class="set-hint" id="app-version"></p></section>
      <section class="set-card"><h3>Quote of the day</h3><p>Which kinds of quotes can be the quote of the day (and the random quotes) on the home page?</p>
        ${cats.map(([k, l]) => `<label class="set-check"><input type="checkbox" data-cat="${k}" ${p.quoteCats.includes(k) ? "checked" : ""}> ${l}</label>`).join("")}
        <p class="set-hint">Add more quotes in <code>data/quotes.yml</code>.</p></section>
      <section class="set-card"><h3>Study-time tracker</h3>
        <p>Counts time while a wiki page is open and you're active (it pauses after 3 idle minutes or when the tab is hidden). Stored only in this browser.</p>
        <label class="set-check"><input type="checkbox" id="set-tracker" ${p.tracker ? "checked" : ""}> Track my study time</label>
        <div class="set-row"><button class="btn" type="button" id="set-export">Export data</button>
          <label class="btn set-import">Import data<input type="file" accept="application/json" id="set-import" hidden></label>
          <button class="btn danger" type="button" id="set-reset">Reset study time</button></div>
        <p class="set-ok" id="set-study-ok" hidden></p></section>`;
    applyTheme(themePref());
    $("#set-name").onsubmit = (e) => { e.preventDefault(); store.set("name", $("#set-name-input").value.trim()); store.set("namePromptDismissed", true); flash("#set-name-ok", "Saved ✓"); };
    $("#set-name-clear").onclick = () => { store.del("name"); store.del("namePromptDismissed"); $("#set-name-input").value = ""; flash("#set-name-ok", "Cleared"); };
    $$("[data-cat]", root).forEach((c) => { c.onchange = () => {
      const sel = $$("[data-cat]", root).filter((x) => x.checked).map((x) => x.dataset.cat);
      store.set("prefs", Object.assign(prefs(), { quoteCats: sel.length ? sel : ["quote"] }));
    }; });
    $("#set-tracker").onchange = (e) => store.set("prefs", Object.assign(prefs(), { tracker: e.target.checked }));
    // text size
    setTextScale(Number(store.get("textScale", 1)) || 1);
    $$("[data-text-step]", root).forEach((b) => { b.onclick = () => {
      const step = Number(b.dataset.textStep), cur = Number(store.get("textScale", 1)) || 1;
      let i = TEXT_STEPS.indexOf(cur); if (i < 0) i = 2;
      setTextScale(step === 0 ? 1 : TEXT_STEPS[Math.max(0, Math.min(TEXT_STEPS.length - 1, i + step))]);
    }; });
    // app & offline
    $("#app-save-all").onclick = saveAllMedia;
    $("#app-remove-media").onclick = async () => {
      try { await caches.delete(MEDIA_CACHE); } catch (e) { /* ignore */ }
      flash("#app-ok", "Saved scans removed."); refreshAppCard();
    };
    $("#app-clear").onclick = clearAndRefresh;
    refreshAppCard();
    window.addEventListener("apchem-sw", refreshAppCard);
    window.addEventListener("apchem-install", refreshAppCard);
    $("#set-export").onclick = () => {
      const blob = new Blob([JSON.stringify({ study: studyData(), prefs: prefs(), name: getName(), bookmarks: bookmarks(), recent: listOf("recent"), focusDays: focusDays() }, null, 2)], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `apchem-study-${dayKey()}.json`; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    };
    $("#set-import").onchange = (e) => {
      const f = e.target.files[0]; if (!f) return;
      f.text().then((t) => {
        const d = JSON.parse(t);
        if (d.study && d.study.days) {
          const cur = studyData();
          Object.entries(d.study.days).forEach(([k, v]) => { cur.days[k] = Math.max(cur.days[k] || 0, +v || 0); });
          store.set("study", cur);
        }
        if (d.name && !getName()) store.set("name", d.name);
        if (Array.isArray(d.bookmarks)) { const have = new Set(bookmarks().map((b) => b.u)); store.set("bookmarks", bookmarks().concat(d.bookmarks.filter((b) => b && b.u && !have.has(b.u)))); }
        if (Array.isArray(d.recent) && !listOf("recent").length) store.set("recent", d.recent.filter((r) => r && r.u).slice(0, 12));
        if (d.focusDays && typeof d.focusDays === "object") {
          const f = focusDays();
          Object.entries(d.focusDays).forEach(([k, v]) => { const c = f[k] || { n: 0, s: 0 }; f[k] = { n: Math.max(c.n, +(v || {}).n || 0), s: Math.max(c.s, +(v || {}).s || 0) }; });
          store.set("focusDays", f);
        }
        flash("#set-study-ok", "Imported ✓");
      }).catch(() => flash("#set-study-ok", "That file couldn't be read."));
    };
    $("#set-reset").onclick = () => { if (confirm("Reset all tracked study time in this browser? This can't be undone.")) { store.del("study"); flash("#set-study-ok", "Study time reset."); } };
  }

  // ── 3D molecule (home hero): ammonia, glossy spheres, drag to spin ───────
  function initMolecule() {
    const host = $("#hero-molecule");
    if (!host || host.dataset.ready) return;
    host.dataset.ready = "1";
    // NH3 — trigonal pyramidal (N–H 1.01 Å, scaled ×1.6), plus N's lone pair ("LP")
    const K = 1.6;
    const atoms = [
      ["N", 0, 0.30, 0],
      ["H", 0, -0.078, 0.937], ["H", -0.811, -0.078, -0.469], ["H", 0.811, -0.078, -0.469],
      ["LP", 0, 1.02, 0],
    ].map(([e, x, y, z]) => [e, x * K, y * K, z * K]);
    const bonds = [[0, 1, 1], [0, 2, 1], [0, 3, 1]];
    const cy = atoms.slice(0, 4).reduce((s, a) => s + a[2], 0) / 4 + 0.25;
    atoms.forEach((a) => { a[2] -= cy; });
    const RAD = { N: 0.74, H: 0.46, LP: 0.62 };
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "-2.7 -2.7 5.4 5.4");
    svg.innerHTML = `<defs>
      <radialGradient id="mol-N" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="#ede9fe"/><stop offset=".28" stop-color="#a78bfa"/><stop offset=".72" stop-color="#6d28d9"/><stop offset="1" stop-color="#2e1065"/></radialGradient>
      <radialGradient id="mol-LP" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#f5d0fe" stop-opacity=".85"/><stop offset=".55" stop-color="#c084fc" stop-opacity=".35"/><stop offset="1" stop-color="#a855f7" stop-opacity="0"/></radialGradient>
      <radialGradient id="mol-H" cx=".36" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset=".4" stop-color="#f4f1ff"/><stop offset=".8" stop-color="#c9c1e6"/><stop offset="1" stop-color="#7c7299"/></radialGradient>
      <radialGradient id="mol-spec" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <radialGradient id="mol-rim" cx=".5" cy=".5" r=".5"><stop offset=".78" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".35"/></radialGradient>
      <radialGradient id="mol-shadow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#4c1d95" stop-opacity=".35"/><stop offset="1" stop-color="#4c1d95" stop-opacity="0"/></radialGradient>
    </defs><ellipse cx="0" cy="2.25" rx="1.9" ry=".28" fill="url(#mol-shadow)"/><g class="mol-g"></g>`;
    host.prepend(svg);
    const g = svg.querySelector(".mol-g");
    let yaw = 0.5, pitch = 0.32, vYaw = 0.0045, vPitch = 0, dragging = false, last = null, lastT = 0;
    const AUTO = reduceMotion() ? 0 : 0.0045;
    function frame(t) {
      if (!host.isConnected) return;
      const dt = Math.min(48, t - (lastT || t)) / 16.7; lastT = t;
      if (!dragging) {
        vYaw += (AUTO - vYaw) * 0.02 * dt;
        vPitch *= Math.pow(0.94, dt);
        pitch += (0.32 - pitch) * 0.01 * dt;
      }
      yaw += vYaw * dt; pitch += vPitch * dt;
      if (!document.hidden) draw();
      requestAnimationFrame(frame);
    }
    function draw() {
      const cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const D = 8;
      const P = atoms.map(([el, x, y, z]) => {
        const x1 = x * cyw + z * syw, z1 = -x * syw + z * cyw;
        const y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
        const s = D / (D - z2);
        return { el, x: x1 * s, y: -y2 * s, z: z2, s };
      });
      const items = [];
      bonds.forEach(([a, b, order]) => { const A = P[a], B = P[b]; items.push({ z: (A.z + B.z) / 2 - 0.05, html: bondSvg(A, B, order) }); });
      P.forEach((p) => {
        const r = RAD[p.el] * p.s;
        if (p.el === "LP") { // lone pair: a soft glowing cloud with two electrons
          const d = r * 0.22;
          items.push({ z: p.z, html:
            `<circle cx="${p.x.toFixed(3)}" cy="${p.y.toFixed(3)}" r="${r.toFixed(3)}" fill="url(#mol-LP)"/>` +
            `<circle cx="${(p.x - d).toFixed(3)}" cy="${p.y.toFixed(3)}" r="${(r * 0.1).toFixed(3)}" fill="#fff" opacity=".95"/>` +
            `<circle cx="${(p.x + d).toFixed(3)}" cy="${p.y.toFixed(3)}" r="${(r * 0.1).toFixed(3)}" fill="#fff" opacity=".95"/>` });
          return;
        }
        items.push({ z: p.z, html:
          `<circle cx="${p.x.toFixed(3)}" cy="${p.y.toFixed(3)}" r="${r.toFixed(3)}" fill="url(#mol-${p.el})"/>` +
          `<circle cx="${p.x.toFixed(3)}" cy="${p.y.toFixed(3)}" r="${r.toFixed(3)}" fill="url(#mol-rim)"/>` +
          `<ellipse cx="${(p.x - r * 0.32).toFixed(3)}" cy="${(p.y - r * 0.38).toFixed(3)}" rx="${(r * 0.36).toFixed(3)}" ry="${(r * 0.24).toFixed(3)}" fill="url(#mol-spec)" transform="rotate(-30 ${(p.x - r * 0.32).toFixed(3)} ${(p.y - r * 0.38).toFixed(3)})"/>` });
      });
      items.sort((m, n) => m.z - n.z);
      g.innerHTML = items.map((i) => i.html).join("");
    }
    function bondSvg(A0, B0, order) {
      // trim the bond so it starts/ends at the sphere surfaces (never drawn across a sphere's face)
      const rA = RAD[A0.el] * A0.s * 0.82, rB = RAD[B0.el] * B0.s * 0.82;
      const L0 = Math.hypot(B0.x - A0.x, B0.y - A0.y) || 1;
      if (L0 <= rA + rB) return "";
      const ux = (B0.x - A0.x) / L0, uy = (B0.y - A0.y) / L0;
      const A = { x: A0.x + ux * rA, y: A0.y + uy * rA, s: A0.s }, B = { x: B0.x - ux * rB, y: B0.y - uy * rB, s: B0.s };
      const dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy) || 1;
      const nx = -dy / L, ny = dx / L;
      const w = 0.2 * (A.s + B.s) / 2;
      const offs = order === 2 ? [-0.11, 0.11] : [0];
      return offs.map((o) => {
        const x1 = A.x + nx * o, y1 = A.y + ny * o, x2 = B.x + nx * o, y2 = B.y + ny * o;
        const ww = order === 2 ? w * 0.7 : w;
        return `<line class="mol-bond" x1="${x1.toFixed(3)}" y1="${y1.toFixed(3)}" x2="${x2.toFixed(3)}" y2="${y2.toFixed(3)}" stroke="#8b80a8" stroke-width="${ww.toFixed(3)}"/>` +
               `<line class="mol-bond" x1="${(x1 - nx * ww * 0.18).toFixed(3)}" y1="${(y1 - ny * ww * 0.18 - ww * 0.12).toFixed(3)}" x2="${(x2 - nx * ww * 0.18).toFixed(3)}" y2="${(y2 - ny * ww * 0.18 - ww * 0.12).toFixed(3)}" stroke="#ffffff" stroke-opacity=".55" stroke-width="${(ww * 0.32).toFixed(3)}"/>`;
      }).join("");
    }
    host.addEventListener("pointerdown", (e) => { dragging = true; last = [e.clientX, e.clientY]; host.setPointerCapture(e.pointerId); });
    host.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - last[0], dy = e.clientY - last[1];
      last = [e.clientX, e.clientY];
      vYaw = dx * 0.012; vPitch = dy * 0.01;
      yaw += vYaw; pitch = Math.max(-1.3, Math.min(1.3, pitch + vPitch));
    });
    const end = () => { dragging = false; };
    host.addEventListener("pointerup", end);
    host.addEventListener("pointercancel", end);
    draw();
    requestAnimationFrame(frame);
  }

  // ── start ────────────────────────────────────────────────────────────────
  function init() {
    applyTheme(themePref());
    renderMath($(".main"));
    revealActiveNav();
    openTarget();
    mountPanelContents();
    initScrollSpy();
    initPreviews();
    initMolecule();
    initHome();
    initFormulaFilter();
    initPrint();
    initQuotesPage();
    initSettings();
    initPWA();
    initSaved();
    initFocus();
    initMolarMass();
    initGlossaryFilter();
    initTabbar();
    initToolbar();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
  window.__apchemRefreshHome = initHome; // handy for testing
})();
