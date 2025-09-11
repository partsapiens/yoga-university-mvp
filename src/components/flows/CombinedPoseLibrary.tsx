"use client";

import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Library, Filter, ArrowUpDown } from 'lucide-react';
import { PoseId } from '@/types/yoga';
import { POSES } from '@/lib/yoga-data';

interface CombinedPoseLibraryProps {
  onAddPose: (poseId: PoseId) => void;
  className?: string;
}

type SortBy = 'name' | 'intensity' | 'family' | 'plane' | 'chakra';
type SortOrder = 'asc' | 'desc';

export function CombinedPoseLibrary({ onAddPose, className = '' }: CombinedPoseLibraryProps) {
  const [activeTab, setActiveTab] = useState<'suggestions' | 'search'>('suggestions');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [intensityFilter, setIntensityFilter] = useState<number | null>(null);
  const [groupFilter, setGroupFilter] = useState<string>('');
  const [planeFilter, setPlaneFilter] = useState<string>('');
  const [chakraFilter, setChakraFilter] = useState<string>('');
  
  // Sort states
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Get unique values for filters
  const uniqueGroups = useMemo(() => {
    const groups = new Set<string>();
    POSES.forEach(pose => pose.groups.forEach(group => groups.add(group)));
    return Array.from(groups).sort();
  }, []);

  const uniquePlanes = useMemo(() => {
    const planes = new Set(POSES.map(pose => pose.plane));
    return Array.from(planes).sort();
  }, []);

  const uniqueChakras = useMemo(() => {
    const chakras = new Set(POSES.map(pose => pose.chakra));
    return Array.from(chakras).sort();
  }, []);

  // Filter and sort poses
  const filteredAndSortedPoses = useMemo(() => {
    let filtered = POSES.filter(pose => {
      // Text search filter
      const matchesSearch = searchTerm === '' || 
        pose.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pose.sanskrit.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pose.family.toLowerCase().includes(searchTerm.toLowerCase());

      // Intensity filter
      const matchesIntensity = intensityFilter === null || pose.intensity === intensityFilter;

      // Group filter
      const matchesGroup = groupFilter === '' || pose.groups.includes(groupFilter);

      // Plane filter
      const matchesPlane = planeFilter === '' || pose.plane === planeFilter;

      // Chakra filter
      const matchesChakra = chakraFilter === '' || pose.chakra === chakraFilter;

      return matchesSearch && matchesIntensity && matchesGroup && matchesPlane && matchesChakra;
    });

    // Sort poses
    filtered.sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      switch (sortBy) {
        case 'intensity':
          aVal = a.intensity;
          bVal = b.intensity;
          break;
        case 'family':
          aVal = a.family;
          bVal = b.family;
          break;
        case 'plane':
          aVal = a.plane;
          bVal = b.plane;
          break;
        case 'chakra':
          aVal = a.chakra;
          bVal = b.chakra;
          break;
        default: // name
          aVal = a.name;
          bVal = b.name;
          break;
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      } else {
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        return sortOrder === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      }
    });

    return filtered;
  }, [searchTerm, intensityFilter, groupFilter, planeFilter, chakraFilter, sortBy, sortOrder]);

  const clearFilters = () => {
    setSearchTerm('');
    setIntensityFilter(null);
    setGroupFilter('');
    setPlaneFilter('');
    setChakraFilter('');
    setSortBy('name');
    setSortOrder('asc');
  };

  return (
    <section className={`bg-card border border-border rounded-lg p-4 ${className}`}>
      {/* Header with Tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'suggestions'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Sparkles size={16} />
            AI Suggestions
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'search'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Library size={16} />
            Search Library
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground">Click to add</div>
          {activeTab === 'search' && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                showFilters ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
              }`}
            >
              <Filter size={12} />
              Filters
            </button>
          )}
        </div>
      </div>

      {/* Search Bar (visible when search tab is active) */}
      {activeTab === 'search' && (
        <div className="space-y-3 mb-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search poses by name, Sanskrit, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Filter Controls */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-3 bg-muted/30 rounded-lg border">
              {/* Intensity Filter */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Intensity</label>
                <select
                  value={intensityFilter || ''}
                  onChange={(e) => setIntensityFilter(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-2 py-1 text-sm border border-border rounded bg-background"
                >
                  <option value="">All Levels</option>
                  <option value="1">1 - Gentle</option>
                  <option value="2">2 - Easy</option>
                  <option value="3">3 - Moderate</option>
                  <option value="4">4 - Challenging</option>
                  <option value="5">5 - Advanced</option>
                </select>
              </div>

              {/* Group Filter */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Body Group</label>
                <select
                  value={groupFilter}
                  onChange={(e) => setGroupFilter(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-border rounded bg-background"
                >
                  <option value="">All Groups</option>
                  {uniqueGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>

              {/* Plane Filter */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Movement Plane</label>
                <select
                  value={planeFilter}
                  onChange={(e) => setPlaneFilter(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-border rounded bg-background"
                >
                  <option value="">All Planes</option>
                  {uniquePlanes.map(plane => (
                    <option key={plane} value={plane}>{plane}</option>
                  ))}
                </select>
              </div>

              {/* Chakra Filter */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Chakra</label>
                <select
                  value={chakraFilter}
                  onChange={(e) => setChakraFilter(e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-border rounded bg-background"
                >
                  <option value="">All Chakras</option>
                  {uniqueChakras.map(chakra => (
                    <option key={chakra} value={chakra}>{chakra}</option>
                  ))}
                </select>
              </div>

              {/* Sort Controls */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Sort By</label>
                <div className="flex gap-1">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="flex-1 px-2 py-1 text-sm border border-border rounded bg-background"
                  >
                    <option value="name">Name</option>
                    <option value="intensity">Intensity</option>
                    <option value="family">Category</option>
                    <option value="plane">Plane</option>
                    <option value="chakra">Chakra</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-2 py-1 border border-border rounded bg-background hover:bg-muted"
                    title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                  >
                    <ArrowUpDown size={12} />
                  </button>
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 border border-border rounded transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content Area */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {activeTab === 'suggestions' ? (
          // AI Suggestions - Show all poses for now (in a real app, this would be AI-generated)
          POSES.slice(0, 10).map((pose) => (
            <button
              key={pose.id}
              onClick={() => onAddPose(pose.id)}
              className="group rounded-2xl border border-border bg-card p-3 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="mb-2 flex h-20 w-full items-center justify-center rounded-xl bg-muted text-3xl">
                {pose.icon}
              </div>
              <div className="font-medium group-hover:underline text-sm leading-tight">{pose.name}</div>
              <div className="text-xs text-muted-foreground truncate mb-1">{pose.sanskrit}</div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Intensity:</span> {'●'.repeat(pose.intensity)}{'○'.repeat(5-pose.intensity)}
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Groups:</span> {pose.groups.join(', ')}
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Plane:</span> {pose.plane}
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Chakra:</span> {pose.chakra}
                </div>
              </div>
            </button>
          ))
        ) : (
          // Search Results - using filtered and sorted poses
          filteredAndSortedPoses.map((pose) => (
            <button
              key={pose.id}
              onClick={() => onAddPose(pose.id)}
              className="group rounded-2xl border border-border bg-card p-3 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="mb-2 flex h-20 w-full items-center justify-center rounded-xl bg-muted text-3xl">
                {pose.icon}
              </div>
              <div className="font-medium group-hover:underline text-sm leading-tight">{pose.name}</div>
              <div className="text-xs text-muted-foreground truncate mb-1">{pose.sanskrit}</div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Intensity:</span> {'●'.repeat(pose.intensity)}{'○'.repeat(5-pose.intensity)}
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Groups:</span> {pose.groups.join(', ')}
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Plane:</span> {pose.plane}
                </div>
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Chakra:</span> {pose.chakra}
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Empty State */}
      {activeTab === 'search' && searchTerm && filteredAndSortedPoses.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No poses found matching your criteria</p>
          <button
            onClick={clearFilters}
            className="text-xs text-primary hover:underline mt-1"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div>
            {activeTab === 'suggestions' 
              ? 'AI-curated poses based on your settings' 
              : `${filteredAndSortedPoses.length} poses available`
            }
          </div>
          {activeTab === 'suggestions' && (
            <div className="flex items-center gap-1">
              <Sparkles size={12} />
              <span>Powered by AI</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}