/* Window contents shared by all three mockups. Each page styles these classes its own way. */
function projSpec(p) {
  return { key: "proj-" + p.id, title: p.title, icon: ICON.work, accent: CATS[p.cat].hue, width: 1, render: renderProject, arg: p };
}
function renderAbout(b) {
  b.innerHTML = `<div class="about">
    <img class="about-me" src="${IMG.ME}" alt="Portrait of Rahul">
    <p class="kicker">${ME.role}, ${ME.place}</p>
    <h1 class="about-h">Hi, I am Rahul.</h1>
    <p class="lede">${ME.line}</p>
    <p>${ME.voice}</p>
    <p class="about-links">${ME.links.map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener">${n}</a>`).join("")}</p>
  </div>`;
}
function renderResume(b) {
  const tl = (rows) => rows.map(([d, t, o, x]) => `<li><span class="r-d">${d}</span><strong>${t}</strong><span class="r-o">${o}</span><span class="r-x">${x}</span></li>`).join("");
  b.innerHTML = `<div class="resume">
    <p class="kicker">Resume</p><h2>Engineer, designer, maker.</h2>
    <h3>Experience</h3><ol class="r-tl">${tl(JOBS)}</ol>
    <h3>Education</h3><ol class="r-tl">${tl(STUDY)}</ol>
    <h3>Tools</h3><ul class="r-tools">${TOOLS.map(([n, v]) => `<li><span>${n}</span><span class="r-bar"><i style="width:${v}%"></i></span><span class="r-v">${v}</span></li>`).join("")}</ul>
  </div>`;
}
function renderProjects(b, api) {
  const chips = `<button type="button" class="chip on" data-c="all">Everything</button>` + Object.entries(CATS).map(([k, c]) => `<button type="button" class="chip" data-c="${k}" style="--accent:var(--${c.hue});--accent-ink:var(--${c.hue}-ink, var(--${c.hue}))">${c.label}</button>`).join("");
  b.innerHTML = `<div class="projects"><p class="kicker">Work</p><h2>Things I have made, simulated, and broken on purpose.</h2>
    <div class="chips">${chips}</div>
    <ul class="p-grid">${PROJECTS.map((p) => `<li><button type="button" class="p-tile" data-id="${p.id}" style="--accent:var(--${CATS[p.cat].hue});--accent-ink:var(--${CATS[p.cat].hue}-ink, var(--${CATS[p.cat].hue}))"><img src="${IMG[p.img]}" alt=""><span class="p-cat">${CATS[p.cat].label}</span><span class="p-t">${p.title}</span></button></li>`).join("")}</ul>
    <p class="hint">Each project opens as its own window to the right. Scroll along to read them side by side.</p></div>`;
  b.querySelector(".chips").addEventListener("click", (e) => {
    const c = e.target.closest(".chip"); if (!c) return;
    b.querySelectorAll(".chip").forEach((x) => x.classList.toggle("on", x === c));
    b.querySelectorAll(".p-tile").forEach((t) => (t.parentElement.hidden = c.dataset.c !== "all" && PROJECTS.find((p) => p.id === t.dataset.id).cat !== c.dataset.c));
  });
  b.querySelector(".p-grid").addEventListener("click", (e) => {
    const t = e.target.closest(".p-tile"); if (!t) return;
    api.open(projSpec(PROJECTS.find((p) => p.id === t.dataset.id)));
  });
}
function renderProject(b, api, p) {
  b.innerHTML = `<div class="project"><figure><img src="${IMG[p.img]}" alt="${esc(p.title)}"></figure>
    <p class="kicker" style="color:var(--${CATS[p.cat].hue}-ink, var(--${CATS[p.cat].hue}))">${CATS[p.cat].label}</p><h2>${p.title}</h2><p class="lede">${p.sum}</p>
    ${p.steps ? `<ol class="steps">${p.steps.map((s) => `<li>${s}</li>`).join("")}</ol>` : ""}
    <p class="hint">[The full project carries its videos and captions from projects.js.]</p></div>`;
}
function renderPhotos(b) {
  const tiles = ["Golden hour, [place]", "Shop floor, [date]", "[Street photo]", "[Night shot]", "[Macro]", "[Travel]"];
  b.innerHTML = `<div class="photos"><p class="kicker">Photos</p><h2>Through the viewfinder</h2>
    <ul class="ph-grid">${tiles.map((t, i) => `<li class="ph ph-${i % 6}"><span>${t}</span></li>`).join("")}</ul>
    <p class="hint">Placeholder frames. The real site pulls a shared album from Immich on the homelab.</p></div>`;
}
function renderHome(b, api) {
  b.innerHTML = `<div class="hass"><p class="kicker">Home Assistant</p><h2>The flat, automated</h2>
    <ul class="ha-grid">${HOME.map((h, i) => h.kind === "temp" ? `<li class="ha ha-temp"><span class="ha-n">${h.name}</span><span class="ha-v">${h.val}<small>${h.unit}</small></span></li>` : `<li class="ha ha-light"><button type="button" class="ha-btn${h.on ? " on" : ""}" data-i="${i}" aria-pressed="${h.on}"><span class="ha-n">${h.name}</span><span class="ha-s">${h.on ? "On" : "Off"}</span></button></li>`).join("")}</ul>
    <h3>Homelab</h3><ul class="lab">${LAB.map(([h, s, w]) => `<li><span>${s}</span><span class="dim">${w}</span><span class="dim">${h}</span></li>`).join("")}</ul>
    <p class="hint">Sample values. [Tell me which sensors and services you are happy to show.]</p></div>`;
  b.querySelector(".ha-grid").addEventListener("click", (e) => {
    const t = e.target.closest(".ha-btn"); if (!t) return;
    const on = !t.classList.contains("on");
    t.classList.toggle("on", on); t.setAttribute("aria-pressed", on); t.querySelector(".ha-s").textContent = on ? "On" : "Off";
    api.toast(HOME[+t.dataset.i].name, on ? "Switched on" : "Switched off", 2200);
  });
}
function renderContact(b, api) {
  b.innerHTML = `<div class="contact"><p class="kicker">Say hello</p><h2>Got a part that needs making?</h2>
    <p class="lede">The quickest way to reach me is email.</p>
    <p class="c-mail"><span id="c-addr">${ME.email}</span><button type="button" class="c-copy">Copy</button></p>
    <p class="about-links">${ME.links.map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener">${n}</a>`).join("")}</p></div>`;
  b.querySelector(".c-copy").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(ME.email); api.toast("Copied", "Email address is on your clipboard", 2000); }
    catch (_) { const r = document.createRange(); r.selectNodeContents(b.querySelector("#c-addr")); getSelection().removeAllRanges(); getSelection().addRange(r); }
  });
}

