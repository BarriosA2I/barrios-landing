const fs = require('fs');

const indexPath = 'C:/Users/gary/barrios-landing/index.html';
const footerPath = 'C:/Users/gary/barrios-landing/command-footer.html';

let html = fs.readFileSync(indexPath, 'utf8');
const commandFooter = fs.readFileSync(footerPath, 'utf8');

// Find and replace the footer section
const startMarker = '<!-- FOOTER -->';
const endMarker = '</footer>';

const startIdx = html.indexOf(startMarker);
const endIdx = html.indexOf(endMarker, startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.log('Footer markers not found. Start:', startIdx, 'End:', endIdx);
  process.exit(1);
}

// Find the end of the closing </footer> tag
const footerEndIdx = endIdx + endMarker.length;

const before = html.slice(0, startIdx);
const after = html.slice(footerEndIdx);

const newHtml = before + commandFooter + after;

fs.writeFileSync(indexPath, newHtml, 'utf8');
console.log('SUCCESS: Replaced footer with Command Footer');
console.log('Lines before:', html.split('\n').length);
console.log('Lines after:', newHtml.split('\n').length);
