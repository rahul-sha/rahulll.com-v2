# rahulll.com

Rahul's portfolio as a Noctalia-style desktop on a niri-like scrolling window manager: every page is a window, every section a workspace.
It shows his engineering work (Make, Design, Simulate, Test) and what he does off the clock, live at https://rahulllcom-v2.vercel.app.

## Tech stack

- Plain HTML, CSS, and vanilla JavaScript in `site/`. No framework, no bundler.
- One Node 22 build (`build/build.js`, using marked, js-yaml, sharp, pdfkit) turns `content/` into `dist/`.
- Vercel serves `dist/` and one function, `api/weather.js` (visitor's town from Vercel's IP headers, reading from Open-Meteo, no key).
- GitHub Actions (`.github/workflows/build.yml`) runs the build on every pull request.

## Run commands

- Start: `npm install`, `npm run build`, then `npx serve dist` and open the address it prints. The weather chip shows "Weather" locally.
- Check: `npm run check` validates content only and lists every missing field. `npm test` is the unused npm default and always fails.
- Test: no test runner. Verify in a browser (Playwright is fine) at 1440, 1024, 390 portrait, and 844 landscape, in light and dark, console clean, no horizontal overflow.
- Link preview: `npm run og` redraws `content/about/og.jpg`; run it after changing the About name, role, or portrait, then commit the image.
- Deploy: merge to `main` and Vercel builds production. Each pull request gets a preview link. `build/ignore-build.sh` skips previews that change only Markdown outside `content/` or files in `docs/`; production always builds.

## Data and safety

- A merge to `main` is live within minutes. There is no staging site beyond the preview.
- `vercel.json` holds the security headers. A new framed site must be added to `frame-src`, or its window stays blank.
- `render.js` inserts build-made HTML unescaped (`sum`, `story`, `why`, `blurb`, `*_NOTE`, `ME.line`, `ME.voice`). Keep those build-generated; plain strings go through `esc()`.
- No secrets in the repo. Nothing here needs a key; ask before adding a service that does or that bills.
- The weather function runs per visit; keep its 15 minute cache so calls stay low.

## How to work

- New feature or a change across several files: post a short plan first and wait for Rahul's OK. Small fixes go straight ahead.
- Anything visual: mockups before code, and load the `rahulll-design-rules` skill.
- Before pushing more to a branch, check its PR is still open (Rahul merges quickly); if merged, branch again from `main`. Merge `main` in rather than rebasing, since force-push is blocked.
- After a fix or finding, update the bug tracker doc; after a merged PR that changes the build or design, sync the build map and design system pages in Trilium.
- Rahul is new to the command line: give steps, name the file, say what to click.

## Where things live

- `content/<kind>/` holds all content, with images beside the Markdown. Copy `_template.md`, never edit it in place.
- `site/main.js` sets the workspaces and dock; `engine.js` and `engine.css` are the window manager (no content here).
- `site/desk.js` and `desk.css` are the shell; `render.js` draws windows from `dist/site/content.js`; `sites.js` is the Off the clock hub; `data.js` and `apps.js` hold shared helpers.
- `site/rice.js` is Appearance. The default preset is "Rahul's rice"; do not change it without asking.
- `build/build.js` is the whole pipeline. A new content kind needs code there and a renderer in `render.js`.

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
