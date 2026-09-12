# Claude SEO workflow
Pinned `AgriciDaniel/claude-seo` v2.3.1 at commit `55c7914a3ed2869b217b5d5f360a4e7ba28b4848`.

Install: Linux/macOS `bash scripts/install-claude-seo.sh`; Windows `powershell -ExecutionPolicy Bypass -File scripts\install-claude-seo.ps1`. In Claude Code: `/seo doctor`, then `/seo audit <live-url>`; use technical/schema/geo/content/local/images as relevant.

Audit before editing. Prioritize P0/P1. Do not auto-publish content or silently change canonicals, redirects, robots, sitemap, schema, analytics, prices, business facts, or deployment. Run normal repo checks and re-audit changed URLs.

GitHub workflow weekly readiness uses no Anthropic API. Manual report-only audit requires secret `ANTHROPIC_API_KEY` and `site_url` or variable `SEO_SITE_URL`.
