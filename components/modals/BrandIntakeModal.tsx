'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Palette,
  Image,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Check,
  Upload,
} from 'lucide-react';
import SlideOver from '../ui/SlideOver';
import { BrandData } from '@/hooks/useLocalStorage';

interface BrandIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BrandData) => void;
  initialData?: BrandData | null;
}

const INDUSTRIES = [
  'Technology / SaaS',
  'E-commerce / Retail',
  'Healthcare / Medical',
  'Finance / Fintech',
  'Real Estate',
  'Education',
  'Marketing / Agency',
  'Manufacturing',
  'Entertainment / Media',
  'Other',
];

const COLOR_PRESETS = [
  { name: 'Cyan', value: '#00bfff' },
  { name: 'Gold', value: '#ffd700' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Blue', value: '#3b82f6' },
];

const VOICE_TONES = [
  {
    id: 'professional',
    name: 'Professional',
    desc: 'Formal, authoritative, trust-building',
    icon: '💼',
  },
  {
    id: 'friendly',
    name: 'Friendly',
    desc: 'Warm, approachable, conversational',
    icon: '😊',
  },
  {
    id: 'bold',
    name: 'Bold',
    desc: 'Confident, edgy, disruptive',
    icon: '🔥',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    desc: 'Clean, direct, no fluff',
    icon: '✨',
  },
];

const STEPS = [
  { id: 1, name: 'Basics', icon: Building2 },
  { id: 2, name: 'Colors', icon: Palette },
  { id: 3, name: 'Logo', icon: Image },
  { id: 4, name: 'Voice', icon: MessageSquare },
];

export default function BrandIntakeModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: BrandIntakeModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BrandData>({
    businessName: initialData?.businessName || '',
    industry: initialData?.industry || '',
    primaryColor: initialData?.primaryColor || '#00bfff',
    secondaryColor: initialData?.secondaryColor || '#ffd700',
    logoUrl: initialData?.logoUrl || null,
    voiceTone: initialData?.voiceTone || '',
    targetAudience: initialData?.targetAudience || '',
  });
  const [dragActive, setDragActive] = useState(false);

  const updateField = useCallback(
    <K extends keyof BrandData>(field: K, value: BrandData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((s) => s + 1);
    } else {
      onSave(formData);
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateField('logoUrl', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.businessName.trim() !== '' && formData.industry !== '';
      case 2:
        return formData.primaryColor !== '' && formData.secondaryColor !== '';
      case 3:
        return true; // Logo is optional
      case 4:
        return formData.voiceTone !== '';
      default:
        return false;
    }
  };

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title="Brand Setup"
      subtitle="Configure your brand identity"
      width="lg"
    >
      <div className="flex flex-col h-full">
        {/* Step Indicator */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
                    currentStep >= step.id
                      ? 'bg-[#00bfff] text-[#0B1220]'
                      : 'bg-white/5 text-slate-500'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check size={18} />
                  ) : (
                    <step.icon size={18} />
                  )}
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`w-12 h-0.5 mx-2 transition-all ${
                      currentStep > step.id ? 'bg-[#00bfff]' : 'bg-white/10'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {STEPS.map((step) => (
              <span
                key={step.id}
                className={`text-[10px] font-bold uppercase tracking-widest ${
                  currentStep >= step.id ? 'text-[#00bfff]' : 'text-slate-600'
                }`}
              >
                {step.name}
              </span>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Basics */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => updateField('businessName', e.target.value)}
                    placeholder="Enter your business name"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#00bfff] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                    Industry
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => updateField('industry', e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00bfff] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#0B1220]">
                      Select your industry
                    </option>
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind} className="bg-[#0B1220]">
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {/* Step 2: Colors */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                    Primary Color
                  </label>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {COLOR_PRESETS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => updateField('primaryColor', color.value)}
                        className={`w-10 h-10 rounded-xl transition-all ${
                          formData.primaryColor === color.value
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0B1220] scale-110'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => updateField('primaryColor', e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) => updateField('primaryColor', e.target.value)}
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-[#00bfff]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                    Secondary Color
                  </label>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {COLOR_PRESETS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => updateField('secondaryColor', color.value)}
                        className={`w-10 h-10 rounded-xl transition-all ${
                          formData.secondaryColor === color.value
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0B1220] scale-110'
                            : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.secondaryColor}
                      onChange={(e) => updateField('secondaryColor', e.target.value)}
                      className="w-12 h-12 rounded-lg cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={formData.secondaryColor}
                      onChange={(e) => updateField('secondaryColor', e.target.value)}
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-[#00bfff]"
                    />
                  </div>
                </div>

                {/* Preview */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                    Preview
                  </p>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-xl"
                      style={{ backgroundColor: formData.primaryColor }}
                    />
                    <div
                      className="w-16 h-16 rounded-xl"
                      style={{ backgroundColor: formData.secondaryColor }}
                    />
                    <div
                      className="flex-1 h-16 rounded-xl"
                      style={{
                        background: `linear-gradient(135deg, ${formData.primaryColor}, ${formData.secondaryColor})`,
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Logo */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                    Upload Logo (Optional)
                  </label>
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                      dragActive
                        ? 'border-[#00bfff] bg-[#00bfff]/10'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    {formData.logoUrl ? (
                      <div className="space-y-4">
                        <img
                          src={formData.logoUrl}
                          alt="Logo preview"
                          className="max-h-32 mx-auto rounded-lg"
                        />
                        <button
                          onClick={() => updateField('logoUrl', null)}
                          className="text-sm text-red-400 hover:text-red-300"
                        >
                          Remove Logo
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload
                          size={40}
                          className="mx-auto text-slate-500 mb-4"
                        />
                        <p className="text-white font-semibold mb-1">
                          Drag & drop your logo here
                        </p>
                        <p className="text-sm text-slate-500 mb-4">
                          or click to browse
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleFile(e.target.files[0]);
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Supports PNG, JPG, SVG. Max 5MB.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 4: Voice */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                    Voice & Tone
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {VOICE_TONES.map((tone) => (
                      <button
                        key={tone.id}
                        onClick={() => updateField('voiceTone', tone.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          formData.voiceTone === tone.id
                            ? 'border-[#00bfff] bg-[#00bfff]/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <span className="text-2xl">{tone.icon}</span>
                        <p className="font-bold text-white mt-2">{tone.name}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {tone.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                    Target Audience
                  </label>
                  <textarea
                    value={formData.targetAudience}
                    onChange={(e) =>
                      updateField('targetAudience', e.target.value)
                    }
                    placeholder="Describe your ideal customer (e.g., 'Tech-savvy entrepreneurs aged 25-45 looking to automate their marketing')"
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#00bfff] transition-colors resize-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="p-6 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              currentStep === 1
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <ChevronLeft size={18} />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${
              canProceed()
                ? 'bg-[#00bfff] text-[#0B1220] hover:bg-[#00bfff]/90'
                : 'bg-white/10 text-slate-500 cursor-not-allowed'
            }`}
          >
            {currentStep === 4 ? 'Save Brand' : 'Continue'}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </SlideOver>
  );
}
