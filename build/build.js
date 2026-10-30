/* Builds rahulll.com into dist/.
   Reads the content/ folders (Markdown with a YAML header), writes site/content.js, resizes images to WebP,
   typesets the resume PDF, and copies the shell. Run with `npm run build`; Vercel runs the same command. */
const fs = require("fs"), path = require("path");
const yaml = require("js-yaml"), { marked } = require("marked"), sharp = require("sharp"), PDFDocument = require("pdfkit");

const ROOT = path.resolve(__dirname, ".."), CONTENT = path.join(ROOT, "content"), DIST = path.join(ROOT, "dist");
const problems = [];
const fail = (where, what) => problems.push(`${where}: ${what}`);

/* ---------- reading ---------- */
function readMd(file) {
  const raw = fs.readFileSync(file, "utf8");
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) { fail(rel(file), "no YAML header between --- lines"); return { fm: {}, body: "" }; }
  let fm = {};
  try { fm = yaml.load(m[1]) || {}; } catch (e) { fail(rel(file), "YAML header: " + e.message.split("\n")[0]); }
  return { fm, body: m[2].trim() };
}
const rel = (f) => path.relative(ROOT, f);
const html = (md) => (md ? marked.parse(md, { mangle: false, headerIds: false }).trim() : "");
const inline = (md) => (md ? marked.parseInline(String(md)).trim() : "");
const paras = (md) => (md ? md.split(/\n\s*\n/).map((p) => inline(p.trim())).filter(Boolean) : []);
const need = (fm, keys, where) => keys.forEach((k) => { if (fm[k] == null || fm[k] === "") fail(where, `missing "${k}"`); });
const listItems = (dir) => fs.existsSync(dir) ? fs.readdirSync(dir).filter((n) => !n.startsWith("_") && !n.startsWith(".")) : [];

/* ---------- images ---------- */
const imageJobs = [];
function image(kind, id, file, where, opts = {}) {
  if (!file) return "";
  const src = path.join(CONTENT, kind, id, file), seg = [kind, id].filter(Boolean).join("/");
  if (!fs.existsSync(src)) { fail(where, `image "${file}" not found beside index.md`); return ""; }
  const ext = path.extname(file).toLowerCase();
  if ([".webm", ".mp4"].includes(ext)) { const out = `site/media/${seg}/${file}`; imageJobs.push({ copy: src, out }); return out; }
  const out = `site/img/${seg}/${path.basename(file, ext)}.webp`;
  imageJobs.push({ src, out, max: opts.max || 1200, quality: opts.quality || 82 });
  return out;
}
/* a smaller copy for tiles and cards, which show the image at a few hundred pixels */
function thumb(out) {
  const j = imageJobs.find((x) => x.out === out && x.src);
  if (!j) return out;
  const small = out.replace(/\.webp$/, "-sm.webp");
  imageJobs.push({ src: j.src, out: small, max: 560, quality: 78 });
  return small;
}
async function runImages() {
  for (const j of imageJobs) {
    const dest = path.join(DIST, j.out);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    if (j.copy) { fs.copyFileSync(j.copy, dest); continue; }
    await sharp(j.src).rotate().resize({ width: j.max, height: j.max, fit: "inside", withoutEnlargement: true }).webp({ quality: j.quality }).toFile(dest);
  }
}

/* ---------- kinds ---------- */
const STAGE = { design: "design", simulate: "rnd", make: "mnfg", test: "test" };
function projects() {
  const out = [];
  for (const id of listItems(path.join(CONTENT, "projects"))) {
    const file = path.join(CONTENT, "projects", id, "index.md"), where = rel(file);
    if (!fs.existsSync(file)) { fail(`content/projects/${id}`, "folder has no index.md"); continue; }
    const { fm, body } = readMd(file);
    need(fm, ["title", "stage", "image"], where);
    if (fm.stage && !STAGE[fm.stage]) fail(where, `stage must be design, simulate, make, or test (got "${fm.stage}")`);
    out.push({
      id, cat: STAGE[fm.stage] || "design", title: fm.title || id, img: image("projects", id, fm.image, where), thumb: "", sum: html(body) || "",
      steps: fm.steps || [], outcome: fm.outcome || "", year: String(fm.year || ""), role: fm.role || "", team: fm.team || "", result: fm.result || "",
      flagship: !!fm.flagship, order: fm.order || 99,
      media: (fm.media || []).map((m) => ({ kind: m.kind === "video" ? "video" : "section", label: m.label || "", file: image("projects", id, m.file, where) })),
    });
  }
  return out.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}
