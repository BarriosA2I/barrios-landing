const fs = require('fs');

const indexPath = 'C:/Users/gary/barrios-landing/index.html';
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Remove old logoWrap/logoImg/logoHalo CSS block
const oldCSS = `
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

if (html.includes(oldCSS)) {
  html = html.replace(oldCSS, '');
  console.log('Removed old CSS block');
}

// 2. Add new clean ::after pseudo-element CSS
const newCSS = `
    /* === Header Logo Micro Pulse (Clean) === */
    .logoWrap {
      position: relative;
      z-index: 30;
      display: inline-flex;
      align-items: center;
      padding: 2px 6px;
    }
    .logoWrap::after {
      content: "";
      position: absolute;
      inset: -14px;
      border-radius: 14px;
      background: radial-gradient(
        circle at 50% 55%,
        rgba(0, 194, 255, 0.30),
        rgba(34, 211, 238, 0.14),
        transparent 68%
      );
      opacity: 0;
      filter: blur(10px);
      transform: scale(0.98);
      transition: opacity 0.18s ease, transform 0.18s ease;
      pointer-events: none;
      z-index: -1;
    }
    .logoWrap:hover::after,
    .logoWrap:focus-visible::after {
      opacity: 1;
      animation: logoMicroPulse 520ms ease-out 1;
    }
    .logoImg {
      transition: transform 0.18s ease, filter 0.18s ease;
      will-change: transform;
    }
    .logoWrap:hover .logoImg,
    .logoWrap:focus-visible .logoImg {
      transform: scale(1.03);
      filter: drop-shadow(0 0 10px rgba(0, 194, 255, 0.22));
    }
    @keyframes logoMicroPulse {
      0%   { transform: scale(0.98); opacity: 0.55; }
      55%  { transform: scale(1.05); opacity: 1; }
      100% { transform: scale(1.02); opacity: 1; }
    }
    @media (prefers-reduced-motion: reduce) {
      .logoWrap:hover::after,
      .logoWrap:focus-visible::after {
        animation: none;
        opacity: 0.8;
      }
    }`;

if (!html.includes('@keyframes logoMicroPulse')) {
  html = html.replace('</style>', newCSS + '\n    </style>');
  console.log('Added new ::after micro pulse CSS');
}

// 3. Update header logo - remove span.logoHalo, update img sizing
const oldLogoHTML = `<!-- Header Logo - Micro Glow Pulse -->
        <a href="/" class="logoWrap" aria-label="Barrios A2I Home">
            <span class="logoHalo" aria-hidden="true"></span>
            <img
                src="brand/barrios-a2i-logo.png"
                alt="Barrios A2I"
                class="logoImg max-w-[240px] md:max-w-[300px] lg:max-w-[340px]"
            >
        </a>`;

const newLogoHTML = `<!-- Header Logo - Enterprise Micro Pulse -->
        <a href="/" class="logoWrap" aria-label="Barrios A2I Home">
            <img
                src="brand/barrios-a2i-logo.png"
                alt="Barrios A2I"
                class="logoImg h-[40px] md:h-[56px] w-auto max-w-[280px] md:max-w-[340px] object-contain"
            >
        </a>`;

if (html.includes(oldLogoHTML)) {
  html = html.replace(oldLogoHTML, newLogoHTML);
  console.log('Updated header logo structure (removed span, enterprise sizing)');
} else {
  console.log('Logo HTML pattern not found');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Done! Final micro pulse implemented.');
