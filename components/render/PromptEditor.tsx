'use client';

import { useState } from 'react';
import { StyleBrowser } from './StyleBrowser';

interface PromptEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const QUICK_TEMPLATES = [
  {
    name: 'Cinematic',
    template: `[Scene description]

Cinematography:
Camera: [wide/medium/close-up], [angle]
Lighting: [natural/warm/cool], [direction]
Mood: [cinematic/tense/intimate]

Actions:
- [Action 1]
- [Action 2]
- [Action 3]`
  },
  {
    name: 'Animated',
    template: `Style: [2D/3D/stop-motion], [aesthetic]

[Scene description]

Camera: [shot type]
Mood: [whimsical/playful/magical]

Actions:
- [Action 1]
- Character says: "[dialogue]"`
  },
  {
    name: 'Documentary',
    template: `In a [era] documentary-style interview, [subject description].

Camera: [shot type], [angle]
Lighting: [setup]

Subject says: "[quote]"`
  }
];

const TIPS = [
  { category: 'Camera', tip: 'Specify shot type (wide, medium, close-up) and angle (eye level, low, high)' },
  { category: 'Lighting', tip: 'Describe lighting: natural, warm, cool, golden hour, backlight, rim light' },
  { category: 'Actions', tip: 'Break into specific beats with timing: "takes 3 steps", "pauses", "in final second"' },
  { category: 'Dialogue', tip: 'Keep brief (4-12 sec clips). Format: Character: "Line"' },
  { category: 'Style', tip: 'For animation: specify style (2D, watercolor). For film: mention era and film stock' },
  { category: 'Mood', tip: 'Set overall tone: cinematic, whimsical, tense, nostalgic, intimate' }
];

export function PromptEditor({ value, onChange }: PromptEditorProps) {
  const [showGuide, setShowGuide] = useState(false);
  const charCount = value.length;
  const wordCount = value.trim().split(/\s+/).filter(Boolean).length;

  const handleInsertTemplate = (template: string) => {
    if (value.trim()) {
      if (confirm('Replace existing prompt with template?')) {
        onChange(template);
      }
    } else {
      onChange(template);
    }
    setShowGuide(false);
  };

  const handleSelectStyle = (styleName: string) => {
    // Add style to the beginning of the prompt or append if empty
    if (value.trim()) {
      onChange(`Style: ${styleName}\n\n${value}`);
    } else {
      onChange(`Style: ${styleName}\n\n`);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">Prompt</label>
        <div className="flex items-center space-x-2">
          <StyleBrowser onSelectStyle={handleSelectStyle} />
          <button
            onClick={() => setShowGuide(!showGuide)}
            className="text-sm px-3 py-1 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
          >
            {showGuide ? '✕ Close Guide' : '💡 Prompting Guide'}
          </button>
        </div>
      </div>

      {showGuide && (
        <div className="glass-card p-4 space-y-4 border-2 border-accent/30">
          {/* Quick Templates */}
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-2">Quick Templates</h3>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_TEMPLATES.map((template) => (
                <button
                  key={template.name}
                  onClick={() => handleInsertTemplate(template.template)}
                  className="btn-secondary text-xs py-2"
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-2">Quick Tips</h3>
            <div className="space-y-2">
              {TIPS.map((item, i) => (
                <div key={i} className="text-xs">
                  <span className="font-medium text-accent">{item.category}:</span>{' '}
                  <span className="text-text-secondary">{item.tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Full Guide Link */}
          <div className="pt-2 border-t border-border">
            <a
              href="https://cookbook.openai.com/examples/sora/sora2_prompting_guide"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent hover:underline"
            >
              📚 View Full OpenAI Sora 2 Prompting Guide →
            </a>
          </div>
        </div>
      )}

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe your scene in detail... Click 'Prompting Guide' above for templates and tips on cinematography, lighting, actions, and dialogue."
        rows={8}
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

