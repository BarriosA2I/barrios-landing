# CHROMADON Implementation Workflows v2.0
## Specific Automation Patterns for Claude Code

---

## Quick Start: Browser Automation

```typescript
// 1. Initialize browser session
const context = await tabs_context_mcp({ createIfEmpty: true });
const tab = await tabs_create_mcp();
const tabId = tab.tabId;

// 2. Navigate to target
await navigate(tabId, "http://localhost:3000");
await computer(tabId, { action: "wait", duration: 3 });

// 3. Screenshot initial state
await computer(tabId, { action: "screenshot" });

// 4. Read page structure
const page = await read_page(tabId);
const errors = await read_console_messages(tabId, { onlyErrors: true });

// 5. Take action / verify / iterate
// ... Ralph loop logic
```

---

## Workflow A: Debug Console Errors

**Trigger:** "CHROMADON check for errors" or "fix the console errors"

```
STEP 1: Initialize & Navigate
─────────────────────────────
tabs_context_mcp(createIfEmpty=true)
tabId = tabs_create_mcp().tabId
navigate(tabId, "http://localhost:3000")
computer(tabId, action="wait", duration=3)

STEP 2: Capture Errors
─────────────────────────────
errors = read_console_messages(tabId, onlyErrors=true, pattern="error|Error|TypeError|undefined")

STEP 3: Analyze Each Error
─────────────────────────────
For each error:
  - Parse stack trace to identify file:line
  - Categorize: React error, undefined, network, syntax
  - Determine fix strategy

STEP 4: Apply Fixes (Ralph Loop)
─────────────────────────────
WHILE errors exist AND iteration < 10:
  
  FIX TYPE: "Cannot read property of undefined"
  → Add null check: data?.property
  → Add loading guard: if (!data) return <Loading />
  
  FIX TYPE: "useState is not defined"
  → Add "use client" directive at top
  
  FIX TYPE: "Hydration mismatch"
  → Wrap client-only code in useEffect
  → Add mounted state check
  
  FIX TYPE: "Module not found"
  → Check import path (@ alias = src/)
  → Verify file exists
  
  # Verify fix
  navigate(tabId, url)  # Refresh
  computer(action="wait", duration=2)
  errors = read_console_messages(onlyErrors=true)
  
  IF errors.length == 0:
    <chromadon>ERRORS_CLEARED</chromadon>
    EXIT

STEP 5: Report
─────────────────────────────
- List all errors found
- List all fixes applied
- Final verification screenshot
```

---

## Workflow B: Visual Bug Fix

**Trigger:** "CHROMADON fix the [element]" or "this looks wrong"

```
STEP 1: Capture Current State
─────────────────────────────
computer(tabId, action="screenshot")
# Save as "before" reference

STEP 2: Identify Element
─────────────────────────────
element = find(tabId, query="the broken element description")
page = read_page(tabId, ref_id=element.ref)

STEP 3: Diagnose Issue
─────────────────────────────
COMMON VISUAL ISSUES:

□ Wrong colors
  → Check against brand:
    Primary: #00CED1 (cyan)
    Accent: #FFD700 (gold)
    Background: #0a0a0a
  → Replace with brand colors

□ Wrong spacing
  → Check Tailwind classes
  → Standard spacing: p-4 md:p-6 lg:p-8
  → Section padding: py-16 md:py-24

□ Wrong typography
  → Must NOT use Inter, Arial, Roboto
  → Use distinctive/futuristic fonts
  → Text sizes: text-sm/base/lg/xl/2xl/3xl/4xl

□ Missing animation
  → Add Framer Motion
  → Standard entrance: opacity 0→1, y 20→0

□ Layout broken
  → Check flex/grid classes
  → Check responsive breakpoints (sm/md/lg/xl)

STEP 4: Apply Fix
─────────────────────────────
# Locate file
file_path = components/[category]/[ComponentName].tsx

# Apply brand styling
BEFORE: className="text-blue-500 bg-gray-900"
AFTER:  className="text-cyan-400 bg-[#0a0a0a]"

# Add animation
BEFORE: <div className="card">
AFTER:  <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >

STEP 5: Verify (Ralph Loop)
─────────────────────────────
REPEAT until visual correct OR max 5 iterations:
  navigate(tabId, url)
  computer(action="wait", duration=2)
  computer(action="screenshot")
  
  # Compare with expected
  IF visual correct:
    <chromadon>VISUAL_FIX_VERIFIED</chromadon>
    EXIT
```

