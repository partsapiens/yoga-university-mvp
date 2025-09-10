import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import type { IntegrationStatus } from '@/types/dashboard';
import { Check, X } from 'lucide-react';

interface IntegrationsStatusProps {
  integrations: IntegrationStatus[];
}

export const IntegrationsStatus: React.FC<IntegrationsStatusProps> = ({ integrations }) => (
  <Card className="flex flex-col">
    <CardHeader>
      <CardTitle>Integrations</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="space-y-2 text-sm">
        {integrations.map((int) => (
          <li key={int.id} className="flex items-center justify-between">
            <div>
              <span>{int.name}</span>
              {int.connected && int.lastSyncedAt && (
                <div className="text-xs text-muted-foreground">
                  Last sync: {new Date(int.lastSyncedAt).toLocaleDateString()}
                </div>
              )}
            </div>
            {int.connected ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-red-500" />
            )}
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);
