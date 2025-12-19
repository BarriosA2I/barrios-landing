const fs = require('fs');

const indexPath = 'C:/Users/gary/barrios-landing/index.html';
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Update header container min-height
html = html.replace(
  'min-h-[88px] md:min-h-[96px]',
  'min-h-[92px] md:min-h-[104px]'
);
console.log('Updated header container: min-h-[92px] md:min-h-[104px]');

// 2. Update header logo: h-12 md:h-14 (48px / 56px)
html = html.replace(
  'class="h-12 md:h-16 w-auto object-contain relative z-10 transition-all duration-300 drop-shadow-[0_0_12px_rgba(0,194,255,0.25)] hover:drop-shadow-[0_0_20px_rgba(0,194,255,0.5)]"',
  'class="h-12 md:h-14 w-auto object-contain relative z-10 transition-all duration-300 drop-shadow-[0_0_14px_rgba(0,194,255,0.28)] hover:drop-shadow-[0_0_20px_rgba(0,194,255,0.5)]"'
);
console.log('Updated header logo: h-12 md:h-14');

// 3. Update footer logo: h-10 md:h-12 (40px / 48px)
html = html.replace(
  'class="h-9 md:h-11 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity drop-shadow-[0_0_12px_rgba(0,194,255,0.25)]"',
  'class="h-10 md:h-12 w-auto object-contain opacity-95 hover:opacity-100 transition-opacity drop-shadow-[0_0_14px_rgba(0,194,255,0.28)]"'
);
console.log('Updated footer logo: h-10 md:h-12');

// 4. Update header text to match new styling
html = html.replace(
  `<span class="text-[13px] md:text-[14px] font-semibold tracking-wide text-white/90 uppercase font-sans">
                  BARRIOS A2I
                </span>`,
  `<span class="text-[14px] md:text-[15px] font-semibold tracking-wide text-white/90 uppercase font-sans">
                  BARRIOS A2I
                </span>`
);
console.log('Updated header title text size');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Done! Final logo sizes applied.');
