"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Filter, ChevronDown, Heart, Plus } from 'lucide-react';
import { supabase } from '@/utils/supabaseClient';
import { PoseId } from '@/types/yoga';

interface Pose {
  id: string;
  name: string;
  sanskrit_name: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  energy_level: 'low' | 'medium' | 'high';
  benefits: string[];
  anatomy_focus: string[];
  image_url?: string;
  description: string;
}

interface PoseLibrarySidebarProps {
  onAddPose: (poseId: PoseId) => void;
  className?: string;
}

interface Filters {
  category: string[];
  difficulty: string[];
  energy_level: string[];
  anatomy_focus: string[];
}

const CATEGORIES = [
  'standing', 'seated', 'supine', 'prone', 'backbend',
  'forward_fold', 'twist', 'inversion', 'arm_balance',
  'hip_opener', 'core', 'balance', 'restorative', 'meditation'
];

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];
const ENERGY_LEVELS = ['low', 'medium', 'high'];
const ANATOMY_FOCUS_OPTIONS = [
  'hips', 'hamstrings', 'shoulders', 'core', 'spine', 'legs', 'arms', 'back', 'chest'
];

export function PoseLibrarySidebar({ onAddPose, className = '' }: PoseLibrarySidebarProps) {
  const [poses, setPoses] = useState<Pose[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filters>({
    category: [],
    difficulty: [],
    energy_level: [],
    anatomy_focus: []
  });
  const [sortBy, setSortBy] = useState<'alphabetical' | 'difficulty' | 'energy'>('alphabetical');
  const [showFilters, setShowFilters] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const observerRef = useRef<IntersectionObserver>();
  const lastPoseElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore]);

  // Load favorites from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedFavorites = JSON.parse(localStorage.getItem('yogaFavorites') || '[]');
      setFavorites(storedFavorites);
    }
  }, []);

  const toggleFavorite = (poseId: string) => {
    const newFavorites = favorites.includes(poseId)
      ? favorites.filter(id => id !== poseId)
      : [...favorites, poseId];
    
    setFavorites(newFavorites);
    if (typeof window !== 'undefined') {
      localStorage.setItem('yogaFavorites', JSON.stringify(newFavorites));
    }
  };

  // Map database pose to legacy PoseId enum for compatibility
  const mapToLegacyPoseId = (pose: Pose): PoseId => {
    // For now, create a simple mapping based on pose name
    // In a real implementation, you might want to store this mapping in the database
    const name = pose.name.toLowerCase();
    if (name.includes('downward') && name.includes('dog')) return PoseId.DownDog;
    if (name.includes('warrior') && name.includes('i')) return PoseId.Warrior1Right;
    if (name.includes('forward') && name.includes('fold')) return PoseId.ForwardFold;
    if (name.includes('child')) return PoseId.Child;
    if (name.includes('butterfly')) return PoseId.Butterfly;
    if (name.includes('bridge')) return PoseId.Bridge;
    if (name.includes('pigeon')) return PoseId.Pigeon;
    if (name.includes('boat')) return PoseId.Boat;
    if (name.includes('lunge') && name.includes('high')) return PoseId.HighLungeRight;
    if (name.includes('twist') || name.includes('revolved')) return PoseId.TwistLow;
    
    // Default fallback
    return PoseId.DownDog;
  };

  const handleAddPose = (pose: Pose) => {
    const legacyPoseId = mapToLegacyPoseId(pose);
    onAddPose(legacyPoseId);
  };

  const fetchPoses = useCallback(async (reset = false) => {
    setLoading(true);
    
    try {
      let query = supabase
        .from('poses')
        .select('*')
        .eq('is_published', true);

      // Apply search filter
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,sanskrit_name.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`);
      }

      // Apply category filter
      if (filters.category.length > 0) {
        query = query.in('category', filters.category);
      }

      // Apply difficulty filter
      if (filters.difficulty.length > 0) {
        query = query.in('difficulty', filters.difficulty);
      }

      // Apply energy level filter
      if (filters.energy_level.length > 0) {
        query = query.in('energy_level', filters.energy_level);
      }

      // Apply anatomy focus filter
      if (filters.anatomy_focus.length > 0) {
        query = query.overlaps('anatomy_focus', filters.anatomy_focus);
      }

      // Apply sorting
      switch (sortBy) {
        case 'alphabetical':
          query = query.order('name');
          break;
        case 'difficulty':
          query = query.order('difficulty');
          break;
        case 'energy':
          query = query.order('energy_level');
          break;
      }

      // Apply pagination
      const startIndex = reset ? 0 : page * 20;
      query = query.range(startIndex, startIndex + 19);

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching poses:', error);
        return;
      }

      if (reset) {
        setPoses(data || []);
      } else {
        setPoses(prev => [...prev, ...(data || [])]);
      }

      setHasMore((data || []).length === 20);
    } catch (error) {
      console.error('Error in fetchPoses:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filters, sortBy, page]);

  // Reset and fetch when filters change
  useEffect(() => {
    setPage(0);
    setPoses([]);
    fetchPoses(true);
  }, [searchTerm, filters, sortBy]);

  // Fetch more poses when page changes
  useEffect(() => {
    if (page > 0) {
      fetchPoses(false);
    }
  }, [page]);

  const handleFilterChange = (filterType: keyof Filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(v => v !== value)
        : [...prev[filterType], value]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      category: [],
      difficulty: [],
      energy_level: [],
      anatomy_focus: []
    });
    setSearchTerm('');
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).reduce((count, filterArray) => count + filterArray.length, 0);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getEnergyColor = (energy: string) => {
    switch (energy) {
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'medium': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className={`flex flex-col h-full bg-card border-l border-border ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Pose Library</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 px-2 py-1 text-sm bg-muted rounded-md hover:bg-muted/80 transition-colors"
          >
            <Filter size={14} />
            {getActiveFilterCount() > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
                {getActiveFilterCount()}
              </span>
            )}
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search poses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* Sort */}
        <div className="mt-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-3 py-1.5 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="alphabetical">Alphabetical</option>
            <option value="difficulty">By Difficulty</option>
            <option value="energy">By Energy Level</option>
          </select>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-4 border-b border-border bg-muted/20 max-h-48 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-sm">Filters</h3>
            {getActiveFilterCount() > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-primary hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="space-y-3">
            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-medium mb-1 text-muted-foreground">Category</h4>
              <div className="flex flex-wrap gap-1">
                {CATEGORIES.slice(0, 6).map(category => (
                  <button
                    key={category}
                    onClick={() => handleFilterChange('category', category)}
                    className={`px-2 py-1 text-xs rounded-md border transition-colors ${
                      filters.category.includes(category)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border hover:bg-muted'
                    }`}
                  >
                    {category.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <h4 className="text-xs font-medium mb-1 text-muted-foreground">Difficulty</h4>
              <div className="flex gap-1">
                {DIFFICULTIES.map(difficulty => (
                  <button
                    key={difficulty}
                    onClick={() => handleFilterChange('difficulty', difficulty)}
                    className={`px-2 py-1 text-xs rounded-md border transition-colors ${
                      filters.difficulty.includes(difficulty)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border hover:bg-muted'
                    }`}
                  >
                    {difficulty}
                  </button>
                ))}
              </div>
            </div>

            {/* Energy Level Filter */}
            <div>
              <h4 className="text-xs font-medium mb-1 text-muted-foreground">Energy Level</h4>
              <div className="flex gap-1">
                {ENERGY_LEVELS.map(energy => (
                  <button
                    key={energy}
                    onClick={() => handleFilterChange('energy_level', energy)}
                    className={`px-2 py-1 text-xs rounded-md border transition-colors ${
                      filters.energy_level.includes(energy)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border hover:bg-muted'
                    }`}
                  >
                    {energy}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pose List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {poses.map((pose, index) => (
            <div
              key={pose.id}
              ref={index === poses.length - 1 ? lastPoseElementRef : null}
              className="bg-background border border-border rounded-lg p-3 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start gap-3">
                {/* Pose Image/Icon */}
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  {pose.image_url ? (
                    <img
                      src={pose.image_url}
                      alt={pose.name}
                      className="w-full h-full object-cover rounded-lg"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-lg">🧘</span>
                  )}
                </div>

                {/* Pose Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0">
                      <h3 className="font-medium text-sm leading-tight truncate">{pose.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{pose.sanskrit_name}</p>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={() => toggleFavorite(pose.id)}
                        className="p-1 hover:bg-muted rounded-md transition-colors"
                      >
                        <Heart
                          size={14}
                          className={favorites.includes(pose.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}
                        />
                      </button>
                      <button
                        onClick={() => handleAddPose(pose)}
                        className="p-1 hover:bg-primary/10 hover:text-primary rounded-md transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-1 mt-2">
                    <span className={`px-1.5 py-0.5 text-xs rounded-md ${getDifficultyColor(pose.difficulty)}`}>
                      {pose.difficulty}
                    </span>
                    <span className={`px-1.5 py-0.5 text-xs rounded-md ${getEnergyColor(pose.energy_level)}`}>
                      {pose.energy_level}
                    </span>
                    <span className="px-1.5 py-0.5 text-xs rounded-md bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                      {pose.category.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Benefits (if available) */}
                  {pose.benefits && pose.benefits.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {pose.benefits.slice(0, 2).join(', ')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        )}

        {/* No results */}
        {!loading && poses.length === 0 && (searchTerm || getActiveFilterCount() > 0) && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No poses found</p>
            <button
              onClick={clearAllFilters}
              className="text-xs text-primary hover:underline mt-1"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* End of results */}
        {!loading && !hasMore && poses.length > 0 && (
          <div className="text-center py-4 text-xs text-muted-foreground">
            End of results
          </div>
        )}
      </div>
    </div>
  );
}