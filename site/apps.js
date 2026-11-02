/* Window contents and terminal commands that main.js wires into the desk. */
/* the name the shell and the control centre go by: the first name, at the portfolio */
const SHELL_ID = ME.name.split(" ")[0].toLowerCase() + "@portfolio";
/* years since the first job in content/resume.md */
const yearsIn = () => { const ys = JOBS.map(([d]) => +((d.match(/\d{4}/) || [])[0])).filter(Boolean); return ys.length ? new Date().getFullYear() - Math.min(...ys) : 0; };
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
  /* every window in the dock can be opened by its id, plus "work" for Projects */
  const map = Object.fromEntries(Object.keys(apps).filter((k) => !apps[k].hidden).map((k) => [k, k]).concat([["work", "projects"]]));
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
<b>${SHELL_ID.split("@")[0]}</b>@<b>${SHELL_ID.split("@")[1]}</b>
OS      Aerospace Engineering (NTU, TUM)
Host    ${esc(ABOUT.employer || "[employer]")}
Kernel  5-axis, simultaneous
Shell   noctalia on niri
CAD     Fusion 360, SolidWorks
CAM     Fusion 360, 80% and climbing
Uptime  ${yearsIn()}+ years in hardware
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
