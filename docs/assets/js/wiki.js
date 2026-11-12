/* ──────────────────────────────────────────────────────────────────────────
   Walter's AP Chem — browser features (no framework, no build step)
   • theme (auto / light / dark)          • search (search-index.json)
   • mobile nav drawer                    • Contents highlighting
   • link previews on hover               • KaTeX + mhchem rendering
   • study-time tracker                   • home: greeting, quotes, stats, countdowns, 3D NH₃
   • PDF preview + notebook-scan lightbox • Formulas filter · Settings page
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
      m.setAttribute("content", forDark ? "#0b0814" : "#f4f1fb");
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
    const aside = $(".toc");
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
        if (aside && aside.contains(a) && aside.offsetParent) {
          const r = a.getBoundingClientRect(), s = aside.getBoundingClientRect();
          if (r.top < s.top + 30 || r.bottom > s.bottom - 30) aside.scrollTop += r.top - s.top - aside.clientHeight / 2;
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
    const defs = '<defs><linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d946ef"/><stop offset="1" stop-color="#7c3aed"/></linearGradient></defs>';
    $("#st-spark").innerHTML = `<svg viewBox="0 0 ${14 * (bw + gap) - gap} ${h}" preserveAspectRatio="none">${defs}${bars}</svg><div class="spark-axis"><span>2 wks ago</span><span>today</span></div>`;
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
  function initFormulaFilter() {
    const input = $(".formula-filter");
    if (!input) return;
    const n = (s) => norm(s).replace(/\s+/g, " ");
    input.oninput = () => {
      const q = n(input.value.trim());
      $$(".formula-group").forEach((g) => {
        let any = false;
        const title = n(($("h3", g) || {}).textContent || "");
        $$(".admonition.formula", g).forEach((f) => {
          const hit = !q || n(f.textContent).includes(q) || title.includes(q);
          f.hidden = !hit; any = any || hit;
        });
        g.hidden = !any;
      });
      $$(".prose h2[id^='unit-']").forEach((h) => {
        let el = h.nextElementSibling, any = false;
        while (el && el.tagName !== "H2") { if (el.classList.contains("formula-group") && !el.hidden) any = true; el = el.nextElementSibling; }
        h.hidden = !any;
      });
    };
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
      const blob = new Blob([JSON.stringify({ study: studyData(), prefs: prefs(), name: getName() }, null, 2)], { type: "application/json" });
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
        flash("#set-study-ok", "Imported ✓");
      }).catch(() => flash("#set-study-ok", "That file couldn't be read."));
    };
    $("#set-reset").onclick = () => { if (confirm("Reset all tracked study time in this browser? This can't be undone.")) { store.del("study"); flash("#set-study-ok", "Study time reset."); } };
  }

  // ── 3D tilt + sheen on [data-tilt] cards ─────────────────────────────────
  function initTilt() {
    if (reduceMotion() || window.matchMedia("(hover: none)").matches) return;
    $$("[data-tilt]").forEach((el) => {
      if (el.dataset.tiltReady) return;
      el.dataset.tiltReady = "1";
      const sheen = document.createElement("span");
      sheen.className = "tilt-sheen";
      el.appendChild(sheen);
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        const k = Math.min(1, 320 / Math.max(r.width, r.height)); // big cards tilt less
        el.style.setProperty("--ry", ((px - 0.5) * 9 * k).toFixed(2) + "deg");
        el.style.setProperty("--rx", ((0.5 - py) * 8 * k).toFixed(2) + "deg");
        el.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
        el.style.setProperty("--my", (py * 100).toFixed(1) + "%");
        el.classList.add("is-tilting");
      });
      el.addEventListener("pointerleave", () => {
        el.classList.remove("is-tilting");
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      });
    });
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
    initScrollSpy();
    initPreviews();
    initMolecule();
    initTilt();
    initHome();
    initFormulaFilter();
    initQuotesPage();
    initSettings();
    initPWA();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
  window.__apchemRefreshHome = initHome; // handy for testing
})();
