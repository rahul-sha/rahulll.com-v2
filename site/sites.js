/* ---------- Live sites: browser windows for Rahul's live projects ----------
   On rahulll.com each window loads the real site in an iframe. Anywhere else (such as this preview)
   it shows a stand-in drawn from the live page, because the preview cannot frame other sites. */
const CAN_FRAME = /(^|\.)rahulll\.com$/.test(location.hostname);
/* SITES comes from site/content.js, built from content/sites/*.md */
const siteSpec = (s) => ({ key: "site-" + s.id, kind: "site", title: s.title, icon: ICON.globe, accent: s.accent, width: 2, render: renderSite, arg: s });

const STANDIN = {
  aperture: () => `<div class="s-ap">
    <nav><b>The Aperture</b><span>${["Overview", "Reflections", "Landscapes", "Nature", "Abstract", "Portraits", "All photos", "Drift"].map((n, i) => `<i class="${i ? "" : "on"}">${n}</i>`).join("")}</span></nav>
    <header><p>Welcome to The Aperture</p><h1>Here lies my collection.</h1><p class="ap-sub">I photograph cities, and the quiet things in between.</p></header>
    <div class="ap-grid">${["Reflections", "Marina Bay, after rain", "Landscapes", "Nature", "Abstract", "Portraits"].map((n, i) => `<figure class="ap-${i}"><figcaption>${n}</figcaption></figure>`).join("")}</div>
    <blockquote>"You don't take a photograph, you make it."<cite>Ansel Adams</cite></blockquote>
    <footer>The end of the walk</footer></div>`,
  gridwalk: () => {
    const heat = Array.from({ length: 10 * 18 }, (_, i) => { const v = (Math.sin(i * 1.7) + Math.cos(i * .37) + 2) / 4; return `<i style="opacity:${(.15 + v * .85).toFixed(2)}"></i>`; }).join("");
    const bars = Array.from({ length: 18 }, (_, i) => `<i style="height:${20 + ((i * 37) % 70)}%"></i>`).join("");
    return `<div class="s-gw" data-pal="monokai">
    <nav><b>Grid Walk</b><span class="gw-pal">${[["monokai", "Monokai"], ["dracula", "Dracula"], ["ember", "Coffee &amp; Ember"]].map(([k, n], i) => `<button type="button" data-pal="${k}" class="${i ? "" : "on"}">${n}</button>`).join("")}</span></nav>
    <p class="gw-k">2026 season · Round 18 · United States GP</p>
    <h1>Latest race</h1>
    <div class="gw-tabs">${["Latest race", "Drivers results", "Positions", "Finish frequency", "Driver podiums"].map((n, i) => `<span class="${i ? "" : "on"}">${n}</span>`).join("")}</div>
    <div class="gw-pod">${["P2", "P1", "P3"].map((p) => `<div class="gw-${p}"><b>${p}</b><span>[Driver]</span><small>[Team]</small></div>`).join("")}</div>
    <div class="gw-row"><section><h2>Points evolution</h2><div class="gw-bars">${bars}</div></section><section><h2>Positions</h2><div class="gw-heat">${heat}</div></section></div>
    <p class="gw-src">Sample layout and numbers. The live site reads the Jolpica F1 API.</p></div>`;
  },
  aanchal: () => `<div class="s-aa">
    <nav><b>Aanchal Sharma</b><span><i>Work</i><i>Creators</i><i>About</i><i>Contact</i></span></nav>
    <header><p class="aa-k">Brand and content strategist, Pune and Singapore</p><h1>Where the work gets made.</h1>
      <p class="aa-btns"><span class="aa-b1">See the work</span><span class="aa-b2">Get in touch</span></p></header>
    <div class="aa-stats"><div><b>10M+</b><span>organic views</span></div><div><b>1,762</b><span>leads</span></div><div><b>5</b><span>years, three markets</span></div></div>
    <h2>Work that stops the scroll</h2>
    <div class="aa-grid">${["Regional creator campaign", "Student Creator Program", "Brand films", "A 24-hour YouTube Short", "Takami launch in South-East Asia", "Brand content partnership"].map((n, i) => `<div class="aa-c aa-c${i % 3}"><span>${n}</span></div>`).join("")}</div>
    <h2 class="aa-end">Let's make something people remember.</h2></div>`,
  chopshop: () => `<div class="s-cs">
    <nav><b>Chop Shop</b><span class="cs-badge">Private</span></nav>
    <div class="cs-body"><aside>${["Today", "Plan", "Pantry", "Recipes", "Ingredients", "Body"].map((n, i) => `<i class="${i ? "" : "on"}">${n}</i>`).join("")}</aside>
      <main><p class="cs-k">Today · sample day</p><h1>Good evening. 3 meals logged.</h1>
      <div class="cs-mac">${[["Protein", 72], ["Carbs", 54], ["Fat", 40], ["Fibre", 63]].map(([n, v]) => `<div><span style="height:${v}%"></span><b>${n}</b></div>`).join("")}</div>
      <div class="cs-cards">${["Overnight oats", "Chicken rice bowl", "Greek yoghurt"].map((n) => `<div><span></span><b>${n}</b><small>[kcal] · [protein]</small></div>`).join("")}</div>
      <p>Sample screen: the app sits behind a password, so this is a drawing of the Today page.</p></main></div></div>`,
};

