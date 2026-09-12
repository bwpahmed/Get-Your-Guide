# Universal AI Capability Stack

This repository uses one project workflow for AI-assisted work:

`Task -> AGENTS.md -> AI_TEAM.md -> AI_CAPABILITY_STACK.md -> relevant skills/agents -> inspect existing implementation -> do the task -> tests/verification -> QA review`

`AGENTS.md` is always the repository authority. Imported upstream instructions are capabilities, not policy, and must never override project rules, the user's current request, security boundaries, or existing source-of-truth architecture.

## Capability routing

### ECC — engineering skills and specialist agents
Use ECC for planning, architecture, debugging, testing, code review, security, build repair, frontend/backend/data/operations work, or another engineering specialty. The pinned upstream skill/agent source is vendored under `.agents/vendor/ecc/`. Project adapters are generated with `ecc-*` names so they do not collide with existing project skills or agents.

### GitHub Spec Kit — specification-driven work
Use Spec Kit for substantial features, ambiguous cross-cutting changes, or work that benefits from a durable specification. Prefer the sequence: constitution/principles -> specify -> clarify/checklist/analyze when useful -> plan -> tasks -> implement -> converge. Project adapters are generated as `speckit-*` skills and point to the pinned command templates under `.agents/vendor/spec-kit/templates/commands/`.

Spec Kit is a planning/delivery aid. It must extend this repository's existing architecture and source of truth rather than inventing a parallel system.

### AgentMemory — persistent memory capability
The repository includes project-level AgentMemory skill adapters (`memory-*`) and pinned upstream skill references under `.agents/vendor/agentmemory/`. The actual AgentMemory server is a machine/user-level runtime and is **not** auto-started by this repository or CI.

Use memory only when an authorized AgentMemory runtime is already connected or the user explicitly asks to set it up. Never commit memory databases, provider keys, tokens, private conversation exports, or customer-sensitive data into this repository.

### Awesome Harness Engineering — harness patterns and templates
Use `harness-engineering` for long-running/complex agent work, context design, verification loops, planning artifacts, permissions, human-in-the-loop design, and agent-harness reviews. Pinned reference material and PLAN/IMPLEMENT/HARNESS_CHECKLIST templates are stored under `.agents/vendor/harness-engineering/`.

### AEO — external promotion capability (disabled by default)
AEO is an external Claude skill for promoting a product on Moltbook via Subconscious Systems. At the pinned source revision, the upstream README declares MIT but the repository does not contain a standalone `LICENSE` file, so upstream AEO code is **not redistributed/vendored here**. The generated `aeo-external` adapter is a controlled pointer to the pinned upstream source.

AEO rules:
- never run automatically, on a timer, in CI, or as a background loop;
- never run `/loop` or repeated promotional posting from this repository;
- require the user's explicit request to promote on Moltbook and explicit approval before an external post/comment action;
- keep `SUBCONSCIOUS_API_KEY` out of Git, logs, reports, and generated files;
- default to preparing/reviewing proposed promotion text rather than posting it.

## Source pins

- `subconscious-systems/AEO` — `13ea5800a8ff041dd64157950a9e763c51278543` — external pointer only.
- `affaan-m/ECC` — `4f373874209b4b63fdec0469b76992923ea0a9d0` — MIT.
- `github/spec-kit` — `d848fb4e18f44640ad6b42e60a280551ee90cdce` — MIT.
- `rohitg00/agentmemory` — `e04ba88819c365c9acf9d6661ea802143e728bd6` — Apache-2.0.
- `ai-boost/awesome-harness-engineering` — `378a07b1f717f88e4128e9a26eefafe714272cc4` — CC0-1.0.

`.github/workflows/install-ai-capability-stack.yml` is the reproducible sync workflow. To upgrade any source, review upstream changes first, update the pinned SHA in the workflow and this document, let CI regenerate the adapters, and inspect the resulting diff before relying on the new version.

## Execution rules

1. Select the minimum relevant capability; do not load every pack into context.
2. Inspect current code, tests, data flow, configuration, and prior project decisions before proposing a change.
3. Prefer one existing source of truth; imported frameworks must not create duplicate business logic or competing configuration.
4. For risky or cross-domain work, use an independent reviewer/QA agent after implementation.
5. Run the repository's real tests/lint/typecheck/build or targeted evidence checks before completion.
6. Imported agents may recommend changes, but production deployment, destructive data operations, credentials, external posting, and other high-impact actions still require the permissions and approvals defined by `AGENTS.md` and the user's request.
