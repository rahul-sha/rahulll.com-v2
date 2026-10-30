/* ---------- Mockup A content, following the content plan: one story from idea to part ---------- */
const hueStyle = (h) => `--accent:var(--${h});--accent-ink:var(--${h}-ink, var(--${h}))`;
const projById = (id) => PROJECTS.find((p) => p.id === id);
const stageOrder = Object.keys(CATS);

/* About: three lines, a photo, and a "Currently" line */
function renderAbout2(b, api) {
  b.innerHTML = `<div class="about">
    <img class="about-me" src="${IMG.ME}" alt="Portrait of Rahul">
    <p class="kicker">${ME.role}, ${ME.place}</p>
    <h1 class="about-h">${ABOUT.headline}</h1>
    <p class="lede">${ME.line}</p>
    <p>${ME.voice}</p>
    <p class="now"><b>Currently</b> ${ME.role} at ${ABOUT.employer}.${ABOUT.open_to ? ` <span>${ABOUT.open_to}</span>` : ""}</p>
    <div class="stages">${stageOrder.map((k) => `<button type="button" data-stage="${k}" style="${hueStyle(CATS[k].hue)}"><i></i>${CATS[k].verb}</button>`).join("")}</div>
    <p class="about-links">${ME.links.map(([n, u]) => `<a href="${u}" target="_blank" rel="noopener">${n}</a>`).join("")}</p>
  </div>`;
  b.querySelector(".stages").addEventListener("click", (e) => { const t = e.target.closest("[data-stage]"); if (t) openProjects(api, t.dataset.stage); });
}
function openProjects(api, stage) { api.open("projects"); const w = api.find("projects"); if (!w) return; const body = api.S.ws[w[0]].cols[w[1]].el.querySelector(".wb"); body.querySelector(`.chip[data-c="${stage}"]`)?.click(); }

/* Skills: evidence, grouped by stage, each chip names the projects that prove it */
function renderSkills(b, api) {
  b.innerHTML = `<div class="skills"><p class="kicker">Skills</p><h2>What I use at each stage, and the work that proves it</h2>
    <div class="sk-grid">${stageOrder.map((k) => `<section class="sk" style="${hueStyle(CATS[k].hue)}"><h3><i></i>${CATS[k].verb}</h3>
      <ul class="sk-tools">${SKILLS[k].tools.map((t) => `<li>${t}</li>`).join("")}</ul>
      <p class="sk-p">Proof</p><ul class="sk-proof">${SKILLS[k].proof.map((id) => `<li><button type="button" data-p="${id}">${projById(id).title}</button></li>`).join("")}</ul></section>`).join("")}</div>
    <h3 class="sk-h">Beyond engineering</h3>
    <ul class="sk-beyond">${BEYOND.map(([n, d, app]) => `<li><button type="button" data-app="${app}"><b>${n}</b><span>${d}</span></button></li>`).join("")}</ul>
    <h3 class="sk-h">Ways of working</h3>
    ${SKILLS_NOTE}</div>`;
  b.addEventListener("click", (e) => {
    const p = e.target.closest("[data-p]"), a = e.target.closest("[data-app]");
    if (p) api.open(projSpec(projById(p.dataset.p)));
    if (a) api.open(a.dataset.app);
  });
}

