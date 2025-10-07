'use client';

import { ALLOWED_DURATIONS } from '@/lib/constants';
import type { ModelId } from '@/lib/types';

interface DurationSliderProps {
  value: number;
  onChange: (duration: number) => void;
  model: ModelId;
}

export function DurationSlider({ value, onChange }: DurationSliderProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">Duration</label>

      <div className="grid grid-cols-3 gap-3">
        {ALLOWED_DURATIONS.map((duration) => (
          <button
            key={duration}
            type="button"
            onClick={() => onChange(duration)}
            className={`
              px-4 py-3 rounded-lg border-2 transition-all
              ${
                value === duration
                  ? 'border-accent bg-accent/10 text-accent font-semibold'
                  : 'border-border bg-surface hover:border-border-focus'
              }
            `}
          >
            <div className="text-lg font-bold">{duration}s</div>
            <div className="text-xs text-text-tertiary mt-1">
              {duration === 4 && 'Quick'}
              {duration === 8 && 'Standard'}
              {duration === 12 && 'Extended'}
            </div>
          </button>
        ))}
      </div>

      <p className="text-xs text-text-tertiary">
        Sora 2 supports 4, 8, or 12 second videos
      </p>
    </div>
  );
}

