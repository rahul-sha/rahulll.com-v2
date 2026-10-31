# rahulll.com

Rahul's portfolio as a Noctalia-style desktop on a niri-like scrolling window manager. Plain HTML, CSS, and vanilla JavaScript. One Node build step turns `content/` into `dist/`. Hosted on Vercel.

## Commands

- `npm run build` reads `content/`, converts images to WebP (max 1200px), writes the resume PDF, and emits `dist/`.
- `npm run og` redraws the link preview image `content/about/og.jpg` from the About name, role, and portrait. Run it after changing those, then commit the image.
- `npm run check` validates content only. Both exit non-zero and list every problem when a required field is missing.
- No test runner. Verify in a browser (Playwright is fine) at 1440, 1024, 390 portrait, and 844 landscape widths, in light and dark, with the console clean and no horizontal overflow.

## Where things live

- `content/<kind>/` is the only place content goes. Each kind has a `_template.md`; copy it, never edit it in place. Images sit beside the Markdown that references them.
- `site/engine.js` and `engine.css` are the window manager (columns, workspaces, overview, floats, launcher). Keep content out of here.
- `site/desk.js` and `desk.css` are the shell: bar, dock, control centre, context menu, guide, music, boot intro.
- `site/render.js` renders each window from the data in `dist/site/content.js`. Fields the build emits as HTML (`sum`, `story`, `why`, `blurb`, `*_NOTE`, `ME.line`, `ME.voice`) are inserted unescaped. Plain strings go through `esc()`.
- `site/rice.js` is the Appearance system. The default preset is "Rahul's rice"; do not change it without asking.
- `api/weather.js` is the only server code: a Vercel function that turns the visitor's approximate place (Vercel's IP headers) into an Open-Meteo reading for the bar chip and control centre. It does not run locally, where the desk shows "Weather --".
- `build/build.js` is the whole pipeline. Add a new content kind there and a renderer in `render.js`.

## Design rules (short form, full rules in the design system doc)

- Colourful, dynamic, fun, still professional. No grid backgrounds, ransom-note lettering, stickers, or the generic AI-portfolio look.
- Four accents, one per engineering stage: a1 Make, a2 Design, a3 Simulate, a4 Test. A window takes the accent of its content.
- Four workspaces only: Hello, Engineering, Shipped, Off the clock. Contact and Style float on every workspace.
- Live sites in Shipped are framed only after the visitor clicks; show the stand-in until then.
- Desktop zooms to 85 percent through CSS `zoom` on `#desk`; phones stay at 100.
- Placeholders are written in square brackets so they are easy to find: `[photo in use]`.
- UK English, no emojis, Oxford comma.

## Working with Rahul

Mockups before code for anything visual. Treat him as new to the command line: give steps, name the file, say what to click. Keep bracketed placeholders where facts are missing rather than inventing them.
