'use client';

import { MODELS } from '@/lib/constants';
import { getPricePerSecond, formatRate } from '@/lib/cost';
import type { ModelId, Resolution } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ModelPickerProps {
  value: ModelId;
  onChange: (model: ModelId) => void;
  resolution: Resolution;
}

export function ModelPicker({ value, onChange, resolution }: ModelPickerProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Model</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {MODELS.map((model) => {
          const isSelected = value === model.id;
          const pricePerSec = getPricePerSecond(model.id, resolution);

          return (
            <button
              key={model.id}
              onClick={() => onChange(model.id)}
              className={cn(
                'glass-card-hover p-4 text-left transition-all',
                isSelected && 'ring-2 ring-accent bg-surface-hover'
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-text-primary">{model.name}</h3>
                {pricePerSec > 0 && (
                  <span className="text-xs badge-info">{formatRate(pricePerSec)}</span>
                )}
              </div>
              <p className="text-sm text-text-secondary">{model.description}</p>
              <p className="text-xs text-text-tertiary mt-2">
                Max duration: {model.maxDuration}s
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

