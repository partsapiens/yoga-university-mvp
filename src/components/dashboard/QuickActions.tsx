import React from 'react';
import { AIFlowGenerator } from '@/components/flows/AIFlowGenerator';

// A simple card component for consistent styling
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-card text-card-foreground rounded-2xl border shadow-sm p-6">
    {children}
  </div>
);

export function QuickActions() {
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
      <p className="text-muted-foreground mb-4">
        Start a new practice or generate a custom flow with AI.
      </p>
      {/* Assuming AIFlowGenerator is the component for this */}
      <AIFlowGenerator />
    </Card>
  );
}
