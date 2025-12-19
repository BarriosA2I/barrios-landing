const fs = require('fs');

const indexPath = 'C:/Users/gary/barrios-landing/index.html';
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Update header container height for masthead
html = html.replace(
  'min-h-[92px] md:min-h-[104px]',
  'min-h-[112px] md:min-h-[128px]'
);
console.log('Updated header container: min-h-[112px] md:min-h-[128px]');

// 2. Replace entire header logo section with masthead structure
const oldHeaderLogo = `<!-- Logo -->
        <div class="flex items-center gap-4 group cursor-pointer shrink-0">
            <div class="flex items-center justify-center relative">
                <!-- Header Logo -->
                <a href="/">
                    <img src="brand/barrios-a2i-logo.png" alt="Barrios A2I Logo" class="h-12 md:h-14 w-auto object-contain relative z-10 transition-all duration-300 drop-shadow-[0_0_14px_rgba(0,194,255,0.28)] hover:drop-shadow-[0_0_20px_rgba(0,194,255,0.5)]">
                </a>
            </div>
            <div class="flex flex-col leading-none">
                <span class="text-[14px] md:text-[15px] font-semibold tracking-wide text-white/90 uppercase font-sans">
                  BARRIOS A2I
                </span>
                <span class="mt-1 text-[11px] md:text-[12px] font-mono tracking-[0.25em] text-primary group-hover:text-white transition-colors">
                  [ BUSINESS_OS ]
                </span>
            </div>
        </div>`;

const newHeaderLogo = `<!-- Masthead Logo -->
        <div class="flex items-center gap-4 w-[40%] min-w-[280px] md:min-w-[320px]">
            <a href="/" class="block w-full">
                <img
                    src="brand/barrios-a2i-logo.png"
                    alt="Barrios A2I"
                    class="w-full max-w-[380px] md:max-w-[420px] h-auto drop-shadow-[0_0_18px_rgba(0,194,255,0.35)] hover:drop-shadow-[0_0_26px_rgba(0,194,255,0.55)] transition-all duration-300"
                >
            </a>
        </div>`;

if (html.includes(oldHeaderLogo)) {
  html = html.replace(oldHeaderLogo, newHeaderLogo);
  console.log('Replaced header logo with masthead structure');
} else {
  console.log('Header logo pattern not found - trying alternate approach');
  // Try a simpler replacement on just the img tag
  html = html.replace(
    /<img src="brand\/barrios-a2i-logo\.png" alt="Barrios A2I Logo" class="h-12 md:h-14 w-auto[^"]*">/,
    '<img src="brand/barrios-a2i-logo.png" alt="Barrios A2I" class="w-full max-w-[380px] md:max-w-[420px] h-auto drop-shadow-[0_0_18px_rgba(0,194,255,0.35)] hover:drop-shadow-[0_0_26px_rgba(0,194,255,0.55)] transition-all duration-300">'
  );
}

// 3. Replace footer logo section with width-based masthead
const oldFooterLogo = `<!-- Large Logo -->
              <div class="flex items-center gap-4">
                <img src="brand/barrios-a2i-logo.png" alt="Barrios A2I" class="h-10 md:h-12 w-auto object-contain opacity-95 hover:opacity-100 transition-opacity drop-shadow-[0_0_14px_rgba(0,194,255,0.28)]">
                <div class="flex flex-col">
                  <span class="font-bold font-sans tracking-tight text-white uppercase text-lg">BARRIOS A2I</span>
                  <span class="text-[10px] font-mono text-primary/70 uppercase tracking-widest">[ BUSINESS_OS ]</span>
                </div>
              </div>`;

const newFooterLogo = `<!-- Footer Masthead Logo -->
              <div class="w-full max-w-[360px]">
                <img src="brand/barrios-a2i-logo.png" alt="Barrios A2I" class="w-full h-auto drop-shadow-[0_0_14px_rgba(0,194,255,0.3)] hover:drop-shadow-[0_0_20px_rgba(0,194,255,0.45)] transition-all duration-300">
              </div>`;

if (html.includes(oldFooterLogo)) {
  html = html.replace(oldFooterLogo, newFooterLogo);
  console.log('Replaced footer logo with masthead structure');
} else {
  console.log('Footer logo pattern not found');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Done! Masthead logos applied.');
