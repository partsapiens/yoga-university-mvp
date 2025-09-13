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

              <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-4">Specific Assist Techniques</h3>
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <h5 className="font-semibold text-blue-300 mb-2">Child's Pose — Grounding Assist</h5>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    <li>Place one hand on lower back/sacrum, one on upper back</li>
                    <li>Apply gentle, steady pressure encouraging surrender</li>
                    <li>Move hands slowly with their breath</li>
                    <li><strong>Cue:</strong> "Let yourself rest completely into the earth"</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <h5 className="font-semibold text-blue-300 mb-2">Downward Dog — Lengthening Assist</h5>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    <li>Stand behind student, hands on back of pelvis</li>
                    <li>Draw hips back and up while they press hands down</li>
                    <li>Create length through the spine, not depth</li>
                    <li><strong>Cue:</strong> "Press the ground away as I draw your hips back"</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <h5 className="font-semibold text-blue-300 mb-2">Seated Forward Fold — Supportive Assist</h5>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    <li>Sit behind student, place hands on back ribs</li>
                    <li>Encourage length on inhale, gentle forward fold on exhale</li>
                    <li>Never push student deeper than they can go with breath</li>
                    <li><strong>Cue:</strong> "Breathe into my hands, then fold from your heart"</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <h5 className="font-semibold text-blue-300 mb-2">Triangle Pose — Opening Assist</h5>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    <li>Stand behind student, one hand on sacrum for grounding</li>
                    <li>Other hand guides top shoulder back and up</li>
                    <li>Create space rather than depth</li>
                    <li><strong>Cue:</strong> "Root down through your legs as your heart opens"</li>
                  </ul>
                </div>
              </div>

               <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg my-6">
                <h4 className="font-semibold text-teal-300 mb-2">Class Example: Assisting in Triangle Pose (Trikonasana)</h4>
                <p className="text-gray-300">
                  Instead of pushing a student deeper, stand behind them and place one hand on their sacrum, encouraging length. Use your other hand to gently guide their top shoulder open, creating space in the chest. Cue: "Imagine your spine growing longer as you breathe in."
                </p>
              </div>

              <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-4">Essential Safety Guidelines for Physical Assists</h3>
              <div className="space-y-3 mb-6">
                <div className="p-3 bg-red-900/20 border border-red-600 rounded-lg">
                  <h5 className="font-semibold text-red-300 text-sm">Body Mechanics for Teachers</h5>
                  <ul className="list-disc ml-5 space-y-1 text-xs">
                    <li>Keep your own spine long and stable</li>
                    <li>Use your legs and core, not just your arms</li>
                    <li>Move slowly and mindfully</li>
                    <li>Breathe continuously - if you hold your breath, you're trying too hard</li>
                  </ul>
                </div>
                <div className="p-3 bg-yellow-900/20 border border-yellow-600 rounded-lg">
                  <h5 className="font-semibold text-yellow-300 text-sm">Areas to Avoid</h5>
                  <ul className="list-disc ml-5 space-y-1 text-xs">
                    <li>Lower back (below the waist) - use sacrum instead</li>
                    <li>Neck and head - too vulnerable</li>
                    <li>Front of torso - intimate and can restrict breathing</li>
                    <li>Any area the student indicates is sensitive or injured</li>
                  </ul>
                </div>
              </div>
            </ManualSection>

            <ManualSection id="props" title="Using Props to Empower">
              <p className="mb-4 leading-relaxed">
                Props are not crutches; they are tools of empowerment and exploration. They make poses more accessible, sustainable, and educational. As a teacher, it is your job to destigmatize prop use and champion it as a sign of intelligent practice.
              </p>
              <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-4">Creative & Effective Prop Use</h3>
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <h5 className="font-semibold text-blue-300 mb-2">Blocks — Beyond Just Height</h5>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    <li><strong>Between Thighs:</strong> Squeeze to activate inner legs in poses like Bridge or Chair</li>
                    <li><strong>Under Sacrum:</strong> Support in seated poses for better spinal alignment</li>
                    <li><strong>Against Wall:</strong> Practice arm balances safely</li>
                    <li><strong>Under Hands:</strong> Bring the floor closer in forward folds</li>
                    <li><strong>Between Shoulder Blades:</strong> Gentle heart opening in restorative poses</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <h5 className="font-semibold text-blue-300 mb-2">Straps — Connection & Freedom</h5>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    <li><strong>Shoulder Mobility:</strong> Hold strap wide, pass behind back for gentle traction</li>
                    <li><strong>Seated Forward Folds:</strong> Loop around feet to maintain straight spine</li>
                    <li><strong>Binds:</strong> Reach for strap instead of straining to clasp hands</li>
                    <li><strong>Leg Extensions:</strong> Support hamstring stretches lying down</li>
                    <li><strong>Gentle Traction:</strong> Partner assists using strap for safety</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <h5 className="font-semibold text-blue-300 mb-2">Bolsters — Ultimate Support</h5>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    <li><strong>Heart Opening:</strong> Lengthwise under spine for gentle backbends</li>
                    <li><strong>Hip Elevation:</strong> Under hips in seated poses and meditation</li>
                    <li><strong>Restorative Twists:</strong> Hug bolster in twisted position</li>
                    <li><strong>Supported Child's Pose:</strong> Between legs for comfort</li>
                    <li><strong>Pregnancy Modifications:</strong> Support belly in side-lying poses</li>
                  </ul>
                </div>
                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <h5 className="font-semibold text-blue-300 mb-2">Blankets — Versatile Comfort</h5>
                  <ul className="list-disc ml-5 space-y-1 text-sm">
                    <li><strong>Joint Padding:</strong> Fold under knees, hips, or wrists</li>
                    <li><strong>Hip Elevation:</strong> Multiple folds create stable seat</li>
                    <li><strong>Warmth:</strong> Essential for longer holds and relaxation</li>
                    <li><strong>Weight:</strong> Across body in Savasana for grounding</li>
                    <li><strong>Eye Pillow Alternative:</strong> Fold over eyes for darkness</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-4">Prop Combinations for Common Challenges</h3>
              <div className="space-y-3 mb-6">
                <div className="p-3 bg-blue-900/20 border border-blue-600 rounded-lg">
                  <h5 className="font-semibold text-blue-300 text-sm">Tight Hamstrings in Seated Forward Fold</h5>
                  <p className="text-xs text-gray-300"><strong>Setup:</strong> Blanket under hips + strap around feet + blocks under knees if needed</p>
                </div>
                <div className="p-3 bg-blue-900/20 border border-blue-600 rounded-lg">
                  <h5 className="font-semibold text-blue-300 text-sm">Wrist Pain in Downward Dog</h5>
                  <p className="text-xs text-gray-300"><strong>Setup:</strong> Forearms on blocks + blanket under forearms for comfort</p>
                </div>
                <div className="p-3 bg-blue-900/20 border border-blue-600 rounded-lg">
                  <h5 className="font-semibold text-blue-300 text-sm">Difficulty in Meditation Seat</h5>
                  <p className="text-xs text-gray-300"><strong>Setup:</strong> Bolster + blanket on top + blocks under knees for support</p>
                </div>
              </div>

              <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg my-6">
                <h4 className="font-semibold text-teal-300 mb-2">Teaching Tip: Introducing Props Without Stigma</h4>
                <p className="text-gray-300 mb-2">
                  <strong>Instead of:</strong> "If you need help, take a block"
                </p>
                <p className="text-gray-300">
                  <strong>Try:</strong> "Let's all explore this pose with blocks today. They help us find proper alignment and allow us to hold poses longer."
                </p>
              </div>
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

            <ManualSection id="contraindications" title="Common Contraindications & Modifications">
              <p className="mb-4 leading-relaxed">
                A key part of "do no harm" is understanding when a pose might be inappropriate for a student. While you are not a medical professional, having a working knowledge of common contraindications is essential for creating safe, inclusive classes.
              </p>

              <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-4">Common Conditions & Safe Modifications</h3>
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <h5 className="font-semibold text-red-300 mb-2">High Blood Pressure (Hypertension)</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="font-semibold text-yellow-300 mb-1">Avoid:</p>
                      <ul className="list-disc ml-5 text-xs space-y-1">
                        <li>Full inversions (headstand, shoulderstand)</li>
                        <li>Holding arms overhead for long periods</li>
                        <li>Hot, vigorous sequences</li>
                        <li>Breath retention (kumbhaka)</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-green-300 mb-1">Offer Instead:</p>
                      <ul className="list-disc ml-5 text-xs space-y-1">
                        <li>Gentle forward folds</li>
                        <li>Legs up the wall</li>
                        <li>Restorative poses</li>
                        <li>Natural breath rhythm</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <h5 className="font-semibold text-red-300 mb-2">Pregnancy (All Trimesters)</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="font-semibold text-yellow-300 mb-1">Avoid:</p>
                      <ul className="list-disc ml-5 text-xs space-y-1">
                        <li>Deep closed twists</li>
                        <li>Prone (belly-down) positions</li>
                        <li>Intense core work</li>
                        <li>Hot environments</li>
                        <li>Jumping transitions</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-green-300 mb-1">Emphasize:</p>
                      <ul className="list-disc ml-5 text-xs space-y-1">
                        <li>Open twists (away from belly)</li>
                        <li>Stable, grounded poses</li>
                        <li>Pelvic floor awareness</li>
                        <li>Side-lying options</li>
                        <li>Step transitions</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <h5 className="font-semibold text-red-300 mb-2">Lower Back Issues / Sciatica</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="font-semibold text-yellow-300 mb-1">Modify Carefully:</p>
                      <ul className="list-disc ml-5 text-xs space-y-1">
                        <li>Deep forward folds</li>
                        <li>Seated twists</li>
                        <li>Deep backbends</li>
                        <li>Poses with rounded spine</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-green-300 mb-1">Prioritize:</p>
                      <ul className="list-disc ml-5 text-xs space-y-1">
                        <li>Long spine in all poses</li>
                        <li>Bent knees in forward folds</li>
                        <li>Gentle, supported backbends</li>
                        <li>Hip flexor stretches</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <h5 className="font-semibold text-red-300 mb-2">Wrist / Shoulder Injuries</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="font-semibold text-yellow-300 mb-1">Avoid/Modify:</p>
                      <ul className="list-disc ml-5 text-xs space-y-1">
                        <li>Full weight on wrists (Plank, Chaturanga)</li>
                        <li>Arm balances</li>
                        <li>Full range overhead movement</li>
                        <li>Aggressive weight bearing</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-green-300 mb-1">Offer Instead:</p>
                      <ul className="list-disc ml-5 text-xs space-y-1">
                        <li>Forearm variations</li>
                        <li>Fists instead of flat palms</li>
                        <li>Table top holds</li>
                        <li>Supported poses with blocks</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <h5 className="font-semibold text-red-300 mb-2">Neck Issues / Cervical Problems</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="font-semibold text-yellow-300 mb-1">Avoid:</p>
                      <ul className="list-disc ml-5 text-xs space-y-1">
                        <li>Weight bearing on neck</li>
                        <li>Extreme neck rotation</li>
                        <li>Unsupported Shoulderstand</li>
                        <li>Fish pose variations</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-green-300 mb-1">Keep Neutral:</p>
                      <ul className="list-disc ml-5 text-xs space-y-1">
                        <li>Natural cervical curve</li>
                        <li>Legs up wall instead of inversions</li>
                        <li>Supported heart openers</li>
                        <li>Gentle neck stretches</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-900/20 border-l-4 border-yellow-400 rounded-r-lg my-6">
                <h4 className="font-semibold text-yellow-300 mb-2">The Golden Rules of Safety</h4>
                <ul className="list-disc ml-5 space-y-1 text-yellow-200/90 text-sm">
                  <li><strong>When in doubt, leave it out</strong> — Better to be conservative than cause harm</li>
                  <li><strong>Always offer alternatives</strong> — Every student should have a way to participate</li>
                  <li><strong>Encourage medical guidance</strong> — Remind students to follow their doctor's advice</li>
                  <li><strong>Create space for self-advocacy</strong> — Students know their bodies best</li>
                  <li><strong>Document and communicate</strong> — Note any specific needs for future classes</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-4">Creating an Inclusive Class Environment</h3>
              <div className="space-y-3 mb-6">
                <div className="p-3 bg-blue-900/20 border border-blue-600 rounded-lg">
                  <h5 className="font-semibold text-blue-300 text-sm">Pre-Class Check-in</h5>
                  <p className="text-xs text-gray-300">Ask students if they have any injuries or areas they'd like you to be mindful of. Make this normal, not exceptional.</p>
                </div>
                <div className="p-3 bg-blue-900/20 border border-blue-600 rounded-lg">
                  <h5 className="font-semibold text-blue-300 text-sm">Inclusive Language</h5>
                  <p className="text-xs text-gray-300">"If this doesn't serve your body today..." / "Honor what feels right for you..." / "Take the variation that calls to you..."</p>
                </div>
                <div className="p-3 bg-blue-900/20 border border-blue-600 rounded-lg">
                  <h5 className="font-semibold text-blue-300 text-sm">Multiple Options Always</h5>
                  <p className="text-xs text-gray-300">Present modifications as equally valid choices, not consolation prizes.</p>
                </div>
              </div>

              <p className="mt-6 font-semibold text-teal-300 text-center">Remember: Your role is to guide safely, not to cure or diagnose. When students feel seen, supported, and safe, the healing happens naturally.</p>
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