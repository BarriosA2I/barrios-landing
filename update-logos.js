const fs = require('fs');

const indexPath = 'C:/Users/gary/barrios-landing/index.html';
let html = fs.readFileSync(indexPath, 'utf8');

// Update header logo (line 279)
const oldHeaderLogo = `<img src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg" alt="Barrios A2I Logo" class="h-[48px] w-auto object-contain relative z-10 grayscale group-hover:grayscale-0 transition-all duration-300">`;

const newHeaderLogo = `<a href="/">
                    <img src="brand/barrios-a2i-logo.png" alt="Barrios A2I Logo" class="h-[32px] md:h-[36px] w-auto object-contain relative z-10 transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(0,194,255,0.4)]">
                </a>`;

if (html.includes(oldHeaderLogo)) {
  html = html.replace(oldHeaderLogo, newHeaderLogo);
  console.log('Updated header logo');
} else {
  console.log('Header logo pattern not found - trying alternate');
}

// Update footer logo (malformed src)
// The footer has a broken src attribute, let's find and fix it
const footerLogoPattern = /<img srchttps:="" hoirqrkdgbmvpwutwuwj\.supabase\.co="" storage="" v1="" object="" public="" assets="" 917d6f93-fb36-439a-8c48-884b67b35_1600w\.jpg"="" alt="Barrios A2I Logo" class="h-\[48px\] w-auto object-contain transition duration-150 ease-out grayscale hover:grayscale-0">/;

const newFooterLogo = `<img src="brand/barrios-a2i-logo.png" alt="Barrios A2I Logo" class="h-[40px] w-auto object-contain transition duration-150 ease-out hover:drop-shadow-[0_0_8px_rgba(0,194,255,0.4)]">`;

if (footerLogoPattern.test(html)) {
  html = html.replace(footerLogoPattern, newFooterLogo);
  console.log('Updated footer logo');
} else {
  console.log('Footer logo pattern not found - checking content');
  // Try a simpler approach
  if (html.includes('srchttps:="" hoirqrkdgbmvpwutwuwj')) {
    html = html.replace(/<img srchttps:[^>]+>/, newFooterLogo);
    console.log('Updated footer logo (alternate pattern)');
  }
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Done!');
