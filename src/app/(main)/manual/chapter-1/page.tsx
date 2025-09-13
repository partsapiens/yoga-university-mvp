'use client';

import React from 'react';
import { ManualLayout, ManualTOC, ManualSection, FigureCard } from '@/components/manual';

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
              <p className="mb-4 leading-relaxed text-lg">
                Welcome to your YogaFlow Teacher Training—a transformative path of self-discovery, dedicated practice, and the art of guiding others. This manual is more than a textbook; it's your field guide and companion. We encourage you to engage with it fully: write in the margins, highlight what resonates, and let its pages spark new questions and insights.
              </p>
              <p className="mb-4 leading-relaxed">
                You are now an integral part of the YogaFlow teaching community, a network of passionate practitioners and teachers. We are thrilled to support your evolution as both a student and a future leader in the world of yoga.
              </p>
              <div className="p-4 bg-blue-900/20 border-l-4 border-blue-400 rounded-r-lg my-6">
                <h4 className="font-semibold text-blue-300 mb-2">A Journey, Not a Destination</h4>
                <p className="text-blue-200/90">
                  This training is designed to be an immersive experience. The skills and knowledge you gain will extend far beyond the yoga mat, influencing how you connect with yourself, interact with others, and navigate the complexities of daily life. Embrace the process with an open heart and a curious mind.
                </p>
              </div>
            </ManualSection>

            <ManualSection id="commitments" title="Our Mutual Commitments">
              <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-4">Our Commitment to You</h3>
              <p className="mb-4 leading-relaxed">
                YogaFlow is dedicated to providing an exceptional, practical teacher-training program that meets and exceeds the standards of Yoga Alliance. Upon successful completion, you will be a certified yoga teacher, equipped with the skills and confidence to lead safe, effective, and inspiring classes.
              </p>
              
              <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-4">Your Commitment to the Practice</h3>
              <p className="mb-4">The following principles, drawn from yogic philosophy, form the foundation of our shared journey. Embrace them as tools for growth.</p>
              <ul className="space-y-3 mb-4 ml-5">
                <li><strong>Svādhyāya (Self-Study)</strong>: Commit to a rigorous exploration of your own body, breath, and mind. This is the source of authentic teaching.</li>
                <li><strong>Aparigraha (Non-Attachment)</strong>: Be open to new ideas, unexpected challenges, and personal evolution. Release preconceived notions of what this journey "should" be.</li>
                <li><strong>Tapas (Discipline/Enthusiasm)</strong>: Consistently challenge yourself, both physically and mentally. This inner fire purifies and strengthens your resolve.</li>
                <li><strong>Satya & Ahimsā (Truth & Non-Harming)</strong>: Interact with your peers and instructors with integrity and kindness. Offer and receive feedback that is both honest and compassionate.</li>
                <li><strong>Śaucha, Santosha, Brahmacharya (Purity, Contentment, Moderation)</strong>: Maintain a balanced approach. Take care of your energy, find joy in the process, and practice moderation in all things.</li>
              </ul>
            </ManualSection>

            <ManualSection id="intention" title="Training Intention & Methodology">
              <p className="mb-4 leading-relaxed">
                The core intention of this training is twofold: to deepen your personal relationship with yoga, and to empower you to share it with others skillfully and safely. We aim to inspire a profound transformation that ripples from your own practice into the lives of your future students.
              </p>
              <h4 className="text-lg font-medium text-teal-300 mt-6 mb-3">Our Learning Arc:</h4>
              <ul className="space-y-3 mb-4 ml-5 list-disc">
                <li><strong>Foundations (First Half)</strong>: We will immerse ourselves in the foundational YogaFlow sequence (C1), anatomy, key philosophical concepts, and the principles of effective cueing.</li>
                <li><strong>Expansion (Second Half)</strong>: Building on the foundation, we will explore advanced sequencing, creative theming, hands-on assists, and the business of yoga.</li>
                <li><strong>Practice & Integration</strong>: Throughout the training, you will engage in daily practice, peer teaching exercises, group discussions, and receive personalized feedback to integrate your learning in a practical way.</li>
              </ul>
            </ManualSection>

            <ManualSection id="setup" title="Setting Up for Success">
              <p className="mb-4">Your environment and mindset are key. Here’s how to create a supportive container for your learning:</p>
              <ul className="space-y-3 ml-5 list-disc">
                <li><strong>Active Participation</strong>: Embrace a "front-row" mindset. Ask questions, volunteer for demonstrations, and engage fully in discussions.</li>
                <li><strong>Consistent Practice</strong>: Aim to practice yoga more days than you don't. Your personal practice is your most valuable resource.</li>
                <li><strong>Community & Connection</strong>: Learn and use the names of your fellow trainees. Speak with kindness and intention. Use inclusive language like "team," "everyone," or "this group."</li>
                <li><strong>Contribution Mindset</strong>: Share your insights and experiences when they can add value to the conversation. Listen with the intent to understand, not just to respond.</li>
                <li><strong>Growth Mindset</strong>: View challenges as opportunities. Celebrate not just your achievements, but your efforts and learning process.</li>
              </ul>
            </ManualSection>

            <ManualSection id="journals" title="The Power of Self-Reflection">
              <p className="mb-4 leading-relaxed">
                Consistent journaling (svādhyāya) is a cornerstone of this training and a requirement for certification. Your journal is a private space to process, question, and integrate your experiences.
              </p>
              <h4 className="text-lg font-medium text-teal-300 mt-6 mb-3">Reflection Prompts for Your Journal:</h4>
              <ul className="space-y-2 ml-5 list-disc">
                <li>After each practice: How did my body feel today? What poses felt challenging, and what felt freeing?</li>
                <li>During lectures: What single concept was most illuminating? What question arose for me?</li>
                <li>Observing others teach: What cueing language was particularly effective? How did the teacher create a specific mood or energy?</li>
                <li>Weekly review: What is my biggest takeaway from this week? Where am I feeling most confident, and where do I need more support?</li>
              </ul>
            </ManualSection>

            <ManualSection id="reading" title="Further Reading & Resources">
              <p className="mb-4">While this manual is your primary text, the following books are highly recommended to enrich your understanding. They are optional but will provide invaluable depth.</p>
              <ul className="space-y-2 ml-5">
                <li><em>Light on Yoga</em> by B.K.S. Iyengar — The definitive guide to asana.</li>
                <li><em>The Yoga Sutras of Patanjali</em> (commentary by Swami Satchidananda or Nicolai Bachman) — The foundational text of yoga philosophy.</li>
                <li><em>The Heart of Yoga: Developing a Personal Practice</em> by T.K.V. Desikachar — A classic on adapting yoga to the individual.</li>
                <li><em>Meditations from the Mat</em> by Rolf Gates — Daily reflections on the path of yoga.</li>
                <li><em>The Four Agreements</em> by Don Miguel Ruiz — A practical guide to personal freedom.</li>
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