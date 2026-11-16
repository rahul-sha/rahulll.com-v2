# Roadmap: rahulll.com

- **Updated:** 2026-11-16

Bugs and smaller fixes live in the [bug and feedback tracker](https://claude.ai/artifact/KwDVECNhoHBfrKq3VZ3JaR). This page holds the bigger pieces of work and the order they come in.

## Now
Being built this week or next. At most three items.
- Fill in the missing Hello and Resume facts (email address, "Open to" line, internship line): they are the first things a visitor reads. Waiting on Rahul for the wording.
- Years and results for the seven projects other than the Cirrus Vision Jet: Engineering is the heart of the site and most projects still show placeholders.
- Question for Rahul: is this the right order, or should the phone fixes below come first?

## Next
Agreed and waiting for a slot.
- Phone fixes from the tracker: the pinned Guide covers the lower third of About on first visit, and landscape phones (844 x 390) get the desktop layout.
- 3D prints content: print settings, stories and design notes, and photos of the private designs.
- Off the clock facts: games list and hours for Gaming, sensors for Smart home, and services for Homelab.
- Chop Shop: a short description, or a decision to keep it private.

## Later
Ideas worth keeping, not yet agreed.
- Hook up the rahulll.com domain (deferred by Rahul's choice; the `CNAME` file is unused until then).
- Faster mobile first load (Lighthouse 85 on mobile after PR #22).
- Keyboard start point: a skip link so the first Tab lands on the top bar.
- Link preview and resume PDF colours follow the default preset, Rahul's rice.
- Tidy the old site's unused files in `assets/`.
- Question for Rahul: should light mode follow the visitor's system, or stay dark with Rahul's rice?

## Done recently
- 2026-11-07: `CLAUDE.md` rewritten in six sections, and Vercel previews skip docs-only pushes (PR #25).
- 2026-11-02: values written by hand in the code are now derived from content (PR #24).
- 2026-11-01: smoother boot intro on phones (PR #23).
- 2026-10-31: draggable phone rail, light-mode glass fix, and mobile Lighthouse 52 to 85 (PR #22).
- 2026-10-31: three workspaces, Hello, Engineering, and Off the clock (PR #18).

## Decisions
- 2026-10-30: the Noctalia desk direction, with every page a window and every section a workspace.
- 2026-10-30: desktop and content first, phone layout after.
- 2026-10-31: three workspaces, since four felt thin.
- 2026-11-07: only docs, not content Markdown, skip Vercel previews, so new projects and prints still get a preview.
