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
              <p className="mb-4 text-gray-400">
                The Integration Series is the bridge from the stillness of your opening meditation to the dynamic flow of the asana practice. Its purpose is to gently awaken the body, connect with the breath, and set a clear intention for the practice ahead. It's a moment to check in with the body and establish the rhythm of breath that will carry you through the rest of the class.
              </p>
              <ol className="space-y-4 ml-5">
                <li>
                  <strong>Child's Pose — Balasana</strong>
                  <p className="text-sm text-gray-400 mt-1">This pose is a return to the self. It gently stretches the hips, thighs, and ankles while calming the brain and helping to relieve stress and fatigue. It's a pose of surrender.</p>
                  <ul className="mt-2 ml-5 mb-2 space-y-1 list-disc">
                    <li>Knees wide or together; big toes touch.</li>
                    <li>Lengthen spine from sacrum through crown.</li>
                    <li>Soften shoulders and jaw; deepen breath.</li>
                    <li><strong>Cueing Tip:</strong> "Let your forehead rest completely on the mat. With each exhale, feel your hips sinking heavier toward your heels."</li>
                  </ul>
                </li>
                <li>
                  <strong>Downward Facing Dog — Adho Mukha Svanasana</strong>
                   <p className="text-sm text-gray-400 mt-1">This is a full-body pose that both strengthens and stretches. It lengthens the hamstrings and calves while building strength in the arms and shoulders. Energetically, it is both grounding and uplifting.</p>
                  <ul className="mt-2 ml-5 mb-2 space-y-1 list-disc">
                    <li>Hands shoulder-width; root through thumb/index.</li>
                    <li>Lift hips high; lengthen spine.</li>
                    <li>Micro-bend knees to free low back.</li>
                     <li><strong>Cueing Tip:</strong> "Press the mat away from you with your hands. Imagine your hips are being pulled up and back towards the corner where the ceiling meets the wall. Let your head hang heavy."</li>
                  </ul>
                </li>
                <li>
                  <strong>Ragdoll — Uttanasana variation</strong>
                   <p className="text-sm text-gray-400 mt-1">This passive forward fold allows gravity to do the work, creating gentle traction for the spine and releasing tension in the neck and shoulders. It's a moment to let go completely.</p>
                  <ul className="mt-2 ml-5 mb-2 space-y-1 list-disc">
                    <li>Feet hip-width; soft knees.</li>
                    <li>Hinge from hips; hang head heavy.</li>
                    <li>Optional clasp elbows to traction spine.</li>
                     <li><strong>Cueing Tip:</strong> "Grab for opposite elbows and allow a generous bend in your knees. You might introduce a gentle sway from side to side, like a heavy pendulum."</li>
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
               <div className="mt-6">
                <h4 className="font-semibold text-blue-300 mb-2">Reflection Prompts</h4>
                <ul className="list-disc ml-5 space-y-2 text-gray-300">
                  <li>How does the feeling in your body change between the first Downward-Facing Dog and the last one in a practice?</li>
                  <li>What does the word "integration" mean to you in the context of your yoga practice?</li>
                </ul>
              </div>
            </ManualSection>

            <ManualSection id="sunA" title="Sun Salutation A — Surya Namaskar A">
               <p className="mb-4 text-gray-400">
                Surya Namaskar A is a foundational sequence that builds heat, synchronizes breath and movement, and prepares the body for deeper postures. It is a complete practice in itself.
              </p>
              <ol className="space-y-4 ml-5">
                <li>
                  <strong>Mountain — Tadasana</strong>
                  <ul className="mt-1 ml-5 mb-2 space-y-1 list-disc">
                    <li>Ground through four corners of feet.</li>
                    <li>Lift kneecaps, lengthen tailbone.</li>
                    <li>Draw shoulders back and down; crown to sky.</li>
                     <li><strong>Cueing Tip:</strong> "Feel the four corners of your feet rooting down into the earth, with a sense of energy rising up through the crown of your head."</li>
                  </ul>
                </li>
                <li>
                  <strong>Extended Mountain — Urdhva Hastasana</strong>
                  <ul className="mt-1 ml-5 mb-2 space-y-1 list-disc">
                    <li>Arms overhead, palms face or touch.</li>
                    <li>Wrap triceps forward; soften ribs.</li>
                     <li><strong>Cueing Tip:</strong> "Inhale, sweep your arms wide and up. Soften your shoulders away from your ears, even as you reach."</li>
                  </ul>
                </li>
                <li>
                  <strong>Forward Fold — Uttanasana</strong>
                  <ul className="mt-1 ml-5 mb-2 space-y-1 list-disc">
                    <li>Hinge at hips, fold deeply.</li>
                    <li>Micro-bend knees; relax neck and jaw.</li>
                     <li><strong>Cueing Tip:</strong> "Exhale, hinge from your hips with a long spine. Lead with your heart."</li>
                  </ul>
                </li>
                <li>
                  <strong>Halfway Lift — Ardha Uttanasana</strong>
                  <ul className="mt-1 ml-5 mb-2 space-y-1 list-disc">
                    <li>Hands to shins or floor; spine long.</li>
                    <li>Draw navel to spine; extend crown forward.</li>
                     <li><strong>Cueing Tip:</strong> "Inhale, lengthen your spine to create a flat back. Gaze down to keep your neck long."</li>
                  </ul>
                </li>
                <li>
                  <strong>High to Low Plank — Chaturanga Dandasana</strong>
                  <ul className="mt-1 ml-5 mb-2 space-y-1 list-disc">
                    <li>Shoulders above wrists; core engaged.</li>
                    <li>Lower halfway with elbows hugging ribs.</li>
                     <li><strong>Cueing Tip:</strong> "Exhale, step back to high plank. Shift forward on your toes, then lower halfway down, keeping your elbows tucked in by your sides."</li>
                  </ul>
                </li>
                <li>
                  <strong>Upward Facing Dog — Urdhva Mukha Svanasana</strong>
                  <ul className="mt-1 ml-5 mb-2 space-y-1 list-disc">
                    <li>Press palms and tops of feet; thighs lifted.</li>
                    <li>Open chest; shoulders over wrists.</li>
                     <li><strong>Cueing Tip:</strong> "Inhale, pull your heart forward as you press into your hands and the tops of your feet. Lift your thighs off the mat."</li>
                  </ul>
                </li>
                <li>
                  <strong>Downward Facing Dog — Adho Mukha Svanasana</strong>
                  <ul className="mt-1 ml-5 mb-2 space-y-1 list-disc">
                    <li>Return to steady breath; hold 3–5 cycles.</li>
                     <li><strong>Cueing Tip:</strong> "Exhale, lift your hips up and back. Find your steady Ujjayi breath here for five full rounds."</li>
                  </ul>
                </li>
              </ol>
            </ManualSection>

            <ManualSection id="sunB" title="Sun Salutation B — Surya Namaskar B">
               <p className="mb-4 text-gray-400">
                Surya Namaskar B adds the powerful leg-strengthening poses of Utkatasana (Chair) and Virabhadrasana I (Warrior I) to the framework of Sun Salutation A. This sequence builds more heat and stamina.
              </p>
              <ol className="space-y-4 ml-5">
                <li>
                  <strong>Chair Pose — Utkatasana</strong>
                  <ul className="mt-1 ml-5 mb-2 space-y-1 list-disc">
                    <li>Feet together or hip-width; sit low.</li>
                    <li>Draw tailbone down, lift chest.</li>
                     <li><strong>Cueing Tip:</strong> "Inhale, sink your hips low as if sitting in a chair. Keep your chest lifted and your weight in your heels."</li>
                  </ul>
                </li>
                <li>Flow through <strong>Forward Fold / Halfway Lift / Chaturanga / Up Dog / Down Dog</strong>.</li>
                <li>
                  <strong>Warrior I — Virabhadrasana I (Right)</strong>
                  <ul className="mt-1 ml-5 mb-2 space-y-1 list-disc">
                    <li>Front knee over ankle; back heel roots down.</li>
                    <li>Square hips forward; reach arms overhead.</li>
                     <li><strong>Cueing Tip:</strong> "From Down Dog, step your right foot forward. Spin your back heel down. Inhale, rise up, squaring your hips to the front of the mat."</li>
                  </ul>
                </li>
                <li>Vinyasa back to Down Dog.</li>
                <li><strong>Warrior I — Virabhadrasana I (Left)</strong> → Vinyasa to Down Dog.</li>
              </ol>
               <div className="mt-6">
                <h4 className="font-semibold text-blue-300 mb-2">Case Study: Modifying Chaturanga for Wrist Pain</h4>
                <div className="text-sm text-gray-400 leading-relaxed">
                  A student named Ben experiences wrist pain every time he practices Chaturanga.
                  <ul className="list-disc ml-5 mt-2 space-y-1">
                    <li><strong>Teacher's Observation:</strong> The teacher notices Ben's shoulders are collapsing forward and his hands are turned slightly outward, putting pressure on the wrists.</li>
                    <li><strong>Verbal Cue:</strong> The teacher first offers a general cue to the class: "In your plank, press down through all ten fingers, especially the base of your thumb and index finger."</li>
                    <li><strong>Modification Offered:</strong> The teacher then says, "If you experience wrist sensitivity, an option is to lower your knees to the mat before you lower your chest and chin. This reduces the load on your arms and wrists."</li>
                    <li><strong>Result:</strong> Ben tries the modification. By lowering his knees, he can focus on keeping his elbows tucked in and his shoulders stable, building strength without pain. This allows him to continue participating in the flow of the class safely.</li>
                  </ul>
                </div>
              </div>
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