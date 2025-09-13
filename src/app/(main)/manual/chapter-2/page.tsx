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
                Breath (Prana) is not just air; it's the vital life force that animates us. In yoga, the breath is a powerful tool to anchor our awareness in the present moment and to regulate our nervous system. A calm, steady breath signals to our body that we are safe, allowing us to move deeper into our practice with mindful control.
              </p>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Natural Breath</strong>: Before any control is applied, simply notice. Is your breath shallow or deep? Fast or slow? In the chest or in the belly? This is the diagnostic phase.</li>
                <li><strong>Ujjayi Breath</strong>: Often called "ocean breath," this technique involves a slight constriction in the back of the throat. This creates an audible sound that serves as an anchor for your focus and helps to build internal heat.</li>
                <li><strong>Breath and Movement</strong>: This is the essence of Vinyasa. Typically, inhales are linked with upward movements and opening (e.g., lifting into Warrior I), while exhales are linked with downward movements and contracting (e.g., folding forward).</li>
                <li><strong>Breath as Anchor</strong>: When a pose becomes challenging, the mind tends to wander or panic. The breath is your tether to the present. Returning your focus to the sound and rhythm of your Ujjayi breath can transform a struggle into a meditative experience.</li>
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
              <div className="mt-6">
                <h4 className="font-semibold text-blue-300 mb-2">Cueing Tips for Breath</h4>
                <ul className="list-disc ml-5 space-y-2 text-gray-300">
                  <li><strong>For Natural Breath:</strong> "As you settle in, bring your awareness to your breath without changing a thing. Simply be the witness to your own breathing."</li>
                  <li><strong>For Ujjayi:</strong> "Begin to find a gentle constriction at the back of your throat, as if you're trying to fog up a mirror with your mouth closed. Let the sound be a soft whisper, audible only to you."</li>
                  <li><strong>For Breath and Movement:</strong> "On your next inhale, reach your arms high. Exhale, fold forward from your hips."</li>
                </ul>
              </div>
              <div className="mt-6">
                <h4 className="font-semibold text-blue-300 mb-2">Reflection Prompts</h4>
                <ul className="list-disc ml-5 space-y-2 text-gray-300">
                  <li>In what situations, on or off the mat, do you notice yourself holding your breath?</li>
                  <li>Describe the physical sensation of Ujjayi breath in your own words. Does it feel warming, calming, or something else?</li>
                </ul>
              </div>
            </ManualSection>

            <ManualSection id="alignment" title="Basic Alignment Principles">
              <h3 className="text-lg font-medium text-blue-400 mt-6 mb-3">Creating Safe and Stable Foundation</h3>
              <p className="mb-4 leading-relaxed">
                Proper alignment is not about creating a "perfect" shape with the body. It is about organizing the body in a way that creates stability, prevents injury, and allows energy (Prana) to flow freely. Good alignment is felt more than it is seen.
              </p>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Foundation First</strong>: Whatever part of your body is touching the ground is your foundation. A strong foundation is the root of the pose. For example, in Tadasana (Mountain Pose), the foundation is the feet. In Downward-Facing Dog, it is the hands and feet.</li>
                <li><strong>Spine Awareness</strong>: The spine is the central channel of energy. In most poses, the goal is to create length and maintain the natural curves of the spine, rather than rounding or over-arching.</li>
                <li><strong>Joint Stacking</strong>: Stacking joints (e.g., ankles under knees, shoulders over wrists) creates a stable structure that allows muscles to work efficiently without straining ligaments and tendons.</li>
                <li><strong>Muscular Engagement</strong>: Alignment is not passive. It requires conscious muscular engagement. This is the concept of "hugging muscle to bone," which creates stability from the inside out.</li>
              </ul>
              <h3 className="text-lg font-medium text-blue-400 mt-6 mb-3">Universal Alignment Principles</h3>
              <ol className="space-y-2 mb-4 ml-5 list-decimal">
                <li><strong>Ground through your foundation</strong>: Press down actively into the floor.</li>
                <li><strong>Engage your core</strong>: Gently draw your navel towards your spine to support your low back.</li>
                <li><strong>Lengthen your spine</strong>: Create space between your vertebrae.</li>
                <li><strong>Soften where you don't need effort</strong>: Release tension in your jaw, neck, and shoulders.</li>
                <li><strong>Breathe consciously</strong>: Let your breath guide your awareness.</li>
              </ol>
              <div className="mt-6">
                <h4 className="font-semibold text-blue-300 mb-2">Cueing Tips for Alignment</h4>
                <ul className="list-disc ml-5 space-y-2 text-gray-300">
                  <li><strong>For Foundation:</strong> "In your Warrior II, press down firmly through the outer edge of your back foot."</li>
                  <li><strong>For Spine:</strong> "Imagine a string pulling the crown of your head towards the ceiling, creating length in your neck."</li>
                  <li><strong>For Joint Stacking:</strong> "In your high plank, check that your shoulders are stacked directly over your wrists."</li>
                  <li><strong>For Muscular Engagement:</strong> "In Triangle Pose, engage your thigh muscles to lift your kneecaps."</li>
                </ul>
              </div>
              <div className="mt-6">
                <h4 className="font-semibold text-blue-300 mb-2">Case Study: The Student with Hyperextended Knees</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  A student named Sarah consistently hyperextends her knees in standing poses like Triangle and Pyramid. A teacher notices this and, instead of pushing her knee into place, offers a verbal cue: "Sarah, can you bring a micro-bend to your front knee? Imagine you're trying to lift your kneecap up towards your hip." This cue empowers Sarah to use her own muscular engagement to find a safer, more stable alignment. It shifts the focus from an external "look" to an internal feeling of stability.
                </p>
              </div>
            </ManualSection>

            <ManualSection id="practice" title="Developing Personal Practice">
              <h3 className="text-lg font-medium text-blue-400 mt-6 mb-3">Consistency Over Intensity</h3>
              <p className="mb-4 leading-relaxed">
                Your personal practice is the source from which all your teaching will flow. It is where you embody the principles you will later share. It does not need to be long or intense, but it must be consistent.
              </p>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Start Small</strong>: The goal is to create a sustainable habit. Five conscious breaths and three Sun Salutations every morning is more powerful than a 2-hour practice once a month.</li>
                <li><strong>Listen to Your Body</strong>: This is a core tenet of yoga. Some days you will feel energetic and strong; other days you will need a restorative practice. Honoring this is a sign of advanced practice.</li>
                <li><strong>Include All Elements</strong>: A balanced practice includes more than just asana. Dedicate time to pranayama (breathwork) and dhyana (meditation) to nourish all aspects of your being.</li>
                <li><strong>Track Your Progress</strong>: Journaling is a form of Svadhyaya (self-study). Note how poses feel, what thoughts arise, and what you are learning. This creates a powerful feedback loop for growth.</li>
              </ul>
               <div
                className="rounded-lg p-4 my-4"
                style={{
                  background: '#141921',
                  borderLeft: '4px solid #6ea8fe',
                  color: '#d8e5ff'
                }}
              >
                Your personal practice is your laboratory. Experiment with different approaches and notice what serves you best.
              </div>
            </ManualSection>

            <ManualSection id="mindfulness" title="Mindfulness & Presence">
               <h3 className="text-lg font-medium text-blue-400 mt-6 mb-3">Cultivating Awareness</h3>
              <p className="mb-4 leading-relaxed">
                Mindfulness is the practice of paying attention to the present moment without judgment. The asana practice is a moving meditation, a training ground for mindfulness that we can then take with us into the rest of our lives.
              </p>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Body Awareness (Interoception)</strong>: This is the skill of sensing your internal state. Can you feel your heartbeat? The sensation of your breath in your lungs? The subtle shifts of balance in a pose?</li>
                <li><strong>Mental Observation</strong>: Your mind will wander. That is its nature. The practice is not to stop the thoughts, but to notice when you have wandered and gently guide your attention back to the anchor of your breath or body.</li>
                <li><strong>Effort and Ease (Sthira and Sukha)</strong>: This is the central paradox of asana practice. In every pose, we seek a balance between steady, focused effort (Sthira) and a sense of comfort and ease (Sukha).</li>
                <li><strong>Non-Competitive Attitude</strong>: Your yoga mat is a judgment-free zone. Your practice is unique to your body and your journey. Let go of comparing yourself to others or to a past version of yourself.</li>
              </ul>
               <div className="mt-6">
                <h4 className="font-semibold text-blue-300 mb-2">Cueing Tips for Mindfulness</h4>
                <ul className="list-disc ml-5 space-y-2 text-gray-300">
                  <li>"As you hold this pose, can you soften one part of your body that doesn't need to be working so hard?"</li>
                  <li>"If you notice your mind has wandered, gently thank it for the thought, and then guide your focus back to the feeling of your breath."</li>
                  <li>"Find that place between too much and not enough. Where can you be both strong and at ease?"</li>
                </ul>
              </div>
            </ManualSection>

            <ManualSection id="safety" title="Safety Principles">
               <h3 className="text-lg font-medium text-blue-400 mt-6 mb-3">Preventing Injury</h3>
              <p className="mb-4 leading-relaxed">
                As a teacher, your primary responsibility is to create a safe container for your students to practice in. This means teaching them to honor their own bodies and to work with wisdom and compassion.
              </p>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Warm Up Gradually</strong>: A good warm-up increases blood flow to the muscles and lubricates the joints, preparing the body for more strenuous activity. Think Cat-Cow, gentle twists, and Sun Salutation A.</li>
                <li><strong>Honor Your Limits</strong>: The edge is a place of sensation, not sharp pain. Teach students to recognize the difference between the productive discomfort of a stretch and the warning signal of pain.</li>
                <li><strong>Use Props Wisely</strong>: Props are not a crutch; they are tools for a wiser, more sustainable practice. A block under the hand in Triangle Pose can make the pose more accessible and safer for the spine.</li>
                <li><strong>Avoid Pain</strong>: Pain is the body's signal that something is wrong. The yoga principle of Ahimsa (non-harming) applies first and foremost to ourselves.</li>
                <li><strong>Cool Down Properly</strong>: A cool-down, including a final resting pose (Savasana), allows the nervous system to down-regulate and integrate the benefits of the practice.</li>
              </ul>
              <div className="mt-6">
                <h4 className="font-semibold text-blue-300 mb-2">Reflection Prompts</h4>
                <ul className="list-disc ml-5 space-y-2 text-gray-300">
                  <li>Describe a time you pushed yourself too far in a pose. What did it feel like, and what did you learn from it?</li>
                  <li>How can you use props in your own practice this week to find more ease or stability in a challenging pose?</li>
                </ul>
              </div>
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