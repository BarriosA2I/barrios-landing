# Barrios A2I - Project Instructions

## Auto-Invoke Skills

**ALWAYS use the frontend-design skill** (located in `.claude/skills/frontend-design/SKILL.md`) when:
- Creating or modifying any HTML, CSS, JSX, TSX files
- Working on UI components, pages, or layouts
- Styling or beautifying any interface
- Building React components or web pages
- Touching anything in /css, /js, /components, /pages, /app directories
- User mentions: design, UI, frontend, styling, layout, component, page, landing, dashboard, chat interface

Read the SKILL.md file BEFORE writing any frontend code to ensure the Tesla-minimalist cyberpunk aesthetic is followed.

## Project Context

This is the Barrios A2I website (barrios-landing.vercel.app) - an AI automation consultancy.

Key interfaces:
- Nexus Brain Chat: Floating chat widget for AI-powered sales
- Command Center: Dashboard for system monitoring
- Landing page: Hero + services + pricing + testimonials

Tech stack: HTML/CSS/JS (vanilla) with plans to migrate to React + Tailwind + shadcn/ui

## File Structure
```
barrios-landing/
├── index.html          # Main landing page
├── css/
│   └── nexus-brain.css # Chat widget styles
├── js/
│   ├── nexus-chat.js   # Chat logic
│   ├── nexus-api.js    # API client
│   └── nexus-streaming.js # WebSocket client
├── .claude/
│   └── skills/
│       └── frontend-design/
│           └── SKILL.md  # Design system
└── CLAUDE.md           # This file
```

## Code Style
- Use CSS variables for colors (defined in frontend-design SKILL.md)
- Prefer semantic HTML
- Mobile-first responsive design
- Accessibility: proper ARIA labels, keyboard navigation
- No inline styles - use classes

## Color Palette (Quick Reference)
- Background: #0a0a0a (primary), #141414 (secondary)
- Text: #fafafa (primary), #a1a1aa (secondary)
- Accent: #00D4FF (cyan), #8B5CF6 (purple)

## Current Priority
Nexus Brain chat integration with Cognitive Orchestrator (Phase 4 of Nervous System)

## 🚨 MANDATORY: Frontend Design Skill

**BEFORE making ANY frontend changes** (CSS, HTML, animations, colors, layouts):

1. **ALWAYS READ FIRST**: `.claude/skills/frontend-design/SKILL.md`
2. Follow the design system variables, spacing, and color palette
3. Use the component patterns defined in the skill
4. Reference the skill when explaining design decisions

**DO NOT** make trial-and-error CSS commits. Follow the skill.

Example workflow:
```bash
# Before ANY frontend work:
cat .claude/skills/frontend-design/SKILL.md

# Then implement according to the skill
```

### Key Design Values (Quick Reference)
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | #0a0a0a | Page background |
| `--bg-secondary` | #141414 | Cards, panels |
| `--accent-cyan` | #00D4FF | Primary accent, CTAs |
| `--accent-purple` | #8B5CF6 | Secondary accent |
| `--text-primary` | #fafafa | Headings |
| `--text-secondary` | #a1a1aa | Body text |

### Animation Guidelines
- **Slow & smooth**: 20s+ for ambient effects
- **No jittery opacity pulses**: Use `transform` for GPU acceleration
- **playbackRate**: 0.3 for background videos
- **will-change**: Add for animated elements

## CHROMADON Browser Automation (Chrome DevTools MCP)

Location: `C:\Users\gary\chromadon`

**PREFERRED METHOD**: Use Chrome DevTools MCP - works with already-open Chrome, no profile management needed.

### Deploy to Vercel (MCP Method):

```
# Step 1: Navigate to deployments
mcp__chrome-devtools__navigate_page(url="https://vercel.com/garys-projects-ff523529/barrios-landing/deployments")

# Step 2: Take snapshot to find element UIDs
mcp__chrome-devtools__take_snapshot()

# Step 3: Click menu button (look for "Deployment Actions" in snapshot)
mcp__chrome-devtools__click(uid="<menu_uid>")

# Step 4: Click "Redeploy" in dropdown
mcp__chrome-devtools__click(uid="<redeploy_uid>")

# Step 5: Confirm in dialog
mcp__chrome-devtools__click(uid="<confirm_uid>")

# Step 6: Screenshot result
mcp__chrome-devtools__take_screenshot(filePath="C:\\Users\\gary\\chromadon\\screenshots\\deploy.png")
```

### Chrome DevTools MCP Commands:

| Command | Description |
|---------|-------------|
| `navigate_page(url)` | Go to URL |
| `take_snapshot()` | Get accessibility tree with UIDs |
| `click(uid)` | Click element by UID |
| `fill(uid, value)` | Type into input |
| `take_screenshot(filePath)` | Save screenshot |
| `list_pages()` | List open tabs |

### Vercel Project URLs:

- **barrios-landing**: `https://vercel.com/garys-projects-ff523529/barrios-landing`

### Screenshot Output:

`C:\Users\gary\chromadon\screenshots\`

### Fallback (Playwright - if MCP unavailable):

```bash
cd C:\Users\gary\chromadon
python vercel_deploy.py barrios-landing
```

See `C:\Users\gary\chromadon\CHROMADON.md` for full documentation.
