'use client';

import React from 'react';
import { ManualLayout, ManualTOC, ManualSection } from '@/components/manual';

export default function Chapter7Page() {
  const breadcrumbs = [
    { label: '← Manual Index', href: '/manual' },
    { label: 'Chapter 7' }
  ];

  const tocItems = [
    { id: 'teaching-voice', title: 'Finding Your Teaching Voice' },
    { id: 'class-structure', title: 'Class Structure & Sequencing' },
    { id: 'cueing', title: 'Effective Cueing' },
    { id: 'business', title: 'Business & Professional Development' },
    { id: 'ethics', title: 'Professional Ethics' }
  ];

  const chapterNavigation = {
    current: 'chapter-7',
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
      title="Chapter 7 — Teaching Skills & Professional Development" 
      breadcrumbs={breadcrumbs}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <ManualTOC 
            items={tocItems} 
            chapterNavigation={chapterNavigation}
          />
          
          <article>
            <ManualSection id="teaching-voice" title="Finding Your Teaching Voice">
              <p className="mb-4 leading-relaxed">
                Your teaching voice is the unique expression of your personality, experience, and understanding of yoga. It develops over time through practice, reflection, and authentic connection with your students.
              </p>
              <h3 className="text-lg font-medium text-blue-400 mt-6 mb-3">Authentic Teaching</h3>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Be Yourself</strong>: Don't try to imitate other teachers; find your own authentic expression.</li>
                <li><strong>Share From Experience</strong>: Teach what you know and practice, not just what you've learned.</li>
                <li><strong>Stay Curious</strong>: Maintain beginner's mind and continue learning.</li>
                <li><strong>Adapt to Your Students</strong>: Read the room and adjust your energy and approach accordingly.</li>
              </ul>
            </ManualSection>

            <ManualSection id="class-structure" title="Class Structure & Sequencing">
              <p className="mb-4 leading-relaxed">
                Well-structured classes create a safe container for practice and help students move through different energetic states with intention.
              </p>
              <h3 className="text-lg font-medium text-blue-400 mt-6 mb-3">Basic Class Arc</h3>
              <ol className="space-y-2 mb-4 ml-5 list-decimal">
                <li><strong>Opening/Centering</strong>: Create presence and intention (5-10 minutes)</li>
                <li><strong>Warm-up</strong>: Awaken the body and breath (10-15 minutes)</li>
                <li><strong>Standing Poses</strong>: Build heat and strength (15-20 minutes)</li>
                <li><strong>Peak/Main Practice</strong>: Focus poses or sequences (10-15 minutes)</li>
                <li><strong>Seated/Floor</strong>: Cool down and release (10-15 minutes)</li>
                <li><strong>Relaxation</strong>: Integration and rest (5-10 minutes)</li>
              </ol>
            </ManualSection>

            <ManualSection id="cueing" title="Effective Cueing">
              <p className="mb-4 leading-relaxed">
                Clear, specific cueing helps students understand how to move safely and with awareness. Effective cues are layered, offering both physical instruction and deeper invitation.
              </p>
              <h3 className="text-lg font-medium text-blue-400 mt-6 mb-3">Types of Cues</h3>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Alignment Cues</strong>: Specific instructions for safe, effective positioning.</li>
                <li><strong>Action Cues</strong>: What to do with different parts of the body.</li>
                <li><strong>Breath Cues</strong>: When and how to breathe with movement.</li>
                <li><strong>Sensory Cues</strong>: What to notice or feel in the pose.</li>
                <li><strong>Metaphorical Cues</strong>: Images that help students understand the feeling or energy.</li>
              </ul>
            </ManualSection>

            <ManualSection id="business" title="Business & Professional Development">
              <p className="mb-4 leading-relaxed">
                If you choose to teach professionally, understanding the business aspects of yoga instruction will help you create a sustainable and fulfilling career.
              </p>
              <h3 className="text-lg font-medium text-blue-400 mt-6 mb-3">Getting Started</h3>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Insurance</strong>: Obtain liability insurance through yoga organizations.</li>
                <li><strong>Certification</strong>: Complete your training and consider ongoing education.</li>
                <li><strong>Teaching Opportunities</strong>: Start with studios, community centers, or private clients.</li>
                <li><strong>Marketing</strong>: Create simple, authentic ways to share your offerings.</li>
                <li><strong>Continuing Education</strong>: Commit to ongoing learning and development.</li>
              </ul>
            </ManualSection>

            <ManualSection id="ethics" title="Professional Ethics">
              <p className="mb-4 leading-relaxed">
                Teaching yoga carries responsibility. Ethical teaching creates safety and trust, allowing students to explore their practice with confidence.
              </p>
              <h3 className="text-lg font-medium text-blue-400 mt-6 mb-3">Core Ethical Principles</h3>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Do No Harm</strong>: Physical and emotional safety are paramount.</li>
                <li><strong>Maintain Boundaries</strong>: Clear professional boundaries protect both teacher and student.</li>
                <li><strong>Cultural Sensitivity</strong>: Honor yoga's roots while making it accessible.</li>
                <li><strong>Inclusive Teaching</strong>: Create welcoming spaces for all bodies and backgrounds.</li>
                <li><strong>Ongoing Learning</strong>: Stay humble and continue growing as a teacher and student.</li>
              </ul>
              <div 
                className="rounded-lg p-4 my-4"
                style={{
                  background: '#141921',
                  borderLeft: '4px solid #6ea8fe',
                  color: '#d8e5ff'
                }}
              >
                Remember: You are holding space for others' journeys of growth and healing. This is both a privilege and a responsibility that should be honored with integrity and care.
              </div>
            </ManualSection>
          </article>
        </div>
        
        <footer className="mt-12 pt-6 border-t border-gray-600 text-gray-400">
          <p>© YogaFlow University — Chapter 7. For internal training use.</p>
        </footer>
      </div>
    </ManualLayout>
  );
}