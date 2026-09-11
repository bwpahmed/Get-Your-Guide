import fs from 'node:fs';
const required=['AGENTS.md','AI_TEAM.md','CLAUDE.md','GEMINI.md','.github/copilot-instructions.md','.cursor/rules/00-master-policy.mdc','AI_USAGE_GUIDE.md'];
const missing=required.filter(f=>!fs.existsSync(f));if(missing.length){console.error(`AI policy files missing: ${missing.join(', ')}`);process.exit(1)}
if(!fs.readFileSync('AGENTS.md','utf8').includes('CANONICAL AI POLICY')){console.error('AGENTS.md is not canonical');process.exit(1)}
for(const f of ['CLAUDE.md','GEMINI.md','.github/copilot-instructions.md','.cursor/rules/00-master-policy.mdc']){if(!fs.readFileSync(f,'utf8').includes('AGENTS.md')){console.error(`${f} disconnected from AGENTS.md`);process.exit(1)}}
console.log('AI policy wiring verified.');
