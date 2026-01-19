/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./*.html",
    "./js/**/*.js"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Exo 2', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Orbitron', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
      },
      colors: {
        // New Barrios A2I Design System
        void: '#0B1220',
        obsidian: '#0a0a1e',
        navy: '#0B1220',
        primary: '#00bfff',
        accent: '#ffd700',
        muted: '#94a3b8',
        'brand-cyan': '#00bfff',
        'brand-gold': '#ffd700',
        'electric-blue': '#00C2FF',
        'cyber-gold': '#F59E0B',
        // Background colors
        'bg-primary': '#0B1220',
        'bg-secondary': '#0a0a1e',
        'bg-tertiary': '#141428',
        'text-primary': '#fafafa',
        'text-secondary': '#94a3b8',
        'accent-cyan': '#00bfff',
        'accent-purple': '#8B5CF6',
      },
      backgroundImage: {
        'obsidian-gradient': 'linear-gradient(to bottom, #0a0a0f 0%, #0a0a1e 100%)',
        'hud-shine': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)',
      },
      boxShadow: {
        'hud-inset': 'inset 0 1px 0 0 rgba(255,255,255,0.08), inset 0 0 20px rgba(0,0,0,0.5)',
        'neon-primary': '0 0 10px rgba(0, 206, 209, 0.3), inset 0 0 5px rgba(0, 206, 209, 0.1)',
        'accent-glow': '0 0 30px rgba(0, 206, 209, 0.1)',
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'beam': 'beam 8s linear infinite',
        'pulse-glow': 'pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'typewriter': 'typewriter 2s steps(40, end) 1s 1 normal both',
        'cursor': 'cursor .75s step-end infinite',
        'shine': 'shine 8s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        'float': 'float-orbit 6s ease-in-out infinite',
        'orbit-cw': 'orbit-cw 8s linear infinite',
        'orbit-ccw': 'orbit-ccw 12s linear infinite',
        'underline-grow': 'underline-grow 1s ease-out 0.8s forwards',
        'signal-sweep': 'signal-sweep 2s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        beam: {
          '0%': { top: '-200px', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { top: '100%', opacity: '0' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        typewriter: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        'underline-grow': {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        cursor: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        shine: {
          '0%, 100%': { 'background-position': '200% center' },
        },
        'float-orbit': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'orbit-cw': {
          'from': { transform: 'rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg)' },
          'to': { transform: 'rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg)' },
        },
        'orbit-ccw': {
          'from': { transform: 'rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg)' },
          'to': { transform: 'rotate(-360deg) translateX(var(--orbit-radius)) rotate(360deg)' },
        },
        'signal-sweep': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
