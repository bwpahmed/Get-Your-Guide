# Claude SEO Workflow

This website is configured to use the `AgriciDaniel/claude-seo` Claude Code plugin at pinned release `v2.3.1`. The project-level plugin configuration lives in `.claude/settings.json`; third-party auto-update is intentionally disabled so upstream changes do not silently change audits.

## Claude Code usage

When Claude Code opens this repository and the project is trusted, allow the configured marketplace/plugin when prompted. Then use:

```text
/seo doctor
/seo audit https://example.com
/seo technical https://example.com
/seo content https://example.com
/seo schema https://example.com
/seo geo https://example.com
/seo images https://example.com
```

If Claude Code does not register the project marketplace automatically, use the fallback once:

```bash
claude plugin marketplace add AgriciDaniel/claude-seo@v2.3.1 --scope project
claude plugin install claude-seo@agricidaniel-claude-seo --scope project
```

## GitHub Actions audit

Workflow: `.github/workflows/claude-seo-audit.yml`.

- Manual run: GitHub → Actions → **Claude SEO Audit** → Run workflow, then enter the public site URL and audit mode.
- Scheduled run: add repository variable `CLAUDE_SEO_SITE_URL` with the production website URL. The workflow runs weekly.
- Authentication: add repository secret `ANTHROPIC_API_KEY`. The workflow does not print the secret.
- Output: a Markdown SEO report and setup log are uploaded as workflow artifacts, and the report is summarized in the Actions job summary.
- Safety: the workflow has `contents: read` only. It audits and reports; it does not commit, push, deploy, or automatically apply SEO recommendations.

Review SEO recommendations before changing production content, routing, schema, tracking, or business logic. Existing repository `AGENTS.md` remains the canonical engineering policy.
