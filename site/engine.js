/* A tiny niri-like scrolling window manager for the browser.
   Columns sit on an endless horizontal strip per workspace; workspaces stack vertically. */
function Niri(opts) {
  const root = document.querySelector(opts.root || "#desk");
  const vp = root.querySelector(".viewport");
  const stack = document.createElement("div");
  stack.className = "wsstack";
  vp.appendChild(stack);
  const WIDTHS = opts.widths || [1 / 3, 1 / 2, 2 / 3];
  const WLABEL = ["1/3", "1/2", "2/3"];
  const S = { ws: [], cur: 0, overview: false, W: 0, H: 0, gap: 16, phone: false };
  const listeners = [];
  const api = {};

  /* ---------- workspaces ---------- */
  opts.workspaces.forEach((w, i) => {
    const el = document.createElement("section");
    el.className = "ws";
    el.innerHTML = `<div class="ws-label">${esc(w.name)}</div><div class="ws-empty"><p>Nothing open here. Press <kbd>D</kbd> for the launcher or pick something from the dock.</p></div><div class="strip"></div>`;
    el.addEventListener("click", (e) => {
      if (S.overview && !e.target.closest(".win")) { S.cur = i; toggleOverview(false); }
    });
    stack.appendChild(el);
    S.ws.push({ name: w.name, el, strip: el.querySelector(".strip"), cols: [], focus: 0, cam: 0, centred: false });
  });

  /* ---------- windows ---------- */
  function specOf(x) {
    if (typeof x === "string") return Object.assign({ key: x }, opts.apps[x]);
    return x;
  }
  function makeCol(spec) {
    const el = document.createElement("article");
    el.className = "win opening";
    el.tabIndex = -1;
    el.dataset.key = spec.key;
    if (spec.kind) el.dataset.kind = spec.kind;
    setAccent(el, spec.accent);
    el.innerHTML = `<header class="tb"><span class="tb-ic">${spec.icon || ""}</span><span class="tb-t">${esc(spec.title)}</span>
      <span class="tb-b"><button type="button" data-act="width" title="Cycle width (R)" aria-label="Cycle width"><span class="wl">1/2</span></button><button type="button" data-act="max" title="Maximise column (F)" aria-label="Maximise column">${ICON.max}</button><button type="button" data-act="full" title="Fullscreen (Shift F)" aria-label="Fullscreen">${ICON.full}</button><button type="button" data-act="pin" title="Pin to every workspace" aria-label="Pin to every workspace">${ICON.pin}</button><button type="button" data-act="float" title="Float or tile (V)" aria-label="Float or tile">${ICON.float}</button><button type="button" data-act="close" title="Close (Q)" aria-label="Close">${ICON.close}</button></span></header>
      <div class="wb"></div><span class="rz" aria-hidden="true"></span>`;
    const col = { key: spec.key, spec, el, w: spec.width ?? 1, full: false, x: 0, px: 0 };
    el.addEventListener("pointerdown", () => focusEl(col));
    el.querySelector(".tb-b").addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      e.stopPropagation();
      if (col.float) return ({ float: () => toggleFloat(col), pin: () => togglePin(col), close: () => closeFloat(col) })[b.dataset.act]?.();
      focusEl(col);
      ({ width: cycleWidth, max: maximise, full: () => fullscreen(), float: () => toggleFloat(col), close: close })[b.dataset.act]?.();
    });
    dragFloat(col);
    el.querySelector(".tb").addEventListener("dblclick", (e) => { if (!e.target.closest("button") && !col.float) { focusEl(col); fullscreen(); } });
    el.addEventListener("animationend", () => el.classList.remove("opening"), { once: true });
    spec.render(el.querySelector(".wb"), api, spec.arg, el);
    /* a window with nothing focusable inside still needs keyboard scrolling */
    const wb = el.querySelector(".wb");
    if (!wb.querySelector("a[href], button, input, select, textarea, video, [tabindex]")) wb.tabIndex = 0;
    return col;
  }
  function find(key) {
    for (let i = 0; i < S.ws.length; i++) {
      const j = S.ws[i].cols.findIndex((c) => c.key === key);
      if (j >= 0) return [i, j];
    }
    return null;
  }
  function open(x, o = {}) {
    const spec = specOf(x);
    const fl = S.floats.find((c) => c.key === spec.key);
    if (fl) { if (!fl.float.sticky) fl.float.ws = S.cur; front(fl); update(); return fl; }
    if (spec.floating || o.floating) return openFloat(spec);
    const hit = find(spec.key);
    if (hit) { S.cur = hit[0]; S.ws[hit[0]].focus = hit[1]; if (S.overview) toggleOverview(false); return update(); }
    const wi = o.ws ?? S.cur;
    const ws = S.ws[wi];
    const col = makeCol(spec);
    const at = o.end || !ws.cols.length ? ws.cols.length : ws.focus + 1;
    ws.cols.splice(at, 0, col);
    ws.strip.appendChild(col.el);
    ws.focus = at;
    if (!o.silent) { S.cur = wi; if (S.overview) toggleOverview(false); }
    update();
    return col;
  }
  function focusEl(col) {
    for (let i = 0; i < S.ws.length; i++) {
      const j = S.ws[i].cols.indexOf(col);
      if (j >= 0) {
        if (S.cur === i && S.ws[i].focus === j && !S.overview) return;
        S.cur = i; S.ws[i].focus = j;
        if (S.overview) toggleOverview(false);
        return update();
      }
    }
  }
  const W = () => S.ws[S.cur];
  const F = () => W().cols[W().focus];
  function focusCol(d) { const ws = W(); if (!ws.cols.length) return; ws.focus = Math.max(0, Math.min(ws.cols.length - 1, ws.focus + d)); ws.centred = false; update(); }
  function focusTo(i) { const ws = W(); if (!ws.cols.length) return; ws.focus = i < 0 ? ws.cols.length - 1 : Math.min(i, ws.cols.length - 1); update(); }
  function moveCol(d) {
    const ws = W(), i = ws.focus, j = i + d;
    if (j < 0 || j >= ws.cols.length) return bump(d);
    [ws.cols[i], ws.cols[j]] = [ws.cols[j], ws.cols[i]];
    ws.focus = j; update();
  }
  function moveToWs(d) {
    const from = W(), c = F(), t = S.cur + d;
    if (!c || t < 0 || t >= S.ws.length) return;
    from.cols.splice(from.focus, 1);
    from.focus = Math.max(0, Math.min(from.focus, from.cols.length - 1));
    const to = S.ws[t];
    to.cols.splice(to.cols.length ? to.focus + 1 : 0, 0, c);
    to.focus = to.cols.indexOf(c);
    to.strip.appendChild(c.el);
    S.cur = t; update();
  }
  function cycleWidth() { const c = F(); if (!c) return; if (c.full) c.full = false; else c.w = (c.w + 1) % WIDTHS.length; update(); }
  function maximise() { const c = F(); if (!c) return; c.full = !c.full; update(); }
  function centre() { const ws = W(); if (!F()) return; ws.centred = true; update(); }
  function close() {
    const ws = W(), c = F();
    if (!c) return;
    if (c.kiosk) { fullscreen(false, true); }
    ws.cols.splice(ws.focus, 1);
    ws.focus = Math.max(0, Math.min(ws.focus, ws.cols.length - 1));
    c.el.classList.add("closing");
    setTimeout(() => c.el.remove(), reduce() ? 0 : 260);
    if (c.spec.onClose) c.spec.onClose();
    update();
  }
  function ws(d) { gotoWs(S.cur + d); }
  function gotoWs(i) { if (i < 0 || i >= S.ws.length) return; S.cur = i; update(); }
  function bump(d) { const c = F(); if (!c || reduce()) return; c.el.animate([{ translate: "0" }, { translate: `${d * 14}px` }, { translate: "0" }], { duration: 260, easing: "ease-out" }); }
  const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- layout ---------- */
  function layout() {
    S.W = vp.clientWidth; S.H = vp.clientHeight;
    S.phone = S.W < 700;
    const g = (S.gap = S.phone ? Math.min(10, opts.gap ?? 16) : opts.gap ?? 16);
    S.ws.forEach((ws, wi) => {
      ws.el.style.height = S.H + "px";
      ws.el.style.top = wi * S.H + "px";
      let x = g;
      ws.cols.forEach((c, ci) => {
        const px = S.phone || c.full ? S.W - 2 * g : Math.round(WIDTHS[c.w] * (S.W - g) - g);
        c.x = x; c.px = px;
        c.el.querySelector(".wl").textContent = c.full ? "full" : WLABEL[c.w] || "";
        if (c.kiosk) { x += px + g; return; }
        c.el.style.width = px + "px";
        c.el.style.height = S.H - 2 * g + "px";
        c.el.style.transform = `translate(${x}px, ${g}px)`;
        c.el.classList.toggle("focused", wi === S.cur && ci === ws.focus);
        c.el.classList.toggle("active-in-ws", ci === ws.focus);
        c.el.querySelector(".wl").textContent = c.full ? "full" : WLABEL[c.w] || "";
        x += px + g;
      });
      ws.total = x;
      ws.el.classList.toggle("is-empty", !ws.cols.length);
      ws.el.classList.toggle("current", wi === S.cur);
      const c = ws.cols[ws.focus];
      if (c) {
        if (S.phone) ws.cam = c.x - g;
        else if (ws.centred || opts.alwaysCentre) ws.cam = c.x + c.px / 2 - S.W / 2;
        else {
          if (c.x - g < ws.cam) ws.cam = c.x - g;
          else if (c.x + c.px + g > ws.cam + S.W) ws.cam = c.x + c.px + g - S.W;
          ws.cam = Math.max(0, Math.min(ws.cam, Math.max(0, ws.total - S.W)));
          if (c.x - g < ws.cam) ws.cam = c.x - g;
        }
      } else ws.cam = 0;
      ws.strip.style.transform = `translateX(${-ws.cam}px)`;
    });
    if (S.overview) {
      /* sized so two and a half workspaces fit; the camera follows the current one and stops at the ends */
      const padF = 0.08, s = (1 - 2 * padF) / 2.5, n = S.ws.length, pad = S.H * padF;
      let y = S.H / 2 - s * (S.cur * S.H + S.H / 2);
      if (s * n * S.H + 2 * pad <= S.H) y = (S.H - s * n * S.H) / 2;
      else y = Math.max(S.H - s * n * S.H - pad, Math.min(pad, y));
      stack.style.transform = `translate(${S.W / 2 - (s * S.W) / 2}px, ${y}px) scale(${s})`;
    } else stack.style.transform = `translateY(${-S.cur * S.H}px)`;
    root.classList.toggle("overview", S.overview);
    root.classList.toggle("phone", S.phone);
  }
  /* ---------- fullscreen: the window leaves the strip and fills the screen, inside a bezel ---------- */
  const KL = document.createElement("div");
  KL.className = "kiosk-layer";
  root.appendChild(KL);
  KL.addEventListener("click", (e) => { if (e.target === KL) fullscreen(false); });
  let kc = null;
  const dur = () => { const v = getComputedStyle(document.documentElement).getPropertyValue("--dur").trim() || ".45s"; return reduce() ? 0 : parseFloat(v) * (v.endsWith("ms") ? 1 : 1000); };
  /* CSS zoom on the root scales the whole desk; pointer and rect values arrive in screen pixels, so divide by it */
  const zoom = () => parseFloat(getComputedStyle(root).zoom) || 1;
  const place = (el, r) => Object.assign(el.style, { left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px" });
  function slotRect(c) {
    const v = vp.getBoundingClientRect(), r = root.getBoundingClientRect(), ws = S.ws.find((w) => w.cols.includes(c)) || W(), z = zoom();
    return { left: (v.left - r.left) / z + c.x - ws.cam, top: (v.top - r.top) / z + S.gap, width: c.px, height: S.H - 2 * S.gap };
  }
  function screenRect() { const b = S.phone ? 6 : opts.bezel ?? 12; return { left: b, top: b, width: root.clientWidth - 2 * b, height: root.clientHeight - 2 * b }; }
  function fullscreen(v, instant) {
    const on = v ?? !kc;
    if (on && !kc) {
      const c = F(); if (!c) return;
      if (S.overview) toggleOverview(false);
      kc = c; c.kiosk = true;
      place(c.el, slotRect(c));
      c.el.style.transform = "none";
      KL.appendChild(c.el);
      c.el.classList.add("kiosk");
      root.classList.add("kiosk-on");
      void c.el.offsetWidth;
      place(c.el, screenRect());
      c.el.focus({ preventScroll: true });
      if (c.spec.onFullscreen) c.spec.onFullscreen(true, c);
      listeners.forEach((f) => f(api));
    } else if (!on && kc) {
      const c = kc; kc = null;
      root.classList.remove("kiosk-on");
      if (!instant) place(c.el, slotRect(c));
      setTimeout(() => {
        c.kiosk = false;
        c.el.classList.remove("kiosk");
        Object.assign(c.el.style, { left: "", top: "" });
        const ws = S.ws.find((w) => w.cols.includes(c));
        if (ws) ws.strip.appendChild(c.el); else c.el.remove();
        update();
      }, instant ? 0 : dur());
      if (c.spec.onFullscreen) c.spec.onFullscreen(false, c);
    }
  }
  addEventListener("resize", () => { if (kc) place(kc.el, screenRect()); });

  /* ---------- floating windows: above the strip, draggable, optionally pinned to every workspace ---------- */
  const FL = document.createElement("div");
  FL.className = "float-layer";
  vp.appendChild(FL);
  S.floats = [];
  let lastFloat = null;
  /* raise with z-index, not by moving the element: re-appending it on pointerdown swallowed the click, so buttons in floats did nothing */
  let zTop = 1;
  function front(c) { if (c.el.parentNode !== FL) FL.appendChild(c.el); c.el.style.zIndex = ++zTop; lastFloat = c; S.floats.forEach((f) => f.el.classList.toggle("float-top", f === c)); }
  function fitFloat(f) {
    f.w = Math.max(220, Math.min(f.w, S.W - 16)); f.h = Math.max(120, Math.min(f.h, S.H - 16));
    f.x = Math.max(8, Math.min(f.x, S.W - f.w - 8)); f.y = Math.max(8, Math.min(f.y, S.H - f.h - 8));
  }
  function openFloat(spec, rect) {
    const c = makeCol(spec), o = spec.float || {};
    const w = rect ? rect.width : o.w || 340, h = rect ? rect.height : o.h || 220;
    c.float = { w, h, sticky: !!o.sticky, ws: S.cur,
      x: rect ? rect.left : o.x === "left" ? 16 : o.x === "centre" ? (S.W - w) / 2 : S.W - w - 16,
      y: rect ? rect.top : o.y === "top" ? 16 : S.H - h - 16 };
    c.el.classList.add("floating");
    S.floats.push(c);
    front(c);
    update();
    return c;
  }
  function closeFloat(c) {
    S.floats.splice(S.floats.indexOf(c), 1);
    c.el.classList.add("closing");
    setTimeout(() => c.el.remove(), reduce() ? 0 : 260);
    if (c.spec.onClose) c.spec.onClose();
    update();
  }
  function togglePin(c) { c.float.sticky = !c.float.sticky; c.float.ws = S.cur; update(); toast(c.float.sticky ? "Pinned" : "Unpinned", c.float.sticky ? `${esc(c.spec.title)} now follows you to every workspace.` : `${esc(c.spec.title)} stays on this workspace.`, 2200); }
  function toggleFloat(c) {
    c = c || F();
    if (!c) return;
    if (c.float) {
      S.floats.splice(S.floats.indexOf(c), 1);
      delete c.float;
      c.el.classList.remove("floating", "away", "float-top");
      Object.assign(c.el.style, { width: "", height: "" });
      const ws = W(), at = ws.cols.length ? ws.focus + 1 : 0;
      ws.cols.splice(at, 0, c); ws.focus = at; ws.strip.appendChild(c.el);
      update();
    } else {
      if (c.kiosk) fullscreen(false, true);
      const ws = S.ws.find((w) => w.cols.includes(c));
      const r = { left: c.x - ws.cam + 30, top: S.gap + 30, width: Math.min(c.px, 460), height: Math.min(S.H - 2 * S.gap - 60, 420) };
      ws.cols.splice(ws.cols.indexOf(c), 1);
      ws.focus = Math.max(0, Math.min(ws.focus, ws.cols.length - 1));
      c.float = { x: r.left, y: r.top, w: r.width, h: r.height, sticky: false, ws: S.cur };
      c.el.classList.add("floating");
      c.el.classList.remove("focused");
      S.floats.push(c); front(c); update();
    }
  }
  function dragFloat(c) {
    const start = (e, mode) => {
      if (!c.float || e.button > 0) return;
      e.preventDefault();
      front(c);
      const sx = e.clientX, sy = e.clientY, f = { ...c.float }, z = zoom();
      c.el.classList.add("dragging");
      const mv = (ev) => {
        if (mode === "move") { c.float.x = f.x + (ev.clientX - sx) / z; c.float.y = f.y + (ev.clientY - sy) / z; }
        else { c.float.w = f.w + (ev.clientX - sx) / z; c.float.h = f.h + (ev.clientY - sy) / z; }
        layoutFloats();
      };
      const up = () => { c.el.classList.remove("dragging"); removeEventListener("pointermove", mv); removeEventListener("pointerup", up); };
      addEventListener("pointermove", mv); addEventListener("pointerup", up);
    };
    c.el.querySelector(".tb").addEventListener("pointerdown", (e) => { if (!e.target.closest("button")) start(e, "move"); });
    c.el.querySelector(".rz").addEventListener("pointerdown", (e) => start(e, "size"));
    c.el.addEventListener("pointerdown", () => c.float && front(c));
  }
  function layoutFloats() {
    S.floats.forEach((c) => {
      const f = c.float;
      fitFloat(f);
      Object.assign(c.el.style, { width: f.w + "px", height: f.h + "px", transform: `translate(${f.x}px, ${f.y}px)` });
      c.el.classList.toggle("away", !f.sticky && f.ws !== S.cur);
      c.el.classList.toggle("pinned", f.sticky);
      if (c.spec.onLayout) c.spec.onLayout(c);
    });
  }

  function update() {
    if (kc && F() !== kc) fullscreen(false, true);
    layout();
    layoutFloats();
    const c = F();
    if (c && !S.overview && document.activeElement && !c.el.contains(document.activeElement) && !FL.contains(document.activeElement) && !document.activeElement.closest("[data-keep-focus]") && !isTyping(document.activeElement)) c.el.focus({ preventScroll: true });
    if (c && c.spec.onFocus) c.spec.onFocus(c);
    syncDock();
    listeners.forEach((f) => f(api));
  }
  function toggleOverview(v) { S.overview = v ?? !S.overview; update(); }
  addEventListener("resize", () => update());

  function setAccent(el, a) { if (!a) return; el.style.setProperty("--accent", `var(--${a})`); el.style.setProperty("--accent-ink", `var(--${a}-ink, var(--${a}))`); }
  /* ---------- dock ---------- */
  const dock = root.querySelector(".dock");
  if (dock && opts.dock) {
    /* the dock takes app ids, or groups of them: { name, ws, items } puts a labelled group per workspace */
    const btn = (id, wsI) => {
      const a = opts.apps[id];
      return `<button type="button" class="dk" data-app="${id}"${wsI != null ? ` data-ws="${wsI}"` : ""} style="--accent:var(--${a.accent || "a1"});--accent-ink:var(--${a.accent || "a1"}-ink, var(--${a.accent || "a1"}))" aria-label="${esc(a.title)}"><span class="dk-ic">${a.icon}</span><span class="dk-l">${esc(a.dockLabel || a.title)}</span><span class="dk-tip">${esc(a.dockLabel || a.title)}${a.hotkey ? ` <kbd>${a.hotkey}</kbd>` : ""}</span><span class="dk-run"></span></button>`;
    };
    dock.innerHTML = opts.dock.map((x) => typeof x === "string" ? btn(x) :
      `<div class="dk-g"${x.ws != null ? ` data-g="${x.ws}"` : ""} role="group" aria-label="${esc(x.name)}"><button type="button" class="dk-gl"${x.ws != null ? ` data-goto="${x.ws}" title="Go to workspace ${x.ws + 1}: ${esc(x.name)} (${x.ws + 1})"` : " disabled"}>${x.ws != null ? `<b>${x.ws + 1}</b>` : `<b>${ICON.grid}</b>`}<span>${esc(x.name)}</span></button>${x.items.map((id) => btn(id, x.ws)).join("")}</div>`).join("");
    dock.classList.toggle("grouped", opts.dock.some((x) => typeof x !== "string"));
    let dAcc = 0, dLast = 0;
    dock.addEventListener("wheel", (e) => {
      e.preventDefault();
      dAcc += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const now = Date.now();
      if (Math.abs(dAcc) > 50 && now - dLast > 240) { focusCol(dAcc > 0 ? 1 : -1); dAcc = 0; dLast = now; }
    }, { passive: false });
    dock.addEventListener("click", (e) => {
      const g = e.target.closest("[data-goto]");
      if (g) return gotoWs(+g.dataset.goto);
      const b = e.target.closest(".dk");
      if (b) open(b.dataset.app, b.dataset.ws != null ? { ws: +b.dataset.ws } : {});
    });
  }
  function syncDock() {
    if (!dock) return;
    dock.querySelectorAll(".dk").forEach((b) => {
      const h = find(b.dataset.app), fl = S.floats.find((c) => c.key === b.dataset.app);
      b.classList.toggle("running", !!h || !!fl);
      b.classList.toggle("is-focused", !!h && h[0] === S.cur && W().focus === h[1]);
    });
    dock.querySelectorAll(".dk-g[data-g]").forEach((g) => g.classList.toggle("current", +g.dataset.g === S.cur));
  }

  /* ---------- launcher ---------- */
  const L = document.createElement("div");
  L.className = "launcher";
  L.hidden = true;
  L.innerHTML = `<div class="ln-box" role="dialog" aria-label="Launcher"><input id="ln-q" autocomplete="off" spellcheck="false" placeholder="Search apps, projects, and commands"><ul class="ln-list"></ul><p class="ln-foot"><kbd>Enter</kbd> open <kbd>Up</kbd><kbd>Down</kbd> choose <kbd>Esc</kbd> close</p></div>`;
  root.appendChild(L);
  const Lq = L.querySelector("input"), Ll = L.querySelector("ul");
  let Litems = [], Lsel = 0;
  function launcherItems() {
    const base = Object.keys(opts.apps).filter((k) => !opts.apps[k].hidden).map((k) => ({ label: opts.apps[k].title, hint: "App", icon: opts.apps[k].icon, run: () => open(k) }));
    return base.concat((opts.launcherExtras || (() => []))(api));
  }
  function renderL() {
    const q = Lq.value.trim().toLowerCase();
    Litems = launcherItems().filter((i) => !q || (i.label + " " + i.hint).toLowerCase().includes(q)).slice(0, 8);
    Lsel = Math.min(Lsel, Math.max(0, Litems.length - 1));
    Ll.innerHTML = Litems.length ? Litems.map((it, i) => `<li class="${i === Lsel ? "sel" : ""}" data-i="${i}"><span class="ln-ic">${it.icon || ""}</span><span class="ln-l">${esc(it.label)}</span><span class="ln-h">${esc(it.hint)}</span></li>`).join("") : `<li class="none">Nothing matches. Try "resume" or "5-axis".</li>`;
  }
  function launcher(v) {
    L.hidden = !(v ?? L.hidden);
    if (!L.hidden) { Lq.value = ""; Lsel = 0; renderL(); setTimeout(() => Lq.focus(), 0); }
    else if (F()) F().el.focus({ preventScroll: true });
  }
  Lq.addEventListener("input", () => { Lsel = 0; renderL(); });
  Lq.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { Lsel = (Lsel + 1) % Math.max(1, Litems.length); renderL(); e.preventDefault(); }
    else if (e.key === "ArrowUp") { Lsel = (Lsel - 1 + Litems.length) % Math.max(1, Litems.length); renderL(); e.preventDefault(); }
    else if (e.key === "Enter") { const it = Litems[Lsel]; launcher(false); if (it) it.run(); e.preventDefault(); }
    else if (e.key === "Escape") { launcher(false); e.preventDefault(); }
    e.stopPropagation();
  });
  Ll.addEventListener("click", (e) => { const li = e.target.closest("li[data-i]"); if (!li) return; const it = Litems[+li.dataset.i]; launcher(false); it.run(); });
  L.addEventListener("click", (e) => { if (e.target === L) launcher(false); });

  /* ---------- hotkey overlay ---------- */
  const HK = document.createElement("div");
  HK.className = "hotkeys";
  HK.hidden = true;
  const keys = [
    ["H / Left", "Focus column to the left"], ["L / Right", "Focus column to the right"],
    ["Shift + H / L", "Move column left or right"], ["K / J, Up / Down", "Workspace up or down"],
    ["1 to " + S.ws.length, "Jump to a workspace"], ["Shift + J / K", "Move window to another workspace"],
    ["R", "Cycle width: 1/3, 1/2, 2/3"], ["F", "Maximise column"], ["Shift + F", "Fullscreen window"], ["V", "Float the window, or tile it again"], ["Shift + V", "Tile the last floating window"], ["C", "Centre column"],
    ["Q", "Close window"], ["O", "Overview"], ["D or Space", "Launcher"], ["T", "Terminal"], ["Esc", "Leave a text box, close overlays"],
  ].concat(opts.extraKeys || []);
  HK.innerHTML = `<div class="hk-box" role="dialog" aria-label="Keyboard shortcuts"><h2>Important hotkeys</h2><p class="hk-sub">Every key works on its own, or with <kbd>Alt</kbd> held (the Mod key). With <kbd>Alt</kbd> they work even while typing.</p><dl>${keys.map(([k, v]) => `<div><dt>${k.split(" ").map((p) => (/^[A-Za-z0-9]+$/.test(p) && p !== "or" && p !== "to" ? `<kbd>${p}</kbd>` : p)).join(" ")}</dt><dd>${v}</dd></div>`).join("")}</dl><p class="hk-sub">${opts.eggHint || "There are a few secrets. The terminal is a good place to start."}</p></div>`;
  root.appendChild(HK);
  HK.addEventListener("click", () => (HK.hidden = true));
  const hotkeys = (v) => (HK.hidden = !(v ?? HK.hidden));

  /* ---------- toasts ---------- */
  const T = document.createElement("div");
  T.className = "toasts";
  T.setAttribute("aria-live", "polite");
  root.appendChild(T);
  function toast(title, body, ms = 3600, force) {
    if (root.classList.contains("dnd") && !force) return;
    const n = document.createElement("div");
    n.className = "toast";
    n.innerHTML = `<strong>${esc(title)}</strong>${body ? `<span>${body}</span>` : ""}`;
    T.appendChild(n);
    setTimeout(() => { n.classList.add("out"); setTimeout(() => n.remove(), 300); }, ms);
  }

  /* ---------- input ---------- */
  const isTyping = (el) => el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
  const seq = [];
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey || e.metaKey) return;
    if (!L.hidden) return;
    const typing = isTyping(e.target);
    if (typing && !e.altKey) { if (e.key === "Escape") { e.target.blur(); F() && F().el.focus({ preventScroll: true }); } return; }
    seq.push(e.key.length === 1 ? e.key.toLowerCase() : e.key);
    if (seq.length > 12) seq.shift();
    for (const egg of opts.eggs || []) {
      const s = egg.seq;
      if (seq.slice(-s.length).join(",") === s.join(",")) { seq.length = 0; egg.run(api); }
    }
    const sh = e.shiftKey, k = e.code;
    const act = {
      ArrowLeft: () => (sh ? moveCol(-1) : focusCol(-1)), KeyH: () => (sh ? moveCol(-1) : focusCol(-1)),
      ArrowRight: () => (sh ? moveCol(1) : focusCol(1)), KeyL: () => (sh ? moveCol(1) : focusCol(1)),
      ArrowUp: () => (sh ? moveToWs(-1) : ws(-1)), KeyK: () => (sh ? moveToWs(-1) : ws(-1)),
      ArrowDown: () => (sh ? moveToWs(1) : ws(1)), KeyJ: () => (sh ? moveToWs(1) : ws(1)),
      Home: () => focusTo(0), End: () => focusTo(-1),
      KeyR: cycleWidth, KeyF: () => (sh ? fullscreen() : maximise()), KeyC: centre, KeyQ: close,
      KeyO: () => toggleOverview(), KeyD: () => launcher(true), Space: () => launcher(true),
      KeyT: () => open("terminal"),
      KeyV: () => (sh ? lastFloat && S.floats.includes(lastFloat) && toggleFloat(lastFloat) : toggleFloat()),
      Slash: () => hotkeys(), Escape: () => { if (!HK.hidden) hotkeys(false); else if (kc) fullscreen(false); else if (S.overview) toggleOverview(false); },
      Enter: () => S.overview && toggleOverview(false),
    }[k] || (/^Digit[1-9]$/.test(k) ? () => gotoWs(+k.slice(5) - 1) : null);
    const own = opts.keys && opts.keys[k];
    if (own) { e.preventDefault(); own(api, e); return; }
    if (act) {
      if ((k === "Space" || k === "Enter") && e.target.closest && e.target.closest("button, a")) return;
      if (k === "ArrowUp" || k === "ArrowDown") { const wb = e.target.closest && e.target.closest(".wb"); if (wb && wb.scrollHeight > wb.clientHeight && !e.altKey) return; }
      e.preventDefault();
      act();
    }
  });
  let acc = 0, lastWheel = 0;
  vp.addEventListener("click", (e) => { if (S.overview && !e.target.closest(".ws")) toggleOverview(false); });
  let oAcc = 0, oLast = 0;
  vp.addEventListener("wheel", (e) => {
    if (S.overview) {
      /* over a workspace: slide its windows along, like H and L; anywhere else: step between workspaces */
      e.preventDefault();
      oAcc += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const now = Date.now();
      if (Math.abs(oAcc) <= 50 || now - oLast <= 260) return;
      const dir = oAcc > 0 ? 1 : -1; oAcc = 0; oLast = now;
      const wsEl = e.target.closest(".ws"), w = wsEl && S.ws.find((x) => x.el === wsEl);
      if (w) { const f = Math.max(0, Math.min(w.cols.length - 1, w.focus + dir)); if (f !== w.focus) { w.focus = f; update(); } }
      else gotoWs(S.cur + dir);
      return;
    }
    const inBody = e.target.closest(".wb");
    const horiz = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    if (inBody && !horiz && !e.shiftKey) return;
    e.preventDefault();
    const d = horiz ? e.deltaX : e.deltaY;
    acc += d;
    const now = Date.now();
    if (Math.abs(acc) > 60 && now - lastWheel > 280) { focusCol(acc > 0 ? 1 : -1); acc = 0; lastWheel = now; }
  }, { passive: false });
  let tx = 0, ty = 0, lock = null;
  vp.addEventListener("touchstart", (e) => { if (S.overview) return; tx = e.touches[0].clientX; ty = e.touches[0].clientY; lock = null; }, { passive: true });
  vp.addEventListener("touchmove", (e) => {
    if (S.overview) return;
    const dx = e.touches[0].clientX - tx, dy = e.touches[0].clientY - ty;
    if (!lock && Math.abs(dx) + Math.abs(dy) > 10) lock = Math.abs(dx) > Math.abs(dy) * 1.2 ? "x" : "y";
    if (lock === "x") { W().strip.style.transition = "none"; W().strip.style.transform = `translateX(${-W().cam + dx}px)`; }
  }, { passive: true });
  vp.addEventListener("touchend", (e) => {
    if (lock !== "x") return;
    const dx = e.changedTouches[0].clientX - tx;
    W().strip.style.transition = "";
    if (Math.abs(dx) > 50) focusCol(dx < 0 ? 1 : -1); else update();
    lock = null;
  });

  /* ---------- theme ---------- */
  root.querySelectorAll("[data-theme-toggle]").forEach((b) => b.addEventListener("click", () => {
    const de = document.documentElement;
    const dark = de.dataset.theme ? de.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    de.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("theme", de.dataset.theme); } catch (_) {}
    listeners.forEach((f) => f(api));
  }));

  /* the column (tiled or floating) that owns an element, and a way to make it the focused one */
  function colOf(el) { const w = el && el.closest && el.closest(".win"); if (!w) return null; for (const ws of S.ws) { const c = ws.cols.find((c) => c.el === w); if (c) return c; } return S.floats.find((c) => c.el === w) || null; }
  function select(c) { if (!c) return; const hit = find(c.key); if (hit) { S.cur = hit[0]; S.ws[hit[0]].focus = hit[1]; update(); } else if (S.floats.includes(c)) { front(c); update(); } }
  Object.assign(api, {
    S, open, close, focusCol, focusTo, moveCol, moveToWs, cycleWidth, maximise, centre, ws, gotoWs, find, colOf, select, togglePin, widthLabel: (c) => WLABEL[c.w],
    fullscreen, isFullscreen: () => !!kc, openFloat, toggleFloat, closeFloat, floats: () => S.floats,
    setGap: (n) => { opts.gap = n; update(); },
    overview: toggleOverview, launcher, hotkeys, toast, update,
    onChange: (f) => listeners.push(f), focused: F, current: W, root, vp,
  });
  opts.workspaces.forEach((w, i) => (w.open || []).forEach((id) => open(id, { ws: i, silent: true, end: true })));
  S.ws.forEach((w) => { w.focus = 0; w.cols.forEach((c) => c.el.classList.remove("opening")); });
  update();
  requestAnimationFrame(() => { update(); setTimeout(() => root.classList.add("ready"), 50); });
  return api;
}
try { const t = localStorage.getItem("theme"); if (t) document.documentElement.dataset.theme = t; } catch (_) {}

