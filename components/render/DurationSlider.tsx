'use client';

import { useState } from 'react';
import { MIN_DURATION, MAX_DURATION } from '@/lib/constants';
import type { ModelId } from '@/lib/types';
import { MODELS } from '@/lib/constants';

interface DurationSliderProps {
  value: number;
  onChange: (duration: number) => void;
  model: ModelId;
}

export function DurationSlider({ value, onChange, model }: DurationSliderProps) {
  const [inputValue, setInputValue] = useState(value.toString());
  const maxDuration = MODELS.find((m) => m.id === model)?.maxDuration || MAX_DURATION;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    let newValue = parseInt(inputValue);
    if (isNaN(newValue)) {
      newValue = value;
    } else {
      newValue = Math.max(MIN_DURATION, Math.min(maxDuration, newValue));
    }
    onChange(newValue);
    setInputValue(newValue.toString());
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">Duration</label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            min={MIN_DURATION}
            max={maxDuration}
            className="w-16 px-2 py-1 text-sm text-center bg-surface border border-border rounded focus:border-border-focus focus:ring-1 focus:ring-border-focus"
          />
          <span className="text-sm text-text-secondary">seconds</span>
        </div>
      </div>

      <input
        type="range"
        min={MIN_DURATION}
        max={maxDuration}
        value={value}
        onChange={handleSliderChange}
        className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-accent"
      />

      <div className="flex justify-between text-xs text-text-tertiary">
        <span>{MIN_DURATION}s</span>
        <span>{maxDuration}s</span>
      </div>
    </div>
  );
}

