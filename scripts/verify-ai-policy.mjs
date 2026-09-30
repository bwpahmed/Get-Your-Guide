import fs from 'node:fs';
const required=['AGENTS.md','AI_PROJECT_MAP.md','AI_TEAM.md','AI_CAPABILITY_STACK.md','CLAUDE.md','GEMINI.md','.github/copilot-instructions.md','.cursor/rules/00-master-policy.mdc','AI_USAGE_GUIDE.md','.ai/architecture/system.architecture.json','.github/workflows/install-ai-understanding-stack.yml'];
const missing=required.filter(f=>!fs.existsSync(f));if(missing.length){console.error(`AI policy files missing: ${missing.join(', ')}`);process.exit(1)}
if(!fs.readFileSync('AGENTS.md','utf8').includes('CANONICAL AI POLICY')){console.error('AGENTS.md is not canonical');process.exit(1)}
for(const f of ['CLAUDE.md','GEMINI.md','.github/copilot-instructions.md','.cursor/rules/00-master-policy.mdc']){if(!fs.readFileSync(f,'utf8').includes('AGENTS.md')){console.error(`${f} disconnected from AGENTS.md`);process.exit(1)}}
for(const marker of ['## Sources of truth','## Critical flows','## Change impact map']){if(!fs.readFileSync('AI_PROJECT_MAP.md','utf8').includes(marker)){console.error(`AI_PROJECT_MAP.md missing ${marker}`);process.exit(1)}}
if(!fs.readFileSync('AGENTS.md','utf8').includes('AI_PROJECT_MAP.md')){console.error('AGENTS.md disconnected from AI_PROJECT_MAP.md');process.exit(1)}
console.log('AI policy wiring verified.');