/* A small shell for the Terminal window. */
function Term(body, api, cmds, o = {}) {
  body.innerHTML = `<div class="term"><div class="t-out" role="log"></div><form class="t-row"><label for="${o.id || "t-in"}" class="t-ps">${o.ps || "rahul@niri ~ $"}</label><input id="${o.id || "t-in"}" autocomplete="off" spellcheck="false" autocapitalize="off" aria-label="Terminal input"></form></div>`;
  const out = body.querySelector(".t-out"), inp = body.querySelector("input"), hist = [];
  let hi = 0;
  const print = (h, cls = "") => { const d = document.createElement("div"); d.className = "t-line " + cls; d.innerHTML = h; out.appendChild(d); body.scrollTop = body.scrollHeight; };
  const all = Object.assign({
    help: () => "Commands: " + Object.keys(all).filter((k) => !all[k].secret).sort().join(", ") + "<br><span class=dim>Press Esc to hand the keyboard back to the desktop.</span>",
    clear: () => { out.innerHTML = ""; return ""; },
    echo: (a) => esc(a.join(" ")),
    exit: () => { setTimeout(() => api.close(), 150); return "logout"; },
    history: () => hist.map((h, i) => `${i + 1}  ${esc(h)}`).join("<br>"),
  }, cmds);
  for (const k of ["sudo", "rm", "vim", "emacs", "exit"]) if (all[k]) all[k].secret = !["exit"].includes(k);
  body.closest(".win").addEventListener("click", (e) => { if (!e.target.closest("a,button")) inp.focus({ preventScroll: true }); });
  /* take the keyboard when the window opens, so typed letters reach the shell and not the desktop shortcuts */
  setTimeout(() => { if (body.closest(".win").classList.contains("focused")) inp.focus({ preventScroll: true }); }, 0);
  inp.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && !e.altKey) { if (hist.length) { hi = Math.max(0, hi - 1); inp.value = hist[hi]; } e.preventDefault(); }
    if (e.key === "ArrowDown" && !e.altKey) { hi = Math.min(hist.length, hi + 1); inp.value = hist[hi] || ""; e.preventDefault(); }
  });
  body.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const line = inp.value.trim();
    inp.value = "";
    print(`<span class="t-ps">${o.ps || "rahul@niri ~ $"}</span> ${esc(line)}`);
    if (!line) return;
    hist.push(line); hi = hist.length;
    const [c, ...a] = line.split(/\s+/);
    const f = all[c.toLowerCase()] || (o.fallback && o.fallback(line));
    const r = f ? (typeof f === "function" ? f(a, print, api, line) : f) : `${esc(c)}: command not found. Try <b>help</b>.`;
    if (r) print(r);
  });
  (o.banner || []).forEach((b) => print(b));
  return { print, focus: () => inp.focus({ preventScroll: true }) };
}

