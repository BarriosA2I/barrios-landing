import re

# Read file
with open('C:/Users/gary/barrios-landing/nexus-personal.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add gold-trace hover CSS before </style>
new_css = '''
        /* Gold Trace Hover Effect */
        .nav-link { position: relative; }
        .nav-link::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 1px;
            background: #F59E0B;
            box-shadow: 0 0 8px #F59E0B;
            transition: width 0.3s ease;
        }
        .nav-link:hover::after { width: 75%; }
        .nav-link:hover .bracket { color: #F59E0B; }

        /* Scanline Effect */
        .scanline-overlay {
            background: linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.15) 50%),
                        linear-gradient(90deg, rgba(255,0,0,0.02), rgba(0,255,0,0.01), rgba(0,0,255,0.02));
            background-size: 100% 2px, 3px 100%;
        }

        /* Volumetric Glow */
        .volumetric-glow {
            filter: drop-shadow(0 0 8px rgba(0, 194, 255, 0.5));
        }
        .volumetric-glow:hover {
            filter: drop-shadow(0 0 15px rgba(0, 194, 255, 0.7));
        }
    </style>'''

content = content.replace('    </style>', new_css)

# Replace the header section
old_header = '''    <!-- ========== SECTION 1: NAVIGATION ========== -->
    <nav class="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-void/80 backdrop-blur-xl">
        <div class="max-w-7xl mx-auto px-6">
            <div class="flex items-center justify-between h-16">
                <a href="/" class="flex items-center gap-3 group">
                    <img src="brand/barrios-a2i-logo.png" alt="Barrios A2I" class="h-8 w-auto opacity-90 group-hover:opacity-100 transition-opacity">
                </a>

                <div class="hidden md:flex items-center gap-1">
                    <a href="/#stack" class="px-4 py-2 text-xs font-mono text-muted/70 hover:text-white transition-colors tracking-wider">[ STACK ]</a>
                    <a href="/#velocity" class="px-4 py-2 text-xs font-mono text-muted/70 hover:text-white transition-colors tracking-wider">[ VELOCITY ]</a>
                    <a href="/#architecture" class="px-4 py-2 text-xs font-mono text-muted/70 hover:text-white transition-colors tracking-wider">[ ARCHITECTURE ]</a>
                    <a href="/#pricing" class="px-4 py-2 text-xs font-mono text-muted/70 hover:text-white transition-colors tracking-wider">[ PRICING ]</a>
                    <a href="/nexus-personal" class="px-4 py-2 text-xs font-mono text-primary transition-colors tracking-wider flex items-center gap-2">
                        <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>[ NEXUS ]
                    </a>
                </div>

                <div class="flex items-center gap-4">
                    <a href="#" class="hidden md:block text-sm text-muted/70 hover:text-white transition-colors">Log in</a>
                    <a href="#pricing" class="group relative px-6 py-2 bg-primary/10 border border-primary/30 text-primary text-sm font-mono hover:bg-primary/20 transition-all overflow-hidden">
                        <span class="relative z-10">[ REQUEST_ACCESS ]</span>
                    </a>
                </div>
            </div>
        </div>
    </nav>'''

new_header = '''    <!-- ========== SECTION 1: NAVIGATION (REMASTERED) ========== -->
    <header class="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <!-- Glassmorphism Background -->
        <div class="absolute inset-0 bg-obsidian/80 backdrop-blur-xl border-b border-brand-blue/20 transition-all duration-300"></div>

        <nav class="max-w-7xl mx-auto relative flex items-center justify-between">
            <!-- Official Shard Logo with Volumetric Glow -->
            <a href="/" class="flex items-center gap-4 group">
                <div class="relative w-12 h-12 flex items-center justify-center">
                    <!-- Volumetric Glow Behind Logo -->
                    <div class="absolute inset-0 bg-brand-blue blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 rounded-full"></div>
                    <img
                        src="brand/barrios-a2i-shard-logo.png"
                        alt="Barrios A2I"
                        class="relative w-10 h-10 object-contain volumetric-glow transition-all duration-300"
                    >
                </div>
                <div class="hidden md:flex flex-col">
                    <span class="text-brand-blue font-mono text-[10px] tracking-[0.3em] font-bold">SYSTEM_CONNECTED</span>
                    <span class="text-white font-black text-lg tracking-tighter">BARRIOS A2I</span>
                </div>
            </a>

            <!-- Tactical Navigation with Gold Trace -->
            <div class="hidden lg:flex items-center space-x-1">
                <a href="/#stack" class="nav-link group relative px-4 py-2 flex items-center">
                    <span class="bracket text-brand-blue/40 font-mono text-xs transition-colors">[</span>
                    <span class="mx-2 text-[11px] font-mono font-medium tracking-[0.2em] text-muted group-hover:text-white transition-colors">STACK</span>
                    <span class="bracket text-brand-blue/40 font-mono text-xs transition-colors">]</span>
                </a>
                <a href="/#velocity" class="nav-link group relative px-4 py-2 flex items-center">
                    <span class="bracket text-brand-blue/40 font-mono text-xs transition-colors">[</span>
                    <span class="mx-2 text-[11px] font-mono font-medium tracking-[0.2em] text-muted group-hover:text-white transition-colors">VELOCITY</span>
                    <span class="bracket text-brand-blue/40 font-mono text-xs transition-colors">]</span>
                </a>
                <a href="/#architecture" class="nav-link group relative px-4 py-2 flex items-center">
                    <span class="bracket text-brand-blue/40 font-mono text-xs transition-colors">[</span>
                    <span class="mx-2 text-[11px] font-mono font-medium tracking-[0.2em] text-muted group-hover:text-white transition-colors">ARCHITECTURE</span>
                    <span class="bracket text-brand-blue/40 font-mono text-xs transition-colors">]</span>
                </a>
                <a href="/#pricing" class="nav-link group relative px-4 py-2 flex items-center">
                    <span class="bracket text-brand-blue/40 font-mono text-xs transition-colors">[</span>
                    <span class="mx-2 text-[11px] font-mono font-medium tracking-[0.2em] text-muted group-hover:text-white transition-colors">PRICING</span>
                    <span class="bracket text-brand-blue/40 font-mono text-xs transition-colors">]</span>
                </a>
                <a href="/nexus-personal" class="nav-link group relative px-4 py-2 flex items-center">
                    <span class="bracket text-brand-blue font-mono text-xs">[</span>
                    <span class="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse mx-1"></span>
                    <span class="text-[11px] font-mono font-medium tracking-[0.2em] text-brand-blue">NEXUS</span>
                    <span class="bracket text-brand-blue font-mono text-xs">]</span>
                </a>
            </div>

            <!-- Initialize Logic CTA -->
            <div class="flex items-center gap-4">
                <span class="hidden sm:block text-[10px] font-mono text-muted/50 hover:text-white cursor-pointer transition-colors">AUTH_LOGIN</span>

                <a href="#pricing" class="group relative px-5 py-2.5 overflow-hidden bg-white/5 border border-brand-blue/40 hover:border-brand-gold transition-all duration-300">
                    <!-- Scanline Effect -->
                    <div class="absolute inset-0 pointer-events-none scanline-overlay opacity-50"></div>

                    <div class="relative flex items-center gap-2">
                        <iconify-icon icon="lucide:terminal" width="14" class="text-brand-blue group-hover:text-brand-gold transition-colors"></iconify-icon>
                        <span class="text-[11px] font-mono font-bold tracking-wider text-brand-blue group-hover:text-brand-gold transition-colors">[ INITIALIZE_LOGIC ]</span>
                    </div>
                </a>
            </div>
        </nav>
    </header>'''

content = content.replace(old_header, new_header)

# Write file
with open('C:/Users/gary/barrios-landing/nexus-personal.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Remastered header applied successfully')
