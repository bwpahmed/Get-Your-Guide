# Paperclip project package

This folder is intentionally isolated from application runtime code. It makes this repository easy to add to a central Paperclip company while the root `AGENTS.md` remains the canonical engineering policy.

## Import into an existing Paperclip company

Preview first:

```sh
npx paperclipai company import bwpahmed/Get-Your-Guide/paperclip --target existing --company-id <COMPANY_ID> --include projects --dry-run
```

After reviewing the preview, repeat without `--dry-run`.

This repository is public, so Paperclip can use GitHub import directly. A local-path import also works from a clone.

## Runtime setup

After import, attach/configure the project's Git workspace for `https://github.com/bwpahmed/Get-Your-Guide.git` with default branch `main`. Prefer isolated execution workspaces/worktrees for code-changing tasks. Start agents with assignment/on-demand wakeups and keep timer heartbeats disabled until the workflow has been tested.

Paperclip itself should be installed once as a central control plane; it does not need a separate server installation inside every repository.