const ICON = {
  max: `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h12M5 5L2 8l3 3M11 5l3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  full: `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 6V3h3M10 3h3v3M13 10v3h-3M6 13H3v-3" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`,
  pin: `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 2h4l-.5 4 2.5 2.5H4L6.5 6zM8 8.5V14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  float: `<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="5" width="8" height="8" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M6 5V3h8v8h-4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`,
  music: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V6l10-2v12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="6.5" cy="18" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="16.5" cy="16" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`,
  play: `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3l8 5-8 5z" fill="currentColor"/></svg>`,
  pause: `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 3h3v10H4zM9 3h3v10H9z" fill="currentColor"/></svg>`,
  next: `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l7 5-7 5zM11 3h2v10h-2z" fill="currentColor"/></svg>`,
  prev: `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 3L6 8l7 5zM3 3h2v10H3z" fill="currentColor"/></svg>`,
  panel: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4" width="7" height="7" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="13.5" y="4" width="7" height="7" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="3.5" y="14" width="7" height="6" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="13.5" y="14" width="7" height="6" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`,
  guide: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9.6 9.5a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.5v.5M12 16.5h.01" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  globe: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 12h17M12 3.5c2.6 2.6 3.6 5.4 3.6 8.5s-1 5.9-3.6 8.5c-2.6-2.6-3.6-5.4-3.6-8.5s1-5.9 3.6-8.5z" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`,
  lock: `<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3.5" y="7" width="9" height="6.5" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`,
  back: `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`,
  fwd: `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`,
  reload: `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8a5 5 0 1 1-1.5-3.6M13 3v3h-3" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`,
  ext: `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9 3h4v4M13 3L7 9M11 9.5V13H3V5h3.5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`,
  close: `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`,
  resume: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h8l4 4v14H6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 11h6M9 15h6M9 7h3" stroke="currentColor" stroke-width="1.8"/></svg>`,
  work: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 4v4M12 16v4M4 12h4M16 12h4" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>`,
  term: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M7 10l3 2-3 2M12 15h5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`,
  photo: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12.5" r="3.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 6l1.5-2h5L16 6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`,
  home: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11l8-7 8 7v9H4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 20v-5h4v5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`,
  about: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 7l9 6 9-6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`,
  lab: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="6" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="4" y="14" width="16" height="6" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 7h.01M8 17h.01" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>`,
  moon: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  grid: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="5" height="14" rx="1" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="10" y="5" width="5" height="14" rx="1" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="17" y="5" width="4" height="14" rx="1" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`,
  search: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M16 16l4 4" stroke="currentColor" stroke-width="1.8"/></svg>`,
  sliders: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="16" cy="7" r="2.2" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="10" cy="17" r="2.2" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`,
  keys: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="6" width="19" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
};
