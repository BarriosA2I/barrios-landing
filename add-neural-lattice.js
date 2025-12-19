const fs = require('fs');

const indexPath = 'C:/Users/gary/barrios-landing/index.html';
const latticePath = 'C:/Users/gary/barrios-landing/neural-lattice-section.html';

let html = fs.readFileSync(indexPath, 'utf8');
const latticeSection = fs.readFileSync(latticePath, 'utf8');

// 1. Add the Neural Lattice animations to CSS
const latticeCSS = `
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-spin-slow {
      animation: spin-slow 25s linear infinite;
    }
    .animate-pulse-slow {
      animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes dash {
      to { stroke-dashoffset: -24; }
    }
    .animate-dash {
      animation: dash 1.5s linear infinite;
    }`;

if (!html.includes('@keyframes spin-slow')) {
  html = html.replace('</style>', latticeCSS + '\n    </style>');
  console.log('Added Neural Lattice animations');
}

// 2. Find and replace the bento grid section
const startMarker = '<!-- BENTO GRID: INTELLIGENCE STACK (ROSTER) -->';
const endMarker = '<!-- OPERATIONAL VELOCITY SECTION -->';

const startIdx = html.indexOf(startMarker);
const endIdx = html.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.log('Markers not found. Start:', startIdx, 'End:', endIdx);
  process.exit(1);
}

const before = html.slice(0, startIdx);
const after = html.slice(endIdx);

const newHtml = before + latticeSection + '\n      ' + after;

fs.writeFileSync(indexPath, newHtml, 'utf8');
console.log('SUCCESS: Replaced bento grid with Neural Lattice');
console.log('Lines before:', html.split('\n').length);
console.log('Lines after:', newHtml.split('\n').length);
