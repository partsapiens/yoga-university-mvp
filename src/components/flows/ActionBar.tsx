import React from 'react';
import { Button } from '@/components/ui/Button';
import { Save, Share2, Download, Printer, Play, Pause, Square } from 'lucide-react';

interface ActionBarProps {
  isLoggedIn: boolean;
  flowName: string;
  onSave: () => void;
  onShare: () => void;
  onExportPDF: () => void;
  onSaveJSON: () => void;
  playbackState: 'idle' | 'playing' | 'paused';
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  isLoggedIn,
  flowName,
  onSave,
  onShare,
  onExportPDF,
  onSaveJSON,
  playbackState,
  onPlay,
  onPause,
  onStop,
}) => {
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t p-4 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {playbackState === 'idle' && (
            <Button onClick={onPlay} disabled={!isLoggedIn}>
              <Play className="mr-2 h-5 w-5" />
              Play
            </Button>
          )}
          {playbackState === 'playing' && (
            <Button onClick={onPause} variant="outline">
              <Pause className="mr-2 h-5 w-5" />
              Pause
            </Button>
          )}
          {playbackState === 'paused' && (
            <Button onClick={onPlay}>
              <Play className="mr-2 h-5 w-5" />
              Resume
            </Button>
          )}
          {(playbackState === 'playing' || playbackState === 'paused') && (
            <Button onClick={onStop} variant="destructive">
              <Square className="mr-2 h-5 w-5" />
              Stop
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={onSave} disabled={!isLoggedIn || !flowName.trim()}>
            <Save className="mr-2 h-5 w-5" />
            Save
          </Button>
          <Button onClick={onShare} variant="outline" disabled={!isLoggedIn}>
            <Share2 className="mr-2 h-5 w-5" />
            Share
          </Button>
          <Button onClick={onExportPDF} variant="outline" disabled={!isLoggedIn}>
            <Printer className="mr-2 h-5 w-5" />
            PDF
          </Button>
          <Button onClick={onSaveJSON} variant="outline" disabled={!isLoggedIn}>
            <Download className="mr-2 h-5 w-5" />
            JSON
          </Button>
        </div>
      </div>
    </div>
  );
};
