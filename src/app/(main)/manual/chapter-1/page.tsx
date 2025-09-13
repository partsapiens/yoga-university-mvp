'use client';

import React from 'react';
import { ManualLayout, ManualTOC, ManualSection, FigureCard } from '@/components/manual';
import PoseVideo from '@/components/PoseLibrary/PoseVideo';

export default function Chapter1Page() {
  const breadcrumbs = [
    { label: '← Manual Index', href: '/manual' },
    { label: 'Chapter 1' }
  ];

  const tocItems = [
    { id: 'welcome', title: 'Welcome to the Journey' },
    { id: 'commitments', title: 'Our Mutual Commitments' },
    { id: 'intention', title: 'Training Intention & Methodology' },
    { id: 'setup', title: 'Setting Up for Success' },
    { id: 'journals', title: 'The Power of Self-Reflection' },
    { id: 'reading', title: 'Further Reading & Resources' }
  ];

  const chapterNavigation = {
    current: 'chapter-1',
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
      title="Chapter 1 — Welcome & Program Overview" 
      breadcrumbs={breadcrumbs}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <ManualTOC 
            items={tocItems} 
            chapterNavigation={chapterNavigation}
          />
          
          <article>
            <ManualSection id="welcome" title="Welcome to the Journey">
              <PoseVideo url="https://youtu.be/NTVE5KBuHpU" title="Welcome to the Journey" className="mb-8" />
              <p className="mb-4 leading-relaxed text-lg">
                Welcome to your YogaFlow Teacher Training—a transformative path of self-discovery, dedicated practice, and the art of guiding others. This manual is more than a textbook; it's your field guide, your reflective journal, and a companion for the journey ahead. We encourage you to engage with it fully: write in the margins, highlight what resonates, journal on its prompts, and let its pages spark the questions and insights that will shape your unique teaching voice.
              </p>
              <p className="mb-4 leading-relaxed">
                You are now an integral part of the YogaFlow teaching community, a global network of passionate practitioners and teachers dedicated to elevating the practice. We are thrilled to support your evolution as both a student and a future leader in the world of yoga. Your unique perspective is a valuable addition to our collective wisdom.
              </p>
              <div className="p-4 bg-blue-900/20 border-l-4 border-blue-400 rounded-r-lg my-6">
                <h4 className="font-semibold text-blue-300 mb-2">A Journey, Not a Destination</h4>
                <p className="text-blue-200/90">
                  This training is designed to be an immersive, holistic experience. The skills, philosophies, and self-awareness you cultivate will extend far beyond the yoga mat, influencing how you connect with yourself, interact with others, and navigate the complexities of daily life. Embrace the entire process—the challenges, the breakthroughs, the moments of quiet understanding—with an open heart and a relentlessly curious mind.
                </p>
              </div>
            </ManualSection>

            <ManualSection id="commitments" title="Our Mutual Commitments">
              <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-4">Our Commitment to You</h3>
              <p className="mb-4 leading-relaxed">
                YogaFlow is dedicated to providing an exceptional, practical, and deeply integrated teacher-training program that meets and exceeds the rigorous standards of Yoga Alliance. Our goal is not just certification, but true transformation. Upon successful completion, you will be a certified yoga teacher, equipped with the skills, confidence, and anatomical knowledge to lead safe, effective, creatively sequenced, and genuinely inspiring classes.
              </p>
              
              <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-4">Your Commitment to the Practice</h3>
              <p className="mb-4">The following principles, drawn from the Yamas and Niyamas of yogic philosophy, form the ethical and practical foundation of our shared journey. We invite you to embrace them not as rules, but as powerful tools for personal and collective growth.</p>
              <ul className="space-y-4 mb-4 ml-5">
                <li><strong>Svādhyāya (Self-Study)</strong>: Commit to a rigorous and honest exploration of your own body, breath, habits, and mind. Authentic teaching arises not from memorized scripts, but from deep, personal inquiry. This is the source of your unique voice.</li>
                <li><strong>Aparigraha (Non-Attachment / Non-Grasping)</strong>: Be open to new ideas, unexpected physical and emotional challenges, and your own personal evolution. Release preconceived notions of what this journey "should" be. This includes letting go of the "perfect" pose to discover the perfect pose for *this* moment.</li>
                <li><strong>Tapas (Discipline / Enthusiastic Effort)</strong>: Consistently and intelligently challenge yourself, both physically and mentally. This inner fire, or *tapas*, purifies the body and mind, burning away self-doubt and strengthening your resolve and focus.</li>
                <li><strong>Satya & Ahimsā (Truthfulness & Non-Harming)</strong>: Interact with your peers, instructors, and yourself with unwavering integrity and kindness. Offer and receive feedback that is both honest and compassionate. This means speaking your truth while always considering the impact of your words.</li>
                <li><strong>Śaucha, Santosha, Brahmacharya (Purity, Contentment, Wise Use of Energy)</strong>: Maintain a balanced approach to your life and practice. Take care of your energy as a precious resource, find joy and contentment in the process rather than striving for a future goal, and practice moderation in all things to sustain your vitality.</li>
              </ul>
            </ManualSection>

            <ManualSection id="intention" title="Training Intention & Methodology">
              <p className="mb-4 leading-relaxed">
                The core intention of this training is twofold: first, to profoundly deepen your personal relationship with the practice of yoga, and second, to empower you to share that practice with others skillfully, safely, and authentically. We aim to inspire a lasting transformation that ripples from your own practice into the lives and hearts of your future students.
              </p>
              <h4 className="text-lg font-medium text-teal-300 mt-6 mb-3">Our Learning Arc: A Structured Immersion</h4>
              <ul className="space-y-4 mb-4 ml-5 list-disc">
                <li><strong>Foundations (First Half)</strong>: We will immerse ourselves in the foundational YogaFlow sequence (C1), focusing on precise alignment, biomechanics, and anatomy. We'll deconstruct key philosophical concepts and build a strong base in the principles of effective, clear, and inclusive cueing. This is where we build the "what" and "how."</li>
                <li><strong>Expansion (Second Half)</strong>: Building on this solid foundation, we will explore the art of advanced, intelligent sequencing, creative and meaningful theming, the ethics and application of hands-on assists, and the practical business of yoga. This is where we cultivate the "why" and "who."</li>
                <li><strong>Practice & Integration</strong>: Learning is an active process. Throughout the training, you will engage in daily asana practice, peer teaching exercises ("practice teaching"), constructive group discussions, and receive personalized, actionable feedback to integrate your learning in a practical, embodied way.</li>
              </ul>
            </ManualSection>

            <ManualSection id="setup" title="Setting Up for Success">
              <p className="mb-4">Your environment and, more importantly, your mindset are key to maximizing your growth. Here’s how to create a supportive container for your learning journey:</p>
              <ul className="space-y-4 ml-5 list-disc">
                <li><strong>Active Participation</strong>: Embrace a "front-row" mindset, regardless of where your mat is. Ask questions when they arise, volunteer for demonstrations to learn through experience, and engage fully and respectfully in all discussions. Your presence matters.</li>
                <li><strong>Consistent Practice</strong>: Aim to get on your mat more days than you don't. Your personal practice is your laboratory, your sanctuary, and your most valuable resource. It's where the theory becomes reality.</li>
                <li><strong>Community & Connection</strong>: Make an effort to learn and use the names of your fellow trainees. Speak with kindness, listen with empathy, and always use inclusive language like "team," "everyone," or "this group." We are a collective.</li>
                <li><strong>Contribution Mindset</strong>: Be generous with your presence. Share your insights and experiences when they can add value to the conversation. More importantly, listen with the intent to understand, not just to formulate your response.</li>
                <li><strong>Growth Mindset</strong>: View challenges—a difficult pose, a confusing concept, a moment of self-doubt—as opportunities for growth. Celebrate not just your achievements, but also your efforts, your questions, and your learning process.</li>
              </ul>
            </ManualSection>

            <ManualSection id="journals" title="The Power of Self-Reflection">
              <p className="mb-4 leading-relaxed">
                Consistent journaling (*svādhyāya* in action) is a cornerstone of this training and a non-negotiable requirement for certification. Your journal is a private, sacred space to process your learning, question your assumptions, and integrate your experiences on a deeper level. It is where you will witness your own transformation.
              </p>
              <h4 className="text-lg font-medium text-teal-300 mt-6 mb-3">Reflection Prompts for Your Journal:</h4>
              <ul className="space-y-3 ml-5 list-disc">
                <li><strong>After each practice</strong>: How did my body feel today, not just physically but energetically? What poses felt challenging, and what felt freeing? Where did my mind wander?</li>
                <li><strong>During lectures</strong>: What single concept was most illuminating or most confusing? What question arose for me that I can explore further? How does this concept connect to my life off the mat?</li>
                <li><strong>Observing others teach</strong>: What cueing language was particularly effective and why? How did the teacher's presence and energy shape the experience for the students? What did I learn that I can apply?</li>
                <li><strong>Weekly review</strong>: What is my single biggest takeaway from this week? Where am I feeling most confident and empowered? Where do I feel stuck or in need of more support? What is my intention for next week?</li>
              </ul>
            </ManualSection>

            <ManualSection id="reading" title="Further Reading & Resources">
              <p className="mb-4">While this manual is your primary text, the path of yoga is vast and rich. The following books are highly recommended to enrich your understanding. They are optional but will provide invaluable depth, context, and inspiration for your practice and teaching.</p>
              <ul className="space-y-3 ml-5">
                <li><em>Light on Yoga</em> by B.K.S. Iyengar — Often called the "bible of yoga," this is the definitive, encyclopedic guide to asana with meticulous detail on alignment and form.</li>
                <li><em>The Yoga Sutras of Patanjali</em> (commentary by Swami Satchidananda or Nicolai Bachman) — This is the foundational text of yoga philosophy. A clear translation and commentary are essential for understanding the "why" behind the practice.</li>
                <li><em>The Heart of Yoga: Developing a Personal Practice</em> by T.K.V. Desikachar — A modern classic on adapting the practice of yoga to the individual's needs, age, and physical condition, written by the son of the legendary T. Krishnamacharya.</li>
                <li><em>Meditations from the Mat</em> by Rolf Gates — A wonderful collection of daily reflections that beautifully weave together the physical practice with the philosophical path of yoga.</li>
                <li><em>The Four Agreements</em> by Don Miguel Ruiz — While not a "yoga" book, this is a simple yet profound guide to personal freedom and navigating human relationships with integrity.</li>
              </ul>
            </ManualSection>
          </article>
        </div>
        
        <footer className="mt-12 pt-6 border-t border-gray-700 text-center text-gray-500">
          <p>© YogaFlow University — Chapter 1: Welcome & Program Overview. For internal training use only.</p>
        </footer>
      </div>
    </ManualLayout>
  );
}