/* ---------- Desk extras for mockup A: guide, music player, control centre, night light, and the boot intro ---------- */
ICON.sun = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
ICON.bell = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5h4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
ICON.power = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v8M7 6.3a7 7 0 1 0 10 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
document.querySelectorAll("#media button, #b-cc").forEach((b) => (b.innerHTML = b.innerHTML.replace(/\$\{ICON\.(\w+)\}/g, (_, k) => ICON[k])));
const desk = wm.root;
const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
let D = { guide: true, night: false, dnd: false, vol: 70 };
try { D = { ...D, ...JSON.parse(localStorage.getItem("desk-a") || "{}") }; } catch (_) {}
const saveD = () => { try { localStorage.setItem("desk-a", JSON.stringify(D)); } catch (_) {} };

/* ---------- Guide: a sticky floating window that explains whatever has focus ---------- */
const HINTS = {
  about: ["About", "Who I am in three lines. The four coloured buttons jump to projects at that stage. Press <kbd>L</kbd> for Skills."],
  skills: ["Skills", "Every skill names the work that proves it. Click a project name to open it beside this window."],
  resume: ["Resume", "Jobs and study in one column. The PDF button downloads the same thing for printing."],
  projects: ["Projects", "Start with the four tiles under <b>Start here</b>. Each project opens as its own window, right next to this one."],
  highlight: ["Work highlight", "A current work project, shown as a mockup once the video is in. Press <kbd>Q</kbd> to close it."],
  sites: ["Shipped", "Four sites I built outside work. Each opens as a browser window. <kbd>Shift</kbd> <kbd>F</kbd> takes one fullscreen."],
  home: ["Smart home", "A sample Home Assistant panel. The switches work; the numbers are placeholders."],
  homelab: ["Homelab", "The services behind the sites, all on one NAS at home."],
  prints: ["3D prints", "Parts printed at home on a Bambu Lab A1. Click a card for the full story; the MakerWorld link opens the shared model."],
  gaming: ["Gaming", "What I play and what I play it on. Half the Linux notes exist because of this."],
  contact: ["Contact", "Copy my email with one click. I reply within a day or two."],
  settings: ["Appearance", "Change colours, wallpaper, blur, corners, and motion. Press <kbd>P</kbd> to try the presets one by one."],
  terminal: ["Terminal", "Type <b>help</b> for the list of commands. <b>neofetch</b> and <b>cat about</b> are good first tries."],
  site: ["Browser window", "A live project. <kbd>Shift</kbd> <kbd>F</kbd> goes fullscreen with a thin border, and <kbd>Esc</kbd> brings it back."],
  project: ["Project", "One project in detail: the problem, what I did, and the result. <kbd>Q</kbd> closes it, <kbd>H</kbd> goes back to the list."],
  print: ["Print", "One print in detail: why it exists, the design notes, and the print settings. <kbd>Q</kbd> closes it, <kbd>H</kbd> goes back to the list."],
};
const TIPS = [
  "<kbd>H</kbd> and <kbd>L</kbd> scroll between windows, like niri. The arrow keys work too.",
  "<kbd>J</kbd> and <kbd>K</kbd> move between workspaces. The dots in the top bar show where you are.",
  "<kbd>O</kbd> zooms out to show every workspace. Click one to jump in.",
  "<kbd>V</kbd> floats the focused window above the others. Drag it by its title bar, resize it from the corner.",
  "The pin on a floating window keeps it on every workspace, like this guide.",
  "<kbd>D</kbd> opens the launcher. Type a few letters of a project to find it.",
  "<kbd>M</kbd> plays some music made in your browser. <kbd>Shift</kbd> <kbd>M</kbd> skips a track.",
  "<kbd>N</kbd> or the clock opens the control centre: night light, Do not disturb, and a calendar.",
  "Short on time? Resume is in the Hello group of the dock, and the four <b>Start here</b> tiles in Projects are the best of the work.",
  "<kbd>?</kbd> lists every shortcut. There are a few secrets too.",
];
let tipI = 0, gBody = null;
function hintFor(c) {
  if (!c) return ["Empty workspace", "Nothing is open here. Pick something from the dock at the bottom, or press <kbd>D</kbd>."];
  return HINTS[c.spec.kind] && !HINTS[c.key] ? HINTS[c.spec.kind] : HINTS[c.key] || (c.key.startsWith("proj-") ? HINTS.project : [c.spec.title, "Press <kbd>Q</kbd> to close this window, or <kbd>R</kbd> to change its width."]);
}
function renderGuide(b) {
  gBody = b;
  b.innerHTML = `<div class="gd"><p class="kicker">You are looking at</p><b class="gd-t"></b><p class="gd-h"></p>
    <div class="gd-tip"><p class="gd-n"></p><p class="gd-x"></p><button type="button" class="gd-next">Next tip</button></div>
    <p class="gd-f"><kbd>G</kbd> hides the guide. The pin keeps it on every workspace.</p></div>`;
  b.querySelector(".gd-next").onclick = () => { tipI = (tipI + 1) % TIPS.length; syncGuide(); };
  syncGuide();
}
function syncGuide() {
  if (!gBody || !gBody.isConnected) return;
  const [t, h] = hintFor(wm.focused());
  gBody.querySelector(".gd-t").textContent = t;
  gBody.querySelector(".gd-h").innerHTML = h;
  gBody.querySelector(".gd-n").textContent = `Tip ${tipI + 1} of ${TIPS.length}`;
  gBody.querySelector(".gd-x").innerHTML = TIPS[tipI];
}
const guideSpec = { key: "guide", title: "Guide", icon: ICON.guide, accent: "a3", floating: true, float: { w: 300, h: 340, sticky: true }, render: renderGuide, onClose: () => { D.guide = false; saveD(); syncCC(); } };
const guideOpen = () => wm.floats().some((c) => c.key === "guide");
function toggleGuide(v) {
  const on = v ?? !guideOpen();
  if (on && !guideOpen()) { guideSpec.float = wm.S.phone ? { w: wm.S.W - 16, h: 150, x: "left", sticky: true } : { w: 300, h: 340, sticky: true }; wm.open(guideSpec); D.guide = true; saveD(); }
  else if (!on && guideOpen()) wm.closeFloat(wm.floats().find((c) => c.key === "guide"));
  syncCC();
}
wm.onChange(syncGuide);
setInterval(() => { if (guideOpen()) { tipI = (tipI + 1) % TIPS.length; syncGuide(); } }, 15000);

