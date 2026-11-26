/* Version check: a pull request that changes what visitors see must raise the version in package.json.
   Last number for a fix (1.1.0 to 1.1.1), middle for a feature (1.1.0 to 1.2.0), first for a redesign (2.0.0).
   Run with `npm run check:version`; GitHub runs it on every pull request. Saves from /admin go straight to main and skip it. */
const { execSync } = require("child_process");

/* true when version a is higher than version b */
function newer(a, b) {
  const x = a.split(".").map(Number), y = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0);
  return false;
}
/* the changed files a visitor would notice */
const visible = (files) => files.filter((f) => /^(site|content)\//.test(f) || f === "index.html" || f === "favicon.svg");
function verdict(files, now, before) {
  const seen = visible(files);
  if (now !== before && !newer(now, before)) return { ok: false, why: `The version went down, from ${before} on main to ${now}. Set it higher than ${before} in package.json.` };
  if (seen.length && !newer(now, before)) return { ok: false, why: `This change alters what visitors see, but package.json still says ${now}, the same as main.\nRaise "version" in package.json: last number for a fix, middle for a feature, first for a redesign.\nFiles visitors see:\n  ${seen.join("\n  ")}` };
  return { ok: true, why: seen.length ? `Version raised from ${before} to ${now}.` : "Nothing visitors see has changed." };
}

if (require.main === module) {
  const git = (c) => execSync(`git ${c}`, { encoding: "utf8" }).trim();
  const base = process.env.BASE_REF || "origin/main";
  try { git(`rev-parse --verify ${base}`); } catch (_) { console.error(`Cannot find ${base}. Run: git fetch origin main`); process.exit(1); }
  const from = git(`merge-base ${base} HEAD`);
  const files = git(`diff --name-only ${from} HEAD`).split("\n").filter(Boolean);
  const before = JSON.parse(git(`show ${from}:package.json`)).version;
  const now = require("../package.json").version;
  const r = verdict(files, now, before);
  console.log(r.why);
  process.exit(r.ok ? 0 : 1);
}
module.exports = { newer, visible, verdict };
