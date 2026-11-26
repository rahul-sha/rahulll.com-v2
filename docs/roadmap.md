# Roadmap: rahulll.com

- **Updated:** 2026-11-26

Bugs and smaller fixes live in the [bug and feedback tracker](https://claude.ai/artifact/KwDVECNhoHBfrKq3VZ3JaR). This page holds the bigger pieces of work and the order they come in.

## Now
Being built this week or next. At most three items.
- Fill in the missing Hello and Resume facts (email address, "Open to" line, internship line): they are the first things a visitor reads. Waiting on Rahul for the wording.
- Years and results for the three projects still missing them: a year for From CAD to the machine, and a year and a result for the desk mount and the thermometer. Engineering is the heart of the site.
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
- Faster mobile first load (Lighthouse 85 on mobile after PR #22; fonts are self-hosted since PR #27).
- Keyboard start point: a skip link so the first Tab lands on the top bar.
- Link preview and resume PDF colours follow the default preset, Rahul's rice.
- Tidy the old site's unused files in `assets/`.
- Question for Rahul: should light mode follow the visitor's system, or stay dark with Rahul's rice?

## Done recently
- 2026-11-26: the site version shows in About as a drawing revision block, and `npm run check:version` fails a pull request that changes what visitors see without raising it (PR #36).
- 2026-11-26: Cartographer updated to 0.35.1.
- 2026-11-23: an editor at `/admin` (Sveltia CMS) with a form for every kind of content; a save commits to `main` and the site rebuilds.
- 2026-11-23: bracketed notes are hidden from visitors and listed by `npm test`, the first step of the finish-off plan (admin page next).
- 2026-11-23: full check-up; the docs-only preview skip now compares the whole push, and the design system file, README, and `CLAUDE.md` are brought up to date. Light mode in Rahul's rice reaches 4.5:1 contrast, and phone tap areas are at least 44 px tall.
- 2026-11-20: `npm test` runs the content check, on every pull request too (PR #31).
- 2026-11-20: Cartographer updated to 0.28.2 (PR #30).
- 2026-11-19: Cartographer updated to 0.16.0, and a tech stack panel in the README (PRs #28 and #29).
- 2026-11-16: Cartographer set up, and fonts self-hosted (PRs #26 and #27).
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
