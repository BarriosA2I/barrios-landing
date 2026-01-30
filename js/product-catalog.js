// =============================================================================
// BARRIOS A2I - STRIPE PRODUCT CATALOG CONFIGURATION
// Complete product/price mapping for Commercial Lab, Nexus, and all add-ons
// =============================================================================

// Tier Feature Mapping - V2 PERFORMANCE ENGINE PRICING
const TIER_FEATURES = {
  RAPID_PILOT: {
    tokens: 8,
    maxFormats: 2,
    maxRevisions: 1,
    queuePriority: 'STANDARD',
    queueDays: 5,
    voiceClone: false,
    avatarClone: false,
    isOneTime: true,
  },
  PROTOTYPER: {
    monthlyTokens: 16,
    maxFormats: 2,
    maxRevisions: 1,
    queuePriority: 'STANDARD',
    queueDays: 4,
    voiceClone: false,
    avatarClone: false,
  },
  GROWTH: {
    monthlyTokens: 40,
    maxFormats: 4,
    maxRevisions: 2,
    queuePriority: 'PRIORITY',
    queueDays: 2,
    voiceClone: false,
    avatarClone: false,
  },
  SCALE: {
    monthlyTokens: 96,
    maxFormats: 4,
    maxRevisions: 4,
    queuePriority: 'RUSH',
    queueDays: 1,
    voiceClone: true,
    avatarClone: true,
    premiumClones: true,
  },
};

