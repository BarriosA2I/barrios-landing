const fs = require('fs');

const indexPath = 'C:/Users/gary/barrios-landing/index.html';
let html = fs.readFileSync(indexPath, 'utf8');

// Replace the entire footer brand identity block
const oldBlock = `<!-- Brand Identity -->
            <div class="flex flex-col gap-4">
              <!-- Large Logo -->
              <div class="flex items-center gap-4">
                <img src="brand/barrios-a2i-logo.png" alt="Barrios A2I" class="w-full h-auto drop-shadow-[0_0_14px_rgba(0,194,255,0.3)] hover:drop-shadow-[0_0_20px_rgba(0,194,255,0.45)] transition-all duration-300">
                <div class="flex flex-col">
                  <span class="font-bold font-sans tracking-tight text-white uppercase text-lg">BARRIOS A2I</span>
                  <span class="text-[10px] font-mono text-primary/70 uppercase tracking-widest">[ BUSINESS_OS ]</span>
                </div>
              </div>
              <p class="text-white/40 text-sm max-w-xs leading-relaxed font-sans">
                Autonomous intelligence infrastructure for the next generation of enterprise.
              </p>
            </div>`;

const newBlock = `<!-- Brand Identity - Masthead -->
            <div class="flex flex-col gap-6">
              <!-- Footer Masthead Logo -->
              <a href="/" class="block w-full max-w-[360px]">
                <img src="brand/barrios-a2i-logo.png" alt="Barrios A2I" class="w-full h-auto drop-shadow-[0_0_14px_rgba(0,194,255,0.3)] hover:drop-shadow-[0_0_20px_rgba(0,194,255,0.45)] transition-all duration-300">
              </a>
              <p class="text-white/40 text-sm max-w-sm leading-relaxed font-sans">
                Autonomous intelligence infrastructure for the next generation of enterprise.
              </p>
            </div>`;

if (html.includes(oldBlock)) {
  html = html.replace(oldBlock, newBlock);
  console.log('Replaced footer brand block with clean masthead');
} else {
  console.log('Block not found exactly');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Done!');
