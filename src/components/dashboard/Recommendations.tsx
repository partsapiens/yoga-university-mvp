import React from 'react';

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-card text-card-foreground rounded-2xl border shadow-sm p-6">
    {children}
  </div>
);

// Placeholder data
const recommendations = [
  { id: 1, name: 'Deep Stretch for Hamstrings', type: 'Flow' },
  { id: 2, name: 'Introduction to Arm Balances', type: 'Course' },
];

export function Recommendations() {
  return (
    <Card>
      <h2 className="text-2xl font-bold mb-4">Personalized Recommendations</h2>
      {recommendations.length > 0 ? (
        <ul className="space-y-3">
          {recommendations.map(rec => (
            <li key={rec.id} className="p-3 bg-muted rounded-lg">
              <p className="font-semibold">{rec.name}</p>
              <p className="text-sm text-primary">{rec.type}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">No recommendations yet.</p>
      )}
    </Card>
  );
}
