/**
 * BARRIOS A2I - CANONICAL COMPANY FACTS v2.0
 * ==========================================
 * SINGLE SOURCE OF TRUTH - LEGENDARY EDITION
 * 
 * UPGRADES FROM ChatGPT + Gemini SYNTHESIS:
 * ✅ Two UI_COPY packs (iCloud Calm / Palantir Command)
 * ✅ Expanded FORBIDDEN_PHRASES (includes "no founder" variants)
 * ✅ Maintenance justification copy (ChatGPT: "prints money")
 * ✅ Example prompts for each capability
 * ✅ Founder line in header
 * ✅ Demo tenant removal patterns
 * 
 * Neural RAG Brain v3.0 | Barrios A2I
 */

// =============================================================================
// CORE COMPANY FACTS (Non-negotiable truths)
// =============================================================================

export const COMPANY_FACTS = {
  name: 'Barrios A2I',
  fullName: 'Barrios A2I (Alienation → Innovation)',
  founder: 'Gary Barrios',
  isReal: true,
  
  tagline: 'Autonomous intelligence systems installed into businesses.',
  
  plainEnglish: 'Barrios A2I, founded by Gary Barrios, installs private AI systems that help businesses find information instantly, automate busywork, and generate marketing—without sending your data to the cloud.',
  
  products: {
    nexus: {
      name: 'Nexus',
      type: 'Local-First AI Assistant',
      description: 'Private AI assistant that runs on your computer. Your data never leaves your device.',
      capabilities: [
        'Find anything fast (files, folders, PDFs, notes)',
        'Summarize & write (emails, documents, replies)',
        'Schedule & remind (calendar, follow-ups, deadlines)',
        'Organize knowledge (turns chaos into searchable answers)',
        'Run workflows (automate repeated tasks)'
      ],
      privacyPromise: 'Runs locally. Your data stays on your machine. Not used to train models.'
    },
    ragnarok: {
      name: 'RAGNAROK',
      type: 'Commercial Video Production Pipeline',
      description: '7-agent autonomous video generation system for marketing content.'
    },
    chromadon: {
      name: 'CHROMADON',
      type: 'Autonomous Browser Agent',
      description: 'Self-healing browser automation for complex web workflows.'
    }
  },
  
  pricing: {
    setup: { amount: 759, currency: 'USD', description: 'One-time installation & configuration' },
    monthly: { amount: 49.99, currency: 'USD', description: 'Ongoing maintenance, updates, and support' },
    displayText: '$759 one-time setup + $49.99/month maintenance'
  },
  
  contact: {
    website: 'https://barrios-a2i.com',
    email: 'hello@barrios-a2i.com',
    calendly: 'https://calendly.com/barrios-a2i'
  }
} as const;

// =============================================================================
// SYSTEM PROMPT INJECTION (Backend must inject this EVERY request)
// =============================================================================

export const NEXUS_SYSTEM_PROMPT_FACTS = `
## MANDATORY FACTS (Ground truth - never contradict)

**Company Identity:**
- Company Name: Barrios A2I (Alienation → Innovation)
- Founder: Gary Barrios
- Barrios A2I is a REAL business. It is NOT fictional, NOT a demo scenario, NOT roleplay.

**What Barrios A2I Does:**
${COMPANY_FACTS.plainEnglish}

**Pricing:**
${COMPANY_FACTS.pricing.displayText}

**Privacy Promise:**
${COMPANY_FACTS.products.nexus.privacyPromise}

## RESPONSE RULES (MANDATORY)

1. When asked "Who is the founder of Barrios A2I?" → Answer: "Gary Barrios is the founder of Barrios A2I."
2. When asked "Is Barrios A2I real?" → Answer: "Yes, Barrios A2I is a real business founded by Gary Barrios."
3. NEVER say the company is fictional, a construct, roleplay, or a demo scenario.
4. NEVER say "there is no founder" or "founder unknown" or "founder not specified."
5. If you don't know something, say: "I don't have that specific detail, but I can connect you with Gary or our team."

## ANTI-PATTERNS TO AVOID
- Do not claim the company is fictional
- Do not claim the founder is unknown
- Do not say "this is a demo" or "for demonstration purposes"
- Do not use OmniCorp, sample tenant, or placeholder company names
`;

