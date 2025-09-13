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
                Your teaching voice is the unique expression of your personality, experience, and understanding of yoga. It is not something you invent, but something you uncover. It is grounded in authenticity, compassion, and a commitment to creating a safe and inclusive space for your students.
              </p>
              <h3 className="text-lg font-medium text-blue-400 mt-6 mb-3">Authentic Teaching</h3>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Be Yourself</strong>: Your students will connect with your genuine passion. Don't try to be the "perfect" yoga teacher you see on social media. Be you.</li>
                <li><strong>Share From Experience</strong>: Teach from what you know in your own body and your own life. This is far more powerful than reciting memorized scripts.</li>
                <li><strong>Stay Curious</strong>: A great teacher is always a student. Maintain a beginner's mind and a willingness to learn from your students, your peers, and your own continued practice.</li>
                <li><strong>Adapt to Your Students</strong>: Read the room. Notice the energy levels and abilities of your students and be willing to deviate from your plan to meet them where they are.</li>
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
                Clear, specific cueing helps students understand how to move safely and with awareness. The most effective cues are invitational, functional, and inclusive.
              </p>
              <h3 className="text-lg font-medium text-blue-400 mt-6 mb-3">Types of Cues</h3>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Invitational Language</strong>: Use words like "might," "could," "perhaps," "if it feels right for you." This turns your cues from commands into invitations. Instead of "Step your foot back," try "You might step your foot back."</li>
                <li><strong>Functional Cues</strong>: Cue the *function* of the pose, not the *form*. Instead of "Get your foot behind your head," try "The intention here is to externally rotate the hip. Where do you feel that happening?" This makes the pose accessible to every body.</li>
                <li><strong>Body-Neutral Language</strong>: Avoid language that praises certain bodies or abilities. Instead of "You have beautiful long hamstrings," try "I see you're finding a lot of space in that forward fold."</li>
                <li><strong>Breath Cues</strong>: Link every major movement to an inhale or an exhale to create a moving meditation.</li>
                <li><strong>Sensory Cues</strong>: Invite students to notice what they feel. "Can you feel the sensation of your feet rooting into the mat?" This cultivates interoception and mindfulness.</li>
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
                Teaching yoga carries a significant responsibility. Ethical teaching creates a foundation of safety and trust, allowing students to explore their practice with confidence and vulnerability.
              </p>
              <h3 className="text-lg font-medium text-blue-400 mt-6 mb-3">Core Ethical Principles</h3>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Do No Harm (Ahimsa)</strong>: Your primary responsibility is the physical and emotional safety of your students. This includes trauma-informed teaching practices.</li>
                <li><strong>Maintain Boundaries</strong>: Uphold a professional relationship with students. Avoid dual relationships that could compromise the integrity of the student-teacher dynamic.</li>
                <li><strong>Cultural Sensitivity</strong>: Honor the roots of yoga. Acknowledge its South Asian origins, use Sanskrit terms respectfully, and avoid cultural appropriation.</li>
                <li><strong>Inclusivity</strong>: Actively create a welcoming space for students of all body sizes, abilities, ages, races, genders, and backgrounds.</li>
                <li><strong>Stay in Your Scope</strong>: You are a yoga teacher, not a therapist, doctor, or nutritionist. Refer students to other professionals when their needs are outside your scope of practice.</li>
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
              <div className="mt-6">
                <h4 className="font-semibold text-blue-300 mb-2">Case Study: Navigating a Student's Trauma Response</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                  A teacher cues the class to come into Child's Pose. They notice one student, Maria, has curled into a tight ball, breathing rapidly.
                  <ul className="list-disc ml-5 mt-2 space-y-1">
                    <li><strong>Teacher's Action:</strong> The teacher approaches Maria quietly and speaks in a low, calm voice. "Maria, I notice you're in a different shape. Is there anything I can do to help you feel more comfortable?"</li>
                    <li><strong>The Response:</strong> Maria whispers that she feels trapped.</li>
                    <li><strong>The Solution:</strong> The teacher says, "Thank you for telling me. Would you like to try a version with your knees wide and your arms reaching forward? Or perhaps you'd prefer to lie on your back instead?" The teacher offers choices without making Maria feel singled out.</li>
                    <li><strong>The Outcome:</strong> The teacher has created a safe space for Maria to honor her needs, building trust and demonstrating the principles of trauma-informed teaching in action.</li>
                  </ul>
                </p>
              </div>
               <div className="mt-6">
                <h4 className="font-semibold text-blue-300 mb-2">Reflection Prompts</h4>
                <ul className="list-disc ml-5 space-y-2 text-gray-300">
                  <li>What are some of your own unconscious biases when it comes to yoga bodies or abilities? How can you work to unlearn them?</li>
                  <li>Review your own standard cueing for a pose like Warrior II. How could you make it more invitational and functional?</li>
                </ul>
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