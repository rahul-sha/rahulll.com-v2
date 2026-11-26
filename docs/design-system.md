# rahulll.com design system

Made from: 2026-11-26, commit 629a656 plus pull request 36

Version 2.3, 26 November 2026. Copied into the repo on 16 November 2026 from the [design system Claude Doc](https://claude.ai/artifact/5YqBNXspb4y2adDMXKdqMS). This file is now the copy Claude reads; when the design changes, update it, the Claude Doc, and the Trilium page in step.

## Purpose and scope

This is the standard for rahulll.com as a desktop. Version 2, of 30 October 2026, describes the live site at [rahulllcom-v2.vercel.app](https://rahulllcom-v2.vercel.app) as it stands after pull request 12; the Noctalia desk mockup (version 16) was the starting point, and where the two differ, the live site and this doc win. Anything built for the site follows the tokens, components, and rules below. It covers the shell (bar, dock, overview, menus), the windows and their content patterns, motion, the content model, and how new content gets onto the site without touching code.

It does not cover the four live sites that open inside the Off the clock workspace; they keep their own designs and are only framed here.

## Since version 2

Version 2.3, 26 November 2026: the About window ends with a revision block, like the one on an engineering drawing: "Rev" over the site version from `package.json`, and "Updated" over the date of the last commit. It sits bottom right on desktop and bottom left on phones, so the rail never covers it. Every pull request that changes what visitors see raises the version: last number for a fix, middle for a feature, first for a redesign.

Version 2.2, 23 November 2026: light mode in Rahul's rice reaches 4.5:1 contrast. Text on a solid accent is dark (#1e2326) instead of cream, and the muted text and the four ink accents are a step darker. On phones, window buttons, rail buttons, workspace icons, chips, and the About links have a tap area at least 44 px tall; icons and text keep their size.

Version 2.1, 16 November 2026: three later pull requests change what this doc describes, and the sections below are updated to match. The site looks the same.

| PR | Change | Where it shows in this doc |
| --- | --- | --- |
| 27 | Figtree, JetBrains Mono, and Instrument Serif are hosted with the site (four woff2 files in site/, Figtree preloaded), so no request goes to Google; the security policy allows fonts and styles from the site only, and the font files are cached for a day | Type |
| 24 | Values written by hand in the code moved into the content: start_open on projects, heading on Smart home and Homelab, cad in prints.md, and short on sites; the dock groups come from the workspace list, hub tiles take the accent of the window they open, the printer name and the guide counts are worked out from the content, and the build rejects an accent other than a1 to a4 | Content model |
| 23 | The boot intro waits, with the windows painted but invisible, until the overview's pictures are decoded, the fonts are in, and a few frames run smoothly, so the drop-in only moves finished layers; the wallpaper keeps moving | Motion |

## What changed in version 2

Everything below landed on 30 and 31 October 2026, in pull requests 5 to 22, newest first.

| PR | Change | Where it shows in this doc |
| --- | --- | --- |
| 22 | The phone rail drags by a six-dot grip and snaps to the bottom, middle, or top, with the spot remembered and a one-time nudge after the intro; the intro says three workspaces; light mode draws wallpapers with the ink accents and runs the glass at 86 percent of the chosen opacity so windows show as much wallpaper as in dark; project clips load and play only when on screen, media slots use the 560 px copies, and clips, scripts, and styles get cache headers (mobile Lighthouse 52 to 85) | Shell, Tokens, Content patterns, Decisions |
| 21 | The edge rest counts only in the middle three fifths of the screen height and never over a title bar, so reaching for a close button does not scroll the desk; the edge glow is shortened to match with a fade at each end | Shell, Motion |
| 20 | The edge glow and edge rest cover the outer 5 percent of the screen instead of a tenth; Engineering opens Projects, Cirrus Vision Jet, then the HVAC flagship; project and print windows show one word in the dock from a short field in their Markdown; a click on a picture in a project or print opens a floating viewer window in the site's own chrome | Shell, Window components, Motion, Content model |
| 19 | The five HVAC fragments became one Simulate flagship told across seven steps with 30 views from the old site; Mini-IR, From CAD to the machine, and a new desk-mount project filled from the same archive; a project window prints nothing for an empty field and takes its Tools from a per-project list; prints take a caption; The Aperture, aanchalll.com, and 3D prints open a third wide | Content model, Window components |
| 18 | Four workspaces became three (Shipped folded into Off the clock as a bento hub), the Work highlight went, the Cirrus Vision Jet page was filled with looping clips, and every window opens a third wide | Shell, Content model, Decisions |
| 17 | The bar's Zoom out button is called Overview again and shows only its icon, a square the same size as the other bar icons; the columns still fold into a grid on hover | Shell, Radius |
| 16 | The clock defaults to AM and PM with a 24-hour switch in Appearance; the visualiser spans the whole sound and rests in a low wave; every bar item shares one height and the corner radius; live weather for the visitor's town; rahul@portfolio; Overview pinned first in the dock on desktop; Appearance opens as a pinned panel on the right | Shell |
| 15 | The phone rail rounds like the dock, and the bar's buttons, pills, clock, and chip follow the Appearance corner radius instead of fixed pixels | Shell |
| 14 | On phones the top bar became a thumb rail at the bottom right, above the dock, and the clock is hidden; the control centre opens beside the rail | Breakpoints, Shell |
| 12 | Rahul's rice (Everforest dark on the Aurora wallpaper) became the default look; the overview button became Zoom out; resting the mouse at a screen edge steps between windows with an accent glow; the chosen Interface scale is highlighted | Colour tokens, Shell, Motion |
| 11 | The dock follows the Appearance corner radius and the bar's floating or attached setting | Shell |
| 10 | Window blur fixed after the shadow change; the pinned Guide keeps its blur | Colour tokens (translucency) |
| 9 | Drag from the desktop or a title bar (or press and hold inside a window) to slide between windows; screenshots of the live sites, loaded on click and unloaded on focus loss; Grid Walk and Chop Shop stacked in one 1/3 column; windows opened from other windows get a dock button | Shell, Window components, Motion |
| 8 | Real Home Assistant dashboards as screenshots in Smart home; scrolling past the last window moves on to the next workspace | Content patterns, Motion |
| 7 | Buttons in floating windows work; each workspace has an icon and its own accent in the bar | Shell |
| 6 | Windows stay hidden until the intro starts; Shipped can load the live sites | Motion |
| 5 | Phone layout fixed (the page now declares a viewport) and the other audit findings | Breakpoints |

## Colour tokens

Every colour in the interface comes from sixteen named tokens, so a scheme is a list of sixteen values and nothing else changes. The default is Everforest in dark mode, part of Rahul's rice; the visitor can switch scheme and mode in Appearance (S), and the choice is kept in their browser.

| Token | Role | Everforest dark (default) | Everforest light |
| --- | --- | --- | --- |
| --bg | Page and wallpaper base | #232a2e | #efebd4 |
| --surf | Window and bar surface | #2d353b | #fdf6e3 |
| --surf2 | Cards, chips, facts rows, the Overview button | #343f44 | #f4f0d9 |
| --line | Borders and dividers | #475258 | #e0dcc7 |
| --fg | Body text | #d3c6aa | #5c6a72 |
| --mute | Secondary text, kickers | #9da9a0 | #5f6d63 |
| --a1 | Accent 1, Make (yellow); Hello workspace | #dbbc7f | #dfa000 |
| --a2 | Accent 2, Design and focus (blue); Engineering workspace | #7fbbb3 | #3a94c5 |
| --a3 | Accent 3, Simulate (green) | #a7c080 | #8da101 |
| --a4 | Accent 4, Test and danger (red); Off the clock workspace | #e67e80 | #f85552 |
| --a1-ink to --a4-ink | The same accents at a contrast that reads as text | same as accents | #8a6200, #2a6f95, #5f6d00, #c03532 |
| --on-a | Text placed on a solid accent | #232a2e | #1e2326 |
| --ring | Focus ring of the active window | var(--a2) at 1 px | var(--a2) at 1 px |

Rules

- Accents carry meaning: a1 Make, a2 Design, a3 Simulate, a4 Test. A window, card, or tile takes the accent of its stage through --accent and --accent-ink, never a hard-coded colour.
- The three workspaces borrow accents (Hello a1, Engineering a2, Off the clock a4) for their bar icon and pill.
- Text on a surface uses --fg or --mute; coloured text uses an -ink token, never a bare accent, so light mode stays readable.
- Translucency is a token too: windows are --surf at --win-op (default 59%) over a --blur (default 25 px) backdrop; the bar and dock use --bar-op (default 46%). In light mode both opacities run at 86 percent of the chosen value, because cream surfaces hide a pale wallpaper sooner than dark ones do. Shadows sit on their own layer so they never break the blur.
- --ring names an accent rather than a hex (Appearance offers a1 to a4) at --ring-w (default 1 px).
- Six further schemes ship: Noctalia, Catppuccin, Rosé Pine, Gruvbox, Tokyo Night, and one sampled from an uploaded wallpaper. Each is only a sixteen-value list, which is the test for any new scheme.
- Light mode is a full set of sixteen, not a tint of dark; every component is checked in both. Animated wallpapers in light mode are painted with the -ink accents and a lighter wash, so the waves read through the clearer glass.

Presets

A preset is a whole look: scheme, wallpaper, glass, shape, ring, motion, and open effect. P steps through them; layout choices (scale, dock, labels, intro) are kept when a preset changes.

| Preset | Scheme and wallpaper | Character |
| --- | --- | --- |
| Rahul's rice (default) | Everforest dark on animated Aurora | Blur 25, windows 59%, bar 46%, radius 8, gap 10, ring a2 1 px, Smooth, Unfold |
| Noctalia | Noctalia, follows the system mode, on Volute | Radius 18, gap 16, solid windows, Zoom |
| Frosted glass | Catppuccin on Aurora | Heavy blur 30, radius 24, Springy |
| Rosé dusk | Rosé Pine on Dunes | Radius 16, ring a4, Slide up |
| Gruvbox brutal | Gruvbox on a plain wallpaper | No blur, radius 2, ring a1 3 px, attached bar, Snappy |
| Shop floor | Everforest on Waterline | Radius 10, ring a3, Unfold |
| Tokyo neon | Tokyo Night on Bokeh | Radius 18, ring 3 px, Springy, Drop in, dock auto-hides |

The default preset is Rahul's own; changing it is his call.

## Type, spacing, and scale

One UI face, one mono face, and a short scale of sizes; everything else is weight.

| Token or role | Value |
| --- | --- |
| --ui | Figtree, falling back to Segoe UI and system sans; weights 400, 500, 600, 800, 900; one variable font file hosted with the site since PR 27 |
| --mono | JetBrains Mono 400 and 600, for keys, facts, settings, and the steps numbering; hosted with the site since PR 27 |
| Body | 15 px / 1.55 line height |
| Window heading h2 | clamp(22 px, 2.4 vw, 30 px), weight 900 |
| Lede | 17 px |
| Kicker | 12 px, weight 800, letter-spacing .08 em, uppercase, in the window's -ink accent |
| Title bar, pills, dock labels | 12.5 to 13 px, weight 600 to 700 |
| Section heading h3 inside a window | 13 px, weight 800, uppercase, --mute |
| Overview workspace label | 48 px, weight 900 |
| --r | Corner radius, default 8 px in Rahul's rice (presets run from 2 to 24 px); every bar item is 34 px tall at 0.6 r; buttons, chips, list items, and the music widget 0.6 r; small tags 0.4 r; cards 0.8 r; menus 0.75 r; the bar 0.85 r. Only the Shipped site stand-ins and the portrait keep their own shapes. The dock follows the same radius. |
| --gap | Gap between tiled columns, default 10 px |
| Window body padding | 4 px top, 22 px sides and bottom |
| Bar | 34 px icon buttons, 30 px workspace pills with a 24 px icon tile, 10 px margin from the screen edge |
| Dock | 48 px icons with 15 px radius, 8 px padding; its own corners follow --r and it sits flush when the bar is attached |
| --zoom | Interface scale: Small 75%, Compact 85% (default), Cosy 100% on desktop and tablet; always 100% on phones. The chosen option is highlighted in Appearance. |

Instrument Serif appears only inside The Aperture's stand-in preview, because stand-ins keep each site's own look. All three faces are hosted with the site; nothing loads from Google Fonts.

Breakpoints

- Up to 700 px wide is a phone: one column at a time, swipe between windows, scale 100%, the bar becomes a vertical rail floating at the bottom right above the dock (icons only, no clock), guide docked to the bottom edge and narrowed to clear the rail, Overview button hidden. Tap areas are at least 44 px tall: rail buttons and workspace icons 44 by 44 px, window buttons 36 by 44 px, chips and About links 44 px tall.
- Up to 1180 px wide is a tablet: dock labels move under their icons, windows keep their tiled widths.
- Above that is a desktop at 85% scale, which is what makes the screen feel bigger than it is.
- The page declares a viewport, charset, and language, so phones get the phone layout rather than a shrunken desktop.

## Shell components

The shell is the part that never changes between pages: it frames every window the same way, so a visitor learns it once.

| Component | What it is | Rules |
| --- | --- | --- |
| Bar | Floating strip at the top: launcher button, Overview button, workspace switcher, clock in the middle, music with a small visualiser, weather where the visitor is, appearance, shortcuts, control centre, light or dark on the right | Floating by default, can be attached in Appearance. The clock shows 12-hour time with AM and PM by default, because a browser cannot see the computer's 12 or 24-hour setting; Appearance, Layout, Clock switches it to 24-hour. The weather chip shows the visitor's town and temperature from api/weather.js (Vercel's approximate location and Open-Meteo, no permission pop-up). No window title in the bar. On phones it becomes a thumb rail on the right, just above the dock: a six-dot grip, launcher, workspace icons (the current one filled in its accent), control centre, and theme toggle. No clock on phones; the control centre opens beside the rail. Dragging the grip moves the rail, and it snaps to the bottom, the middle, or the top (just under the first title bar, so the close button stays reachable); the spot is remembered, a double tap on the grip returns it to the bottom, and the rail nudges once after the first intro to show it moves. With the rail away from the bottom the control centre and hello strip take the full width. |
| Overview button | An icon-only square on --surf2, the same size as the other bar icons, with three columns that fold into a grid of tiles on hover | Opens the overview (O) and fills in while the overview is open. Hidden on phones. |
| Workspace switcher | Three pills, each an icon tile plus name: a person for Hello, a gear for Engineering, a coffee cup for Off the clock | Each pill takes its workspace accent (Hello a1, Engineering a2, Off the clock a4); the current one is filled with a solid icon tile. Click or scroll to switch. A fourth workspace is a design decision, not a content edit. |
| Dock | Floating at the bottom: Overview pinned first on desktop (it does what the bar's Overview button does), then only the current workspace's apps, plus Contact and Style. Style opens Appearance as a pinned panel on the right, 400 px wide and full height | Icons 48 px with labels; a dot marks a running app. A window opened from another window (a project, a print) gets its own dock button while it is open, labelled with one word: the short field in its Markdown, or the first word of its title. Its corners follow --r, and it attaches to the screen edge when the bar does. Scrolling over it steps through the windows. Right-click opens, closes, and toggles labels or auto-hide. Hidden in the overview. |
| Overview | All workspaces as a vertical stack at about a third scale, two and a half visible, with no tint over them | O, the Overview button in the bar or the dock, or the bar. Scroll on the sides to move between workspaces, over a workspace to slide its windows. Click a window to focus it, click empty space to land on the scrolled-to workspace. The intro plays here. |
| Launcher | D or Space, a search box over every app, project, site, and preset | At most eight results, arrow keys and Enter. Anything that can be opened must be findable here. |
| Control centre | N or the clock: night light, do not disturb, guide, intro replay, music with its visualiser, calendar, and the weather card (sky and the next 12 hours). The header reads rahul@portfolio | A panel under the bar, 380 px, closes on outside click. |
| Context menu | Right-click anywhere | Windows: width, maximise, fullscreen, float, centre, move, move to workspace, close. Dock: open, close, labels, auto-hide. Desktop: launcher, overview, wallpaper, preset, appearance, light or dark, control centre, shortcuts, guide, session. Escape and arrows work. |
| Edge glow | A soft wash of --a2 over the outer 5 percent of the screen at the left or right, spanning only the middle three fifths of the height with a soft fade at each end (full height and a tenth wide until PRs 20 and 21), with a 3 px bar that fills while it waits | Shows while the mouse rests at an edge and the desk is about to step; never shown on phones, in the overview, or over floating windows. |
| Toasts | Title plus one line, top right, 3.6 s | Suppressed by do not disturb except for the do not disturb message itself. Used for eggs and confirmations, never for errors a visitor must act on. |
| Guide | A pinned floating window of hints, one per app or window kind, plus a set of rotating tips (13 at present, counted from the content) | On by default, G hides it, the choice is kept. Keeps its blur over the whole window. On phones it docks to the bottom at 150 px tall, 54 px narrower than the screen so the rail stays clear. |
| Shortcuts overlay | The ? key, a dialog listing every key | Every new action gets a key and a line here. |
| Session menu | E: lock, suspend, reboot, shut down | Jokes only; nothing destructive. |

## Window components

Every page is a window, and every window is built from the same chrome and the same handful of content patterns, which is what keeps a new page from looking new.

Chrome

- Title bar: icon, title, then width badge (1/3, 1/2, 2/3), maximise, fullscreen, pin, float, close. The focused window shows a --ring outline of --ring-w.
- Tiled windows live in a horizontal strip per workspace at one of three widths; a window declares its default width, and since 31 Oct 2026 every window opens at 1/3 at Rahul's ask, with 1/2 and 2/3 kept for later. Maximise fills the screen, fullscreen leaves the strip and sits inside a bezel.
- Two windows can share one column, stacked: a site declares `under` and sits below the one it names. Grid Walk and Chop Shop share a 1/3 column this way.
- Floating windows (Guide, music player, the picture viewer) sit above the strip, can be dragged by the title bar, and can be pinned so they follow every workspace. Their buttons work like any other window's. The viewer opens centred and sized to its picture (clear of the rail on phones), with the caption and a Full size link in a strip under it.
- Window shadows fall under the dock rather than being clipped by it.
- Site windows frame a live site with a browser-style bar (back, forward, reload, address) and no body padding.

Content patterns, in the order they appear in a detail window

| Pattern | Markup | Used by |
| --- | --- | --- |
| Kicker | 12 px uppercase line in the window's -ink accent, such as Design it · Flagship | Every window |
| Headline h2 plus lede | Headline weight 900, lede 17 px | Every window |
| Figure | Full-width image with a 14 px radius and a one-line caption; since PR 19 an empty caption, outcome, step list, or result prints nothing | Project, print |
| Facts row | dl.facts: label over value, three to six cells on --surf2 | Project (year, role, team, tools), print (printer, material, layer, infill, supports, time) |
| Steps | ol.steps: numbered chips with the number in mono and accent | Project "What I did", print "Design notes" |
| Media slots | ul.p-media: dashed tiles with an icon, label, and "to come" line until a file replaces them; a filled picture shows its 560 px copy and opens the full size in the viewer on click; a clip has no source until its slot scrolls into view, loops there, and pauses when its workspace scrolls away | Project "More views", print "In use" |
| Related | p.rel: a label and a row of buttons that open other windows | Project, print |
| Grid tiles | p-tile and pr-card: image, category, title; clicking opens a detail window beside the list | Projects, 3D prints, Shipped |
| Revision block | p.about-rev: two cells, Rev in the a1 ink and Updated, 12 px on a 1.5 px hairline border; text only, no link | About |
| Timeline | ol.r-tl: date in mono, role, place, one line | Resume |
| Site screenshot | A screenshot or short clip of the live site with a "Load the live site" button; the real site loads in a frame only after the click and unloads when the window loses focus. A site that refuses framing opens in a new tab; one with no screenshot shows its drawn stand-in. | Shipped |
| Dashboard tabs | ha-tabs: tabs styled like Home Assistant tiles over a screenshot of that dashboard, which opens full size in a new tab; a dashboard with no image shows as "Coming soon" | Smart home |

Rules

- A list window opens its items as new windows in the same workspace, to the right of itself; it never navigates away.
- Every detail window ends with Related so there is always a next click.
- Placeholders are written in square brackets so they are easy to find; a field that is empty is left out of the live page.
- Images are converted at build time to WebP of at most 1200 px on the long edge, with a smaller copy for tiles and cards.
- Live sites and live data never load until the visitor asks: screenshots first, frames on click.

## Motion and interaction

Motion is one duration and one easing, set once and inherited everywhere, so changing the feel is a single setting.

| Setting | Options | Default |
| --- | --- | --- |
| Motion (--dur, --ease) | Snappy .22 s, Smooth .45 s, Springy .65 s with overshoot, Slow 1.1 s, Off | Smooth |
| Window open effect | Zoom, Slide up, Drop in, Unfold, None | Unfold |
| Animated wallpaper | On or off; Aurora drifts slowly | On |
| Reduced motion | Follows the system setting: no intro, no animated wallpaper, instant open and close, edge glow without its fill animation | Automatic |
| Intro | Windows stay hidden until it starts and wait, painted but invisible, until the pictures are decoded, the fonts are in, and a few frames run smoothly, then drop into the overview, then the camera flies into Hello; any key, click, or scroll skips it | On |

Input rules

- Keyboard: H and L or the arrows move between windows, J and K between workspaces, numbers jump to a workspace, R cycles width, F maximises, Q closes, O overview, D launcher, S appearance, P next preset, W next wallpaper, N control centre, G guide, M music, E session, ? shortcuts. Every key also works with Alt held, which is how it works inside a text box.
- Wheel: over the strip it moves between windows (vertical wheel included, except inside a scrolling body, where Shift makes it horizontal); over the workspace pills or the dock it does the same; in the overview it slides windows when over a workspace and switches workspaces elsewhere.
- Past the end: at the last window, one more scroll gives a small bump, and a second within two seconds carries on into the next workspace (the first window of it). Swiping past the end on a phone does the same.
- Drag: press and drag on the desktop or a title bar to slide the strip, like a swipe. Inside a window, press and hold still for about a quarter of a second first, so selecting text and clicking still work.
- Edge rest: resting the mouse in the outer 5 percent of the screen at the left or right, within the middle three fifths of the height and never over a window's title bar, focuses the next window that way after 350 ms, then keeps stepping every 750 ms while it stays there, with the edge glow showing the wait. The top and bottom fifths and title bars are left out so reaching for a close button does not scroll the desk.
- Touch: swipe left and right between windows, up and down between workspaces; the guide and dock shrink to fit.
- Right-click: the context menu, never the browser's.
- Nothing is destructive: close only hides a window, and the dock or launcher brings it back with its state.

## Content model

The site has eight kinds of content, and each kind is a list of items with a fixed set of fields; a window is only a renderer for one kind. Adding content means adding an item, never a page.

| Kind | Lives in | Fields each item carries | Becomes |
| --- | --- | --- | --- |
| Project | Engineering | id, stage (design, simulate, make, test), title, short (one word for the dock), image, caption, summary, steps, outcome, year, role, team, result, tools (optional, falls back to the stage tools), media (section or video slots), flagship yes or no, start_open (true opens it on Engineering at the start, in order), order | A tile in Projects and its own detail window |
| Print | Off the clock | id, title, short (one word for the dock), render image, caption (optional), printer, material, why, story, notes, settings (layer, infill, supports, time), MakerWorld link or private, photos in use | A card in 3D prints and its own detail window |
| Site | Off the clock | id, title, host, tag, accent, blurb, stats, stack, private, shot (screenshot), video, embed yes or no, width (1/3, 1/2, 2/3), under (stack below another site), order | A tile on the Off the clock hub and a browser window with the screenshot, then the live site on click |
| Resume | Hello | jobs (dates, role, place, one line), study (same), PDF | The Resume window and the download |
| Skills | Hello | per stage: tools and the project ids that prove them; beyond engineering: name, line, link target | The Skills window; the proof chips open projects |
| Homelab | Off the clock | heading (the window title line, also on its hub tile), services (name, line, accent), devices (name, line) | The Homelab window |
| Smart home | Off the clock | heading (the window title line, also on its hub tile), dashboards (name, line, image, alt), one intro line | The Smart home window with a tab per dashboard |

Smaller lists follow the same idea: games (now, all-time, kit), contact links, and the guide hints keyed by window kind.

Rules

- Each item has a stable id in kebab case; the id names its window and its folder, and never changes once published. Its dock label is one word, the short field, or the first word of the title.
- Images sit beside their item and are referenced by file name, not by a key in a code file.
- A field that is empty is left out of the page, never shown as a bracket, on the live site.
- Screenshots of private things (the Away tile on the rooms dashboard, for example) are blurred before they are committed.
- A new kind of content means a new renderer and a new row in this table; that is a design task, not a content edit.

## Repo structure and adding content

Content lives in folders of Markdown files, one item per folder with its images beside it, and a small build step turns them into the one data file the site reads. The site itself stays plain HTML, CSS, and JavaScript with no framework and no server.

The pipeline has four steps: Markdown in `content/`, then `npm run build`, then `dist/`, then Vercel.

A GitHub Action (Build check) runs the same build on every pull request and on main, so a missing field fails the check before it reaches the site. Vercel builds and deploys main on every merge.

Folders

```text
rahulll.com-v2/
  index.html       the page shell, workspace and dock layout, app list
  site/            engine.js and engine.css (window manager), desk.js and desk.css (shell),
                   render.js, apps.js, sites.js (windows), rice.js (Appearance), data.js (stages)
  content/
    about/         index.md, portrait.jpg, og.jpg (link preview, redrawn by npm run og)
    projects/      _template.md, then one folder per project: index.md + hero image
    prints/        _template.md, then one folder per print: index.md + render.png
    sites/         _template.md, one .md per live site, screenshots in a folder of the same name
    home/          index.md (dashboards) + rooms.jpg, printer.jpg
    resume.md      jobs and study as lists; the PDF is generated from it
    skills.md, homelab.md, gaming.md
  api/
    weather.js     Vercel function: visitor's approximate place to an Open-Meteo reading
  build/
    build.js       reads content/, writes dist/site/content.js, WebP images, resume.pdf
  .github/workflows/build.yml   the Build check
  vercel.json      build command, dist/ output, security headers
```

A print's `index.md`

```markdown
---
title: Belkin charging stand tray
printer: Bambu Lab A1
material: PLA
layer: 0.2 mm
infill: 15%
supports: none
time: 4h 10m
makerworld:            # leave empty for a private design
image: render.png
photos: [in-use.jpg]
why: A tray around the Belkin charger with a well for the puck, two pockets, and a cable sleeve.
---
Where the Belkin stand lives and what kept ending up around it.

## Design notes
1. A round well sized to the charger base, with a notch for its cable
2. A long pocket for glasses and a short one for keys
```

Day to day

1. Copy `_template.md` into a new folder named after the item, such as `content/prints/watch-dock/`.
2. Fill in the header and the notes, drop the render and photos beside it.
3. Commit and push, from a laptop, the GitHub website, or the GitHub app on a phone.
4. Vercel runs `build.js`, resizes images to WebP at 1200 px, writes `content.js`, and deploys. The new card and its window appear with no change to any code file.

Editing the resume is the same: change `resume.md`, and both the Resume window and the PDF update.

Later, if typing front matter gets old, a Git-based CMS such as Decap CMS or Pages CMS can sit at `/admin` and write exactly these files from a form; nothing about the structure changes.

## Rules of thumb and open questions

Rules of thumb

- Colourful, dynamic, and fun, but professional: colour comes from the four stage accents and the wallpaper, never from decoration added to a page.
- Check every change on desktop, phone, light, and dark before it is called done.
- UK English, Oxford comma, no emoji, and placeholders in square brackets until the real words exist.
- One engine: the window manager, the Appearance system, and the shell are shared code; a page only supplies a renderer and data.
- Anything a visitor can open must be reachable three ways: the dock, the launcher, and a keyboard shortcut or a click from another window.
- Secrets stay out of the repo: Smart home shows dashboard screenshots, and if live values come later they arrive through a small proxy, never with a token in the page.

Open questions

- [ ] Which host builds the site: Vercel from the repo, as the other sites do, or GitHub Pages? \
Vercel at the moment makes sense.
- [ ] Does the PDF resume come from `resume.md` by the Action, or stay a file Rahul uploads?\
I reckon resume.md is a better way.
- [ ] Should the four live sites allow framing by rahulll.com, or open in a new tab from the Shipped window?\
I am not sure, I'd prefer a performant way of doing them. Like, clicking on them enables the website. But down the line if it's too costly, we can switch to opening in a new tab.
- [ ] Is a fifth workspace wanted later, for example Writing, or do new kinds of content fit the existing four? No, I think 4 is more than enough.
- [ ] Does the Work highlight ship as a video, a redrawn mockup, or both? Can be both.

## Decisions taken on 30 October 2026

The open questions above are settled and the repo is built to them in pull request 4 of rahulll.com-v2.

- Host: Vercel, building with `npm run build` and serving `dist/`.
- Resume: `content/resume.md` is the single source; the build writes `resume.pdf` from it with pdfkit.
- Live sites: framed inside the Shipped windows, but the frame loads only when the visitor clicks. If framing proves costly or a site refuses to be framed, the button opens a new tab instead.
- Workspaces: three since 31 Oct 2026 (Hello, Engineering, Off the clock); Shipped moved into Off the clock at Rahul's ask, sites first.
- Work highlight: removed 31 Oct 2026 at Rahul's ask. The Test projects merged into one, and the Make projects into From CAD to the machine. Off the clock hub, 31 Oct 2026: the Shipped index became a bento board (Hardware tile set: a NAS front panel for Homelab, renders on a build plate for 3D prints, a Steam Deck for Gaming) and only the hub, The Aperture, 3D prints, and Gaming start open; the other tiles open their windows. Widths, 31 Oct 2026: every window opens at 1/3 at Rahul's ask. Project clips loop silently like GIFs, with controls under reduced motion, and load only when their slot is on screen (the 31 Oct audit found all thirteen downloading at start). Phone rail, 31 Oct 2026: draggable by a grip (option A of three mockups), because the rail hid content behind it.
- Content: `content/<kind>/` with a `_template.md` per kind; a GitHub Action runs the build as a check on every pull request. A Git-based CMS can be added later without changing the layout.

Later the same day, in pull requests 5 to 12:

- Default look: Rahul's rice, Everforest dark on the animated Aurora wallpaper, replaces Tokyo Night. The other looks stay as presets.
- Live sites: the Off the clock hub shows a tile for each site, and its window shows a screenshot first; the real site loads in a frame on click and unloads when its window loses focus.
- Smart home: the window shows screenshots of the real Home Assistant dashboards instead of sample tiles.
- Navigation: drag, edge rest, and scrolling past the last window are all ways to move, alongside the keyboard and wheel; the overview button was called Zoom out for a while and has been Overview again since PR 17.
