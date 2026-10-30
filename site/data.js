/* Shared definitions that are design, not content. Content comes from site/content.js, which build/build.js writes from the content/ folders. */
/* The four stages of the story, in order: design it, simulate it, make it, test it. One colour each. */
const CATS = {
  design: { label: "Design", long: "Product design", hue: "a2", verb: "Design it" },
  rnd: { label: "Simulate", long: "Research and development", hue: "a3", verb: "Simulate it" },
  mnfg: { label: "Make", long: "Manufacturing", hue: "a1", verb: "Make it" },
  test: { label: "Test", long: "Testing and validation", hue: "a4", verb: "Test it" },
};

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
