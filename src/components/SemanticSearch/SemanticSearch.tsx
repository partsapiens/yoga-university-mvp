'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, X, Loader2, Brain, Zap } from 'lucide-react';

interface SemanticSearchProps {
  endpoint: string;
  placeholder?: string;
  onResults?: (results: any[]) => void;
  filters?: Record<string, any>;
  className?: string;
  showTypeIndicator?: boolean;
}

interface SearchResult {
  searchScore: number;
  searchSource: 'semantic' | 'fuzzy' | 'hybrid';
  relevance?: 'high' | 'medium' | 'low';
}

export default function SemanticSearch({
  endpoint,
  placeholder = "Ask about anything...",
  onResults,
  filters = {},
  className = "",
  showTypeIndicator = true
}: SemanticSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchInfo, setSearchInfo] = useState<{
    semanticCount: number;
    fuzzyCount: number;
    hybridCount: number;
  } | null>(null);
  
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      setSearchInfo(null);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, filters]);

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          filters,
          limit: 10
        })
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.message || 'Search failed');
      }

      setResults(data.results || []);
      setIsOpen(true);
      
      // Calculate search type statistics
      if (data.results) {
        const semantic = data.results.filter((r: SearchResult) => r.searchSource === 'semantic').length;
        const fuzzy = data.results.filter((r: SearchResult) => r.searchSource === 'fuzzy').length;
        const hybrid = data.results.filter((r: SearchResult) => r.searchSource === 'hybrid').length;
        
        setSearchInfo({ semanticCount: semantic, fuzzyCount: fuzzy, hybridCount: hybrid });
      }

      if (onResults) {
        onResults(data.results || []);
      }

    } catch (error) {
      console.error('Search error:', error);
      setError(error instanceof Error ? error.message : 'Search failed');
      setResults([]);
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setError(null);
    setSearchInfo(null);
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'semantic':
        return <Brain className="w-3 h-3" />;
      case 'hybrid':
        return <Sparkles className="w-3 h-3" />;
      case 'fuzzy':
        return <Zap className="w-3 h-3" />;
      default:
        return <Search className="w-3 h-3" />;
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'semantic':
        return '🤖 Understanding';
      case 'hybrid':
        return 'Smart Match';
      case 'fuzzy':
        return 'Text Search';
      default:
        return 'Search';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'semantic':
        return 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20';
      case 'hybrid':
        return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20';
      case 'fuzzy':
        return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
        
        <input
          className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all"
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
        />
        
        {/* 🤖 Indicator */}
        {!isLoading && (
          <div className="absolute inset-y-0 right-12 flex items-center pointer-events-none">
            <Sparkles className="h-4 w-4 text-purple-400" />
          </div>
        )}
        
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search Statistics */}
      {showTypeIndicator && searchInfo && isOpen && !error && (
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {searchInfo.semanticCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">
              <Brain className="w-3 h-3" />
              {searchInfo.semanticCount} 🤖 matches
            </span>
          )}
          {searchInfo.hybridCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
              <Sparkles className="w-3 h-3" />
              {searchInfo.hybridCount} smart matches
            </span>
          )}
          {searchInfo.fuzzyCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
              <Zap className="w-3 h-3" />
              {searchInfo.fuzzyCount} text matches
            </span>
          )}
        </div>
      )}

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {error ? (
            <div className="p-4 text-center text-red-600 dark:text-red-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Search failed: {error}</p>
              <button
                onClick={() => performSearch(query)}
                className="mt-2 px-3 py-1 text-sm bg-red-100 dark:bg-red-900/20 rounded hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                aria-label="Try search again"
              >
                Try Again
              </button>
            </div>
          ) : results.length === 0 && query ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No results found for &quot;{query}&quot;</p>
              <p className="text-sm mt-1">Try different keywords or check your spelling</p>
            </div>
          ) : (
            <div className="p-2">
              {results.length > 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-400 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                  {results.length} result{results.length !== 1 ? 's' : ''} found
                </div>
              )}
              
              {results.map((result, index) => (
                <div
                  key={result.id || result.slug || index}
                  className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors cursor-pointer"
                  onClick={() => {
                    // Handle result click
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white truncate">
                        {result.displayName || result.name || result.title}
                      </h4>
                      
                      {showTypeIndicator && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${getSourceColor(result.searchSource)}`}>
                            {getSourceIcon(result.searchSource)}
                            {getSourceLabel(result.searchSource)}
                          </span>
                          
                          {result.searchScore && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {Math.round(result.searchScore * 100)}% match
                            </span>
                          )}
                        </div>
                      )}
                      
                      {(result.summary || result.displaySanskrit) && (
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {result.summary || result.displaySanskrit}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}