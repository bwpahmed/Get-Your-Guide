# Claude SEO integration

This website uses `AgriciDaniel/claude-seo` for repeatable SEO audits. The workflow installs the upstream Claude Code plugin at runtime; application code does not vendor or modify it.

Baseline: `AgriciDaniel/claude-seo` commit `92795530b4cc92c6bf7a2435b82c15b003e71181`, plugin manifest `2.3.1` when configured.

Local Claude Code:
```text
/plugin marketplace add AgriciDaniel/claude-seo
/plugin install claude-seo@agricidaniel-claude-seo
/seo setup
/seo doctor
```
Run `/seo audit <production-url>` or another `/seo` mode. Always follow `AGENTS.md` before implementing recommendations.

`.github/workflows/claude-seo.yml` provides manual and weekly audits with artifact reports and no automatic code edits, commits, deploys, or production mutations.

Set one Actions secret: `ANTHROPIC_API_KEY` or `CLAUDE_CODE_OAUTH_TOKEN`. Set Actions variable `SEO_SITE_URL` to the live production URL for scheduled audits. If missing, scheduled audits safely skip.
