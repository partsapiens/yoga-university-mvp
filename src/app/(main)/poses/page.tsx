"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { getPosesFromDatabase } from '@/lib/database';
import { DatabasePose } from '@/types';
import SearchBar from '@/components/PoseLibrary/SearchBar';
import SemanticSearch from '@/components/SemanticSearch';
import Filters from '@/components/PoseLibrary/Filters';
import AdvancedFilters from '@/components/PoseLibrary/AdvancedFilters';
import PoseCard from '@/components/PoseLibrary/PoseCard';
import SkeletonLoader from '@/components/PoseLibrary/SkeletonLoader';
import GridNavigation from '@/components/PoseLibrary/GridNavigation';

// Extended pose data structure for comprehensive library
interface ExtendedPose {
  id: string;
  slug: string;
  name_en: string;
  name_sanskrit: string;
  family_id: string;
  intensity: number;
  thumbnail_url?: string;
  icon_url?: string;
  benefits?: string[];
  bodyFocus?: string[];
  propsRequired?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  planeOfMotion?: string[];
}

// Transform database poses to extended format
const transformDatabasePose = (dbPose: DatabasePose): ExtendedPose => {
  // Map intensity (1-5 scale to 1-10 scale)
  const intensity = dbPose.intensity ? Math.min(Math.max(dbPose.intensity, 1), 5) : 3;
  
  // Map level to difficulty
  const difficulty = dbPose.level === 'beginner' ? 'beginner' : 
                    dbPose.level === 'advanced' ? 'advanced' : 'intermediate';
  
  return {
    id: dbPose.id,
    slug: dbPose.slug || dbPose.name.toLowerCase().replace(/\s+/g, '-'),
    name_en: dbPose.name,
    name_sanskrit: dbPose.sanskrit || '',
    family_id: dbPose.category || dbPose.family || 'standing',
    intensity: intensity,
    thumbnail_url: dbPose.thumbnail_url || dbPose.image_url || `/images/poses/default.jpg`,
    icon_url: dbPose.icon || '🧘', // Default icon
    benefits: dbPose.benefits || [],
    bodyFocus: dbPose.anatomical_focus || [],
    propsRequired: ['None'], // Default for now
    difficulty: difficulty,
    planeOfMotion: dbPose.plane ? [dbPose.plane] : ['Sagittal'] // Default for now
  };
};

