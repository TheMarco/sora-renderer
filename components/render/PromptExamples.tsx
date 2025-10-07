'use client';

import { useState } from 'react';

interface PromptExamplesProps {
  onUseExample: (prompt: string) => void;
}

const EXAMPLES = [
  {
    id: 'simple',
    title: 'Simple & Effective',
    prompt: 'A golden retriever puppy playing in a sunny garden, chasing butterflies. Camera: medium shot, eye level. Lighting: natural golden hour sunlight. The puppy jumps playfully, pauses to look at camera, then runs off-screen.',
    tags: ['Beginner', 'Nature']
  },
  {
    id: 'cinematic',
    title: 'Cinematic Drama',
    prompt: `A woman in a red coat stands at a rain-soaked train platform at dusk. Steam rises from the tracks.

Cinematography:
Camera shot: wide shot, low angle
Lens: 35mm
Depth of field: shallow (sharp on subject, blurred background)
Lighting: cool blue hour light with warm station lights
Mood: melancholic, cinematic

Actions:
- She checks her watch
- Looks down the empty tracks
- A train's headlight appears in the distance`,
    tags: ['Advanced', 'Cinematic']
  },
  {
    id: 'animated',
    title: 'Animated Character',
    prompt: `Style: Hand-painted 2D animation with soft watercolor textures and warm lighting. Cozy storybook aesthetic.

A small fox sits in a forest clearing surrounded by glowing fireflies. Mushrooms and ferns frame the scene.

Cinematography:
Camera: medium close-up, gentle push-in
Mood: whimsical, magical, peaceful

Actions:
- Fox tilts head curiously at a firefly
- Firefly lands on fox's nose
- Fox's eyes widen in wonder
- Fox says softly: "Hello, little friend"`,
    tags: ['Animation', 'Whimsical']
  },
  {
    id: 'product',
    title: 'Product Showcase',
    prompt: `A sleek smartphone rotates slowly on a white pedestal against a gradient background (deep blue to purple).

Cinematography:
Camera: 360° rotation, medium shot
Lighting: soft key light from top-right, rim light for edge definition
Mood: premium, modern, clean

Actions:
- Phone completes one full rotation
- Screen lights up showing colorful display
- Subtle lens flare as light catches the edge`,
    tags: ['Commercial', 'Product']
  },
  {
    id: 'documentary',
    title: 'Documentary Interview',
    prompt: `In a 90s documentary-style interview, an elderly craftsman sits in his workshop surrounded by handmade wooden furniture.

Camera shot: medium shot, eye level
Depth of field: shallow (sharp on subject, blurred workshop background)
Lighting: warm natural window light with soft fill
Mood: intimate, nostalgic

Craftsman says: "I've been making furniture for fifty years. Each piece tells a story."

Background: Soft sounds of wind chimes, distant birds`,
    tags: ['Documentary', 'Interview']
  },
  {
    id: 'action',
    title: 'Action Sequence',
    prompt: `A skateboarder approaches a ramp in an urban skate park at sunset.

Lighting: golden hour, warm orange and pink sky
Palette: concrete gray, sunset orange, denim blue

Actions:
- Skater takes three strong pushes toward the ramp
- Launches into the air at the ramp's peak
- Performs a 180° rotation
- Lands smoothly and rides away in the final second

Camera: tracking shot following the action, medium-wide
Mood: energetic, triumphant`,
    tags: ['Action', 'Sports']
  }
];

export function PromptExamples({ onUseExample }: PromptExamplesProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-text-primary">✨ Example Prompts</h3>
        <span className="text-xs text-text-tertiary">Click to expand</span>
      </div>
      
      <div className="space-y-2">
        {EXAMPLES.map((example) => (
          <div key={example.id} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedId(expandedId === example.id ? null : example.id)}
              className="w-full px-3 py-2 flex items-center justify-between hover:bg-surface-hover transition-colors text-left"
            >
              <div className="flex-1">
                <div className="font-medium text-sm text-text-primary">{example.title}</div>
                <div className="flex items-center space-x-1 mt-1">
                  {example.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-1.5 py-0.5 rounded bg-accent/10 text-accent"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-text-tertiary ml-2">
                {expandedId === example.id ? '▼' : '▶'}
              </span>
            </button>
            
            {expandedId === example.id && (
              <div className="px-3 py-3 bg-surface border-t border-border">
                <pre className="text-xs text-text-secondary whitespace-pre-wrap mb-3 font-mono">
                  {example.prompt}
                </pre>
                <button
                  onClick={() => onUseExample(example.prompt)}
                  className="btn-secondary text-sm w-full"
                >
                  Use This Example
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-xs text-text-tertiary">
          💡 Tip: These examples show different levels of detail. Start simple and add more structure as you learn what works.
        </p>
      </div>
    </div>
  );
}

