# Client Profile Page - Design Handoff for Gemini CLI

## Task
Provide detailed design recommendations for upgrading the Barrios A2I client profile page with a cyberpunk aesthetic, glassmorphism, and modern animations.

---

## Brand Guidelines

### Colors
| Element | Value | Usage |
|---------|-------|-------|
| Primary | `#00CED1` / `#00bfff` | Cyan - buttons, accents, highlights |
| Accent | `#FFD700` / `#D4AF37` | Gold - premium features, badges |
| Background | `#0B1220` | Void navy - page background |
| Card BG | `#141414` / `#141428` | Dark cards |
| Border | `rgba(255,255,255,0.1)` | Subtle glass borders |
| Text Primary | `#fafafa` | White text |
| Text Secondary | `#94a3b8` | Slate-400 |
| Text Muted | `#64748b` | Slate-500 |

### Typography
- **Headers:** `font-black uppercase tracking-tighter` (Orbitron/Exo 2)
- **Labels:** `text-[10px] font-bold uppercase tracking-widest`
- **Body:** `text-sm` with slate color variants
- **Mono:** JetBrains Mono for IDs, codes

### Style
- Cyberpunk / Futuristic
- Glassmorphism with backdrop blur
- Angular, crystalline shapes
- HUD-like elements
- Subtle glow effects (cyan, gold)

---

## Current Page Structure (What Exists)

```
Profile Page (167 lines)
├── Profile Header
│   ├── Avatar (128px, rounded-full, cyan border)
│   ├── User Info (name, email, member since)
│   ├── Subscription Badge (hardcoded "Free Tier")
│   └── Actions (Settings button, Sign Out)
├── Quick Stats Grid (4 columns)
│   ├── Tokens Used: 0
│   ├── Productions: 0
│   ├── Voice Clones: 0
│   └── Nexus Status: —
├── Account Details (list)
│   ├── User ID
│   ├── Email
│   ├── Email Verified
│   ├── Subscription
│   └── Billing Cycle
└── Quick Links (3 cards)
    ├── Billing & Subscription
    ├── Account Settings
    └── Support
```

---

## What We Need (Design Recommendations For)

### 1. GlassCard Component Pattern
Current cards use `bg-[#141414] border-[#27272a]`. Need upgrade to:
```css
/* Target Pattern */
rounded-2xl
border border-white/10
bg-white/5
backdrop-blur-xl
transition-all duration-300
hover:border-white/20
```

### 2. Profile Header Enhancement
Need recommendations for:
- Avatar with animated ring/glow effect
- Status indicator (online/offline/busy)
- Subscription tier badge with appropriate styling (Free/Starter/Creator/Growth/Scale)
- Level/XP progress bar concept
- Edit profile button placement

### 3. Stats Grid Redesign
Need recommendations for:
- Token usage with progress bar (used/total)
- Animated count-up numbers
- Icon integration (Lucide)
- Color coding by metric type
- Hover states with detailed tooltips

### 4. Activity Timeline (NEW)
Need recommendations for:
- Recent activity feed design
- Event types: login, production, purchase, settings change
- Timestamp formatting
- Icon per event type
- Load more / infinite scroll pattern

### 5. Account Details Enhancement
Need recommendations for:
- Better visual hierarchy
- Copy buttons for IDs
- Verification badges
- Expandable sections

### 6. Quick Links Redesign
Need recommendations for:
- Icon integration
- Hover animations
- Gradient borders on hover
- Description text styling

### 7. Animation Strategy (Framer Motion)
Need recommendations for:
- Page load stagger sequence
- Card entrance animations
- Hover micro-interactions
- Number count-up effects
- Progress bar animations

---

## Available Data (From Prisma Schema)

```typescript
// User has access to:
- email, firstName, lastName, avatarUrl
- timezone, locale
- createdAt, updatedAt

// Subscription data:
- tier: STARTER | CREATOR | GROWTH | SCALE
- monthlyTokenAllocation
- tokensRemaining
- billingCycleStart/End

// Token usage:
- tokensUsed, tokensRefunded
- totalConsumed this month

// Production stats:
- total productions
- status breakdown (completed, failed, processing)

// Clone profiles:
- voice clones count
- avatar clones count

// NEXUS status:
- installation status (INTAKE, SCHEDULED, IN_PROGRESS, COMPLETED)
- maintenance subscription status
```

---

## Questions for Gemini

1. **Layout:** Should we use a 2-column layout (main + sidebar) or stick with single column?

2. **Activity Timeline:** Vertical timeline with alternating sides, or simple list with icons?

3. **Stats Cards:** Large numbers with small labels, or compact cards with icons?

4. **Color Strategy:** Should different metric types have different accent colors (cyan for tokens, gold for premium, purple for AI)?

5. **Mobile:** Stack everything vertically, or use horizontal scroll for stats?

6. **Animations:** Aggressive stagger (0.1s delays) or subtle (0.05s)?

7. **HUD Elements:** Should we add decorative corner brackets, scan lines, or data streams?

---

## Reference Components (Existing in Codebase)

### MetricCard Pattern
```tsx
<motion.div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6">
  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
    {title}
  </div>
  <div className="mt-2 text-3xl font-black tracking-tight">
    {value}
  </div>
  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
    <motion.div
      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 1, ease: "easeOut" }}
    />
  </div>
</motion.div>
```

### Stagger Animation Pattern
```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};
```

---

## Deliverables Expected

1. **Layout recommendation** with visual hierarchy
2. **Component breakdown** with styling specs
3. **Animation sequence** for page load
4. **Color mapping** for different data types
5. **Mobile responsive strategy**
6. **Code snippets** for key patterns

---

## Constraints

- Must use Tailwind CSS (no external CSS files)
- Must use Framer Motion for animations
- Must be accessible (WCAG AA contrast)
- Must work on mobile (responsive)
- Keep bundle size reasonable (no heavy libraries)
