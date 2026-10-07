/* rahulll.com - site behaviour (no libraries needed) */
(function () {
  "use strict";

  const root = document.documentElement;
  root.classList.remove("no-js");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  const el = function (tag, props, children) {
    const node = document.createElement(tag);
    Object.assign(node, props || {});
    (children || []).forEach((c) => node.append(c));
    return node;
  };

  const svgIcon = (d) =>
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' +
    d +
    '"/></svg>';
  const ARROW = "M5 12h14M13 6l6 6-6 6";

  /* ---------- Menu overlay ---------- */
  const menuBtn = $(".menu-btn");
  const menu = $("#menu");
  const setMenu = function (open) {
    document.body.classList.toggle("menu-open", open);
    document.body.classList.toggle("is-locked", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.inert = !open;
    if (open) $("a", menu).focus();
  };
  if (menuBtn && menu) {
    menu.inert = true;
    menuBtn.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
    $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
        setMenu(false);
        menuBtn.focus();
      }
    });
  }

  /* ---------- Header colour over dark sections ---------- */
  const header = $(".site-header");
  const darkSections = $$(".dark");
  const updateHeader = function () {
    if (!header) return;
    const y = 50;
    const onDark = darkSections.some((s) => {
      const r = s.getBoundingClientRect();
      return r.top <= y && r.bottom >= y;
    });
    header.classList.toggle("on-dark", onDark);
  };

  /* ---------- Hero role roller ---------- */
  const roller = $(".roller");
  if (roller && !reduceMotion) {
    const items = $$("span", roller);
    let i = 0;
    setInterval(() => {
      const cur = items[i];
      i = (i + 1) % items.length;
      const next = items[i];
      cur.classList.remove("is-in");
      cur.classList.add("is-out");
      next.classList.remove("is-out");
      next.classList.add("is-in");
      setTimeout(() => cur.classList.remove("is-out"), 900);
    }, 2600);
  }

  /* ---------- Statement: split into words that light up on scroll ---------- */
  const statement = $(".statement");
  let words = [];
  if (statement) {
    const walk = function (node) {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) frag.append(part);
            else frag.append(el("span", { className: "w", textContent: part }));
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    };
    walk(statement);
    words = $$(".w", statement);
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }),
      { rootMargin: "0px 0px -12% 0px" }
    );
    reveals.forEach((r) => io.observe(r));
  } else {
    reveals.forEach((r) => r.classList.add("is-visible"));
  }

  /* ---------- Footer year ---------- */
  $$("[data-year]").forEach((n) => (n.textContent = new Date().getFullYear()));

  /* ---------- Videos: play only while on screen ---------- */
  const videoObserver =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) =>
            entries.forEach((entry) => {
              const v = entry.target;
              if (entry.isIntersecting && !reduceMotion && v.dataset.hold !== "1") {
                const p = v.play();
                if (p && p.catch) p.catch(() => {});
              } else {
                v.pause();
              }
            }),
          { threshold: 0.2 }
        )
      : null;

  const mediaNode = function (m, opts) {
    opts = opts || {};
    if (m.type === "video") {
      const v = el("video", { muted: true, loop: true, playsInline: true, preload: "metadata", src: encodeURI(m.src) });
      v.setAttribute("muted", "");
      v.setAttribute("aria-label", m.caption || "Video");
      if (opts.controls) {
        v.controls = true;
        if (!reduceMotion) v.autoplay = true;
      } else if (videoObserver) {
        videoObserver.observe(v);
      }
      return v;
    }
    return el("img", { src: encodeURI(m.src), alt: m.caption || "", loading: opts.eager ? "eager" : "lazy", decoding: "async" });
  };

  /* ---------- Scroll-linked effects ---------- */
  const heroWords = $(".hero-words");
  const portrait = $(".portrait");
  const marquees = $$(".marquee .track");
  const msgStage = $(".marquee-stage");
  const msgPhoto = $(".message-photo");
  const msgImg = $(".message-photo img");
  const scribble = $(".scribble path");
  let scribbleLen = 0;
  if (scribble) {
    scribbleLen = scribble.getTotalLength();
    scribble.style.strokeDasharray = scribbleLen;
    scribble.style.strokeDashoffset = reduceMotion ? 0 : scribbleLen;
  }

  let showcaseUpdate = null;

  const onScroll = function () {
    const vh = window.innerHeight;
    const sy = window.scrollY;

    updateHeader();

    if (!reduceMotion) {
      if (heroWords && sy < vh * 1.2) {
        heroWords.style.transform = "translateY(" + sy * 0.35 + "px)";
        portrait.style.transform = "translateX(-50%) translateY(" + sy * 0.12 + "px) scale(" + (1 + sy / vh / 6) + ")";
      }

      if (msgStage) {
        const r = msgStage.getBoundingClientRect();
        const p = clamp((vh - r.top) / (vh + r.height), 0, 1);
        marquees.forEach((t, i) => {
          const dir = i % 2 ? 1 : -1;
          const w = t.scrollWidth / 2;
          t.style.transform = "translateX(" + (dir === -1 ? -p * w * 0.6 : -w * 0.6 + p * w * 0.6) + "px)";
        });
        if (msgPhoto) {
          msgPhoto.style.transform = "rotate(" + (p - 0.5) * -6 + "deg)";
          msgImg.style.transform = "scale(" + (1.25 - p * 0.2) + ") translateY(" + (p - 0.5) * -30 + "px)";
        }
        if (scribble) {
          const d = clamp((p - 0.25) / 0.45, 0, 1);
          scribble.style.strokeDashoffset = scribbleLen * (1 - d);
        }
      }

      if (words.length) {
        const r = statement.getBoundingClientRect();
        const p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0, 1);
        const n = Math.round(p * words.length);
        words.forEach((w, i) => w.classList.toggle("on", i < n));
      }
    }

    if (showcaseUpdate) showcaseUpdate(vh);
  };

  let ticking = false;
  const requestTick = function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        onScroll();
      });
    }
  };
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick);

  /* ---------- Project dialog ---------- */
  const dialog = $("#project-dialog");
  let openProject = null;

  if (dialog && typeof PROJECTS !== "undefined") {
    let current = -1;
    let order = PROJECTS.map((_, i) => i);
    let opener = null;

    openProject = function (index, list, from) {
      if (list) order = list;
      if (from) opener = from;
      current = index;
      const p = PROJECTS[index];
      const tag = $(".tag", dialog);
      tag.textContent = CATEGORIES[p.category].label;
      tag.dataset.cat = p.category;
      $("h2", dialog).textContent = p.title;
      $(".dialog-summary", dialog).textContent = p.summary;

      const media = $(".dialog-media", dialog);
      media.replaceChildren();
      p.media.forEach((m, i) => {
        const text = el("div", { textContent: m.caption || "" });
        if (m.list) text.append(el("ul", {}, m.list.map((item) => el("li", { textContent: item }))));
        media.append(
          el("figure", {}, [
            el("div", { className: "media-wrap" }, [mediaNode(m, { controls: true, eager: i === 0 })]),
            el("figcaption", {}, [el("span", { className: "mono", textContent: String(i + 1).padStart(2, "0") }), text]),
          ])
        );
      });
      $(".dialog-scroll", dialog).scrollTop = 0;
      if (!dialog.open) {
        dialog.showModal();
        document.body.classList.add("is-locked");
      }
    };

    const step = function (dir) {
      const pos = order.indexOf(current);
      openProject(order[(pos + dir + order.length) % order.length]);
    };

    $("[data-close]", dialog).addEventListener("click", () => dialog.close());
    $("[data-prev]", dialog).addEventListener("click", () => step(-1));
    $("[data-next]", dialog).addEventListener("click", () => step(1));
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close();
    });
    dialog.addEventListener("keydown", (e) => {
      if (e.target.tagName === "VIDEO") return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    });
    dialog.addEventListener("close", () => {
      document.body.classList.remove("is-locked");
      $$("video", dialog).forEach((v) => v.pause());
      $(".dialog-media", dialog).replaceChildren();
      if (opener) opener.focus();
    });
  }

  /* ---------- Showcase: pinned section that steps through frames ---------- */
  const showcase = $("#showcase");
  if (showcase && typeof SHOWCASE !== "undefined") {
    const frames = SHOWCASE.map((f) => {
      const index = PROJECTS.findIndex((p) => p.title === f.title);
      return { index: index, project: PROJECTS[index], media: PROJECTS[index].media[f.media || 0] };
    }).filter((f) => f.index >= 0);

    showcase.style.setProperty("--frames", frames.length);
    const stage = $(".stage", showcase);
    const slides = frames.map((f, i) => {
      const s = el("div", { className: "slide" }, [el("div", { className: "media-wrap" }, [mediaNode(f.media, { eager: i < 2 })])]);
      stage.append(s);
      return s;
    });

    const counterNow = $(".counter b", showcase);
    $(".counter .total", showcase).textContent = String(frames.length).padStart(2, "0");
    const tag = $(".tag", showcase);
    const title = $(".showcase-title", showcase);
    const summary = $(".showcase-summary", showcase);
    const ghost = $(".ghost-word", showcase);
    const openBtn = $(".showcase-open", showcase);
    const swapEls = [title, summary];

    // Progress rail: one segment per category, sized by how many frames it has
    const rail = $(".rail", showcase);
    const groups = [];
    frames.forEach((f, i) => {
      const last = groups[groups.length - 1];
      if (last && last.cat === f.project.category) last.end = i;
      else groups.push({ cat: f.project.category, start: i, end: i });
    });
    groups.forEach((g) => {
      const b = el("button", { type: "button" }, [
        el("span", { className: "bar" }, [el("i")]),
        el("span", { className: "mono", textContent: CATEGORIES[g.cat].label }),
      ]);
      b.dataset.cat = g.cat;
      b.style.setProperty("--n", g.end - g.start + 1);
      b.setAttribute("aria-label", "Jump to " + CATEGORIES[g.cat].label);
      b.addEventListener("click", () => jumpTo(g.start));
      rail.append(b);
      g.bar = $("i", b);
    });

    let active = -1;
    const setActive = function (i) {
      if (i === active) return;
      const first = active === -1;
      active = i;
      slides.forEach((s, k) => {
        s.classList.toggle("is-active", k === i);
        s.classList.toggle("is-past", k < i);
      });
      const f = frames[i];
      const apply = function () {
        counterNow.textContent = String(i + 1).padStart(2, "0");
        tag.textContent = CATEGORIES[f.project.category].label;
        tag.dataset.cat = f.project.category;
        ghost.textContent = CATEGORIES[f.project.category].label.split(" ")[0];
        title.textContent = f.project.title;
        summary.textContent = f.project.summary;
        swapEls.forEach((n) => n.classList.remove("is-leaving"));
      };
      if (first || reduceMotion) apply();
      else {
        swapEls.forEach((n) => n.classList.add("is-leaving"));
        setTimeout(apply, 220);
      }
    };

    const progress = function (vh) {
      const r = showcase.getBoundingClientRect();
      const total = showcase.offsetHeight - vh;
      return clamp(-r.top / total, 0, 0.9999);
    };

    const jumpTo = function (i) {
      const total = showcase.offsetHeight - window.innerHeight;
      const top = showcase.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + ((i + 0.5) / frames.length) * total, behavior: reduceMotion ? "auto" : "smooth" });
    };

    openBtn.addEventListener("click", () => {
      openProject(frames[active].index, frames.map((f) => f.index), openBtn);
    });

    showcaseUpdate = function (vh) {
      const p = progress(vh);
      const pos = p * frames.length;
      setActive(Math.floor(pos));
      groups.forEach((g) => {
        const span = g.end - g.start + 1;
        g.bar.parentNode.parentNode.style.setProperty("--p", clamp((pos - g.start) / span, 0, 1));
      });
    };
  }

  /* ---------- Archive: fanned card carousel ---------- */
  const fan = $("#fan");
  if (fan && typeof PROJECTS !== "undefined") {
    const chipsEl = $("#chips");
    const capTag = $("#fan-tag");
    const capTitle = $("#fan-title");
    const capCount = $("#fan-count");
    let filter = "all";
    let list = PROJECTS.map((_, i) => i);
    let pos = 0;

    const cards = PROJECTS.map((p, i) => {
      const c = el("button", { type: "button", className: "fan-card" }, [mediaNode(p.media[0])]);
      c.setAttribute("aria-label", p.title);
      c.addEventListener("click", () => {
        if (moved) return;
        const k = list.indexOf(i);
        if (k === pos) openProject(i, list, c);
        else {
          pos = k;
          layout();
        }
      });
      return c;
    });

    const makeChip = function (key, label) {
      const b = el("button", { type: "button", className: "chip", textContent: label });
      b.dataset.filter = key;
      if (key !== "all") b.dataset.cat = key;
      b.setAttribute("aria-pressed", String(key === "all"));
      b.addEventListener("click", () => {
        filter = key;
        $$(".chip", chipsEl).forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.filter === key)));
        list = PROJECTS.map((_, i) => i).filter((i) => key === "all" || PROJECTS[i].category === key);
        pos = 0;
        layout();
      });
      return b;
    };
    chipsEl.append(makeChip("all", "All work"));
    Object.keys(CATEGORIES).forEach((k) => chipsEl.append(makeChip(k, CATEGORIES[k].label)));

    const layout = function () {
      const small = window.innerWidth < 700;
      const spread = small ? 0.62 : 0.5;
      cards.forEach((c, i) => {
        const k = list.indexOf(i);
        const n = list.length;
        let off = k - pos;
        if (off > n / 2) off -= n;
        if (off < -n / 2) off += n;
        const abs = Math.abs(off);
        const visible = k >= 0 && abs <= (small ? 2 : 4);
        if (k < 0) {
          if (c.isConnected) c.remove();
          return;
        }
        if (!c.isConnected) fan.append(c);
        c.dataset.off = off;
        c.style.zIndex = String(100 - abs);
        c.style.opacity = visible ? "1" : "0";
        c.style.pointerEvents = visible ? "auto" : "none";
        c.tabIndex = off === 0 ? 0 : -1;
        c.style.transform =
          "translate(-50%, -50%) translateX(" +
          off * spread * 100 +
          "%) translateY(" +
          abs * abs * 2.2 +
          "%) rotate(" +
          off * (small ? 9 : 7) +
          "deg) scale(" +
          (off === 0 ? 1.04 : 1 - abs * 0.05) +
          ")";
        const v = $("video", c);
        if (v) {
          v.dataset.hold = off === 0 ? "0" : "1";
          if (off === 0 && !reduceMotion) {
            const pr = v.play();
            if (pr && pr.catch) pr.catch(() => {});
          } else v.pause();
        }
      });
      const p = PROJECTS[list[pos]];
      capTag.textContent = CATEGORIES[p.category].label;
      capTag.dataset.cat = p.category;
      capTitle.textContent = p.title;
      capCount.textContent =
        String(pos + 1).padStart(2, "0") + " / " + String(list.length).padStart(2, "0") + "  ·  " + p.media.length + (p.media.length === 1 ? " item" : " items");
    };

    const go = function (d) {
      pos = (pos + d + list.length) % list.length;
      layout();
    };

    $("#fan-prev").addEventListener("click", () => go(-1));
    $("#fan-next").addEventListener("click", () => go(1));
    $("#fan-open").addEventListener("click", (e) => openProject(list[pos], list, e.currentTarget));
    fan.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    });

    // Drag or swipe
    let startX = 0;
    let dragging = false;
    let moved = false;
    fan.addEventListener("pointerdown", (e) => {
      dragging = true;
      moved = false;
      startX = e.clientX;
    });
    window.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 60) {
        moved = true;
        go(dx < 0 ? 1 : -1);
        startX = e.clientX;
      }
    });
    window.addEventListener("pointerup", () => {
      dragging = false;
      setTimeout(() => (moved = false), 0);
    });
    window.addEventListener("resize", layout);

    layout();
  }

  /* ---------- Hero: spinning wireframe dome (a nod to CAD) ---------- */
  const wireG = document.getElementById("wire-g");
  if (wireG) {
    const NS = "http://www.w3.org/2000/svg";
    const R = 186;
    const C = 200;
    const meridians = [];
    for (let i = 0; i < 14; i++) {
      const e = document.createElementNS(NS, "ellipse");
      e.setAttribute("cx", C);
      e.setAttribute("cy", C);
      e.setAttribute("ry", R);
      wireG.append(e);
      meridians.push(e);
    }
    for (let k = 1; k < 7; k++) {
      const phi = (k / 7) * (Math.PI / 2);
      const e = document.createElementNS(NS, "ellipse");
      const rx = R * Math.cos(phi);
      e.setAttribute("cx", C);
      e.setAttribute("cy", C - R * Math.sin(phi));
      e.setAttribute("rx", rx);
      e.setAttribute("ry", rx * 0.16);
      wireG.append(e);
    }
    const draw = function (t) {
      const a = t / 9000;
      meridians.forEach((e, i) => e.setAttribute("rx", Math.abs(R * Math.cos(a + (i * Math.PI) / meridians.length)).toFixed(1)));
    };
    draw(0);
    if (!reduceMotion) {
      let heroVisible = true;
      if ("IntersectionObserver" in window) {
        new IntersectionObserver((en) => (heroVisible = en[0].isIntersecting)).observe(wireG.ownerSVGElement);
      }
      const loop = function (t) {
        if (heroVisible) draw(t);
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
  }

  onScroll();
})();
