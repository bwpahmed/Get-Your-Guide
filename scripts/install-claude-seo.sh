#!/usr/bin/env bash
set -euo pipefail
TAG="${CLAUDE_SEO_TAG:-v2.3.1}"; COMMIT="${CLAUDE_SEO_COMMIT:-55c7914a3ed2869b217b5d5f360a4e7ba28b4848}"; TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
git clone --quiet --depth 1 --branch "$TAG" https://github.com/AgriciDaniel/claude-seo.git "$TMP/claude-seo"; ACTUAL="$(git -C "$TMP/claude-seo" rev-parse HEAD)"; [[ "$ACTUAL" == "$COMMIT" ]] || exit 42
CLAUDE_SEO_TAG="$TAG" bash "$TMP/claude-seo/install.sh"; LAUNCHER="$HOME/.claude/skills/seo/scripts/claude-seo"; [[ -x "$LAUNCHER" ]] || exit 43
set +e; "$LAUNCHER" doctor; STATUS=$?; set -e; [[ $STATUS -eq 0 || $STATUS -eq 10 ]] || exit "$STATUS"