/* ---------- Music: four short tracks synthesised live with WebAudio, so nothing is downloaded ---------- */
const NOTE = (m) => 440 * 2 ** ((m - 69) / 12);
const SC = { minor: [0, 2, 3, 5, 7, 8, 10], dorian: [0, 2, 3, 5, 7, 9, 10], lydian: [0, 2, 4, 6, 7, 9, 11], major: [0, 2, 4, 5, 7, 9, 11] };
const TRACKS = [
  { t: "Spindle warm-up", bpm: 96, root: 57, sc: "minor", prog: [0, 5, 3, 4], wave: "triangle", kick: true, hat: true, ac: "a1" },
  { t: "Coolant drift", bpm: 74, root: 50, sc: "dorian", prog: [0, 3, 6, 4], wave: "sine", kick: false, hat: true, ac: "a3" },
  { t: "Five-axis lullaby", bpm: 66, root: 53, sc: "lydian", prog: [0, 1, 4, 5], wave: "sine", kick: false, hat: false, ac: "a2" },
  { t: "Marina Bay after rain", bpm: 86, root: 55, sc: "minor", prog: [0, 6, 5, 4], wave: "square", kick: true, hat: true, ac: "a4" },
];
const LEN = 96;
const player = (() => {
  let ctx, master, an, bus, noise, timer, step = 0, next = 0, start = 0, playing = false, ti = 0;
  const subs = [];
  const emit = () => subs.forEach((f) => f());
  function init() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = D.vol / 100 * .8;
    const comp = ctx.createDynamicsCompressor();
    an = ctx.createAnalyser(); an.fftSize = 256; an.smoothingTimeConstant = .78;
    master.connect(comp); comp.connect(an); an.connect(ctx.destination);
    noise = ctx.createBuffer(1, ctx.sampleRate * .2, ctx.sampleRate);
    const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  function newBus() {
    if (bus) { const old = bus; old.gain.setTargetAtTime(0, ctx.currentTime, .08); setTimeout(() => old.disconnect(), 600); }
    bus = ctx.createGain(); bus.connect(master);
    const dl = ctx.createDelay(); dl.delayTime.value = 60 / TRACKS[ti].bpm * .75;
    const fb = ctx.createGain(); fb.gain.value = .32;
    dl.connect(fb); fb.connect(dl); dl.connect(bus);
    bus.delay = dl;
  }
  function tone(f, t, dur, { type = "sine", g = .08, a = .01, cut = 3000, to = bus } = {}) {
    const o = ctx.createOscillator(), e = ctx.createGain(), lp = ctx.createBiquadFilter();
    o.type = type; o.frequency.value = f; lp.frequency.value = cut;
    e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(g, t + a); e.gain.exponentialRampToValueAtTime(.0005, t + dur);
    o.connect(lp); lp.connect(e); e.connect(to); o.start(t); o.stop(t + dur + .05);
    return e;
  }
  function tick() {
    const tr = TRACKS[ti], sp = 60 / tr.bpm / 4, s = SC[tr.sc];
    const deg = (n) => tr.root + s[((n % 7) + 7) % 7] + 12 * Math.floor(n / 7);
    while (next < ctx.currentTime + .15) {
      const bar = Math.floor(step / 16), st = step % 16, ch = tr.prog[bar % tr.prog.length], t = next;
      if (st === 0) [0, 2, 4].forEach((k) => tone(NOTE(deg(ch + k)), t, sp * 16, { type: "triangle", g: .035, a: .5, cut: 1400 }));
      if (st === 0 || st === 10) tone(NOTE(deg(ch) - 12), t, sp * 5, { g: .14, a: .02, cut: 600 });
      if (st % 2 === 0) { const pat = [0, 2, 4, 7, 4, 2, 7, 9]; const e = tone(NOTE(deg(ch + pat[(st / 2 + bar) % 8]) + 12), t, sp * 1.6, { type: tr.wave, g: tr.wave === "square" ? .018 : .045, cut: 2400 }); e.connect(bus.delay); }
      if (tr.kick && (st === 0 || st === 8)) {
        const o = ctx.createOscillator(), e = ctx.createGain();
        o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(42, t + .16);
        e.gain.setValueAtTime(.32, t); e.gain.exponentialRampToValueAtTime(.001, t + .3);
        o.connect(e); e.connect(bus); o.start(t); o.stop(t + .32);
      }
      if (tr.hat && st % 4 === 2) {
        const n = ctx.createBufferSource(), hp = ctx.createBiquadFilter(), e = ctx.createGain();
        n.buffer = noise; hp.type = "highpass"; hp.frequency.value = 7000;
        e.gain.setValueAtTime(.05, t); e.gain.exponentialRampToValueAtTime(.001, t + .06);
        n.connect(hp); hp.connect(e); e.connect(bus); n.start(t); n.stop(t + .08);
      }
      next += sp; step++;
    }
    if (ctx.currentTime - start >= LEN) load(ti + 1, true);
  }
  function load(i, keep) {
    ti = (i + TRACKS.length) % TRACKS.length;
    if (ctx) { newBus(); step = 0; next = ctx.currentTime + .05; start = ctx.currentTime; }
    if (!keep) emit(); else emit();
  }
  function play() {
    if (!ctx) { init(); load(ti); }
    ctx.resume(); playing = true;
    clearInterval(timer); timer = setInterval(tick, 25);
    emit(); loop();
  }
  function pause() { if (!ctx) return; ctx.suspend(); playing = false; clearInterval(timer); emit(); }
  /* visualiser: cava-style bars on every registered canvas */
  const cans = new Set();
  const buf = new Uint8Array(128);
  let raf = 0;
  function draw() {
    if (an && playing) an.getByteFrequencyData(buf); else buf.fill(0);
    const cs = getComputedStyle(document.documentElement);
    cans.forEach((c) => {
      if (!c.isConnected) return cans.delete(c);
      const x = c.getContext("2d"), n = +c.dataset.bars || 24, w = c.width, h = c.height, gap = Math.max(1, w / n * .28), bw = w / n - gap;
      x.clearRect(0, 0, w, h);
      x.fillStyle = cs.getPropertyValue("--" + (c.dataset.ac || TRACKS[ti].ac)).trim() || "#fff";
      for (let i = 0; i < n; i++) {
        const v = buf[Math.floor(2 + i * (70 / n))] / 255, bh = Math.max(h * .08, v * v * h);
        x.beginPath(); x.roundRect ? x.roundRect(i * (bw + gap), h - bh, bw, bh, Math.min(bw / 2, 3)) : x.rect(i * (bw + gap), h - bh, bw, bh); x.fill();
      }
    });
  }
  function loop() { cancelAnimationFrame(raf); const f = () => { draw(); if (playing) raf = requestAnimationFrame(f); }; f(); }
  return {
    get playing() { return playing; }, get i() { return ti; }, get track() { return TRACKS[ti]; },
    pos: () => (ctx && start ? Math.min(LEN, ctx.currentTime - start) : 0),
    toggle: () => (playing ? pause() : play()), play, pause,
    next: () => { load(ti + 1); if (!playing) play(); }, prev: () => { load(ti - 1); if (!playing) play(); },
    pick: (i) => { load(i); if (!playing) play(); },
    vol: (v) => { D.vol = v; saveD(); if (master) master.gain.setTargetAtTime(v / 100 * .8, ctx.currentTime, .05); },
    canvas: (c) => { cans.add(c); draw(); },
    on: (f) => subs.push(f),
  };
})();
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
function renderMusic(b) {
  b.innerHTML = `<div class="mu">
    <div class="mu-top"><span class="mu-disc"><i></i></span><div class="mu-meta"><p class="kicker">Now playing</p><b class="mu-t"></b><span class="mu-a">Made live in your browser</span></div></div>
    <canvas class="mu-viz" width="520" height="110" data-bars="28" aria-hidden="true"></canvas>
    <div class="mu-prog"><i></i></div><div class="mu-time"><span class="mu-p">0:00</span><span>${fmt(LEN)}</span></div>
    <div class="mu-ctl"><button type="button" class="mu-b" data-m="prev" aria-label="Previous track">${ICON.prev}</button><button type="button" class="mu-b mu-play" data-m="toggle" aria-label="Play or pause (M)"></button><button type="button" class="mu-b" data-m="next" aria-label="Next track (Shift M)">${ICON.next}</button>
      <label class="mu-vol"><span class="sr">Volume</span><input type="range" min="0" max="100" value="${D.vol}" aria-label="Volume"></label></div>
    <ol class="mu-list">${TRACKS.map((t, i) => `<li><button type="button" data-i="${i}" style="--accent:var(--${t.ac});--accent-ink:var(--${t.ac}-ink)"><span>${String(i + 1).padStart(2, "0")}</span>${t.t}</button></li>`).join("")}</ol>
  </div>`;
  b.querySelector(".mu-ctl").addEventListener("click", (e) => { const m = e.target.closest("[data-m]"); if (m) player[m.dataset.m](); });
  b.querySelector(".mu-list").addEventListener("click", (e) => { const t = e.target.closest("[data-i]"); if (t) player.pick(+t.dataset.i); });
  b.querySelector(".mu-vol input").addEventListener("input", (e) => player.vol(+e.target.value));
  player.canvas(b.querySelector(".mu-viz"));
  syncMusic(b.querySelector(".mu"));
}
const musicSpec = { key: "music", title: "Music", icon: ICON.music, accent: "a2", floating: true, float: { w: 320, h: 400, x: "left", sticky: true }, render: renderMusic };
const musicOpen = () => wm.floats().some((c) => c.key === "music");
function toggleMusic(v) {
  const on = v ?? !musicOpen();
  if (on) wm.open(musicSpec); else if (musicOpen()) wm.closeFloat(wm.floats().find((c) => c.key === "music"));
  syncCC();
}
function syncMusic(extra) {
  const tr = player.track, p = player.playing;
  [...document.querySelectorAll(".mu, .media, .cc-media")].concat(extra ? [extra] : []).forEach((m) => {
    m.style.setProperty("--accent", `var(--${tr.ac})`); m.style.setProperty("--accent-ink", `var(--${tr.ac}-ink)`);
    m.classList.toggle("is-playing", p);
    m.querySelectorAll(".mu-t, .m-t, .ccm-t").forEach((t) => (t.textContent = m.classList.contains("media") && !p ? "Music" : tr.t));
    m.querySelectorAll(".mu-play, .m-pp, .ccm-pp").forEach((b) => { b.innerHTML = p ? ICON.pause : ICON.play; b.setAttribute("aria-label", (p ? "Pause" : "Play") + " music (M)"); });
    m.querySelectorAll(".mu-list button").forEach((b) => b.classList.toggle("on", +b.dataset.i === player.i));
  });
}
player.on(syncMusic);
setInterval(() => {
  const s = player.pos();
  document.querySelectorAll(".mu-prog i, .ccm-prog i").forEach((i) => (i.style.width = (s / LEN) * 100 + "%"));
  document.querySelectorAll(".mu-p").forEach((p) => (p.textContent = fmt(s)));
}, 500);
player.canvas(document.querySelector("#media canvas"));
document.querySelector("#media canvas").dataset.bars = 6;
document.getElementById("m-pp").onclick = () => player.toggle();
document.getElementById("m-open").onclick = () => toggleMusic(true);
syncMusic();

