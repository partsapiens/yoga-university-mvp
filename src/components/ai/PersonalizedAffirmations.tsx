import React, { useState, useEffect, useCallback } from 'react';
import { generatePersonalizedAffirmations } from '@/lib/api/ai';

interface PersonalizedAffirmationsProps {
  context: 'meditation' | 'flow' | 'general';
  userProfile?: {
    goals?: string[];
    challenges?: string[];
    experience?: 'beginner' | 'intermediate' | 'advanced';
    preferredTone?: 'gentle' | 'empowering' | 'calming' | 'energizing';
  };
  sessionData?: {
    mood?: string;
    timeOfDay?: string;
    focusArea?: string;
    duration?: number;
  };
  onAffirmationSelect?: (affirmation: any) => void;
  className?: string;
}

export function PersonalizedAffirmations({
  context,
  userProfile = {},
  sessionData = {},
  onAffirmationSelect,
  className = ''
}: PersonalizedAffirmationsProps) {
  const [affirmations, setAffirmations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAffirmation, setSelectedAffirmation] = useState<any>(null);

  const generateAffirmations = useCallback(async () => {
    setLoading(true);
    try {
      const generated = await generatePersonalizedAffirmations({
        context,
        userProfile,
        sessionData,
        count: 4
      });
      setAffirmations(generated);
    } catch (error) {
      console.error('Failed to generate affirmations:', error);
      setAffirmations([]);
    } finally {
      setLoading(false);
    }
  }, [context, userProfile, sessionData]);

  useEffect(() => {
    if (Object.keys(userProfile).length > 0 || Object.keys(sessionData).length > 0) {
      generateAffirmations();
    }
  }, [generateAffirmations, userProfile, sessionData]);

  const handleAffirmationClick = (affirmation: any) => {
    setSelectedAffirmation(affirmation);
    onAffirmationSelect?.(affirmation);
  };

  if (affirmations.length === 0 && !loading) {
    return null;
  }

  return (
    <div className={`bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-lg ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          ✨ Personalized Affirmations
        </h3>
        <button
          onClick={generateAffirmations}
          disabled={loading}
          className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Refresh'}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {affirmations.map((affirmation, index) => (
            <div
              key={affirmation.id || index}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedAffirmation?.id === affirmation.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => handleAffirmationClick(affirmation)}
            >
              <div className="flex items-start justify-between mb-2">
                <p className="text-gray-800 font-medium italic">
                  &quot;{affirmation.text}&quot;
                </p>
                <div className="flex items-center gap-2 ml-4">
                  <span className={`text-xs px-2 py-1 rounded capitalize ${
                    affirmation.category === 'strength' ? 'bg-orange-100 text-orange-800' :
                    affirmation.category === 'peace' ? 'bg-blue-100 text-blue-800' :
                    affirmation.category === 'growth' ? 'bg-green-100 text-green-800' :
                    affirmation.category === 'gratitude' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {affirmation.category}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">
                    {affirmation.timing}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                💡 {affirmation.personalizedFor}
              </p>
            </div>
          ))}
        </div>
      )}

      {selectedAffirmation && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Selected:</strong> This affirmation will be integrated into your {context} practice.
          </p>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        These affirmations are personalized based on your profile and current session context.
        They&apos;re designed to support your {context} practice at different moments.
      </div>
    </div>
  );
}