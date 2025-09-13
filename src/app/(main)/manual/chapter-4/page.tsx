'use client';

import React from 'react';
import { ManualLayout, ManualTOC, ManualSection, FigureCard } from '@/components/manual';
import PoseVideo from '@/components/PoseLibrary/PoseVideo';

export default function Chapter4Page() {
  const breadcrumbs = [
    { label: '← Manual Index', href: '/manual' },
    { label: 'Chapter 4' }
  ];

  const tocItems = [
    { id: 'assists', title: 'The Art of Hands-on Assists' },
    { id: 'props', title: 'Using Props to Empower' },
    { id: 'safety', title: 'Creating a Safe & Brave Space' },
    { id: 'contraindications', title: 'Common Contraindications' }
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
      title="Chapter 4 — The Art of Teaching: Assists, Props & Safety"
      breadcrumbs={breadcrumbs}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <ManualTOC 
            items={tocItems} 
            chapterNavigation={chapterNavigation}
          />
          
          <article>
            <ManualSection id="assists" title="The Art of Hands-on Assists">
              <PoseVideo url="https://youtu.be/wj44gx15U8I" title="The Art of Hands-on Assists" className="mb-8" />
              <p className="mb-4 leading-relaxed text-lg">
                Physical assists are a powerful form of communication, offering guidance, support, and deeper awareness. However, they must be approached with immense skill, respect, and a clear understanding of consent. The goal of an assist is never to "fix" a pose, but to enhance the student's experience and empower their own discovery.
              </p>
              <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-4">The Philosophy of Assisting</h3>
              <ul className="space-y-3 mb-4 ml-5 list-disc">
                <li><strong>Intention is Everything</strong>: Before you touch, be clear on your intention. Is it to ground, to lengthen, to stabilize, or to deepen?</li>
                <li><strong>Assist the Breath</strong>: A good assist supports the student's breath, it doesn't restrict it. Cue them to breathe as you assist.</li>
                <li><strong>From the Ground Up</strong>: Ensure your own base is stable and grounded before attempting to assist someone else. Use your body weight intelligently.</li>
                <li><strong>Less is More</strong>: Often, the most profound assists are the most subtle—a gentle hand on the sacrum, a light touch to guide the shoulders.</li>
              </ul>
               <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg my-6">
                <h4 className="font-semibold text-teal-300 mb-2">Class Example: Assisting in Triangle Pose (Trikonasana)</h4>
                <p className="text-gray-300">
                  Instead of pushing a student deeper, stand behind them and place one hand on their sacrum, encouraging length. Use your other hand to gently guide their top shoulder open, creating space in the chest. Cue: "Imagine your spine growing longer as you breathe in."
                </p>
              </div>
            </ManualSection>

            <ManualSection id="props" title="Using Props to Empower">
              <p className="mb-4 leading-relaxed">
                Props are not crutches; they are tools of empowerment and exploration. They make poses more accessible, sustainable, and educational. As a teacher, it is your job to destigmatize prop use and champion it as a sign of intelligent practice.
              </p>
              <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-4">Creative & Effective Prop Use</h3>
              <ul className="space-y-4 mb-4 ml-5">
                <li><strong>Blocks</strong>: Not just for height. Use them to activate muscles (squeezing between thighs), provide feedback (placing on the sacrum in a fold), or as a stable support for balancing poses.</li>
                <li><strong>Straps</strong>: To explore binds without strain, to teach shoulder mobility (flossing), or to provide gentle traction in seated forward folds.</li>
                <li><strong>Bolsters</strong>: The key to restorative yoga. Used to support the spine in backbends, elevate the hips, or provide comfort in Savasana.</li>
                <li><strong>Blankets</strong>: For padding sensitive knees, adding height under the hips in seated poses, or providing warmth and weight for relaxation.</li>
              </ul>
            </ManualSection>

            <ManualSection id="safety" title="Creating a Safe & Brave Space">
              <p className="mb-4 leading-relaxed">
                Physical safety is the minimum requirement. Our goal is to create a <em>brave space</em>—an environment where students feel safe enough to be vulnerable, explore their limits wisely, and connect with their authentic selves.
              </p>
              <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-4">The Foundation of Trust: Consent</h3>
              <p className="mb-4">Consent is paramount. It must be explicit, enthusiastic, and can be revoked at any time.</p>
              <ul className="space-y-2 mb-4 ml-5 list-disc">
                <li><strong>Consent Systems</strong>: At the start of class, clearly explain your system. This could be a "consent coin" (one side for yes, one for no), a simple thumbs-up, or a verbal opt-in.</li>
                <li><strong>Ongoing Dialogue</strong>: Even with initial consent, check in with quiet questions like, "How does this feel?" or "Is this pressure okay?"</li>
                <li><strong>Respecting "No"</strong>: A "no" is always honored immediately and without question. Never make a student feel they need to justify their boundary.</li>
              </ul>
               <div className="p-4 bg-blue-900/20 border-l-4 border-blue-400 rounded-r-lg my-6">
                <h4 className="font-semibold text-blue-300 mb-2">Trauma-Informed Approach</h4>
                <p className="text-blue-200/90">
                  Recognize that trauma is prevalent. Use invitational language ("I invite you to...", "If it feels right..."), avoid surprising or forceful assists, and always give students agency over their own bodies and practice.
                </p>
              </div>
            </ManualSection>

            <ManualSection id="contraindications" title="Common Contraindications">
              <p className="mb-4 leading-relaxed">
                A key part of "do no harm" is understanding when a pose might be inappropriate for a student. While you are not a medical professional, having a working knowledge of common contraindications is essential.
              </p>
              <ul className="space-y-3 mb-4 ml-5">
                <li><strong>High Blood Pressure</strong>: Be cautious with inversions where the head is below the heart for extended periods. Offer alternatives like a gentle forward fold.</li>
                <li><strong>Pregnancy</strong>: Avoid deep, closed twists, prone positions, and intense core work. Emphasize stability and space for the belly.</li>
                <li><strong>Disc Issues / Sciatica</strong>: Be mindful of deep forward folds and twists. Prioritize a long spine and often, bent knees.</li>
                <li><strong>Wrist or Shoulder Injuries</strong>: Offer modifications for weight-bearing poses like Plank or Downward Dog (e.g., fists instead of flat palms, or using forearms).</li>
              </ul>
              <p className="mt-4 font-semibold text-yellow-300">The Golden Rule: When in doubt, leave it out. Encourage students to listen to their body and their doctor's advice.</p>
            </ManualSection>
          </article>
        </div>
        
        <footer className="mt-12 pt-6 border-t border-gray-700 text-center text-gray-500">
          <p>© YogaFlow University — Chapter 4: The Art of Teaching. For internal training use only.</p>
        </footer>
      </div>
    </ManualLayout>
  );
}