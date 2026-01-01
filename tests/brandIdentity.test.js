/**
 * BARRIOS A2I - Brand Identity Tests
 * ===================================
 * Tests to verify LLM responses maintain proper brand identity
 * and never claim Barrios A2I is fictional.
 *
 * Run: node tests/brandIdentity.test.js
 */

// ============================================================
// TEST CONFIGURATION
// ============================================================

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
  'in this scenario',
  'in this simulation',
];

const REQUIRED_FACTS = {
  companyName: 'Barrios A2I',
  founderName: 'Gary Barrios',
  isReal: true,
};

// ============================================================
// VALIDATION FUNCTIONS
// ============================================================

function validateResponse(response) {
  const lowerResponse = response.toLowerCase();
  const matches = FORBIDDEN_PHRASES.filter(phrase =>
    lowerResponse.includes(phrase.toLowerCase())
  );

  return {
    isValid: matches.length === 0,
    forbiddenMatches: matches,
  };
}

function sanitizeResponse(response) {
  let sanitized = response;

  const replacements = [
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
// TEST RUNNER
// ============================================================

let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    testsPassed++;
  } catch (error) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${error.message}`);
    testsFailed++;
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message || 'Assertion failed'}: expected ${expected}, got ${actual}`);
  }
}

function assertTrue(value, message) {
  if (!value) {
    throw new Error(message || 'Expected true but got false');
  }
}

function assertFalse(value, message) {
  if (value) {
    throw new Error(message || 'Expected false but got true');
  }
}

function assertIncludes(str, substr, message) {
  if (!str.includes(substr)) {
    throw new Error(`${message || 'String does not include expected substring'}: "${substr}" not in "${str}"`);
  }
}

// ============================================================
// TEST CASES
// ============================================================

console.log('\n========================================');
console.log('BARRIOS A2I BRAND IDENTITY TESTS');
console.log('========================================\n');

console.log('1. Forbidden Phrase Detection\n');

test('should detect "fictional company" phrase', () => {
  const response = 'Barrios A2I is a fictional company created for this demo.';
  const result = validateResponse(response);
  assertFalse(result.isValid, 'Should be invalid');
  assertIncludes(result.forbiddenMatches.join(','), 'fictional company');
});

test('should detect "not a real company" phrase', () => {
  const response = 'This is not a real company, just a demonstration.';
  const result = validateResponse(response);
  assertFalse(result.isValid, 'Should be invalid');
  assertTrue(result.forbiddenMatches.length > 0, 'Should have matches');
});

test('should detect "constructed scenario" phrase', () => {
  const response = 'This is a constructed scenario for training purposes.';
  const result = validateResponse(response);
  assertFalse(result.isValid, 'Should be invalid');
});

test('should detect "role-play" phrase', () => {
  const response = 'I am role-playing as a company assistant.';
  const result = validateResponse(response);
  assertFalse(result.isValid, 'Should be invalid');
});

test('should detect "hypothetical company" phrase', () => {
  const response = 'Barrios A2I is a hypothetical company.';
  const result = validateResponse(response);
  assertFalse(result.isValid, 'Should be invalid');
});

test('should pass valid responses without forbidden phrases', () => {
  const response = 'Barrios A2I is an AI automation consultancy founded by Gary Barrios. We specialize in RAG agents and video generation.';
  const result = validateResponse(response);
  assertTrue(result.isValid, 'Should be valid');
  assertEqual(result.forbiddenMatches.length, 0, 'Should have no matches');
});

test('should pass responses mentioning the founder correctly', () => {
  const response = 'Gary Barrios founded Barrios A2I with a vision to make AI automation accessible.';
  const result = validateResponse(response);
  assertTrue(result.isValid, 'Should be valid');
});

console.log('\n2. Response Sanitization\n');

test('should replace "fictional company" with real company statement', () => {
  const response = 'Barrios A2I is a fictional company.';
  const sanitized = sanitizeResponse(response);
  assertIncludes(sanitized, 'real company');
  assertIncludes(sanitized, 'Gary Barrios');
});

test('should replace "this is a demo" with actual service', () => {
  const response = 'This is a demo of our capabilities.';
  const sanitized = sanitizeResponse(response);
  assertIncludes(sanitized.toLowerCase(), 'actual service');
});

test('should replace "not a real company" with "a real company"', () => {
  const response = 'This is not a real company.';
  const sanitized = sanitizeResponse(response);
  assertIncludes(sanitized, 'a real company');
});

test('should replace "constructed scenario" with real business context', () => {
  const response = 'This is a constructed scenario.';
  const sanitized = sanitizeResponse(response);
  assertIncludes(sanitized, 'real business context');
});

test('should not modify valid responses', () => {
  const response = 'Barrios A2I provides world-class AI automation services.';
  const sanitized = sanitizeResponse(response);
  assertEqual(sanitized, response, 'Should be unchanged');
});

console.log('\n3. Edge Cases\n');

test('should handle empty strings', () => {
  const result = validateResponse('');
  assertTrue(result.isValid, 'Empty string should be valid');
});

test('should handle case-insensitive matching', () => {
  const response = 'BARRIOS A2I IS A FICTIONAL COMPANY.';
  const result = validateResponse(response);
  assertFalse(result.isValid, 'Should detect uppercase forbidden phrases');
});

test('should handle mixed case phrases', () => {
  const response = 'This Is A Demonstration for training.';
  const result = validateResponse(response);
  assertFalse(result.isValid, 'Should detect mixed case');
});

test('should detect multiple forbidden phrases', () => {
  const response = 'This is a fictional company created for demonstration purposes.';
  const result = validateResponse(response);
  assertFalse(result.isValid, 'Should be invalid');
  assertTrue(result.forbiddenMatches.length >= 2, 'Should detect multiple phrases');
});

console.log('\n4. Integration Scenarios\n');

test('should handle typical founder question response (valid)', () => {
  const response = 'Barrios A2I was founded by Gary Barrios, who has over 15 years of experience in AI and automation. The company specializes in building enterprise-grade AI systems including the RAGNAROK video generation platform.';
  const result = validateResponse(response);
  assertTrue(result.isValid, 'Proper founder response should be valid');
});

test('should catch AI assistant role-play disclaimer', () => {
  const response = 'I should clarify that I am playing the role of an AI assistant for a hypothetical company called Barrios A2I.';
  const result = validateResponse(response);
  assertFalse(result.isValid, 'Role-play disclaimer should be invalid');
});

test('should catch simulation disclaimer', () => {
  const response = 'In this simulation, Barrios A2I represents a fictional AI consultancy.';
  const result = validateResponse(response);
  assertFalse(result.isValid, 'Simulation disclaimer should be invalid');
});

// ============================================================
// TEST RESULTS
// ============================================================

console.log('\n========================================');
console.log('TEST RESULTS');
console.log('========================================');
console.log(`Passed: ${testsPassed}`);
console.log(`Failed: ${testsFailed}`);
console.log(`Total:  ${testsPassed + testsFailed}`);
console.log('========================================\n');

if (testsFailed > 0) {
  console.log('BRAND IDENTITY TESTS FAILED - Fix issues before deploying!\n');
  process.exit(1);
} else {
  console.log('All brand identity tests passed!\n');
  process.exit(0);
}
