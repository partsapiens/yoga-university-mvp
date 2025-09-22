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
                The Integration Series is the gentle beginning of our practice. Its purpose is to transition from the busyness of the outside world to the internal landscape of the body and breath. It&apos;s a time to check in, notice sensations, and establish a steady rhythm of breath that will carry you through the practice.
              </p>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-lg text-teal-300">1. Child&apos;s Pose — Balasana</h4>
                  <p className="mb-2">A pose of surrender and grounding. Knees can be together or wide. Forehead rests on the mat, allowing the neck to be long. Focus on deep, diaphragmatic breaths that expand the back body.</p>
                  <ul className="list-disc ml-5 space-y-1 text-gray-300">
                    <li><strong>Cueing</strong>: &ldquo;Settle your hips back towards your heels,&rdquo; &ldquo;Let your forehead rest heavily on the mat.&rdquo;</li>
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
                Sun Salutation A is a foundational vinyasa sequence that builds heat, synchronizes breath and movement, and prepares the body for deeper work. It is a complete practice in itself. Each movement is paired with a specific breath, creating a moving meditation.
              </p>

              <h4 className="text-lg font-medium text-teal-300 mt-6 mb-3">Complete Sequence with Breath & Sanskrit:</h4>
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-900/50 border border-gray-600 rounded-lg">
                      <h5 className="font-semibold text-blue-300">1. Mountain Pose — Tadasana</h5>
                      <p className="text-sm text-gray-300">🫁 <strong>Natural breath</strong> | Hands at heart center in prayer</p>
                    </div>
                    <div className="p-3 bg-gray-900/50 border border-gray-600 rounded-lg">
                      <h5 className="font-semibold text-blue-300">2. Upward Salute — Urdhva Hastasana</h5>
                      <p className="text-sm text-gray-300">🫁 <strong>INHALE</strong> | Sweep arms wide and up overhead</p>
                    </div>
                    <div className="p-3 bg-gray-900/50 border border-gray-600 rounded-lg">
                      <h5 className="font-semibold text-blue-300">3. Standing Forward Fold — Uttanasana</h5>
                      <p className="text-sm text-gray-300">🫁 <strong>EXHALE</strong> | Hinge at hips, fold forward</p>
                    </div>
                    <div className="p-3 bg-gray-900/50 border border-gray-600 rounded-lg">
                      <h5 className="font-semibold text-blue-300">4. Half Lift — Ardha Uttanasana</h5>
                      <p className="text-sm text-gray-300">🫁 <strong>INHALE</strong> | Hands to shins, lengthen spine</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-900/50 border border-gray-600 rounded-lg">
                      <h5 className="font-semibold text-blue-300">5. Low Push-up — Chaturanga Dandasana</h5>
                      <p className="text-sm text-gray-300">🫁 <strong>EXHALE</strong> | Step/jump back, lower down</p>
                    </div>
                    <div className="p-3 bg-gray-900/50 border border-gray-600 rounded-lg">
                      <h5 className="font-semibold text-blue-300">6. Upward-Facing Dog — Urdhva Mukha Svanasana</h5>
                      <p className="text-sm text-gray-300">🫁 <strong>INHALE</strong> | Roll over toes, open chest</p>
                    </div>
                    <div className="p-3 bg-gray-900/50 border border-gray-600 rounded-lg">
                      <h5 className="font-semibold text-blue-300">7. Downward-Facing Dog — Adho Mukha Svanasana</h5>
                      <p className="text-sm text-gray-300">🫁 <strong>EXHALE</strong> | Roll over toes, lift hips</p>
                    </div>
                    <div className="p-3 bg-gray-900/50 border border-gray-600 rounded-lg">
                      <h5 className="font-semibold text-blue-300">8-9. Return to Mountain</h5>
                      <p className="text-sm text-gray-300">🫁 <strong>INH:</strong> Step/jump forward, half lift | <strong>EXH:</strong> Fold | <strong>INH:</strong> Rise to standing</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-900/20 border-l-4 border-blue-400 rounded-r-lg my-6">
                <h4 className="font-semibold text-blue-300 mb-2">Teaching Cues for Sun A</h4>
                <ul className="list-disc ml-5 space-y-1 text-blue-200/90 text-sm">
                  <li><strong>Tadasana:</strong> "Find your breath, set your intention"</li>
                  <li><strong>Urdhva Hastasana:</strong> "Inhale, sweep arms wide like you're gathering energy"</li>
                  <li><strong>Uttanasana:</strong> "Exhale, hinge at hips, bend knees generously"</li>
                  <li><strong>Chaturanga:</strong> "Strong core, elbows hug in, lower with control"</li>
                  <li><strong>Up Dog:</strong> "Press hands down, lift heart, legs strong"</li>
                </ul>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
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
                Sun Salutation B introduces more complexity by adding Chair Pose (Utkatasana) and Warrior I (Virabhadrasana I). This sequence builds greater heat and stamina, and more deeply challenges balance and strength. It requires 17 breaths total.
              </p>

              <h4 className="text-lg font-medium text-teal-300 mt-6 mb-3">Complete Sun B Sequence:</h4>
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-900/50 border border-gray-600 rounded-lg">
                      <h5 className="font-semibold text-blue-300 text-sm">1. Chair Pose — Utkatasana</h5>
                      <p className="text-xs text-gray-300">🫁 <strong>INHALE</strong> | Bend knees, arms up, sit back</p>
                    </div>
                    <div className="p-3 bg-gray-900/50 border border-gray-600 rounded-lg">
                      <h5 className="font-semibold text-blue-300 text-sm">2. Standing Forward Fold — Uttanasana</h5>
                      <p className="text-xs text-gray-300">🫁 <strong>EXHALE</strong> | Fold forward, hands down</p>
                    </div>
                    <div className="p-3 bg-gray-900/50 border border-gray-600 rounded-lg">
                      <h5 className="font-semibold text-blue-300 text-sm">3. Half Lift — Ardha Uttanasana</h5>
                      <p className="text-xs text-gray-300">🫁 <strong>INHALE</strong> | Hands to shins, lengthen</p>
                    </div>
                    <div className="p-3 bg-gray-900/50 border border-gray-600 rounded-lg">
                      <h5 className="font-semibold text-blue-300 text-sm">4. Low Push-up — Chaturanga</h5>
                      <p className="text-xs text-gray-300">🫁 <strong>EXHALE</strong> | Step back, lower down</p>
                    </div>
                    <div className="p-3 bg-gray-900/50 border border-gray-600 rounded-lg">
                      <h5 className="font-semibold text-blue-300 text-sm">5. Upward-Facing Dog</h5>
                      <p className="text-xs text-gray-300">🫁 <strong>INHALE</strong> | Roll forward, open chest</p>
                    </div>
                    <div className="p-3 bg-gray-900/50 border border-gray-600 rounded-lg">
                      <h5 className="font-semibold text-blue-300 text-sm">6. Downward-Facing Dog</h5>
                      <p className="text-xs text-gray-300">🫁 <strong>EXHALE</strong> | Roll over toes, lift hips</p>
                    </div>
                    <div className="p-3 bg-gray-900/50 border border-gray-600 rounded-lg">
                      <h5 className="font-semibold text-blue-300 text-sm">7. Warrior I Right — Virabhadrasana I</h5>
                      <p className="text-xs text-gray-300">🫁 <strong>INHALE</strong> | Step right foot forward, arms up</p>
                    </div>
                    <div className="p-3 bg-gray-900/50 border border-gray-600 rounded-lg">
                      <h5 className="font-semibold text-blue-300 text-sm">8. Chaturanga</h5>
                      <p className="text-xs text-gray-300">🫁 <strong>EXHALE</strong> | Hands down, step back, lower</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-900/50 border border-gray-600 rounded-lg">
                      <h5 className="font-semibold text-blue-300 text-sm">9. Upward-Facing Dog</h5>
                      <p className="text-xs text-gray-300">🫁 <strong>INHALE</strong> | Roll forward, open chest</p>
                    </div>
                    <div className="p-3 bg-gray-900/50 border border-gray-600 rounded-lg">
                      <h5 className="font-semibold text-blue-300 text-sm">10. Downward-Facing Dog</h5>
                      <p className="text-xs text-gray-300">🫁 <strong>EXHALE</strong> | Roll over toes, lift hips</p>
                    </div>
                    <div className="p-3 bg-gray-900/50 border border-gray-600 rounded-lg">
                      <h5 className="font-semibold text-blue-300 text-sm">11. Warrior I Left — Virabhadrasana I</h5>
                      <p className="text-xs text-gray-300">🫁 <strong>INHALE</strong> | Step left foot forward, arms up</p>
                    </div>
                    <div className="p-3 bg-gray-900/50 border border-gray-600 rounded-lg">
                      <h5 className="font-semibold text-blue-300 text-sm">12. Chaturanga</h5>
                      <p className="text-xs text-gray-300">🫁 <strong>EXHALE</strong> | Hands down, step back, lower</p>
                    </div>
                    <div className="p-3 bg-gray-900/50 border border-gray-600 rounded-lg">
                      <h5 className="font-semibold text-blue-300 text-sm">13. Upward-Facing Dog</h5>
                      <p className="text-xs text-gray-300">🫁 <strong>INHALE</strong> | Roll forward, open chest</p>
                    </div>
                    <div className="p-3 bg-gray-900/50 border border-gray-600 rounded-lg">
                      <h5 className="font-semibold text-blue-300 text-sm">14. Downward-Facing Dog</h5>
                      <p className="text-xs text-gray-300">🫁 <strong>EXHALE</strong> | Roll over toes, lift hips</p>
                    </div>
                    <div className="p-3 bg-gray-900/50 border border-gray-600 rounded-lg">
                      <h5 className="font-semibold text-blue-300 text-sm">15-17. Return to Chair</h5>
                      <p className="text-xs text-gray-300">🫁 <strong>INH:</strong> Jump forward, half lift | <strong>EXH:</strong> Fold | <strong>INH:</strong> Chair pose</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg my-6">
                <h4 className="font-semibold text-teal-300 mb-2">Key Alignment Cues for Sun B</h4>
                <ul className="list-disc ml-5 space-y-1 text-gray-300 text-sm">
                  <li><strong>Utkatasana:</strong> "Weight in heels, knees track over ankles, arms reach up strongly"</li>
                  <li><strong>Warrior I:</strong> "Front knee over ankle, back leg straight and strong, square hips forward"</li>
                  <li><strong>Transitions:</strong> "Move with your breath, skip vinyasa if you need to rest"</li>
                </ul>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                 <FigureCard caption="1. Utkatasana">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="none" stroke="#a7f3d0" stroke-width="2"><path d="M50 90l-10-30h20z"/><path d="M50 60V25m0-10a5 5 0 0110 0v10m-10-10a5 5 0 00-10 0v10"/><circle cx="50" cy="10" r="5"/></g></svg>
                </FigureCard>
                 <FigureCard caption="2. Virabhadrasana I">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="none" stroke="#a7f3d0" stroke-width="2"><path d="M30 90h50L70 60H40z"/><path d="M55 60V25m0-10a5 5 0 0110 0v10m-10-10a5 5 0 00-10 0v10"/><circle cx="55" cy="10" r="5"/></g></svg>
                </FigureCard>
                <FigureCard caption="Complete Vinyasa">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="none" stroke="#a7f3d0" stroke-width="2"><path d="M10 50h25l10-10 10 10h25l10-10"/><circle cx="50" cy="25" r="5"/></g></svg>
                </FigureCard>
              </div>
            </ManualSection>

            <ManualSection id="reflection" title="Practice Applications & Teaching Tips">
              <h4 className="text-lg font-medium text-teal-300 mt-6 mb-3">Progressive Teaching Approach:</h4>
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <h5 className="font-semibold text-blue-300 mb-2">Week 1-2: Introduction</h5>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    <li>Teach Integration Series in isolation</li>
                    <li>Practice Sun A slowly, holding each pose for 3-5 breaths</li>
                    <li>Focus on breath awareness before linking movement</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <h5 className="font-semibold text-blue-300 mb-2">Week 3-4: Building Flow</h5>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    <li>Link breath to movement in Sun A</li>
                    <li>Introduce modifications (step back vs. jump back)</li>
                    <li>Add Sun B slowly, piece by piece</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <h5 className="font-semibold text-blue-300 mb-2">Week 5+: Integration</h5>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    <li>Multiple rounds of Sun A and B</li>
                    <li>Add variations (arm movements, pace changes)</li>
                    <li>Use as warm-up for longer sequences</li>
                  </ul>
                </div>
              </div>

              <h4 className="text-lg font-medium text-teal-300 mt-6 mb-3">Common Student Challenges & Solutions:</h4>
              <div className="space-y-3 mb-6">
                <div className="p-3 bg-red-900/20 border border-red-600 rounded-lg">
                  <h5 className="font-semibold text-red-300 text-sm">Challenge: "I can't keep up with the breath"</h5>
                  <p className="text-xs text-gray-300"><strong>Solution:</strong> Encourage longer breaths, offer option to hold poses longer, remind them it's practice, not performance.</p>
                </div>
                <div className="p-3 bg-red-900/20 border border-red-600 rounded-lg">
                  <h5 className="font-semibold text-red-300 text-sm">Challenge: "Chaturanga hurts my shoulders"</h5>
                  <p className="text-xs text-gray-300"><strong>Solution:</strong> Offer knees-down option, emphasize elbows hugging in, suggest skipping the vinyasa entirely.</p>
                </div>
                <div className="p-3 bg-red-900/20 border border-red-600 rounded-lg">
                  <h5 className="font-semibold text-red-300 text-sm">Challenge: "I can't balance in Warrior I"</h5>
                  <p className="text-xs text-gray-300"><strong>Solution:</strong> Widen stance front-to-back, use blocks under hands, practice against wall for support.</p>
                </div>
              </div>

              <div className="p-4 bg-blue-900/20 border-l-4 border-blue-400 rounded-r-lg my-6">
                <h4 className="font-semibold text-blue-300 mb-2">Journal Prompts for Deeper Integration</h4>
                <ul className="list-disc ml-5 space-y-1 text-blue-200/90">
                  <li>In Sun Salutation A, where do you feel the most fluid? Where do you feel "stuck"?</li>
                  <li>How does the addition of Chair and Warrior I in Sun B change the energetic quality of the flow for you?</li>
                  <li>Practice teaching the Integration series to a friend or family member. What felt natural? What was challenging to articulate?</li>
                  <li>Notice your internal dialogue during challenging poses. Is it supportive or critical? How can you shift it?</li>
                  <li>Which Sanskrit names feel natural to you? Which feel intimidating? Why might this be?</li>
                </ul>
              </div>

              <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg my-6">
                <h4 className="font-semibold text-teal-300 mb-2">Sequencing Tip: Using Sun Salutations in Class</h4>
                <ul className="list-disc ml-5 space-y-1 text-gray-300 text-sm">
                  <li><strong>Gentle Classes:</strong> 1-2 rounds of Sun A only</li>
                  <li><strong>Moderate Classes:</strong> 3 rounds Sun A, 2 rounds Sun B</li>
                  <li><strong>Vigorous Classes:</strong> 5 rounds Sun A, 3-5 rounds Sun B</li>
                  <li><strong>Always offer modifications</strong> and encourage students to rest in Child's Pose when needed</li>
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