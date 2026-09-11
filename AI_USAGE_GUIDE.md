# AI Usage Guide
Supported coding agents should discover `AGENTS.md` automatically or through an adapter. For a generic web AI, start with: `Read AGENTS.md and AI_TEAM.md first, then do the task.`

Prompts: bug — find root cause, smallest safe fix, preserve unrelated behavior, run checks, report files/tests/risks. Audit — no code changes; identify source of truth, duplicate logic, broken paths, risks, missing tests, priorities. Feature — provide goal + acceptance criteria; reuse architecture, avoid parallel logic, implement/test smallest complete solution. Database/auth — inspect first, explain security/migration/rollback, preserve data/permissions. UI/mobile — preserve business logic, check desktop/mobile/loading/error/empty/accessibility. Automation — preserve safety stops, idempotency/duplicate protection, auditability, and existing manual approvals.

Tips: state what must not change; ask for root cause; one logical task per branch/PR; require real check results; ask for risk+rollback on high-risk work; never request production deployment unless intended.
