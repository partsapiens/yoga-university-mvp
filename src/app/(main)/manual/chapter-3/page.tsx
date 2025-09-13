'use client';

import React from 'react';
import { ManualLayout, ManualTOC, ManualSection, FigureCard } from '@/components/manual';
import PoseVideo from '@/components/PoseLibrary/PoseVideo';

export default function Chapter3Page() {
  const breadcrumbs = [
    { label: '← Manual Index', href: '/manual' },
    { label: 'Chapter 3' }
  ];

  const tocItems = [
    { id: 'integration', title: 'The Integration Series' },
    { id: 'sunA', title: 'Sun Salutation A (Surya A)' },
    { id: 'sunB', title: 'Sun Salutation B (Surya B)' },
    { id: 'reflection', title: 'Reflection & Practice' }
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
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <ManualTOC 
            items={tocItems} 
            chapterNavigation={chapterNavigation}
          />
          
          <article>
            <ManualSection id="integration" title="The Integration Series">
              <PoseVideo url="https://youtu.be/OTameg8uBws" title="The Integration Series" className="mb-8" />
              <p className="mb-4 leading-relaxed text-lg">
                The Integration Series is the crucial, gentle beginning of our physical practice. Its primary purpose is to create a conscious and skillful transition from the busyness of the outside world to the rich internal landscape of the body and breath. This is a dedicated time to check in, notice baseline sensations without judgment, and establish the steady, rhythmic Ujjayi breath that will serve as the anchor for the entire practice.
              </p>
              <div className="space-y-8">
                <div>
                  <h4 className="font-semibold text-lg text-teal-300">1. Child's Pose — Balasana (Pose of the Child)</h4>
                  <p className="mb-2">A pose of profound surrender and grounding. It offers a moment to turn inward. Knees can be together for more spinal release, or wide to create space for the torso and a deeper hip opening. The forehead rests on the mat, allowing the neck muscles to be long and passive. Focus on deep, diaphragmatic breaths that physically expand the back body against the thighs.</p>
                  <ul className="list-disc ml-5 space-y-1 text-gray-300">
                    <li><strong>Cueing</strong>: "Settle your hips back towards your heels," "Let your forehead rest heavily on the mat, releasing control of your neck," "Breathe into the space between your shoulder blades."</li>
                    <li><strong>Anatomy & Intent</strong>: Gently stretches the hips, thighs, and ankles while releasing tension in the sacroiliac joint, back, and shoulders. Calms the nervous system through mild compression and forward flexion.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-teal-300">2. Downward-Facing Dog — Adho Mukha Svanasana</h4>
                  <p className="mb-2">A foundational inversion that simultaneously energizes and lengthens the entire posterior chain of the body. Hands are shoulder-width or slightly wider, feet are hip-width. The absolute priority is a long, straight spine over straight legs. Encourage a generous bend in the knees to facilitate this spinal extension.</p>
                   <ul className="list-disc ml-5 space-y-1 text-gray-300">
                    <li><strong>Cueing</strong>: "With your fingers spread wide, press the ground away from you," "Lift your hips high to the sky," "Let your head hang heavy, shaking it gently 'yes' and 'no' to release neck tension."</li>
                    <li><strong>Anatomy & Intent</strong>: Stretches the hamstrings, calves, arches, and shoulders. Strengthens the arms, core, and legs. Mildly therapeutic for stress and fatigue due to its inversional quality.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-teal-300">3. Ragdoll — Uttanasana (Standing Forward Bend) Variation</h4>
                  <p className="mb-2">A passive forward fold designed to release the entire spine and the backs of the legs. Feet should be at least hip-width apart with a generous, visible bend in the knees to protect the low back. Clasp opposite elbows to add gentle traction to the shoulders and spine. Let gravity do the work; this is a pose of release, not striving.</p>
                  <ul className="list-disc ml-5 space-y-1 text-gray-300">
                    <li><strong>Cueing</strong>: "Introduce a soft, deep bend in your knees," "Let your entire upper body be heavy, like a waterfall," "Sway gently side to side if that feels good."</li>
                    <li><strong>Anatomy & Intent</strong>: Releases tension in the lumbar spine and neck. Gently opens the hamstrings and calves. Calms the mind by encouraging surrender.</li>
                  </ul>
                </div>
              </div>
            </ManualSection>

            <ManualSection id="sunA" title="Sun Salutation A (Surya Namaskar A)">
              <p className="mb-4 leading-relaxed">
                Sun Salutation A is a foundational vinyasa sequence that artfully builds internal heat, synchronizes breath with movement (vinyasa), and systematically prepares the body for the deeper work to come. When practiced with mindful attention, it is a powerful and complete moving meditation in itself. The sequence is typically repeated 3-5 times.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FigureCard caption="1. Tadasana (Inhale)">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="none" stroke="#a7f3d0" stroke-width="2"><path d="M50 95v-75.5a7.5 7.5 0 0115 0v10m-15-10a7.5 7.5 0 00-15 0v10"/><circle cx="50" cy="12" r="7"/><path d="M35 55h30m-25 15h20m-20-30h20"/></g></svg>
                </FigureCard>
                <FigureCard caption="2. Urdhva Hastasana (Inhale)">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="none" stroke="#a7f3d0" stroke-width="2"><path d="M50 95V45m0-25.5a7.5 7.5 0 0115 0V30m-15-10.5a7.5 7.5 0 00-15 0V30"/><circle cx="50" cy="12" r="7"/><path d="M35 55h30m-25 15h20m-20-30h20"/></g></svg>
                </FigureCard>
                <FigureCard caption="3. Uttanasana (Exhale)">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="none" stroke="#a7f3d0" stroke-width="2"><path d="M50 95V60L70 40m-20 20L30 40m20-20v20"/><circle cx="50" cy="15" r="7"/></g></svg>
                </FigureCard>
                <FigureCard caption="4. Ardha Uttanasana (Inhale)">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="none" stroke="#a7f3d0" stroke-width="2"><path d="M50 95V60L70 50m-20 10L30 50m40-10H30"/><circle cx="50" cy="15" r="7"/></g></svg>
                </FigureCard>
                <FigureCard caption="5. Chaturanga (Exhale)">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="none" stroke="#a7f3d0" stroke-width="2"><path d="M10 70h80l-10-10H20z"/><circle cx="85" cy="50" r="5"/><path d="M25 60v-5h40v5"/></g></svg>
                </FigureCard>
                <FigureCard caption="6. Urdhva Mukha (Inhale)">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="none" stroke="#a7f3d0" stroke-width="2"><path d="M20 90h60v-5H20zm5-5s10-20 25-20 25 20 25 20"/><circle cx="50" cy="25" r="8"/><path d="M50 33v32"/></g></svg>
                </FigureCard>
              </div>
              <p className="mt-4 leading-relaxed">The sequence completes with an <strong>exhale</strong> back to Downward-Facing Dog, followed by an <strong>inhale</strong> to step or hop to the hands, an <strong>exhale</strong> to fold, and an <strong>inhale</strong> to rise back to Tadasana.</p>
            </ManualSection>

            <ManualSection id="sunB" title="Sun Salutation B (Surya Namaskar B)">
              <p className="mb-4 leading-relaxed">
                Sun Salutation B introduces greater complexity and cardiovascular challenge by adding Chair Pose (Utkatasana) and Warrior I (Virabhadrasana I) into the Sun A framework. This sequence builds greater heat and stamina, and more deeply challenges balance, leg strength, and hip mobility.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                 <FigureCard caption="1. Utkatasana (Inhale)">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="none" stroke="#a7f3d0" stroke-width="2"><path d="M50 90l-10-30h20z"/><path d="M50 60V25m0-10a5 5 0 0110 0v10m-10-10a5 5 0 00-10 0v10"/><circle cx="50" cy="10" r="5"/></g></svg>
                </FigureCard>
                 <FigureCard caption="2. Virabhadrasana I (Inhale)">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="none" stroke="#a7f3d0" stroke-width="2"><path d="M30 90h50L70 60H40z"/><path d="M55 60V25m0-10a5 5 0 0110 0v10m-10-10a5 5 0 00-10 0v10"/><circle cx="55" cy="10" r="5"/></g></svg>
                </FigureCard>
              </div>
              <p className="mt-4 leading-relaxed">The flow begins with an inhale to Utkatasana, exhale to fold, then flows through the vinyasa (Chaturanga -> Upward-Facing Dog -> Downward-Facing Dog). From Downward Dog, the right foot steps forward into an <strong>inhale</strong> for Warrior I, followed by an <strong>exhale</strong> through the vinyasa, and then repeated on the left side.</p>
            </ManualSection>

            <ManualSection id="reflection" title="Reflection & Practice">
              <div className="p-4 bg-blue-900/20 border-l-4 border-blue-400 rounded-r-lg my-6">
                <h4 className="font-semibold text-blue-300 mb-2">Journal & Inquiry Prompts</h4>
                <ul className="list-disc ml-5 space-y-2 text-blue-200/90">
                  <li>In Sun Salutation A, where do you feel the most fluid and connected to your breath? Where do you feel "stuck" or find your mind wandering?</li>
                  <li>How does the addition of Chair and Warrior I in Sun B change the energetic quality of the flow? Does it feel more grounding, more challenging, or something else?</li>
                  <li>Record yourself teaching the Integration series. Listen back without judgment. What cueing felt natural and clear? What was challenging to articulate? What is one refinement you can make?</li>
                  <li>What is the purpose of the back foot being at a 45-degree angle in Warrior I? How does that affect your hips and the stability of the pose?</li>
                </ul>
              </div>
            </ManualSection>
          </article>
        </div>
        
        <footer className="mt-12 pt-6 border-t border-gray-700 text-center text-gray-500">
          <p>© YogaFlow University — Chapter 3: Integration & Sun Salutations. For internal training use only.</p>
        </footer>
      </div>
    </ManualLayout>
  );
}