function prints() {
  const out = [];
  for (const id of listItems(path.join(CONTENT, "prints"))) {
    const file = path.join(CONTENT, "prints", id, "index.md"), where = rel(file);
    if (!fs.existsSync(file)) { fail(`content/prints/${id}`, "folder has no index.md"); continue; }
    const { fm, body } = readMd(file);
    need(fm, ["title", "printer", "material", "why"], where);
    out.push({
      id, title: fm.title || id, short: fm.short || "", img: image("prints", id, fm.image, where), thumb: "", printer: fm.printer || "", material: fm.material || "",
      why: inline(fm.why), hue: fm.accent || "a1", url: fm.makerworld || "", private: !fm.makerworld, story: html(body), notes: fm.notes || [],
      settings: { layer: fm.layer || "", infill: fm.infill || "", supports: fm.supports || "", time: fm.time || "" },
      photos: (fm.photos || []).map((f) => image("prints", id, f, where)).filter(Boolean), order: fm.order || 99,
    });
  }
  return out.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}
function sites() {
  const out = [];
  for (const name of listItems(path.join(CONTENT, "sites"))) {
    if (!name.endsWith(".md")) continue;
    const file = path.join(CONTENT, "sites", name), where = rel(file), { fm, body } = readMd(file);
    need(fm, ["title", "host", "accent"], where);
    out.push({ id: path.basename(name, ".md"), title: fm.title, host: fm.host, tag: fm.tag || "", accent: fm.accent || "a1", blurb: inline(body), stats: fm.stats || "", stack: fm.stack || "", private: !!fm.private, order: fm.order || 99 });
  }
  return out.sort((a, b) => a.order - b.order);
}
function single(name) { const f = path.join(CONTENT, name); if (!fs.existsSync(f)) { fail("content", `${name} is missing`); return { fm: {}, body: "" }; } return readMd(f); }

/* ---------- link preview image (1200 x 630) ---------- */
async function ogImage(about, portrait, dest) {
  const x = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <defs><radialGradient id="g1" cx=".85" cy=".1" r=".7"><stop offset="0" stop-color="#a9aefe" stop-opacity=".45"/><stop offset="1" stop-color="#070722" stop-opacity="0"/></radialGradient>
    <radialGradient id="g2" cx=".1" cy="1" r=".6"><stop offset="0" stop-color="#9bfece" stop-opacity=".3"/><stop offset="1" stop-color="#070722" stop-opacity="0"/></radialGradient></defs>
    <rect width="1200" height="630" fill="#070722"/><rect width="1200" height="630" fill="url(#g1)"/><rect width="1200" height="630" fill="url(#g2)"/>
    <rect x="96" y="150" width="330" height="330" rx="64" fill="none" stroke="#fff59b" stroke-width="10"/>
    <text x="490" y="250" font-family="DejaVu Sans, Arial, sans-serif" font-size="30" font-weight="700" fill="#a9aefe" letter-spacing="3">${x((about.role || "").toUpperCase())}</text>
    <text x="490" y="340" font-family="DejaVu Sans, Arial, sans-serif" font-size="76" font-weight="800" fill="#f3edf7">${x(about.name || "")}</text>
    <text x="490" y="410" font-family="DejaVu Sans, Arial, sans-serif" font-size="32" fill="#c9c6e4">CAD, simulation, machining, and testing</text>
    <rect x="490" y="450" width="70" height="10" rx="5" fill="#fff59b"/><rect x="568" y="450" width="70" height="10" rx="5" fill="#a9aefe"/><rect x="646" y="450" width="70" height="10" rx="5" fill="#9bfece"/><rect x="724" y="450" width="70" height="10" rx="5" fill="#ff8fa3"/>
  </svg>`;
  const layers = [];
  if (fs.existsSync(portrait) && fs.statSync(portrait).isFile()) {
    const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="300" height="300" rx="52" fill="#fff"/></svg>`);
    const face = await sharp(portrait).rotate().resize(300, 300, { fit: "cover" }).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
    layers.push({ input: face, left: 111, top: 165 });
  }
  await sharp(Buffer.from(svg)).composite(layers).jpeg({ quality: 86 }).toFile(dest);
}

