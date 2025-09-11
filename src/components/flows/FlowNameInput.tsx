import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Check } from 'lucide-react';
import { Focus } from '@/types/yoga';

interface FlowNameInputProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  focus?: Focus;
  intensity?: number;
  duration?: number;
  className?: string;
}

export function FlowNameInput({ 
  value, 
  onChange, 
  onSave, 
  focus = 'Full-Body',
  intensity = 3,
  duration = 30,
  className = '' 
}: FlowNameInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate name suggestions based on flow properties
  useEffect(() => {
    const generateSuggestions = () => {
      const timeOfDay = new Date().getHours();
      const dayPeriod = timeOfDay < 12 ? 'Morning' : timeOfDay < 17 ? 'Afternoon' : 'Evening';
      
      const intensityNames = ['Gentle', 'Easy', 'Moderate', 'Dynamic', 'Power'];
      const intensityName = intensityNames[Math.max(0, Math.min(4, intensity - 1))];
      
      const durationText = duration < 20 ? 'Quick' : duration < 45 ? 'Standard' : 'Extended';
      
      const suggestions = [
        `${dayPeriod} ${focus} Flow`,
        `${intensityName} ${focus} Practice`,
        `${durationText} ${focus} Session`,
        `${Math.round(duration)}min ${focus} Flow`,
        `${intensityName} ${dayPeriod} Practice`,
        `Mindful ${focus} Journey`,
        `${focus} Flow - ${new Date().toLocaleDateString()}`,
        `Daily ${focus} Practice`,
      ];
      
      setSuggestions(suggestions.slice(0, 6)); // Limit to 6 suggestions
    };

    generateSuggestions();
  }, [focus, intensity, duration]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      onSave();
      setShowSuggestions(false);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleGenerateRandom = () => {
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    onChange(randomSuggestion);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2">
        {/* Main Input */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Name your flow..."
            className="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring pr-10"
          />
          
          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerateRandom}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted/50 rounded transition-colors"
            title="Generate random name"
          >
            <Sparkles size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Save Button */}
        <button
          onClick={onSave}
          disabled={!value.trim()}
          className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Check size={16} />
          <span className="hidden sm:inline">Save</span>
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-10 max-h-48 overflow-auto">
          <div className="p-2">
            <div className="text-xs text-muted-foreground mb-2 px-2">Suggestions:</div>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-muted/50 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Character count */}
      {value && (
        <div className="mt-1 text-xs text-muted-foreground text-right">
          {value.length}/50 characters
        </div>
      )}
    </div>
  );
}