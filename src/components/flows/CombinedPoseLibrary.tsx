"use client";

import React, { useState } from 'react';
import { Search, Sparkles, Library } from 'lucide-react';
import { PoseId } from '@/types/yoga';
import { POSES } from '@/lib/yoga-data';

interface CombinedPoseLibraryProps {
  onAddPose: (poseId: PoseId) => void;
  className?: string;
}

export function CombinedPoseLibrary({ onAddPose, className = '' }: CombinedPoseLibraryProps) {
  const [activeTab, setActiveTab] = useState<'suggestions' | 'search'>('suggestions');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter poses based on search term
  const filteredPoses = POSES.filter(pose =>
    searchTerm === '' || 
    pose.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pose.sanskrit.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pose.family.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="text-xs text-muted-foreground">Click to add</div>
      </div>

      {/* Search Bar (visible when search tab is active) */}
      {activeTab === 'search' && (
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search poses by name, Sanskrit, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-border rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
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
              <div className="text-xs text-muted-foreground truncate">{pose.sanskrit}</div>
            </button>
          ))
        ) : (
          // Search Results
          filteredPoses.map((pose) => (
            <button
              key={pose.id}
              onClick={() => onAddPose(pose.id)}
              className="group rounded-2xl border border-border bg-card p-3 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="mb-2 flex h-20 w-full items-center justify-center rounded-xl bg-muted text-3xl">
                {pose.icon}
              </div>
              <div className="font-medium group-hover:underline text-sm leading-tight">{pose.name}</div>
              <div className="text-xs text-muted-foreground truncate">{pose.sanskrit}</div>
            </button>
          ))
        )}
      </div>

      {/* Empty State */}
      {activeTab === 'search' && searchTerm && filteredPoses.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No poses found for "{searchTerm}"</p>
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs text-primary hover:underline mt-1"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div>
            {activeTab === 'suggestions' 
              ? 'AI-curated poses based on your settings' 
              : `${filteredPoses.length} poses available`
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