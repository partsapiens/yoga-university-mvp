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
                Physical assists, when offered with skill and sensitivity, are a powerful form of non-verbal communication. They can offer guidance, support, stability, and deeper proprioceptive awareness. However, they must be approached with immense skill, deep respect, and a trauma-informed understanding of consent. The primary goal of an assist is never to "fix" or "correct" a pose, but to enhance the student's own inner experience and empower their journey of self-discovery.
              </p>
              <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-4">The Philosophy and Ethics of Assisting</h3>
              <ul className="space-y-4 mb-4 ml-5 list-disc">
                <li><strong>Clarity of Intention</strong>: Before you even approach a student, be crystal clear on your intention. Is this assist to ground them? To guide their energy? To provide stabilizing support? To introduce a deeper sensation? Your touch will transmit your intention.</li>
                <li><strong>Assist the Breath, Not Just the Body</strong>: A skillful assist supports and enhances the student's breath, it never restricts it. Watch their breath. Cue them to breathe as you assist. A restricted breath is a clear sign to back off.</li>
                <li><strong>Stable Base, Grounded Presence</strong>: Ensure your own physical base is stable, grounded, and organized before attempting to assist someone else. Use your body weight intelligently and avoid pushing or pulling from an unstable position. Your calm, grounded presence is part of the assist.</li>
                <li><strong>The Power of Subtlety (Less is More)</strong>: Often, the most profound and informative assists are the most subtle—a gentle, grounding hand on the sacrum in a forward fold, a light touch to guide the shoulder blades down the back. Resist the urge to over-assist.</li>
                <li><strong>Always Ask Permission</strong>: This is non-negotiable. We will cover consent systems in detail, but the principle is simple: never touch a student without their clear and enthusiastic permission.</li>
              </ul>
               <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg my-6">
                <h4 className="font-semibold text-teal-300 mb-2">Class Example: Assisting in Triangle Pose (Trikonasana)</h4>
                <p className="text-gray-300">
                  Instead of pushing a student's torso deeper towards the floor, stand behind them. Place one hand on their sacrum, providing a grounding and stabilizing touch. Use your other hand to gently guide their top shoulder and ribcage skyward, creating space and rotation in the thoracic spine. Cue: "Imagine your spine growing longer out of your hips as you breathe in, and revolve your heart to the sky as you breathe out."
                </p>
              </div>
            </ManualSection>

            <ManualSection id="props" title="Using Props to Empower and Educate">
              <p className="mb-4 leading-relaxed">
                Props are not crutches or indicators of weakness; they are sophisticated tools for empowerment, education, and exploration. They make poses more accessible, sustainable, restorative, and educational. As a teacher, it is your job to enthusiastically destigmatize prop use and champion it as a sign of a mature and intelligent practice.
              </p>
              <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-4">Creative, Effective, and Purposeful Prop Use</h3>
              <ul className="space-y-4 mb-4 ml-5">
                <li><strong>Blocks (Bring the Floor to You)</strong>: Not just for height in standing poses. Use them to activate adductors (squeezing between thighs in bridge), provide proprioceptive feedback (placing on the sacrum), create space (between hands in Crow pose), or as a stable support for balancing poses like Half Moon.</li>
                <li><strong>Straps (Extend Your Reach)</strong>: Essential for exploring binds without forcing or straining the shoulder joint. Excellent for teaching shoulder mobility ("flossing"), providing gentle, sustained traction in seated forward folds (Paschimottanasana), or binding in poses like Marichyasana C.</li>
                <li><strong>Bolsters (The Tool of Surrender)</strong>: The cornerstone of restorative yoga. Used to support the natural curve of the spine in supported backbends, to elevate the hips for greater ease in seated postures, or to provide comfort and grounding in Savasana.</li>
                <li><strong>Blankets (The Art of Comfort)</strong>: Invaluable for padding sensitive knees or wrists, adding incremental height under the hips in seated poses to allow the pelvis to tilt forward, or providing warmth and a comforting weight for deep relaxation in Savasana.</li>
              </ul>
            </ManualSection>

            <ManualSection id="safety" title="Creating a Safe and Brave Space">
              <p className="mb-4 leading-relaxed">
                Physical safety is the absolute, non-negotiable minimum requirement. Our higher goal is to cultivate a <em>brave space</em>—a carefully held environment where students feel safe enough to be vulnerable, to explore their perceived limits wisely, and to connect with their authentic selves without fear of judgment.
              </p>
              <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-4">The Unshakeable Foundation of Trust: Consent</h3>
              <p className="mb-4">Consent for hands-on assists is paramount. It must be explicit, enthusiastic, freely given, and can be revoked at any time for any reason. Silence or ambivalence is not consent.</p>
              <ul className="space-y-3 mb-4 ml-5 list-disc">
                <li><strong>Clear and Simple Consent Systems</strong>: At the beginning of every class, clearly and neutrally explain your system. This could be a "consent coin" or card (one side for yes, one for no), a simple thumbs-up/thumbs-down, or a clear verbal opt-in.</li>
                <li><strong>Consent is an Ongoing Dialogue</strong>: Even with initial consent, the dialogue continues. Before a deeper assist, check in with quiet, respectful questions like, "How does this feel?" or "Is this pressure okay for you?" Be prepared to listen and adapt.</li>
                <li><strong>Respecting "No" Gracefully</strong>: A "no" (verbal or non-verbal) is always honored immediately, respectfully, and without question. Never make a student feel they need to justify their boundary. A teacher who respects a "no" is a teacher who can be trusted.</li>
              </ul>
               <div className="p-4 bg-blue-900/20 border-l-4 border-blue-400 rounded-r-lg my-6">
                <h4 className="font-semibold text-blue-300 mb-2">A Trauma-Informed Teaching Approach</h4>
                <p className="text-blue-200/90">
                  Recognize that trauma is prevalent and often invisible. A trauma-informed approach benefits all students. This includes: using invitational language ("I invite you to...", "An option here is..."), avoiding surprising or forceful assists (especially from behind), giving students complete agency over their bodies, and offering choices whenever possible.
                </p>
              </div>
            </ManualSection>

            <ManualSection id="contraindications" title="Common Contraindications & Considerations">
              <p className="mb-4 leading-relaxed">
                A key part of our commitment to "do no harm" (*ahimsa*) is understanding when a particular pose or practice might be inappropriate for a student's condition. While you are not a medical professional and should never diagnose, having a working knowledge of common contraindications is an essential part of responsible teaching.
              </p>
              <ul className="space-y-4 mb-4 ml-5">
                <li><strong>High Blood Pressure (Hypertension)</strong>: Be cautious with sustained inversions where the head is below the heart (e.g., Headstand, Shoulderstand). Offer alternatives like Legs-Up-the-Wall (Viparita Karani) or a supported bridge pose. Breath retention techniques are generally discouraged.</li>
                <li><strong>Pregnancy</strong>: In the first trimester, the focus is on rest. Later, avoid deep, closed twists; prone positions (lying on the belly); and intense, rectus-abdominus-focused core work. Emphasize pelvic stability, side-body length, and creating space for the belly.</li>
                <li><strong>Disc Issues / Sciatica</strong>: Be highly mindful of deep, unsupported forward folds and intense twisting motions. Prioritize a long, neutral spine and often, bent knees in forward folds. Strengthening the core and glutes is often beneficial.</li>
                <li><strong>Wrist or Shoulder Injuries</strong>: Offer modifications for weight-bearing poses. For wrists, suggest fists or forearm variations for Plank and Downward Dog. For shoulders, ensure proper alignment, offer narrower or wider hand positions, and avoid deep binds that cause pain.</li>
              </ul>
              <p className="mt-4 font-semibold text-yellow-300"><strong>The Golden Rule:</strong> When in doubt, leave it out. Always empower your students to listen to their body and their healthcare provider's advice above your own cues.</li>
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