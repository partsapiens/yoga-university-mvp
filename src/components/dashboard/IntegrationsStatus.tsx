import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { IntegrationStatus } from '@/types/dashboard';
import { Check, X, Settings, ExternalLink } from 'lucide-react';

interface IntegrationsStatusProps {
  integrations: IntegrationStatus[];
}

export const IntegrationsStatus: React.FC<IntegrationsStatusProps> = ({ integrations }) => {
  const formatLastSync = (lastSyncedAt?: string) => {
    if (!lastSyncedAt) return 'Never synced';
    
    const date = new Date(lastSyncedAt);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getSetupInstructions = (integration: IntegrationStatus) => {
    const instructions: Record<string, string> = {
      'supabase': 'Connect your database for cloud sync',
      'google-drive': 'Save flows to Google Drive automatically',
      'google-calendar': 'Schedule practice sessions in your calendar',
      'apple-health': 'Track wellness metrics and mindfulness minutes',
      'strava': 'Log yoga sessions as activities',
      'notion': 'Export practice notes to your workspace',
      'instagram': 'Share practice highlights and achievements',
      'twitter': 'Connect with the yoga community',
      'youtube': 'Follow guided video sessions',
    };
    
    return instructions[integration.id] || 'Enhance your practice with this integration';
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Connected Apps</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 text-sm">
          {integrations.map((int) => (
            <li key={int.id} className="flex items-start justify-between gap-3 p-3 rounded-lg border bg-card">
              <div className="flex items-start gap-3 flex-1">
                <div className="flex-shrink-0 mt-0.5">
                  {int.connected ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{int.name}</div>
                  {int.connected ? (
                    <div className="text-xs text-muted-foreground mt-1">
                      Last sync: {formatLastSync(int.lastSyncedAt)}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground mt-1">
                      {getSetupInstructions(int)}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0">
                {int.connected ? (
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="h-8 w-8 p-0"
                  >
                    <Settings className="h-3 w-3" />
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-8 px-2 text-xs"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Connect
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
