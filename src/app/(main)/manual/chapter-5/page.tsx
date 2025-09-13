'use client';

import React from 'react';
import { ManualLayout, ManualTOC, ManualSection } from '@/components/manual';

export default function Chapter5Page() {
  const breadcrumbs = [
    { label: '← Manual Index', href: '/manual' },
    { label: 'Chapter 5' }
  ];

  const tocItems = [
    { id: 'philosophy', title: 'Yoga Philosophy' },
    { id: 'eight-limbs', title: 'Eight Limbs of Yoga' },
    { id: 'modern-application', title: 'Modern Application' },
    { id: 'integration', title: 'Integration in Teaching' }
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
      title="Chapter 5 — Yoga Philosophy & Lifestyle" 
      breadcrumbs={breadcrumbs}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <ManualTOC 
            items={tocItems} 
            chapterNavigation={chapterNavigation}
          />
          
          <article>
            <ManualSection id="philosophy" title="Yoga Philosophy">
              <p className="mb-4 leading-relaxed">
                Yoga philosophy provides the foundation for understanding yoga as more than physical exercise. It offers a comprehensive framework for living with awareness, purpose, and connection.
              </p>
              <p className="mb-4 leading-relaxed">
                The word "yoga" comes from the Sanskrit root "yuj," meaning to unite or join. This union refers to the connection between individual consciousness and universal consciousness, or the integration of body, mind, and spirit.
              </p>
            </ManualSection>

            <ManualSection id="eight-limbs" title="Eight Limbs of Yoga (Ashtanga)">
              <p className="mb-4 leading-relaxed">
                Patanjali's eight-limbed path provides a comprehensive guide for yoga practice and ethical living. It's important to see these not as a linear progression, but as interwoven aspects of a holistic practice.
              </p>

              <h3 className="text-lg font-medium text-blue-400 mt-6 mb-3">The Yamas (Ethical Restraints)</h3>
              <p className="mb-4 text-gray-400">The Yamas guide our interactions with the world. They are not commandments, but invitations to practice.</p>
              <ul className="space-y-2 mb-4 ml-5 list-disc">
                  <li><strong>Ahimsa</strong> (Non-harming): This extends beyond physical violence to include our words, thoughts, and actions towards ourselves and others.
                    <p className="text-sm text-gray-400 mt-1"><strong>Class Theme Example:</strong> A class focused on Ahimsa might emphasize self-compassion, honoring the body's limits, and moving with kindness.</p>
                  </li>
                  <li><strong>Satya</strong> (Truthfulness): This means speaking and living our truth with compassion.
                     <p className="text-sm text-gray-400 mt-1"><strong>Class Theme Example:</strong> A class focused on Satya might explore poses that feel authentic and true to the student's body, rather than striving for an external shape.</p>
                  </li>
                  <li><strong>Asteya</strong> (Non-stealing): This includes not taking what is not freely given, including someone else's time, energy, or peace of mind.
                     <p className="text-sm text-gray-400 mt-1"><strong>Class Theme Example:</strong> A class focused on Asteya could be about being content with your own practice and not "stealing" glances at others to compare.</p>
                  </li>
                  <li><strong>Brahmacharya</strong> (Wise use of energy): Traditionally translated as celibacy, in modern yoga it is often interpreted as directing our energy wisely and avoiding excess.
                     <p className="text-sm text-gray-400 mt-1"><strong>Class Theme Example:</strong> A class focused on Brahmacharya might involve a slow, mindful flow, conserving energy and making every movement count.</p>
                  </li>
                  <li><strong>Aparigraha</strong> (Non-grasping): This is the practice of letting go of attachment to outcomes, possessions, and even identities.
                     <p className="text-sm text-gray-400 mt-1"><strong>Class Theme Example:</strong> A class focused on Aparigraha might end with a longer Savasana, practicing the art of letting go completely.</p>
                  </li>
              </ul>

              <h3 className="text-lg font-medium text-blue-400 mt-6 mb-3">The Niyamas (Observances)</h3>
              <p className="mb-4 text-gray-400">The Niyamas are a set of personal practices that cultivate a positive inner world.</p>
              <ul className="space-y-2 mb-4 ml-5 list-disc">
                  <li><strong>Shaucha</strong> (Purity/Clarity): This refers to the cleanliness of our bodies, minds, and environments.
                     <p className="text-sm text-gray-400 mt-1"><strong>Class Theme Example:</strong> A class focused on Shaucha might incorporate twisting poses, which are thought to have a cleansing effect on the internal organs.</p>
                  </li>
                  <li><strong>Santosha</strong> (Contentment): This is the practice of finding joy and gratitude for what is, right here and now.
                     <p className="text-sm text-gray-400 mt-1"><strong>Class Theme Example:</strong> A gratitude-themed class, where students are invited to bring to mind things they are thankful for during the practice.</p>
                  </li>
                  <li><strong>Tapas</strong> (Discipline): This is the inner fire that fuels our practice and helps us burn through obstacles.
                     <p className="text-sm text-gray-400 mt-1"><strong>Class Theme Example:</strong> A challenging class with a focus on holding poses for a longer duration, building heat and resilience.</p>
                  </li>
                  <li><strong>Svadhyaya</strong> (Self-study): This is the practice of self-inquiry, of turning our awareness inward to understand ourselves better.
                     <p className="text-sm text-gray-400 mt-1"><strong>Class Theme Example:</strong> A practice with periods of silence, allowing students to notice their own thoughts and patterns.</p>
                  </li>
                  <li><strong>Ishvara Pranidhana</strong> (Surrender): This means surrendering the fruits of our practice to something larger than ourselves, whether that is a deity, the universe, or our own highest self.
                     <p className="text-sm text-gray-400 mt-1"><strong>Class Theme Example:</strong> A class that ends with a dedication, where students are invited to offer the energy of their practice to someone or something.</p>
                  </li>
              </ul>

               <h3 className="text-lg font-medium text-blue-400 mt-6 mb-3">The Other Limbs</h3>
                <ol className="space-y-3 mb-4 ml-5 list-decimal" start="3">
                    <li><strong>Asana</strong>: Physical postures that prepare the body for meditation</li>
                    <li><strong>Pranayama</strong>: Breath control practices that regulate life force energy</li>
                    <li><strong>Pratyahara</strong>: Withdrawal of the senses from external distractions</li>
                    <li><strong>Dharana</strong>: Concentration on a single point or object</li>
                    <li><strong>Dhyana</strong>: Sustained meditation or contemplation</li>
                    <li><strong>Samadhi</strong>: Unity consciousness or enlightenment</li>
                </ol>
            </ManualSection>

            <ManualSection id="modern-application" title="Modern Application">
              <p className="mb-4 leading-relaxed">
                While rooted in ancient wisdom, yoga philosophy offers practical guidance for contemporary challenges. The key is to translate these concepts from abstract ideas into lived experiences.
              </p>
              <ul className="space-y-2 mb-4 ml-5 list-disc">
                <li><strong>Stress Management</strong>: Pranayama and meditation techniques for modern stress. A few minutes of conscious breathing can shift your state more effectively than many other methods.</li>
                <li><strong>Ethical Living</strong>: The yamas and niyamas as guidelines for conscious living in your relationships, work, and community.</li>
                <li><strong>Self-Awareness</strong>: Svadhyaya (self-study) as ongoing self-reflection and learning. This is the foundation of personal growth.</li>
                <li><strong>Non-attachment</strong>: Aparigraha as freedom from the anxiety of needing things to be a certain way.</li>
                <li><strong>Contentment</strong>: Santosha as finding joy and gratitude in what is present, rather than constantly seeking external validation or possessions.</li>
              </ul>
            </ManualSection>

            <ManualSection id="integration" title="Integration in Teaching">
              <p className="mb-4 leading-relaxed">
                As a yoga teacher, you have the opportunity to weave philosophical concepts into your classes in accessible, relevant ways. The goal is to make philosophy felt, not just heard.
              </p>
              <ul className="space-y-2 mb-4 ml-5 list-disc">
                <li><strong>Themes</strong>: Build classes around philosophical concepts. For example, a class on Satya (truthfulness) might focus on honoring the body's true limits, without pushing or forcing.</li>
                <li><strong>Language</strong>: Use inclusive, invitational language that honors diverse beliefs and backgrounds. Avoid jargon.</li>
                <li><strong>Practical Application</strong>: Connect ancient wisdom to everyday challenges. For example, "Can you apply the same patience you're cultivating in this hip opener to a difficult conversation you need to have?"</li>
                <li><strong>Personal Example</strong>: Embody the principles you teach. Your students will learn more from your presence and authenticity than from your words alone.</li>
              </ul>
              <div 
                className="rounded-lg p-4 my-4"
                style={{
                  background: '#141921',
                  borderLeft: '4px solid #6ea8fe',
                  color: '#d8e5ff'
                }}
              >
                Philosophy is not about preaching or converting. It's about offering tools for students to explore their own path to well-being and self-understanding.
              </div>
              <div className="mt-6">
                <h4 className="font-semibold text-blue-300 mb-2">Case Study: Applying Aparigraha Off the Mat</h4>
                 <p className="text-sm text-gray-400 leading-relaxed">
                  A student named Maria is frustrated because she is not making progress in her career as quickly as she would like. She is attached to a specific outcome and timeline.
                  <ul className="list-disc ml-5 mt-2 space-y-1">
                    <li><strong>The Practice:</strong> During a yoga class themed around Aparigraha (non-grasping), she is invited to let go of her attachment to achieving a "perfect" pose and to simply be with the process.</li>
                    <li><strong>The Insight:</strong> This on-the-mat practice gives her an insight. She realizes she has been "grasping" for a promotion in the same way she was grasping for a deeper forward fold.</li>
                    <li><strong>The Action:</strong> Maria decides to practice Aparigraha in her career. She continues to do her best work (Abhyasa), but she lets go of her attachment to a specific outcome (Vairagya). This shift in mindset reduces her stress and allows her to find more joy in her daily work, which ironically, leads to new opportunities.</li>
                  </ul>
                </p>
              </div>
               <div className="mt-6">
                <h4 className="font-semibold text-blue-300 mb-2">Reflection Prompts</h4>
                <ul className="list-disc ml-5 space-y-2 text-gray-300">
                    <li>Choose one Yama or Niyama to focus on this week. How can you practice it in small ways, both on and off your mat?</li>
                    <li>How can you theme a class around a philosophical concept without being preachy or dogmatic? Brainstorm a few ideas.</li>
                </ul>
              </div>
            </ManualSection>
          </article>
        </div>
        
        <footer className="mt-12 pt-6 border-t border-gray-600 text-gray-400">
          <p>© YogaFlow University — Chapter 5. For internal training use.</p>
        </footer>
      </div>
    </ManualLayout>
  );
}