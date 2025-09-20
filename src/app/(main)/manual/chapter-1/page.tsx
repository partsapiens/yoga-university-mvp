'use client';

import React from 'react';
import { ManualLayout, ManualTOC, ManualSection, FigureCard } from '@/components/manual';
import PoseVideo from '@/components/PoseLibrary/PoseVideo';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Chapter1Page() {
  const { t } = useLanguage();
  
  const breadcrumbs = [
    { label: t('manual.chapter1.breadcrumb'), href: '/manual' },
    { label: t('manual.chapter1.nav') }
  ];

  const tocItems = [
    { id: 'welcome', title: t('manual.chapter1.welcome.title') },
    { id: 'commitments', title: t('manual.chapter1.commitments.title') },
    { id: 'intention', title: t('manual.chapter1.intention.title') },
    { id: 'setup', title: t('manual.chapter1.setup.title') },
    { id: 'journals', title: t('manual.chapter1.journals.title') },
    { id: 'reading', title: t('manual.chapter1.reading.title') }
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
      title={t('manual.chapter1.title')} 
      breadcrumbs={breadcrumbs}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <ManualTOC 
            items={tocItems} 
            chapterNavigation={chapterNavigation}
          />
          
          <article>
            <ManualSection id="welcome" title={t('manual.chapter1.welcome.title')}>
              <PoseVideo url="https://youtu.be/NTVE5KBuHpU" title={t('manual.chapter1.welcome.title')} className="mb-8" />
              
              <div className="md:grid md:grid-cols-2 gap-8 items-center mb-8">
                <div>
                  <p className="mb-4 leading-relaxed text-lg">
                    {t('manual.chapter1.welcome.intro')}
                  </p>
                  <p className="mb-4 leading-relaxed">
                    {t('manual.chapter1.welcome.community')}
                  </p>
                </div>
                <div>
                  <FigureCard title={t('manual.chapter1.journey.card-title')}>
                    <svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md">
                      <defs>
                        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#0f766e" />
                          <stop offset="50%" stopColor="#0891b2" />
                          <stop offset="100%" stopColor="#7c3aed" />
                        </linearGradient>
                      </defs>
                      
                      {/* Journey Path */}
                      <path 
                        d="M30 160 Q80 140 150 150 Q220 160 270 140" 
                        stroke="url(#pathGradient)" 
                        strokeWidth="4" 
                        fill="none"
                        strokeDasharray="8,4"
                      />
                      
                      {/* Milestones */}
                      <circle cx="30" cy="160" r="8" fill="#0f766e" />
                      <circle cx="100" cy="145" r="8" fill="#0891b2" />
                      <circle cx="200" cy="155" r="8" fill="#7c3aed" />
                      <circle cx="270" cy="140" r="8" fill="#c084fc" />
                      
                      {/* Labels */}
                      <text x="30" y="180" textAnchor="middle" className="fill-current text-xs">{t('manual.chapter.student')}</text>
                      <text x="100" y="130" textAnchor="middle" className="fill-current text-xs">{t('manual.chapter.practitioner')}</text>
                      <text x="200" y="175" textAnchor="middle" className="fill-current text-xs">{t('manual.chapter.teacher')}</text>
                      <text x="270" y="125" textAnchor="middle" className="fill-current text-xs">{t('manual.chapter.leader')}</text>
                      
                      {/* Decorative elements */}
                      <g transform="translate(150, 50)">
                        <circle cx="0" cy="0" r="25" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                        <circle cx="0" cy="0" r="15" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                        <path d="M-10,-10 L10,10 M10,-10 L-10,10" stroke="currentColor" strokeWidth="2" opacity="0.7" />
                      </g>
                      
                      <text x="150" y="100" textAnchor="middle" className="fill-current text-sm font-semibold">{t('manual.chapter.yogaflow')}</text>
                      <text x="150" y="115" textAnchor="middle" className="fill-current text-xs">{t('manual.chapter.community')}</text>
                    </svg>
                  </FigureCard>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 border border-blue-200 dark:border-blue-700 rounded-lg my-8">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {t('manual.chapter1.journey.info-title')}
                </h4>
                <p className="text-blue-700 dark:text-blue-200 leading-relaxed">
                  {t('manual.chapter1.journey.info-text')}
                </p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center text-blue-600 dark:text-blue-300">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {t('manual.chapter1.journey.self-discovery')}
                  </div>
                  <div className="flex items-center text-blue-600 dark:text-blue-300">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {t('manual.chapter1.journey.community-building')}
                  </div>
                  <div className="flex items-center text-blue-600 dark:text-blue-300">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {t('manual.chapter1.journey.leadership')}
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-6 my-8">
                <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-3">💡 Training Philosophy</h4>
                <p className="text-amber-700 dark:text-amber-200 mb-4">
                  At YogaFlow University, we believe that the best yoga teachers are those who maintain a beginner's mind while developing deep expertise. This paradox—being both student and teacher—is at the heart of our approach.
                </p>
                <blockquote className="border-l-4 border-amber-400 pl-4 italic text-amber-700 dark:text-amber-200">
                  "In the beginner's mind there are many possibilities, but in the expert's mind there are few." 
                  <cite className="block text-right text-sm mt-2 not-italic">— Shunryu Suzuki</cite>
                </blockquote>
              </div>
            </ManualSection>

            <ManualSection id="commitments" title="Our Mutual Commitments">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-300 mt-6 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Our Commitment to You
                  </h3>
                  <div className="space-y-4">
                    <p className="leading-relaxed">
                      YogaFlow is dedicated to providing an exceptional, practical teacher-training program that meets and exceeds the standards of Yoga Alliance. Upon successful completion, you will be a certified yoga teacher, equipped with the skills and confidence to lead safe, effective, and inspiring classes.
                    </p>
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">✅ What You Can Expect:</h4>
                      <ul className="space-y-1 text-green-700 dark:text-green-200 text-sm">
                        <li>• Comprehensive 200-hour curriculum</li>
                        <li>• Expert instruction from certified teachers</li>
                        <li>• Small class sizes for personalized attention</li>
                        <li>• Hands-on practice and feedback</li>
                        <li>• Yoga Alliance certification upon completion</li>
                        <li>• Ongoing mentorship and support</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <FigureCard title="Commitment Circle">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm">
                      {/* Outer circle */}
                      <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                      
                      {/* Inner elements representing commitment */}
                      <g transform="translate(100, 70)">
                        <circle cx="0" cy="0" r="15" fill="#0f766e" opacity="0.8" />
                        <text x="0" y="5" textAnchor="middle" className="fill-white text-xs font-bold">YOU</text>
                      </g>
                      
                      <g transform="translate(100, 130)">
                        <circle cx="0" cy="0" r="15" fill="#0891b2" opacity="0.8" />
                        <text x="0" y="-25" textAnchor="middle" className="fill-current text-xs">YogaFlow</text>
                        <text x="0" y="5" textAnchor="middle" className="fill-white text-xs font-bold">US</text>
                      </g>
                      
                      {/* Connection lines */}
                      <line x1="100" y1="85" x2="100" y2="115" stroke="currentColor" strokeWidth="2" opacity="0.6" />
                      
                      {/* Surrounding values */}
                      <g transform="translate(60, 60)">
                        <circle cx="0" cy="0" r="8" fill="#7c3aed" opacity="0.6" />
                        <text x="0" y="-15" textAnchor="middle" className="fill-current text-xs">Excellence</text>
                      </g>
                      
                      <g transform="translate(140, 60)">
                        <circle cx="0" cy="0" r="8" fill="#7c3aed" opacity="0.6" />
                        <text x="0" y="-15" textAnchor="middle" className="fill-current text-xs">Support</text>
                      </g>
                      
                      <g transform="translate(60, 140)">
                        <circle cx="0" cy="0" r="8" fill="#7c3aed" opacity="0.6" />
                        <text x="0" y="25" textAnchor="middle" className="fill-current text-xs">Growth</text>
                      </g>
                      
                      <g transform="translate(140, 140)">
                        <circle cx="0" cy="0" r="8" fill="#7c3aed" opacity="0.6" />
                        <text x="0" y="25" textAnchor="middle" className="fill-current text-xs">Community</text>
                      </g>
                    </svg>
                  </FigureCard>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-300 mt-8 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Your Commitment to the Practice
              </h3>
              <p className="mb-6">The following principles, drawn from yogic philosophy, form the foundation of our shared journey. Embrace them as tools for growth and transformation.</p>
              
              <div className="grid gap-6">
                <div className="border border-teal-200 dark:border-teal-700 rounded-lg p-6 bg-teal-50 dark:bg-teal-900/20">
                  <h4 className="font-semibold text-teal-800 dark:text-teal-300 mb-2 flex items-center">
                    <span className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm mr-3">स्व</span>
                    Svādhyāya (Self-Study)
                  </h4>
                  <p className="text-teal-700 dark:text-teal-200">
                    Commit to a rigorous exploration of your own body, breath, and mind. This is the source of authentic teaching. Your personal practice becomes your greatest teacher and most valuable resource.
                  </p>
                </div>
                
                <div className="border border-purple-200 dark:border-purple-700 rounded-lg p-6 bg-purple-50 dark:bg-purple-900/20">
                  <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2 flex items-center">
                    <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm mr-3">अप</span>
                    Aparigraha (Non-Attachment)
                  </h4>
                  <p className="text-purple-700 dark:text-purple-200">
                    Be open to new ideas, unexpected challenges, and personal evolution. Release preconceived notions of what this journey "should" be. Embrace the unknown with curiosity.
                  </p>
                </div>
                
                <div className="border border-orange-200 dark:border-orange-700 rounded-lg p-6 bg-orange-50 dark:bg-orange-900/20">
                  <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2 flex items-center">
                    <span className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm mr-3">तप</span>
                    Tapas (Discipline/Enthusiasm)
                  </h4>
                  <p className="text-orange-700 dark:text-orange-200">
                    Consistently challenge yourself, both physically and mentally. This inner fire purifies and strengthens your resolve. Discipline becomes the foundation of freedom.
                  </p>
                </div>
                
                <div className="border border-blue-200 dark:border-blue-700 rounded-lg p-6 bg-blue-50 dark:bg-blue-900/20">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                    <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm mr-3">सत्य</span>
                    Satya & Ahimsā (Truth & Non-Harming)
                  </h4>
                  <p className="text-blue-700 dark:text-blue-200">
                    Interact with your peers and instructors with integrity and kindness. Offer and receive feedback that is both honest and compassionate. Truth without harm, honesty with love.
                  </p>
                </div>
                
                <div className="border border-green-200 dark:border-green-700 rounded-lg p-6 bg-green-50 dark:bg-green-900/20">
                  <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center">
                    <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm mr-3">शौच</span>
                    Śaucha, Santosha, Brahmacharya (Purity, Contentment, Moderation)
                  </h4>
                  <p className="text-green-700 dark:text-green-200">
                    Maintain a balanced approach to all aspects of your training. Take care of your energy, find joy in the process, and practice moderation in all things. Balance creates sustainability.
                  </p>
                </div>
              </div>
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