/* Projects: work highlight and flagships first, then everything by stage */
function renderProjects2(b, api) {
  const chips = `<button type="button" class="chip on" data-c="all">Everything</button>` + stageOrder.map((k) => `<button type="button" class="chip" data-c="${k}" style="${hueStyle(CATS[k].hue)}">${CATS[k].label}</button>`).join("");
  const tile = (p, cls = "") => `<li class="${cls}"><button type="button" class="p-tile" data-id="${p.id}" style="${hueStyle(CATS[p.cat].hue)}"><img src="${p.img}" alt=""><span class="p-cat">${CATS[p.cat].label}</span><span class="p-t">${p.title}</span></button></li>`;
  b.innerHTML = `<div class="projects"><p class="kicker">Engineering</p><h2>Things I have designed, simulated, made, and tested</h2>
    <div class="chips">${chips}</div>
    <h3 class="p-h">Start here</h3>
    <ul class="p-grid p-lead"><li class="p-hl"><button type="button" class="p-tile" data-hl="1" style="${hueStyle("a1")}"><span class="p-hlimg"><span>Mockup to come</span></span><span class="p-cat">Work highlight</span><span class="p-t">${esc(HIGHLIGHT.title)}</span></button></li>${FLAGSHIPS.map((id) => tile(projById(id), "p-flag")).join("")}</ul>
    <h3 class="p-h">Everything, by stage</h3>
    <ul class="p-grid">${stageOrder.flatMap((k) => PROJECTS.filter((p) => p.cat === k)).map((p) => tile(p)).join("")}</ul>
    <p class="hint">Each project opens as its own window to the right. Scroll along to read them side by side.</p></div>`;
  b.querySelector(".chips").addEventListener("click", (e) => {
    const c = e.target.closest(".chip"); if (!c) return;
    b.querySelectorAll(".chip").forEach((x) => x.classList.toggle("on", x === c));
    b.querySelectorAll(".p-grid:not(.p-lead) .p-tile").forEach((t) => (t.parentElement.hidden = c.dataset.c !== "all" && projById(t.dataset.id).cat !== c.dataset.c));
  });
  b.addEventListener("click", (e) => {
    const t = e.target.closest(".p-tile"); if (!t) return;
    if (t.dataset.hl) api.open(highlightSpec); else api.open(projSpec(projById(t.dataset.id)));
  });
}
const highlightSpec = { key: "highlight", title: HIGHLIGHT.title, icon: ICON.work, accent: "a1", width: 1, render: (b) => {
  b.innerHTML = `<div class="project"><figure class="p-hlimg big"><span>Mockup to come</span></figure>
    <p class="kicker">Work highlight</p><h2>${esc(HIGHLIGHT.title)}</h2><p class="lede">${esc(HIGHLIGHT.line)}</p>
    <dl class="facts"><div><dt>Year</dt><dd>[year]</dd></div><div><dt>Role</dt><dd>[role]</dd></div><div><dt>Team</dt><dd>[size]</dd></div><div><dt>Tools</dt><dd>[tools]</dd></div></dl>
    <p>${HIGHLIGHT.note}</p></div>`;
} };

/* One anatomy for every project window */
/* a media slot: the file when the content folder has it, a labelled placeholder until then */
function mediaSlot(m) {
  if (m.file) return `<li class="pm-${m.kind} has-file">${m.kind === "video" ? `<video src="${m.file}" controls preload="metadata" playsinline></video>` : `<img src="${m.file}" alt="${esc(m.label)}" loading="lazy">`}<span class="pm-cap">${esc(m.label)}</span></li>`;
  return `<li class="pm-${m.kind}"><span class="pm-ic">${m.kind === "video" ? ICON.play : ICON.max}</span><span>${esc(m.label)}</span><small>[${m.kind === "video" ? "video" : "image"} to come]</small></li>`;
}
function renderProject2(b, api, p) {
  const c = CATS[p.cat], related = PROJECTS.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 2);
  const skills = SKILLS[p.cat].tools.slice(0, 3);
  b.innerHTML = `<div class="project" style="${hueStyle(c.hue)}"><figure><img src="${p.img}" alt="${esc(p.title)}"><figcaption>[Caption for this image]</figcaption></figure>
    <p class="kicker" style="color:var(--accent-ink)">${c.verb}${FLAGSHIPS.includes(p.id) ? " · Flagship" : ""}</p><h2>${p.title}</h2><p class="lede">${p.outcome || "[One-line outcome, such as: one 5-axis setup instead of three]"}</p>
    <dl class="facts"><div><dt>Year</dt><dd>${p.year || "[year]"}</dd></div><div><dt>Role</dt><dd>${p.role || "[role]"}</dd></div><div><dt>Team</dt><dd>${p.team || "[size]"}</dd></div><div><dt>Tools</dt><dd>${skills.join(", ")}</dd></div></dl>
    <h3>The problem</h3>${p.sum}
    <h3>What I did</h3>${p.steps ? `<ol class="steps">${p.steps.map((s) => `<li>${s}</li>`).join("")}</ol>` : `<ol class="steps"><li>[Step one]</li><li>[Step two]</li><li>[Step three]</li></ol>`}
    ${p.media && p.media.length ? `<h3>More views</h3><ul class="p-media">${p.media.map((m) => mediaSlot(m)).join("")}</ul>` : ""}
    <h3>Result</h3><p>${p.result || "[The result, with a number: time saved, tolerance held, or the difference found]"}</p>
    <h3>Related</h3><p class="rel"><span>Proves</span>${skills.map((s) => `<i>${s}</i>`).join("")}</p>
    ${related.length ? `<p class="rel"><span>See also</span>${related.map((r) => `<button type="button" data-p="${r.id}">${r.title}</button>`).join("")}</p>` : ""}</div>`;
  b.addEventListener("click", (e) => { const t = e.target.closest("[data-p]"); if (t) api.open(projSpec(projById(t.dataset.p))); });
}
projSpec = (p) => ({ key: "proj-" + p.id, title: p.title, icon: ICON.work, accent: CATS[p.cat].hue, width: 1, kind: "project", render: renderProject2, arg: p });