/* ---------- Night light and Do not disturb ---------- */
function setNight(v) { D.night = v; saveD(); desk.classList.toggle("night-on", v); syncCC(); }
function setDnd(v) { D.dnd = v; saveD(); desk.classList.toggle("dnd", v); syncCC(); wm.toast(v ? "Do not disturb is on" : "Do not disturb is off", v ? "Pop-up notes stay quiet until you turn this off." : "Pop-up notes are back.", 2200, true); }
desk.classList.toggle("night-on", D.night);
desk.classList.toggle("dnd", D.dnd);

/* ---------- Control centre: quick toggles, media, calendar, and a sensor, in the spirit of Noctalia and DankMaterialShell ---------- */
const CC = document.getElementById("cc"), ccBtn = document.getElementById("b-cc"), t0 = Date.now();
const ccOpen = () => !CC.hidden;
function calendar() {
  const d = new Date(), y = d.getFullYear(), m = d.getMonth(), first = (new Date(y, m, 1).getDay() + 6) % 7, days = new Date(y, m + 1, 0).getDate();
  const cells = Array.from({ length: first }, () => "<i></i>").concat(Array.from({ length: days }, (_, i) => `<i class="${i + 1 === d.getDate() ? "today" : ""}">${i + 1}</i>`));
  return `<div class="cal"><p><b>${d.toLocaleDateString("en-GB", { month: "long" })}</b> ${y}</p><div class="cal-g">${["M", "T", "W", "T", "F", "S", "S"].map((w) => `<i class="w">${w}</i>`).join("")}${cells.join("")}</div></div>`;
}
const TOG = [
  ["night", ICON.sun, "Night light", "Warmer colours", () => D.night, () => setNight(!D.night)],
  ["dnd", ICON.bell, "Do not disturb", "Quiet pop-ups", () => D.dnd, () => setDnd(!D.dnd)],
  ["guide", ICON.guide, "Guide", "Floating hints", () => guideOpen(), () => toggleGuide()],
  ["music", ICON.music, "Music", "Player window", () => musicOpen(), () => toggleMusic()],
  ["dark", ICON.moon, "Dark mode", "Light or dark", () => getComputedStyle(document.documentElement).colorScheme.includes("dark"), () => desk.querySelector("[data-theme-toggle]").click()],
  ["intro", ICON.grid, "Intro", "Replay it now", () => false, () => { cc(false); boot(true); }],
];
function renderCC() {
  const up = Math.max(1, Math.round((Date.now() - t0) / 60000));
  CC.innerHTML = `<div class="cc-head"><img src="${IMG.ME || ""}" alt=""><div><b>rahul@niri</b><span>Up ${up} min · four workspaces</span></div>
      <button type="button" class="ib" data-cc="rice" aria-label="Appearance" title="Appearance">${ICON.sliders}</button><button type="button" class="ib" data-cc="power" aria-label="Session menu" title="Session menu (E)">${ICON.power}</button></div>
    <div class="cc-tg">${TOG.map(([k, ic, n, s, on]) => `<button type="button" data-t="${k}" class="${on() ? "on" : ""}" aria-pressed="${on()}">${ic}<b>${n}</b><span>${s}</span></button>`).join("")}</div>
    <div class="cc-media"><canvas width="96" height="40" data-bars="10" aria-hidden="true"></canvas><div class="ccm-m"><b class="ccm-t"></b><span>Made live in your browser</span><div class="ccm-prog"><i></i></div></div>
      <button type="button" class="ib ccm-pp" data-cc="pp"></button><button type="button" class="ib" data-cc="next" aria-label="Next track">${ICON.next}</button></div>
    <div class="cc-row">${calendar()}<div class="cc-sen"><span>Workshop</span><b>27.4°C</b><svg viewBox="0 0 100 34" aria-hidden="true"><path d="M0 26 C12 20 18 24 28 18 S46 8 56 14 74 22 84 12 96 8 100 10" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg><small>Sample reading</small></div></div>`;
  player.canvas(CC.querySelector("canvas"));
  syncMusic();
}
function syncCC() { if (ccOpen()) CC.querySelectorAll(".cc-tg button").forEach((b) => { const on = TOG.find((t) => t[0] === b.dataset.t)[4](); b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); }); }
function cc(v) {
  const on = v ?? CC.hidden;
  CC.hidden = !on; ccBtn.setAttribute("aria-expanded", on); ccBtn.classList.toggle("on", on);
  if (on) { renderCC(); CC.querySelector("button").focus({ preventScroll: true }); }
}
CC.addEventListener("click", (e) => {
  const t = e.target.closest("[data-t]"), c = e.target.closest("[data-cc]");
  if (t) { TOG.find((x) => x[0] === t.dataset.t)[5](); setTimeout(syncCC, 30); }
  if (c) ({ rice: () => { cc(false); wm.open("settings"); }, power: () => { cc(false); session(true); }, pp: () => player.toggle(), next: () => player.next() })[c.dataset.cc]();
});
ccBtn.onclick = () => cc();
document.addEventListener("pointerdown", (e) => { if (ccOpen() && !CC.contains(e.target) && !e.target.closest("#b-cc, #clock")) cc(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && ccOpen()) { cc(false); e.stopImmediatePropagation(); ccBtn.focus(); } }, true);
wm.onChange(() => ccOpen() && syncCC());

