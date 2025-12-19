const fs = require('fs');

const indexPath = 'C:/Users/gary/barrios-landing/index.html';
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Remove old logoPulse CSS block
const oldLogoPulseCSS = `
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

if (html.includes(oldLogoPulseCSS)) {
  html = html.replace(oldLogoPulseCSS, '');
  console.log('Removed old logoPulse CSS');
}

// 2. Add new logoWrap/logoImg/logoHalo CSS
const newGlowCSS = `
    /* === Header Logo Micro Glow Pulse (Final) === */
    .logoWrap {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 8px 10px;
      line-height: 0;
      cursor: pointer;
      isolation: isolate;
      z-index: 50;
    }
    .logoImg {
      display: block;
      height: 40px;
      width: auto;
      position: relative;
      z-index: 2;
      filter: drop-shadow(0 0 10px rgba(0, 194, 255, 0.18));
      transition: filter 220ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    @media (min-width: 768px) {
      .logoImg { height: 48px; }
    }
    .logoHalo {
      position: absolute;
      inset: -12px;
      border-radius: 16px;
      z-index: 0;
      pointer-events: none;
      opacity: 0;
      transform: scale(0.98);
      transition: opacity 160ms cubic-bezier(0.16, 1, 0.3, 1),
        transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
      background: radial-gradient(
        circle at 50% 50%,
        rgba(0, 194, 255, 0.35) 0%,
        rgba(34, 211, 238, 0.16) 35%,
        rgba(168, 85, 247, 0.10) 58%,
        rgba(0, 0, 0, 0) 72%
      );
      filter: blur(12px);
    }
    @keyframes logoPulse {
      0% { opacity: 0.35; transform: scale(0.985); filter: blur(10px); }
      45% { opacity: 0.85; transform: scale(1.02); filter: blur(12px); }
      100% { opacity: 0.55; transform: scale(1); filter: blur(10px); }
    }
    .logoWrap:hover .logoHalo,
    .logoWrap:focus-visible .logoHalo {
      opacity: 0.55;
      transform: scale(1);
      animation: logoPulse 760ms cubic-bezier(0.16, 1, 0.3, 1) 1;
    }
    .logoWrap:hover .logoImg,
    .logoWrap:focus-visible .logoImg {
      filter: drop-shadow(0 0 18px rgba(0, 194, 255, 0.4));
    }
    @media (prefers-reduced-motion: reduce) {
      .logoWrap:hover .logoHalo,
      .logoWrap:focus-visible .logoHalo {
        animation: none;
        opacity: 0.45;
        transform: scale(1);
      }
    }`;

if (!html.includes('.logoWrap {')) {
  html = html.replace('</style>', newGlowCSS + '\n    </style>');
  console.log('Added new logoWrap/logoImg/logoHalo CSS');
}

// 3. Update header to allow overflow for glow bleed
html = html.replace(
  '<nav class="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-void/80 backdrop-blur-xl shrink-0">',
  '<nav class="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-void/80 backdrop-blur-xl shrink-0 overflow-x-clip overflow-y-visible">'
);
console.log('Added overflow-y-visible to nav');

// 4. Replace header logo with new structure
const oldLogoBlock = `<!-- Header Logo - Balanced Lockup -->
        <a href="/" class="flex items-center shrink-0 logoPulse">
            <img
                src="brand/barrios-a2i-logo.png"
                alt="Barrios A2I"
                class="h-10 md:h-12 w-auto max-w-[240px] md:max-w-[300px] lg:max-w-[340px]"
            >
        </a>`;

const newLogoBlock = `<!-- Header Logo - Micro Glow Pulse -->
        <a href="/" class="logoWrap" aria-label="Barrios A2I Home">
            <span class="logoHalo" aria-hidden="true"></span>
            <img
                src="brand/barrios-a2i-logo.png"
                alt="Barrios A2I"
                class="logoImg max-w-[240px] md:max-w-[300px] lg:max-w-[340px]"
            >
        </a>`;

if (html.includes(oldLogoBlock)) {
  html = html.replace(oldLogoBlock, newLogoBlock);
  console.log('Replaced header logo with new glow structure');
} else {
  console.log('Old logo block not found - trying alternate pattern');
  // Try a more flexible replacement
  html = html.replace(
    /<a href="\/" class="flex items-center shrink-0 logoPulse">\s*<img[^>]*src="brand\/barrios-a2i-logo\.png"[^>]*>\s*<\/a>/s,
    newLogoBlock
  );
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Done! Micro Glow Pulse (Final) implemented.');
