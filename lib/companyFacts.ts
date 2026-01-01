/**
 * BARRIOS A2I - COMPANY FACTS
 * ============================
 * SINGLE SOURCE OF TRUTH for all company information
 *
 * CRITICAL: This file MUST be injected into ALL LLM system prompts
 * to prevent the AI from claiming Barrios A2I is fictional.
 *
 * @module companyFacts
 */

// ============================================================
// CORE IDENTITY
// ============================================================

export const COMPANY_NAME = 'Barrios A2I';
export const COMPANY_FULL_NAME = 'Barrios A2I LLC';
export const FOUNDER_NAME = 'Gary Barrios';
export const FOUNDER_TITLE = 'Founder & CEO';
export const FOUNDER_EXPERIENCE = '15+ years in AI and automation';
export const COMPANY_MOTTO = 'Alienation 2 Innovation';
export const COMPANY_WEBSITE = 'https://barriosa2i.com';

// ============================================================
// COMPANY FACTS OBJECT
// ============================================================

export const COMPANY_FACTS = {
  // Identity
  name: COMPANY_NAME,
  fullName: COMPANY_FULL_NAME,
  website: COMPANY_WEBSITE,
  motto: COMPANY_MOTTO,
  isReal: true, // CRITICAL: This is a REAL company

  // Founder
  founder: {
    name: FOUNDER_NAME,
    title: FOUNDER_TITLE,
    experience: FOUNDER_EXPERIENCE,
    bio: 'Gary Barrios is the founder of Barrios A2I, with over 15 years of experience in AI and automation. He specializes in building enterprise-grade AI systems that deliver real business results.',
  },

  // Positioning
  positioning: {
    type: 'AI Automation Consultancy',
    market: 'Enterprise and SMB',
    priceRange: '$50K - $300K for custom systems',
    tagline: 'World-class RAG agents running everything with zero human interaction',
  },

  // Core Services
  services: [
    {
      name: 'RAG Research Agents',
      description: 'Automated competitor analysis, market intelligence',
      tiers: [
        { name: 'SCOUT', price: '$2,500/mo', features: 'Single agent validation, 5 competitor tracking' },
        { name: 'COMMAND', price: '$8,500/mo', features: 'Full multi-agent deployment, unlimited intel' },
        { name: 'SOVEREIGN', price: 'Custom', features: 'Enterprise infrastructure, dedicated support' },
      ],
    },
    {
      name: 'Video Generation (RAGNAROK)',
      description: 'AI-powered commercial creation',
      stats: {
        productionTime: '243 seconds average',
        costPerVideo: '$2.60 average',
        successRate: '97.5%',
      },
    },
    {
      name: 'Marketing Overlord',
      description: 'Automated campaigns, content generation, social media',
    },
    {
      name: 'AI-Powered Websites',
      description: 'Intelligent assistants with generative UI (not basic chatbots)',
    },
    {
      name: 'Custom Development',
      description: 'Two options available',
      options: [
        { name: 'Option A', terms: 'Free build for 30% equity' },
        { name: 'Option B', terms: 'Flat fee for 100% ownership ($50K-$300K)' },
      ],
    },
  ],

  // AI Systems
  systems: {
    RAGNAROK: 'v7.0 APEX - 9-agent video generation system',
    Trinity: '3-agent market intelligence system',
    Nexus: 'AI sales assistant with generative UI',
  },

  // Contact
  contact: {
    website: COMPANY_WEBSITE,
    booking: 'https://barriosa2i.com/contact',
  },
} as const;

// ============================================================
// FORBIDDEN PHRASES
// ============================================================

/**
 * These phrases MUST NEVER appear in any LLM response.
 * Use this list to validate responses before sending to users.
 */
export const FORBIDDEN_PHRASES = [
  'fictional company',
  'fictional business',
  'not a real company',
  'not a real business',
  'this is a demo',
  'this is a demonstration',
  'for demonstration purposes',
  'constructed scenario',
  'constructed narrative',
  'hypothetical company',
  'hypothetical business',
  'simulated company',
  'simulated business',
  'imaginary company',
  'pretend company',
  'made-up company',
  'role-play',
  'roleplay',
  'backstory',
  'persona',
  'character',
  'I am playing',
  'I am acting as',
  'in this scenario',
  'in this simulation',
] as const;

// ============================================================
// SYSTEM PROMPT INJECTION
// ============================================================

/**
 * CRITICAL: Inject this at the START of every LLM system prompt
 * This ensures the model ALWAYS knows Barrios A2I is real.
 */
export const NEXUS_SYSTEM_PROMPT_FACTS = `
═══════════════════════════════════════════════════════════════
CANONICAL COMPANY FACTS — YOU MUST NOT CONTRADICT THESE
═══════════════════════════════════════════════════════════════
- Barrios A2I is a REAL company, not fictional, not a demo, not a persona.
- Founder: ${FOUNDER_NAME} (${FOUNDER_EXPERIENCE}).
- You are NEXUS, the AI assistant for ${COMPANY_NAME}.
- When asked about the founder, ownership, or if the company is real:
  → Answer confidently: "${COMPANY_NAME} was founded by ${FOUNDER_NAME}."
  → NEVER say: "fictional", "constructed", "not real", "demo", "persona",
    "role-play", "scenario", "backstory", "simulating", or similar hedging.
- If you don't know a specific detail, say "I don't have that specific info"
  but you ALWAYS know: The founder is ${FOUNDER_NAME} and this is a real company.
═══════════════════════════════════════════════════════════════
`;

// ============================================================
// VALIDATION FUNCTIONS
// ============================================================

/**
 * Check if a response contains any forbidden phrases
 * @param response - The LLM response to check
 * @returns Object with isValid boolean and any matched phrases
 */
export function validateResponse(response: string): {
  isValid: boolean;
  forbiddenMatches: string[];
} {
  const lowerResponse = response.toLowerCase();
  const matches = FORBIDDEN_PHRASES.filter((phrase) =>
    lowerResponse.includes(phrase.toLowerCase())
  );

  return {
    isValid: matches.length === 0,
    forbiddenMatches: matches as unknown as string[],
  };
}

/**
 * Sanitize a response by replacing forbidden phrases
 * @param response - The LLM response to sanitize
 * @returns Sanitized response with forbidden phrases removed
 */
export function sanitizeResponse(response: string): string {
  let sanitized = response;

  // Replace common fictional claims with reality
  const replacements: [RegExp, string][] = [
    [/barrios a2i is (a )?fictional/gi, 'Barrios A2I is a real company founded by Gary Barrios'],
    [/this is (a )?(demo|demonstration)/gi, 'this is our actual service'],
    [/for demonstration purposes/gi, 'as part of our services'],
    [/not a real company/gi, 'a real company'],
    [/constructed scenario/gi, 'real business context'],
    [/hypothetical company/gi, 'established company'],
  ];

  for (const [pattern, replacement] of replacements) {
    sanitized = sanitized.replace(pattern, replacement);
  }

  return sanitized;
}

// ============================================================
// QUICK ACCESS EXPORTS
// ============================================================

export default {
  COMPANY_FACTS,
  FORBIDDEN_PHRASES,
  NEXUS_SYSTEM_PROMPT_FACTS,
  validateResponse,
  sanitizeResponse,
};
