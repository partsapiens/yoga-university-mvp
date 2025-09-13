'use client';

import React from 'react';
import { ManualLayout, ManualTOC, ManualSection, FigureCard } from '@/components/manual';
import PoseVideo from '@/components/PoseLibrary/PoseVideo';

export default function Chapter5Page() {
  const breadcrumbs = [
    { label: '← Manual Index', href: '/manual' },
    { label: 'Chapter 5' }
  ];

  const tocItems = [
    { id: 'philosophy', title: 'Yoga Beyond Asana' },
    { id: 'eight-limbs', title: 'The Eight-Limbed Path' },
    { id: 'yamas-niyamas', title: 'Yamas & Niyamas in Detail' },
    { id: 'integration', title: 'Weaving Philosophy into Class' }
  ];

  const chapterNavigation = {
    current: 'chapter-5',
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
      title="Chapter 5 — Yoga Philosophy & The Ethical Path"
      breadcrumbs={breadcrumbs}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <ManualTOC 
            items={tocItems} 
            chapterNavigation={chapterNavigation}
          />
          
          <article>
            <ManualSection id="philosophy" title="Yoga Beyond Asana">
              <PoseVideo url="https://youtu.be/Grndmv3Ocdc" title="Yoga Beyond Asana" className="mb-8" />
              <p className="mb-4 leading-relaxed text-lg">
                While asana (physical postures) is the most visible aspect of yoga in the modern world, it is only one piece of a vast and profound system of personal and spiritual development. Yoga philosophy provides the essential map and compass for this journey.
              </p>
              <p className="mb-4 leading-relaxed">
                The word "yoga" itself, from the Sanskrit root "yuj," means "to unite" or "to yoke." This refers to the integration of body, mind, and spirit, and the ultimate union of individual consciousness with universal consciousness. This chapter explores the foundational framework for this journey: the Eight Limbs of Yoga.
              </p>
            </ManualSection>

            <ManualSection id="eight-limbs" title="The Eight-Limbed Path (Ashtanga Yoga)">
              <p className="mb-4 leading-relaxed">
                As codified by the sage Patanjali in the Yoga Sutras, the Eight-Limbed Path offers a comprehensive guide to living a purposeful and meaningful life. It is a progressive path where each limb builds upon the previous one.
              </p>
              <ol className="space-y-4 mb-4 ml-5 list-decimal">
                <li><strong>Yamas</strong>: Ethical principles governing our relationship with the outer world.</li>
                <li><strong>Niyamas</strong>: Personal observances and practices for our inner world.</li>
                <li><strong>Asana</strong>: Physical postures, designed to prepare the body for stillness and meditation.</li>
                <li><strong>Pranayama</strong>: Breath regulation techniques to control and cultivate life-force energy (prana).</li>
                <li><strong>Pratyahara</strong>: The withdrawal of the senses, turning our attention inward.</li>
                <li><strong>Dharana</strong>: Focused concentration on a single point or object.</li>
                <li><strong>Dhyana</strong>: A state of meditative absorption, an unbroken flow of concentration.</li>
                <li><strong>Samadhi</strong>: The state of enlightenment or union, where the sense of individual self dissolves.</li>
              </ol>
            </ManualSection>

            <ManualSection id="yamas-niyamas" title="Yamas & Niyamas in Detail">
              <p className="mb-4 leading-relaxed">The Yamas and Niyamas are the ethical foundation of yoga. They are not rules, but rather invitations to observe our behavior and make conscious choices that lead to greater peace and harmony for ourselves and others.</p>

              <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-4">The 5 Yamas (Social Ethics)</h3>
              <ul className="space-y-3 mb-4 ml-4">
                  <li><strong>Ahimsa (Non-harming)</strong>: Compassion and kindness in thought, word, and deed towards all living things, including oneself.</li>
                  <li><strong>Satya (Truthfulness)</strong>: Speaking and living our truth with integrity and skill.</li>
                  <li><strong>Asteya (Non-stealing)</strong>: Not taking what is not freely given, including others' time and energy.</li>
                  <li><strong>Brahmacharya (Energy Moderation)</strong>: Directing our energy wisely, avoiding excess and depletion.</li>
                  <li><strong>Aparigraha (Non-possessiveness)</strong>: Cultivating generosity and letting go of the need to accumulate or hoard.</li>
              </ul>

              <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-4">The 5 Niyamas (Personal Practices)</h3>
              <ul className="space-y-3 mb-4 ml-4">
                  <li><strong>Saucha (Purity/Cleanliness)</strong>: Maintaining cleanliness of body, mind, and environment.</li>
                  <li><strong>Santosha (Contentment)</strong>: Finding joy and peace with what is, without needing external circumstances to change.</li>
                  <li><strong>Tapas (Discipline/Enthusiasm)</strong>: The inner fire that fuels our practice and helps us overcome obstacles.</li>
                  <li><strong>Svadhyaya (Self-study)</strong>: The practice of self-inquiry, reflection, and studying sacred texts.</li>
                  <li><strong>Ishvara Pranidhana (Surrender)</strong>: Trustfully dedicating our actions and their results to a higher power or the greater whole.</li>
              </ul>
              <div className="p-4 bg-blue-900/20 border-l-4 border-blue-400 rounded-r-lg my-6">
                <h4 className="font-semibold text-blue-300 mb-2">Reflection Prompt</h4>
                <p className="text-blue-200/90">
                  Choose one Yama or Niyama to focus on this week. How can you practice it on your yoga mat? How can you practice it in your daily life (at work, in relationships, in your thoughts)?
                </p>
              </div>
            </ManualSection>

            <ManualSection id="integration" title="Weaving Philosophy into Class">
              <p className="mb-4 leading-relaxed">
                Sharing yoga philosophy in a class setting should feel authentic, accessible, and invitational. The goal is not to lecture, but to offer a lens through which students can explore their own experience more deeply.
              </p>
              <ul className="space-y-3 mb-4 ml-5 list-disc">
                <li><strong>Thematic Teaching</strong>: Build a class around a philosophical concept. For example, a class on <em>Aparigraha</em> might focus on letting go of physical tension and mental expectations.</li>
                <li><strong>Embodied Language</strong>: Connect concepts to physical sensations. "Can you find a sense of <em>Santosha</em>, or contentment, in this pose, even with the intense sensation?"</li>
                <li><strong>Lead by Example</strong>: The most powerful way to teach philosophy is to embody it. Your presence, your kindness, and your integrity speak volumes.</li>
              </ul>

              <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-4">Practical Class Themes for Each Limb</h3>
              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <h5 className="font-semibold text-blue-300 mb-2">Ahimsa (Non-harming) Class Theme</h5>
                  <div className="text-sm space-y-2">
                    <p><strong>Opening:</strong> "Practice with kindness toward your body today"</p>
                    <p><strong>Poses:</strong> Gentle flows, supported poses, emphasis on modifications</p>
                    <p><strong>Language:</strong> "Honor what feels right" / "Be gentle with yourself"</p>
                    <p><strong>Closing:</strong> Loving-kindness meditation</p>
                  </div>
                </div>
                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <h5 className="font-semibold text-blue-300 mb-2">Tapas (Discipline) Class Theme</h5>
                  <div className="text-sm space-y-2">
                    <p><strong>Opening:</strong> "Finding strength and commitment in challenge"</p>
                    <p><strong>Poses:</strong> Challenging holds, core work, arm balances</p>
                    <p><strong>Language:</strong> "Stay with your breath in intensity" / "Find ease in effort"</p>
                    <p><strong>Closing:</strong> Reflection on inner strength</p>
                  </div>
                </div>
                <div className="p-4 bg-gray-900/50 border border-gray-600 rounded-lg">
                  <h5 className="font-semibold text-blue-300 mb-2">Aparigraha (Non-attachment) Class Theme</h5>
                  <div className="text-sm space-y-2">
                    <p><strong>Opening:</strong> "Let go of expectations about your practice today"</p>
                    <p><strong>Poses:</strong> Flow sequences, transitions, balance challenges</p>
                    <p><strong>Language:</strong> "Release and receive" / "Fall with grace"</p>
                    <p><strong>Closing:</strong> Practice letting go in Savasana</p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-4">Daily Life Integration Practices</h3>
              <div className="space-y-3 mb-6">
                <div className="p-3 bg-blue-900/20 border border-blue-600 rounded-lg">
                  <h5 className="font-semibold text-blue-300 text-sm">Yamas in Daily Life</h5>
                  <ul className="list-disc ml-5 space-y-1 text-xs">
                    <li><strong>Ahimsa:</strong> Notice when you speak harshly to yourself; practice self-compassion</li>
                    <li><strong>Satya:</strong> Speak only when necessary and speak truthfully; notice when you exaggerate</li>
                    <li><strong>Asteya:</strong> Arrive on time; give full attention when someone is speaking</li>
                    <li><strong>Brahmacharya:</strong> Notice where you waste energy; practice moderation in consumption</li>
                    <li><strong>Aparigraha:</strong> Practice gratitude; notice when you compare or grasp</li>
                  </ul>
                </div>
                <div className="p-3 bg-blue-900/20 border border-blue-600 rounded-lg">
                  <h5 className="font-semibold text-blue-300 text-sm">Niyamas in Daily Life</h5>
                  <ul className="list-disc ml-5 space-y-1 text-xs">
                    <li><strong>Saucha:</strong> Keep living/working space organized; choose nourishing foods</li>
                    <li><strong>Santosha:</strong> Find one thing to appreciate daily; practice acceptance</li>
                    <li><strong>Tapas:</strong> Commit to small daily practices; follow through on intentions</li>
                    <li><strong>Svadhyaya:</strong> Read inspiring texts; practice self-reflection</li>
                    <li><strong>Ishvara Pranidhana:</strong> Practice releasing control; dedicate actions to something greater</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg my-6">
                <h4 className="font-semibold text-teal-300 mb-2">Case Study: Theming a Class on Satya (Truthfulness)</h4>
                <p className="text-gray-300">
                  You could open class by inviting students to notice their "truth" today—their energy level, their physical sensations. The sequence could include heart-opening poses to encourage authentic expression and balancing poses that require honest self-assessment. The closing could be a reflection on speaking and living more truthfully off the mat.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-4">Philosophy for Different Student Needs</h3>
              <div className="space-y-3 mb-6">
                <div className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
                  <h5 className="font-semibold text-teal-300 text-sm">For Beginners</h5>
                  <p className="text-xs text-gray-300">Focus on Ahimsa (being kind to yourself) and Santosha (contentment with where you are). Keep concepts simple and embodied.</p>
                </div>
                <div className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
                  <h5 className="font-semibold text-teal-300 text-sm">For Experienced Practitioners</h5>
                  <p className="text-xs text-gray-300">Explore Tapas (discipline) and Svadhyaya (self-study). Challenge them to examine their motivations and attachments.</p>
                </div>
                <div className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
                  <h5 className="font-semibold text-teal-300 text-sm">For Those Facing Challenges</h5>
                  <p className="text-xs text-gray-300">Emphasize Ishvara Pranidhana (surrender) and Aparigraha (letting go). Offer philosophy as support, not another burden.</p>
                </div>
              </div>
            </ManualSection>
          </article>
        </div>
        
        <footer className="mt-12 pt-6 border-t border-gray-700 text-center text-gray-500">
          <p>© YogaFlow University — Chapter 5: Yoga Philosophy & The Ethical Path. For internal training use only.</p>
        </footer>
      </div>
    </ManualLayout>
  );
}