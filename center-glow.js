const fs = require('fs');

const indexPath = 'C:/Users/gary/barrios-landing/index.html';
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Remove old logo CSS block
const oldCSSPattern = /\/\* === Header Logo Micro Pulse \(Clean\) ===[\s\S]*?@keyframes logoMicroPulse[\s\S]*?\}\s*\}/;
html = html.replace(oldCSSPattern, '');

// Also try to remove the other pattern
html = html.replace(/\.logoWrap \{[\s\S]*?@keyframes logoMicroPulse[\s\S]*?\}\s*\}[\s\S]*?@media \(prefers-reduced-motion[\s\S]*?\}\s*\}/g, '');

console.log('Removed old logo CSS');

// 2. Add new center-locked breathing glow CSS
const newCSS = `
    /* === ENTERPRISE WORDMARK SLOT === */
    .logoWrap {
      position: relative;
      z-index: 40;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 240px;
      height: 76px;
      padding: 0;
      flex: 0 0 auto;
    }
    @media (max-width: 768px) {
      .logoWrap {
        width: 190px;
        height: 64px;
      }
    }
    /* === BREATHING GLOW (center-locked) === */
    .logoWrap::before {
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 170%;
      height: 170%;
      border-radius: 18px;
      background: radial-gradient(
        circle at 50% 55%,
        rgba(0, 194, 255, 0.22),
        rgba(34, 211, 238, 0.10),
        transparent 62%
      );
      filter: blur(10px);
      opacity: 0.35;
      pointer-events: none;
      z-index: -1;
      animation: logoBreath 3.2s ease-in-out infinite;
    }
    @keyframes logoBreath {
      0%, 100% { transform: translate(-50%, -50%) scale(0.98); opacity: 0.26; }
      50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.48; }
    }
    .logoWrap:hover::before {
      animation: logoBreathHover 1.1s ease-in-out infinite alternate;
      opacity: 0.6;
    }
    @keyframes logoBreathHover {
      from { transform: translate(-50%, -50%) scale(1.02); }
      to { transform: translate(-50%, -50%) scale(1.08); }
    }
    .logoImg {
      display: block;
      height: 64px;
      width: auto;
      object-fit: contain;
      transform: translateZ(0);
    }
    @media (max-width: 768px) {
      .logoImg {
        height: 52px;
      }
    }`;

// Find the </style> and insert before it
if (!html.includes('@keyframes logoBreath')) {
  html = html.replace('</style>', newCSS + '\n    </style>');
  console.log('Added new center-locked breathing glow CSS');
}

// 3. Update logo wrapper - remove inline style and extra classes, use clean structure
html = html.replace(
  /<a href="\/" class="logoWrap shrink-0" style="min-width: 220px;" aria-label="Barrios A2I Home">/,
  '<a href="/" class="logoWrap" aria-label="Barrios A2I Home">'
);
console.log('Cleaned up logo wrapper');

// 4. Update logo img - remove Tailwind height classes, let CSS control it
html = html.replace(
  /class="logoImg !h-\[54px\] md:!h-\[70px\] w-auto object-contain"/,
  'class="logoImg"'
);
console.log('Simplified logo img classes');

// 5. Ensure nav has overflow-visible (remove hidden if present)
html = html.replace(
  'overflow-x-clip overflow-y-visible',
  'overflow-visible'
);
console.log('Updated nav overflow');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Done! Center-locked breathing glow implemented.');