/* ---------- Boot: start zoomed out in the overview, then fly into the first workspace ---------- */
let booting = false;
function boot(force) {
  if (!force && (R.intro === "off" || reduceMotion())) return finishBoot(true);
  booting = true;
  desk.querySelectorAll(".wsstack .win").forEach((w, i) => w.style.setProperty("--i", i));
  desk.classList.add("booting");
  wm.S.cur = 0; wm.S.ws[0].focus = 0;
  wm.overview(true);
  desk.classList.remove("preboot");
  clearTimeout(boot.t1); clearTimeout(boot.t2);
  boot.t1 = setTimeout(() => {
    desk.classList.add("boot-zoom");
    wm.overview(false);
    boot.t2 = setTimeout(() => finishBoot(), 1300);
  }, 1900);
}
function finishBoot(silent) {
  clearTimeout(boot.t1); clearTimeout(boot.t2);
  if (wm.S.overview && booting) wm.overview(false);
  booting = false;
  desk.classList.remove("preboot", "booting", "boot-zoom");
  if (D.guide && !guideOpen()) setTimeout(() => toggleGuide(true), silent ? 0 : 150);
}
["keydown", "pointerdown", "wheel"].forEach((ev) => addEventListener(ev, () => { if (booting && desk.classList.contains("booting")) finishBoot(); }, { capture: true, passive: true }));

