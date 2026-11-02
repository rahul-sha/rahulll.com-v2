/* Shared definitions that are design, not content. Content comes from site/content.js, which build/build.js writes from the content/ folders. */
/* The four stages of the story, in order: design it, simulate it, make it, test it. One colour each. */
const CATS = {
  design: { label: "Design", long: "Product design", hue: "a2", verb: "Design it" },
  rnd: { label: "Simulate", long: "Research and development", hue: "a3", verb: "Simulate it" },
  mnfg: { label: "Make", long: "Manufacturing", hue: "a1", verb: "Make it" },
  test: { label: "Test", long: "Testing and validation", hue: "a4", verb: "Test it" },
};

/* the four accent colours, in order; a list cycles through them with ACCENTS[i % ACCENTS.length] */
const ACCENTS = Object.values(CATS).map((c) => c.hue).sort();
/* small counts read as words in sentences ("three workspaces"); bigger ones stay as numbers */
const inWords = (n) => ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"][n] || String(n);
/* the printer most prints were made on, from content/prints/ */
const PRINTER = (() => { const n = {}; PRINTS.forEach((p) => p.printer && (n[p.printer] = (n[p.printer] || 0) + 1)); return Object.keys(n).sort((a, b) => n[b] - n[a])[0] || "[printer]"; })();

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
