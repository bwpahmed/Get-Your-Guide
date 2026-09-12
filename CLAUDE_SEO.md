# Claude SEO integration

This website vendors a pinned, project-local copy of `AgriciDaniel/claude-seo` for repeatable SEO work.

## Pinned upstream
- Repository: `https://github.com/AgriciDaniel/claude-seo`
- Commit: `92795530b4cc92c6bf7a2435b82c15b003e71181`
- Version: `2.3.1`
- License: MIT

The pin and license are recorded in `.agents/claude-seo.version`. Upgrades happen only by changing the pinned commit in `.github/workflows/install-claude-seo-pack.yml` and reviewing the resulting diff.

## Installed project layout
- `.claude/skills/seo*/` — Claude Code project skills, auto-discovered by Claude.
- `.claude/agents/seo-*.md` — Claude Code project subagents.
- `.agents/skills/seo*/` and `.agents/agents/seo-*.md` — portable copies for other agent harnesses.
- `.codex/agents/seo-*.toml` — generated Codex project-agent adapters.
- `.agents/vendor/claude-seo/` — pinned scripts, runtime support, schema/data/extensions, README and MIT license.

The repository root `AGENTS.md` remains authoritative. Imported SEO instructions must never override repository safety, source-of-truth, validation, or deployment rules.

## Local use
Open the repository in Claude Code and use `/seo` normally; the project skills are already checked in. Before first script-backed use, initialize the isolated runtime:

```bash
.agents/vendor/claude-seo/scripts/claude-seo setup
.agents/vendor/claude-seo/scripts/claude-seo doctor
```

Example:

```text
/seo audit <production-url>
/seo technical <production-url>
/seo schema <production-url>
/seo geo <production-url>
```

No API credentials are stored in the repository. Optional Google/DataForSEO/Ahrefs/etc. integrations must use external environment/secrets configuration.

## GitHub workflows
- `.github/workflows/install-claude-seo-pack.yml` synchronizes the exact pinned upstream commit, verifies at least 25 SEO skills and 18 agents, generates Codex adapters, and commits only generated AI-pack files.
- `.github/workflows/claude-seo.yml` runs manual or weekly **audit-only** SEO reports using this repo-local pack. It does not install a marketplace copy and does not automatically edit code, deploy, or mutate production.

For audit workflow authentication configure one Actions secret: `ANTHROPIC_API_KEY` or `CLAUDE_CODE_OAUTH_TOKEN`. For scheduled audits set `SEO_SITE_URL` unless the repository workflow already has a safe default URL.

Recommended cycle: audit → human review → approve selected recommendations → implement under `AGENTS.md` → run normal CI → re-audit.
