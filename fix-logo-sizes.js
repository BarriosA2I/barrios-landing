const fs = require('fs');

const indexPath = 'C:/Users/gary/barrios-landing/index.html';
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Update nav container height (remove h-20, add min-h)
html = html.replace(
  '<div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">',
  '<div class="max-w-7xl mx-auto px-6 flex items-center justify-between min-h-[88px] md:min-h-[96px]">'
);
console.log('Updated nav container height');

// 2. Update logo wrapper min-height
html = html.replace(
  '<div class="flex items-center gap-4 group cursor-pointer min-h-[72px] md:min-h-[80px]">',
  '<div class="flex items-center gap-4 group cursor-pointer shrink-0">'
);
console.log('Updated logo wrapper');

// 3. Update header logo size: h-12 (48px) mobile, md:h-16 (64px) desktop
html = html.replace(
  '<img src="brand/barrios-a2i-logo.png" alt="Barrios A2I Logo" class="h-[40px] md:h-[56px] w-auto object-contain relative z-10 transition-all duration-300 drop-shadow-[0_0_15px_rgba(0,191,255,0.3)] hover:drop-shadow-[0_0_20px_rgba(0,191,255,0.5)]">',
  '<img src="brand/barrios-a2i-logo.png" alt="Barrios A2I Logo" class="h-12 md:h-16 w-auto object-contain relative z-10 transition-all duration-300 drop-shadow-[0_0_12px_rgba(0,194,255,0.25)] hover:drop-shadow-[0_0_20px_rgba(0,194,255,0.5)]">'
);
console.log('Updated header logo size to h-12 / md:h-16');

// 4. Update header text styling
html = html.replace(
  `<div class="flex flex-col">
                <span class="text-base font-bold tracking-tight text-white uppercase font-sans">
                  Barrios A2I
                </span>
                <span class="text-[11px] font-mono font-medium tracking-wider text-accent uppercase group-hover:text-primary transition-colors">
                  [ BUSINESS_OS ]
                </span>
            </div>`,
  `<div class="flex flex-col leading-none">
                <span class="text-[13px] md:text-[14px] font-semibold tracking-wide text-white/90 uppercase font-sans">
                  BARRIOS A2I
                </span>
                <span class="mt-1 text-[11px] md:text-[12px] font-mono tracking-[0.25em] text-primary group-hover:text-white transition-colors">
                  [ BUSINESS_OS ]
                </span>
            </div>`
);
console.log('Updated header text styling');

// 5. Update footer logo size: h-9 (36px) mobile, md:h-11 (44px) desktop
html = html.replace(
  '<img src="brand/barrios-a2i-logo.png" alt="Barrios A2I" class="h-[48px] md:h-[56px] w-auto object-contain opacity-90 hover:opacity-100 transition-opacity drop-shadow-[0_0_15px_rgba(0,191,255,0.3)]">',
  '<img src="brand/barrios-a2i-logo.png" alt="Barrios A2I" class="h-9 md:h-11 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity drop-shadow-[0_0_12px_rgba(0,194,255,0.25)]">'
);
console.log('Updated footer logo size to h-9 / md:h-11');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Done! Logo sizes updated.');
