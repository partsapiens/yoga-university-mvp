'use client';

import React from 'react';
import { ManualLayout, ManualTOC, ManualSection } from '@/components/manual';

export default function Chapter1Page() {
  const breadcrumbs = [
    { label: '← Manual Index', href: '/manual' },
    { label: 'Chapter 1' }
  ];

  const tocItems = [
    { id: 'welcome', title: 'Welcome' },
    { id: 'commitments', title: 'Program Commitments' },
    { id: 'intention', title: 'TT Intention & Methodology' },
    { id: 'setup', title: 'Setup for Success' },
    { id: 'journals', title: 'Journals & Quizzes' },
    { id: 'reading', title: 'Reading & Resources' }
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
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <ManualTOC 
            items={tocItems} 
            chapterNavigation={chapterNavigation}
          />
          
          <article>
            <ManualSection id="welcome" title="Welcome">
              <p className="mb-4 leading-relaxed">
                Welcome to your YogaFlow Teacher Training journey—a powerful path of self-discovery, deep practice, and learning to guide others. This manual is your field guide. Carry it, annotate it, and let it inspire new insights. You are now part of the YogaFlow teaching community; we're excited to support your growth and transformation.
              </p>
            </ManualSection>

            <ManualSection id="commitments" title="Program Commitments">
              <h3 className="text-lg font-medium text-blue-400 mt-6 mb-3">Our Commitment</h3>
              <p className="mb-4 leading-relaxed">
                YogaFlow provides an exceptional, practical teacher-training program aligned with international yoga standards. With successful completion and optional registration with a recognized yoga alliance, you'll be qualified to share yoga professionally.
              </p>
              
              <h3 className="text-lg font-medium text-blue-400 mt-6 mb-3">Your Commitment</h3>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Svādhyāya</strong> (self-study): explore and refine body, breath, and mind.</li>
                <li><strong>Aparigraha</strong> (non-attachment): stay open to change and new directions.</li>
                <li><strong>Tapas</strong> (discipline): challenge yourself physically and mentally.</li>
                <li><strong>Satya</strong> & <strong>Ahimsā</strong> (truth & non-harming): offer feedback and interact with integrity.</li>
                <li><strong>Brahmacharya</strong>, <strong>Śaucha</strong>, <strong>Santosha</strong> (moderation, clarity, contentment): maintain balance and care throughout training.</li>
              </ul>
              
              <div 
                className="rounded-lg p-4 my-4"
                style={{
                  background: '#141921',
                  borderLeft: '4px solid #6ea8fe',
                  color: '#d8e5ff'
                }}
              >
                You'll get out of this journey exactly what you put into it.
              </div>
            </ManualSection>

            <ManualSection id="intention" title="TT Intention & Methodology">
              <p className="mb-4 leading-relaxed">
                The intention of YogaFlow Teacher Training is to strengthen your personal practice, equip you to teach confidently and safely, and inspire transformation in yourself and your students.
              </p>
              <ul className="space-y-2 mb-4 ml-5">
                <li>Foundational sequencing (C1) in the first half of training.</li>
                <li>Advanced sequencing, theming, and customization in the second half.</li>
                <li>Lectures in anatomy, yoga philosophy, and inclusive teaching.</li>
                <li>Practice teaching and group discussions for real-world skills.</li>
              </ul>
              <p className="leading-relaxed">
                Whether or not you teach professionally, these skills influence how you think, connect, and navigate daily life.
              </p>
            </ManualSection>

            <ManualSection id="setup" title="Setup for Success">
              <ul className="space-y-2 ml-5">
                <li>Embrace learning and participate actively.</li>
                <li>Practice more days than you don't.</li>
                <li>Learn and use names; speak kindly and only when necessary.</li>
                <li>Use inclusive language ("team," "everyone," "friends").</li>
                <li>Share when it adds value; keep a growth mindset.</li>
              </ul>
            </ManualSection>

            <ManualSection id="journals" title="Journals & Quizzes">
              <p className="leading-relaxed">
                Journaling every practice and lecture is part of svādhyāya and supports certification. Reflect on how your body felt, what you learned about sequencing and cueing, effective demonstrations, adjustments, theming, and at least one takeaway from each class.
              </p>
            </ManualSection>

            <ManualSection id="reading" title="Reading & Resources (Optional)">
              <ul className="space-y-2 ml-5">
                <li><em>Light on Yoga</em> — B.K.S. Iyengar</li>
                <li><em>Yoga Sutras of Patanjali</em> — commentary by Swami Satchidananda</li>
                <li><em>Meditations from the Mat</em> — Rolf Gates</li>
                <li><em>The Four Agreements</em> — Don Miguel Ruiz</li>
                <li>Plus other foundational yoga texts of your choice.</li>
              </ul>
            </ManualSection>
          </article>
        </div>
        
        <footer className="mt-12 pt-6 border-t border-gray-600 text-gray-400">
          <p>© YogaFlow University — Chapter 1. For internal training use.</p>
        </footer>
      </div>
    </ManualLayout>
  );
}