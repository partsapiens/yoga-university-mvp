import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { IntegrationStatus } from '@/types/dashboard';
import { Check, X, Settings, ExternalLink, Wifi, WifiOff } from 'lucide-react';

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

  const connectedApps = integrations.filter(int => int.connected);
  const availableApps = integrations.filter(int => !int.connected);

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Connected Apps
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            {connectedApps.length} of {integrations.length} connected
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Connected Apps - Inline Grid */}
        {connectedApps.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3 text-green-700 dark:text-green-400 flex items-center gap-2">
              <Check className="h-4 w-4" />
              Active Connections
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {connectedApps.map((int) => (
                <div
                  key={int.id}
                  className="flex flex-col items-center p-3 rounded-lg border bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium">{int.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground text-center mb-2">
                    {formatLastSync(int.lastSyncedAt)}
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="h-6 w-6 p-0"
                  >
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Available Apps - Inline Grid */}
        {availableApps.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3 text-muted-foreground flex items-center gap-2">
              <WifiOff className="h-4 w-4" />
              Available Integrations
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableApps.slice(0, 6).map((int) => (
                <div
                  key={int.id}
                  className="flex flex-col items-center p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
                    <span className="text-sm font-medium">{int.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground text-center mb-2 line-clamp-2">
                    {getSetupInstructions(int)}
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-7 px-3 text-xs"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Connect
                  </Button>
                </div>
              ))}
            </div>
            
            {availableApps.length > 6 && (
              <div className="mt-3 text-center">
                <Button variant="ghost" size="sm" className="text-xs">
                  Show {availableApps.length - 6} more apps
                </Button>
              </div>
            )}
          </div>
        )}
        
        {/* Connection Status Summary */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${connectedApps.length > 0 ? 'bg-green-500' : 'bg-muted-foreground'}`} />
            <span className="text-sm">
              {connectedApps.length > 0 
                ? `${connectedApps.length} apps syncing data` 
                : 'No apps connected'
              }
            </span>
          </div>
          <Button variant="ghost" size="sm" className="text-xs">
            Manage All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const getSetupInstructions = (integration: IntegrationStatus) => {
  const instructions: Record<string, string> = {
    'supabase': 'Cloud sync for your data',
    'google-drive': 'Auto-save flows to Drive',
    'google-calendar': 'Schedule practice sessions',
    'apple-health': 'Track wellness metrics',
    'strava': 'Log yoga as activities',
    'notion': 'Export practice notes',
    'instagram': 'Share achievements',
    'twitter': 'Connect with community',
    'youtube': 'Follow guided videos',
  };
  
  return instructions[integration.id] || 'Enhance your practice';
};
