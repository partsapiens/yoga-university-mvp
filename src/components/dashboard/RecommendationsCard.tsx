import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import type { RecommendationItem } from '@/types/dashboard';
import { track } from '@/lib/telemetry';

interface RecommendationsCardProps {
  items: RecommendationItem[];
}

export const RecommendationsCard: React.FC<RecommendationsCardProps> = ({ items }) => (
  <Card className="flex flex-col">
    <CardHeader>
      <CardTitle>Recommendations</CardTitle>
    </CardHeader>
    <CardContent>
      {items.length === 0 ? (
        <EmptyState title="No recommendations" />
      ) : (
        <ul className="space-y-4 text-sm" aria-label="Recommendations">
          {items.map((item) => (
            <li key={item.id}>
              <div className="font-medium">{item.title}</div>
              <p className="text-muted-foreground">{item.reason}</p>
              {item.actionUrl && (
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={() => track('recommendation_clicked', { id: item.id })}
                  asChild
                >
                  <a href={item.actionUrl}>Open</a>
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </CardContent>
  </Card>
);
