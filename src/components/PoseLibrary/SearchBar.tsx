import * as React from 'react';
import { useState } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  suggestions?: string[];
}

export default function SearchBar({ value, onChange, suggestions = [] }: SearchBarProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  const handleInputChange = (inputValue: string) => {
    onChange(inputValue);
    
    if (inputValue && suggestions.length > 0) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(inputValue.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <input
        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        type="text"
        placeholder="Search poses (English, Sanskrit, family)..."
        value={value}
        onChange={e => handleInputChange(e.target.value)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        onFocus={() => value && setShowSuggestions(filteredSuggestions.length > 0)}
        aria-label="Search poses"
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div role="listbox" className="absolute bg-white dark:bg-gray-700 shadow-lg rounded z-10 w-full border dark:border-gray-600 mt-1">
          {filteredSuggestions.map((suggestion, index) => (
            <div 
              key={index}
              role="option"
              aria-selected={false}
              className="p-2 hover:bg-blue-100 dark:hover:bg-gray-600 cursor-pointer dark:text-white" 
              onClick={() => selectSuggestion(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}