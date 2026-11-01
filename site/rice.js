/* ---------- Appearance: colour schemes, wallpapers, glass, shape, motion, presets ---------- */
const K = ["bg", "surf", "surf2", "line", "fg", "mute", "a1", "a2", "a3", "a4", "a1-ink", "a2-ink", "a3-ink", "a4-ink", "on-a", "ring"];
const pal = (v) => Object.fromEntries(K.map((k, i) => [k, v[i]]));
const SCHEMES = {
  noctalia: { name: "Noctalia",
    dark: pal(["#070722", "#11112d", "#1a1a3d", "#262663", "#f3edf7", "#8b8fc4", "#fff59b", "#a9aefe", "#9bfece", "#ff8fa3", "#fff59b", "#a9aefe", "#9bfece", "#ff8fa3", "#070722", "#a9aefe"]),
    light: pal(["#e9e6f7", "#fbfaff", "#f0eefb", "#d6d2f0", "#1b1a33", "#5e5f8c", "#ffe14d", "#6f77f2", "#2fd59a", "#f2557a", "#7a6500", "#4048c9", "#0b7d55", "#b51f45", "#1b1a33", "#6f77f2"]) },
  catppuccin: { name: "Catppuccin",
    dark: pal(["#11111b", "#1e1e2e", "#313244", "#45475a", "#cdd6f4", "#9399b2", "#f9e2af", "#cba6f7", "#a6e3a1", "#f38ba8", "#f9e2af", "#cba6f7", "#a6e3a1", "#f38ba8", "#11111b", "#cba6f7"]),
    light: pal(["#dce0e8", "#eff1f5", "#e6e9ef", "#ccd0da", "#4c4f69", "#6c6f85", "#df8e1d", "#8839ef", "#40a02b", "#d20f39", "#9a5f0d", "#8839ef", "#2f7a1f", "#d20f39", "#eff1f5", "#8839ef"]) },
  rosepine: { name: "Rosé Pine",
    dark: pal(["#191724", "#1f1d2e", "#26233a", "#403d52", "#e0def4", "#908caa", "#f6c177", "#c4a7e7", "#9ccfd8", "#eb6f92", "#f6c177", "#c4a7e7", "#9ccfd8", "#eb6f92", "#191724", "#ebbcba"]),
    light: pal(["#f2e9e1", "#fffaf3", "#faf4ed", "#dfdad9", "#575279", "#797593", "#ea9d34", "#907aa9", "#56949f", "#b4637a", "#a86a10", "#7a5f99", "#3d7a85", "#b4637a", "#fffaf3", "#d7827e"]) },
  gruvbox: { name: "Gruvbox",
    dark: pal(["#1d2021", "#282828", "#3c3836", "#504945", "#ebdbb2", "#a89984", "#fabd2f", "#83a598", "#b8bb26", "#fb4934", "#fabd2f", "#83a598", "#b8bb26", "#fb4934", "#1d2021", "#fe8019"]),
    light: pal(["#f2e5bc", "#fbf1c7", "#ebdbb2", "#d5c4a1", "#3c3836", "#7c6f64", "#d79921", "#458588", "#98971a", "#cc241d", "#b57614", "#076678", "#79740e", "#9d0006", "#fbf1c7", "#af3a03"]) },
  tokyo: { name: "Tokyo Night",
    dark: pal(["#16161e", "#1a1b26", "#24283b", "#2f334d", "#c0caf5", "#7a83b0", "#e0af68", "#7aa2f7", "#9ece6a", "#f7768e", "#e0af68", "#7aa2f7", "#9ece6a", "#f7768e", "#16161e", "#bb9af7"]),
    light: pal(["#d5d6db", "#e9e9ed", "#dcdee6", "#c4c8da", "#343b58", "#5a6390", "#c08a3e", "#2e7de9", "#587539", "#f52a65", "#8c6c3e", "#2e7de9", "#587539", "#d1164f", "#ffffff", "#9854f1"]) },
  everforest: { name: "Everforest",
    dark: pal(["#232a2e", "#2d353b", "#343f44", "#475258", "#d3c6aa", "#9da9a0", "#dbbc7f", "#7fbbb3", "#a7c080", "#e67e80", "#dbbc7f", "#7fbbb3", "#a7c080", "#e67e80", "#232a2e", "#a7c080"]),
    light: pal(["#efebd4", "#fdf6e3", "#f4f0d9", "#e0dcc7", "#5c6a72", "#748276", "#dfa000", "#3a94c5", "#8da101", "#f85552", "#a87700", "#2f7aa3", "#6b7a00", "#d13c39", "#fdf6e3", "#8da101"]) },
  wallpaper: { name: "From wallpaper" },
};
const WALLS = { volute: "Volute", aurora: "Aurora", waterline: "Waterline", dunes: "Dunes", bokeh: "Bokeh", solid: "Plain", custom: "Your own" };
const MOTION = { snappy: ["Snappy", ".22s", "cubic-bezier(.2, .8, .2, 1)"], smooth: ["Smooth", ".45s", "cubic-bezier(.22, 1, .36, 1)"], springy: ["Springy", ".65s", "cubic-bezier(.34, 1.56, .64, 1)"], slow: ["Slow", "1.1s", "cubic-bezier(.22, 1, .36, 1)"], off: ["Off", ".001s", "linear"] };
const OPENS = { zoom: ["Zoom", "win-in"], slide: ["Slide up", "win-slide"], drop: ["Drop in", "win-drop"], unfold: ["Unfold", "win-unfold"], none: ["None", "win-none"] };
/* Layout defaults every preset shares */
const LAYOUT = { bar: "floating", dock: "always", labels: "shown", intro: "on", dockWs: "current", scale: 85, clock: "12" };
/* Rahul's own rice, the default for every visitor (30 Oct 2026) */
const BASE = { scheme: "everforest", mode: "dark", wall: "aurora", anim: true, blur: 25, winOp: 59, barOp: 46, radius: 8, gap: 10, ring: "a2", ringW: 1, motion: "smooth", open: "unfold", ...LAYOUT };
const NOCTALIA = { scheme: "noctalia", mode: "system", wall: "volute", anim: false, blur: 14, winOp: 100, barOp: 78, radius: 18, gap: 16, ring: "a2", ringW: 2, motion: "smooth", open: "zoom", ...LAYOUT };
const PRESETS = {
  rahul: { name: "Rahul's rice", ...BASE },
  noctalia: { name: "Noctalia", ...NOCTALIA },
  frosted: { name: "Frosted glass", ...NOCTALIA, scheme: "catppuccin", wall: "aurora", anim: true, blur: 30, winOp: 55, barOp: 45, radius: 24, gap: 22, motion: "springy" },
  rose: { name: "Rosé dusk", ...NOCTALIA, scheme: "rosepine", wall: "dunes", blur: 16, winOp: 80, barOp: 70, radius: 16, ring: "a4", open: "slide" },
  gruvbox: { name: "Gruvbox brutal", ...NOCTALIA, scheme: "gruvbox", wall: "solid", blur: 0, winOp: 100, barOp: 100, radius: 2, gap: 8, ring: "a1", ringW: 3, motion: "snappy", open: "none", bar: "attached" },
  shop: { name: "Shop floor", ...NOCTALIA, scheme: "everforest", wall: "waterline", anim: true, blur: 10, winOp: 88, barOp: 80, radius: 10, gap: 14, ring: "a3", open: "unfold" },
  tokyo: { name: "Tokyo neon", ...NOCTALIA, scheme: "tokyo", wall: "bokeh", anim: true, blur: 22, winOp: 66, barOp: 60, radius: 18, gap: 20, ringW: 3, motion: "springy", open: "drop", dock: "autohide" },
};
let R = { ...BASE, preset: "rahul" };
let customImg = null, wallPal = null;
try { const saved = JSON.parse(localStorage.getItem("rice-a") || "null"); if (saved) R = { ...R, ...saved }; } catch (_) {}
function save() { try { localStorage.setItem("rice-a", JSON.stringify(R)); } catch (_) {} }

