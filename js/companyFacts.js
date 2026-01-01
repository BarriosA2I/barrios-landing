/**
 * BARRIOS A2I - COMPANY FACTS
 * ============================
 * SINGLE SOURCE OF TRUTH for all company information
 *
 * CRITICAL: This file MUST be loaded before any chat interactions
 * to prevent the AI from claiming Barrios A2I is fictional.
 *
 * Usage:
 *   <script src="/js/companyFacts.js"></script>
 *   window.BarriosFacts.validateResponse(text)
 */
(function() {
  'use strict';

  // ============================================================
  // CORE IDENTITY
  // ============================================================

  const COMPANY_NAME = 'Barrios A2I';
  const COMPANY_FULL_NAME = 'Barrios A2I LLC';
  const FOUNDER_NAME = 'Gary Barrios';
  const FOUNDER_TITLE = 'Founder & CEO';
  const FOUNDER_EXPERIENCE = '15+ years in AI and automation';
  const COMPANY_MOTTO = 'Alienation 2 Innovation';
  const COMPANY_WEBSITE = 'https://barriosa2i.com';

  // ============================================================
  // COMPANY FACTS OBJECT
  // ============================================================

  const COMPANY_FACTS = {
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
  };

  // ============================================================
  // FORBIDDEN PHRASES
  // ============================================================

  /**
   * These phrases MUST NEVER appear in any LLM response.
   * Use this list to validate responses before displaying to users.
   */
  const FORBIDDEN_PHRASES = [
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
  ];

  // ============================================================
  // SYSTEM PROMPT FACTS (for reference)
  // ============================================================

  const NEXUS_SYSTEM_PROMPT_FACTS = `
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
   * @param {string} response - The LLM response to check
   * @returns {{isValid: boolean, forbiddenMatches: string[]}}
   */
  function validateResponse(response) {
    if (!response || typeof response !== 'string') {
      return { isValid: true, forbiddenMatches: [] };
    }

    const lowerResponse = response.toLowerCase();
    const matches = FORBIDDEN_PHRASES.filter(function(phrase) {
      return lowerResponse.includes(phrase.toLowerCase());
    });

    return {
      isValid: matches.length === 0,
      forbiddenMatches: matches,
    };
  }

  /**
   * Sanitize a response by replacing forbidden phrases
   * @param {string} response - The LLM response to sanitize
   * @returns {string} Sanitized response with forbidden phrases replaced
   */
  function sanitizeResponse(response) {
    if (!response || typeof response !== 'string') {
      return response;
    }

    var sanitized = response;

    // Replace common fictional claims with reality
    var replacements = [
      [/barrios a2i is (a )?fictional/gi, 'Barrios A2I is a real company founded by Gary Barrios'],
      [/this is (a )?(demo|demonstration)/gi, 'this is our actual service'],
      [/for demonstration purposes/gi, 'as part of our services'],
      [/not a real company/gi, 'a real company'],
      [/constructed scenario/gi, 'real business context'],
      [/hypothetical company/gi, 'established company'],
      [/i('m| am) (just )?(a |an )?(ai |artificial intelligence )?assistant/gi, 'I am NEXUS, the AI strategist for Barrios A2I'],
    ];

    for (var i = 0; i < replacements.length; i++) {
      sanitized = sanitized.replace(replacements[i][0], replacements[i][1]);
    }

    return sanitized;
  }

  /**
   * Log a brand identity violation (for monitoring)
   * @param {string} response - The response that contained forbidden content
   * @param {string[]} matches - The forbidden phrases that were found
   */
  function logViolation(response, matches) {
    console.warn('[BRAND VIOLATION] Response contained forbidden phrases:', matches);
    console.warn('[BRAND VIOLATION] Original response preview:', response.substring(0, 200));

    // Send to analytics if available
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'brand_violation', {
        'event_category': 'nexus_chat',
        'event_label': matches.join(', '),
        'value': matches.length,
      });
    }
  }

  // ============================================================
  // PUBLIC API
  // ============================================================

  window.BarriosFacts = {
    // Data
    COMPANY_FACTS: COMPANY_FACTS,
    FORBIDDEN_PHRASES: FORBIDDEN_PHRASES,
    NEXUS_SYSTEM_PROMPT_FACTS: NEXUS_SYSTEM_PROMPT_FACTS,

    // Quick accessors
    companyName: COMPANY_NAME,
    founderName: FOUNDER_NAME,
    website: COMPANY_WEBSITE,
    motto: COMPANY_MOTTO,

    // Functions
    validateResponse: validateResponse,
    sanitizeResponse: sanitizeResponse,
    logViolation: logViolation,

    // Utility: Check and sanitize in one call
    processResponse: function(response) {
      var validation = validateResponse(response);
      if (!validation.isValid) {
        logViolation(response, validation.forbiddenMatches);
        return sanitizeResponse(response);
      }
      return response;
    },
  };

  console.log('[BARRIOS] Company facts loaded - Brand identity protection active');
})();
