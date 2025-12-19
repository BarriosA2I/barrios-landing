const fs = require('fs');

const indexPath = 'C:/Users/gary/barrios-landing/index.html';
const deploymentPath = 'C:/Users/gary/barrios-landing/deployment-protocols-section.html';

let html = fs.readFileSync(indexPath, 'utf8');
const deploymentSection = fs.readFileSync(deploymentPath, 'utf8');

// Find and replace the Protocol Selector section
const startMarker = '<!-- PROTOCOL SELECTOR SECTION -->';
const endMarker = '<!-- FOOTER -->';

const startIdx = html.indexOf(startMarker);
const endIdx = html.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.log('Markers not found. Start:', startIdx, 'End:', endIdx);
  process.exit(1);
}

const before = html.slice(0, startIdx);
const after = html.slice(endIdx);

const newHtml = before + deploymentSection + after;

fs.writeFileSync(indexPath, newHtml, 'utf8');
console.log('SUCCESS: Replaced Protocol Selector with Deployment Protocols');
console.log('Lines before:', html.split('\n').length);
console.log('Lines after:', newHtml.split('\n').length);