const PoseLibraryPage = () => {
  const [poses, setPoses] = useState<ExtendedPose[]>([]);
  const [filteredPoses, setFilteredPoses] = useState<ExtendedPose[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [useSemanticSearch, setUseSemanticSearch] = useState(false);
  const [semanticResults, setSemanticResults] = useState<ExtendedPose[]>([]);
  const [filters, setFilters] = useState<{
    family?: string[];
    intensity?: string[];
    difficulty?: string[];
    bodyFocus?: string[];
    propsRequired?: string[];
  }>({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sort, setSort] = useState('alphabetical');
  const [recentPoses, setRecentPoses] = useState<ExtendedPose[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [quickFilters, setQuickFilters] = useState<{[key: string]: boolean}>({});

  // Quick filter definitions
  const quickFilterOptions = [
    { key: 'beginner-friendly', label: 'Beginner-friendly', filter: (p: ExtendedPose) => p.difficulty === 'beginner' },
    { key: 'energizing', label: 'Energizing', filter: (p: ExtendedPose) => p.intensity >= 3 },
    { key: 'relaxing', label: 'Relaxing', filter: (p: ExtendedPose) => p.intensity <= 2 },
    { key: 'core-strength', label: 'Core Strength', filter: (p: ExtendedPose) => p.bodyFocus?.includes('Core') || false }
  ];

  // Load poses from database and user preferences
  useEffect(() => {
    const loadPoses = async () => {
      try {
        setLoading(true);
        console.log('Loading poses from database...');
        
        // Import debug function dynamically to avoid build issues
        const { getPosesFromDatabase, debugDatabaseConnection } = await import('@/lib/database');
        
        // Run debug to help diagnose issues
        await debugDatabaseConnection();
        
        const dbPoses = await getPosesFromDatabase();
        console.log('Database poses received:', dbPoses.length);
        
        if (dbPoses.length === 0) {
          console.warn('No poses loaded from database - check console for debug information');
        }
        
        const transformedPoses = dbPoses.map(transformDatabasePose);
        setPoses(transformedPoses);
        setFilteredPoses(transformedPoses);
        
        // Load user preferences
        if (typeof window !== 'undefined') {
          const recent = JSON.parse(localStorage.getItem('recentPoses') || '[]');
          const favs = JSON.parse(localStorage.getItem('yogaFavorites') || '[]');
          setRecentPoses(recent.slice(0, 5));
          setFavorites(favs);
        }
      } catch (error) {
        console.error('Error loading poses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPoses();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...poses];

    // Use semantic search results if available and enabled
    if (useSemanticSearch && semanticResults.length > 0) {
      filtered = semanticResults;
    } else if (search) {
      // Apply traditional search
      filtered = filtered.filter(pose =>
        pose.name_en.toLowerCase().includes(search.toLowerCase()) ||
        pose.name_sanskrit.toLowerCase().includes(search.toLowerCase()) ||
        pose.family_id.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply quick filters
    Object.entries(quickFilters).forEach(([key, active]) => {
      if (active) {
        const filterOption = quickFilterOptions.find(opt => opt.key === key);
        if (filterOption) {
          filtered = filtered.filter(filterOption.filter);
        }
      }
    });

    // Apply advanced filters
    if (filters.family?.length) {
      filtered = filtered.filter(pose => filters.family!.includes(pose.family_id));
    }
    if (filters.intensity?.length) {
      filtered = filtered.filter(pose => filters.intensity!.includes(pose.intensity.toString()));
    }
    if (filters.difficulty?.length) {
      filtered = filtered.filter(pose => filters.difficulty!.includes(pose.difficulty || ''));
    }
    if (filters.bodyFocus?.length) {
      filtered = filtered.filter(pose => 
        pose.bodyFocus?.some(focus => filters.bodyFocus!.includes(focus))
      );
    }

    // Apply sorting
    switch (sort) {
      case 'alphabetical':
        filtered.sort((a, b) => a.name_en.localeCompare(b.name_en));
        break;
      case 'intensity':
        filtered.sort((a, b) => a.intensity - b.intensity);
        break;
      case 'family':
        filtered.sort((a, b) => a.family_id.localeCompare(b.family_id));
        break;
    }

    setFilteredPoses(filtered);
  }, [poses, search, filters, quickFilters, sort, useSemanticSearch, semanticResults]);

  const handleSemanticResults = (results: any[]) => {
    const transformedResults = results.map(result => ({
      id: result.id,
      slug: result.slug || result.name.toLowerCase().replace(/\s+/g, '-'),
      name_en: result.displayName || result.name,
      name_sanskrit: result.displaySanskrit || result.sanskrit || '',
      family_id: result.displayCategory || result.family || result.category || 'standing',
      intensity: result.intensity || 3,
      thumbnail_url: result.displayImage || result.thumbnail_url || result.image_url || '/images/poses/default.jpg',
      icon_url: result.icon || '🧘',
      benefits: result.displayBenefits || result.benefits || [],
      bodyFocus: result.anatomical_focus || [],
      propsRequired: ['None'],
      difficulty: result.displayDifficulty || result.level || 'beginner',
      planeOfMotion: result.plane ? [result.plane] : ['Sagittal']
    }));
    setSemanticResults(transformedResults);
    setUseSemanticSearch(true);
  };

  const handleSearchModeChange = (semantic: boolean) => {
    setUseSemanticSearch(semantic);
    if (!semantic) {
      setSemanticResults([]);
    }
  };

  const handleQuickFilter = (key: string) => {
    setQuickFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    // Disable semantic search when using quick filters
    setUseSemanticSearch(false);
    setSemanticResults([]);
  };

  const filterOptions = {
    family: Array.from(new Set(poses.map(p => p.family_id))).map(f => ({ label: f, value: f })),
    intensity: ['1', '2', '3', '4', '5'].map(i => ({ label: `Level ${i}`, value: i })),
    difficulty: [
      { label: 'Beginner', value: 'beginner' },
      { label: 'Intermediate', value: 'intermediate' },
      { label: 'Advanced', value: 'advanced' }
    ],
    bodyFocus: Array.from(new Set(poses.flatMap(p => p.bodyFocus || []))).map(bf => ({ label: bf, value: bf })),
    propsRequired: [
      { label: 'None', value: 'None' },
      { label: 'Block', value: 'Block' },
      { label: 'Strap', value: 'Strap' },
      { label: 'Wall', value: 'Wall' }
    ]
  };

  const totalPoses = poses.length;
  const favoriteCount = favorites.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-4 lg:p-6">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          <span>Home</span> &gt; <span className="font-medium text-gray-900 dark:text-white">Pose Library</span>
        </nav>

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            Comprehensive Pose Library
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Master {totalPoses}+ yoga poses with ✨-guided instructions
          </p>

          {/* Search Section */}
          <div className="mb-6">
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
                <Sparkles className="w-4 h-4" />
                AI Search
              </button>
            </div>

            {/* Search Input */}
            {useSemanticSearch ? (
              <SemanticSearch
                endpoint="/api/search/poses"
                placeholder="Ask for poses by benefit, body focus, or feeling... (e.g., 'poses for tight hips and stress relief')"
                onResults={handleSemanticResults}
                filters={filters}
                className="w-full"
                showTypeIndicator={true}
              />
            ) : (
              <SearchBar
                value={search}
                onChange={(value) => {
                  setSearch(value);
                  setUseSemanticSearch(false);
                  setSemanticResults([]);
                }}
                suggestions={poses.map(p => p.name_en)}
              />
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            {quickFilterOptions.map(option => (
              <button
                key={option.key}
                onClick={() => handleQuickFilter(option.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  quickFilters[option.key]
                    ? 'bg-blue-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
          >
            {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="mb-6">
                <AdvancedFilters
                  filters={filters}
                  setFilters={setFilters}
                  options={filterOptions}
                />
              </div>
            )}

            {/* Sort Options */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600 dark:text-gray-300">
                Showing {filteredPoses.length} of {totalPoses} poses
              </p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="alphabetical">Alphabetical</option>
                <option value="intensity">Intensity</option>
                <option value="family">Family</option>
              </select>
            </div>

            {/* Pose Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonLoader key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredPoses.map(pose => (
                  <PoseCard key={pose.id} pose={pose} />
                ))}
              </div>
            )}

            {filteredPoses.length === 0 && !loading && (
              <div className="text-center py-12">
                {poses.length === 0 ? (
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                      No poses found in database
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">
                      This might be due to:
                    </p>
                    <ul className="text-gray-400 dark:text-gray-500 text-sm text-left max-w-md mx-auto space-y-1">
                      <li>• Database connection issues</li>
                      <li>• No published poses in the database</li>
                      <li>• Configuration problems with Supabase</li>
                    </ul>
                    <p className="text-gray-400 dark:text-gray-500 text-xs mt-4">
                      Check the browser console for detailed debug information
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                      No poses found matching your criteria
                    </p>
                    <button
                      onClick={() => {
                        setSearch('');
                        setFilters({});
                        setQuickFilters({});
                      }}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recently Viewed */}
            {recentPoses.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold mb-3 dark:text-white">Recently Viewed</h3>
                <div className="space-y-2">
                  {recentPoses.map(pose => (
                    <div key={pose.id} className="flex items-center space-x-2 text-sm">
                      <span className="text-lg">{pose.icon_url}</span>
                      <span className="text-gray-700 dark:text-gray-300">{pose.name_en}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Statistics */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold mb-3 dark:text-white">Library Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between dark:text-gray-300">
                  <span>Total Poses:</span>
                  <span className="font-medium">{totalPoses}</span>
                </div>
                <div className="flex justify-between dark:text-gray-300">
                  <span>Favorites:</span>
                  <span className="font-medium">{favoriteCount}</span>
                </div>
                <div className="flex justify-between dark:text-gray-300">
                  <span>Showing:</span>
                  <span className="font-medium">{filteredPoses.length}</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">💡 Tips</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Use quick filters for fast browsing</li>
                <li>• Star poses to save as favorites</li>
                <li>• Try voice search on mobile devices</li>
                <li>• Click poses for detailed instructions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Back to top"
      >
        ↑
      </button>
    </div>
  );
};

export default PoseLibraryPage;
