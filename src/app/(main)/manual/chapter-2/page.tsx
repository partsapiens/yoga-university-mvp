'use client';

import React from 'react';
import { ManualLayout, ManualTOC, ManualSection, FigureCard } from '@/components/manual';
import PoseVideo from '@/components/PoseLibrary/PoseVideo';

export default function Chapter2Page() {
  const breadcrumbs = [
    { label: '← Manual Index', href: '/manual' },
    { label: 'Chapter 2' }
  ];

  const tocItems = [
    { id: 'introduction', title: 'The Three Pillars' },
    { id: 'breath', title: 'Pillar 1: The Art of Breath' },
    { id: 'alignment', title: 'Pillar 2: Intelligent Alignment' },
    { id: 'mindfulness', title: 'Pillar 3: Cultivating Presence' },
    { id: 'practice', title: 'Your Personal Practice Lab' },
    { id: 'safety', title: 'Core Safety Principles' }
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
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <ManualTOC 
            items={tocItems} 
            chapterNavigation={chapterNavigation}
          />
          
          <article>
            <ManualSection id="introduction" title="The Three Pillars of Practice">
              <PoseVideo url="https://youtu.be/iNzojmFm_W4" title="The Three Pillars of Practice" className="mb-8" />
              <p className="mb-4 leading-relaxed text-lg">
                Before exploring specific poses, we must understand the three pillars that support a safe, effective, and transformative yoga practice: Breath (Pranayama), Alignment (Asana), and Presence (Dhyana). These are not separate elements but interconnected aspects of a unified experience.
              </p>
              <p className="leading-relaxed">
                Mastering these foundations will not only elevate your personal practice but also provide you with the essential tools to guide others with confidence, clarity, and wisdom.
              </p>
            </ManualSection>

            <ManualSection id="breath" title="Pillar 1: The Art of Breath (Pranayama)">
              <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-4">Breath as the Life-Force</h3>
              <p className="mb-4 leading-relaxed">
                In yoga, breath is far more than the simple mechanical act of breathing; it is the carrier of <em>prana</em>, or life-force energy. The quality of our breath directly influences the state of our mind and nervous system. A calm, steady breath leads to a calm, steady mind.
              </p>

              <h4 className="text-lg font-medium text-teal-300 mt-4 mb-3">Key Breath Techniques:</h4>
              <ul className="space-y-3 mb-4 ml-5">
                <li><strong>Diaphragmatic Breath</strong>: The foundation of all yogic breathing. Focus on expanding the belly on the inhale and gently contracting it on the exhale. This maximizes oxygen exchange and calms the nervous system.</li>
                <li><strong>Ujjayi Pranayama (Victorious Breath)</strong>: Create a gentle constriction at the back of the throat, producing a soft, oceanic sound. This helps to heat the body, focus the mind, and link breath with movement.</li>
                <li><strong>Sama Vritti (Box Breathing)</strong>: Inhale for a count of four, hold for four, exhale for four, and hold for four. This technique is excellent for restoring balance and concentration.</li>
              </ul>

              <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg my-6">
                <h4 className="font-semibold text-teal-300 mb-2">Cueing Tip: Linking Breath to Movement</h4>
                <p className="text-gray-300">
                  Use simple, direct cues. For example: "On your inhale, reach your arms high." (Expansion). "On your exhale, fold forward." (Contraction). This synchronization, or <em>vinyasa</em>, is the heart of a flowing practice.
                </p>
              </div>
            </ManualSection>

            <ManualSection id="alignment" title="Pillar 2: Intelligent Alignment (Asana)">
              <p className="mb-4 leading-relaxed">
                Alignment in yoga is not about forcing the body into a perfect shape. It's about creating a clear pathway for energy to flow, ensuring safety, and maximizing the pose's benefits. It is always a balance between effort (Sthira) and ease (Sukha).
              </p>
              <h4 className="text-lg font-medium text-teal-300 mt-6 mb-3">Universal Principles of Alignment:</h4>
              <ol className="space-y-3 mb-4 ml-5 list-decimal">
                <li><strong>Establish a Foundation</strong>: Root down through the parts of your body touching the earth. Create stability from the ground up.</li>
                <li><strong>Engage Muscular Energy</strong>: Hug muscles to the bone to support and protect the joints. Draw energy from the periphery to the core.</li>
                <li><strong>Create Length and Space</strong>: Actively lengthen the spine and extend through the limbs to decompress joints and facilitate energy flow.</li>
                <li><strong>Soften and Release</strong>: Consciously relax areas of unnecessary tension, such as the jaw, neck, and shoulders.</li>
              </ol>
               <div className="p-4 bg-blue-900/20 border-l-4 border-blue-400 rounded-r-lg my-6">
                <h4 className="font-semibold text-blue-300 mb-2">Case Study: Alignment in Downward-Facing Dog</h4>
                <p className="text-blue-200/90">
                  A student has a rounded upper back. Instead of telling them to "flatten your back," cue them to "press firmly through your hands, bend your knees generously, and send your hips high." This addresses the root of the issue (tight hamstrings/shoulders) and prioritizes spinal length over straight legs.
                </p>
              </div>
            </ManualSection>

            <ManualSection id="mindfulness" title="Pillar 3: Cultivating Presence (Dhyana)">
              <p className="mb-4 leading-relaxed">
                Mindfulness is the practice of paying attention, on purpose, in the present moment, without judgment. It is the bridge that connects the physical practice of asana with the deeper states of yoga.
              </p>
              <ul className="space-y-3 mb-4 ml-5 list-disc">
                <li><strong>The Breath as an Anchor</strong>: When the mind wanders, gently guide its attention back to the rhythm and sensation of the breath.</li>
                <li><strong>Body Scan Meditation</strong>: Systematically bring awareness to different parts of the body, noticing sensations without needing to change them.</li>
                <li><strong>Noticing Habits</strong>: Observe your mental and physical habits on the mat. Do you push too hard? Do you give up easily? This self-awareness is key to transformation.</li>
              </ul>
            </ManualSection>

            <ManualSection id="practice" title="Your Personal Practice Lab">
              <p className="mb-4 leading-relaxed">
                Your personal practice is where the theory comes to life. It is your laboratory for exploration, discovery, and embodiment. It doesn't need to be long or intense, but it should be consistent.
              </p>
              <h4 className="text-lg font-medium text-teal-300 mt-6 mb-3">Building a Sustainable Practice:</h4>
              <ul className="space-y-2 ml-5">
                <li><strong>Consistency over Intensity</strong>: 15 minutes daily is more impactful than 90 minutes once a week.</li>
                <li><strong>Listen Intently</strong>: Adapt your practice to your energy levels, injuries, and needs of the day.</li>
                <li><strong>Journaling as Inquiry</strong>: After practice, jot down one thing you noticed, one challenge, and one moment of ease.</li>
                <li><strong>Teach Yourself</strong>: Practice your sequences out loud. This is one of the most effective ways to build confidence and refine your cues.</li>
              </ul>
            </ManualSection>

            <ManualSection id="safety" title="Core Safety Principles">
              <p className="mb-4 leading-relaxed">
                As a teacher, your primary responsibility is to create a safe and supportive environment. This means prioritizing the well-being of your students above all else.
              </p>
              <ul className="space-y-3 mb-4 ml-5 list-disc">
                <li><strong>"No Pain, No Pain"</strong>: Teach the crucial difference between the discomfort of a muscle stretching (sensation) and the sharp, nervy feeling of joint pain (pain). Pain is always a signal to stop.</li>
                <li><strong>Honor Individuality</strong>: Every body is unique. Emphasize that poses will look and feel different for everyone. Offer modifications and variations for all levels.</li>
                <li><strong>Empower Students</strong>: Encourage students to listen to their own bodies and make choices that serve them. Remind them that Child's Pose is always an option.</li>
                <li><strong>Create a Non-Competitive Space</strong>: Foster an atmosphere of self-acceptance and exploration, rather than achievement or comparison.</li>
              </ul>
            </ManualSection>
          </article>
        </div>
        
        <footer className="mt-12 pt-6 border-t border-gray-700 text-center text-gray-500">
          <p>© YogaFlow University — Chapter 2: Foundations of Yoga Practice. For internal training use only.</p>
        </footer>
      </div>
    </ManualLayout>
  );
}