/* ---------- resume PDF ---------- */
function resumePdf(resume, about, dest) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margins: { top: 56, bottom: 56, left: 56, right: 56 }, info: { Title: `${about.name} resume`, Author: about.name } });
    const s = fs.createWriteStream(dest); doc.pipe(s);
    const ink = "#1b1a33", mute = "#5e5f8c", accent = "#4048c9";
    doc.font("Helvetica-Bold").fontSize(22).fillColor(ink).text(about.name);
    doc.font("Helvetica").fontSize(11).fillColor(mute).text(`${about.role}, ${about.place}`);
    doc.moveDown(0.3).fontSize(10).fillColor(ink).text([about.email, ...about.links.map(([n, u]) => u)].filter((x) => x && !x.startsWith("[")).join("  ·  "));
    const section = (t) => { doc.moveDown(1).font("Helvetica-Bold").fontSize(9).fillColor(accent).text(t.toUpperCase(), { characterSpacing: 1 }); doc.moveDown(0.3); };
    const rows = (list) => list.forEach(([d, t, o, x]) => {
      doc.font("Helvetica-Bold").fontSize(11).fillColor(ink).text(t, { continued: true }).font("Helvetica").fillColor(mute).text(`   ${d}`);
      doc.font("Helvetica").fontSize(10).fillColor(mute).text(o);
      if (x && !x.startsWith("[")) doc.fillColor(ink).text(x);
      doc.moveDown(0.5);
    });
    doc.moveDown(0.6).font("Helvetica").fontSize(10.5).fillColor(ink).text(about.line);
    section("Experience"); rows(resume.jobs);
    section("Education"); rows(resume.study);
    if (resume.tools.length) { section("Tools"); doc.font("Helvetica").fontSize(10).fillColor(ink).text(resume.tools.join("  ·  ")); }
    doc.end(); s.on("finish", resolve); s.on("error", reject);
  });
}

