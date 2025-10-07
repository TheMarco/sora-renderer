'use client';

import { useState, useMemo } from 'react';
import { VIDEO_STYLES, STYLE_CATEGORIES, searchStyles, getStylesByCategory } from '@/lib/videoStyles';

interface StyleBrowserProps {
  onSelectStyle: (styleName: string) => void;
}

export function StyleBrowser({ onSelectStyle }: StyleBrowserProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredStyles = useMemo(() => {
    if (searchQuery) {
      return searchStyles(searchQuery);
    }
    return getStylesByCategory(selectedCategory);
  }, [searchQuery, selectedCategory]);

  const handleSelectStyle = (styleName: string) => {
    onSelectStyle(styleName);
    setIsOpen(false);
    setSearchQuery('');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm px-3 py-1 rounded-lg bg-surface hover:bg-surface-hover border border-border transition-colors"
      >
        🎨 Browse Styles ({VIDEO_STYLES.length})
      </button>
    );
  }

  return (
    <div className="glass-card p-4 space-y-3 border-2 border-accent/30">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-text-primary">
          Video Styles ({filteredStyles.length})
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-sm text-text-tertiary hover:text-text-primary"
        >
          ✕ Close
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search styles..."
        className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-lg focus:border-accent focus:outline-none"
      />

      {/* Category Filter */}
      <div className="flex flex-wrap gap-1">
        {STYLE_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => {
              setSelectedCategory(category);
              setSearchQuery('');
            }}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              selectedCategory === category
                ? 'bg-accent text-white'
                : 'bg-surface hover:bg-surface-hover text-text-secondary'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Styles Grid */}
      <div className="max-h-[400px] overflow-y-auto space-y-2">
        {filteredStyles.length === 0 ? (
          <p className="text-sm text-text-tertiary text-center py-8">
            No styles found matching &quot;{searchQuery}&quot;
          </p>
        ) : (
          filteredStyles.map((style) => (
            <button
              key={style.name}
              onClick={() => handleSelectStyle(style.name)}
              className="w-full text-left p-3 bg-surface hover:bg-surface-hover border border-border rounded-lg transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-text-primary group-hover:text-accent">
                      {style.name}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-accent/10 text-accent">
                      {style.category}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary">{style.description}</p>
                </div>
                <span className="text-text-tertiary group-hover:text-accent ml-2">→</span>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-border space-y-1">
        <p className="text-xs text-text-tertiary">
          💡 Click a style to add it to your prompt
        </p>
        <p className="text-xs text-text-tertiary italic">
          Note: These are suggested styles based on common cinematography terms, not from OpenAI&apos;s official guide.
        </p>
      </div>
    </div>
  );
}

