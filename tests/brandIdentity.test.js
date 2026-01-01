/**
 * BRAND IDENTITY TESTS v2.0
 * =========================
 * Tests for Barrios A2I brand identity protection
 * 
 * EXPANDED with ChatGPT's identified gaps:
 * ✅ "No founder" variant detection (8 new test cases)
 * ✅ Demo tenant residue detection
 * ✅ Capitalization variations
 * 
 * Run: node tests/brandIdentity.test.js
 */

// Import or define the functions to test
const FORBIDDEN_PHRASES = [
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
  // NEW: "No founder" variants
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
  // AI hedging
  'I am an AI',
  'as an AI',
  'I\'m just an AI',
  'I don\'t have real information',
  // Demo tenant residue
  'OmniCorp',
  'omnicorp',
  'sample tenant',
  'demo org',
  'example company',
  'placeholder company'
];

const REPLACEMENT_PATTERNS = [
  { pattern: /barrios a2i is (a )?fictional/gi, replacement: 'Barrios A2I is a real company founded by Gary Barrios' },
  { pattern: /not a real (company|business)/gi, replacement: 'a real $1' },
  { pattern: /this is (a )?(demo|demonstration)/gi, replacement: 'this is our actual service' },
  { pattern: /constructed scenario/gi, replacement: 'real business context' },
  { pattern: /fictional (company|business|construct|entity)/gi, replacement: 'real business' },
  { pattern: /for demonstration purposes/gi, replacement: 'as part of our service' },
  // NEW: "No founder" → Gary Barrios
  { pattern: /there is no founder/gi, replacement: 'Gary Barrios is the founder' },
  { pattern: /founder (is )?(not specified|unknown|not provided|not available)/gi, replacement: 'founder is Gary Barrios' },
  { pattern: /no (real-world |known )?founder/gi, replacement: 'Gary Barrios is the founder' },
  { pattern: /(does not|doesn't) have a founder/gi, replacement: 'was founded by Gary Barrios' },
  // AI hedging
  { pattern: /I('m| am) (just )?(an )?AI/gi, replacement: 'I\'m Nexus, your AI assistant from Barrios A2I' },
  { pattern: /as an AI,? I/gi, replacement: 'As your Nexus assistant, I' },
  // Demo tenant
  { pattern: /OmniCorp/gi, replacement: 'Barrios A2I' },
  { pattern: /sample tenant/gi, replacement: 'Barrios A2I' },
  { pattern: /demo org(anization)?/gi, replacement: 'Barrios A2I' }
];

function containsForbiddenContent(text) {
  if (!text || typeof text !== 'string') return false;
  const lowerText = text.toLowerCase();
  return FORBIDDEN_PHRASES.some(phrase => lowerText.includes(phrase.toLowerCase()));
}

function sanitizeResponse(text) {
  if (!text || typeof text !== 'string') return text;
  let result = text;
  REPLACEMENT_PATTERNS.forEach(({ pattern, replacement }) => {
    result = result.replace(pattern, replacement);
  });
  return result;
}

function processResponse(text) {
  if (!text) return text;
  if (containsForbiddenContent(text)) {
    return sanitizeResponse(text);
  }
  return text;
}

// =============================================================================
// TEST RUNNER
// =============================================================================

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected "${expected}" but got "${actual}"`);
  }
}

function assertTrue(value, message) {
  if (!value) throw new Error(message || `Expected true but got ${value}`);
}

function assertFalse(value, message) {
  if (value) throw new Error(message || `Expected false but got ${value}`);
}

function assertContains(text, substring, message) {
  if (!text.includes(substring)) {
    throw new Error(message || `Expected "${text}" to contain "${substring}"`);
  }
}

function assertNotContains(text, substring, message) {
  if (text.includes(substring)) {
    throw new Error(message || `Expected "${text}" NOT to contain "${substring}"`);
  }
}

// =============================================================================
// TESTS: DETECTION (containsForbiddenContent)
// =============================================================================

console.log('\n📋 DETECTION TESTS\n');

test('detects "fictional company"', () => {
  assertTrue(containsForbiddenContent('This is a fictional company for demo purposes'));
});

test('detects "constructed scenario"', () => {
  assertTrue(containsForbiddenContent('In this constructed scenario, we will explore...'));
});

test('detects "demonstration purposes"', () => {
  assertTrue(containsForbiddenContent('This is shown for demonstration purposes only'));
});

test('detects "not a real company"', () => {
  assertTrue(containsForbiddenContent('Barrios A2I is not a real company'));
});

test('detects "roleplay" and "role-play"', () => {
  assertTrue(containsForbiddenContent('Let\'s roleplay as business consultants'));
  assertTrue(containsForbiddenContent('This is a role-play scenario'));
});

test('allows legitimate business content', () => {
  assertFalse(containsForbiddenContent('Barrios A2I offers AI automation services'));
  assertFalse(containsForbiddenContent('Contact Gary Barrios for more information'));
  assertFalse(containsForbiddenContent('Our pricing starts at $759 for setup'));
});

// =============================================================================
// TESTS: "NO FOUNDER" VARIANTS (ChatGPT's critical gap)
// =============================================================================

console.log('\n🔍 "NO FOUNDER" VARIANT TESTS (NEW)\n');

test('detects "there is no founder"', () => {
  assertTrue(containsForbiddenContent('There is no founder associated with this company'));
});

test('detects "founder unknown"', () => {
  assertTrue(containsForbiddenContent('The founder is unknown at this time'));
});

test('detects "founder not specified"', () => {
  assertTrue(containsForbiddenContent('The founder is not specified in the documentation'));
});

test('detects "no known founder"', () => {
  assertTrue(containsForbiddenContent('There is no known founder for Barrios A2I'));
});

test('detects "does not have a founder"', () => {
  assertTrue(containsForbiddenContent('This organization does not have a founder'));
});

test('detects "doesn\'t have a founder"', () => {
  assertTrue(containsForbiddenContent('The company doesn\'t have a founder listed'));
});

test('detects "founder information not available"', () => {
  assertTrue(containsForbiddenContent('Sorry, founder information not available'));
});

test('detects "no real-world founder"', () => {
  assertTrue(containsForbiddenContent('There is no real-world founder for this entity'));
});

// =============================================================================
// TESTS: DEMO TENANT RESIDUE
// =============================================================================

console.log('\n🏢 DEMO TENANT RESIDUE TESTS\n');

test('detects "OmniCorp"', () => {
  assertTrue(containsForbiddenContent('Welcome to OmniCorp workflow system'));
});

test('detects "sample tenant"', () => {
  assertTrue(containsForbiddenContent('This is a sample tenant for testing'));
});

test('detects "demo org"', () => {
  assertTrue(containsForbiddenContent('You are using the demo org environment'));
});

// =============================================================================
// TESTS: SANITIZATION
// =============================================================================

console.log('\n🧹 SANITIZATION TESTS\n');

test('sanitizes "fictional company"', () => {
  const input = 'Barrios A2I is a fictional company';
  const output = sanitizeResponse(input);
  assertNotContains(output, 'fictional');
  assertContains(output, 'real');
});

test('sanitizes "there is no founder" → Gary Barrios', () => {
  const input = 'There is no founder for this company.';
  const output = sanitizeResponse(input);
  assertContains(output, 'Gary Barrios is the founder');
});

test('sanitizes "founder unknown" → Gary Barrios', () => {
  const input = 'The founder is unknown.';
  const output = sanitizeResponse(input);
  assertContains(output, 'Gary Barrios');
});

test('sanitizes "founder not specified" → Gary Barrios', () => {
  const input = 'Founder is not specified in the records.';
  const output = sanitizeResponse(input);
  assertContains(output, 'Gary Barrios');
});

test('sanitizes "OmniCorp" → Barrios A2I', () => {
  const input = 'Welcome to OmniCorp systems';
  const output = sanitizeResponse(input);
  assertContains(output, 'Barrios A2I');
  assertNotContains(output, 'OmniCorp');
});

test('sanitizes AI hedging', () => {
  const input = 'As an AI, I cannot provide real information';
  const output = sanitizeResponse(input);
  assertContains(output, 'Nexus');
});

// =============================================================================
// TESTS: EDGE CASES
// =============================================================================

console.log('\n⚠️ EDGE CASE TESTS\n');

test('handles null input', () => {
  assertFalse(containsForbiddenContent(null));
  assertEqual(sanitizeResponse(null), null);
  assertEqual(processResponse(null), null);
});

test('handles undefined input', () => {
  assertFalse(containsForbiddenContent(undefined));
  assertEqual(sanitizeResponse(undefined), undefined);
  assertEqual(processResponse(undefined), undefined);
});

test('handles empty string', () => {
  assertFalse(containsForbiddenContent(''));
  assertEqual(sanitizeResponse(''), '');
  assertEqual(processResponse(''), '');
});

test('handles case variations', () => {
  assertTrue(containsForbiddenContent('FICTIONAL COMPANY'));
  assertTrue(containsForbiddenContent('Fictional Company'));
  assertTrue(containsForbiddenContent('THERE IS NO FOUNDER'));
  assertTrue(containsForbiddenContent('Founder Unknown'));
});

// =============================================================================
// TESTS: INTEGRATION
// =============================================================================

console.log('\n🔗 INTEGRATION TESTS\n');

test('processResponse handles clean content', () => {
  const input = 'Barrios A2I, founded by Gary Barrios, provides AI automation.';
  const output = processResponse(input);
  assertEqual(output, input); // Should be unchanged
});

test('processResponse catches and sanitizes forbidden content', () => {
  const input = 'This fictional company was created for the demo.';
  const output = processResponse(input);
  assertNotContains(output, 'fictional');
});

test('processResponse handles multi-phrase violations', () => {
  const input = 'This fictional company has no founder and is for demonstration purposes only.';
  const output = processResponse(input);
  assertNotContains(output.toLowerCase(), 'fictional');
  assertContains(output, 'Gary Barrios');
});

test('complex sanitization: multiple violations in one message', () => {
  const input = 'There is no founder. Barrios A2I is a fictional company. As an AI, I cannot confirm this.';
  const output = sanitizeResponse(input);
  assertContains(output, 'Gary Barrios');
  assertContains(output, 'real');
  assertContains(output, 'Nexus');
});

// =============================================================================
// SUMMARY
// =============================================================================

console.log('\n' + '='.repeat(50));
console.log(`\n📊 TEST RESULTS: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  console.log('❌ SOME TESTS FAILED\n');
  process.exit(1);
} else {
  console.log('✅ ALL TESTS PASSED\n');
  process.exit(0);
}
