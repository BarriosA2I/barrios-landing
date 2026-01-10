'use client';

import React from 'react';

interface BriefProgressBarProps {
  progress: number; // 0-100
  missingFields: string[];
  isComplete: boolean;
}

const fieldLabels: Record<string, string> = {
  business_name: 'Business',
  primary_offering: 'Product',
  target_demographic: 'Audience',
  call_to_action: 'CTA',
  tone: 'Tone',
};

export function BriefProgressBar({ progress, missingFields, isComplete }: BriefProgressBarProps) {
  const allFields = ['business_name', 'primary_offering', 'target_demographic', 'call_to_action', 'tone'];
  const filledFields = allFields.filter(f => !missingFields.includes(f));

  return (
    <div className="w-full space-y-3">
      {/* Progress bar */}
      <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full transition-all duration-500 ${
            isComplete ? 'bg-green-500' : 'bg-cyan-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Field indicators */}
      <div className="flex justify-between text-xs">
        {allFields.map((key) => {
          const filled = !missingFields.includes(key);
          const label = fieldLabels[key] || key;
          return (
            <div
              key={key}
              className={`flex items-center gap-1 ${
                filled ? 'text-cyan-400' : 'text-gray-500'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                filled ? 'bg-cyan-500' : 'bg-gray-600'
              }`} />
              {label}
            </div>
          );
        })}
      </div>

      {/* Status text */}
      <div className="text-center text-sm">
        {isComplete ? (
          <span className="text-green-400">✓ Brief complete - Ready for production</span>
        ) : (
          <span className="text-gray-400">
            {progress}% complete • Need: {missingFields.map(f => fieldLabels[f] || f).join(', ')}
          </span>
        )}
      </div>
    </div>
  );
}