---

## Workflow C: Test User Flow

**Trigger:** "CHROMADON test the [flow]" or "make sure [feature] works"

```
STEP 1: Define Flow Steps
─────────────────────────────
EXAMPLE: Contact Form Flow
1. Navigate to contact page
2. Find and fill name field
3. Find and fill email field
4. Find and fill message field
5. Click submit button
6. Verify success message

STEP 2: Execute Each Step
─────────────────────────────
# Navigate
navigate(tabId, "http://localhost:3000/contact")
computer(action="wait", duration=3)
computer(action="screenshot")

# Find form fields
name_input = find(tabId, query="name input field")
email_input = find(tabId, query="email input field")
message_input = find(tabId, query="message textarea")
submit_btn = find(tabId, query="submit button")

# Fill form (Ralph Loop for reliability)
REPEAT until success OR max 3 attempts:
  form_input(tabId, ref=name_input.ref, value="Test User")
  form_input(tabId, ref=email_input.ref, value="test@barriosa2i.com")
  form_input(tabId, ref=message_input.ref, value="Test message from CHROMADON")
  
  # Verify fields filled
  page = read_page(tabId)
  IF all fields have values:
    BREAK

# Submit
computer(tabId, action="left_click", ref=submit_btn.ref)
computer(action="wait", duration=3)

# Verify success
page_text = get_page_text(tabId)
IF "thank you" in page_text.lower() OR "success" in page_text.lower():
  <chromadon>FLOW_TESTED: Contact form submission successful</chromadon>
ELSE:
  errors = read_console_messages(onlyErrors=true)
  <chromadon>FLOW_FAILED: [errors]</chromadon>

STEP 3: Screenshot Each State
─────────────────────────────
- Before form fill
- After form fill
- After submit (success/error)
```

---

## Workflow D: Responsive Testing

**Trigger:** "CHROMADON check mobile" or "test responsive"

```
STEP 1: Define Viewports
─────────────────────────────
VIEWPORTS = [
  { name: "Mobile S", width: 320, height: 568 },   # iPhone SE
  { name: "Mobile M", width: 375, height: 812 },   # iPhone X
  { name: "Mobile L", width: 414, height: 896 },   # iPhone XR
  { name: "Tablet", width: 768, height: 1024 },    # iPad
  { name: "Laptop", width: 1366, height: 768 },    # Common laptop
  { name: "Desktop", width: 1920, height: 1080 },  # Full HD
]

STEP 2: Test Each Viewport
─────────────────────────────
issues = []

FOR viewport in VIEWPORTS:
  # Resize
  resize_window(tabId, width=viewport.width, height=viewport.height)
  computer(action="wait", duration=1)
  
  # Navigate fresh (to trigger media queries)
  navigate(tabId, url)
  computer(action="wait", duration=2)
  
  # Screenshot
  computer(action="screenshot")
  
  # Check for issues
  page = read_page(tabId)
  
  CHECKS:
  □ Horizontal overflow?
    → javascript_tool: document.body.scrollWidth > window.innerWidth
    → FIX: Add overflow-hidden or overflow-x-auto
  
  □ Text too small?
    → Check font sizes < 12px on mobile
    → FIX: Add responsive text classes
  
  □ Touch targets too small?
    → Buttons/links < 44x44px
    → FIX: Add min-h-[44px] min-w-[44px]
  
  □ Navigation accessible?
    → Mobile menu visible on small screens
    → Desktop nav hidden on small screens
  
  □ Images overflow?
    → FIX: Add max-w-full h-auto
  
  IF issues:
    issues.append({ viewport, problems })

STEP 3: Fix Issues
─────────────────────────────
FOR issue in issues:
  # Apply Tailwind responsive fixes
  
  # Stack on mobile, row on desktop
  BEFORE: className="flex flex-row"
  AFTER:  className="flex flex-col md:flex-row"
  
  # Responsive text
  BEFORE: className="text-4xl"
  AFTER:  className="text-2xl md:text-3xl lg:text-4xl"
  
  # Responsive padding
  BEFORE: className="p-8"
  AFTER:  className="p-4 md:p-6 lg:p-8"
  
  # Responsive visibility
  className="hidden md:block"  # Desktop only
  className="block md:hidden"  # Mobile only

STEP 4: Re-verify All Viewports
─────────────────────────────
REPEAT viewport test loop
IF all pass:
  <chromadon>RESPONSIVE_VERIFIED</chromadon>
```

