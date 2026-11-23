# rahulll.com

## What this project does

Rahul's portfolio as a Noctalia-style desktop on a niri-like scrolling window manager: every page is a window, every section a workspace.
It shows his engineering work (Make, Design, Simulate, Test) and what he does off the clock, live at https://rahulllcom-v2.vercel.app.

## Tech stack

- Plain HTML, CSS, and vanilla JavaScript in `site/`. No framework, no bundler.
- One Node 22 build (`build/build.js`, using marked, js-yaml, sharp, pdfkit) turns `content/` into `dist/`.
- Vercel serves `dist/` and three functions: `api/weather.js` (visitor's town from Vercel's IP headers, reading from Open-Meteo, no key), and `api/auth.js` with `api/callback.js` (GitHub sign-in for the editor).
- The editor at `/admin` is Sveltia CMS, pinned to an exact version and copied from `node_modules` by the build. Its forms come from `admin/config.yml`; a save commits Markdown to `main`.
- GitHub Actions (`.github/workflows/build.yml`) runs the build on every pull request and every push to `main`.

## Run commands

- Start: `npm install`, `npm run build`, then `npx serve dist` and open the address it prints. The weather chip shows "Weather" locally.
- Check: `npm test` (the same as `npm run check`) validates content only, lists every missing field, and fails if any is missing. GitHub runs it on every pull request.
- Test: `npm test` is the content check, the only automated test. Also verify in a browser (Playwright is fine) at 1440, 1024, 390 portrait, and 844 landscape, in light and dark, and with reduced motion turned on, console clean, no horizontal overflow.
- Link preview: `npm run og` redraws `content/about/og.jpg`; run it after changing the About name, role, or portrait, then commit the image.
- Deploy: merge to `main` and Vercel builds production. Each pull request gets a preview link. `build/ignore-build.sh` skips previews when everything pushed changes only Markdown outside `content/` or files in `docs/`; production always builds.

## Where things live

- `content/<kind>/` holds all content, with images beside the Markdown. Copy `_template.md`, never edit it in place.
- `site/main.js` sets the workspaces and dock; `engine.js` and `engine.css` are the window manager (no content here).
- `site/desk.js` and `desk.css` are the shell; `render.js` draws windows from `dist/site/content.js`; `sites.js` is the Off the clock hub; `data.js` and `apps.js` hold shared helpers.
- `site/rice.js` is Appearance. The default preset is "Rahul's rice"; do not change it without asking.
- `build/build.js` is the whole pipeline. A new content kind needs code there and a renderer in `render.js`.
- Trilium (Vibe Coding Projects) keeps copies of the "Build map" and "Design system" pages; sync them with the `trilium-project-docs` skill after a merged change to the build or the design.

## Data and safety

- A merge to `main` is live within minutes. There is no staging site beyond the preview.
- `vercel.json` holds the security headers. A new framed site must be added to `frame-src`, or its window stays blank.
- `render.js` inserts build-made HTML unescaped (`sum`, `story`, `why`, `blurb`, `*_NOTE`, `ME.line`, `ME.voice`). Keep those build-generated; plain strings go through `esc()`.
- No secrets in the repo. The only secrets are `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` for the editor's sign-in, which Rahul keeps in Vercel's environment variables; ask before adding a service that needs another or that bills.
- `/admin` has its own, looser security header in `vercel.json` (it talks to GitHub); the public pages keep the strict one. Do not merge the two.
- A field the build reads must also be listed in `admin/config.yml`, or the editor drops it when that entry is saved.
- The weather function runs per visit; keep its 15 minute cache so calls stay low.

## How to work

- New feature or a change across several files: post a short plan first and wait for Rahul's OK. Small fixes go straight ahead.
- Anything visual: mockups before code, following `docs/design-system.md`.
- After a fix or finding, update the [bug and feedback tracker](https://claude.ai/artifact/KwDVECNhoHBfrKq3VZ3JaR).
- This project uses the Cartographer plugin (switched on in `.claude/settings.json`). Its rules for this site only are in `.claude/rules/project-rules.md`, the bug list is the tracker above, the plan is in `docs/roadmap.md`, and notes on tricky fixes go in `docs/solutions/`.
- Work on a branch with one small pull request per step; never push to `main`, since it is live.
- Before opening a pull request, check no other open one changes the same files, and update `README.md` with any change to `site/`, `build/`, `api/`, or `vercel.json` (or add a `Docs-checked: <reason>` line to the commit): Cartographer's checks stop the pull request otherwise.
- When a pull request is ready, offer Rahul a Merge card; merge only after he taps it, the checks pass, and there are no conflicts.
- Rahul is new to the command line: give steps, name the file, say what to click.

## Conventions and decisions

- Content in one place, code derives the rest (`start_open`, `short`, `heading`, `cad` fields): so Rahul edits Markdown only.
- Three workspaces, Hello, Engineering, Off the clock: four felt thin. Contact and Style float on all of them.
- Off the clock opens on a bento hub with only the hub, The Aperture, 3D prints, and Gaming open: the rest open from tiles to keep start-up light.
- Four accents, one per stage (a1 Make, a2 Design, a3 Simulate, a4 Test), and a window takes its content's accent: colour carries meaning.
- Live sites are framed only after a click: saves load time and third-party requests.
- Desktop interface scale defaults to 85 percent (CSS `zoom` on `#desk`, visitors can pick 75 or 100); phones stay at 100: bigger-screen feel on desktop.
- Colourful, dynamic, fun, still professional; no grid backgrounds, ransom-note lettering, stickers, or generic AI-portfolio look: Rahul rejected those directions.
- Placeholders in square brackets, such as `[photo in use]`: easy to find, and facts are never invented.
- UK English, Oxford comma, no emojis: Rahul's house style.
- The rahulll.com domain is deferred (the `CNAME` file is unused); phone layout follows desktop and content: Rahul's order.
