const fs = require('fs');

const indexPath = 'C:/Users/gary/barrios-landing/index.html';
let html = fs.readFileSync(indexPath, 'utf8');

// Find and remove old logo CSS block (from prefers-reduced-motion ::after through .logoImg media query)
const oldCSSPattern = /@media \(prefers-reduced-motion: reduce\) \{\s*\.logoWrap:hover::after,[\s\S]*?\.logoImg \{[\s\S]*?\}\s*\}/;

const newCSS = `/* === ENTERPRISE WORDMARK SLOT (NO HEADER EXPANSION) === */
    .logoWrap{
      position: relative;
      z-index: 40;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;

      /* Presence on desktop */
      width: 240px;
      min-width: 240px;

      /* CRITICAL: never expand header.
         If parent row is shorter, it shrinks. If parent is taller, it caps. */
      height: 100%;
      max-height: 64px;

      padding: 0;
      overflow: visible;
    }

    /* Mobile width becomes adaptive to avoid collisions with menu */
    @media (max-width: 768px){
      .logoWrap{
        width: clamp(150px, 44vw, 190px);
        min-width: clamp(150px, 44vw, 190px);
        max-height: 52px;
      }
    }

    /* === CENTER-LOCKED BREATHING GLOW === */
    .logoWrap::before{
      content:"";
      position:absolute;
      left:50%;
      top:50%;
      transform:translate(-50%,-50%);
      width:170%;
      height:170%;
      border-radius:18px;

      background: radial-gradient(
        circle at 50% 55%,
        rgba(0,194,255,0.22),
        rgba(34,211,238,0.10),
        transparent 62%
      );

      filter: blur(10px);
      opacity: 0.35;
      pointer-events:none;
      z-index:-1;

      animation: logoBreath 3.2s ease-in-out infinite;
    }

    @keyframes logoBreath{
      0%,100%{ transform:translate(-50%,-50%) scale(0.98); opacity:0.26; }
      50%{ transform:translate(-50%,-50%) scale(1.05); opacity:0.48; }
    }

    .logoWrap:hover::before{
      animation: logoBreathHover 1.1s ease-in-out infinite alternate;
      opacity:0.6;
    }

    @keyframes logoBreathHover{
      from{ transform:translate(-50%,-50%) scale(1.02); }
      to{   transform:translate(-50%,-50%) scale(1.08); }
    }

    /* === WORDMARK RENDER === */
    .logoImg{
      display:block;
      height: 100%;
      width: auto;
      max-width: 100%;
      object-fit: contain;
      transform: translateZ(0);
    }`;

// Remove old CSS blocks
if (html.match(oldCSSPattern)) {
  html = html.replace(oldCSSPattern, newCSS);
  console.log('Replaced old CSS block with new ENTERPRISE WORDMARK SLOT CSS');
} else {
  console.log('Old pattern not found, trying alternate approach...');

  // Alternate: Find from "/* === ENTERPRISE WORDMARK SLOT ===" to the end of .logoImg media query
  const altPattern = /\/\* === ENTERPRISE WORDMARK SLOT ===[\s\S]*?@media \(max-width: 768px\)\s*\{\s*\.logoImg \{[\s\S]*?\}\s*\}/;

  if (html.match(altPattern)) {
    html = html.replace(altPattern, newCSS);
    console.log('Replaced via alternate pattern');
  } else {
    console.log('ERROR: Could not find CSS block to replace');
    process.exit(1);
  }
}

// Also remove any stray prefers-reduced-motion block for ::after if it exists separately
html = html.replace(/@media \(prefers-reduced-motion: reduce\) \{\s*\.logoWrap:hover::after,\s*\.logoWrap:focus-visible::after \{\s*animation: none;\s*opacity: 0\.8;\s*\}\s*\}\s*/g, '');
console.log('Cleaned up stray prefers-reduced-motion block');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Done! New logo CSS applied.');