function deskExtras() {
  return [
    { label: "Guide", hint: "Floating hints (G)", icon: ICON.guide, run: () => toggleGuide() },
    { label: "Music player", hint: "Floating (M plays)", icon: ICON.music, run: () => toggleMusic(true) },
    { label: "Control centre", hint: "Toggles and calendar (N)", icon: ICON.panel, run: () => cc(true) },
    { label: "Night light", hint: "Toggle", icon: ICON.sun, run: () => setNight(!D.night) },
    { label: "Do not disturb", hint: "Toggle", icon: ICON.bell, run: () => setDnd(!D.dnd) },
    { label: "Replay intro", hint: "Overview, then zoom in", icon: ICON.grid, run: () => boot(true) },
  ];
}
boot();

/* keep the current workspace's dock group in view when the dock scrolls on narrow screens */
wm.onChange(() => {
  const d = document.querySelector(".dock"), g = d && d.querySelector(".dk-g.current");
  if (g && d.scrollWidth > d.clientWidth) d.scrollTo({ left: g.offsetLeft - (d.clientWidth - g.offsetWidth) / 2 });
});

/* ---------- right-click menu: one menu for the desktop, the windows, the dock, and the workspace pills ---------- */
const CM = document.createElement("div");
CM.className = "cmenu"; CM.hidden = true; CM.setAttribute("role", "menu");
desk.appendChild(CM);
const mi = (label, run, o = {}) => ({ label, run, ...o });
const SEP = { sep: true };
function menuFor(t) {
  const S = wm.S;
  const win = t.closest(".win"), c = wm.colOf(t);
  if (c && c.float) return [
    mi(c.spec.title, null, { head: true }),
    mi("Tile it again", () => wm.toggleFloat(c), { icon: ICON.float, kbd: "V" }),
    mi(c.float.sticky ? "Unpin from workspaces" : "Pin to every workspace", () => wm.togglePin(c), { icon: ICON.pin }),
    SEP,
    mi("Close", () => wm.closeFloat(c), { icon: ICON.close, kbd: "Q", danger: true }),
  ];
  if (c) {
    const others = S.ws.map((w, i) => [w, i]).filter(([w]) => !w.cols.includes(c));
    return [
      mi(c.spec.title, null, { head: true }),
      mi(`Width ${wm.widthLabel(c)}, cycle`, () => { wm.select(c); wm.cycleWidth(); }, { icon: ICON.max, kbd: "R" }),
      mi(c.full ? "Restore width" : "Maximise column", () => { wm.select(c); wm.maximise(); }, { icon: ICON.max, kbd: "F" }),
      mi("Fullscreen", () => { wm.select(c); wm.fullscreen(true); }, { icon: ICON.full, kbd: "⇧F" }),
      mi("Float", () => { wm.select(c); wm.toggleFloat(c); }, { icon: ICON.float, kbd: "V" }),
      mi("Centre", () => { wm.select(c); wm.centre(); }, { kbd: "C" }),
      SEP,
      mi("Move left", () => { wm.select(c); wm.moveCol(-1); }, { icon: ICON.back, kbd: "⇧H" }),
      mi("Move right", () => { wm.select(c); wm.moveCol(1); }, { icon: ICON.fwd, kbd: "⇧L" }),
      ...others.map(([w, i]) => mi(`Move to ${w.name}`, () => { wm.select(c); wm.moveToWs(i - S.cur); }, { icon: ICON.grid })),
      SEP,
      mi("Close", () => { wm.select(c); wm.close(); }, { icon: ICON.close, kbd: "Q", danger: true }),
    ];
  }
  const dk = t.closest(".dk");
  if (dk) {
    const id = dk.dataset.app, a = apps[id], open = dk.classList.contains("running");
    return [
      mi(a.dockLabel || a.title, null, { head: true }),
      mi(open ? "Show window" : "Open", () => wm.open(id, dk.dataset.ws != null ? { ws: +dk.dataset.ws } : {}), { icon: a.icon }),
      open ? mi("Close", () => { wm.open(id); wm.close(); }, { icon: ICON.close, danger: true }) : null,
      SEP,
      mi(R.labels === "shown" ? "Hide dock labels" : "Show dock labels", () => set({ labels: R.labels === "shown" ? "hidden" : "shown" })),
      mi(R.dock === "always" ? "Auto-hide the dock" : "Always show the dock", () => set({ dock: R.dock === "always" ? "auto" : "always" })),
    ].filter(Boolean);
  }
  const pill = t.closest(".pill, .ws-label, .dk-gl");
  if (pill) {
    const i = pill.dataset.i != null ? +pill.dataset.i : pill.dataset.goto != null ? +pill.dataset.goto : S.ws.findIndex((w) => w.el.contains(pill));
    if (i >= 0) return [mi(S.ws[i].name, null, { head: true }), mi(`Go to ${S.ws[i].name}`, () => { wm.gotoWs(i); if (S.overview) wm.overview(false); }, { icon: ICON.grid, kbd: String(i + 1) })];
  }
  const dark = document.documentElement.dataset.theme ? document.documentElement.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  return [
    mi("Launcher", () => wm.launcher(true), { icon: ICON.search, kbd: "D" }),
    mi(S.overview ? "Leave overview" : "Overview", () => wm.overview(), { icon: ICON.grid, kbd: "O" }),
    SEP,
    mi("Next wallpaper", () => nextWall(), { icon: ICON.globe, kbd: "W" }),
    mi("Next theme preset", () => nextPreset(), { icon: ICON.sliders, kbd: "P" }),
    mi("Appearance", () => wm.open("settings"), { icon: ICON.sliders, kbd: "S" }),
    mi(dark ? "Light mode" : "Dark mode", () => desk.querySelector("[data-theme-toggle]").click(), { icon: ICON.moon }),
    SEP,
    mi("Control centre", () => cc(true), { icon: ICON.panel, kbd: "N" }),
    mi("Keyboard shortcuts", () => wm.hotkeys(true), { icon: ICON.keys, kbd: "?" }),
    mi(D.guide ? "Hide the guide" : "Show the guide", () => toggleGuide(), { icon: ICON.guide, kbd: "G" }),
    SEP,
    mi("Session", () => session(true), { icon: ICON.lock, kbd: "E" }),
  ];
}
function showMenu(items, cx, cy) {
  CM.innerHTML = items.map((it) => it.sep ? `<hr>` : it.head ? `<div class="cm-h">${esc(it.label)}</div>`
    : `<button type="button" role="menuitem"${it.danger ? ' class="danger"' : ""}><span class="cm-ic">${it.icon || ""}</span><span>${esc(it.label)}</span>${it.kbd ? `<kbd>${it.kbd}</kbd>` : ""}</button>`).join("");
  const acts = items.filter((it) => !it.sep && !it.head);
  CM.querySelectorAll("button").forEach((b, i) => (b.onclick = () => { hideMenu(); acts[i].run && acts[i].run(); }));
  CM.hidden = false;
  const z = parseFloat(getComputedStyle(desk).zoom) || 1, r = desk.getBoundingClientRect();
  let x = (cx - r.left) / z, y = (cy - r.top) / z;
  const W = desk.clientWidth, H = desk.clientHeight;
  if (x + CM.offsetWidth + 8 > W) x = Math.max(8, W - CM.offsetWidth - 8);
  if (y + CM.offsetHeight + 8 > H) y = Math.max(8, H - CM.offsetHeight - 8);
  CM.style.left = x + "px"; CM.style.top = y + "px";
  CM.querySelector("button")?.focus({ preventScroll: true });
}
function hideMenu() { if (!CM.hidden) { CM.hidden = true; CM.innerHTML = ""; } }
desk.addEventListener("contextmenu", (e) => {
  if (e.target.closest("input, textarea, select, [contenteditable], a[href], iframe, .cmenu, .launcher, .hotkeys, .session, .kiosk-layer")) return;
  const items = menuFor(e.target);
  if (!items || !items.length) return;
  e.preventDefault();
  showMenu(items, e.clientX, e.clientY);
});
addEventListener("pointerdown", (e) => { if (!CM.contains(e.target)) hideMenu(); }, true);
addEventListener("wheel", hideMenu, { capture: true, passive: true });
addEventListener("resize", hideMenu);
CM.addEventListener("keydown", (e) => {
  const bs = [...CM.querySelectorAll("button")], i = bs.indexOf(document.activeElement);
  if (e.key === "Escape") { hideMenu(); e.stopPropagation(); }
  else if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); e.stopPropagation(); bs[(i + (e.key === "ArrowDown" ? 1 : -1) + bs.length) % bs.length]?.focus(); }
  else if (e.key === "Tab") hideMenu();
  else e.stopPropagation();
});