// =============================================================================
// FORBIDDEN PHRASES - EXPANDED (ChatGPT identified "no founder" gap)
// =============================================================================

export const FORBIDDEN_PHRASES = [
  // Original fictional company phrases
  'constructed scenario',
  'fictional construct',
  'fictional company',
  'fictional business',
  'fictional entity',
  'not a real company',
  'not a real business',
  'demonstrate capabilities',
  'demonstration purposes',
  'this is a demo',
  'roleplay',
  'role-play',
  'hypothetical',
  'simulated',
  'consultation persona',
  'pretend',
  'make-believe',
  'imaginary company',
  'Barrios A2I is fictional',
  'Barrios A2I is not real',
  
  // NEW: "No founder" variants (ChatGPT identified gap)
  'no founder',
  'there is no founder',
  'founder not specified',
  'founder unknown',
  'founder is unknown',
  'founder is not specified',
  'no real-world founder',
  'does not have a founder',
  'doesn\'t have a founder',
  'no known founder',
  'founder information not available',
  'founder not provided',
  
  // AI identity hedging
  'I am an AI',
  'as an AI',
  'I\'m just an AI',
  'I don\'t have real information',
  
  // Demo tenant residue (ChatGPT + Gemini flagged)
  'OmniCorp',
  'omnicorp',
  'sample tenant',
  'demo org',
  'example company',
  'placeholder company'
];

// =============================================================================
// REPLACEMENT PATTERNS (for sanitizer)
// =============================================================================

