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
