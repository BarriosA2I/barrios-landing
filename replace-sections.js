const fs = require('fs');

const indexPath = 'C:/Users/gary/barrios-landing/index.html';
const realityGapPath = 'C:/Users/gary/barrios-landing/reality-gap-section.html';
const protocolPath = 'C:/Users/gary/barrios-landing/protocol-selector-section.html';

let html = fs.readFileSync(indexPath, 'utf8');
const realityGapSection = fs.readFileSync(realityGapPath, 'utf8');
const protocolSection = fs.readFileSync(protocolPath, 'utf8');

// Add animate-scan keyframe if not present
if (!html.includes('@keyframes scan')) {
  const scanCSS = `
@keyframes scan {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(500%); }
}
.animate-scan { animation: scan 4s linear infinite; }`;

  // Insert after marquee animation
  html = html.replace(
    '.animate-marquee { animation: marquee 25s linear infinite; }',
    '.animate-marquee { animation: marquee 25s linear infinite; }' + scanCSS
  );
  console.log('Added scan animation');
}

// Find and replace both sections
const startMarker = '<!-- COMPARISON SECTION (ARCHITECTURE) -->';
const endMarker = '<!-- FOOTER -->';

const startIdx = html.indexOf(startMarker);
const endIdx = html.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.log('Markers not found. Start:', startIdx, 'End:', endIdx);
  process.exit(1);
}

const before = html.slice(0, startIdx);
const after = html.slice(endIdx);

// Combine new sections
const newContent = realityGapSection + protocolSection;

const newHtml = before + newContent + after;

fs.writeFileSync(indexPath, newHtml, 'utf8');
console.log('SUCCESS: Replaced comparison and pricing sections');
console.log('Lines before:', html.split('\n').length);
console.log('Lines after:', newHtml.split('\n').length);
