'use client';

import React from 'react';
import { ManualLayout, ManualTOC, ManualSection } from '@/components/manual';

export default function Chapter2Page() {
  const breadcrumbs = [
    { label: '← Manual Index', href: '/manual' },
    { label: 'Chapter 2' }
  ];

  const tocItems = [
    { id: 'foundations', title: 'Foundations' },
    { id: 'breath', title: 'Breath Awareness' },
    { id: 'alignment', title: 'Basic Alignment' },
    { id: 'practice', title: 'Personal Practice' },
    { id: 'mindfulness', title: 'Mindfulness & Presence' },
    { id: 'safety', title: 'Safety Principles' }
  ];

  const chapterNavigation = {
    current: 'chapter-2',
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
      title="Chapter 2 — Foundations of Yoga Practice" 
      breadcrumbs={breadcrumbs}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <ManualTOC 
            items={tocItems} 
            chapterNavigation={chapterNavigation}
          />
          
          <article>
            <ManualSection id="foundations" title="Foundations">
              <p className="mb-4 leading-relaxed">
                Before diving into specific poses and sequences, it's essential to understand the foundational principles that make yoga practice safe, effective, and transformative. This chapter explores the core elements that every yoga practitioner and teacher must understand.
              </p>
              <p className="leading-relaxed">
                Yoga is more than physical exercise—it's a practice of integration that connects body, breath, and mind. As you develop these foundations, you'll discover how they support not only your personal practice but also your ability to guide others safely and mindfully.
              </p>
            </ManualSection>

            <ManualSection id="breath" title="Breath Awareness">
              <h3 className="text-lg font-medium text-blue-400 mt-6 mb-3">The Foundation of Practice</h3>
              <p className="mb-4 leading-relaxed">
                Breath is the cornerstone of yoga practice. Every movement, every pose, and every transition is an opportunity to deepen your relationship with the breath.
              </p>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Natural Breath</strong>: Begin by observing your natural breathing pattern without trying to change it.</li>
                <li><strong>Ujjayi Breath</strong>: Learn the gentle constriction that creates the characteristic sound of yoga breathing.</li>
                <li><strong>Breath and Movement</strong>: Understand how to synchronize breath with movement for flowing practice.</li>
                <li><strong>Breath as Anchor</strong>: Use breath awareness to maintain presence and focus during challenging poses.</li>
              </ul>
              <div 
                className="rounded-lg p-4 my-4"
                style={{
                  background: '#141921',
                  borderLeft: '4px solid #6ea8fe',
                  color: '#d8e5ff'
                }}
              >
                Remember: If you lose your breath, you've lost your yoga. The breath should always remain steady and accessible.
              </div>
            </ManualSection>

            <ManualSection id="alignment" title="Basic Alignment Principles">
              <h3 className="text-lg font-medium text-blue-400 mt-6 mb-3">Creating Safe and Stable Foundation</h3>
              <p className="mb-4 leading-relaxed">
                Proper alignment creates the foundation for safe practice and helps prevent injury while maximizing the benefits of each pose.
              </p>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Foundation First</strong>: Establish a strong base in every pose, whether through feet, hands, or sitting bones.</li>
                <li><strong>Spine Awareness</strong>: Maintain the natural curves of the spine while creating length and space.</li>
                <li><strong>Joint Stacking</strong>: Align joints appropriately to distribute weight evenly and avoid strain.</li>
                <li><strong>Muscular Engagement</strong>: Use appropriate muscle activation to support poses without unnecessary tension.</li>
              </ul>
              <h3 className="text-lg font-medium text-blue-400 mt-6 mb-3">Universal Alignment Principles</h3>
              <ol className="space-y-2 mb-4 ml-5 list-decimal">
                <li>Ground through your foundation</li>
                <li>Engage your core</li>
                <li>Lengthen your spine</li>
                <li>Soften where you don't need effort</li>
                <li>Breathe consciously</li>
              </ol>
            </ManualSection>

            <ManualSection id="practice" title="Developing Personal Practice">
              <h3 className="text-lg font-medium text-blue-400 mt-6 mb-3">Consistency Over Intensity</h3>
              <p className="mb-4 leading-relaxed">
                A regular personal practice is essential for both students and teachers. It's through your own practice that you truly understand yoga from the inside out.
              </p>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Start Small</strong>: Begin with 10-15 minutes daily rather than longer, inconsistent sessions.</li>
                <li><strong>Listen to Your Body</strong>: Adapt your practice to how you feel each day.</li>
                <li><strong>Include All Elements</strong>: Balance asana, pranayama, and meditation in your practice.</li>
                <li><strong>Practice Teaching</strong>: Regularly practice teaching yourself—out loud.</li>
              </ul>
            </ManualSection>

            <ManualSection id="mindfulness" title="Mindfulness & Presence">
              <p className="mb-4 leading-relaxed">
                Mindfulness is the quality of attention that allows us to be fully present with whatever is arising in the moment. In yoga practice, mindfulness helps us stay connected to our body's signals, our breath, and our internal experience.
              </p>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Present Moment Awareness</strong>: Cultivate the ability to notice when your mind wanders and gently return to the present.</li>
                <li><strong>Non-Judgmental Observation</strong>: Practice observing your experience without immediately labeling it as good or bad.</li>
                <li><strong>Body Awareness</strong>: Develop sensitivity to physical sensations, tensions, and ease.</li>
                <li><strong>Emotional Intelligence</strong>: Learn to recognize and work skillfully with emotions that arise during practice.</li>
              </ul>
            </ManualSection>

            <ManualSection id="safety" title="Safety Principles">
              <p className="mb-4 leading-relaxed">
                Safety in yoga practice is not just about avoiding injury—it's about creating an environment where students can explore their edge while staying connected to their wisdom and intuition.
              </p>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>No Pain, No Pain</strong>: Distinguish between sensation and pain; pain is always a signal to back off.</li>
                <li><strong>Individual Anatomy</strong>: Understand that every body is different and poses will look different on everyone.</li>
                <li><strong>Contraindications</strong>: Learn basic contraindications for common conditions and injuries.</li>
                <li><strong>Options and Modifications</strong>: Always provide alternatives and encourage students to take what serves them.</li>
                <li><strong>Creating Safe Space</strong>: Foster an environment of non-competition and self-acceptance.</li>
              </ul>
            </ManualSection>
          </article>
        </div>
        
        <footer className="mt-12 pt-6 border-t border-gray-600 text-gray-400">
          <p>© YogaFlow University — Chapter 2. For internal training use.</p>
        </footer>
      </div>
    </ManualLayout>
  );
}