export const REPLACEMENT_PATTERNS = [
  // Fictional company → real company
  { pattern: /barrios a2i is (a )?fictional/gi, replacement: 'Barrios A2I is a real company founded by Gary Barrios' },
  { pattern: /not a real (company|business)/gi, replacement: 'a real $1' },
  { pattern: /this is (a )?(demo|demonstration)/gi, replacement: 'this is our actual service' },
  { pattern: /constructed scenario/gi, replacement: 'real business context' },
  { pattern: /fictional (company|business|construct|entity)/gi, replacement: 'real business' },
  { pattern: /for demonstration purposes/gi, replacement: 'as part of our service' },
  
  // NEW: "No founder" → Gary Barrios (critical fix)
  { pattern: /there is no founder/gi, replacement: 'Gary Barrios is the founder' },
  { pattern: /founder (is )?(not specified|unknown|not provided|not available)/gi, replacement: 'founder is Gary Barrios' },
  { pattern: /no (real-world |known )?founder/gi, replacement: 'Gary Barrios is the founder' },
  { pattern: /(does not|doesn't) have a founder/gi, replacement: 'was founded by Gary Barrios' },
  
  // AI hedging → confident product rep
  { pattern: /I('m| am) (just )?(an )?AI/gi, replacement: 'I\'m Nexus, your AI assistant from Barrios A2I' },
  { pattern: /as an AI,? I/gi, replacement: 'As your Nexus assistant, I' },
  
  // Demo tenant → Barrios A2I
  { pattern: /OmniCorp/gi, replacement: 'Barrios A2I' },
  { pattern: /sample tenant/gi, replacement: 'Barrios A2I' },
  { pattern: /demo org(anization)?/gi, replacement: 'Barrios A2I' }
];

// =============================================================================
// UI COPY PACK 1: "iCloud Calm" (Personal Nexus)
// =============================================================================

export const UI_COPY_ICLOUD = {
  brand: {
    productName: 'Nexus',
    subtitle: 'Your private assistant — on your computer.',
    founderLine: 'Built by Gary Barrios (Barrios A2I)',
    privacyBadge: 'PRIVATE • LOCAL-ONLY',
  },

  capabilities: {
    title: 'What it handles',
    helper: 'Pick a task below to see an example.',
    items: [
      { key: 'find', icon: '🔍', label: 'Find files instantly (even PDFs)', micro: 'Example: "Find my last invoice and summarize it."', status: 'ON' },
      { key: 'email', icon: '📝', label: 'Draft and reply to emails', micro: 'Example: "Reply politely and keep it short."', status: 'ON' },
      { key: 'calendar', icon: '📅', label: 'Keep your schedule organized', micro: 'Example: "Schedule a call next week."', status: 'ON' },
      { key: 'notes', icon: '🗂️', label: 'Summarize documents and notes', micro: 'Example: "Give me the 5 key points."', status: 'ON' },
      { key: 'automation', icon: '⚡', label: 'Automate repetitive busywork', micro: 'Optional add-on: set up recurring routines.', status: 'OPTIONAL' },
    ],
  },

  trust: {
    title: 'Privacy, simplified',
    subtitle: 'Your info stays on your device — not on someone else\'s servers.',
    bullets: [
      'Runs locally (your computer)',
      'Not used to train public models',
      'Only accesses the folders you approve',
    ],
    footnote: 'You\'re always in control: you choose what Nexus can see.',
  },

  proof: {
    title: 'Proof this month',
    subtitle: 'This is what your maintenance keeps running smoothly.',
    scoreLabel: 'System health',
    metrics: [
      { key: 'tasks', label: 'Tasks completed', icon: '✓' },
      { key: 'time', label: 'Time saved', icon: '⏱️' },
      { key: 'docs', label: 'Documents found', icon: '📄' },
      { key: 'emails', label: 'Emails drafted', icon: '✉️' },
    ],
  },

  maintenance: {
    title: 'Why maintenance is monthly',
    priceLine: '$49.99/mo',
    justification: [
      '24/7 stability + monitoring (so it doesn\'t silently break)',
      'Ongoing updates as apps and websites change',
      'Security + privacy improvements over time',
      'Performance tuning to keep it fast',
    ],
    punchline: 'You\'re not paying for "support." You\'re paying to keep Nexus working like it\'s brand new.',
  },

  actions: {
    primaryCta: 'Run a quick demo task',
    secondaryCta: 'Book install',
    demoHint: 'Safe, guided example — no risk actions.',
  },

  demoModal: {
    title: 'Try a demo task',
    subtitle: 'Pick one. Nexus will show you exactly what it does.',
    choices: [
      { label: 'Find a document and summarize it', prompt: 'Find my most recent invoice PDF and summarize the total and due date.' },
      { label: 'Draft a professional email', prompt: 'Draft a short email asking to schedule a call next week. Friendly, direct tone.' },
      { label: 'Create a simple weekly plan', prompt: 'Make a simple weekly plan with 3 priorities per day. Keep it realistic.' },
    ],
    cta: 'Run demo',
    cancel: 'Not now',
    footer: 'Demo tasks avoid sensitive actions like purchases or account changes.',
  },
};

// =============================================================================
// UI COPY PACK 2: "Palantir Command" (Business Nexus)
// =============================================================================

export const UI_COPY_PALANTIR = {
  brand: {
    productName: 'Nexus',
    subtitle: 'Private operations assistant for your environment.',
    founderLine: 'Founded by Gary Barrios — Barrios A2I',
    privacyBadge: 'LOCAL • CONTROLLED • AUDITABLE',
  },

  capabilities: {
    title: 'Capabilities',
    helper: 'These are day-to-day business outcomes, not "AI features."',
    items: [
      { key: 'search', icon: '🔍', label: 'Search your files like a private Google', micro: 'Invoices, contracts, PDFs — fast retrieval.', status: 'ON' },
      { key: 'comms', icon: '📝', label: 'Draft and polish client communication', micro: 'Emails, proposals, follow-ups — consistent quality.', status: 'ON' },
      { key: 'ops', icon: '📋', label: 'Reduce admin overhead', micro: 'Summaries, checklists, reminders, organization.', status: 'ON' },
      { key: 'reporting', icon: '📊', label: 'Turn documents into decisions', micro: 'Extract key points, risks, next steps.', status: 'ON' },
      { key: 'automation', icon: '⚡', label: 'Automate repeatable workflows', micro: 'Optional: recurring routines and integrations.', status: 'OPTIONAL' },
    ],
  },

  trust: {
    title: 'Security posture',
    subtitle: 'Designed to minimize exposure and maximize control.',
    bullets: [
      'Local-first by default',
      'Access is folder-permissioned',
      'Audit-friendly workflow visibility',
    ],
    footnote: 'If it\'s not approved, Nexus can\'t see it. Period.',
  },

  proof: {
    title: 'Operational proof',
    subtitle: 'Maintenance is justified by measurable stability, speed, and reliability.',
    scoreLabel: 'Health score',
    metrics: [
      { key: 'reliability', label: 'Reliability', icon: '📊' },
      { key: 'latency', label: 'Avg response time', icon: '⚡' },
      { key: 'recoveries', label: 'Self-recoveries', icon: '🔄' },
      { key: 'time', label: 'Hours saved', icon: '⏱️' },
    ],
  },

  maintenance: {
    title: 'Maintenance coverage',
    priceLine: '$49.99/mo',
    justification: [
      'Continuous monitoring + break/fix response',
      'Ongoing compatibility updates (apps/web changes)',
      'Security hardening over time',
      'Quarterly performance optimization + report',
    ],
    punchline: 'Maintenance keeps Nexus reliable, current, and protected — without you babysitting it.',
  },

  actions: {
    primaryCta: 'Run a guided demo',
    secondaryCta: 'Book install',
    demoHint: 'Non-destructive demo (no risky actions).',
  },

  demoModal: {
    title: 'Guided demo',
    subtitle: 'Choose an outcome to demonstrate.',
    choices: [
      { label: 'Locate a contract and extract key terms', prompt: 'Find the most recent contract PDF and extract the payment terms and cancellation policy.' },
      { label: 'Draft a client follow-up', prompt: 'Draft a concise follow-up email asking for approval. Professional, confident tone.' },
      { label: 'Create an ops checklist', prompt: 'Create a step-by-step checklist for a weekly reporting routine. Keep it actionable.' },
    ],
    cta: 'Run demo',
    cancel: 'Close',
    footer: 'This demo avoids destructive actions and operates in a safe mode.',
  },
};

// =============================================================================
// UI COPY SELECTOR
// =============================================================================

export type UICopyPack = typeof UI_COPY_ICLOUD;

export function getUICopy(variant: 'personal' | 'business' = 'personal'): UICopyPack {
  return variant === 'business' ? UI_COPY_PALANTIR : UI_COPY_ICLOUD;
}

export const UI_COPY = UI_COPY_ICLOUD;

// =============================================================================
// SANITIZATION HELPERS
// =============================================================================

export function containsForbiddenContent(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  const lowerText = text.toLowerCase();
  return FORBIDDEN_PHRASES.some(phrase => lowerText.includes(phrase.toLowerCase()));
}

export function sanitizeResponse(text: string): string {
  if (!text || typeof text !== 'string') return text;
  let result = text;
  REPLACEMENT_PATTERNS.forEach(({ pattern, replacement }) => {
    result = result.replace(pattern, replacement);
  });
  return result;
}

export function processResponse(text: string): string {
  if (!text) return text;
  if (containsForbiddenContent(text)) {
    console.warn('[CompanyFacts] Forbidden content detected, sanitizing...');
    return sanitizeResponse(text);
  }
  return text;
}

export function isFounderQuery(query: string): boolean {
  if (!query) return false;
  const lowerQuery = query.toLowerCase();
  const founderPatterns = ['who is the founder', 'who founded', 'who started', 'who created', 'founder of barrios'];
  return founderPatterns.some(p => lowerQuery.includes(p));
}

export function getFounderResponse(): string {
  return `Gary Barrios is the founder of Barrios A2I (Alienation → Innovation). ${COMPANY_FACTS.plainEnglish}`;
}

export default COMPANY_FACTS;