// Product Catalog - V2 PERFORMANCE ENGINE PRICING
const PRODUCT_CATALOG = [
  // COMMERCIAL LAB SUBSCRIPTIONS - V2 PERFORMANCE ENGINE
  {
    id: 'prod_TsijBRlNjstjQQ',
    name: 'Commercial Lab - Rapid Pilot',
    description: '8 tokens (1 commercial), 1 CTA variant swap included, 1 revision round, 5-day turnaround, 2 formats (9:16 + 16:9). 100% credited toward first month if upgrade within 7 days',
    category: 'COMMERCIAL_LAB',
    metadata: {
      tier: 'RAPID_PILOT',
      tokens: '8',
      maxFormats: '2',
      maxRevisions: '1',
      queuePriority: 'STANDARD',
      queueDays: '5',
      voiceClone: 'false',
      avatarClone: 'false',
      isOneTime: 'true',
    },
    features: [
      '8 Commercial Tokens (1 Commercial)',
      '2 Formats (9:16 + 16:9)',
      '1 Revision Round',
      '5-Day Turnaround',
      '1 CTA Variant Swap',
      '100% Credit on Upgrade',
    ],
    prices: [
      {
        id: 'price_1SuxIMLyFGkLiU4CBoIEIfs8',
        nickname: 'Rapid Pilot',
        unitAmount: 29900,
        currency: 'usd',
        metadata: { type: 'one_time', tier: 'RAPID_PILOT' },
      },
    ],
  },
  {
    id: 'prod_TsifPU8AtmGacQ',
    name: 'Commercial Lab - Prototyper',
    description: '16 tokens (2 commercials), 2 formats (9:16 + 16:9), 1 revision round, 4-day turnaround, captions included',
    category: 'COMMERCIAL_LAB',
    metadata: {
      tier: 'PROTOTYPER',
      monthlyTokens: '16',
      maxFormats: '2',
      maxRevisions: '1',
      queuePriority: 'STANDARD',
      queueDays: '4',
      voiceClone: 'false',
      avatarClone: 'false',
    },
    features: [
      '16 Commercial Tokens / Month',
      '2 Formats (9:16 + 16:9)',
      '1 Revision Round',
      '4-Day Turnaround',
      'Captions Included',
    ],
    prices: [
      {
        id: 'price_1SuxDoLyFGkLiU4CxxLjgoZq',
        nickname: 'Prototyper Monthly',
        unitAmount: 59900,
        currency: 'usd',
        recurring: { interval: 'month', intervalCount: 1 },
        metadata: { interval: 'monthly', tier: 'PROTOTYPER' },
      },
    ],
  },
  {
    id: 'prod_TsihSVy6TuDqQS',
    name: 'Commercial Lab - Growth',
    description: '40 tokens (5 commercials), 4 formats (9:16, 16:9, 1:1, 4:5), 2 revision rounds, 2-day turnaround, A/B hook variants, captions included',
    category: 'COMMERCIAL_LAB',
    metadata: {
      tier: 'GROWTH',
      monthlyTokens: '40',
      maxFormats: '4',
      maxRevisions: '2',
      queuePriority: 'PRIORITY',
      queueDays: '2',
      voiceClone: 'false',
      avatarClone: 'false',
    },
    features: [
      '40 Commercial Tokens / Month',
      '4 Formats (9:16, 16:9, 1:1, 4:5)',
      '2 Revision Rounds',
      '48-Hour Priority Queue',
      'A/B Hook Variants',
      'Captions Included',
    ],
    prices: [
      {
        id: 'price_1SuxFnLyFGkLiU4CzqWvv9DR',
        nickname: 'Growth Monthly',
        unitAmount: 119900,
        currency: 'usd',
        recurring: { interval: 'month', intervalCount: 1 },
        metadata: { interval: 'monthly', tier: 'GROWTH' },
      },
    ],
  },
  {
    id: 'prod_TsihDQL1l9FesH',
    name: 'Commercial Lab - Scale',
    description: '96 tokens (12 commercials), all formats, 4 revision rounds, 24-hour priority turnaround, voice clone included ($199 value), avatar clone included ($999 value), captions included',
    category: 'COMMERCIAL_LAB',
    metadata: {
      tier: 'SCALE',
      monthlyTokens: '96',
      maxFormats: '4',
      maxRevisions: '4',
      queuePriority: 'RUSH',
      queueDays: '1',
      voiceClone: 'true',
      avatarClone: 'true',
      premiumClones: 'true',
    },
    features: [
      '96 Commercial Tokens / Month',
      'All Formats',
      '4 Revision Rounds',
      '24-Hour Priority Queue',
      'Voice Clone Included ($199 value)',
      'Avatar Clone Included ($999 value)',
    ],
    prices: [
      {
        id: 'price_1SuxGQLyFGkLiU4CiDiAEkOD',
        nickname: 'Scale Monthly',
        unitAmount: 249900,
        currency: 'usd',
        recurring: { interval: 'month', intervalCount: 1 },
        metadata: { interval: 'monthly', tier: 'SCALE' },
      },
    ],
  },

  // ONE-TIME: LAB TEST
  {
    id: 'prod_single_lab_test',
    name: 'Single Lab Test',
    description: 'One-time AI commercial production - Test the system before subscribing',
    category: 'LAB_ONE_TIME',
    metadata: { type: 'lab_test', tokens: '8', formats: '1', revisions: '1' },
    prices: [
      {
        id: 'price_single_lab_test',
        nickname: 'Single Lab Test',
        unitAmount: 50000,
        currency: 'usd',
        metadata: { type: 'one_time' },
      },
    ],
  },

  // IDENTITY ADD-ONS
  {
    id: 'prod_voice_clone',
    name: 'Voice Clone',
    description: 'Custom AI voice clone from your samples',
    category: 'IDENTITY_ADDONS',
    metadata: { type: 'clone', cloneType: 'voice' },
    prices: [
      {
        id: 'price_voice_clone',
        nickname: 'Voice Clone',
        unitAmount: 29900,
        currency: 'usd',
        metadata: { type: 'one_time' },
      },
    ],
  },
  {
    id: 'prod_avatar_clone',
    name: 'Avatar Clone',
    description: 'Custom AI avatar clone from your likeness',
    category: 'IDENTITY_ADDONS',
    metadata: { type: 'clone', cloneType: 'avatar', isPremium: 'false' },
    prices: [
      {
        id: 'price_avatar_clone',
        nickname: 'Avatar Clone',
        unitAmount: 149900,
        currency: 'usd',
        metadata: { type: 'one_time' },
      },
    ],
  },
  {
    id: 'prod_additional_avatar',
    name: 'Additional Avatar',
    description: 'Additional AI avatar for existing subscribers',
    category: 'IDENTITY_ADDONS',
    metadata: { type: 'clone', cloneType: 'avatar', isAdditional: 'true' },
    prices: [
      {
        id: 'price_additional_avatar',
        nickname: 'Additional Avatar',
        unitAmount: 99900,
        currency: 'usd',
        metadata: { type: 'one_time' },
      },
    ],
  },
  {
    id: 'prod_voice_avatar_bundle',
    name: 'Voice + Avatar Bundle',
    description: 'Bundled voice and avatar clone at a discount',
    category: 'IDENTITY_ADDONS',
    metadata: { type: 'bundle', includes: 'voice,avatar', savings: '199' },
    prices: [
      {
        id: 'price_voice_avatar_bundle',
        nickname: 'Voice + Avatar Bundle',
        unitAmount: 159900,
        currency: 'usd',
        metadata: { type: 'one_time' },
      },
    ],
  },

  // PRIORITY ADD-ONS
  {
    id: 'prod_rush_delivery',
    name: 'Rush Delivery',
    description: 'Expedite your commercial to 24-hour delivery',
    category: 'PRIORITY_ADDONS',
    metadata: { type: 'priority', upgradeTo: 'RUSH' },
    prices: [
      {
        id: 'price_rush_delivery',
        nickname: 'Rush Delivery',
        unitAmount: 24900,
        currency: 'usd',
        metadata: { type: 'one_time' },
      },
    ],
  },
  {
    id: 'prod_priority_queue_48h',
    name: '48-Hour Priority Queue',
    description: 'Upgrade to 48-hour queue for next commercial',
    category: 'PRIORITY_ADDONS',
    metadata: { type: 'priority', upgradeTo: 'PRIORITY' },
    prices: [
      {
        id: 'price_priority_queue_48h',
        nickname: '48-Hour Priority Queue',
        unitAmount: 30900,
        currency: 'usd',
        metadata: { type: 'one_time' },
      },
    ],
  },

  // TOKEN PACKS
  {
    id: 'prod_token_pack_8',
    name: '8 Token Pack',
    description: '8 additional commercial tokens (1 full commercial)',
    category: 'TOKEN_PACKS',
    metadata: { type: 'tokens', tokenCount: '8' },
    prices: [
      {
        id: 'price_token_pack_8',
        nickname: '8 Token Pack',
        unitAmount: 44900,
        currency: 'usd',
        metadata: { type: 'one_time', tokens: '8' },
      },
    ],
  },
  {
    id: 'prod_token_pack_16',
    name: '16 Token Pack',
    description: '16 additional commercial tokens (2 commercials)',
    category: 'TOKEN_PACKS',
    metadata: { type: 'tokens', tokenCount: '16' },
    prices: [
      {
        id: 'price_token_pack_16',
        nickname: '16 Token Pack',
        unitAmount: 79900,
        currency: 'usd',
        metadata: { type: 'one_time', tokens: '16' },
      },
    ],
  },
  {
    id: 'prod_token_pack_32',
    name: '32 Token Pack',
    description: '32 additional commercial tokens (4 commercials)',
    category: 'TOKEN_PACKS',
    metadata: { type: 'tokens', tokenCount: '32' },
    prices: [
      {
        id: 'price_token_pack_32',
        nickname: '32 Token Pack',
        unitAmount: 149900,
        currency: 'usd',
        metadata: { type: 'one_time', tokens: '32' },
      },
    ],
  },

  // EXTRAS
  {
    id: 'prod_revision_pack',
    name: 'Extra Revision Pack',
    description: '3 additional revisions for any commercial',
    category: 'EXTRAS',
    metadata: { type: 'revisions', revisionCount: '3' },
    prices: [
      {
        id: 'price_revision_pack',
        nickname: 'Extra Revision Pack',
        unitAmount: 14900,
        currency: 'usd',
        metadata: { type: 'one_time' },
      },
    ],
  },
  {
    id: 'prod_variant_pack',
    name: 'Variant Pack',
    description: 'Generate 3 variations of your commercial',
    category: 'EXTRAS',
    metadata: { type: 'variants', variantCount: '3' },
    prices: [
      {
        id: 'price_variant_pack',
        nickname: 'Variant Pack',
        unitAmount: 9900,
        currency: 'usd',
        metadata: { type: 'one_time' },
      },
    ],
  },

  // NEXUS PERSONAL
  {
    id: 'prod_nexus_installation',
    name: 'Nexus Personal - Installation',
    description: 'One-time setup of your personal AI assistant ecosystem',
    category: 'NEXUS_PERSONAL',
    metadata: { type: 'installation', isRecurring: 'false' },
    prices: [
      {
        id: 'price_nexus_installation',
        nickname: 'Nexus Installation',
        unitAmount: 75900,
        currency: 'usd',
        metadata: { type: 'one_time' },
      },
    ],
  },
  {
    id: 'prod_nexus_maintenance',
    name: 'Nexus Personal - Maintenance',
    description: 'Monthly maintenance and updates for Nexus Personal',
    category: 'NEXUS_PERSONAL',
    metadata: { type: 'maintenance', isRecurring: 'true' },
    prices: [
      {
        id: 'price_nexus_maintenance',
        nickname: 'Nexus Maintenance',
        unitAmount: 4999,
        currency: 'usd',
        recurring: { interval: 'month', intervalCount: 1 },
        metadata: { type: 'subscription' },
      },
    ],
  },
  {
    id: 'prod_nexus_house_call',
    name: 'Nexus House Call',
    description: 'In-person setup assistance',
    category: 'NEXUS_PERSONAL',
    metadata: { type: 'addon', addonType: 'house_call' },
    prices: [
      {
        id: 'price_nexus_house_call',
        nickname: 'House Call',
        unitAmount: 15000,
        currency: 'usd',
        metadata: { type: 'one_time' },
      },
    ],
  },
  {
    id: 'prod_nexus_family_training',
    name: 'Nexus Family Training',
    description: 'Extended training session for family members',
    category: 'NEXUS_PERSONAL',
    metadata: { type: 'addon', addonType: 'family_training' },
    prices: [
      {
        id: 'price_nexus_family_training',
        nickname: 'Family Training',
        unitAmount: 9900,
        currency: 'usd',
        metadata: { type: 'one_time' },
      },
    ],
  },
  {
    id: 'prod_nexus_priority_setup',
    name: 'Nexus Priority Setup',
    description: 'Skip the queue with priority installation scheduling',
    category: 'NEXUS_PERSONAL',
    metadata: { type: 'addon', addonType: 'priority_setup' },
    prices: [
      {
        id: 'price_nexus_priority_setup',
        nickname: 'Priority Setup',
        unitAmount: 7500,
        currency: 'usd',
        metadata: { type: 'one_time' },
      },
    ],
  },

  // CONSULTATION SERVICES
  {
    id: 'prod_consultation_strategy',
    name: 'AI Strategy Consultation',
    description: '45-minute deep dive into your AI architecture. Fee credited back if you subscribe to Scale tier within 30 days.',
    category: 'CONSULTATION',
    metadata: {
      type: 'service',
      consultationType: 'STRATEGY_45',
      duration: '45',
      platform: 'google_meet',
      calendlyEventSlug: 'barrios-strategy-45',
      creditableTiers: 'SCALE,GROWTH',
    },
    features: [
      '45-minute 1:1 session with Gary',
      'Custom architecture recommendations',
      'Video commercials feasibility analysis',
      'Fee credited to Scale/Growth subscription',
      'Recorded session (yours to keep)',
    ],
    prices: [
      {
        id: 'price_consultation_strategy',
        nickname: 'Strategy Session',
        unitAmount: 25000,
        currency: 'usd',
        metadata: {
          type: 'one_time',
          intent: 'CONSULTATION',
          consultationType: 'STRATEGY_45',
        },
      },
    ],
  },
  {
    id: 'prod_consultation_architecture',
    name: 'Enterprise Architecture Review',
    description: '90-minute comprehensive architecture review with implementation roadmap. Perfect for scaling AI automation.',
    category: 'CONSULTATION',
    metadata: {
      type: 'service',
      consultationType: 'ARCHITECTURE_90',
      duration: '90',
      platform: 'google_meet',
      calendlyEventSlug: 'barrios-architecture-90',
      creditableTiers: 'SCALE',
    },
    features: [
      '90-minute deep architecture session',
      'Multi-agent system design review',
      'Custom integration roadmap',
      'Written architecture document',
      'Fee credited to Scale subscription',
      '30-day email follow-up included',
    ],
    prices: [
      {
        id: 'price_consultation_architecture',
        nickname: 'Architecture Review',
        unitAmount: 50000,
        currency: 'usd',
        metadata: {
          type: 'one_time',
          intent: 'CONSULTATION',
          consultationType: 'ARCHITECTURE_90',
        },
      },
    ],
  },
  {
    id: 'prod_consultation_enterprise',
    name: 'Enterprise Discovery Session',
    description: 'Complimentary 30-minute discovery call for enterprise inquiries ($50K+ projects).',
    category: 'CONSULTATION',
    metadata: {
      type: 'service',
      consultationType: 'ENTERPRISE',
      duration: '30',
      platform: 'google_meet',
      calendlyEventSlug: 'barrios-enterprise-discovery',
      isFree: 'true',
    },
    features: [
      '30-minute discovery call',
      'Enterprise requirements analysis',
      'Custom pricing discussion',
      'NDA available upon request',
    ],
    prices: [
      {
        id: 'price_consultation_enterprise',
        nickname: 'Enterprise Discovery',
        unitAmount: 0,
        currency: 'usd',
        metadata: {
          type: 'one_time',
          intent: 'CONSULTATION',
          consultationType: 'ENTERPRISE',
          isFree: 'true',
        },
      },
    ],
  },
];

