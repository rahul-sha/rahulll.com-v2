# rahulll.com

Rahul Sharma's portfolio, built as a small desktop: a Noctalia-style shell on a niri-like scrolling window manager. Every page is a window, every section is a workspace, and the whole thing is plain HTML, CSS, and JavaScript with one small build step that turns Markdown content into the data the site reads.

Live site: https://rahulllcom-v2.vercel.app
Live mockup of the design: https://claude.ai/artifact/XnEaQfCCDmAvqNpVYd6d9m
Design system: https://claude.ai/artifact/5YqBNXspb4y2adDMXKdqMS

## Tech stack

<table>
  <tr>
    <th width="130">Back-end</th>
    <th width="150">Front-end</th>
    <th width="130">Data</th>
    <th width="130">Hosting</th>
    <th width="130">Other</th>
  </tr>
  <tr>
    <td align="center">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/nodejs/nodejs-original.svg" height="36" alt="Node.js" title="Node.js">
    </td>
    <td align="center">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/html5/html5-original.svg" height="36" alt="HTML" title="HTML">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/css3/css3-original.svg" height="36" alt="CSS" title="CSS">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/javascript/javascript-original.svg" height="36" alt="JavaScript" title="JavaScript">
    </td>
    <td align="center">
      <img src="https://cdn.simpleicons.org/markdown/000/fff" height="36" alt="Markdown" title="Markdown">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/yaml/yaml-original.svg" height="36" alt="YAML" title="YAML">
    </td>
    <td align="center">
      <img src="https://cdn.simpleicons.org/vercel/000/fff" height="36" alt="Vercel" title="Vercel">
    </td>
    <td align="center">
      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/githubactions/githubactions-original.svg" height="36" alt="GitHub Actions" title="GitHub Actions">
      <img src="https://cdn.simpleicons.org/sharp" height="36" alt="sharp" title="sharp">
    </td>
  </tr>
  <tr>
    <td align="center" valign="top"><sub>Node.js 22<br>Build script<br>Weather function</sub></td>
    <td align="center" valign="top"><sub>HTML<br>Hand-written CSS<br>Plain JavaScript<br>No framework<br>Self-hosted fonts</sub></td>
    <td align="center" valign="top"><sub>Markdown content<br>YAML headers<br>(marked, js-yaml)</sub></td>
    <td align="center" valign="top"><sub>Vercel<br>Static site + one function</sub></td>
    <td align="center" valign="top"><sub>GitHub Actions build check<br>sharp (WebP images)<br>PDFKit (resume PDF)<br>Open-Meteo weather</sub></td>
  </tr>
</table>

## How the repo is laid out

```
content/        Everything you edit. Markdown files with a short header, images beside them.
  projects/     One folder per project (index.md + hero image). Copy _template.md to start.
  prints/       One folder per 3D print (index.md + render + photos).
  sites/        One .md per live site, shown as tiles on the Off the clock hub.
  about/        index.md (name, role, headline, links) + portrait.
  resume.md     Jobs, study, tools. The build also makes the PDF from it.
  skills.md, homelab.md, home/index.md, gaming.md (Steam link and showcase), prints.md (MakerWorld link and note)
site/           The desk itself: engine (windows, workspaces, overview), shell, styles.
build/build.js  Reads content/, resizes images to WebP, writes dist/.
build/ignore-build.sh  Tells Vercel to skip preview builds that change only docs.
api/weather.js  The one server function: the visitor's town and weather, cached 15 minutes.
vercel.json     Security headers and build settings for Vercel.
docs/           The roadmap and the design system (notes for Claude and for you).
index.html      The page shell.
dist/           Build output (ignored by git). Vercel serves this.
```

## Adding something

1. Copy the `_template.md` in the kind you want (for a project or print, copy it into a new folder and name the file `index.md`).
2. Give the folder a short id in kebab-case, for example `prints/desk-hook/`.
3. Fill in the header fields and write the body in Markdown. Put the render or photo next to it and name it in the header.
4. Commit on a branch (never straight to `main`, which is live) and open a pull request. The build check on the pull request tells you if a field is missing, and Vercel posts a preview link. When you merge into `main`, Vercel builds and deploys it.

To update the resume, edit `content/resume.md`. The PDF on the site is generated from it on every build.

The picture shown when someone shares a link to the site is `content/about/og.jpg`. If you change your name, role, or portrait in `content/about/index.md`, run `npm run og` to redraw it, then commit the new image.

## Running it locally

You need Node 22 or newer.

```
npm install
npm run build
npx serve dist
```

Then open the address `serve` prints. `npm run check` validates the content without building images, which is quicker when you only changed text.

## Checks and deploy

- `npm run check` lists every missing content field. GitHub Actions runs the full build on every pull request and on every push to `main`.
- There is no test runner yet (`npm test` is the unused npm default). Changes are checked in a browser at desktop and phone sizes, in light and dark.
- Merging to `main` puts the change live within minutes. Each pull request gets its own preview link first.

## Where things are written down

- `CLAUDE.md`: how the project works, for Claude.
- `.claude/rules/project-rules.md`: rules for this site only, on top of the shared Cartographer rules.
- `docs/roadmap.md`: what is next.
- `docs/design-system.md`: the look, kept in step with the [design system doc](https://claude.ai/artifact/5YqBNXspb4y2adDMXKdqMS).
- Bugs and feedback: the [tracker](https://claude.ai/artifact/KwDVECNhoHBfrKq3VZ3JaR).

## Keyboard

The desk has shortcuts: `?` shows them all. `1` to `3` jump between workspaces, `H` and `L` move between windows, `Space` opens the launcher, `S` opens Appearance.