/* ---------- build ---------- */
async function main() {
  const check = process.argv.includes("--check");
  const about = single("about/index.md"), resume = single("resume.md"), skills = single("skills.md"), lab = single("homelab.md"), home = single("home.md"), games = single("gaming.md"), hl = single("highlight.md");
  need(about.fm, ["name", "role", "place"], "content/about/index.md");
  const ap = paras(about.body);
  const ME = { name: about.fm.name, role: about.fm.role, place: about.fm.place, line: ap[0] || "", voice: ap[1] || "", links: (about.fm.links || []).map((l) => [l.name, l.url]), email: about.fm.email || "" };
  const ABOUT = { headline: about.fm.headline || "", employer: about.fm.employer || "", open_to: about.fm.open_to || "", image: image("about", "", about.fm.image, "content/about/index.md", { max: 600 }) };
  const PROJECTS = projects(), PRINTS = prints(), SITES = sites();
  for (const p of PROJECTS.concat(PRINTS)) p.thumb = p.img ? thumb(p.img) : "";
  const tuple = (r) => [r.dates || "", r.title || "", r.place || "", r.line || ""];
  const JOBS = (resume.fm.jobs || []).map(tuple), STUDY = (resume.fm.study || []).map(tuple), TOOLS = (resume.fm.tools || []).map((t) => [t, 0]);
  const stages = skills.fm.stages || {};
  const SKILLS = Object.fromEntries(Object.entries(STAGE).map(([k, v]) => [v, { tools: (stages[k] || {}).tools || [], proof: ((stages[k] || {}).proof || []).filter((id) => { const ok = PROJECTS.some((p) => p.id === id); if (!ok) fail("content/skills.md", `proof "${id}" is not a project id`); return ok; }) }]));
  const BEYOND = (skills.fm.beyond || []).map((b) => [b.name, b.line, b.opens]);
  const LAB = (lab.fm.services || []).map((x) => [x.name, x.line, x.accent || "a2"]), DEVICES = (lab.fm.devices || []).map((x) => [x.name, x.line]);
  const HOME = (home.fm.tiles || []).map((t) => t.kind === "temp" ? { name: t.name, kind: "temp", val: String(t.value), unit: t.unit || "" } : { name: t.name, kind: "light", on: !!t.on });
  const GAMES = { now: games.fm.now || [], alltime: games.fm.alltime || [], kit: games.fm.kit || [] };
  const HIGHLIGHT = { title: hl.fm.title || "Work highlight", line: hl.fm.outcome || "", note: inline(hl.body), video: image("", "", hl.fm.video, "content/highlight.md"), image: image("", "", hl.fm.image, "content/highlight.md") };
  const FLAGSHIPS = PROJECTS.filter((p) => p.flagship).map((p) => p.id);
  for (const p of PROJECTS) delete p.flagship;

  if (problems.length) { console.error("Content problems:\n  " + problems.join("\n  ")); process.exit(1); }
  /* the preview image is drawn once with `npm run og` and kept in content/about/, since build servers lack the fonts */
  if (process.argv.includes("--og")) { await ogImage(about.fm, path.join(CONTENT, "about", about.fm.image || ""), path.join(CONTENT, "about", "og.jpg")); console.log("Wrote content/about/og.jpg"); return; }
  if (check) { console.log(`Content is fine: ${PROJECTS.length} projects, ${PRINTS.length} prints, ${SITES.length} sites.`); return; }

  fs.rmSync(DIST, { recursive: true, force: true }); fs.mkdirSync(path.join(DIST, "site"), { recursive: true });
  const out = Object.entries({ ME, ABOUT, IMG: { ME: ABOUT.image }, FLAGSHIPS, HIGHLIGHT, SKILLS, SKILLS_NOTE: html(skills.body), BEYOND, PROJECTS, PRINTS, SITES, JOBS, STUDY, TOOLS, LAB, LAB_NOTE: inline(lab.body), DEVICES, HOME, HOME_NOTE: inline(home.body), GAMES, GAMES_NOTE: inline(games.body) })
    .map(([k, v]) => `const ${k} = ${JSON.stringify(v)};`).join("\n");
  fs.writeFileSync(path.join(DIST, "site/content.js"), `/* Generated by build/build.js from the content/ folders. Do not edit; edit the Markdown instead. */\n${out}\n`);
  for (const f of fs.readdirSync(path.join(ROOT, "site"))) fs.copyFileSync(path.join(ROOT, "site", f), path.join(DIST, "site", f));
  /* the address for link previews and search engines: Vercel's production domain when it builds there, rahulll.com otherwise */
  const SITE = "https://" + (process.env.SITE_HOST || process.env.VERCEL_PROJECT_PRODUCTION_URL || "rahulll.com");
  fs.writeFileSync(path.join(DIST, "index.html"), fs.readFileSync(path.join(ROOT, "index.html"), "utf8").replaceAll("%SITE%", SITE));
  fs.copyFileSync(path.join(ROOT, "favicon.svg"), path.join(DIST, "favicon.svg"));
  fs.writeFileSync(path.join(DIST, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
  fs.writeFileSync(path.join(DIST, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${SITE}/</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>\n</urlset>\n`);
  const og = path.join(CONTENT, "about", "og.jpg");
  if (fs.existsSync(og)) fs.copyFileSync(og, path.join(DIST, "og.jpg"));
  await runImages();
  await resumePdf({ jobs: JOBS, study: STUDY, tools: TOOLS.map(([t]) => t) }, { ...ME, link: "" }, path.join(DIST, "site/resume.pdf"));
  console.log(`Built dist/: ${PROJECTS.length} projects, ${PRINTS.length} prints, ${SITES.length} sites, ${imageJobs.length} images, resume.pdf.`);
}
main().catch((e) => { console.error(e); process.exit(1); });
