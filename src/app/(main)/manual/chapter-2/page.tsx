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
                Before exploring the nuances of specific poses, we must first establish and deeply understand the three pillars that support a safe, effective, and truly transformative yoga practice: Breath (Pranayama), Alignment (Asana), and Presence (Dhyana). These are not separate, sequential elements but profoundly interconnected aspects of a unified, holistic experience. Think of them as a braid: woven together, they create a practice that is strong, resilient, and beautiful.
              </p>
              <p className="leading-relaxed">
                Mastering these foundations will not only elevate your personal practice to new depths but also provide you with the essential, unshakeable tools to guide others with confidence, clarity, precision, and wisdom.
              </p>
            </ManualSection>

            <ManualSection id="breath" title="Pillar 1: The Art of Breath (Pranayama)">
              <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-4">Breath as the Conductor of Life-Force</h3>
              <p className="mb-4 leading-relaxed">
                In the yogic tradition, breath is far more than the simple mechanical act of respiration; it is revered as the carrier of <em>prana</em>, the vital life-force energy that animates all living things. The quality of our breath directly and immediately influences the state of our mind and nervous system. A shallow, erratic breath signals stress to the brain, whereas a calm, steady, deep breath communicates safety, leading to a calm, steady mind.
              </p>

              <h4 className="text-lg font-medium text-teal-300 mt-4 mb-3">Key Foundational Breath Techniques:</h4>
              <ul className="space-y-4 mb-4 ml-5">
                <li><strong>Diaphragmatic Breath (Belly Breath)</strong>: The absolute foundation of all yogic breathing. By focusing on expanding the belly on the inhale and gently contracting it on the exhale, you engage the primary muscle of respiration, the diaphragm. This technique maximizes oxygen exchange, stimulates the Vagus nerve, and shifts the body into the parasympathetic (rest-and-digest) nervous system state.</li>
                <li><strong>Ujjayi Pranayama (Victorious or Oceanic Breath)</strong>: By creating a gentle constriction at the back of the throat (the glottis), you produce a soft, audible, oceanic sound. This serves multiple functions: it internally heats the body, provides an anchor for the mind to focus on, and creates a rhythmic cadence that helps to link breath with every movement.</li>
                <li><strong>Sama Vritti (Equal Fluctuation or Box Breathing)</strong>: Inhale for a count of four, gently hold the breath in for four, exhale completely for four, and gently hold the breath out for four. This highly effective technique is excellent for restoring balance, calming anxiety, and enhancing concentration by creating a predictable and soothing rhythm.</li>
              </ul>

              <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg my-6">
                <h4 className="font-semibold text-teal-300 mb-2">Cueing Tip: Linking Breath to Movement (Vinyasa)</h4>
                <p className="text-gray-300">
                  Use simple, direct, and invitational cues. For example: "On your next inhale, feel the breath expand your chest as you reach your arms high." (Expansion). "As you exhale, let the breath guide you as you fold forward." (Contraction). This intentional synchronization, or <em>vinyasa</em>, is the very heart of a flowing, meditative practice.
                </p>
              </div>
            </ManualSection>

            <ManualSection id="alignment" title="Pillar 2: Intelligent Alignment (Asana)">
              <p className="mb-4 leading-relaxed">
                Alignment in modern yoga is not about forcing the body into a predetermined, aesthetically "perfect" shape. It's a sophisticated practice of creating a clear, stable pathway for energy to flow, ensuring the long-term safety of the joints, and maximizing the therapeutic and energetic benefits of the pose. True alignment is always a dynamic balance between stability and freedom, effort (Sthira) and ease (Sukha).
              </p>
              <h4 className="text-lg font-medium text-teal-300 mt-6 mb-3">Universal Principles of Physical Alignment:</h4>
              <ol className="space-y-4 mb-4 ml-5 list-decimal">
                <li><strong>Establish a Foundation & Root to Rise</strong>: Consciously root down through the parts of your body touching the earth (feet, hands, sit bones). A stable foundation allows for lightness and freedom in the rest of the posture. Create stability from the ground up.</li>
                <li><strong>Engage Muscular Energy & Hug the Midline</strong>: Actively hug muscles to the bone to support and protect the joints. Imagine drawing energy from the periphery (hands and feet) inward and upward toward the core. This creates integrated strength.</li>
                <li><strong>Create Axial Extension (Length and Space)</strong>: Before you twist or bend, always lengthen. Actively lengthen the spine and extend through the limbs to decompress joints, create space for organs, and facilitate a smoother flow of breath and energy.</li>
                <li><strong>Soften, Yield, and Release</strong>: The work is not just in the effort. Consciously and repeatedly scan the body to relax areas of unnecessary tension, such as the jaw, neck, shoulders, and brow. True strength is free of extraneous tension.</li>
              </ol>
               <div className="p-4 bg-blue-900/20 border-l-4 border-blue-400 rounded-r-lg my-6">
                <h4 className="font-semibold text-blue-300 mb-2">Case Study: Functional Alignment in Downward-Facing Dog</h4>
                <p className="text-blue-200/90">
                  A student has a rounded upper back and is hyper-focused on getting their heels to the floor. Instead of telling them to "flatten your back," a more effective cue would be: "Press firmly through all ten knuckles, bend your knees generously to untuck your tailbone, and send your hips high and back, prioritizing a long, straight line from your wrists to your hips." This addresses the root cause (often tight hamstrings and/or shoulders) and prioritizes spinal health over the aesthetic of straight legs.
                </p>
              </div>
            </ManualSection>

            <ManualSection id="mindfulness" title="Pillar 3: Cultivating Presence (Dhyana)">
              <p className="mb-4 leading-relaxed">
                Mindfulness, in the context of yoga, is the practice of paying attention, on purpose, in the present moment, without judgment. It is the vital bridge that connects the outer practice of asana with the inner, more subtle, and transformative states of yoga. Without mindfulness, asana is just physical exercise.
              </p>
              <ul className="space-y-4 mb-4 ml-5 list-disc">
                <li><strong>The Breath as a Loyal Anchor</strong>: The mind will wander; that is its nature. Your task is not to stop it, but to gently and kindly guide its attention back, again and again, to the physical sensation and rhythm of the breath. Each return is a moment of successful practice.</li>
                <li><strong>Interoception (Body Scan)</strong>: Systematically and curiously bring your awareness to different parts of the body as you hold a pose. Notice subtle sensations—warmth, tingling, pressure, stretch—without needing to label them as "good" or "bad."</li>
                <li><strong>Noticing the Kleshas (Mental Habits)</strong>: Observe your mental and physical habits on the mat. Do you push too hard (Raga - attachment)? Do you shy away from challenge (Dvesha - aversion)? This compassionate self-awareness is the first step toward lasting transformation.</li>
              </ul>
            </ManualSection>

            <ManualSection id="practice" title="Your Personal Practice Lab">
              <p className="mb-4 leading-relaxed">
                Your personal practice is where the theory becomes embodied wisdom. It is your sacred laboratory for exploration, discovery, and integration. It doesn't need to be long, perfect, or intense, but it must be consistent to yield results. This is where you are your own best teacher.
              </p>
              <h4 className="text-lg font-medium text-teal-300 mt-6 mb-3">Building a Sustainable and Insightful Practice:</h4>
              <ul className="space-y-3 ml-5">
                <li><strong>Consistency over Intensity</strong>: A conscious, 20-minute daily practice is exponentially more impactful for neurological and physical adaptation than a grueling 90-minute session once a week.</li>
                <li><strong>Listen Intently (Ahimsa in Action)</strong>: Adapt your practice to your energy levels, injuries, and the authentic needs of the day, not the needs of your ego. Some days require a vigorous flow; others require restorative stillness.</li>
                <li><strong>Journaling as Inquiry</strong>: After practice, take two minutes to jot down one thing you noticed, one challenge you met with grace, and one moment of genuine ease or insight. This solidifies the learning.</li>
                <li><strong>Teach Yourself Aloud</strong>: As you move through a sequence, practice your cues out loud. This is one of the fastest and most effective ways to build confidence, internalize alignment principles, and refine your unique voice.</li>
              </ul>
            </ManualSection>

            <ManualSection id="safety" title="Core Safety Principles: Primum Non Nocere">
              <p className="mb-4 leading-relaxed">
                As a yoga teacher, your primary responsibility—your prime directive—is to create a safe and supportive environment where students can explore their own experience. This means prioritizing the physical and psychological well-being of your students above all else. The Latin phrase *Primum non nocere* means "First, do no harm."
              </p>
              <ul className="space-y-4 mb-4 ml-5 list-disc">
                <li><strong>"No Pain, No Pain" - The Golden Rule</strong>: Diligently teach the crucial difference between the productive discomfort of a muscle stretching (sensation) and the sharp, nervy, or grinding feeling of joint pain (pain). Pain is always an intelligent signal to stop and reassess.</li>
                <li><strong>Honor Bio-Individuality</strong>: Every body is a unique combination of genetics, history, and daily habits. Emphasize that poses will and *should* look and feel different for everyone. Generously offer modifications and variations not as "easier" options, but as "smarter" ones.</li>
                <li><strong>Empower Student Agency</strong>: Explicitly and repeatedly encourage students to listen to their own bodies as the ultimate authority. Remind them that Child's Pose (or any other resting posture) is a sign of wisdom, not weakness, and is always an option.</li>
                <li><strong>Create a Non-Competitive and Inclusive Space</strong>: Foster an atmosphere of radical self-acceptance, curiosity, and exploration, rather than external achievement or comparison. Use language that is welcoming to all bodies, abilities, and backgrounds.</li>
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