'use client';

import React from 'react';
import { ManualLayout, ManualTOC, ManualSection } from '@/components/manual';

export default function Chapter3Page() {
  const breadcrumbs = [
    { label: '← Manual Index', href: '/manual' },
    { label: 'Chapter 3' }
  ];

  const tocItems = [
    { id: 'integration', title: 'Integration Series' },
    { id: 'sunA', title: 'Sun Salutation A' },
    { id: 'sunB', title: 'Sun Salutation B' }
  ];

  const chapterNavigation = {
    current: 'chapter-3',
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
      title="Chapter 3 — Integration & Sun Salutations" 
      breadcrumbs={breadcrumbs}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <p className="text-gray-400">
            YogaFlow University edition with Sanskrit pose names and alignment / cue bullets.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <ManualTOC 
            items={tocItems} 
            chapterNavigation={chapterNavigation}
          />
          
          <article>
            <ManualSection id="integration" title="Integration Series">
              <ol className="space-y-4 ml-5">
                <li>
                  <strong>Child's Pose — Balasana</strong>
                  <ul className="mt-1 ml-5 mb-2 space-y-1">
                    <li>Knees wide or together; big toes touch.</li>
                    <li>Lengthen spine from sacrum through crown.</li>
                    <li>Soften shoulders and jaw; deepen breath.</li>
                  </ul>
                </li>
                <li>
                  <strong>Downward Facing Dog — Adho Mukha Svanasana</strong>
                  <ul className="mt-1 ml-5 mb-2 space-y-1">
                    <li>Hands shoulder-width; root through thumb/index.</li>
                    <li>Lift hips high; lengthen spine.</li>
                    <li>Micro-bend knees to free low back.</li>
                  </ul>
                </li>
                <li>
                  <strong>Ragdoll — Uttanasana variation</strong>
                  <ul className="mt-1 ml-5 mb-2 space-y-1">
                    <li>Feet hip-width; soft knees.</li>
                    <li>Hinge from hips; hang head heavy.</li>
                    <li>Optional clasp elbows to traction spine.</li>
                  </ul>
                </li>
              </ol>
              <div 
                className="rounded-lg p-4 my-4"
                style={{
                  background: '#141921',
                  borderLeft: '4px solid #6ea8fe',
                  color: '#d8e5ff'
                }}
              >
                Objective: awaken breath and hamstrings; set steady drishti and rhythm.
              </div>
            </ManualSection>

            <ManualSection id="sunA" title="Sun Salutation A — Surya Namaskar A">
              <ol className="space-y-4 ml-5">
                <li>
                  <strong>Mountain — Tadasana</strong>
                  <ul className="mt-1 ml-5 mb-2 space-y-1">
                    <li>Ground through four corners of feet.</li>
                    <li>Lift kneecaps, lengthen tailbone.</li>
                    <li>Draw shoulders back and down; crown to sky.</li>
                  </ul>
                </li>
                <li>
                  <strong>Extended Mountain — Urdhva Hastasana</strong>
                  <ul className="mt-1 ml-5 mb-2 space-y-1">
                    <li>Arms overhead, palms face or touch.</li>
                    <li>Wrap triceps forward; soften ribs.</li>
                  </ul>
                </li>
                <li>
                  <strong>Forward Fold — Uttanasana</strong>
                  <ul className="mt-1 ml-5 mb-2 space-y-1">
                    <li>Hinge at hips, fold deeply.</li>
                    <li>Micro-bend knees; relax neck and jaw.</li>
                  </ul>
                </li>
                <li>
                  <strong>Halfway Lift — Ardha Uttanasana</strong>
                  <ul className="mt-1 ml-5 mb-2 space-y-1">
                    <li>Hands to shins or floor; spine long.</li>
                    <li>Draw navel to spine; extend crown forward.</li>
                  </ul>
                </li>
                <li>
                  <strong>High to Low Plank — Chaturanga Dandasana</strong>
                  <ul className="mt-1 ml-5 mb-2 space-y-1">
                    <li>Shoulders above wrists; core engaged.</li>
                    <li>Lower halfway with elbows hugging ribs.</li>
                  </ul>
                </li>
                <li>
                  <strong>Upward Facing Dog — Urdhva Mukha Svanasana</strong>
                  <ul className="mt-1 ml-5 mb-2 space-y-1">
                    <li>Press palms and tops of feet; thighs lifted.</li>
                    <li>Open chest; shoulders over wrists.</li>
                  </ul>
                </li>
                <li>
                  <strong>Downward Facing Dog — Adho Mukha Svanasana</strong>
                  <ul className="mt-1 ml-5 mb-2 space-y-1">
                    <li>Return to steady breath; hold 3–5 cycles.</li>
                  </ul>
                </li>
              </ol>
            </ManualSection>

            <ManualSection id="sunB" title="Sun Salutation B — Surya Namaskar B">
              <ol className="space-y-4 ml-5">
                <li>
                  <strong>Chair Pose — Utkatasana</strong>
                  <ul className="mt-1 ml-5 mb-2 space-y-1">
                    <li>Feet together or hip-width; sit low.</li>
                    <li>Draw tailbone down, lift chest.</li>
                  </ul>
                </li>
                <li>Flow through <strong>Forward Fold / Halfway Lift / Chaturanga / Up Dog / Down Dog</strong>.</li>
                <li>
                  <strong>Warrior I — Virabhadrasana I (Right)</strong>
                  <ul className="mt-1 ml-5 mb-2 space-y-1">
                    <li>Front knee over ankle; back heel roots down.</li>
                    <li>Square hips forward; reach arms overhead.</li>
                  </ul>
                </li>
                <li>Vinyasa back to Down Dog.</li>
                <li><strong>Warrior I — Virabhadrasana I (Left)</strong> → Vinyasa to Down Dog.</li>
              </ol>
            </ManualSection>
          </article>
        </div>
        
        <footer className="mt-12 pt-6 border-t border-gray-600 text-gray-400">
          <p>© YogaFlow University — Chapter 3 (Integration & Sun Salutations). For internal training use.</p>
        </footer>
      </div>
    </ManualLayout>
  );
}