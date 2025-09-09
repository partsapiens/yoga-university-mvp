import React from 'react';

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-card text-card-foreground rounded-2xl border shadow-sm p-6">
    {children}
  </div>
);

// Placeholder data
const goals = [
  { id: 1, text: 'Practice 3 times this week', completed: true },
  { id: 2, text: 'Hold plank for 60 seconds', completed: false },
  { id: 3, text: 'Try a new hip opener flow', completed: false },
];

export function Goals() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Your Goals</h2>
        <button className="text-sm text-primary hover:underline">+ Add Goal</button>
      </div>
      {goals.length > 0 ? (
        <ul className="space-y-3">
          {goals.map(goal => (
            <li key={goal.id} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={goal.completed}
                readOnly
                className="h-5 w-5 rounded text-primary focus:ring-primary"
              />
              <span className={goal.completed ? 'text-muted-foreground line-through' : ''}>
                {goal.text}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">No goals set.</p>
      )}
    </Card>
  );
}
