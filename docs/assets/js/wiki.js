/* ──────────────────────────────────────────────────────────────────────────
   AP Chem wiki — browser features
   • KaTeX rendering (mhchem)            • settings button in the header
   • study-time tracker (localStorage)   • home page: greeting, quotes, stats, countdowns
   • PDF preview modal                   • notebook-scan lightbox
   • Formulas page filter                • Settings page
   Data comes from <script id="wiki-data"> (built from data/*.yml by the hook).
   Everything personal is stored ONLY in this browser (localStorage, "apchem.*").
   ────────────────────────────────────────────────────────────────────────── */
(function () {
  "use strict";
  if (window.__apchem) return;
  window.__apchem = true;

  // ── basics ────────────────────────────────────────────────────────────────
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
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
  let ROOT = new URL("./", location.href).href;
  try { ROOT = new URL(JSON.parse($("#__config").textContent).base + "/", location.href).href; } catch (e) { /* keep */ }
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

  // ── KaTeX ────────────────────────────────────────────────────────────────
  function renderMath(root) {
    if (!window.renderMathInElement) return;
    window.renderMathInElement(root, {
      delimiters: [{ left: "\\(", right: "\\)", display: false }, { left: "\\[", right: "\\]", display: true }],
      throwOnError: false, strict: false,
    });
  }

  // ── header settings button ───────────────────────────────────────────────
  function addSettingsButton() {
    if ($(".wiki-settings-btn")) return;
    const inner = $(".md-header__inner");
    const before = $(".md-header__option") || $("label.md-header__button[for='__search']");
    if (!inner || !before) return;
    const a = document.createElement("a");
    a.className = "md-header__button md-icon wiki-settings-btn";
    a.href = ROOT + "settings/";
    a.title = "Settings";
    a.setAttribute("aria-label", "Settings");
    a.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97s-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1s.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64z"/></svg>';
    inner.insertBefore(a, before);
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
    const s = studySummary();
    $("#st-today").textContent = fmtDur(s.today);
    $("#st-week").textContent = fmtDur(s.week);
    $("#st-total").textContent = fmtDur(s.total);
    $("#st-streak").textContent = s.streak;
    const max = Math.max(600, ...s.last14.map((x) => x.s));
    const bw = 14, gap = 5, h = 46;
    const bars = s.last14.map((x, i) => {
      const bh = Math.max(2, (x.s / max) * h);
      const isToday = i === 13;
      return `<rect x="${i * (bw + gap)}" y="${h - bh}" width="${bw}" height="${bh}" rx="3" class="${isToday ? "spark-today" : "spark-bar"}"><title>${fmtDate(x.d)}: ${fmtDur(x.s)}</title></rect>`;
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
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
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
    line = line.replace(/\{exam\}/g, examName);
    line = line.replace(/\{days\}/g, plural(dleft, "day"));
    line = line.charAt(0).toUpperCase() + line.slice(1);
    if (name) line = line.replace(/\{name\}/g, name);
    else line = line.replace(/\s*,\s*\{name\}/g, "").replace(/\{name\}\s*[,—-]?\s*/g, "").replace(/\s{2,}/g, " ");
    return line.replace(/\s+([?.!])/g, "$1").trim();
  }
  function shortExam(title) {
    // "Exam #5 – Thermodynamics" → "Exam #5"
    return String(title).replace(/\s+–.*$/, "");
  }
  function renderGreeting() {
    const el = $("#home-greeting");
    if (!el) return;
    const raw = greeting();
    el.textContent = raw;
    const t = now();
    const cu = currentUnit(t);
    const parts = [t.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })];
    if (cu) parts.push(cu.state === "now" ? `Unit ${cu.unit.number}: ${cu.unit.title}` : `Next up: Unit ${cu.unit.number} (${cu.unit.title})`);
    $("#home-sub").textContent = parts.join(" · ");
    const cur = $("#home-current-unit");
    if (cur && cu) {
      cur.href = ROOT + "units/" + cu.unit.slug + "/";
      $("span", cur).textContent = `Unit ${cu.unit.number}`;
    }
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
  let lastQuote = -1;
  function renderQuote() {
    const box = $("#quote-card");
    if (!box) return;
    const cats = prefs().quoteCats;
    const qs = (DATA.quotes || []).filter((q) => cats.includes(q.category || "quote"));
    const list = qs.length ? qs : DATA.quotes || [];
    if (!list.length) { box.hidden = true; return; }
    let i = Math.floor(Math.random() * list.length);
    if (list.length > 1 && i === lastQuote) i = (i + 1) % list.length;
    lastQuote = i;
    const q = list[i];
    const txt = $("#quote-text");
    txt.classList.remove("qc-in"); void txt.offsetWidth; txt.classList.add("qc-in");
    txt.textContent = q.text;
    $("#quote-who").textContent = "— " + (q.who || "Ms. Boppana") + (q.context ? ` · ${q.context}` : "");
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
    renderQuote();
    renderCountdowns();
    renderStudy();
    const nb = $("#quote-next");
    if (nb) nb.onclick = renderQuote;
    const s = $("[data-open-search]");
    if (s) s.onclick = () => { const t = $("label[for='__search']") ; const box = $("#__search"); if (box) { box.checked = true; box.dispatchEvent(new Event("change")); } setTimeout(() => { const q = $(".md-search__input"); if (q) q.focus(); }, 50); };
  }

  // ── modal (PDF preview + scans lightbox) ─────────────────────────────────
  let modal;
  function openModal(html, cls) {
    closeModal();
    modal = document.createElement("div");
    modal.className = "wiki-modal " + (cls || "");
    modal.innerHTML = `<div class="wm-backdrop" data-close></div><div class="wm-box" role="dialog" aria-modal="true">${html}</div>`;
    document.body.appendChild(modal);
    document.documentElement.classList.add("wm-open");
    modal.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeModal(); });
    const f = $(".wm-close", modal); if (f) f.focus();
    return modal;
  }
  function closeModal() {
    if (!modal) return;
    modal.remove(); modal = null;
    document.documentElement.classList.remove("wm-open");
  }
  document.addEventListener("keydown", (e) => {
    if (!modal) return;
    if (e.key === "Escape") closeModal();
    if (modal.classList.contains("wm-lightbox")) {
      if (e.key === "ArrowRight") { const b = $(".lb-next", modal); if (b) b.click(); }
      if (e.key === "ArrowLeft") { const b = $(".lb-prev", modal); if (b) b.click(); }
    }
  });
  const ICON_CLOSE = '<svg viewBox="0 0 24 24"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>';

  function openPdf(href, title) {
    const abs = new URL(href, location.href).href;
    openModal(
      `<header class="wm-head"><b>${esc(title)}</b><span class="wm-actions">
         <a class="md-button" href="${abs}" target="_blank" rel="noopener">Open in new tab</a>
         <a class="md-button md-button--primary" href="${abs}" download>Download</a>
         <button class="wm-close" data-close aria-label="Close">${ICON_CLOSE}</button></span></header>
       <iframe class="wm-pdf" src="${abs}#view=FitH" title="${esc(title)}"></iframe>`, "wm-pdfview");
  }

  function openLightbox(nb, pages, base, startIdx, title) {
    const nbName = title || `Notebook ${nb}`;
    let i = startIdx || 0;
    const m = openModal(`<header class="wm-head"><b class="lb-title"></b><span class="wm-actions">
        <a class="md-button lb-all" href="${ROOT}scans/${encodeURIComponent(nb)}/">All pages</a>
        <a class="md-button lb-full" target="_blank" rel="noopener">Full size</a>
        <button class="wm-close" data-close aria-label="Close">${ICON_CLOSE}</button></span></header>
      <div class="lb-stage"><button class="lb-nav lb-prev" aria-label="Previous page">‹</button>
        <img class="lb-img" alt=""><button class="lb-nav lb-next" aria-label="Next page">›</button></div>
      <div class="lb-strip"></div>`, "wm-lightbox");
    const baseURL = new URL(base, location.href).href;
    const src = (p) => `${baseURL}${nb}/p${pad(p)}.webp`;
    const strip = $(".lb-strip", m);
    strip.innerHTML = pages.map((p, k) => `<button data-k="${k}"><img src="${baseURL}${nb}/thumb/p${pad(p)}.webp" alt="p. ${p}" loading="lazy"><span>${p}</span></button>`).join("");
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
    const norm = (s) => s.toLowerCase().replace(/[₀-₉]/g, (c) => String(c.charCodeAt(0) - 0x2080)).replace(/\s+/g, " ");
    input.oninput = () => {
      const q = norm(input.value.trim());
      $$(".formula-group").forEach((g) => {
        let any = false;
        $$(".admonition.formula, details.formula", g).forEach((f) => {
          const hit = !q || norm(f.textContent).includes(q) || norm($("h3", g)?.textContent || "").includes(q);
          f.hidden = !hit; any = any || hit;
        });
        g.hidden = !any;
      });
      $$(".md-content h2").forEach((h) => {
        let el = h.nextElementSibling, any = false;
        while (el && el.tagName !== "H2") { if (el.classList.contains("formula-group") && !el.hidden) any = true; el = el.nextElementSibling; }
        if (h.id && h.id.startsWith("unit-")) h.hidden = !any;
      });
    };
  }

  // ── Settings page ────────────────────────────────────────────────────────
  function initSettings() {
    const root = $("#wiki-settings");
    if (!root) return;
    const p = prefs();
    const cats = [["quote", "Ms. Boppana's quotes"], ["saying", "Classroom sayings"], ["mnemonic", "Mnemonics"]];
    root.innerHTML = `
      <section class="set-card"><h3>Your name</h3>
        <p>Used in the home-page greeting. Saved only in this browser.</p>
        <form id="set-name" class="set-row"><input type="text" id="set-name-input" maxlength="40" placeholder="Your name" value="${esc(getName())}">
          <button class="md-button md-button--primary" type="submit">Save</button>
          <button class="md-button" type="button" id="set-name-clear">Clear</button></form>
        <p class="set-ok" id="set-name-ok" hidden>Saved ✓</p></section>
      <section class="set-card"><h3>Theme</h3>
        <p>Use the <b>sun / moon</b> button in the top bar to switch between <b>automatic</b> (matches your device), <b>light</b> and <b>dark</b>.</p>
        <div class="set-row"><button class="md-button" type="button" data-theme="0">Automatic</button><button class="md-button" type="button" data-theme="1">Light</button><button class="md-button" type="button" data-theme="2">Dark</button></div></section>
      <section class="set-card"><h3>Home-page quotes</h3><p>Which kinds of quotes can show up on the home page?</p>
        ${cats.map(([k, l]) => `<label class="set-check"><input type="checkbox" data-cat="${k}" ${p.quoteCats.includes(k) ? "checked" : ""}> ${l}</label>`).join("")}
        <p class="set-hint">Add more quotes in <code>data/quotes.yml</code>.</p></section>
      <section class="set-card"><h3>Study-time tracker</h3>
        <p>Counts time while a wiki page is open and you're active (pauses after 3 idle minutes or when the tab is hidden). Stored only in this browser.</p>
        <label class="set-check"><input type="checkbox" id="set-tracker" ${p.tracker ? "checked" : ""}> Track my study time</label>
        <div class="set-row"><button class="md-button" type="button" id="set-export">Export data</button>
          <label class="md-button set-import">Import data<input type="file" accept="application/json" id="set-import" hidden></label>
          <button class="md-button set-danger" type="button" id="set-reset">Reset study time</button></div>
        <p class="set-ok" id="set-study-ok" hidden></p></section>`;
    $("#set-name").onsubmit = (e) => { e.preventDefault(); store.set("name", $("#set-name-input").value.trim()); store.set("namePromptDismissed", true); flash("#set-name-ok", "Saved ✓"); };
    $("#set-name-clear").onclick = () => { store.del("name"); store.del("namePromptDismissed"); $("#set-name-input").value = ""; flash("#set-name-ok", "Cleared"); };
    $$("[data-cat]", root).forEach((c) => c.onchange = () => {
      const sel = $$("[data-cat]", root).filter((x) => x.checked).map((x) => x.dataset.cat);
      store.set("prefs", Object.assign(prefs(), { quoteCats: sel.length ? sel : ["quote"] }));
    });
    $("#set-tracker").onchange = (e) => store.set("prefs", Object.assign(prefs(), { tracker: e.target.checked }));
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
    $$("[data-theme]", root).forEach((b) => b.onclick = () => {
      const inputs = $$("input[name='__palette']");
      const target = inputs[+b.dataset.theme];
      if (target) { target.checked = true; target.dispatchEvent(new Event("change", { bubbles: true })); }
    });
  }
  function flash(sel, msg) { const el = $(sel); if (!el) return; el.textContent = msg; el.hidden = false; clearTimeout(el._t); el._t = setTimeout(() => { el.hidden = true; }, 2500); }

  // ── 3D tilt + sheen on [data-tilt] cards ─────────────────────────────────
  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

  // ── 3D molecule (home hero): glossy spheres, drag to spin ────────────────
  function initMolecule() {
    const host = $("#hero-molecule");
    if (!host || host.dataset.ready) return;
    host.dataset.ready = "1";
    // ammonia, NH3 — trigonal pyramidal (N–H 1.01 Å, scaled ×1.6), plus N's lone pair ("LP")
    const K = 1.6;
    const atoms = [
      ["N", 0, 0.30, 0],
      ["H", 0, -0.078, 0.937], ["H", -0.811, -0.078, -0.469], ["H", 0.811, -0.078, -0.469],
      ["LP", 0, 1.02, 0],
    ].map(([e, x, y, z]) => [e, x * K, y * K, z * K]);
    const bonds = [[0, 1, 1], [0, 2, 1], [0, 3, 1]];
    const cx = 0, cy = atoms.slice(0, 4).reduce((s, a) => s + a[2], 0) / 4 + 0.25;
    atoms.forEach((a) => { a[1] -= cx; a[2] -= cy; });
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
      bonds.forEach(([a, b, order]) => {
        const A = P[a], B = P[b];
        items.push({ z: (A.z + B.z) / 2 - 0.05, html: bondSvg(A, B, order) });
      });
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

  // ── sidebars: fit the glass panels to the visible window (scroll inside) ─
  const MQ_PRIMARY = window.matchMedia("(min-width: 76.25em)");
  const MQ_SECONDARY = window.matchMedia("(min-width: 60em)");
  function fitSidebars() {
    [[".md-sidebar--primary", MQ_PRIMARY], [".md-sidebar--secondary", MQ_SECONDARY]].forEach(([sel, mq]) => {
      const sw = document.querySelector(sel + " .md-sidebar__scrollwrap");
      if (!sw) return;
      if (!mq.matches) { sw.style.maxHeight = ""; return; }
      const top = sw.getBoundingClientRect().top;
      const h = window.innerHeight - Math.max(top, 0) - 16;
      sw.style.maxHeight = Math.max(160, Math.round(h)) + "px";
    });
  }
  let fitQueued = false;
  const queueFit = () => { if (!fitQueued) { fitQueued = true; requestAnimationFrame(() => { fitQueued = false; fitSidebars(); }); } };
  window.addEventListener("scroll", queueFit, { passive: true });
  window.addEventListener("resize", queueFit);

  // ── per-page init (runs on every page view, incl. instant navigation) ────
  function onPage() {
    addSettingsButton();
    queueFit();
    setTimeout(fitSidebars, 300); // after fonts/math settle
    renderMath(document.querySelector(".md-content") || document.body);
    initMolecule();
    initTilt();
    initHome();
    initFormulaFilter();
    initSettings();
  }
  if (window.document$ && typeof window.document$.subscribe === "function") window.document$.subscribe(onPage);
  else if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", onPage);
  else onPage();
  window.__apchemRefreshHome = initHome; // handy for testing
})();
