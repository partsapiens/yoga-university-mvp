"use client";

import { useEffect, useState } from 'react';
import { SearchInput } from '@/components/ui/SearchInput';
import { Toggle } from '@/components/ui/Toggle';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { track } from '@/lib/telemetry';
import { Bell, User, Play, TrendingUp, Plus } from 'lucide-react';

interface HeaderBarProps {
  unreadCount: number;
  userName?: string;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ unreadCount, userName = "Yogi" }) => {
  const [query, setQuery] = useState('');
  const [timingMode, setTimingMode] = useLocalStorage<string>('dashboard_timing_mode', 'pose');
  const [ttsEnabled, setTtsEnabled] = useLocalStorage<boolean>('dashboard_tts', false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    track('page_view', { page: 'dashboard' });
  }, []);

  return (
    <div className="sticky top-0 z-10 border-b bg-background">
      <div className="container mx-auto flex items-center justify-between gap-4 py-2">
        <div className="flex items-center gap-4">
          <SearchInput
            placeholder="Search flows, poses, notes..."
            aria-label="Search flows, poses, notes"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery('')}
            className="max-w-xs"
          />
          <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
            Welcome back, <span className="font-medium text-foreground">{userName}</span>!
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Quick Action Buttons */}
          <div className="hidden md:flex items-center gap-1">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => track('quick_action', { action: 'start_session' })}
            >
              <Play className="h-3 w-3 mr-1" />
              Start Session
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => track('quick_action', { action: 'view_progress' })}
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Progress
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => track('quick_action', { action: 'create_flow' })}
            >
              <Plus className="h-3 w-3 mr-1" />
              Create Flow
            </Button>
          </div>
          
          <div className="flex rounded-md border" role="group" aria-label="Timing mode">
            {['pose', 'block', 'breath'].map((mode) => (
              <Button
                key={mode}
                variant={timingMode === mode ? 'default' : 'ghost'}
                size="sm"
                className="px-2"
                onClick={() => {
                  setTimingMode(mode);
                  track('timing_mode_changed', { mode });
                }}
              >
                {mode}
              </Button>
            ))}
          </div>
          <Toggle
            checked={ttsEnabled}
            onCheckedChange={(v) => {
              setTtsEnabled(v);
              track('toggle_tts', { enabled: v });
            }}
            label="TTS"
            aria-label="Toggle text to speech"
          />
          <ThemeToggle />
          <div className="relative">
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 rounded-full bg-red-500 px-1 text-[10px] text-white">
                  {unreadCount}
                </span>
              )}
            </Button>
          </div>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Account menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <User className="h-4 w-4" />
            </Button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 rounded-md border bg-background p-2 text-sm shadow-lg">
                <div className="px-2 py-1 text-xs text-muted-foreground border-b mb-1">
                  {userName}
                </div>
                <button className="w-full text-left px-2 py-1 hover:bg-muted rounded">Profile</button>
                <button className="w-full text-left px-2 py-1 hover:bg-muted rounded">Settings</button>
                <button className="w-full text-left px-2 py-1 hover:bg-muted rounded">Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