/* colour helpers */
const hex2rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const rgba = (h, a) => { const [r, g, b] = hex2rgb(h); return `rgba(${r},${g},${b},${a})`; };
function hsl2hex(h, s, l) {
  s /= 100; l /= 100;
  const f = (n) => { const k = (n + h / 30) % 12, a = s * Math.min(l, 1 - l); return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))).toString(16).padStart(2, "0"); };
  return "#" + f(0) + f(8) + f(4);
}
function rgb2hsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  if (!d) return [0, 0, l * 100];
  const s = d / (1 - Math.abs(2 * l - 1));
  const h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [(h * 60 + 360) % 360, s * 100, l * 100];
}
/* Noctalia's wallpaper colours, in miniature: bucket the image's hues and build both palettes from the strongest four. */
function paletteFromImage(img) {
  const c = document.createElement("canvas"); c.width = c.height = 48;
  const x = c.getContext("2d"); x.drawImage(img, 0, 0, 48, 48);
  const d = x.getImageData(0, 0, 48, 48).data, bins = Array.from({ length: 12 }, () => ({ w: 0, s: 0 }));
  for (let i = 0; i < d.length; i += 4) { const [h, s, l] = rgb2hsl(d[i], d[i + 1], d[i + 2]); const w = (s / 100) * (1 - Math.abs(l - 50) / 50) + .02; const b = bins[Math.floor(h / 30) % 12]; b.w += w; b.s += s * w; b.h = (b.h || 0) + h * w; }
  const top = bins.map((b, i) => ({ h: b.w ? b.h / b.w : i * 30, s: b.w ? b.s / b.w : 40, w: b.w })).sort((a, b) => b.w - a.w);
  while (top.length < 4) top.push({ h: (top[0].h + 90 * top.length) % 360, s: 50 });
  const [p, ...rest] = top, acc = [p, rest[0], rest[1], rest[2]];
  const S = (s) => Math.max(45, Math.min(90, s));
  return {
    dark: pal([hsl2hex(p.h, 30, 7), hsl2hex(p.h, 28, 11), hsl2hex(p.h, 25, 16), hsl2hex(p.h, 22, 24), hsl2hex(p.h, 20, 94), hsl2hex(p.h, 15, 66)]
      .concat(acc.map((a) => hsl2hex(a.h, S(a.s), 74)), acc.map((a) => hsl2hex(a.h, S(a.s), 74)), [hsl2hex(p.h, 30, 8), hsl2hex(acc[1].h, S(acc[1].s), 74)])),
    light: pal([hsl2hex(p.h, 30, 90), hsl2hex(p.h, 35, 98), hsl2hex(p.h, 30, 94), hsl2hex(p.h, 25, 84), hsl2hex(p.h, 30, 14), hsl2hex(p.h, 15, 38)]
      .concat(acc.map((a) => hsl2hex(a.h, S(a.s), 60)), acc.map((a) => hsl2hex(a.h, S(a.s), 32)), [hsl2hex(p.h, 30, 10), hsl2hex(acc[1].h, S(acc[1].s), 45)])),
  };
}