---

## Workflow E: Deployment Verification

**Trigger:** "CHROMADON verify deployment" or "check prod"

```
STEP 1: Test Production URL
─────────────────────────────
navigate(tabId, "https://www.barriosa2i.com")
computer(action="wait", duration=5)

STEP 2: Critical Checks
─────────────────────────────
CHECKLIST:

□ Page loads
  screenshot = computer(action="screenshot")
  
□ No console errors
  errors = read_console_messages(onlyErrors=true)
  ASSERT: errors.length == 0
  
□ No network failures
  requests = read_network_requests()
  failed = requests.filter(r => r.status >= 400)
  ASSERT: failed.length == 0

□ Logo visible
  logo = find(tabId, query="Barrios A2I logo")
  ASSERT: logo exists

□ Navigation works
  nav_links = find(tabId, query="main navigation links")
  FOR link in nav_links:
    click link
    wait for page load
    verify no errors
    go back

□ Key CTAs work
  cta = find(tabId, query="main call to action button")
  click cta
  verify expected action

STEP 3: Test Auth Flow (If Applicable)
─────────────────────────────
navigate(tabId, url + "/sign-in")
# Verify Clerk sign-in page loads
# Don't actually sign in (credentials)

STEP 4: Test NEXUS Chat
─────────────────────────────
navigate(tabId, url + "/chat")
# OR find chat widget on page
chat = find(tabId, query="chat input or widget")
ASSERT: chat exists

STEP 5: Report
─────────────────────────────
REPORT:
- Homepage: ✓/✗
- Console Errors: ✓/✗ (count)
- Network Errors: ✓/✗ (count)
- Navigation: ✓/✗
- Auth Pages: ✓/✗
- Chat Widget: ✓/✗

IF all pass:
  <chromadon>DEPLOYMENT_VERIFIED</chromadon>
ELSE:
  <chromadon>DEPLOYMENT_ISSUES: [list]</chromadon>
```

---

## Workflow F: Component Scaffolding

**Trigger:** "CHROMADON create [component]" or "add new [component]"

```
STEP 1: Determine Component Type
─────────────────────────────
TYPES:
- ui/       → Base UI component (button, card, input)
- layout/   → Layout component (header, footer, nav)
- sections/ → Page section (hero, features, cta)
- chat/     → Chat-related component
- forms/    → Form component
- effects/  → Visual effect (particles, glow)

STEP 2: Generate Component
─────────────────────────────
# Use template from CHROMADON_SKILL.md

FILE: components/[type]/[ComponentName].tsx

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface [ComponentName]Props {
  className?: string;
  children?: React.ReactNode;
  // Add specific props
}

export function [ComponentName]({ 
  className, 
  children,
  ...props 
}: [ComponentName]Props) {
  return (
    <motion.div
      className={cn(
        "relative",
        // Brand styling
        "bg-black/60 backdrop-blur-xl",
        "border border-cyan-500/20 rounded-xl",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

STEP 3: Export from Index (If Exists)
─────────────────────────────
# If components/[type]/index.ts exists:
export { [ComponentName] } from "./[ComponentName]";

STEP 4: Test in Browser
─────────────────────────────
# Add to test page temporarily
# OR create test page: app/test/page.tsx

import { [ComponentName] } from "@/components/[type]/[ComponentName]";

export default function TestPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] p-8">
      <[ComponentName]>
        Test content
      </[ComponentName]>
    </main>
  );
}

# Navigate and verify
navigate(tabId, "http://localhost:3000/test")
computer(action="screenshot")

IF renders correctly:
  <chromadon>COMPONENT_CREATED: [ComponentName]</chromadon>
```

