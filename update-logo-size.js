const fs = require('fs');

const indexPath = 'C:/Users/gary/barrios-landing/index.html';
let html = fs.readFileSync(indexPath, 'utf8');

// Update header logo container and image size
const oldHeader = `<!-- Logo -->
        <div class="flex items-center gap-3 group cursor-pointer h-12">
            <div class="flex items-center justify-center relative">
                <!-- Header Logo -->
                <a href="/">
                    <img src="brand/barrios-a2i-logo.png" alt="Barrios A2I Logo" class="h-[32px] md:h-[36px] w-auto object-contain relative z-10 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(0,194,255,0.4)]">
                </a>
            </div>`;

const newHeader = `<!-- Logo -->
        <div class="flex items-center gap-4 group cursor-pointer min-h-[72px] md:min-h-[80px]">
            <div class="flex items-center justify-center relative">
                <!-- Header Logo -->
                <a href="/">
                    <img src="brand/barrios-a2i-logo.png" alt="Barrios A2I Logo" class="h-[40px] md:h-[56px] w-auto object-contain relative z-10 transition-all duration-300 drop-shadow-[0_0_15px_rgba(0,191,255,0.3)] hover:drop-shadow-[0_0_20px_rgba(0,191,255,0.5)]">
                </a>
            </div>`;

if (html.includes(oldHeader)) {
  html = html.replace(oldHeader, newHeader);
  console.log('Updated header logo size');
} else {
  console.log('Header pattern not found');
}

// Update footer logo size
const oldFooter = `<img src="brand/barrios-a2i-logo.png" alt="Barrios A2I Logo" class="h-[40px] w-auto object-contain transition duration-150 ease-out hover:drop-shadow-[0_0_8px_rgba(0,194,255,0.4)]">`;

const newFooter = `<img src="brand/barrios-a2i-logo.png" alt="Barrios A2I Logo" class="h-[48px] md:h-[56px] w-auto object-contain transition duration-300 drop-shadow-[0_0_15px_rgba(0,191,255,0.3)] hover:drop-shadow-[0_0_20px_rgba(0,191,255,0.5)]">`;

if (html.includes(oldFooter)) {
  html = html.replace(oldFooter, newFooter);
  console.log('Updated footer logo size');
} else {
  console.log('Footer pattern not found');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Done!');
