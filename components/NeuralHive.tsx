"use client";

import React, { useMemo, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * NEURAL HIVE VISUALIZER
 * Specialized component for Barrios A2I
 * Features: Generative SVG nodes, volumetric glow, mouse-reactive pulse
 *
 * @author Barrios A2I Design System
 * @version 1.0.0
 */

const AGENT_COUNT = 12;

interface ProductNode {
  title: string;
  desc: string;
  price: string;
}

const PRODUCTS: ProductNode[] = [
  { title: "Marketing Overlord", desc: "Autonomous campaign management.", price: "$199/mo" },
  { title: "Commercial_Lab", desc: "Token-based AI commercial studio.", price: "From $449" },
  { title: "Cinesite Autopilot", desc: "Self-optimizing landing pages.", price: "$1,500" },
  { title: "Lingua Node", desc: "Inter-species translation protocols.", price: "BETA" }
];

export default function NeuralHive() {
  const containerRef = useRef<HTMLDivElement>(null);

  const nodes = useMemo(() => {
    return Array.from({ length: AGENT_COUNT }).map((_, i) => ({
      id: i,
      angle: (i * 360) / AGENT_COUNT,
      delay: i * 0.2,
    }));
  }, []);

  return (
    <section className="relative w-full py-24 overflow-hidden bg-[#0a0a1e] flex flex-col items-center">
      {/* Background Volumetric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00bfff]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 text-center mb-16">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-[#00bfff] font-mono text-xs tracking-[0.3em] uppercase"
        >
          [ Neural_Topology ]
        </motion.span>
        <h2 className="text-5xl md:text-7xl font-bold text-white mt-4 tracking-tighter">
          The Architecture of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00bfff] to-[#ffd700]">Autonomy</span>
        </h2>
      </div>

      {/* Core Orchestrator: Ragnarok */}
      <div className="relative w-[320px] h-[320px] md:w-[500px] md:h-[500px]" ref={containerRef}>
        <motion.div
          animate={{
            boxShadow: ["0 0 20px #00bfff44", "0 0 60px #00bfff88", "0 0 20px #00bfff44"]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 m-auto w-32 h-32 md:w-48 md:h-48 rounded-full border border-[#00bfff]/30 bg-white/5 backdrop-blur-2xl flex flex-col items-center justify-center z-20"
        >
          <span className="text-white font-bold text-xl tracking-widest">RAGNAROK</span>
          <span className="text-[#00bfff] font-mono text-[10px] mt-2">CORE_ORCHESTRATOR</span>
          <div className="mt-2 flex gap-1">
            <div className="w-1 h-1 bg-[#00bfff] rounded-full animate-ping" />
            <div className="w-1 h-1 bg-[#ffd700] rounded-full animate-pulse" />
          </div>
        </motion.div>

        {/* Neural Nodes (Agents) */}
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0"
            style={{ transform: `rotate(${node.angle}deg)` }}
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: node.delay,
                ease: "easeInOut"
              }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#ffd700] shadow-[0_0_15px_#ffd700]"
            />
          </motion.div>
        ))}

        {/* Connection Line */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[1px] h-[120px] md:h-[200px] bg-gradient-to-b from-[#ffd700]/50 to-transparent" />

        {/* SVG Orbital Rings */}
        <svg className="absolute inset-0 w-full h-full rotate-[-15deg]">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="#00bfff"
            strokeWidth="0.5"
            strokeDasharray="4 8"
            className="opacity-20"
          />
        </svg>
      </div>

      {/* Product Nodes - Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-24 px-6 max-w-7xl w-full">
        {PRODUCTS.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-[#00bfff]/50 transition-all duration-500"
          >
            <h3 className="text-[#ffd700] font-bold text-lg mb-2">{item.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">{item.desc}</p>
            <div className="text-[#00bfff] font-mono text-xs font-bold px-2 py-1 bg-[#00bfff]/10 rounded border border-[#00bfff]/20 w-fit">
              {item.price}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
