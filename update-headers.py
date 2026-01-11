#!/usr/bin/env python3
"""
Unified Header Replacement Script
Replaces all <header>...</header> sections with the unified header
"""

import re
import os

# The unified header to insert
UNIFIED_HEADER = '''<header class="fixed top-0 left-0 right-0 z-50 bg-[#0a0a1e]/90 backdrop-blur-md border-b border-[#00bfff]/10">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16 md:h-20">

      <!-- Logo Section -->
      <a href="/" class="flex items-center gap-3 group">
        <!-- Butterfly Logo -->
        <div class="relative h-10 w-10 md:h-12 md:w-12">
          <img src="/brand/barrios-a2i-logo.png" alt="Barrios A2I" class="h-full w-full object-contain" />
        </div>

        <!-- Brand Text -->
        <div class="flex flex-col leading-tight">
          <span class="text-[10px] md:text-xs text-[#00ff88] font-mono tracking-[0.2em] uppercase">
            SYSTEM_CONNECTED
          </span>
          <span class="text-lg md:text-xl font-bold tracking-tight">
            <span class="text-white">BARRIOS</span>
            <span class="text-[#00bfff] ml-1">A2I</span>
          </span>
        </div>

        <!-- Status Indicator Dot -->
        <span class="w-2 h-2 rounded-full bg-[#ffd700] shadow-[0_0_8px_#ffd700] ml-2"></span>
      </a>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center">
        <a href="/pricing" class="px-3 lg:px-4 py-2 text-[#8892b0] hover:text-white transition-colors font-mono text-sm tracking-wide">
          [ PRICING ]
        </a>

        <a href="/nexus-personal" class="px-3 lg:px-4 py-2 transition-colors font-mono text-sm tracking-wide group">
          <span class="text-[#8892b0] group-hover:text-[#00bfff]">[</span>
          <span class="text-[#00bfff] mx-1">NEXUS</span>
          <span class="text-[#00bfff]">●</span>
          <span class="text-[#8892b0] group-hover:text-[#00bfff]">]</span>
        </a>

        <a href="/creative-director" class="px-3 lg:px-4 py-2 text-[#8892b0] hover:text-white transition-colors font-mono text-sm tracking-wide">
          [ COMMERCIAL_LAB ]
        </a>

        <a href="/founder" class="px-3 lg:px-4 py-2 text-[#8892b0] hover:text-white transition-colors font-mono text-sm tracking-wide">
          [ FOUNDER ]
        </a>

        <a href="/command-center" class="px-3 lg:px-4 py-2 transition-colors font-mono text-sm tracking-wide group">
          <span class="text-[#8892b0] group-hover:text-[#ffd700]">[</span>
          <span class="text-[#ffd700] mx-1">COMMAND</span>
          <span class="text-[#ffd700]">●</span>
          <span class="text-[#8892b0] group-hover:text-[#ffd700]">]</span>
        </a>
      </nav>

      <!-- Mobile Menu Button -->
      <button
        onclick="document.getElementById('mobile-nav').classList.toggle('hidden')"
        class="md:hidden p-2 text-[#8892b0] hover:text-white transition-colors"
        aria-label="Toggle menu"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
    </div>
  </div>

  <!-- Mobile Navigation -->
  <div id="mobile-nav" class="hidden md:hidden bg-[#0a0a1e]/98 border-t border-[#00bfff]/10 backdrop-blur-md">
    <nav class="px-4 py-4 space-y-1">
      <a href="/pricing" class="block py-3 px-4 text-[#8892b0] hover:text-white hover:bg-[#00bfff]/10 rounded font-mono text-sm transition-colors">
        [ PRICING ]
      </a>
      <a href="/nexus-personal" class="block py-3 px-4 text-[#00bfff] hover:bg-[#00bfff]/10 rounded font-mono text-sm transition-colors">
        [ NEXUS ● ]
      </a>
      <a href="/creative-director" class="block py-3 px-4 text-[#8892b0] hover:text-white hover:bg-[#00bfff]/10 rounded font-mono text-sm transition-colors">
        [ COMMERCIAL_LAB ]
      </a>
      <a href="/founder" class="block py-3 px-4 text-[#8892b0] hover:text-white hover:bg-[#00bfff]/10 rounded font-mono text-sm transition-colors">
        [ FOUNDER ]
      </a>
      <a href="/command-center" class="block py-3 px-4 text-[#ffd700] hover:bg-[#ffd700]/10 rounded font-mono text-sm transition-colors">
        [ COMMAND ● ]
      </a>
    </nav>
  </div>
</header>

<!-- Spacer to prevent content from going under fixed header -->
<div class="h-16 md:h-20"></div>'''

# Files to update
FILES = [
    'nexus-personal.html',
    'founder.html',
    'status.html',
    'command-center.html',
    'creative-director.html',
]

def replace_header(filepath):
    """Replace the header in a file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Find and replace the header section
        # Pattern matches <header ...> through </header>
        pattern = r'<header[^>]*>[\s\S]*?</header>'

        if not re.search(pattern, content):
            print(f"  [!] No <header> found in {filepath}")
            return False

        new_content = re.sub(pattern, UNIFIED_HEADER, content, count=1)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

        print(f"  [OK] Updated {filepath}")
        return True

    except Exception as e:
        print(f"  [ERR] Error updating {filepath}: {e}")
        return False

def main():
    print("\n[*] Unified Header Replacement Script")
    print("=" * 40)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    updated = 0

    for filename in FILES:
        filepath = os.path.join(base_dir, filename)
        if os.path.exists(filepath):
            if replace_header(filepath):
                updated += 1
        else:
            print(f"  [!] File not found: {filename}")

    print("=" * 40)
    print(f"[DONE] Updated {updated}/{len(FILES)} files")
    print("\nNext steps:")
    print("  git add .")
    print('  git commit -m "fix: unify header across all pages"')
    print("  git push origin master")

if __name__ == "__main__":
    main()