const de = document.documentElement;
const mode = () => de.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
function colours() {
  const sc = R.scheme === "wallpaper" && wallPal ? wallPal : SCHEMES[R.scheme === "wallpaper" ? "noctalia" : R.scheme] || SCHEMES.noctalia;
  return sc[mode()];
}
function apply() {
  if (R.mode === "system") delete de.dataset.theme; else de.dataset.theme = R.mode;
  const C = colours();
  K.forEach((k) => de.style.setProperty("--" + k, C[k]));
  de.style.setProperty("--ring", `var(--${R.ring})`);
  de.style.setProperty("--blur", R.blur + "px");
  /* light surfaces are near white, so the same opacity hides more of the wallpaper than it does in dark; light mode runs the glass a little clearer to match */
  const glass = mode() === "light" ? .86 : 1;
  de.style.setProperty("--win-op", Math.round(R.winOp * glass) + "%");
  de.style.setProperty("--bar-op", Math.round(R.barOp * glass) + "%");
  de.style.setProperty("--r", R.radius + "px");
  de.style.setProperty("--ring-w", R.ringW + "px");
  de.style.setProperty("--dur", MOTION[R.motion][1]);
  de.style.setProperty("--ease", MOTION[R.motion][2]);
  de.style.setProperty("--open-anim", OPENS[R.open][1]);
  de.style.colorScheme = mode();
  wm.root.classList.toggle("bar-attached", R.bar === "attached");
  wm.root.classList.toggle("dock-hide", R.dock === "autohide");
  wm.root.classList.toggle("dock-labels", R.labels === "shown");
  wm.root.classList.toggle("dock-current", R.dockWs === "current");
  de.style.setProperty("--zoom", R.scale / 100);
  de.dataset.clock = R.clock; if (window.tickClock) tickClock();
  wm.setGap(R.gap);
  drawWall();
  if (typeof player !== "undefined") player.redraw();
  save();
}

