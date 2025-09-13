'use client';

import React from 'react';
import { ManualLayout, ManualTOC, ManualSection } from '@/components/manual';

export default function Chapter4Page() {
  const breadcrumbs = [
    { label: '← Manual Index', href: '/manual' },
    { label: 'Chapter 4' }
  ];

  const tocItems = [
    { id: 'assists', title: 'Hands-on Assists' },
    { id: 'props', title: 'Props & Modifications' },
    { id: 'safety', title: 'Safety & Consent' },
    { id: 'contraindications', title: 'Contraindications' }
  ];

  const chapterNavigation = {
    current: 'chapter-4',
    chapters: [
      { id: 'chapter-1', title: 'Chapter 1', href: '/manual/chapter-1' },
      { id: 'chapter-2', title: 'Chapter 2', href: '/manual/chapter-2' },
      { id: 'chapter-3', title: 'Chapter 3', href: '/manual/chapter-3' },
      { id: 'chapter-4', title: 'Chapter 4', href: '/manual/chapter-4' },
      { id: 'chapter-5', title: 'Chapter 5', href: '/manual/chapter-5' },
      { id: 'chapter-6', title: 'Chapter 6', href: '/manual/chapter-6' },
      { id: 'chapter-7', title: 'Chapter 7', href: '/manual/chapter-7' }
    ]
  };

  return (
    <ManualLayout 
      title="Chapter 4 — Assists, Props & Safety" 
      breadcrumbs={breadcrumbs}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <ManualTOC 
            items={tocItems} 
            chapterNavigation={chapterNavigation}
          />
          
          <article>
            <ManualSection id="assists" title="Hands-on Assists">
              <p className="mb-4 leading-relaxed">
                Physical assists in yoga can be powerful tools for helping students deepen their practice, but they require skill, awareness, and consent to be effective and safe.
              </p>
              <h3 className="text-lg font-medium text-blue-400 mt-6 mb-3">Principles of Safe Assisting</h3>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Always Ask Permission</strong>: Verbal or non-verbal consent systems before any touch.</li>
                <li><strong>Start Light</strong>: Begin with minimal pressure and gradually increase if appropriate.</li>
                <li><strong>Wide Base</strong>: Maintain your own stable foundation when assisting.</li>
                <li><strong>Follow Breath</strong>: Assist on exhalations, avoid forcing during inhalations.</li>
                <li><strong>Less is More</strong>: Small, focused assists are often more effective than dramatic adjustments.</li>
              </ul>
            </ManualSection>

            <ManualSection id="props" title="Props & Modifications">
              <p className="mb-4 leading-relaxed">
                Props are tools that make yoga accessible to every body. They can provide support, create stability, and help students find ease in challenging poses.
              </p>
              <h3 className="text-lg font-medium text-blue-400 mt-6 mb-3">Essential Props</h3>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Blocks</strong>: Bring the floor closer, support forward folds, create stability.</li>
                <li><strong>Straps</strong>: Extend reach, support binding poses, assist stretches.</li>
                <li><strong>Bolsters</strong>: Support restorative poses, provide comfort in seated positions.</li>
                <li><strong>Blankets</strong>: Warmth, weight, support, and comfort.</li>
                <li><strong>Walls</strong>: The most versatile prop available in almost every space.</li>
              </ul>
            </ManualSection>

            <ManualSection id="safety" title="Safety & Consent">
              <p className="mb-4 leading-relaxed">
                Creating a safe container for practice involves both physical and emotional safety. This includes clear communication about touch, respect for boundaries, and trauma-informed teaching approaches.
              </p>
              <h3 className="text-lg font-medium text-blue-400 mt-6 mb-3">Consent Practices</h3>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Explicit Permission</strong>: Always ask before providing hands-on assists.</li>
                <li><strong>Opt-in/Opt-out Systems</strong>: Use cards, hand signals, or verbal cues.</li>
                <li><strong>Check-ins</strong>: Regularly ask "How does this feel?" during assists.</li>
                <li><strong>Respect No</strong>: A "no" to touch is always honored without question or justification needed.</li>
              </ul>
            </ManualSection>

            <ManualSection id="contraindications" title="Contraindications">
              <p className="mb-4 leading-relaxed">
                Understanding when certain poses or practices may not be appropriate is essential for safe teaching. This includes both temporary and permanent contraindications.
              </p>
              <h3 className="text-lg font-medium text-blue-400 mt-6 mb-3">Common Considerations</h3>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Pregnancy</strong>: Avoid deep twists, backbends, and prone positions.</li>
                <li><strong>High Blood Pressure</strong>: Limit inversions and avoid long holds in challenging poses.</li>
                <li><strong>Neck Injuries</strong>: Avoid putting weight on neck, use props for support.</li>
                <li><strong>Recent Surgery</strong>: Follow medical guidelines and avoid relevant movement patterns.</li>
                <li><strong>Acute Injuries</strong>: When in doubt, suggest modifications or alternatives.</li>
              </ul>
              <div 
                className="rounded-lg p-4 my-4"
                style={{
                  background: '#141921',
                  borderLeft: '4px solid #6ea8fe',
                  color: '#d8e5ff'
                }}
              >
                Remember: You are not a medical professional. When in doubt, suggest students consult with their healthcare provider.
              </div>
            </ManualSection>
          </article>
        </div>
        
        <footer className="mt-12 pt-6 border-t border-gray-600 text-gray-400">
          <p>© YogaFlow University — Chapter 4. For internal training use.</p>
        </footer>
      </div>
    </ManualLayout>
  );
}