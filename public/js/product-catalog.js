// =============================================================================
// BARRIOS A2I - STRIPE PRODUCT CATALOG CONFIGURATION
// Complete product/price mapping for Commercial Lab, Nexus, and all add-ons
// =============================================================================

// Tier Feature Mapping
const TIER_FEATURES = {
  STARTER: {
    monthlyTokens: 8,
    maxFormats: 1,
    maxRevisions: 1,
    queuePriority: 'STANDARD',
    queueDays: 5,
    voiceClone: false,
    avatarClone: false,
  },
  CREATOR: {
    monthlyTokens: 18,
    maxFormats: 4,
    maxRevisions: 2,
    queuePriority: 'EXPEDITED',
    queueDays: 3,
    voiceClone: true,
    avatarClone: false,
  },
  GROWTH: {
    monthlyTokens: 32,
    maxFormats: 4,
    maxRevisions: 3,
    queuePriority: 'PRIORITY',
    queueDays: 2,
    voiceClone: true,
    avatarClone: true,
  },
  SCALE: {
    monthlyTokens: 64,
    maxFormats: 4,
    maxRevisions: 5,
    queuePriority: 'RUSH',
    queueDays: 1,
    voiceClone: true,
    avatarClone: true,
    premiumClones: true,
  },
};

// Product Catalog - 24 products across 9 categories
const PRODUCT_CATALOG = [
  // COMMERCIAL LAB SUBSCRIPTIONS
  {
    id: 'prod_commercial_lab_starter',
    name: 'Commercial Lab - Starter',
    description: 'AI Commercial Production - Entry tier with 8 tokens/month',
    category: 'COMMERCIAL_LAB',
    metadata: {
      tier: 'STARTER',
      monthlyTokens: '8',
      maxFormats: '1',
      maxRevisions: '1',
      queuePriority: 'STANDARD',
      queueDays: '5',
      voiceClone: 'false',
      avatarClone: 'false',
    },
    features: [
      '8 Commercial Tokens / Month',
      '1 Format',
      '1 Revision per Commercial',
      '5-Day Queue',
    ],
    prices: [
      {
        id: 'price_starter_monthly',
        nickname: 'Starter Monthly',
        unitAmount: 44900,
        currency: 'usd',
        recurring: { interval: 'month', intervalCount: 1 },
        metadata: { interval: 'monthly', tier: 'STARTER' },
      },
      {
        id: 'price_starter_yearly',
        nickname: 'Starter Yearly',
        unitAmount: 447204,
        currency: 'usd',
        recurring: { interval: 'year', intervalCount: 1 },
        metadata: { interval: 'yearly', tier: 'STARTER', discount: '17' },
      },
    ],
  },
  {
    id: 'prod_commercial_lab_creator',
    name: 'Commercial Lab - Creator',
    description: 'AI Commercial Production - Creator tier with 18 tokens/month and voice cloning',
    category: 'COMMERCIAL_LAB',
    metadata: {
      tier: 'CREATOR',
      monthlyTokens: '18',
      maxFormats: '4',
      maxRevisions: '2',
      queuePriority: 'EXPEDITED',
      queueDays: '3',
      voiceClone: 'true',
      avatarClone: 'false',
    },
    features: [
      '18 Commercial Tokens / Month',
      '4 Formats',
      '2 Revisions per Commercial',
      '3-Day Queue',
      'Voice Clone Included',
    ],
    prices: [
      {
        id: 'price_creator_monthly',
        nickname: 'Creator Monthly',
        unitAmount: 89900,
        currency: 'usd',
        recurring: { interval: 'month', intervalCount: 1 },
        metadata: { interval: 'monthly', tier: 'CREATOR' },
      },
      {
        id: 'price_creator_yearly',
        nickname: 'Creator Yearly',
        unitAmount: 895404,
        currency: 'usd',
        recurring: { interval: 'year', intervalCount: 1 },
        metadata: { interval: 'yearly', tier: 'CREATOR', discount: '17' },
      },
    ],
  },
  {
    id: 'prod_commercial_lab_growth',
    name: 'Commercial Lab - Growth',
    description: 'AI Commercial Production - Growth tier with 32 tokens/month, voice & avatar cloning',
    category: 'COMMERCIAL_LAB',
    metadata: {
      tier: 'GROWTH',
      monthlyTokens: '32',
      maxFormats: '4',
      maxRevisions: '3',
      queuePriority: 'PRIORITY',
      queueDays: '2',
      voiceClone: 'true',
      avatarClone: 'true',
    },
    features: [
      '32 Commercial Tokens / Month',
      '4 Formats',
      '3 Revisions per Commercial',
      '48-Hour Priority Queue',
      'Voice Clone Included',
      'Avatar Clone Included',
    ],
    prices: [
      {
        id: 'price_growth_monthly',
        nickname: 'Growth Monthly',
        unitAmount: 169900,
        currency: 'usd',
        recurring: { interval: 'month', intervalCount: 1 },
        metadata: { interval: 'monthly', tier: 'GROWTH' },
      },
      {
        id: 'price_growth_yearly',
        nickname: 'Growth Yearly',
        unitAmount: 1692204,
        currency: 'usd',
        recurring: { interval: 'year', intervalCount: 1 },
        metadata: { interval: 'yearly', tier: 'GROWTH', discount: '17' },
      },
    ],
  },
  {
    id: 'prod_commercial_lab_scale',
    name: 'Commercial Lab - Scale',
    description: 'AI Commercial Production - Enterprise tier with 64 tokens/month, premium clones',
    category: 'COMMERCIAL_LAB',
    metadata: {
      tier: 'SCALE',
      monthlyTokens: '64',
      maxFormats: '4',
      maxRevisions: '5',
      queuePriority: 'RUSH',
      queueDays: '1',
      voiceClone: 'true',
      avatarClone: 'true',
      premiumClones: 'true',
    },
    features: [
      '64 Commercial Tokens / Month',
      '4 Formats',
      '5 Revisions per Commercial',
      '24-Hour Priority Queue',
      'Premium Voice Clone',
      'Premium Avatar Clone',
    ],
    prices: [
      {
        id: 'price_scale_monthly',
        nickname: 'Scale Monthly',
        unitAmount: 319900,
        currency: 'usd',
        recurring: { interval: 'month', intervalCount: 1 },
        metadata: { interval: 'monthly', tier: 'SCALE' },
      },
      {
        id: 'price_scale_yearly',
        nickname: 'Scale Yearly',
        unitAmount: 3186204,
        currency: 'usd',
        recurring: { interval: 'year', intervalCount: 1 },
        metadata: { interval: 'yearly', tier: 'SCALE', discount: '17' },
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
