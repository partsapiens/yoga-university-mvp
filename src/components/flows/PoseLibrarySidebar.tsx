"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Filter, ChevronDown, Heart, Plus } from 'lucide-react';
import { supabase } from '@/utils/supabaseClient';
import { PoseId } from '@/types/yoga';
import { POSES } from '@/lib/yoga-data';

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
  const lastPoseElementRef = useCallback((node: HTMLButtonElement | null) => {
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

  // Map existing POSES data to database format as fallback
  const mapLegacyPoses = () => {
    return POSES.map(pose => ({
      id: pose.id,
      name: pose.name,
      sanskrit_name: pose.sanskrit,
      category: pose.family.toLowerCase().replace(' ', '_'),
      difficulty: pose.intensity <= 2 ? 'beginner' as const : pose.intensity <= 4 ? 'intermediate' as const : 'advanced' as const,
      energy_level: pose.intensity <= 2 ? 'low' as const : pose.intensity <= 4 ? 'medium' as const : 'high' as const,
      benefits: [],
      anatomy_focus: pose.groups || [],
      description: `Practice ${pose.name} with awareness.`
    }));
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

      if (error && error.code !== 'PGRST116') { // PGRST116 is "table not found" error
        console.error('Error fetching poses:', error);
        // Fall back to legacy poses
        const legacyPoses = mapLegacyPoses();
        if (reset) {
          setPoses(legacyPoses);
        } else {
          setPoses(prev => [...prev, ...legacyPoses]);
        }
        setHasMore(false);
        setLoading(false);
        return;
      }

      // If no data from database, use legacy poses as fallback
      if (!data || data.length === 0) {
        const legacyPoses = mapLegacyPoses();
        
        // Apply filters to legacy poses
        let filteredPoses = legacyPoses;
        
        if (searchTerm) {
          filteredPoses = filteredPoses.filter(pose => 
            pose.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pose.sanskrit_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pose.category.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        if (filters.category.length > 0) {
          filteredPoses = filteredPoses.filter(pose => 
            filters.category.includes(pose.category)
          );
        }
        
        if (filters.difficulty.length > 0) {
          filteredPoses = filteredPoses.filter(pose => 
            filters.difficulty.includes(pose.difficulty)
          );
        }
        
        if (filters.energy_level.length > 0) {
          filteredPoses = filteredPoses.filter(pose => 
            filters.energy_level.includes(pose.energy_level)
          );
        }
        
        // Apply sorting
        switch (sortBy) {
          case 'alphabetical':
            filteredPoses.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'difficulty':
            const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
            filteredPoses.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
            break;
          case 'energy':
            const energyOrder = { low: 1, medium: 2, high: 3 };
            filteredPoses.sort((a, b) => energyOrder[a.energy_level] - energyOrder[b.energy_level]);
            break;
        }
        
        if (reset) {
          setPoses(filteredPoses);
        }
        setHasMore(false);
        setLoading(false);
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
      // Fall back to legacy poses on any error
      const legacyPoses = mapLegacyPoses();
      if (reset) {
        setPoses(legacyPoses);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filters, sortBy, page]);

  // Debug effect
  useEffect(() => {
    console.log('PoseLibrarySidebar: poses loaded:', poses.length);
    if (poses.length > 0) {
      console.log('First pose:', poses[0]);
    }
  }, [poses]);

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
    <section className="p-4">
      {/* Header with controls */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium">Pose Library</h2>
          <div className="flex items-center gap-2">
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
            <div className="text-xs text-muted-foreground">Click to add</div>
          </div>
        </div>

        {/* Search and Sort Row */}
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search poses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="alphabetical">A-Z</option>
            <option value="difficulty">Difficulty</option>
            <option value="energy">Energy</option>
          </select>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="p-3 border border-border bg-muted/20 rounded-lg mb-3">
            <div className="flex items-center justify-between mb-2">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {/* Category Filter */}
              <div>
                <h4 className="font-medium mb-1 text-muted-foreground">Category</h4>
                <div className="flex flex-wrap gap-1">
                  {CATEGORIES.slice(0, 4).map(category => (
                    <button
                      key={category}
                      onClick={() => handleFilterChange('category', category)}
                      className={`px-2 py-1 rounded border transition-colors ${
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
                <h4 className="font-medium mb-1 text-muted-foreground">Difficulty</h4>
                <div className="flex gap-1">
                  {DIFFICULTIES.map(difficulty => (
                    <button
                      key={difficulty}
                      onClick={() => handleFilterChange('difficulty', difficulty)}
                      className={`px-2 py-1 rounded border transition-colors ${
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
                <h4 className="font-medium mb-1 text-muted-foreground">Energy</h4>
                <div className="flex gap-1">
                  {ENERGY_LEVELS.map(energy => (
                    <button
                      key={energy}
                      onClick={() => handleFilterChange('energy_level', energy)}
                      className={`px-2 py-1 rounded border transition-colors ${
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
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {poses.map((pose, index) => (
          <button
            key={pose.id}
            ref={index === poses.length - 1 ? lastPoseElementRef : null}
            onClick={() => handleAddPose(pose)}
            className="group rounded-2xl border border-border bg-card p-3 text-left shadow-sm transition hover:shadow-md relative"
          >
            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(pose.id);
              }}
              className="absolute top-2 right-2 p-1 hover:bg-muted rounded-md transition-colors z-10"
            >
              <Heart
                size={12}
                className={favorites.includes(pose.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}
              />
            </button>

            {/* Icon */}
            <div className="mb-2 flex h-20 w-full items-center justify-center rounded-xl bg-muted text-3xl">
              {pose.image_url ? (
                <img
                  src={pose.image_url}
                  alt={pose.name}
                  className="w-full h-full object-cover rounded-xl"
                  loading="lazy"
                />
              ) : (
                <span>🧘</span>
              )}
            </div>

            {/* Content */}
            <div className="font-medium group-hover:underline text-sm leading-tight mb-1">{pose.name}</div>
            <div className="text-xs text-muted-foreground truncate mb-2">{pose.sanskrit_name}</div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              <span className={`px-1 py-0.5 text-xs rounded ${getDifficultyColor(pose.difficulty)}`}>
                {pose.difficulty[0].toUpperCase()}
              </span>
              <span className={`px-1 py-0.5 text-xs rounded ${getEnergyColor(pose.energy_level)}`}>
                {pose.energy_level[0].toUpperCase()}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center py-6">
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
          End of results ({poses.length} poses)
        </div>
      )}
    </section>
  );
}