# Conversation Health Management

## Purpose
Prevent Claude Desktop compaction issues by monitoring conversation length and providing structured handoffs.

## Auto-Activation Triggers

This skill activates when:
- Conversation exceeds 50 exchanges
- Context usage feels "heavy" (repeated summarization warnings)
- User mentions: "long conversation", "context", "losing track", "forgot earlier"

## Context Load Reduction Strategies

### 1. Move Large Specs to Project Knowledge
Instead of pasting full specs (~5K tokens), reference them:

**DO:**
```
See ~/.claude/skills/neural-rag-brain/SKILL.md for full spec
Quick ref: ~/.claude/quick-refs/neural-rag-brain-quick.md
```

**DON'T:**
```
[Paste entire 300-line spec inline]
```

### 2. Use Quick References
Pre-built condensed versions (~500 tokens):
- `~/.claude/quick-refs/neural-rag-brain-quick.md` - Neural RAG patterns
- `~/.claude/quick-refs/chromadon-quick.md` - Browser automation

### 3. Checkpoint Long Sessions
Every ~30-50 exchanges, consider checkpointing:
```
CHECKPOINT: [timestamp]
Current phase: [what we're building]
Key decisions: [bullet list]
Next steps: [what remains]
```

## Conversation Length Indicators

| Exchanges | Status | Action |
|-----------|--------|--------|
| 0-30 | Fresh | Full context available |
| 30-50 | Warming | Consider checkpointing |
| 50-75 | Hot | Recommend handoff prep |
| 75+ | Critical | Initiate handoff |

## Handoff Template

When starting fresh, use this template:

```markdown
# Session Handoff - [YYYY-MM-DD HH:MM]

## Project Context
- **Project**: [name]
- **Location**: [path]
- **Phase**: [current phase of work]

## What Was Accomplished
1. [completed task 1]
2. [completed task 2]
3. [completed task 3]

## Current State
- **Working branch**: [branch name]
- **Last modified files**:
  - `path/to/file1.ts` - [what changed]
  - `path/to/file2.ts` - [what changed]
- **Tests**: [passing/failing]

## Critical Decisions Made
- [Decision 1]: [why this choice]
- [Decision 2]: [why this choice]

## What Needs to Happen Next
1. [ ] [next task]
2. [ ] [next task]
3. [ ] [next task]

## Key References
- CLAUDE.md: [project]/CLAUDE.md
- Active skill: ~/.claude/skills/[skill-name]/SKILL.md
- Epic plan: ~/.claude/plans/[plan-name].md

## Known Issues/Blockers
- [issue 1]
- [issue 2]
```

## Integration with Barrios A2I Workflow

### Handoff Storage
Save handoffs to: `~/.claude/plans/YYYY-MM-DD-handoff-[topic].md`

### Notion Sync (Optional)
If Notion MCP is connected, also create a handoff page in the "Claude Sessions" database.

### Auto-Prompt for Fresh Start
When hitting 50+ exchanges, Claude should suggest:

> "We're at ~50 exchanges. To avoid context degradation, I recommend:
> 1. I'll create a handoff document capturing our progress
> 2. You start a fresh conversation
> 3. Paste the handoff document in the new session
>
> Want me to generate the handoff now?"

## Context-Efficient Patterns

### For CHROMADON Work
```
Project: chromadon-brain
Phase: [current phase]
Key files: src/implementations/[component].ts
Tests: npm test -- [pattern]
```

### For Barrios Landing
```
Project: barrios-landing
Deploy: vercel.com/garys-projects-ff523529/barrios-landing
Key files: index.html, css/nexus-brain.css
```

### For RAG Agents
```
Pattern: Neural RAG Brain v3.0
Quick ref: ~/.claude/quick-refs/neural-rag-brain-quick.md
```

## Skill Maintenance

Update this file when:
- New quick references are added
- Context management patterns improve
- Handoff template needs expansion

**Last Updated:** 2025-12-31
**Version:** 1.0.0
