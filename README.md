# rahulll.com

Rahul Sharma's portfolio, built as a small desktop: a Noctalia-style shell on a niri-like scrolling window manager. Every page is a window, every section is a workspace, and the whole thing is plain HTML, CSS, and JavaScript with one small build step that turns Markdown content into the data the site reads.

Live site: https://rahulllcom-v2.vercel.app
First design mockup (30 October 2026, kept for history; the live site has moved on): https://claude.ai/artifact/XnEaQfCCDmAvqNpVYd6d9m
Design system: https://claude.ai/artifact/5YqBNXspb4y2adDMXKdqMS

## What it does

- Three workspaces, Hello, Engineering, and Off the clock, that you scroll, drag, or key between like a tiling desktop.
- Each project and 3D print is a window, drawn from a Markdown file in `content/`.
- Off the clock opens on a hub of tiles; the four live sites show a screenshot first and load only after a click.
- Appearance changes the whole look: presets, light and dark, wallpaper, corner radius, and interface scale.
- The top bar shows live weather for the visitor's town, with no key and no location prompt.
- A resume PDF and a link preview image are made by the build.

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
build/check-version.js  Fails a pull request that changes what visitors see without raising the version (tests in version.test.js).
api/weather.js  The visitor's town and weather, cached 15 minutes.
api/auth.js, api/callback.js  Sign-in for the editor: they pass you to GitHub and back.
admin/          The editor at /admin: its page and config.yml, which lists the forms and their fields.
vercel.json     Security headers and build settings for Vercel.
docs/           The roadmap and the design system (notes for Claude and for you).
index.html      The page shell.
dist/           Build output (ignored by git). Vercel serves this.
```

## Adding or changing something

The quick way is the editor, at `/admin` on the live site (for example `https://rahulllcom-v2.vercel.app/admin`):

1. Open the address and press **Sign In with GitHub**. Only GitHub accounts that can write to this repository can save.
2. Pick **Projects**, **3D prints**, **Shipped sites**, or **Pages** (About and contact, Resume, Skills, Homelab, Smart home, Gaming, and the 3D prints page).
3. Open an entry, or press **New**. Fill in the form and drag pictures onto the image fields.
4. Press **Save**. The editor commits the change to `main`, and Vercel rebuilds the live site in about a minute.

Things to know:

- A save goes live. If a required field is missing, the build fails and the previous version of the site stays up; GitHub emails you about the failed check.
- Every save is a commit, so anything can be undone from the repository's history on GitHub.
- The editor is [Sveltia CMS](https://github.com/sveltia/sveltia-cms), pinned to an exact version in `package.json`. The forms come from `admin/config.yml`. A new field in the build needs a line there too, or the editor would drop it on the next save.
- Sign-in needs two settings in Vercel (Project, Settings, Environment Variables): `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`, from a GitHub OAuth app whose callback address is `https://<the site's address>/api/callback`. They are never stored in this repository. When the site moves to another address, update the OAuth app's two addresses to match.
- The editor works on the production address only, since that is the address GitHub sends you back to.

By hand, without the editor:

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

- `npm test` (the same as `npm run check`) lists every missing content field and fails if any is missing. It also lists the bracketed notes still to be filled in, such as `[h m]`. Those do not fail the check: the build leaves them out, so visitors see a shorter page, never a bracket. GitHub Actions runs it, then the full build, on every pull request and on every push to `main`.
- The site's version number is `"version"` in `package.json`, shown at the bottom of the About window with the date of the last commit. Raise it in every pull request that changes what visitors see: the last number for a fix (1.1.0 to 1.1.1), the middle for a feature (1.1.0 to 1.2.0), the first for a redesign (2.0.0). `npm run check:version` checks this; GitHub runs it on every pull request and fails it when `site/`, `content/`, `index.html`, or `favicon.svg` changed but the number did not go up. Saves from the editor go straight to `main`, so they never need a new number.
- Visual changes are also checked in a browser at desktop and phone sizes, in light and dark.
- A save from the editor at `/admin` is a push to `main`, so the same check and build run on it.
- Merging to `main` puts the change live within minutes. Each pull request gets its own preview link first.

## Where things are written down

- `CLAUDE.md`: how the project works, for Claude.
- `.claude/rules/project-rules.md`: rules for this site only, on top of the shared Cartographer rules.
- `docs/roadmap.md`: what is next.
- `docs/design-system.md`: the look, kept in step with the [design system doc](https://claude.ai/artifact/5YqBNXspb4y2adDMXKdqMS).
- Trilium, under Vibe Coding Projects: copies of the "Build map" and "Design system" pages, synced after a merged change to the build or the design.
- Bugs and feedback: the [tracker](https://claude.ai/artifact/KwDVECNhoHBfrKq3VZ3JaR).

## Keyboard

The desk has shortcuts: `?` shows them all. `1` to `3` jump between workspaces, `H` and `L` move between windows, `Space` opens the launcher, `S` opens Appearance.