/* Terminal commands every mockup shares. */
function baseCommands(extra = {}) {
  const map = { resume: "resume", work: "projects", projects: "projects", about: "about", photos: "photos", home: "home", contact: "contact" };
  return Object.assign({
    whoami: () => `${ME.name}, ${ME.role.toLowerCase()} in ${ME.place}. Specialist-generalist, begrudgingly.`,
    ls: () => Object.keys(map).map((k) => `<span class="t-dir">${k}/</span>`).join("  ") + "  <span class=dim>.secrets</span>",
    cat: (a, p, api) => {
      if (!a[0]) return "cat: which one? Try <b>cat resume</b>";
      if (a[0].startsWith(".secret")) return "Try the Konami code on the desktop. Or type <b>spin</b>.";
      if (map[a[0].replace("/", "")]) { api.open(map[a[0].replace("/", "")]); return `opening ${esc(a[0])}`; }
      return `cat: ${esc(a[0])}: no such file`;
    },
    open: (a, p, api) => { const k = map[(a[0] || "").replace("/", "")]; if (!k) return "open what? " + Object.keys(map).join(", "); api.open(k); return `opening ${a[0]}`; },
    neofetch: () => `<pre class="fetch"><span class="f-logo">  /\\  /\\
 /  \\/  \\
/  /\\    \\
\\_/  \\___/</span>
<b>rahul</b>@<b>rahulll.com</b>
OS      Aerospace Engineering (NTU, TUM)
Host    Criswell Singapore
Kernel  5-axis, simultaneous
Shell   noctalia on niri
CAD     Fusion 360, SolidWorks
CAM     Fusion 360, 80% and climbing
Uptime  8+ years in hardware
Memory  [coffee level]</pre>`,
    sudo: (a) => (a.join(" ") === "make coffee" ? "Brewing. This mockup cannot reach the kettle yet, but Home Assistant could." : "rahul is not in the sudoers file. This incident will be reported to the shop-floor supervisor."),
    rm: () => "Nice try. Everything here is version controlled.",
    hire: (a, p, api) => { api.open("contact"); return "Excellent decision. Opening contact."; },
    g0: (a, p, api) => gcode(a, api),
    spin: (a, p, api) => { spin(api); return "Spindle up to 12 000 rpm."; },
    theme: (a, p, api) => { api.root.querySelector("[data-theme-toggle]")?.click(); return "Theme switched."; },
  }, extra);
}
function gcode(a, api) {
  const x = a.find((s) => /^x-?\d+/i.test(s));
  if (!x) return "G0 needs a target, for example <b>G0 X2</b> to rapid to column 2.";
  const n = parseInt(x.slice(1), 10);
  api.focusTo(Math.max(0, n - 1));
  return `Rapid move to column ${n}. Mind the clamps.`;
}
function spin(api) {
  api.root.classList.remove("spin");
  void api.root.offsetWidth;
  api.root.classList.add("spin");
  setTimeout(() => api.root.classList.remove("spin"), 1600);
  api.toast("Spindle on", "Swarf everywhere. Sweep up before you leave.");
}
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
function projectExtras(api) {
  return PROJECTS.map((p) => ({ label: p.title, hint: CATS[p.cat].label, icon: ICON.work, run: () => api.open(projSpec(p)) }))
    .concat([
      { label: "Overview", hint: "Command", icon: ICON.grid, run: () => api.overview(true) },
      { label: "Keyboard shortcuts", hint: "Command", icon: ICON.keys, run: () => api.hotkeys(true) },
      { label: "Switch light or dark", hint: "Command", icon: ICON.moon, run: () => api.root.querySelector("[data-theme-toggle]")?.click() },
    ]);
}