/* wallpapers, each drawn from the current palette */
function seeded(n) { let a = n; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const GEN = {
  volute(x, w, h, C) {
    x.fillStyle = C.bg; x.fillRect(0, 0, w, h);
    [[.12, .2, "a2"], [.88, .3, "a3"], [.7, .95, "a1"], [.2, .9, "a4"]].forEach(([px, py, k]) => { const g = x.createRadialGradient(px * w, py * h, 0, px * w, py * h, Math.max(w, h) * .45); g.addColorStop(0, rgba(C[k], .25)); g.addColorStop(1, rgba(C[k], 0)); x.fillStyle = g; x.fillRect(0, 0, w, h); });
    x.strokeStyle = rgba(C.a2, .22); x.lineWidth = Math.max(.6, w / 1200);
    x.beginPath();
    for (let t = 0; t < 26; t += .02) { const rr = w * .012 + t * Math.min(w, h) * .016, px = w * .78 + rr * Math.cos(t), py = h * .58 + rr * Math.sin(t); t ? x.lineTo(px, py) : x.moveTo(px, py); }
    x.stroke();
  },
  aurora(x, w, h, C, t) {
    const g0 = x.createLinearGradient(0, 0, 0, h); g0.addColorStop(0, C.bg); g0.addColorStop(1, C.surf); x.fillStyle = g0; x.fillRect(0, 0, w, h);
    ["a2", "a3", "a4", "a1"].forEach((k, i) => {
      const g = x.createLinearGradient(0, 0, w, 0); g.addColorStop(0, rgba(C[k], 0)); g.addColorStop(.5, rgba(C[k], C.light ? .62 : .42)); g.addColorStop(1, rgba(C[k], 0));
      x.fillStyle = g; x.beginPath();
      const base = h * (.25 + i * .14), amp = h * .08;
      for (let px = 0; px <= w; px += w / 60) x.lineTo(px, base + Math.sin(px / w * 5 + t * (.4 + i * .15) + i * 1.7) * amp);
      for (let px = w; px >= 0; px -= w / 60) x.lineTo(px, base + h * .12 + Math.sin(px / w * 4 + t * (.3 + i * .1) + i) * amp * 1.4);
      x.fill();
    });
    x.fillStyle = rgba(C.bg, C.light ? .08 : .25); x.fillRect(0, 0, w, h);
  },
  waterline(x, w, h, C, t) {
    x.fillStyle = C.bg; x.fillRect(0, 0, w, h);
    const centres = [[.28, .62, "a3"], [.78, .32, "a2"]];
    x.lineWidth = Math.max(.7, w / 1100);
    centres.forEach(([cx0, cy0, k], ci) => {
      for (let n = 1; n < 30; n++) {
        x.strokeStyle = rgba(C[k], .32 - n * .008); x.beginPath();
        for (let a = 0; a <= Math.PI * 2 + .01; a += .05) {
          const r = n * Math.min(w, h) * .024 * (1 + .18 * Math.sin(3 * a + n * .25 + t * .3 + ci) + .08 * Math.sin(5 * a - t * .2));
          const px = cx0 * w + r * Math.cos(a), py = cy0 * h + r * Math.sin(a);
          a ? x.lineTo(px, py) : x.moveTo(px, py);
        }
        x.stroke();
      }
    });
  },
  dunes(x, w, h, C, t) {
    const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, C.bg); g.addColorStop(.55, rgba(C.a4, .55)); g.addColorStop(1, C.a1); x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.fillStyle = rgba(C.a1, .9); x.beginPath(); x.arc(w * .68, h * .5, Math.min(w, h) * .12, 0, 7); x.fill();
    ["a4", "a2", "surf2", "surf", "bg"].forEach((k, i) => {
      x.fillStyle = i < 2 ? rgba(C[k], .75) : C[k]; x.beginPath(); x.moveTo(0, h);
      const base = h * (.52 + i * .1);
      for (let px = 0; px <= w; px += w / 80) x.lineTo(px, base + Math.sin(px / w * (2 + i) + i * 2 + t * .15 * (i + 1)) * h * .04 + Math.sin(px / w * 7 + i) * h * .012);
      x.lineTo(w, h); x.fill();
    });
  },
  bokeh(x, w, h, C, t) {
    const g = x.createRadialGradient(w * .5, h * .4, 0, w * .5, h * .5, Math.max(w, h) * .8); g.addColorStop(0, C.surf); g.addColorStop(1, C.bg); x.fillStyle = g; x.fillRect(0, 0, w, h);
    const rnd = seeded(7), ks = ["a1", "a2", "a3", "a4"];
    for (let i = 0; i < 46; i++) {
      const r = (rnd() * .07 + .015) * Math.max(w, h), px = (rnd() * w + t * 12 * (rnd() - .5) * 6 + w) % w, py = (rnd() * h + Math.sin(t * .4 + i) * 20 + h) % h;
      const c = C[ks[i % 4]], gg = x.createRadialGradient(px, py, 0, px, py, r);
      gg.addColorStop(0, rgba(c, .32 * rnd() + .08)); gg.addColorStop(.85, rgba(c, .12)); gg.addColorStop(1, rgba(c, 0));
      x.fillStyle = gg; x.beginPath(); x.arc(px, py, r, 0, 7); x.fill();
    }
  },
  solid(x, w, h, C) { const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, C.bg); g.addColorStop(1, C.surf2); x.fillStyle = g; x.fillRect(0, 0, w, h); },
  custom(x, w, h, C) {
    if (!customImg) { GEN.solid(x, w, h, C); x.fillStyle = C.mute; x.font = `600 ${Math.max(10, w / 18)}px Figtree, sans-serif`; x.textAlign = "center"; x.fillText("Upload", w / 2, h / 2 + w / 50); return; }
    const k = Math.max(w / customImg.width, h / customImg.height), iw = customImg.width * k, ih = customImg.height * k;
    x.drawImage(customImg, (w - iw) / 2, (h - ih) / 2, iw, ih);
  },
};
/* in light mode the pale accents vanish behind a near-white window, so wallpapers are drawn with the deeper ink accents and less of their wash; the glass then shows as much colour as it does in dark */
function wallColours() {
  const C = { ...colours() };
  if (mode() === "light") { C.light = true; ["a1", "a2", "a3", "a4"].forEach((k) => (C[k] = C[k + "-ink"])); }
  return C;
}
const cv = document.getElementById("wall"), cx = cv.getContext("2d");
let wallT = 0, wallRaf = 0, lastFrame = 0;
const moving = () => R.anim && R.motion !== "off" && R.wall !== "custom" && R.wall !== "solid" && !matchMedia("(prefers-reduced-motion: reduce)").matches;
function paintWall(time) {
  const live = moving(), r = live ? .5 : Math.min(devicePixelRatio || 1, 2), w = cv.clientWidth, h = cv.clientHeight;
  if (cv.width !== Math.round(w * r) || cv.height !== Math.round(h * r)) { cv.width = Math.round(w * r); cv.height = Math.round(h * r); }
  cx.setTransform(r, 0, 0, r, 0, 0);
  if (live) wallT += Math.min(50, time - (lastFrame || time)) / 1000;
  lastFrame = time;
  GEN[R.wall](cx, w, h, wallColours(), wallT);
}
function drawWall() {
  cancelAnimationFrame(wallRaf);
  if (!moving()) { lastFrame = 0; return paintWall(0); }
  const loop = (time) => { if (time - lastFrame > 32 || !lastFrame) paintWall(time); wallRaf = requestAnimationFrame(loop); };
  wallRaf = requestAnimationFrame(loop);
}
addEventListener("resize", () => paintWall(lastFrame));
document.addEventListener("visibilitychange", () => (document.hidden ? cancelAnimationFrame(wallRaf) : drawWall()));
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { apply(); refreshSettings(); });

