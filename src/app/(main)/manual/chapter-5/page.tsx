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
                Patanjali's eight-limbed path provides a comprehensive guide for yoga practice and ethical living:
              </p>
              <ol className="space-y-3 mb-4 ml-5 list-decimal">
                <li><strong>Yamas (Ethical Restraints)</strong>: Ahimsa (non-violence), Satya (truthfulness), Asteya (non-stealing), Brahmacharya (energy management), Aparigraha (non-possessiveness)</li>
                <li><strong>Niyamas (Observances)</strong>: Saucha (cleanliness), Santosha (contentment), Tapas (disciplined practice), Svadhyaya (self-study), Ishvara pranidhana (surrender)</li>
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
                While rooted in ancient wisdom, yoga philosophy offers practical guidance for contemporary challenges:
              </p>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Stress Management</strong>: Pranayama and meditation techniques for modern stress.</li>
                <li><strong>Ethical Living</strong>: The yamas and niyamas as guidelines for conscious living.</li>
                <li><strong>Self-Awareness</strong>: Svadhyaya as ongoing self-reflection and learning.</li>
                <li><strong>Non-attachment</strong>: Aparigraha as freedom from excessive materialism.</li>
                <li><strong>Contentment</strong>: Santosha as finding joy in what is present.</li>
              </ul>
            </ManualSection>

            <ManualSection id="integration" title="Integration in Teaching">
              <p className="mb-4 leading-relaxed">
                As a yoga teacher, you have the opportunity to weave philosophical concepts into your classes in accessible, relevant ways:
              </p>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Themes</strong>: Build classes around philosophical concepts like letting go, finding balance, or cultivating patience.</li>
                <li><strong>Language</strong>: Use inclusive language that honors diverse beliefs and backgrounds.</li>
                <li><strong>Practical Application</strong>: Connect ancient wisdom to everyday challenges students face.</li>
                <li><strong>Personal Example</strong>: Embody the principles you teach rather than just speaking about them.</li>
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