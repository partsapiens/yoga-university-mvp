import { useState } from 'react';

interface FilterOption {
  label: string;
  value: string;
}

interface AdvancedFiltersProps {
  filters: { 
    family?: string[]; 
    intensity?: string[];
    [key: string]: any;
  };
  setFilters: (updater: (prev: any) => any) => void;
  options: {
    family: FilterOption[];
    intensity: FilterOption[];
    [key: string]: FilterOption[];
  };
}

export default function AdvancedFilters({ filters, setFilters, options }: AdvancedFiltersProps) {
  const [familyExpanded, setFamilyExpanded] = useState(false);

  const handleMultiSelect = (filterType: string, value: string) => {
    setFilters((prev: any) => {
      const currentValues = prev[filterType] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v: string) => v !== value)
        : [...currentValues, value];
      return { ...prev, [filterType]: newValues };
    });
  };

  return (
    <div className="space-y-4 p-4 bg-white dark:bg-gray-800 border rounded-lg">
      <h3 className="font-semibold text-gray-900 dark:text-white">Advanced Filters</h3>
      
      {/* Family Multi-Select */}
      <div>
        <button 
          className="w-full text-left p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
          onClick={() => setFamilyExpanded(!familyExpanded)}
        >
          Pose Families {familyExpanded ? '↑' : '↓'}
        </button>
        {familyExpanded && (
          <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
            {options.family?.map((option) => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={(filters.family || []).includes(option.value)}
                  onChange={() => handleMultiSelect('family', option.value)}
                  className="rounded"
                />
                <span className="text-sm dark:text-white">{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Intensity Multi-Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Intensity Levels
        </label>
        <div className="flex flex-wrap gap-2">
          {options.intensity?.map((option) => (
            <button
              key={option.value}
              onClick={() => handleMultiSelect('intensity', option.value)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                (filters.intensity || []).includes(option.value)
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}