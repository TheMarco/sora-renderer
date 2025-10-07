'use client';

import { RESOLUTIONS } from '@/lib/constants';
import { isResolutionAvailable } from '@/lib/cost';
import type { ModelId, Resolution } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ResolutionPickerProps {
  value: Resolution;
  onChange: (resolution: Resolution) => void;
  model: ModelId;
}

export function ResolutionPicker({ value, onChange, model }: ResolutionPickerProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Resolution</label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {RESOLUTIONS.map((res) => {
          const isSelected = value === res.value;
          const isAvailable = isResolutionAvailable(model, res.value);
          const isLandscape = res.orientation === 'landscape';

          return (
            <button
              key={res.value}
              onClick={() => isAvailable && onChange(res.value)}
              disabled={!isAvailable}
              className={cn(
                'glass-card-hover p-4 text-center transition-all',
                'disabled:opacity-30 disabled:cursor-not-allowed',
                isSelected && 'ring-2 ring-accent bg-surface-hover'
              )}
            >
              {/* Aspect ratio icon */}
              <div className="flex items-center justify-center mb-2">
                <div
                  className={cn(
                    'border-2 border-current',
                    isLandscape ? 'w-12 h-8' : 'w-8 h-12'
                  )}
                />
              </div>

              <div className="text-sm font-medium text-text-primary">{res.label}</div>
              <div className="text-xs text-text-tertiary mt-1">{res.aspect}</div>

              {!isAvailable && (
                <div className="text-xs text-error mt-1">Pro only</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