---

## Workflow G: Performance Audit

**Trigger:** "CHROMADON check performance" or "page is slow"

```
STEP 1: Measure Load Time
─────────────────────────────
start_time = Date.now()
navigate(tabId, url)
# Wait for network idle
computer(action="wait", duration=5)
load_time = Date.now() - start_time

STEP 2: Get Performance Metrics
─────────────────────────────
metrics = javascript_tool(tabId, `
  const nav = performance.getEntriesByType('navigation')[0];
  const paint = performance.getEntriesByType('paint');
  
  return {
    domContentLoaded: nav.domContentLoadedEventEnd,
    loadComplete: nav.loadEventEnd,
    firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
    firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
    transferSize: nav.transferSize,
  };
`)

STEP 3: Identify Bottlenecks
─────────────────────────────
resources = javascript_tool(tabId, `
  return performance.getEntriesByType('resource')
    .map(r => ({
      name: r.name,
      type: r.initiatorType,
      duration: r.duration,
      size: r.transferSize
    }))
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 10);
`)

STEP 4: Recommend Fixes
─────────────────────────────
COMMON OPTIMIZATIONS:

□ Large images
  → Convert to WebP
  → Use next/image with optimization
  → Add width/height to prevent layout shift
  
□ Large JavaScript bundles
  → Dynamic imports: next/dynamic
  → Code splitting by route
  
□ Slow fonts
  → Preload critical fonts
  → Use font-display: swap
  
□ Too many requests
  → Combine/minify CSS/JS
  → Use CDN
  
□ Slow API calls
  → Add loading states
  → Consider caching

STEP 5: Apply Fixes & Re-measure
─────────────────────────────
# Apply optimizations to code
# Re-run performance measurement
# Compare before/after

IF metrics improved:
  <chromadon>PERFORMANCE_OPTIMIZED</chromadon>
```

---

## Error Recovery Matrix

| Error Type | Detection | Recovery Strategy |
|------------|-----------|-------------------|
| Element not found | find() returns empty | Wait 2s → Scroll → Try alternate selector |
| Click failed | Action throws | Scroll to element → Hover first → JS click |
| Page not loading | Timeout | Refresh → Check network → Increase timeout |
| Console error | read_console_messages | Parse stack → Fix code → Refresh → Verify |
| Network 4xx/5xx | read_network_requests | Check URL → Check API → Add error handling |
| Hydration mismatch | Console error | Add "use client" → useEffect wrapper |
| Form validation | Submit blocked | Read validation errors → Fix input values |

---

## Completion Signals Reference

```
<chromadon>FIX_COMPLETE</chromadon>        # Code fix verified
<chromadon>TEST_PASS</chromadon>           # Test passed
<chromadon>VISUAL_FIX_VERIFIED</chromadon> # Visual bug fixed
<chromadon>ERRORS_CLEARED</chromadon>      # Console errors resolved
<chromadon>FLOW_TESTED</chromadon>         # User flow works
<chromadon>DEPLOYMENT_VERIFIED</chromadon> # Production working
<chromadon>RESPONSIVE_VERIFIED</chromadon> # All viewports work
<chromadon>COMPONENT_CREATED</chromadon>   # New component done
<chromadon>PERFORMANCE_OPTIMIZED</chromadon> # Speed improved
<chromadon>TASK_COMPLETE</chromadon>       # Generic success
<chromadon>TASK_FAILED: [reason]</chromadon> # Could not complete
```

---

*CHROMADON Workflows v2.0 | Ralph-Powered Automation*
*For: frontend-barrios-landing*
