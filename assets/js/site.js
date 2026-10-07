/* rahulll.com - site behaviour (no libraries needed) */
(function () {
  "use strict";

  const root = document.documentElement;
  root.classList.remove("no-js");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Light / dark theme ---------- */
  const themeBtn = document.querySelector(".theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      const next = root.dataset.theme === "light" ? "dark" : "light";
      root.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
    });
  }

  /* ---------- Header: background on scroll, mobile menu ---------- */
  const header = document.querySelector(".site-header");
  const menuBtn = document.querySelector(".menu-toggle");
  if (header) {
    const onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 20);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  if (menuBtn && header) {
    menuBtn.addEventListener("click", function () {
      const open = header.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
    header.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () {
        header.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Typed roles in the hero ---------- */
  const typed = document.querySelector(".typed");
  if (typed) {
    const words = typed.dataset.words.split(",").map(function (w) {
      return w.trim();
    });
    if (reduceMotion) {
      typed.textContent = words[0];
    } else {
      let w = 0;
      let i = 0;
      let deleting = false;
      const tick = function () {
        const word = words[w];
        i += deleting ? -1 : 1;
        typed.textContent = word.slice(0, i);
        let delay = deleting ? 45 : 85;
        if (!deleting && i === word.length) {
          deleting = true;
          delay = 1800;
        } else if (deleting && i === 0) {
          deleting = false;
          w = (w + 1) % words.length;
          delay = 350;
        }
        setTimeout(tick, delay);
      };
      tick();
    }
  }

  /* ---------- Reveal sections as they scroll into view ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Portfolio ---------- */
  const grid = document.getElementById("projects");
  if (!grid || typeof PROJECTS === "undefined") return;

  const filtersEl = document.getElementById("filters");
  const introEl = document.getElementById("filter-intro");
  const dialog = document.getElementById("project-dialog");
  const ALL_INTRO = introEl.textContent;

  const url = function (src) {
    return encodeURI(src);
  };

  // Play card videos only while they are on screen, to save battery and data.
  const videoObserver =
    "IntersectionObserver" in window && !reduceMotion
      ? new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              const v = entry.target;
              if (entry.isIntersecting) {
                const p = v.play();
                if (p && p.catch) p.catch(function () {});
              } else {
                v.pause();
              }
            });
          },
          { threshold: 0.25 }
        )
      : null;

  const el = function (tag, props, children) {
    const node = document.createElement(tag);
    Object.assign(node, props || {});
    (children || []).forEach(function (c) {
      node.append(c);
    });
    return node;
  };

  const mediaNode = function (m, inDialog) {
    if (m.type === "video") {
      const v = el("video", {
        muted: true,
        loop: true,
        playsInline: true,
        preload: "metadata",
        src: url(m.src),
      });
      v.setAttribute("muted", "");
      v.setAttribute("aria-label", m.caption || "Video");
      if (inDialog) {
        v.controls = true;
        if (!reduceMotion) v.autoplay = true;
      }
      return v;
    }
    return el("img", { src: url(m.src), alt: m.caption || "", loading: "lazy", decoding: "async" });
  };

  // Filter buttons
  const counts = {};
  PROJECTS.forEach(function (p) {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });

  const makeFilter = function (key, label, count) {
    const b = el("button", { type: "button", className: "filter" }, [
      label + " ",
      el("span", { className: "count", textContent: String(count) }),
    ]);
    b.dataset.filter = key;
    if (key !== "all") b.dataset.cat = key;
    b.setAttribute("aria-pressed", key === "all" ? "true" : "false");
    b.addEventListener("click", function () {
      setFilter(key);
    });
    return b;
  };

  filtersEl.append(makeFilter("all", "All", PROJECTS.length));
  Object.keys(CATEGORIES).forEach(function (key) {
    filtersEl.append(makeFilter(key, CATEGORIES[key].label, counts[key] || 0));
  });

  // Cards
  const STACK_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="14" height="14" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/></svg>';
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const cards = PROJECTS.map(function (p, index) {
    const multi = p.media.length > 1;
    const layer = function (m, i) {
      const l = el("div", { className: "card-layer" + (i === 0 ? " is-active" : "") }, [mediaNode(m, false)]);
      return l;
    };
    const mediaEl = el("div", { className: "card-media" }, [layer(p.media[0], 0)]);
    const card = el("button", { type: "button", className: "card" + (multi ? " is-multi" : "") }, [
      mediaEl,
      el("div", { className: "card-body" }, [
        el("span", { className: "card-cat mono", textContent: CATEGORIES[p.category].label }),
        el("h3", { textContent: p.title }),
        el("p", { textContent: p.summary }),
      ]),
    ]);
    card.dataset.cat = p.category;
    card.setAttribute("aria-haspopup", "dialog");
    card.setAttribute("aria-label", p.title + (multi ? ", " + p.media.length + " images and videos" : ""));
    card.addEventListener("click", function () {
      openProject(index);
    });
    const coverVideo = card.querySelector("video");
    if (coverVideo && videoObserver) videoObserver.observe(coverVideo);

    if (multi) {
      // Always-visible cue: a counter badge and one dot per item
      const badge = el("span", { className: "card-badge mono" });
      badge.innerHTML = STACK_ICON;
      const badgeText = el("span", { textContent: p.media.length + " items" });
      badge.append(badgeText);
      const dots = el(
        "span",
        { className: "card-dots" },
        p.media.map(function (_, i) {
          return el("i", { className: i === 0 ? "is-active" : "" });
        })
      );
      mediaEl.append(badge, dots);

      // Hover preview: cycle through the project's items, then return to the cover
      let layers = null;
      let timer = null;
      let shown = 0;
      const show = function (i) {
        layers[shown].classList.remove("is-active");
        const oldVideo = layers[shown].querySelector("video");
        if (oldVideo && shown !== 0) oldVideo.pause();
        shown = i;
        layers[i].classList.add("is-active");
        const v = layers[i].querySelector("video");
        if (v) {
          const pr = v.play();
          if (pr && pr.catch) pr.catch(function () {});
        }
        dots.querySelectorAll("i").forEach(function (d, k) {
          d.classList.toggle("is-active", k === i);
        });
        badgeText.textContent = i === 0 && !timer ? p.media.length + " items" : i + 1 + " / " + p.media.length;
      };
      const start = function () {
        if (reduceMotion || timer) return;
        if (!layers) {
          layers = [mediaEl.querySelector(".card-layer")];
          p.media.slice(1).forEach(function (m, i) {
            const l = layer(m, i + 1);
            mediaEl.insertBefore(l, badge);
            layers.push(l);
          });
        }
        card.classList.add("is-previewing");
        timer = setInterval(function () {
          show((shown + 1) % layers.length);
        }, 1400);
        show(shown === 0 ? 1 : shown);
      };
      const stop = function () {
        if (!timer) return;
        clearInterval(timer);
        timer = null;
        card.classList.remove("is-previewing");
        show(0);
      };
      if (canHover) {
        card.addEventListener("mouseenter", start);
        card.addEventListener("mouseleave", stop);
      }
      card.addEventListener("focus", start);
      card.addEventListener("blur", stop);
      card.addEventListener("click", stop);
    }
    return card;
  });

  const setFilter = function (key) {
    filtersEl.querySelectorAll(".filter").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.filter === key));
    });
    introEl.textContent = key === "all" ? ALL_INTRO : CATEGORIES[key].intro;
    grid.replaceChildren();
    cards.forEach(function (card, i) {
      if (key === "all" || PROJECTS[i].category === key) {
        card.style.animationDelay = Math.min(grid.children.length * 40, 400) + "ms";
        grid.append(card);
      }
    });
  };

  setFilter("all");

  // Project dialog
  let current = -1;
  const visibleIndexes = function () {
    return cards
      .map(function (c, i) {
        return c.isConnected ? i : -1;
      })
      .filter(function (i) {
        return i >= 0;
      });
  };

  const openProject = function (index) {
    current = index;
    const p = PROJECTS[index];
    dialog.dataset.cat = p.category;
    dialog.querySelector(".card-cat").textContent = CATEGORIES[p.category].label;
    dialog.querySelector("h2").textContent = p.title;
    dialog.querySelector(".dialog-summary").textContent = p.summary;

    const list = dialog.querySelector(".dialog-media");
    list.replaceChildren();
    p.media.forEach(function (m, i) {
      const caption = el("figcaption", {}, [
        el("span", { className: "mono", textContent: String(i + 1).padStart(2, "0") }),
      ]);
      const text = el("div", { textContent: m.caption || "" });
      if (m.list) {
        text.append(
          el(
            "ul",
            {},
            m.list.map(function (item) {
              return el("li", { textContent: item });
            })
          )
        );
      }
      caption.append(text);
      list.append(el("figure", {}, [mediaNode(m, true), caption]));
    });

    dialog.querySelector(".dialog-scroll").scrollTop = 0;
    if (!dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    }
  };

  const step = function (dir) {
    const vis = visibleIndexes();
    const pos = vis.indexOf(current);
    openProject(vis[(pos + dir + vis.length) % vis.length]);
  };

  dialog.querySelector("[data-close]").addEventListener("click", function () {
    dialog.close();
  });
  dialog.querySelector("[data-prev]").addEventListener("click", function () {
    step(-1);
  });
  dialog.querySelector("[data-next]").addEventListener("click", function () {
    step(1);
  });
  dialog.addEventListener("click", function (e) {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });
  dialog.addEventListener("close", function () {
    document.body.style.overflow = "";
    dialog.querySelectorAll("video").forEach(function (v) {
      v.pause();
    });
    dialog.querySelector(".dialog-media").replaceChildren();
    if (cards[current]) cards[current].focus();
  });
})();
