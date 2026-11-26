/* Tests for the version check (run with `node --test build/`). */
const test = require("node:test"), assert = require("node:assert");
const { newer, visible, verdict } = require("./check-version.js");

test("newer compares each part as a number", () => {
  assert.equal(newer("1.1.0", "1.0.0"), true);
  assert.equal(newer("1.0.10", "1.0.9"), true);
  assert.equal(newer("2.0.0", "1.9.9"), true);
  assert.equal(newer("1.0.0", "1.0.0"), false);
  assert.equal(newer("1.0.0", "1.1.0"), false);
});

test("visible picks out files visitors see", () => {
  assert.deepEqual(visible(["site/render.js", "index.html", "content/gaming.md", "favicon.svg", "docs/roadmap.md", "README.md", "api/weather.js", "build/build.js"]),
    ["site/render.js", "index.html", "content/gaming.md", "favicon.svg"]);
});

test("verdict fails a visible change that keeps the old number", () => {
  assert.equal(verdict(["site/desk.css"], "1.1.0", "1.1.0").ok, false);
  assert.equal(verdict(["site/desk.css"], "1.1.1", "1.1.0").ok, true);
  assert.equal(verdict(["docs/roadmap.md"], "1.1.0", "1.1.0").ok, true);
  assert.equal(verdict([], "1.1.0", "1.1.0").ok, true);
});

test("verdict fails a number that goes down", () => {
  assert.equal(verdict(["docs/roadmap.md"], "1.0.0", "1.1.0").ok, false);
});
