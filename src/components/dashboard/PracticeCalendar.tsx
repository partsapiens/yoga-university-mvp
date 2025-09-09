import React from 'react';

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-card text-card-foreground rounded-2xl border shadow-sm p-6">
    {children}
  </div>
);

export function PracticeCalendar() {
  // This is a placeholder and would be replaced with a real calendar component
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-4">Practice Calendar</h2>
      <div className="bg-muted rounded-lg p-4 text-center">
        <p className="text-muted-foreground">A beautiful calendar view of your practice history is coming soon!</p>
      </div>
    </Card>
  );
}
