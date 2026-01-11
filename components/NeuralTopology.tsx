// 📁 components/NeuralTopology.tsx
// Purpose: Zone 4 - The Ecosystem (Architecture of Autonomy)
// Visual DNA: Matches Image 313 - Connected product visualization
// Dependencies: framer-motion

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const products = [
  {
    id: 'marketing-overlord',
    name: 'Marketing Overlord',
    subtitle: 'CAMPAIGN_ORCHESTRATOR',
    description: 'Autonomous campaign management & copy generation across all channels.',
    price: '$199/MO',
    position: 'top-left',
    status: 'coming-soon',
  },
  {
    id: 'commercial-lab',
    name: 'Commercial_Lab',
    subtitle: 'AI_AD_STUDIO',
    description: 'Token-based AI commercial generation. Full 64-second ads from text.',
    price: 'FROM $449/MO',
    position: 'top-right',
    status: 'active',
  },
  {
    id: 'cinesite',
    name: 'Cinesite Autopilot',
    subtitle: 'CONVERSION_SURFACE',
    description: 'Self-optimizing landing pages that A/B test themselves in real-time.',
    price: '$1,500',
    position: 'bottom-left',
    status: 'active',
  },
  {
    id: 'lingua-node',
    name: 'Lingua Node',
    subtitle: 'LINGUISTIC_DECODE',
    description: 'Experimental companion node. Inter-species translation protocols.',
    price: 'BETA',
    position: 'bottom-right',
    status: 'beta',
  },
];

export function NeuralTopology() {
  return (
    <section className="relative py-24 lg:py-32 bg-[#0a0a1e] overflow-hidden">
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,191,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,191,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-24"
        >
          {/* Terminal Tag */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="font-mono text-xs tracking-[0.2em] text-[#00bfff]/70 uppercase">
              [ NEURAL_TOPOLOGY ]
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            <span className="text-white">The Architecture of </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] to-amber-300 italic">
              Autonomy.
            </span>
          </h2>

          {/* Subhead */}
          <p className="text-[#8892b0] font-mono text-sm tracking-wider uppercase">
            // MODULAR INTELLIGENCE NODES WORKING IN UNISON
          </p>
        </motion.div>

        {/* Topology Grid */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connection Lines (SVG) */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block"
            viewBox="0 0 800 500"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Lines from center to corners */}
            <motion.path
              d="M400 250 L150 100"
              stroke="url(#gradient-blue)"
              strokeWidth="1"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
            <motion.path
              d="M400 250 L650 100"
              stroke="url(#gradient-gold)"
              strokeWidth="1"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.6 }}
            />
            <motion.path
              d="M400 250 L150 400"
              stroke="url(#gradient-blue)"
              strokeWidth="1"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.7 }}
            />
            <motion.path
              d="M400 250 L650 400"
              stroke="url(#gradient-green)"
              strokeWidth="1"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.8 }}
            />
            
            {/* Gradients */}
            <defs>
              <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00bfff" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#00bfff" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="gradient-gold" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffd700" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ffd700" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id="gradient-green" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00ff88" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#00ff88" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Node - Ragnarok */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative z-20 mx-auto w-64 h-64 lg:w-72 lg:h-72 mb-12 lg:mb-0 lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2"
          >
            {/* Glow Ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00bfff]/20 to-[#ffd700]/20 blur-xl animate-pulse" />
            
            {/* Outer Ring */}
            <div className="absolute inset-2 rounded-full border border-[#00bfff]/30" />
            
            {/* Inner Circle */}
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-[#1a1a3e] to-[#0a0a1e] border border-white/10 flex flex-col items-center justify-center">
              {/* Animated Texture */}
              <div 
                className="absolute inset-0 rounded-full opacity-50"
                style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                  backgroundSize: 'cover',
                  mixBlendMode: 'overlay',
                }}
              />
              
              <h3 className="text-2xl font-bold text-white relative z-10">Ragnarok</h3>
              <span className="font-mono text-xs text-[#00bfff]/60 tracking-wider relative z-10">
                [ CORE_ORCHESTRATOR ]
              </span>
              <div className="flex items-center gap-4 mt-3 text-xs text-[#8892b0] relative z-10">
                <span>59 AGENTS</span>
                <span>∞ MEMORY</span>
              </div>
            </div>
          </motion.div>

          {/* Product Cards Grid */}
          <div className="grid sm:grid-cols-2 gap-6 lg:gap-x-96 lg:gap-y-48">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="relative"
              >
                {/* Status Dot */}
                <div className="absolute -top-1 -right-1 z-10">
                  <span 
                    className={`
                      w-3 h-3 rounded-full block
                      ${product.status === 'active' ? 'bg-[#00ff88]' : ''}
                      ${product.status === 'coming-soon' ? 'bg-[#ffd700]' : ''}
                      ${product.status === 'beta' ? 'bg-[#00bfff]' : ''}
                    `}
                  />
                </div>

                <Link 
                  href={`/${product.id}`}
                  className="
                    block p-6 rounded-xl
                    bg-[#0f0f2a]/60 backdrop-blur-sm
                    border border-white/[0.06]
                    hover:border-[#00bfff]/20
                    transition-all duration-300 hover:-translate-y-1
                    group
                  "
                >
                  {/* Beta Badge */}
                  {product.status === 'beta' && (
                    <span className="inline-block px-2 py-1 mb-3 text-[10px] font-mono tracking-wider bg-[#00bfff]/10 border border-[#00bfff]/30 rounded text-[#00bfff]">
                      BETA_NODE
                    </span>
                  )}

                  {/* Title */}
                  <h4 className="text-lg font-bold text-white mb-1 group-hover:text-[#00bfff] transition-colors">
                    {product.name}
                  </h4>

                  {/* Subtitle */}
                  <div className="font-mono text-xs text-[#00bfff]/60 tracking-wider mb-3">
                    /// {product.subtitle}
                  </div>

                  {/* Description */}
                  <p className="text-[#8892b0] text-sm leading-relaxed mb-4">
                    {product.description}
                  </p>

                  {/* Price */}
                  <span 
                    className={`
                      inline-flex items-center px-3 py-1.5 rounded-md
                      font-mono text-xs tracking-wider
                      ${product.status === 'coming-soon' 
                        ? 'bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700]' 
                        : 'bg-[#00bfff]/10 border border-[#00bfff]/30 text-[#00bfff]'
                      }
                    `}
                  >
                    [ {product.price} ]
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
