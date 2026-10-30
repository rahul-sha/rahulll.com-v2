/* The desktop itself: the apps, workspaces, and keyboard wiring. Loads after render.js and before rice.js. */
// Fill icon placeholders written as ${ICON.x} in the index.html markup.
document.querySelectorAll(".bar button, .ss-box button").forEach((b) => (b.innerHTML = b.innerHTML.replace(/\$\{ICON\.(\w+)\}/g, (_, k) => ICON[k])));

const apps = {
  about: { title: "About", icon: ICON.about, accent: "a1", width: 0, dockLabel: "About", render: renderAbout2 },
  skills: { title: "Skills", icon: ICON.lab, accent: "a3", width: 1, dockLabel: "Skills", render: renderSkills },
  resume: { title: "Resume", icon: ICON.resume, accent: "a2", width: 1, dockLabel: "Resume", render: renderResume2 },
  projects: { title: "Projects", icon: ICON.work, accent: "a1", width: 2, dockLabel: "Projects", render: renderProjects2 },
  sites: { title: "Shipped", icon: ICON.globe, accent: "a1", width: 0, dockLabel: "Shipped", render: renderSitesIndex },
  home: { title: "Smart home", icon: ICON.home, accent: "a3", width: 1, dockLabel: "Smart home", render: renderSmartHome },
  homelab: { title: "Homelab", icon: ICON.lab, accent: "a2", width: 0, dockLabel: "Homelab", render: renderHomelab },
  prints: { title: "3D prints", icon: ICON.work, accent: "a1", width: 1, dockLabel: "3D prints", render: renderPrints },
  gaming: { title: "Gaming", icon: ICON.play, accent: "a4", width: 0, dockLabel: "Gaming", render: renderGaming },
  contact: { title: "Contact", icon: ICON.mail, accent: "a1", width: 0, dockLabel: "Contact", render: renderContact },
  settings: { title: "Appearance", icon: ICON.sliders, accent: "a4", width: 0, hotkey: "S", dockLabel: "Style", render: (b) => renderSettings(b) },
  terminal: { title: "Terminal", icon: ICON.term, accent: "a2", width: 1, hotkey: "T", hidden: true,
    render: (b, api) => Term(b, api, baseCommands(), { ps: "rahul@niri ~ $", banner: ["Welcome to the shell. Type <b>help</b>, or try <b>neofetch</b>."] }) },
};
/* each live site is also a dock item in the Live group */
const SHORT = { aperture: "Aperture", gridwalk: "Grid Walk", aanchal: "aanchalll", chopshop: "Chop Shop" };
SITES.forEach((s) => (apps["site-" + s.id] = { ...siteSpec(s), hidden: true, dockLabel: SHORT[s.id] }));
const wm = Niri({
  apps, dock: [
    { name: "Hello", ws: 0, items: ["about", "skills", "resume"] },
    { name: "Engineering", ws: 1, items: ["projects"] },
    { name: "Shipped", ws: 2, items: ["sites"].concat(SITES.map((s) => "site-" + s.id)) },
    { name: "Off the clock", ws: 3, items: ["home", "homelab", "prints", "gaming"] },
    { name: "Anywhere", items: ["contact", "settings"] },
  ],
  workspaces: [
    { name: "Hello", open: ["about", "skills", "resume"] },
    { name: "Engineering", open: ["projects", highlightSpec, projSpec(PROJECTS.find((p) => p.id === "cad-machine"))] },
    { name: "Shipped", open: ["sites"].concat(SITES.map((s) => "site-" + s.id)) },
    { name: "Off the clock", open: ["home", "homelab", "prints", "gaming"] },
  ],
  launcherExtras: (api) => deskExtras().concat(siteExtras(api), projectExtras(api), riceExtras()),
  extraKeys: [["E", "Session menu"], ["S", "Appearance settings"], ["W", "Next wallpaper"], ["P", "Next preset"], ["G", "Show or hide the guide"], ["M", "Play or pause music"], ["Shift + M", "Next track"], ["N", "Control centre"]],
  keys: { KeyE: () => session(true), KeyS: () => wm.open("settings"), KeyW: () => nextWall(), KeyP: () => nextPreset(), KeyG: () => toggleGuide(), KeyM: (a, e) => (e.shiftKey ? player.next() : player.toggle()), KeyN: () => cc() },
  eggs: [
    { seq: KONAMI, run: spin },
    { seq: ["n", "i", "r", "i"], run: (api) => { api.root.classList.add("wiggle"); setTimeout(() => api.root.classList.remove("wiggle"), 1100); api.toast("niri", "Windows do not tile here. They scroll."); } },
  ],
  eggHint: "There are a few secrets: try typing <b>niri</b>, the Konami code, or tapping the clock a few times.",
});
wm.focusTo(0);
function liveRow(b, api) {
  const h = b.querySelector("h2");
  h.insertAdjacentHTML("afterend", `<div class="live-row"><span>Live now</span>${SITES.map((s) => `<button type="button" data-site="${s.id}" style="--accent:var(--${s.accent});--accent-ink:var(--${s.accent}-ink)">${ICON.globe}${s.title}</button>`).join("")}</div>`);
  b.querySelector(".live-row").addEventListener("click", (e) => { const t = e.target.closest("[data-site]"); if (t) api.open(siteSpec(SITES.find((s) => s.id === t.dataset.site))); });
}

