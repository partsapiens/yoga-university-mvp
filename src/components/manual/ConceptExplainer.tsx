'use client';

import React, { useState } from 'react';
import { Lightbulb, Search, BookOpen, ArrowRight, Loader } from 'lucide-react';

interface ConceptExplanation {
  concept: string;
  explanation: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  relatedConcepts: string[];
  suggestedReading: Array<{
    title: string;
    slug: string;
    group: string;
  }>;
}

interface ConceptExplainerProps {
  className?: string;
}

export default function ConceptExplainer({ className = '' }: ConceptExplainerProps) {
  const [concept, setConcept] = useState('');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [explanation, setExplanation] = useState<ConceptExplanation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const commonConcepts = [
    'Ahimsa', 'Pranayama', 'Asana', 'Dharana', 'Dhyana', 'Samadhi',
    'Chakras', 'Bandhas', 'Yamas', 'Niyamas', 'Vinyasa', 'Ujjayi',
    'Surya Namaskara', 'Sadhana', 'Satsang', 'Guru', 'Mantra', 'Om'
  ];

  const explainConcept = async () => {
    if (!concept.trim()) return;

    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/ai/manual-explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          concept: concept.trim(),
          level,
          context: ''
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get explanation');
      }

      const data = await response.json();
      setExplanation(data);
    } catch (err) {
      console.error('Error getting explanation:', err);
      setError('Failed to get explanation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      explainConcept();
    }
  };

  const selectConcept = (selectedConcept: string) => {
    setConcept(selectedConcept);
  };

  const explainRelatedConcept = (relatedConcept: string) => {
    setConcept(relatedConcept);
    setExplanation(null);
    // Auto-explain after setting
    setTimeout(() => {
      explainConcept();
    }, 100);
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg border ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-4 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Lightbulb className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Concept Explainer</h3>
        </div>
        <p className="text-orange-100 text-sm mt-1">
          Get detailed explanations of yoga concepts and Sanskrit terms
        </p>
      </div>

      {/* Search Input */}
      <div className="p-4 border-b">
        <div className="flex space-x-2 mb-3">
          <input
            type="text"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a yoga concept (e.g., 'ahimsa', 'pranayama', 'chakras')"
            className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={explainConcept}
            disabled={!concept.trim() || isLoading}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </button>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <span className="text-gray-600">Level:</span>
          <div className="flex space-x-2">
            {(['beginner', 'intermediate', 'advanced'] as const).map((levelOption) => (
              <button
                key={levelOption}
                onClick={() => setLevel(levelOption)}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  level === levelOption
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {levelOption.charAt(0).toUpperCase() + levelOption.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Common Concepts */}
        {!explanation && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Popular concepts:</p>
            <div className="flex flex-wrap gap-2">
              {commonConcepts.map((commonConcept) => (
                <button
                  key={commonConcept}
                  onClick={() => selectConcept(commonConcept)}
                  className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full hover:bg-orange-200 transition-colors"
                >
                  {commonConcept}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="p-8 text-center">
          <Loader className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-3" />
          <p className="text-gray-600">Generating explanation...</p>
        </div>
      )}

      {/* Explanation Display */}
      {explanation && !isLoading && (
        <div className="p-4">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs mr-2">
                {explanation.level}
              </span>
              {explanation.concept}
            </h4>
          </div>

          <div className="prose prose-sm max-w-none mb-6">
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {explanation.explanation}
            </div>
          </div>

          {/* Related Concepts */}
          {explanation.relatedConcepts.length > 0 && (
            <div className="mb-4">
              <h5 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                <ArrowRight className="h-4 w-4 mr-1" />
                Related Concepts
              </h5>
              <div className="flex flex-wrap gap-2">
                {explanation.relatedConcepts.map((relatedConcept, index) => (
                  <button
                    key={index}
                    onClick={() => explainRelatedConcept(relatedConcept)}
                    className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    {relatedConcept}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Reading */}
          {explanation.suggestedReading.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                Suggested Reading
              </h5>
              <div className="space-y-2">
                {explanation.suggestedReading.map((reading, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{reading.title}</p>
                      <p className="text-gray-600 text-xs">{reading.group}</p>
                    </div>
                    <a
                      href={`/manual/${reading.slug}`}
                      className="text-orange-600 hover:text-orange-700 text-xs flex items-center"
                    >
                      Read
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Search */}
          <div className="mt-4 pt-4 border-t">
            <button
              onClick={() => {
                setConcept('');
                setExplanation(null);
                setError('');
              }}
              className="text-sm text-orange-600 hover:text-orange-700 flex items-center"
            >
              <Search className="h-4 w-4 mr-1" />
              Explain another concept
            </button>
          </div>
        </div>
      )}

      {/* Initial State */}
      {!explanation && !isLoading && !error && (
        <div className="p-8 text-center text-gray-500">
          <Lightbulb className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm">
            Enter a yoga concept or Sanskrit term above to get a detailed explanation
          </p>
        </div>
      )}
    </div>
  );
}