/* the bar's light or dark button changes the mode too */
wm.onChange(() => { const m = de.dataset.theme || "system"; if (m !== R.mode) { R.mode = m; apply(); refreshSettings(); } });

function set(patch, quiet) {
  Object.assign(R, patch);
  if (!("preset" in patch)) R.preset = "";
  apply();
  if (!quiet) refreshSettings();
}
function usePreset(k) { const { name, ...p } = PRESETS[k]; set({ ...p, mode: R.mode, labels: R.labels, intro: R.intro, dockWs: R.dockWs, scale: R.scale, clock: R.clock, preset: k }); wm.toast("Preset: " + name, "Press P for the next one, or S to tweak it.", 2400); }
function nextPreset() { const ks = Object.keys(PRESETS); usePreset(ks[(ks.indexOf(R.preset) + 1) % ks.length]); }
function nextWall() { const ks = Object.keys(WALLS).filter((k) => k !== "custom" || customImg); set({ wall: ks[(ks.indexOf(R.wall) + 1) % ks.length] }); wm.toast("Wallpaper", WALLS[R.wall], 1600); }
function riceExtras() { return Object.entries(PRESETS).map(([k, p]) => ({ label: p.name, hint: "Theme preset", icon: ICON.sliders, run: () => usePreset(k) })).concat([{ label: "Appearance settings", hint: "Settings", icon: ICON.sliders, run: () => wm.open("settings") }]); }

