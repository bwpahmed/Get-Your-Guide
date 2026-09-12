# AI Team Routing
Use the minimum specialist coverage required. If subagents are unavailable, perform these perspectives sequentially.

- Architecture/root-cause: cross-cutting changes, ownership, integrations, large refactors.
- Frontend/UX: pages, components, responsive/accessibility/browser behavior.
- Backend/data: APIs, server logic, schemas, migrations, caching, integrity.
- Security/identity: auth, authorization, permissions, secrets, sensitive data, policies.
- QA/regression: reproduction, acceptance criteria, tests, edge cases.
- Automation/DevOps: CI/CD, browser automation, jobs, deployment, observability.
- Final reviewer: independent review of risky multi-area changes.

Routing: small fix = owner + QA; database/auth/security = backend + security + QA; cross-cutting = architecture + owner + QA; deployment/automation = DevOps + security when relevant + QA; risky multi-area = final reviewer.

## Extended capability stack
For non-trivial work, read `AI_CAPABILITY_STACK.md` after this file. Load only the capability that materially helps the task: ECC for engineering specialists/skills, Spec Kit for durable specification-driven work, AgentMemory for authorized persistent-memory workflows, Harness Engineering for long-running/context/verification design, and AEO only for explicitly approved Moltbook promotion. `AGENTS.md` remains authoritative over every imported pack.