const standin = (s) => (STANDIN[s.id] || (() => `<div class="s-generic" style="--accent:var(--${s.accent});--accent-ink:var(--${s.accent}-ink)"><b>${esc(s.title)}</b><span>${esc(s.host)}</span><p>${s.blurb}</p></div>`))();
function renderSite(b, api, s) {
  const url = s.private ? "" : "https://" + s.host + "/";
  /* the stand-in draws first; the live site loads only when the visitor asks, so four windows do not cost four page loads */
  const view = `<div class="standin" tabindex="0">${standin(s)}</div>${CAN_FRAME && !s.private ? `<button type="button" class="br-go">${ICON.globe} Load ${esc(s.host)} here</button>` : ""}`;
  b.innerHTML = `<div class="br">
    <div class="br-bar">
      <button type="button" class="br-ib" aria-label="Back" disabled>${ICON.back}</button><button type="button" class="br-ib" aria-label="Forward" disabled>${ICON.fwd}</button><button type="button" class="br-ib br-reload" aria-label="Reload">${ICON.reload}</button>
      <span class="br-url">${s.private ? ICON.lock + "<span>Private project</span>" : ICON.lock + `<span>${esc(s.host)}</span>`}</span>
      ${url ? `<a class="br-ib" href="${url}" target="_blank" rel="noopener" aria-label="Open ${esc(s.host)} in a new tab" title="Open in a new tab">${ICON.ext}</a>` : ""}
    </div>
    <div class="br-view">${view}<div class="br-load"></div></div>
    <p class="br-stack"><b>Built with</b> ${esc(s.stack)} <span>·</span> ${esc(s.stats)}</p>
    ${CAN_FRAME && !s.private ? `<p class="br-note">A drawing of the site. The button above loads <a href="${url}" target="_blank" rel="noopener">${esc(s.host)}</a> in this window.</p>` : `<p class="br-note">${s.private ? "A drawing of the Today page. The app itself is private." : `Stand-in preview. On rahulll.com this window loads <a href="${url}" target="_blank" rel="noopener">${esc(s.host)}</a> live.`}</p>`}
  </div>`;
  const go = b.querySelector(".br-go");
  if (go) go.onclick = () => { b.querySelector(".br-view").innerHTML = `<iframe src="${url}" title="${esc(s.title)}" referrerpolicy="no-referrer-when-downgrade" allow="fullscreen; clipboard-write"></iframe><div class="br-load go"></div>`; };
  b.querySelector(".br-reload").onclick = () => {
    const l = b.querySelector(".br-load"); l.classList.remove("go"); void l.offsetWidth; l.classList.add("go");
    const f = b.querySelector("iframe"); if (f) f.src = f.src;
  };
  b.querySelectorAll(".gw-pal button").forEach((x) => x.addEventListener("click", () => {
    b.querySelector(".s-gw").dataset.pal = x.dataset.pal;
    b.querySelectorAll(".gw-pal button").forEach((y) => y.classList.toggle("on", y === x));
  }));
}
function renderSitesIndex(b, api) {
  b.innerHTML = `<div class="sites"><p class="kicker">Shipped</p><h2>Things I built outside work</h2>
    <p class="lede">Each one was built with Claude, one pull request at a time, and opens here as a browser window. Press <kbd>Shift</kbd> <kbd>F</kbd> or the corner button to take it fullscreen.</p>
    <ul class="si-list">${SITES.map((s) => `<li><button type="button" class="si" data-id="${s.id}" style="--accent:var(--${s.accent});--accent-ink:var(--${s.accent}-ink)"><span class="si-prev"><span class="si-mini">${standin(s).replace(/<(\/?)button\b[^>]*>/g, "<$1span>")}</span></span><span class="si-t">${s.title}</span><span class="si-h">${s.private ? "Private" : s.host}</span><span class="si-b">${s.blurb}</span><span class="si-s">${s.stats}</span><span class="si-tag">${s.tag}</span></button></li>`).join("")}</ul></div>`;
  b.querySelector(".si-list").addEventListener("click", (e) => { const t = e.target.closest(".si"); if (t) api.open(siteSpec(SITES.find((s) => s.id === t.dataset.id))); });
}
function siteExtras(api) { return SITES.map((s) => ({ label: s.title, hint: s.private ? "Private project" : s.host, icon: ICON.globe, run: () => api.open(siteSpec(s)) })); }
