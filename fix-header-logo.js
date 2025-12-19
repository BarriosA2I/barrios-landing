const fs = require('fs');

const indexPath = 'C:/Users/gary/barrios-landing/index.html';
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Revert header container height - remove the min-h we added
html = html.replace(
  'min-h-[112px] md:min-h-[128px]',
  ''
);
console.log('Removed min-h from header container');

// 2. Replace the masthead logo structure with balanced lockup
const oldMasthead = `<!-- Masthead Logo -->
        <div class="flex items-center gap-4 w-[40%] min-w-[280px] md:min-w-[320px]">
            <a href="/" class="block w-full">
                <img
                    src="brand/barrios-a2i-logo.png"
                    alt="Barrios A2I"
                    class="w-full max-w-[380px] md:max-w-[420px] h-auto drop-shadow-[0_0_18px_rgba(0,194,255,0.35)] hover:drop-shadow-[0_0_26px_rgba(0,194,255,0.55)] transition-all duration-300"
                >
            </a>
        </div>`;

const newBalancedLockup = `<!-- Header Logo - Balanced Lockup -->
        <a href="/" class="flex items-center shrink-0">
            <img
                src="brand/barrios-a2i-logo.png"
                alt="Barrios A2I"
                class="h-10 md:h-12 w-auto max-w-[240px] md:max-w-[300px] lg:max-w-[340px] drop-shadow-[0_0_14px_rgba(0,194,255,0.28)] hover:drop-shadow-[0_0_20px_rgba(0,194,255,0.5)] transition-all duration-300"
            >
        </a>`;

if (html.includes(oldMasthead)) {
  html = html.replace(oldMasthead, newBalancedLockup);
  console.log('Replaced masthead with balanced lockup');
} else {
  console.log('Masthead pattern not found, trying regex');
  // Try to find and replace via regex
  html = html.replace(
    /<div class="flex items-center gap-4 w-\[40%\][^>]*>[\s\S]*?<a href="\/"[^>]*>[\s\S]*?<img[\s\S]*?src="brand\/barrios-a2i-logo\.png"[\s\S]*?<\/a>[\s\S]*?<\/div>/,
    newBalancedLockup
  );
}

// 3. Make sure header row has proper flex classes
html = html.replace(
  '<div class="max-w-7xl mx-auto px-6 flex items-center justify-between ">',
  '<div class="max-w-7xl mx-auto px-6 flex items-center justify-between gap-6">'
);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Done! Header logo fixed.');
