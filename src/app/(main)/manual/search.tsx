'use client';

import { useEffect, useState } from 'react';
import Fuse from 'fuse.js';
import Link from 'next/link';
import { Search, BookOpen, Clock, Tag, X, Sparkles, Brain } from 'lucide-react';
import SemanticSearch from '@/components/SemanticSearch';

interface Item {
  slug: string;
  title: string;
  summary: string;
  content: string;
  group: string;
}

export default function ManualSearch() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<Item[]>([]);
  const [results, setResults] = useState<Item[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [useSemanticSearch, setUseSemanticSearch] = useState(false);
  const [semanticResults, setSemanticResults] = useState<Item[]>([]);

  useEffect(() => {
    fetch('/manual/search-index.json')
      .then((r) => r.json())
      .then((d) => setData(d as Item[]));
  }, []);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    
    // If using semantic search and we have results, use those
    if (useSemanticSearch && semanticResults.length > 0) {
      let filtered = semanticResults;
      
      // Filter by group if selected
      if (selectedGroup !== 'all') {
        filtered = filtered.filter(item => item.group === selectedGroup);
      }
      
      setResults(filtered.slice(0, 8));
      setIsOpen(true);
      return;
    }
    
    // Traditional fuzzy search
    const fuse = new Fuse(data, { 
      keys: ['title', 'content', 'summary'],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true
    });
    
    let searchResults = fuse.search(query).map((r) => r.item);
    
    // Filter by group if selected
    if (selectedGroup !== 'all') {
      searchResults = searchResults.filter(item => item.group === selectedGroup);
    }
    
    setResults(searchResults.slice(0, 8));
    setIsOpen(true);
  }, [query, data, selectedGroup, useSemanticSearch, semanticResults]);

  // Handle semantic search results
  const handleSemanticResults = (results: any[]) => {
    const transformedResults = results.map((result: any) => ({
      slug: result.slug,
      title: result.title,
      summary: result.summary || '',
      content: result.content || '',
      group: result.group || 'General'
    }));
    setSemanticResults(transformedResults);
    setUseSemanticSearch(true);
  };

  // Handle search mode change
  const handleSearchModeChange = (semantic: boolean) => {
    setUseSemanticSearch(semantic);
    if (!semantic) {
      setSemanticResults([]);
    }
  };

  // Get unique groups for filter
  const groups = ['all', ...Array.from(new Set(data.map(item => item.group)))];

  // Calculate reading time
  const getReadingTime = (content: string) => {
    return Math.ceil(content.split(' ').length / 200);
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setUseSemanticSearch(false);
    setSemanticResults([]);
  };

  return (
    <div className="relative mb-8">
      {/* Search Mode Toggle */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => handleSearchModeChange(false)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !useSemanticSearch
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <Search className="w-4 h-4" />
          Traditional Search
        </button>
        <button
          onClick={() => handleSearchModeChange(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            useSemanticSearch
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <Brain className="w-4 h-4" />
          AI Search
        </button>
      </div>

      {/* Search Input */}
      {useSemanticSearch ? (
        <SemanticSearch
          endpoint="/api/search/manual"
          placeholder="Ask about yoga concepts, techniques, or topics... (e.g., 'how to improve my breathing during practice')"
          onResults={handleSemanticResults}
          filters={{ groups: selectedGroup !== 'all' ? [selectedGroup] : [] }}
          className="w-full"
          showTypeIndicator={true}
        />
      ) : (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            type="search"
            placeholder="Search manual content, chapters, or concepts..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setUseSemanticSearch(false);
              setSemanticResults([]);
            }}
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      )}

      {/* Group Filter */}
      {query && (
        <div className="mt-3 flex flex-wrap gap-2">
          {groups.map(group => (
            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedGroup === group
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {group === 'all' ? 'All Topics' : group}
            </button>
          ))}
        </div>
      )}

      {/* Search Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            <div className="text-sm text-gray-500 dark:text-gray-400 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </div>
            {results.map((result) => (
              <Link
                key={result.slug}
                href={`/manual/${result.slug}`}
                onClick={() => setIsOpen(false)}
                className="block p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white truncate">
                      {result.title}
                    </h4>
                    <div className="flex items-center space-x-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <Tag className="w-3 h-3 mr-1" />
                        {result.group}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        ~{getReadingTime(result.content)} min
                      </span>
                    </div>
                    {result.summary && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {result.summary.slice(0, 120)}...
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && query && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No results found for &quot;{query}&quot;</p>
            <p className="text-sm mt-1">Try different keywords or browse by chapter</p>
          </div>
        </div>
      )}
    </div>
  );
}

