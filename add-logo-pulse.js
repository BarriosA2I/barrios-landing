const fs = require('fs');

const indexPath = 'C:/Users/gary/barrios-landing/index.html';
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Add the logoPulse CSS before </style>
const logoPulseCSS = `
    /* Header Logo Pulse Animation */
    .logoPulse {
      filter: drop-shadow(0 0 14px rgba(0, 194, 255, 0.25));
      transition: filter 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      will-change: filter;
      transform: translateZ(0);
    }
    .logoPulse:hover,
    .logoPulse:focus-visible {
      animation: logo-enter-pulse 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
      outline: none;
    }
    @keyframes logo-enter-pulse {
      0% { filter: drop-shadow(0 0 14px rgba(0, 194, 255, 0.25)); }
      50% { filter: drop-shadow(0 0 26px rgba(0, 194, 255, 0.55)); }
      100% { filter: drop-shadow(0 0 18px rgba(0, 194, 255, 0.35)); }
    }
    @media (prefers-reduced-motion: reduce) {
      .logoPulse:hover,
      .logoPulse:focus-visible {
        animation: none;
        filter: drop-shadow(0 0 18px rgba(0, 194, 255, 0.35));
        transition: filter 0.3s ease-out;
      }
    }`;

if (!html.includes('@keyframes logo-enter-pulse')) {
  html = html.replace('</style>', logoPulseCSS + '\n    </style>');
  console.log('Added logoPulse CSS animation');
} else {
  console.log('logoPulse CSS already exists');
}

// 2. Add logoPulse class to header logo link and remove inline drop-shadow (let CSS handle it)
html = html.replace(
  '<a href="/" class="flex items-center shrink-0">',
  '<a href="/" class="flex items-center shrink-0 logoPulse">'
);
console.log('Added logoPulse class to header logo link');

// 3. Remove inline drop-shadow from the img since .logoPulse handles it
html = html.replace(
  'class="h-10 md:h-12 w-auto max-w-[240px] md:max-w-[300px] lg:max-w-[340px] drop-shadow-[0_0_14px_rgba(0,194,255,0.28)] hover:drop-shadow-[0_0_20px_rgba(0,194,255,0.5)] transition-all duration-300"',
  'class="h-10 md:h-12 w-auto max-w-[240px] md:max-w-[300px] lg:max-w-[340px]"'
);
console.log('Removed inline drop-shadow from img (CSS handles it now)');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Done! Logo pulse animation added.');
