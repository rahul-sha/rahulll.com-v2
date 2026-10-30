# rahulll.com

Rahul Sharma's portfolio, built as a small desktop: a Noctalia-style shell on a niri-like scrolling window manager. Every page is a window, every section is a workspace, and the whole thing is plain HTML, CSS, and JavaScript with one small build step that turns Markdown content into the data the site reads.

Live mockup of the design: https://claude.ai/artifact/XnEaQfCCDmAvqNpVYd6d9m
Design system: https://claude.ai/artifact/5YqBNXspb4y2adDMXKdqMS

## How the repo is laid out

```
content/        Everything you edit. Markdown files with a short header, images beside them.
  projects/     One folder per project (index.md + hero image). Copy _template.md to start.
  prints/       One folder per 3D print (index.md + render + photos).
  sites/        One .md per live site shown in the Shipped workspace.
  about/        index.md (name, role, headline, links) + portrait.
  resume.md     Jobs, study, tools. The build also makes the PDF from it.
  skills.md, homelab.md, home.md, gaming.md, highlight.md
site/           The desk itself: engine (windows, workspaces, overview), shell, styles.
build/build.js  Reads content/, resizes images to WebP, writes dist/.
index.html      The page shell.
dist/           Build output (ignored by git). Vercel serves this.
```

## Adding something

1. Copy the `_template.md` in the kind you want (for a project or print, copy it into a new folder and name the file `index.md`).
2. Give the folder a short id in kebab-case, for example `prints/desk-hook/`.
3. Fill in the header fields and write the body in Markdown. Put the render or photo next to it and name it in the header.
4. Commit and push. The build check on the pull request tells you if a field is missing. When the change lands on `main`, Vercel builds and deploys it.

To update the resume, edit `content/resume.md`. The PDF on the site is generated from it on every build.

## Running it locally

You need Node 22 or newer.

```
npm install
npm run build
npx serve dist
```

Then open the address `serve` prints. `npm run check` validates the content without building images, which is quicker when you only changed text.

## Keyboard

The desk has shortcuts: `?` shows them all. `1` to `4` jump between workspaces, `H` and `L` move between windows, `Space` opens the launcher, `S` opens Appearance.
