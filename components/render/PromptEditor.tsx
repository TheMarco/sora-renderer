'use client';

import { useState } from 'react';

interface PromptEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function PromptEditor({ value, onChange }: PromptEditorProps) {
  const [showTips, setShowTips] = useState(false);
  const charCount = value.length;
  const wordCount = value.trim().split(/\s+/).filter(Boolean).length;

  const tips = [
    'Be specific about camera movements (e.g., "slow push-in", "tracking shot")',
    'Describe lighting and atmosphere (e.g., "golden hour", "moody blue tones")',
    'Include details about depth of field and focus (e.g., "shallow DOF", "macro")',
    'Mention specific visual styles or references (e.g., "cinematic", "documentary style")',
    'Describe motion and pacing (e.g., "slow motion", "time-lapse")',
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">Prompt</label>
        <button
          onClick={() => setShowTips(!showTips)}
          className="text-xs text-accent hover:text-accent-light transition-colors"
        >
          {showTips ? 'Hide' : 'Show'} Tips
        </button>
      </div>

      {showTips && (
        <div className="glass-card p-4 text-sm space-y-2">
          <h4 className="font-medium text-text-primary mb-2">💡 Prompt Tips</h4>
          <ul className="space-y-1 text-text-secondary">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe the video you want to generate... Be specific about camera movements, lighting, and atmosphere."
        rows={6}
        className="textarea"
      />

      <div className="flex items-center justify-between text-xs text-text-tertiary">
        <span>
          {wordCount} {wordCount === 1 ? 'word' : 'words'} • {charCount} characters
        </span>
        {charCount > 500 && (
          <span className="text-warning">Long prompts may be truncated</span>
        )}
      </div>
    </div>
  );
}

