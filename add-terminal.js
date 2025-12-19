const fs = require('fs');

const indexPath = 'C:/Users/gary/barrios-landing/index.html';
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Add the progress animation CSS before </style>
const progressCSS = `
    @keyframes progress {
      0% { transform: scaleX(0); }
      50% { transform: scaleX(0.7); }
      100% { transform: scaleX(1); }
    }
    .animate-progress {
      animation: progress 2.5s ease-in-out forwards;
    }`;

if (!html.includes('@keyframes progress')) {
  html = html.replace('</style>', progressCSS + '\n    </style>');
  console.log('Added progress animation CSS');
}

// 2. Add the script before </body>
if (!html.includes('intake-terminal.js')) {
  html = html.replace('</body>', '    <script src="js/intake-terminal.js"></script>\n</body>');
  console.log('Added intake-terminal.js script');
}

// 3. Wire up the Neural Ad Forge button
const oldAdForgeBtn = `<button class="w-full py-4 rounded-lg font-mono text-xs uppercase tracking-widest bg-white/[0.03] border border-white/10 text-white hover:bg-primary hover:text-[#0a0a1e] hover:border-primary transition-all duration-300">
                    [ Initialize Ad Forge ]
                  </button>`;

const newAdForgeBtn = `<button onclick="openIntakeTerminal('Neural Ad Forge')" class="w-full py-4 rounded-lg font-mono text-xs uppercase tracking-widest bg-white/[0.03] border border-white/10 text-white hover:bg-primary hover:text-[#0a0a1e] hover:border-primary transition-all duration-300">
                    [ Initialize Ad Forge ]
                  </button>`;

if (html.includes(oldAdForgeBtn)) {
  html = html.replace(oldAdForgeBtn, newAdForgeBtn);
  console.log('Wired up Neural Ad Forge button');
}

// 4. Wire up the Marketing Overlord button
const oldMarketingBtn = `<button class="w-full py-4 rounded-lg font-mono text-xs uppercase tracking-widest bg-white/[0.03] border border-white/10 text-white hover:bg-primary hover:text-[#0a0a1e] hover:border-primary transition-all duration-300">
                    [ Initialize Marketing Overlord ]
                  </button>`;

const newMarketingBtn = `<button onclick="openIntakeTerminal('Marketing Overlord')" class="w-full py-4 rounded-lg font-mono text-xs uppercase tracking-widest bg-white/[0.03] border border-white/10 text-white hover:bg-primary hover:text-[#0a0a1e] hover:border-primary transition-all duration-300">
                    [ Initialize Marketing Overlord ]
                  </button>`;

if (html.includes(oldMarketingBtn)) {
  html = html.replace(oldMarketingBtn, newMarketingBtn);
  console.log('Wired up Marketing Overlord button');
}

// 5. Wire up the Total Command / Contact Engineering button
const oldEnterpriseBtn = `<button class="w-full py-4 rounded-lg font-mono text-xs uppercase tracking-widest font-bold bg-gradient-to-r from-amber-600 to-accent text-[#0a0a1e] shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6)] transition-all duration-300">
                    [ Contact Engineering ]
                  </button>`;

const newEnterpriseBtn = `<button onclick="openIntakeTerminal('Total Command')" class="w-full py-4 rounded-lg font-mono text-xs uppercase tracking-widest font-bold bg-gradient-to-r from-amber-600 to-accent text-[#0a0a1e] shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6)] transition-all duration-300">
                    [ Contact Engineering ]
                  </button>`;

if (html.includes(oldEnterpriseBtn)) {
  html = html.replace(oldEnterpriseBtn, newEnterpriseBtn);
  console.log('Wired up Total Command button');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Done! Terminal integration complete.');
