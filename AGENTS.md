# CANONICAL AI POLICY — Get-Your-Guide

This file is the single source of truth for AI coding agents in this repository. Tool-specific files are adapters only; if they conflict, follow `AGENTS.md`.

## Mandatory start protocol
1. Read this file completely before changing code.
2. Read `AI_PROJECT_MAP.md` and identify the documented owner/source of truth for the requested area.
3. For non-trivial work, read `AI_TEAM.md` and `AI_CAPABILITY_STACK.md`; load only relevant specialists/capabilities.
4. Record the branch/baseline, then inspect current implementation, tests, config, callers/data flow and relevant docs.
5. Search for existing/similar logic and reuse or extend the current owner before creating parallel content, storage, CMS, state or workflow logic.
6. Use Graphify when cross-file ownership/dependency paths are unclear; use Archify when a source-backed visual materially helps or architecture changed.
7. Keep scope to the smallest safe change; do not modify unrelated code.

## Change rules
Preserve unrelated behavior. Prefer small reversible root-cause fixes. Reuse existing components/services/models/utilities/validation/config/patterns. Avoid unrelated refactors, dependency upgrades, formatting sweeps, or file moves. Do not silently remove features, validation, logging, history, compatibility behavior, or safety checks. Treat auth, permissions, payments, personal data, schemas/migrations, secrets, integrations, browser automation, and deployment as high-risk. Never invent credentials, production data, or test results. Never deploy production, run destructive database operations, delete user data, rotate secrets, or alter live infrastructure unless explicitly requested. Preserve backward compatibility unless a breaking change is approved.

## Validation
Run relevant available checks: tests, lint, typecheck, build, migration validation, or focused smoke checks. If a check cannot run, state why. Never claim an unrun check passed. High-risk multi-area changes require security and QA review.

## AI Standard v2 execution
`Task -> AGENTS.md -> AI_PROJECT_MAP.md -> Graphify/Archify when useful -> AI_TEAM.md -> AI_CAPABILITY_STACK.md -> baseline -> existing source of truth -> reuse/extend -> plan/spec -> implement -> tests/checks -> browser QA when relevant -> independent QA -> map refresh if architecture changed -> final diff check -> done`

If architecture, content ownership, storage semantics, trust boundaries or a critical runtime flow changes, update `AI_PROJECT_MAP.md` in the same change. Derived graphs/diagrams never override real code or runtime persistence.

## Completion report
Report objective/root cause, files changed, behavior preserved, checks actually run, and remaining risks/manual steps/migrations/deployment actions.

## Instruction hierarchy
System/platform instructions and the user's current explicit request outrank repository instructions. Within this repo, `AGENTS.md` outranks `AI_TEAM.md`, `AI_CAPABILITY_STACK.md`, imported upstream packs, and adapters.