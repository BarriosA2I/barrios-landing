const fs = require('fs');

const indexPath = 'C:/Users/gary/barrios-landing/index.html';
let html = fs.readFileSync(indexPath, 'utf8');

// Wire up A2I Commercial Lab button
html = html.replace(
  /<button class="w-full py-4 rounded-lg font-mono text-xs uppercase tracking-widest bg-white\/\[0\.03\] border border-white\/10 text-white hover:bg-primary hover:text-\[#0a0a1e\] hover:border-primary transition-all duration-300">\s*\[ Initialize Ad Forge \]/,
  `<button onclick="openIntakeTerminal('A2I Commercial Lab')" class="w-full py-4 rounded-lg font-mono text-xs uppercase tracking-widest bg-white/[0.03] border border-white/10 text-white hover:bg-primary hover:text-[#0a0a1e] hover:border-primary transition-all duration-300">
                    [ Initialize Ad Forge ]`
);
console.log('Wired Ad Forge button');

// Wire up Marketing Overlord button
html = html.replace(
  /<button class="w-full py-4 rounded-lg font-mono text-xs uppercase tracking-widest bg-white\/\[0\.03\] border border-white\/10 text-white hover:bg-primary hover:text-\[#0a0a1e\] hover:border-primary transition-all duration-300">\s*\[ Initialize Marketing Overlord \]/,
  `<button onclick="openIntakeTerminal('Marketing Overlord')" class="w-full py-4 rounded-lg font-mono text-xs uppercase tracking-widest bg-white/[0.03] border border-white/10 text-white hover:bg-primary hover:text-[#0a0a1e] hover:border-primary transition-all duration-300">
                    [ Initialize Marketing Overlord ]`
);
console.log('Wired Marketing Overlord button');

// Wire up Total Command / Contact Engineering button
html = html.replace(
  /<button class="w-full py-4 rounded-lg font-mono text-xs uppercase tracking-widest font-bold bg-gradient-to-r from-amber-600 to-accent text-\[#0a0a1e\] shadow-\[0_0_20px_rgba\(251,191,36,0\.4\)\] hover:shadow-\[0_0_30px_rgba\(251,191,36,0\.6\)\] transition-all duration-300">\s*\[ Contact Engineering \]/,
  `<button onclick="openIntakeTerminal('Total Command')" class="w-full py-4 rounded-lg font-mono text-xs uppercase tracking-widest font-bold bg-gradient-to-r from-amber-600 to-accent text-[#0a0a1e] shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6)] transition-all duration-300">
                    [ Contact Engineering ]`
);
console.log('Wired Total Command button');

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Done!');
