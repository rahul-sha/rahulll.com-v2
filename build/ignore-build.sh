#!/usr/bin/env bash
# Vercel runs this before each build (vercel.json "ignoreCommand").
# Exit 0 skips the build, exit 1 builds.
# Production always builds. A preview is skipped only when everything pushed since the
# last preview (or, on a first push, everything on the branch) changes nothing but
# Markdown outside content/ (such as CLAUDE.md or README.md) or files in docs/.
# Site content in content/ is Markdown too, so it always gets a preview.

[ "$VERCEL_ENV" = "production" ] && exit 1

# Compare with the last commit Vercel built for this branch. On a first push, compare
# with where the branch left main. If neither can be found, build to be safe.
base="$VERCEL_GIT_PREVIOUS_SHA"
if [ -z "$base" ] || ! git cat-file -e "$base^{commit}" 2>/dev/null; then
  base=$(git merge-base HEAD origin/main 2>/dev/null) || exit 1
fi
[ -z "$base" ] && exit 1

changed=$(git diff --name-only "$base" HEAD 2>/dev/null) || exit 1
[ -z "$changed" ] && exit 1

while IFS= read -r f; do
  case "$f" in
    content/*) exit 1 ;;
    docs/*|*.md) ;;
    *) exit 1 ;;
  esac
done <<< "$changed"

echo "Only docs changed: skipping this preview."
exit 0
