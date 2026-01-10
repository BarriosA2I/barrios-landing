'use client';

import React from 'react';

interface ExtractedBrief {
  business_name?: string;
  primary_offering?: string;
  target_demographic?: string;
  call_to_action?: string;
  tone?: string;
}

interface BriefSummaryCardProps {
  brief: ExtractedBrief;
  isComplete: boolean;
  onConfirm: () => void;
  onEdit: (field: string) => void;
}

export function BriefSummaryCard({ brief, isComplete, onConfirm, onEdit }: BriefSummaryCardProps) {
  const fields = [
    { key: 'business_name', label: 'Business', icon: '🏢' },
    { key: 'primary_offering', label: 'Product/Service', icon: '📦' },
    { key: 'target_demographic', label: 'Target Audience', icon: '👥' },
    { key: 'call_to_action', label: 'Call to Action', icon: '🎯' },
    { key: 'tone', label: 'Tone', icon: '🎨' },
  ];

  return (
    <div className="bg-gray-900/80 border border-cyan-500/30 rounded-lg p-4 space-y-4">
      <h3 className="text-cyan-400 font-semibold text-lg flex items-center gap-2">
        <span>📋</span> Video Brief Summary
      </h3>

      <div className="grid gap-3">
        {fields.map(({ key, label, icon }) => {
          const value = brief[key as keyof ExtractedBrief];
          return (
            <div
              key={key}
              className="flex items-center justify-between p-2 bg-gray-800/50 rounded"
            >
              <div className="flex items-center gap-2">
                <span>{icon}</span>
                <span className="text-gray-400 text-sm">{label}:</span>
              </div>
              <div className="flex items-center gap-2">
                {value ? (
                  <span className="text-white text-sm">{value}</span>
                ) : (
                  <span className="text-gray-500 italic text-sm">Not provided</span>
                )}
                <button
                  onClick={() => onEdit(key)}
                  className="text-cyan-500 hover:text-cyan-400 text-xs"
                  aria-label={`Edit ${label}`}
                >
                  ✏️
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isComplete && (
        <button
          onClick={onConfirm}
          className="w-full py-3 bg-gradient-to-r from-cyan-600 to-teal-600
                     hover:from-cyan-500 hover:to-teal-500 rounded-lg font-semibold
                     text-white transition-all duration-200 flex items-center justify-center gap-2"
        >
          <span>🎬</span> Start Video Production
        </button>
      )}
    </div>
  );
}