/* bar */
const pills = document.getElementById("pills");
/* one icon per workspace, in order: a person, a gear, a rocket, a coffee */
const WS_ICON = [
  '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5"/>',
  '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="6.5"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/>',
  '<path d="M12 3c3 2 4.5 5 4.5 9l-2 4h-5l-2-4c0-4 1.5-7 4.5-9z"/><circle cx="12" cy="10" r="1.6"/><path d="M9.5 16l-2 3.5M14.5 16l2 3.5"/>',
  '<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M9 3.5c-.8 1 .8 2 0 3M12.5 3.5c-.8 1 .8 2 0 3"/>',
];
const wsIcon = (i) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${WS_ICON[i] || ""}</svg>`;
wm.onChange((api) => {
  pills.innerHTML = api.S.ws.map((w, i) => `<button type="button" class="pill${i === api.S.cur ? " on" : ""}${w.cols.length ? " has" : ""}" role="tab" aria-selected="${i === api.S.cur}" aria-label="Workspace ${i + 1}: ${w.name}" title="${w.name} (${i + 1})" data-i="${i}"><b>${WS_ICON[i] ? wsIcon(i) : i + 1}</b><span>${w.name}</span></button>`).join("");
});
pills.addEventListener("click", (e) => { const p = e.target.closest(".pill"); if (p) wm.gotoWs(+p.dataset.i); });
let pAcc = 0, pLast = 0;
pills.addEventListener("wheel", (e) => { e.preventDefault(); pAcc += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY; const now = Date.now(); if (Math.abs(pAcc) > 40 && now - pLast > 220) { wm.gotoWs(Math.min(wm.S.ws.length - 1, Math.max(0, wm.S.cur + (pAcc > 0 ? 1 : -1)))); pAcc = 0; pLast = now; } }, { passive: false });
document.getElementById("b-launch").onclick = () => wm.launcher(true);
const bOver = document.getElementById("b-over");
bOver.onclick = () => wm.overview();
wm.onChange(() => { bOver.classList.toggle("on", wm.S.overview); bOver.setAttribute("aria-label", wm.S.overview ? "Zoom in" : "Zoom out"); });
document.getElementById("b-keys").onclick = () => wm.hotkeys(true);

const clock = document.getElementById("clock");
const tick = () => { const d = new Date(); clock.innerHTML = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) + `<span>${d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" })}</span>`; };
tick(); setInterval(tick, 15000);
let taps = 0, tapT;
clock.onclick = () => { taps++; if (taps === 1) cc(); clearTimeout(tapT); tapT = setTimeout(() => (taps = 0), 1200); if (taps === 5) { taps = 0; wm.toast("Cycle time", "Five taps in under a second. You would make a fine CNC operator."); } };

/* session menu */
const ss = document.querySelector(".session");
function session(v) { ss.hidden = !v; if (v) ss.querySelector("button").focus(); }
ss.addEventListener("click", (e) => {
  const b = e.target.closest("button[data-s]");
  if (!b && e.target !== ss) return;
  session(false);
  if (b) wm.toast({ lock: "Locked", suspend: "Suspended", reboot: "Rebooting", off: "Shutting down" }[b.dataset.s], { lock: "Just kidding. The portfolio stays open.", suspend: "Coffee break over. Back to work.", reboot: "Re-zeroing the machine. Done.", off: "Not before you have seen the 5-axis part." }[b.dataset.s]);
});
ss.addEventListener("keydown", (e) => { if (e.key === "Escape") { session(false); e.stopPropagation(); } });
