/* ---------- Live sites: browser windows for Rahul's live projects ----------
   Each window shows a screenshot (or a short clip) of the site, and loads the real site in an iframe
   when the visitor clicks it. A site that refuses to be framed (embed: false in its Markdown) opens in a new tab.
   A site without a screenshot falls back to a stand-in drawn from the live page. */
const canFrame = (s) => !s.private && s.embed;
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
      <div class="main"><p class="cs-k">Today · sample day</p><h1>Good evening. 3 meals logged.</h1>
      <div class="cs-mac">${[["Protein", 72], ["Carbs", 54], ["Fat", 40], ["Fibre", 63]].map(([n, v]) => `<div><span style="height:${v}%"></span><b>${n}</b></div>`).join("")}</div>
      <div class="cs-cards">${["Overnight oats", "Chicken rice bowl", "Greek yoghurt"].map((n) => `<div><span></span><b>${n}</b><small>[kcal] · [protein]</small></div>`).join("")}</div>
      <p>Sample screen: the app sits behind a password, so this is a drawing of the Today page.</p></div></div></div>`,
};

/* the stand-ins are drawings of other sites, so their nav, header, and aside are not landmarks of this page */
const standin = (s) => (STANDIN[s.id] || (() => `<div class="s-generic" style="--accent:var(--${s.accent});--accent-ink:var(--${s.accent}-ink)"><b>${esc(s.title)}</b><span>${esc(s.host)}</span><p>${s.blurb}</p></div>`))().replace(/<(nav|header|footer|aside)\b/g, '<$1 role="none"');
function note(s, url) {
  const thing = s.private ? "app" : "site", what = s.shot ? (s.video ? `A short clip of the ${thing}.` : `A screenshot of the ${thing}.`) : `A drawing of the ${thing}.`;
  if (s.private) return `${what.slice(0, -1)}, which is private, so there is no live version to open.`;
  if (!canFrame(s)) return `${what} ${esc(s.host)} cannot be shown inside another page, so <a href="${url}" target="_blank" rel="noopener">open it in a new tab</a>.`;
  return `${what} ${s.shot ? "Click it" : "The Load button"} to use <a href="${url}" target="_blank" rel="noopener">${esc(s.host)}</a> live in this window.`;
}
function renderSite(b, api, s) {
  const url = s.private ? "" : "https://" + s.host + "/";
  /* the picture shows first; the live site loads only when the visitor asks, so four windows do not cost four page loads */
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const media = s.video ? `<video class="br-shot" src="${s.video}" poster="${s.shot}" muted loop playsinline preload="metadata"${still ? "" : " autoplay"} aria-label="${esc(s.title)}, a short clip of the site"></video>` : `<img class="br-shot" src="${s.shot}" alt="${esc(s.title)}, the home page" decoding="async">`;
  const view = !s.shot
    ? `<div class="standin" tabindex="0">${standin(s)}</div>${canFrame(s) ? `<button type="button" class="br-go">${ICON.globe} Load ${esc(s.host)} here</button>` : ""}`
    : s.private ? `<div class="br-live is-static">${media}</div>`
    : canFrame(s) ? `<button type="button" class="br-live" aria-label="Load ${esc(s.host)} live in this window">${media}<span class="br-hint">${ICON.globe} Click to load the live site</span></button>`
    : `<a class="br-live" href="${url}" target="_blank" rel="noopener" aria-label="Open ${esc(s.host)} in a new tab">${media}<span class="br-hint">${ICON.ext} Open ${esc(s.host)} in a new tab</span></a>`;
  b.innerHTML = `<div class="br">
    <div class="br-bar">
      <button type="button" class="br-ib" aria-label="Back" disabled>${ICON.back}</button><button type="button" class="br-ib" aria-label="Forward" disabled>${ICON.fwd}</button><button type="button" class="br-ib br-reload" aria-label="Reload">${ICON.reload}</button>
      <span class="br-url">${s.private ? ICON.lock + "<span>Private project</span>" : ICON.lock + `<span>${esc(s.host)}</span>`}</span>
      ${url ? `<a class="br-ib" href="${url}" target="_blank" rel="noopener" aria-label="Open ${esc(s.host)} in a new tab" title="Open in a new tab">${ICON.ext}</a>` : ""}
    </div>
    <div class="br-view">${view}<div class="br-load"></div></div>
    <p class="br-stack"><b>Built with</b> ${esc(s.stack)} <span>·</span> ${esc(s.stats)}</p>
    <p class="br-note">${note(s, url)}</p>
  </div>`;
  const go = b.querySelector(".br-go, button.br-live");
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
    <ul class="si-list">${SITES.map((s) => `<li><button type="button" class="si" data-id="${s.id}" style="--accent:var(--${s.accent});--accent-ink:var(--${s.accent}-ink)"><span class="si-prev">${s.thumb ? `<img class="si-shot" src="${s.thumb}" alt="" loading="lazy" decoding="async">` : `<span class="si-mini" aria-hidden="true">${standin(s).replace(/<(\/?)button\b[^>]*>/g, "<$1span>")}</span>`}</span><span class="si-t">${s.title}</span><span class="si-h">${s.private ? "Private" : s.host}</span><span class="si-b">${s.blurb}</span><span class="si-s">${s.stats}</span><span class="si-tag">${s.tag}</span></button></li>`).join("")}</ul></div>`;
  b.querySelector(".si-list").addEventListener("click", (e) => { const t = e.target.closest(".si"); if (t) api.open(siteSpec(SITES.find((s) => s.id === t.dataset.id))); });
}
function siteExtras(api) { return SITES.map((s) => ({ label: s.title, hint: s.private ? "Private project" : s.host, icon: ICON.globe, run: () => api.open(siteSpec(s)) })); }