/* Resume: one outcome line per job, and a download button in place of skill bars */
function renderResume2(b) {
  const tl = (rows) => rows.map(([d, t, o, x]) => `<li><span class="r-d">${d}</span><strong>${t}</strong><span class="r-o">${o}</span><span class="r-x">${x}</span></li>`).join("");
  b.innerHTML = `<div class="resume">
    <p class="kicker">Resume</p><h2>Engineer, designer, maker.</h2>
    <p class="r-dl"><a class="btn" href="site/resume.pdf" download="Rahul-Sharma-resume.pdf">${ICON.resume} Download PDF</a><span>Built from resume.md</span></p>
    <h3>Experience</h3><ol class="r-tl">${tl(JOBS)}</ol>
    <h3>Education</h3><ol class="r-tl">${tl(STUDY)}</ol>
    <h3>Tools</h3><p class="r-tools2">${TOOLS.map(([n]) => `<i>${n}</i>`).join("")}</p>
    <p class="hint">Skills are shown as proof in the Skills window, one click to the left.</p>
  </div>`;
}

/* Off the clock */
function renderSmartHome(b, api) {
  b.innerHTML = `<div class="hass"><p class="kicker">Smart home</p><h2>The flat, automated</h2>
    <ul class="ha-grid">${HOME.map((h, i) => h.kind === "temp" ? `<li class="ha ha-temp"><span class="ha-n">${h.name}</span><span class="ha-v">${h.val}<small>${h.unit}</small></span></li>` : `<li class="ha ha-light"><button type="button" class="ha-btn${h.on ? " on" : ""}" data-i="${i}" aria-pressed="${h.on}"><span class="ha-n">${h.name}</span><span class="ha-s">${h.on ? "On" : "Off"}</span></button></li>`).join("")}</ul>
    ${HOME_NOTE ? `<p class="hint">${HOME_NOTE}</p>` : ""}</div>`;
  b.querySelector(".ha-grid").addEventListener("click", (e) => {
    const t = e.target.closest(".ha-btn"); if (!t) return;
    const on = !t.classList.contains("on");
    t.classList.toggle("on", on); t.setAttribute("aria-pressed", on); t.querySelector(".ha-s").textContent = on ? "On" : "Off";
    api.toast(HOME[+t.dataset.i].name, on ? "Switched on" : "Switched off", 2200);
  });
}
function renderHomelab(b) {
  b.innerHTML = `<div class="lab2"><p class="kicker">Homelab</p><h2>One small NAS does a lot</h2>
    <p class="lede">${LAB_NOTE}</p>
    <ul class="svc">${LAB.map(([n, d, h]) => `<li style="${hueStyle(h)}"><i></i><b>${n}</b><span>${d}</span></li>`).join("")}</ul>
    <h3>Hardware</h3><ul class="dev">${DEVICES.map(([n, d]) => `<li><b>${n}</b><span>${d}</span></li>`).join("")}</ul></div>`;
}
function renderPrints(b, api) {
  b.innerHTML = `<div class="prints"><p class="kicker">3D prints</p><h2>Printed at home on a Bambu Lab A1</h2>
    <ul class="pr-grid">${PRINTS.map((p) => `<li style="${hueStyle(p.hue)}"><button type="button" class="pr-card" data-print="${p.id}"><span class="pr-img">${p.img ? `<img src="${p.img}" alt="">` : "<span>[photo]</span>"}</span><b>${esc(p.title)}</b><span class="pr-m">${esc(p.printer)} · ${esc(p.material)}</span><span class="pr-w">${p.why}</span><span class="pr-more">Open ${ICON.fwd}</span></button>${p.url ? `<a href="${p.url}" target="_blank" rel="noopener">On MakerWorld ${ICON.ext}</a>` : p.private ? `<span class="pr-p">Private design</span>` : ""}</li>`).join("")}</ul>
    <p class="hint">Designed in Fusion 360, which runs on Linux through Bottles. The Steam Deck stand is the one shared publicly; the rest are designed for home and [photos in use to come].</p></div>`;
  b.addEventListener("click", (e) => { const t = e.target.closest("[data-print]"); if (t) api.open(printSpec(PRINTS.find((p) => p.id === t.dataset.print))); });
}
/* one print in detail: render, the story, design notes, print settings, and slots for photos in use */
function renderPrint(b, api, p) {
  const others = PRINTS.filter((x) => x.id !== p.id).slice(0, 3);
  b.innerHTML = `<div class="project print" style="${hueStyle(p.hue)}"><figure>${p.img ? `<img src="${p.img}" alt="${esc(p.title)}">` : `<span class="pr-img"><span>[render]</span></span>`}<figcaption>${p.img ? "Render from Fusion 360" : "[Render to come]"}</figcaption></figure>
    <p class="kicker" style="color:var(--accent-ink)">3D print${p.private ? " · Private design" : " · On MakerWorld"}</p><h2>${esc(p.title)}</h2><p class="lede">${p.why}</p>
    <dl class="facts"><div><dt>Printer</dt><dd>${esc(p.printer)}</dd></div><div><dt>Material</dt><dd>${esc(p.material)}</dd></div><div><dt>Layer</dt><dd>${esc(p.settings.layer)}</dd></div><div><dt>Infill</dt><dd>${esc(p.settings.infill)}</dd></div><div><dt>Supports</dt><dd>${esc(p.settings.supports)}</dd></div><div><dt>Print time</dt><dd>${esc(p.settings.time)}</dd></div></dl>
    <h3>Why it exists</h3>${p.story}
    <h3>Design notes</h3><ol class="steps">${p.notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ol>
    <h3>In use</h3><ul class="p-media">${(p.photos && p.photos.length ? p.photos.map((f, i) => ({ kind: "image", label: i ? "Photo " + (i + 1) : "In use", file: f })) : [{ kind: "image", label: "Photo in use" }, { kind: "image", label: "On the printer" }]).map((m) => mediaSlot(m)).join("")}</ul>
    ${p.url ? `<p class="r-dl"><a class="btn" href="${p.url}" target="_blank" rel="noopener">${ICON.ext} Open on MakerWorld</a><span>Download the model there</span></p>` : ""}
    <h3>Related</h3><p class="rel"><span>More prints</span>${others.map((o) => `<button type="button" data-print="${o.id}">${esc(o.title)}</button>`).join("")}</p></div>`;
  b.addEventListener("click", (e) => { const t = e.target.closest("[data-print]"); if (t) api.open(printSpec(PRINTS.find((x) => x.id === t.dataset.print))); });
}
const printSpec = (p) => ({ key: "print-" + p.id, title: p.title, icon: ICON.work, accent: p.hue, width: 1, kind: "print", dockLabel: p.short || p.title, render: renderPrint, arg: p });
function renderGaming(b) {
  b.innerHTML = `<div class="gaming"><p class="kicker">Gaming</p><h2>Off the clock, controller in hand</h2>
    <h3>Playing now</h3><ul class="gm">${GAMES.now.map((g) => `<li>${esc(g)}</li>`).join("")}</ul>
    <h3>All-time favourites</h3><ol class="gm gm-top">${GAMES.alltime.map((g) => `<li>${esc(g)}</li>`).join("")}</ol>
    <h3>The kit</h3><ul class="gm">${GAMES.kit.map((g) => `<li>${esc(g)}</li>`).join("")}</ul>
    ${GAMES_NOTE ? `<p class="hint">${GAMES_NOTE}</p>` : ""}</div>`;
}
