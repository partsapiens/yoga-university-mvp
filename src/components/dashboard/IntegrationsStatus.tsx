import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import type { IntegrationStatus } from '@/types/dashboard';

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
            <span>{int.name}</span>
            <span className="min-w-[8rem] text-right text-xs text-muted-foreground">
              {int.connected && int.lastSyncedAt
                ? `Last sync: ${new Date(int.lastSyncedAt).toLocaleDateString()}`
                : 'Not connected'}
            </span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);