/* the Appearance window */
let sBody = null;
function refreshSettings() { if (sBody && sBody.isConnected) renderSettings(sBody); }
const seg = (key, opts) => `<div class="seg" role="group">${Object.entries(opts).map(([k, v]) => `<button type="button" data-k="${key}" data-v="${k}" aria-pressed="${String(R[key]) === k}" class="${String(R[key]) === k ? "on" : ""}">${Array.isArray(v) ? v[0] : v}</button>`).join("")}</div>`;
const slider = (key, label, min, max, unit) => `<label class="sl"><span>${label}</span><input type="range" id="rice-${key}" data-k="${key}" min="${min}" max="${max}" value="${R[key]}"><output>${R[key]}${unit}</output></label>`;
const sw = (C) => `<span class="sw">${["bg", "a1", "a2", "a3", "a4"].map((k) => `<i style="background:${C[k]}"></i>`).join("")}</span>`;
function renderSettings(b) {
  sBody = b;
  const m = mode(), scrollTop = b.scrollTop;
  b.innerHTML = `<div class="rice">
    <p class="kicker">Appearance</p><h2>Make the desk yours</h2>
    <p class="rice-note">Everything here changes live and is remembered in this browser.</p>
    <h3>Presets</h3>
    <div class="presets">${Object.entries(PRESETS).map(([k, p]) => `<button type="button" class="pre${R.preset === k ? " on" : ""}" data-preset="${k}">${sw(SCHEMES[p.scheme][m])}<span>${p.name}</span></button>`).join("")}</div>
    <h3>Colour scheme</h3>
    <div class="schemes">${Object.entries(SCHEMES).map(([k, sc]) => `<button type="button" class="sch${R.scheme === k ? " on" : ""}" data-scheme="${k}">${k === "wallpaper" ? (wallPal ? sw(wallPal[m]) : `<span class="sw sw-empty">Needs an upload</span>`) : sw(sc[m])}<span>${sc.name}</span></button>`).join("")}</div>
    ${seg("mode", { system: "System", light: "Light", dark: "Dark" })}
    <h3>Wallpaper</h3>
    <div class="walls">${Object.entries(WALLS).map(([k, n]) => `<button type="button" class="wp${R.wall === k ? " on" : ""}" data-wall="${k}" aria-label="${n}"><canvas width="132" height="82"></canvas><span>${n}</span></button>`).join("")}</div>
    <div class="row"><label class="up" for="rice-file">Upload your own</label><input type="file" id="rice-file" accept="image/*" hidden>
      <label class="tg"><input type="checkbox" id="rice-anim" ${R.anim ? "checked" : ""}> Animate wallpaper</label></div>
    <h3>Glass</h3>
    ${slider("blur", "Blur", 0, 40, "px")}${slider("winOp", "Window opacity", 30, 100, "%")}${slider("barOp", "Bar and dock opacity", 20, 100, "%")}
    <h3>Shape</h3>
    ${slider("radius", "Corners", 0, 30, "px")}${slider("gap", "Gaps", 0, 40, "px")}${slider("ringW", "Focus ring", 0, 6, "px")}
    <div class="row rings"><span>Ring colour</span>${["a1", "a2", "a3", "a4"].map((k) => `<button type="button" class="ringc${R.ring === k ? " on" : ""}" data-ring="${k}" style="background:var(--${k})" aria-label="Ring colour ${k.slice(1)}"></button>`).join("")}</div>
    <h3>Motion</h3>
    <p class="lbl">Speed</p>${seg("motion", MOTION)}
    <p class="lbl">Opening windows</p>${seg("open", OPENS)}
    <h3>Layout</h3>
    <p class="lbl">Bar</p>${seg("bar", { floating: "Floating", attached: "Attached" })}
    <p class="lbl">Dock</p>${seg("dock", { always: "Always shown", autohide: "Auto-hide" })}
    <p class="lbl">Dock shows</p>${seg("dockWs", { current: "This workspace", all: "Every workspace" })}
    <p class="lbl">Interface scale</p>${seg("scale", { 75: "Small", 85: "Compact", 100: "Cosy" })}
    <p class="lbl">Dock labels</p>${seg("labels", { shown: "Shown", icons: "Icons only" })}
    <p class="lbl">Clock</p>${seg("clock", { 12: "12-hour, AM and PM", 24: "24-hour" })}
    <p class="lbl">Intro when the page loads</p>${seg("intro", { on: "Overview, then zoom in", off: "Off" })}
    <div class="row foot"><button type="button" class="btn" id="rice-reset">Reset to default</button><button type="button" class="btn ghost" id="rice-copy">Copy settings</button></div>
  </div>`;
  b.scrollTop = scrollTop;
  b.querySelectorAll(".wp canvas").forEach((c) => { const k = c.parentElement.dataset.wall, x = c.getContext("2d"); GEN[k](x, c.width, c.height, wallColours(), 1.5); });
  b.querySelectorAll("input[type=range]").forEach((r) => r.addEventListener("input", () => { r.nextElementSibling.textContent = r.value + r.nextElementSibling.textContent.replace(/[\d.]+/, ""); set({ [r.dataset.k]: +r.value }, true); }));
  b.querySelector("#rice-anim").addEventListener("change", (e) => set({ anim: e.target.checked }));
  b.querySelector("#rice-file").addEventListener("change", (e) => loadWall(e.target.files[0]));
  b.querySelector("#rice-reset").onclick = () => usePreset("rahul");
  b.querySelector("#rice-copy").onclick = async () => {
    const txt = JSON.stringify({ ...R, preset: undefined }, null, 2);
    try { await navigator.clipboard.writeText(txt); wm.toast("Copied", "Your settings are on the clipboard as JSON.", 2000); } catch (_) { wm.toast("Could not copy", "Your browser blocked the clipboard here.", 2500); }
  };
}
document.addEventListener("click", (e) => {
  const b = e.target.closest(".rice button");
  if (!b) return;
  if (b.dataset.preset) usePreset(b.dataset.preset);
  else if (b.dataset.scheme) { if (b.dataset.scheme === "wallpaper" && !wallPal) { wm.toast("Upload a wallpaper first", "Colours are taken from your own image.", 2400); return; } set({ scheme: b.dataset.scheme }); }
  else if (b.dataset.wall) { if (b.dataset.wall === "custom" && !customImg) { document.getElementById("rice-file").click(); return; } set({ wall: b.dataset.wall }); }
  else if (b.dataset.ring) set({ ring: b.dataset.ring });
  else if (b.dataset.k) set({ [b.dataset.k]: b.dataset.k === "scale" ? +b.dataset.v : b.dataset.v });
});
function loadWall(file) {
  if (!file) return;
  const url = URL.createObjectURL(file), img = new Image();
  img.onload = () => {
    const c = document.createElement("canvas"), k = Math.min(1, 1920 / Math.max(img.width, img.height));
    c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    URL.revokeObjectURL(url);
    setCustom(c);
    try { localStorage.setItem("rice-a-img", c.toDataURL("image/jpeg", .82)); } catch (_) {}
    set({ wall: "custom", scheme: "wallpaper" });
    wm.toast("Wallpaper set", "Colours now come from your image. Pick another scheme any time.", 3000);
  };
  img.onerror = () => wm.toast("That file did not open", "Try a JPEG or PNG image.", 2600);
  img.src = url;
}
function setCustom(src) { customImg = src; wallPal = paletteFromImage(src); }
try {
  const d = localStorage.getItem("rice-a-img");
  if (d) { const im = new Image(); im.onload = () => { setCustom(im); apply(); refreshSettings(); }; im.src = d; }
} catch (_) {}
if ((R.wall === "custom" && !customImg) || (R.scheme === "wallpaper" && !wallPal)) { /* image arrives async; fall back until then */ }
document.getElementById("b-rice").onclick = () => wm.open("settings");
apply();
