"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select';
import type { PracticeSession } from '@/types/dashboard';
import { track } from '@/lib/telemetry';
import { CheckCircle, Play, Edit3, Filter } from 'lucide-react';

interface RecentSessionsProps {
  sessions: PracticeSession[];
}

const MAX_ITEMS = 50;

export const RecentSessions: React.FC<RecentSessionsProps> = ({ sessions }) => {
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date');

  const filteredSessions = sessions.filter((session) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return session.completed !== false;
    if (filter === 'incomplete') return session.completed === false;
    if (filter === 'this-week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(session.completedAt) > weekAgo;
    }
    return session.type === filter;
  }).slice(0, MAX_ITEMS);

  const sortedSessions = [...filteredSessions].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
    }
    if (sortBy === 'duration') {
      return b.duration - a.duration;
    }
    return a.flowName.localeCompare(b.flowName);
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-50';
      case 'intermediate': return 'text-yellow-600 bg-yellow-50';
      case 'advanced': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const generateFlowName = (session: PracticeSession) => {
    // Enhance basic flow names with more descriptive alternatives
    if (session.flowName.match(/^Flow \d+$/)) {
      const flowTypes = ['Morning Energizer', 'Evening Wind Down', 'Core Strength', 'Hip Opener', 'Heart Opener', 'Stress Relief', 'Power Flow', 'Gentle Stretch'];
      const index = parseInt(session.flowName.replace('Flow ', '')) - 1;
      return flowTypes[index % flowTypes.length] || session.flowName;
    }
    return session.flowName;
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Sessions</CardTitle>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="incomplete">Incomplete</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="vinyasa">Vinyasa</SelectItem>
                <SelectItem value="hatha">Hatha</SelectItem>
                <SelectItem value="restorative">Restorative</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sortedSessions.length === 0 ? (
          sessions.length === 0 ? (
            <EmptyState 
              icon="🧘‍♀️"
              title="Start Your Yoga Journey" 
              description="You haven't practiced any flows yet. Ready to begin your yoga adventure?" 
              action={
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={() => window.location.href = '/poses'}>
                    Explore Poses
                  </Button>
                  <Button variant="outline" onClick={() => window.location.href = '/flows/create'}>
                    Create Flow
                  </Button>
                </div>
              }
            />
          ) : (
            <EmptyState 
              icon="🔍"
              title="No sessions found" 
              description="Try adjusting your filters or start a new practice session." 
            />
          )
        ) : (
          <ul className="space-y-3 text-sm" aria-label="Recent sessions">
            {sortedSessions.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-shrink-0">
                    {s.completed !== false ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{generateFlowName(s)}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>{formatDate(s.completedAt)}</span>
                      <span>•</span>
                      <span>{s.duration}m</span>
                      {s.type && (
                        <>
                          <span>•</span>
                          <span className="capitalize">{s.type}</span>
                        </>
                      )}
                      {s.difficulty && (
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getDifficultyColor(s.difficulty)}`}>
                          {s.difficulty}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => track('session_action', { id: s.id, action: 'play' })}
                    className="h-8 w-8 p-0"
                  >
                    <Play className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => track('session_action', { id: s.id, action: 'edit' })}
                    className="h-8 w-8 p-0"
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};
