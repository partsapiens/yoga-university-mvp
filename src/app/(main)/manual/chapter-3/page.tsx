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
                The Integration Series is the gentle beginning of our practice. Its purpose is to transition from the busyness of the outside world to the internal landscape of the body and breath. It's a time to check in, notice sensations, and establish a steady rhythm of breath that will carry you through the practice.
              </p>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-lg text-teal-300">1. Child's Pose — Balasana</h4>
                  <p className="mb-2">A pose of surrender and grounding. Knees can be together or wide. Forehead rests on the mat, allowing the neck to be long. Focus on deep, diaphragmatic breaths that expand the back body.</p>
                  <ul className="list-disc ml-5 space-y-1 text-gray-300">
                    <li><strong>Cueing</strong>: "Settle your hips back towards your heels," "Let your forehead rest heavily on the mat."</li>
                    <li><strong>Anatomy</strong>: Gently stretches the hips, thighs, and ankles while releasing tension in the back and shoulders.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-teal-300">2. Downward-Facing Dog — Adho Mukha Svanasana</h4>
                  <p className="mb-2">An inversion that energizes and lengthens the entire body. Hands are shoulder-width, feet are hip-width. Prioritize a long spine over straight legs by bending the knees generously.</p>
                   <ul className="list-disc ml-5 space-y-1 text-gray-300">
                    <li><strong>Cueing</strong>: "Press the ground away," "Lift your hips high," "Let your head hang heavy."</li>
                    <li><strong>Anatomy</strong>: Stretches the hamstrings, calves, and shoulders. Strengthens the arms and legs.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-teal-300">3. Ragdoll — Uttanasana Variation</h4>
                  <p className="mb-2">A passive forward fold that releases the spine and hamstrings. Feet are hip-width apart with a generous bend in the knees. Clasp opposite elbows and let gravity do the work.</p>
                  <ul className="list-disc ml-5 space-y-1 text-gray-300">
                    <li><strong>Cueing</strong>: "Introduce a soft bend in your knees," "Let your head be heavy, your neck be long."</li>
                    <li><strong>Anatomy</strong>: Releases tension in the lumbar spine and neck. Gently opens the hamstrings.</li>
                  </ul>
                </div>
              </div>
            </ManualSection>

            <ManualSection id="sunA" title="Sun Salutation A (Surya Namaskar A)">
              <p className="mb-4 leading-relaxed">
                Sun Salutation A is a foundational vinyasa sequence that builds heat, synchronizes breath and movement, and prepares the body for deeper work. It is a complete practice in itself.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FigureCard caption="1. Tadasana">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="none" stroke="#a7f3d0" stroke-width="2"><path d="M50 95v-75.5a7.5 7.5 0 0115 0v10m-15-10a7.5 7.5 0 00-15 0v10"/><circle cx="50" cy="12" r="7"/><path d="M35 55h30m-25 15h20m-20-30h20"/></g></svg>
                </FigureCard>
                <FigureCard caption="2. Urdhva Hastasana">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="none" stroke="#a7f3d0" stroke-width="2"><path d="M50 95V45m0-25.5a7.5 7.5 0 0115 0V30m-15-10.5a7.5 7.5 0 00-15 0V30"/><circle cx="50" cy="12" r="7"/><path d="M35 55h30m-25 15h20m-20-30h20"/></g></svg>
                </FigureCard>
                <FigureCard caption="3. Uttanasana">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="none" stroke="#a7f3d0" stroke-width="2"><path d="M50 95V60L70 40m-20 20L30 40m20-20v20"/><circle cx="50" cy="15" r="7"/></g></svg>
                </FigureCard>
                <FigureCard caption="4. Ardha Uttanasana">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="none" stroke="#a7f3d0" stroke-width="2"><path d="M50 95V60L70 50m-20 10L30 50m40-10H30"/><circle cx="50" cy="15" r="7"/></g></svg>
                </FigureCard>
                <FigureCard caption="5. Chaturanga">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="none" stroke="#a7f3d0" stroke-width="2"><path d="M10 70h80l-10-10H20z"/><circle cx="85" cy="50" r="5"/><path d="M25 60v-5h40v5"/></g></svg>
                </FigureCard>
                <FigureCard caption="6. Urdhva Mukha">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="none" stroke="#a7f3d0" stroke-width="2"><path d="M20 90h60v-5H20zm5-5s10-20 25-20 25 20 25 20"/><circle cx="50" cy="25" r="8"/><path d="M50 33v32"/></g></svg>
                </FigureCard>
              </div>
            </ManualSection>

            <ManualSection id="sunB" title="Sun Salutation B (Surya Namaskar B)">
              <p className="mb-4 leading-relaxed">
                Sun Salutation B introduces more complexity by adding Chair Pose (Utkatasana) and Warrior I (Virabhadrasana I). This sequence builds greater heat and stamina, and more deeply challenges balance and strength.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                 <FigureCard caption="1. Utkatasana">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="none" stroke="#a7f3d0" stroke-width="2"><path d="M50 90l-10-30h20z"/><path d="M50 60V25m0-10a5 5 0 0110 0v10m-10-10a5 5 0 00-10 0v10"/><circle cx="50" cy="10" r="5"/></g></svg>
                </FigureCard>
                 <FigureCard caption="2. Virabhadrasana I">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="none" stroke="#a7f3d0" stroke-width="2"><path d="M30 90h50L70 60H40z"/><path d="M55 60V25m0-10a5 5 0 0110 0v10m-10-10a5 5 0 00-10 0v10"/><circle cx="55" cy="10" r="5"/></g></svg>
                </FigureCard>
              </div>
              <p className="mt-4 leading-relaxed">The flow then continues through the vinyasa (Chaturanga -&gt; Upward-Facing Dog -&gt; Downward-Facing Dog) before repeating Warrior I on the other side.</p>
            </ManualSection>

            <ManualSection id="reflection" title="Reflection & Practice">
              <div className="p-4 bg-blue-900/20 border-l-4 border-blue-400 rounded-r-lg my-6">
                <h4 className="font-semibold text-blue-300 mb-2">Journal Prompts</h4>
                <ul className="list-disc ml-5 space-y-1 text-blue-200/90">
                  <li>In Sun Salutation A, where do you feel the most fluid? Where do you feel "stuck"?</li>
                  <li>How does the addition of Chair and Warrior I in Sun B change the energetic quality of the flow for you?</li>
                  <li>Practice teaching the Integration series to a friend or family member. What felt natural? What was challenging to articulate?</li>
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