---
schema: agentcompanies/v1
kind: project
slug: get-your-guide
name: Get-Your-Guide
description: Paperclip project package for bwpahmed/Get-Your-Guide
metadata:
  repository: https://github.com/bwpahmed/Get-Your-Guide
  defaultBranch: main
---

# Paperclip operating contract

This package seeds the project identity for Paperclip. It does not replace the repository's engineering instructions.

When Paperclip assigns work in this project:

1. Execute from the repository workspace/root and read the root `AGENTS.md` completely before planning or editing.
2. For non-trivial work, also read root `AI_TEAM.md` and relevant project documentation.
3. Treat root `AGENTS.md` as the canonical repository policy. Paperclip goals, tasks, prompts, and agent role text must not weaken repository safety rules.
4. Inspect the current implementation and extend the existing source of truth instead of creating parallel business logic or duplicate configuration.
5. Use an isolated task branch/worktree for code changes. Keep unrelated refactors out of focused tasks.
6. Do not deploy to production, mutate production data, rotate secrets, or alter live infrastructure unless the user explicitly requests it.
7. Start with assignment/on-demand execution. Keep timer heartbeats disabled until a human intentionally enables a proven recurring workflow.
8. Run relevant tests/checks and require human review before merging risky or cross-cutting work.
9. Finish each task with files changed, checks actually run, unresolved risks, and any manual/production steps that remain.
