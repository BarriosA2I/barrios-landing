const fs = require('fs');

const indexPath = 'C:/Users/gary/barrios-landing/index.html';
let html = fs.readFileSync(indexPath, 'utf8');

// Use a simpler search - remove the extra text elements after the logo
html = html.replace(
  /<div class="flex items-center gap-4">\s*<img src="brand\/barrios-a2i-logo\.png"[^>]+>\s*<div class="flex flex-col">\s*<span[^>]+>BARRIOS A2I<\/span>\s*<span[^>]+>\[ BUSINESS_OS \]<\/span>\s*<\/div>\s*<\/div>/s,
  `<a href="/" class="block w-full max-w-[360px]">
                <img src="brand/barrios-a2i-logo.png" alt="Barrios A2I" class="w-full h-auto drop-shadow-[0_0_14px_rgba(0,194,255,0.3)] hover:drop-shadow-[0_0_20px_rgba(0,194,255,0.45)] transition-all duration-300">
              </a>`
);
console.log('Updated footer to masthead structure');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Done!');
