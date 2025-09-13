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
                Assisting is not about "fixing" a student's pose. It is a form of communication and support, offered with the utmost respect for the student's autonomy and inner experience. An effective assist helps a student feel a pose more deeply or find a more stable and sustainable alignment.
              </p>
              <h3 className="text-lg font-medium text-blue-400 mt-6 mb-3">Principles of Safe Assisting</h3>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Consent & choice</strong>: This is the non-negotiable foundation. Consent must be enthusiastic and can be revoked at any time.
                    <p className="text-sm text-gray-400 mt-1"><strong>Class Example:</strong> At the beginning of class, say: "I offer hands-on assists in this class. If you would prefer not to be touched today for any reason, simply give me a small shake of the head if I approach you. Your practice, your choice."</p>
                </li>
                <li><strong>See first, then say, then show</strong>: Before you touch, use your words. A precise verbal cue is often more empowering than a physical adjustment. If words don't work, demonstrate on your own body. A physical assist is the last resort, not the first.</li>
                <li><strong>Stability before depth</strong>: Your assist should help the student find their own stability. For example, instead of pushing a student deeper into a twist, provide a grounding touch at their hip to help them twist from a more stable base.</li>
                <li><strong>Neutral, supportive contact</strong>: Your touch should be confident, firm, and supportive. Use the palms of your hands rather than your fingertips. An assist should feel like a supportive brace, not a push or a pull.</li>
                <li><strong>Student‑directed depth</strong>: Empower your students. Instead of "correcting" their pose, offer a cue that allows them to find the alignment themselves. For example, instead of pulling a student's shoulders back, you could whisper, "Can you broaden across your collarbones?"</li>
              </ul>
               <div className="mt-6">
                <h4 className="font-semibold text-blue-300 mb-2">Reflection Prompts</h4>
                <ul className="list-disc ml-5 space-y-2 text-gray-300">
                  <li>What is your personal comfort level with receiving hands-on assists? How does this inform your approach to assisting others?</li>
                  <li>Think of a time a teacher's verbal cue helped you more than a physical adjustment. What made it effective?</li>
                </ul>
              </div>
            </ManualSection>

            <ManualSection id="props" title="Props & Modifications">
              <p className="mb-4 leading-relaxed">
                Props are tools of self-discovery. They allow us to find a version of a pose that is both stable and easeful. They are not a sign of weakness, but of wisdom.
              </p>
              <h3 className="text-lg font-medium text-blue-400 mt-6 mb-3">Essential Props</h3>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Blocks</strong>: The most versatile prop. Use them to bring the floor closer to you in poses like Triangle or Half Moon. Use them for support in restorative poses. Use them for engagement by squeezing a block between your thighs.</li>
                <li><strong>Straps</strong>: A strap is an extension of your arms. It allows you to connect your hands in poses where your shoulders are tight (e.g., Gomukhasana arms) or to connect your hands to your feet in forward folds, without compromising the length of your spine.</li>
                <li><strong>Bolsters</strong>: Support restorative poses, provide comfort in seated positions.</li>
                <li><strong>Blankets</strong>: Warmth, weight, support, and comfort. A blanket under the knees can relieve low back strain. A bolster under the chest in Child's Pose can create a deeply restorative experience.</li>
                <li><strong>Walls</strong>: The wall is your most stable teacher. It provides unwavering support and clear feedback on your alignment in balancing poses and inversions.</li>
              </ul>
              <div
                className="rounded-lg p-4 my-4"
                style={{
                  background: '#141921',
                  borderLeft: '4px solid #6ea8fe',
                  color: '#d8e5ff'
                }}
              >
                Props make poses *truer*, not easier—prioritize alignment and nervous‑system safety.
              </div>
               <div className="mt-6">
                <h4 className="font-semibold text-blue-300 mb-2">Case Study: The Student Who Resists Props</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  A student named David, who is strong and athletic, never uses props. He strains to touch the floor in forward folds, rounding his back.
                  <ul className="list-disc ml-5 mt-2 space-y-1">
                    <li><strong>Teacher's Approach:</strong> The teacher doesn't single David out. Instead, they say to the whole class, "I invite everyone to take two blocks to the top of your mat. Let's see how using them in our next forward fold can help us find more length in our spines."</li>
                    <li><strong>The Cue:</strong> As the class moves into the fold, the teacher says, "Place your hands on the blocks at any height. Now, press into the blocks to pull your heart forward and flatten your back."</li>
                    <li><strong>Result:</strong> David reluctantly tries the blocks. He discovers that with his hands on the blocks, he can maintain a long spine and feel a deeper, more productive stretch in his hamstrings. The teacher has reframed props from a tool for "less flexible" people to a tool for a "deeper experience."</li>
                  </ul>
                </p>
              </div>
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