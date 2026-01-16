// 📁 components/ContactForm.tsx
// Purpose: Contact form section - "Get in Touch"
// Visual DNA: Matches Image 318 from screenshots
// Dependencies: framer-motion

'use client';

import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { useState } from 'react';

const interestOptions = [
  { value: '', label: "I'm interested in..." },
  { value: 'rag-research', label: 'RAG Research Agents' },
  { value: 'marketing-overlord', label: 'Marketing Overlord' },
  { value: 'ai-websites', label: 'AI-Powered Websites' },
  { value: 'app-dev', label: 'Custom App Development' },
  { value: 'creative-director', label: 'AI Creative Director' },
  { value: 'other', label: 'Something Else' },
];

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Integrate with your form handler (e.g., Resend, Formspree, etc.)
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    // Reset form or show success message
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section className="relative py-24 lg:py-32 bg-[#0a0a1e]">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,191,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,191,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 40%, transparent 100%)',
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          {/* Section Header */}
          <div className="text-center mb-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/30">
              <span className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse" />
              <span className="font-mono text-xs tracking-wider text-[#00ff88]">
                SIGNAL RECEIVED
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              <span className="text-white">Get in </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00bfff] to-cyan-300 italic">
                Touch.
              </span>
            </h2>

            {/* Subhead */}
            <p className="text-[#8892b0]">
              Tell us about your project. We'll respond within 24 hours.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name & Email Row */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="
                    w-full px-4 py-4 rounded-xl
                    bg-[#0f0f2a]/60 backdrop-blur-sm
                    border border-white/[0.06]
                    text-white placeholder-[#8892b0]/50
                    focus:outline-none focus:border-[#00bfff]/30 focus:ring-1 focus:ring-[#00bfff]/20
                    transition-all duration-300
                  "
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="
                    w-full px-4 py-4 rounded-xl
                    bg-[#0f0f2a]/60 backdrop-blur-sm
                    border border-white/[0.06]
                    text-white placeholder-[#8892b0]/50
                    focus:outline-none focus:border-[#00bfff]/30 focus:ring-1 focus:ring-[#00bfff]/20
                    transition-all duration-300
                  "
                />
              </div>
            </div>

            {/* Phone & Interest Row */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone (optional)"
                  value={formData.phone}
                  onChange={handleChange}
                  className="
                    w-full px-4 py-4 rounded-xl
                    bg-[#0f0f2a]/60 backdrop-blur-sm
                    border border-white/[0.06]
                    text-white placeholder-[#8892b0]/50
                    focus:outline-none focus:border-[#00bfff]/30 focus:ring-1 focus:ring-[#00bfff]/20
                    transition-all duration-300
                  "
                />
              </div>
              <div>
                <select
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  className="
                    w-full px-4 py-4 rounded-xl
                    bg-[#0f0f2a]/60 backdrop-blur-sm
                    border border-white/[0.06]
                    text-white
                    focus:outline-none focus:border-[#00bfff]/30 focus:ring-1 focus:ring-[#00bfff]/20
                    transition-all duration-300
                    appearance-none cursor-pointer
                  "
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%238892b0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1rem',
                  }}
                >
                  {interestOptions.map((option) => (
                    <option 
                      key={option.value} 
                      value={option.value}
                      className="bg-[#0a0a1e] text-white"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <textarea
                name="message"
                placeholder="Tell us about your goals or questions..."
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="
                  w-full px-4 py-4 rounded-xl
                  bg-[#0f0f2a]/60 backdrop-blur-sm
                  border border-white/[0.06]
                  text-white placeholder-[#8892b0]/50
                  focus:outline-none focus:border-[#00bfff]/30 focus:ring-1 focus:ring-[#00bfff]/20
                  transition-all duration-300
                  resize-none
                "
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                w-full flex items-center justify-center gap-2 px-8 py-4
                bg-gradient-to-r from-[#00bfff] to-cyan-400
                text-[#0a0a1e] font-mono font-semibold tracking-wide
                rounded-xl
                hover:shadow-[0_0_40px_-8px_rgba(0,191,255,0.5)]
                transition-all duration-300 hover:-translate-y-0.5
                disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
              "
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'TRANSMITTING...' : 'SEND MESSAGE'}
            </button>

            {/* Privacy Note */}
            <p className="text-center text-[#8892b0]/50 text-sm">
              We respect your privacy. No spam, ever.
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
