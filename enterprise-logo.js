const fs = require('fs');

const indexPath = 'C:/Users/gary/barrios-landing/index.html';
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Update header container to h-[72px] with overflow-visible
html = html.replace(
  '<div class="max-w-7xl mx-auto px-6 flex items-center justify-between gap-6">',
  '<div class="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between gap-6 overflow-visible">'
);
console.log('Updated header container to h-[72px] overflow-visible');

// 2. Update logo wrapper with shrink-0 and min-width
html = html.replace(
  '<a href="/" class="logoWrap" aria-label="Barrios A2I Home">',
  '<a href="/" class="logoWrap shrink-0" style="min-width: 220px;" aria-label="Barrios A2I Home">'
);
console.log('Added shrink-0 and min-width to logo wrapper');

// 3. Update logo img with important height overrides
html = html.replace(
  'class="logoImg h-[40px] md:h-[56px] w-auto max-w-[280px] md:max-w-[340px] object-contain"',
  'class="logoImg !h-[54px] md:!h-[70px] w-auto object-contain"'
);
console.log('Updated logo to !h-[54px] md:!h-[70px] (important overrides)');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Done! Enterprise logo sizing applied.');
