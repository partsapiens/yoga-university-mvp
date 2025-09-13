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
                While asana (the physical postures) is often the most visible and accessible aspect of yoga in the modern world, it is only one branch of a vast and profound system of personal and spiritual development. Yoga philosophy provides the essential "why" behind the "what" we do on the mat; it is the map and compass for the entire journey of self-realization.
              </p>
              <p className="mb-4 leading-relaxed">
                The word "yoga" itself, from the ancient Sanskrit root "yuj," means "to unite," "to yoke," or "to bring into disciplined connection." This refers to the integration of body, mind, and spirit, and ultimately, the dissolution of the illusion of separation between individual consciousness and universal consciousness. This chapter explores the foundational framework for this journey as laid out by the sage Patanjali: the Eight Limbs of Yoga.
              </p>
            </ManualSection>

            <ManualSection id="eight-limbs" title="The Eight-Limbed Path (Ashtanga Yoga)">
              <p className="mb-4 leading-relaxed">
                As codified by the sage Patanjali in the Yoga Sutras—the foundational text on yoga philosophy—the Eight-Limbed Path (Ashtanga Yoga) offers a comprehensive, step-by-step guide to living a purposeful and meaningful life. It is a progressive path where each limb builds upon and informs the previous one, leading from the gross to the subtle, from the external to the internal.
              </p>
              <ol className="space-y-4 mb-4 ml-5 list-decimal">
                <li><strong>Yamas</strong>: The five essential ethical principles governing our relationship with the outer world and others. This is the foundation of our practice.</li>
                <li><strong>Niyamas</strong>: The five personal observances and practices that cultivate a positive relationship with our inner world.</li>
                <li><strong>Asana</strong>: The physical postures, designed to purify the body, cultivate discipline, and prepare the body-mind for the stillness required for meditation.</li>
                <li><strong>Pranayama</strong>: Breath regulation and expansion techniques used to control and cultivate our life-force energy (prana), directly influencing our mental state.</li>
                <li><strong>Pratyahara</strong>: The conscious and voluntary withdrawal of the senses from external stimuli, turning our attention inward to observe the mind.</li>
                <li><strong>Dharana</strong>: The practice of focused, single-pointed concentration on a single object, such as the breath, a mantra, or a candle flame.</li>
                <li><strong>Dhyana</strong>: A state of meditative absorption, an unbroken, effortless flow of concentration where the distinction between observer and observed begins to blur.</li>
                <li><strong>Samadhi</strong>: The ultimate state of enlightenment or pure consciousness, where the sense of the individual self dissolves into a state of blissful union with the whole.</li>
              </ol>
            </ManualSection>

            <ManualSection id="yamas-niyamas" title="Yamas & Niyamas: The Ethical Compass">
              <p className="mb-4 leading-relaxed">The Yamas and Niyamas are the essential ethical foundation of the entire practice of yoga. They are not rigid rules or commandments, but rather intelligent and compassionate invitations to observe our behavior and make conscious choices that lead to greater peace and harmony for ourselves and all other beings.</p>

              <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-4">The 5 Yamas (Our Relationship with the World)</h3>
              <ul className="space-y-4 mb-4 ml-4">
                  <li><strong>Ahimsa (Non-harming)</strong>: The practice of compassion and kindness in thought, word, and deed towards all living things, most especially oneself. On the mat, this means honoring your body's limits.</li>
                  <li><strong>Satya (Truthfulness)</strong>: Speaking and living our truth with integrity, skill, and compassion. This isn't about brutal honesty, but authentic and kind communication.</li>
                  <li><strong>Asteya (Non-stealing)</strong>: Not taking what is not freely and intentionally given. This extends beyond material objects to include others' time, energy, and ideas.</li>
                  <li><strong>Brahmacharya (Wise Use of Energy)</strong>: Traditionally meaning celibacy, this is more broadly interpreted as directing our vital energy wisely, avoiding excess and depletion in all areas of life (work, relationships, sensory input).</li>
                  <li><strong>Aparigraha (Non-possessiveness/Non-grasping)</strong>: Cultivating generosity and letting go of the need to accumulate, hoard, or cling to outcomes, ideas, or possessions. It is the practice of abundance.</li>
              </ul>

              <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-4">The 5 Niyamas (Our Relationship with Ourselves)</h3>
              <ul className="space-y-4 mb-4 ml-4">
                  <li><strong>Saucha (Purity/Cleanliness)</strong>: Maintaining cleanliness of the physical body, as well as purity of mind by choosing carefully what we consume through our senses (food, media, company).</li>
                  <li><strong>Santosha (Contentment)</strong>: The practice of finding joy and peace with what *is*, right now, without needing external circumstances or people to change. It is a radical acceptance of the present moment.</li>
                  <li><strong>Tapas (Discipline/Enthusiastic Effort)</strong>: The inner fire, zeal, and determination that fuels our practice, purifies our habits, and helps us overcome obstacles with courage.</li>
                  <li><strong>Svadhyaya (Self-study/Self-inquiry)</strong>: The practice of deep self-inquiry, reflection, and the study of sacred texts and wisdom traditions to better understand our own nature.</li>
                  <li><strong>Ishvara Pranidhana (Surrender/Devotion)</strong>: Trustfully dedicating our actions, efforts, and their results to a higher power, the universe, or the greater whole, releasing the ego's need to control everything.</li>
              </ul>
              <div className="p-4 bg-blue-900/20 border-l-4 border-blue-400 rounded-r-lg my-6">
                <h4 className="font-semibold text-blue-300 mb-2">Reflection & Inquiry Prompt</h4>
                <p className="text-blue-200/90">
                  Choose one Yama or Niyama that feels particularly resonant or challenging for you this week. How can you practice it on your yoga mat (e.g., Aparigraha by not forcing a pose)? How can you practice it in your daily life (e.g., practicing Satya in a difficult conversation)? Journal your observations.
                </p>
              </div>
            </ManualSection>

            <ManualSection id="integration" title="Weaving Philosophy into the Fabric of a Class">
              <p className="mb-4 leading-relaxed">
                Sharing yoga philosophy in a public class setting should always feel authentic, accessible, and invitational, never dogmatic or preachy. The goal is not to lecture, but to skillfully offer a lens through which students can explore their own direct experience more deeply and meaningfully.
              </p>
              <ul className="space-y-4 mb-4 ml-5 list-disc">
                <li><strong>Authentic Thematic Teaching</strong>: Build a class around a philosophical concept that is alive in your own life. For example, a class on <em>Aparigraha</em> (non-grasping) might focus on letting go of physical tension, mental expectations, and comparison to others.</li>
                <li><strong>Embodied and Experiential Language</strong>: Connect abstract concepts to tangible physical sensations. Instead of just talking about contentment, ask: "Can you find a sense of <em>Santosha</em>, or radical acceptance, for the sensations in your right hip, exactly as they are?"</li>
                <li><strong>Questioning as a Tool for Inquiry</strong>: Pose open-ended questions that guide students toward their own insights. "As you hold this pose, what does it mean to be truthful (Satya) with your own limits?"</li>
                <li><strong>Lead by Example (Embodiment is Key)</strong>: The most powerful and effective way to teach yoga philosophy is to embody it. Your presence, your kindness, your patience, your integrity, and your own genuine practice will speak volumes more than any lecture.</li>
              </ul>
              <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg my-6">
                <h4 className="font-semibold text-teal-300 mb-2">Case Study: Theming a Class on Satya (Truthfulness)</h4>
                <p className="text-gray-300">
                  You could open class by inviting students to notice and honor their "truth" today—their energy level, their physical sensations, their emotional state. The asana sequence could include powerful heart-opening poses to encourage authentic expression, and challenging balancing poses that require honest self-assessment and stability. The closing could be a reflection on how we can speak and live more truthfully and kindly in our lives off the mat.
                </p>
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