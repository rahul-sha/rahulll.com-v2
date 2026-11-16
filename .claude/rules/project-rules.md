# Project rules: rahulll.com

Rules for this project only. They add to, or override, the shared rules from the Cartographer plugin (`RULES.md`, `DESIGN.md`, and the shared skills). Claude Code loads this file automatically because it sits in `.claude/rules/`.

Each rule is one line, with the reason after a colon.

## Adds

- [workflow] Before pushing more to a branch, check its pull request is still open; if it merged, branch again from `main`: Rahul merges quickly.
- [workflow] Bring `main` into a branch by merging, never by rebasing: force-push is blocked on this repo.
- [design] For anything visual, load the `rahulll-design-rules` skill as well as the shared design rules: it holds this site's own look and the directions Rahul rejected.
- [design] When the design changes, update `docs/design-system.md` and its Claude Doc (https://claude.ai/artifact/5YqBNXspb4y2adDMXKdqMS) in the same pull request: the repo copy is what Claude reads, the doc is what Rahul reads.
- [workflow] After a merged pull request that changes the build or the design, sync the "Build map" and "Design system" pages in Trilium with the `trilium-project-docs` skill: those are the pages this project keeps there.

## Overrides

- [workflow] Overrides the shared bug list rule (`docs/bugs.md`): bugs and feedback live in the Claude Doc tracker, https://claude.ai/artifact/KwDVECNhoHBfrKq3VZ3JaR. Rahul's own table holds only his open items; move a fixed row to the "Fixed" table, struck through, and never delete a row otherwise: Rahul keeps that doc pinned and adds to it himself.

## Tags
Use one of: `design`, `workflow`, `safety`, `testing`, `writing`, `deploy`, `data`.