// Calendly URL mapping
const CALENDLY_URLS = {
  STRATEGY_45: 'https://calendly.com/barrios-a2i/strategy-45',
  ARCHITECTURE_90: 'https://calendly.com/barrios-a2i/architecture-90',
  ENTERPRISE: 'https://calendly.com/barrios-a2i/enterprise-discovery',
};

// Helper Functions
function getProductByPriceId(priceId) {
  return PRODUCT_CATALOG.find((product) =>
    product.prices.some((price) => price.id === priceId)
  );
}

function getPriceById(priceId) {
  for (const product of PRODUCT_CATALOG) {
    const price = product.prices.find((p) => p.id === priceId);
    if (price) return price;
  }
  return undefined;
}

function getSubscriptionTiers() {
  return PRODUCT_CATALOG.filter((p) => p.category === 'COMMERCIAL_LAB');
}

function getTierFeatures(tier) {
  return TIER_FEATURES[tier];
}

function getConsultationProducts() {
  return PRODUCT_CATALOG.filter((p) => p.category === 'CONSULTATION');
}

function getTokenPacks() {
  return PRODUCT_CATALOG.filter((p) => p.category === 'TOKEN_PACKS');
}

function getProductsByIntent(intent) {
  switch (intent) {
    case 'SUBSCRIPTION':
      return PRODUCT_CATALOG.filter((p) => p.category === 'COMMERCIAL_LAB');
    case 'CONSULTATION':
      return PRODUCT_CATALOG.filter((p) => p.category === 'CONSULTATION');
    case 'TOP_UP':
      return PRODUCT_CATALOG.filter((p) => p.category === 'TOKEN_PACKS');
    case 'UPGRADE':
      return PRODUCT_CATALOG.filter((p) => p.category === 'COMMERCIAL_LAB');
    case 'ENTERPRISE':
      return PRODUCT_CATALOG.filter(
        (p) =>
          p.category === 'ENTERPRISE' ||
          (p.category === 'CONSULTATION' && p.metadata.consultationType === 'ENTERPRISE')
      );
    default:
      return PRODUCT_CATALOG;
  }
}

function isConsultationCreditableToTier(consultationType, targetTier) {
  const consultation = PRODUCT_CATALOG.find(
    (p) => p.category === 'CONSULTATION' && p.metadata.consultationType === consultationType
  );

  if (!consultation) return false;

  const creditableTiers = consultation.metadata.creditableTiers?.split(',') ?? [];
  return creditableTiers.includes(targetTier);
}

function formatPrice(amountCents) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amountCents / 100);
}

// Export for browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PRODUCT_CATALOG,
    TIER_FEATURES,
    CALENDLY_URLS,
    getProductByPriceId,
    getPriceById,
    getSubscriptionTiers,
    getTierFeatures,
    getConsultationProducts,
    getTokenPacks,
    getProductsByIntent,
    isConsultationCreditableToTier,
    formatPrice,
  };
}
