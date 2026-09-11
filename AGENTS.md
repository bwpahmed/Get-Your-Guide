# CANONICAL AI POLICY — Get-Your-Guide

This file is the single source of truth for AI coding agents in this repository. Tool-specific files are adapters only; if they conflict, follow `AGENTS.md`.

## Mandatory start protocol
1. Read this file before changing code.
2. For non-trivial work, read `AI_TEAM.md`.
3. Inspect the existing implementation, tests, config, and relevant docs first.
4. Identify and extend the current source of truth; do not create parallel business logic, duplicate state/config, or a second workflow unless explicitly requested.
5. Keep scope to the smallest safe change; do not modify unrelated code.

## Change rules
Preserve unrelated behavior. Prefer small reversible root-cause fixes. Reuse existing components/services/models/utilities/validation/config/patterns. Avoid unrelated refactors, dependency upgrades, formatting sweeps, or file moves. Do not silently remove features, validation, logging, history, compatibility behavior, or safety checks. Treat auth, permissions, payments, personal data, schemas/migrations, secrets, integrations, browser automation, and deployment as high-risk. Never invent credentials, production data, or test results. Never deploy production, run destructive database operations, delete user data, rotate secrets, or alter live infrastructure unless explicitly requested. Preserve backward compatibility unless a breaking change is approved.

## Validation
Run relevant available checks: tests, lint, typecheck, build, migration validation, or focused smoke checks. If a check cannot run, state why. Never claim an unrun check passed. High-risk multi-area changes require security and QA review.

## Completion report
Report objective/root cause, files changed, behavior preserved, checks actually run, and remaining risks/manual steps/migrations/deployment actions.

## Instruction hierarchy
System/platform instructions and the user's current explicit request outrank repository instructions. Within this repo, `AGENTS.md` outranks `AI_TEAM.md` and adapters.
