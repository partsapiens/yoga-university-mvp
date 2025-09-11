import React from 'react';
import { PoseId } from '@/types/yoga';
import { Clock, Activity, Target, Users } from 'lucide-react';

interface FlowTemplate {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  focus: string;
  poses: PoseId[];
  tags: string[];
  icon: string;
}

interface FlowTemplatesProps {
  onSelectTemplate: (template: FlowTemplate) => void;
  className?: string;
}

const FLOW_TEMPLATES: FlowTemplate[] = [
  {
    id: 'morning-energizer',
    name: 'Morning Energizer',
    description: 'Start your day with gentle movements to wake up your body',
    duration: 15,
    difficulty: 'Beginner',
    focus: 'Full-Body',
    poses: [PoseId.Child, PoseId.DownDog, PoseId.ForwardFold, PoseId.Warrior1Right, PoseId.DownDog, PoseId.Child],
    tags: ['morning', 'energizing', 'gentle'],
    icon: '🌅'
  },
  {
    id: 'stress-relief',
    name: 'Stress Relief Flow',
    description: 'Calm your mind and release tension with restorative poses',
    duration: 20,
    difficulty: 'Beginner',
    focus: 'Relaxation',
    poses: [PoseId.Child, PoseId.Butterfly, PoseId.Bridge, PoseId.Pigeon, PoseId.Child, PoseId.Butterfly],
    tags: ['relaxing', 'stress-relief', 'restorative'],
    icon: '🧘'
  },
  {
    id: 'core-power',
    name: 'Core Power Session',
    description: 'Build strength and stability with core-focused poses',
    duration: 25,
    difficulty: 'Intermediate',
    focus: 'Core',
    poses: [PoseId.DownDog, PoseId.HighLungeRight, PoseId.Boat, PoseId.TwistLow, PoseId.Boat, PoseId.Child],
    tags: ['strength', 'core', 'challenging'],
    icon: '💪'
  },
  {
    id: 'hip-opener',
    name: 'Hip Opening Flow',
    description: 'Release tight hips and improve flexibility',
    duration: 30,
    difficulty: 'Intermediate',
    focus: 'Hips',
    poses: [PoseId.Child, PoseId.DownDog, PoseId.HighLungeRight, PoseId.Pigeon, PoseId.Butterfly, PoseId.Bridge, PoseId.Child],
    tags: ['flexibility', 'hip-opener', 'therapeutic'],
    icon: '🦋'
  },
  {
    id: 'power-vinyasa',
    name: 'Power Vinyasa',
    description: 'Dynamic flow building heat and strength',
    duration: 45,
    difficulty: 'Advanced',
    focus: 'Full-Body',
    poses: [PoseId.DownDog, PoseId.Warrior1Right, PoseId.HighLungeRight, PoseId.TwistLow, PoseId.Boat, PoseId.Bridge, PoseId.Pigeon, PoseId.Child],
    tags: ['dynamic', 'challenging', 'vinyasa'],
    icon: '🔥'
  },
  {
    id: 'evening-unwind',
    name: 'Evening Unwind',
    description: 'Gentle stretches to prepare for restful sleep',
    duration: 20,
    difficulty: 'Beginner',
    focus: 'Relaxation',
    poses: [PoseId.Child, PoseId.ForwardFold, PoseId.Butterfly, PoseId.Bridge, PoseId.Child, PoseId.Butterfly],
    tags: ['evening', 'gentle', 'bedtime'],
    icon: '🌙'
  }
];

const DIFFICULTY_COLORS = {
  Beginner: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  Intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  Advanced: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
};

export function FlowTemplates({ onSelectTemplate, className = '' }: FlowTemplatesProps) {
  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Target size={20} className="text-muted-foreground" />
        <h3 className="text-lg font-semibold">Flow Templates</h3>
        <div className="text-sm text-muted-foreground ml-auto">
          Choose a starting point
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FLOW_TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className="group p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors text-left"
          >
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
              <div className="text-2xl">{template.icon}</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
                  {template.name}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {template.description}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>{template.duration}min</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity size={12} />
                <span>{template.poses.length} poses</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={12} />
                <span>{template.focus}</span>
              </div>
            </div>

            {/* Difficulty & Tags */}
            <div className="flex items-center justify-between">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${DIFFICULTY_COLORS[template.difficulty]}`}>
                {template.difficulty}
              </span>
              
              <div className="flex flex-wrap gap-1">
                {template.tags.slice(0, 2).map(tag => (
                  <span 
                    key={tag}
                    className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center text-xs text-muted-foreground">
          <div>
            <div className="font-semibold text-foreground">
              {FLOW_TEMPLATES.filter(t => t.difficulty === 'Beginner').length}
            </div>
            <div>Beginner</div>
          </div>
          <div>
            <div className="font-semibold text-foreground">
              {FLOW_TEMPLATES.filter(t => t.difficulty === 'Intermediate').length}
            </div>
            <div>Intermediate</div>
          </div>
          <div>
            <div className="font-semibold text-foreground">
              {FLOW_TEMPLATES.filter(t => t.difficulty === 'Advanced').length}
            </div>
            <div>Advanced</div>
          </div>
        </div>
      </div>
    </div>
  );
}