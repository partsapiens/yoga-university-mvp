'use client';

import React from 'react';
import Link from 'next/link';

export default function ManualPage() {
  return (
    <div className="min-h-screen" style={{
      background: 'radial-gradient(1200px 800px at 10% -10%, #14202a 0%, transparent 40%), radial-gradient(1200px 800px at 100% 0%, #1a142a 0%, transparent 40%), #0b0d10',
      color: '#e9f1f7'
    }}>
      <div className="max-w-7xl mx-auto">
        <header className="pt-12 pb-6 px-5">
          <div className="mb-6">
            <Link 
              href="/" 
              className="text-blue-400 hover:text-blue-300 no-underline hover:underline"
            >
              ← Back to Yoga Flow
            </Link>
          </div>
          <h1 className="text-4xl font-extrabold tracking-wide leading-tight mt-2 mb-0">
            YogaFlow 200-Hour Teacher Training Manual
          </h1>
        </header>

        <main className="max-w-7xl mx-auto my-6 mb-20 px-5">
          <div 
            className="rounded-2xl p-6 mb-8"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
              border: '1px solid #26303a'
            }}
          >
            <h2 className="text-xl font-semibold text-teal-300 mt-0 mb-3">Welcome to Your Training Manual</h2>
            <p className="mb-4 leading-relaxed">
              This comprehensive manual is your guide through the YogaFlow 200-Hour Teacher Training program. Each chapter builds upon the last, providing you with the knowledge, skills, and confidence to become an exceptional yoga instructor.
            </p>
            <p className="mb-0 leading-relaxed">
              Navigate through the chapters below to access the complete curriculum. We recommend reading them in order, but feel free to revisit any section as needed during your training journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              className="rounded-2xl p-6 transition-all duration-200 hover:transform hover:-translate-y-1 hover:border-blue-400"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
                border: '1px solid #26303a'
              }}
            >
              <h2 className="text-xl font-semibold text-teal-300 mt-0 mb-3">Chapter 1</h2>
              <h3 className="text-lg font-medium mb-3">Welcome & Program Overview</h3>
              <p className="mb-4 text-gray-400 leading-relaxed">
                Begin your journey with an introduction to the YogaFlow methodology, program commitments, and setting yourself up for success in your teacher training experience.
              </p>
              <a 
                href="/chapter1.html"
                className="inline-block bg-teal-300 text-gray-900 py-2.5 px-5 rounded-lg font-semibold no-underline transition-all duration-200 hover:bg-blue-400"
              >
                Read Chapter 1
              </a>
            </div>

            <div 
              className="rounded-2xl p-6 transition-all duration-200 hover:transform hover:-translate-y-1 hover:border-blue-400"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
                border: '1px solid #26303a'
              }}
            >
              <h2 className="text-xl font-semibold text-teal-300 mt-0 mb-3">Chapter 2</h2>
              <h3 className="text-lg font-medium mb-3">Foundations of Yoga Practice</h3>
              <p className="mb-4 text-gray-400 leading-relaxed">
                Explore the fundamental principles of yoga practice, including breath awareness, basic alignment principles, and developing a consistent personal practice.
              </p>
              <a 
                href="/chapter2.html"
                className="inline-block bg-teal-300 text-gray-900 py-2.5 px-5 rounded-lg font-semibold no-underline transition-all duration-200 hover:bg-blue-400"
              >
                Read Chapter 2
              </a>
            </div>

            <div 
              className="rounded-2xl p-6 transition-all duration-200 hover:transform hover:-translate-y-1 hover:border-blue-400"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
                border: '1px solid #26303a'
              }}
            >
              <h2 className="text-xl font-semibold text-teal-300 mt-0 mb-3">Chapter 3</h2>
              <h3 className="text-lg font-medium mb-3">Integration & Sun Salutations</h3>
              <p className="mb-4 text-gray-400 leading-relaxed">
                Learn integration techniques and master the foundational Sun Salutation sequences with detailed Sanskrit pose names and alignment cues.
              </p>
              <Link 
                href="/manual/chapter-3"
                className="inline-block bg-teal-300 text-gray-900 py-2.5 px-5 rounded-lg font-semibold no-underline transition-all duration-200 hover:bg-blue-400"
              >
                Read Chapter 3
              </Link>
            </div>

            <div 
              className="rounded-2xl p-6 transition-all duration-200 hover:transform hover:-translate-y-1 hover:border-blue-400"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
                border: '1px solid #26303a'
              }}
            >
              <h2 className="text-xl font-semibold text-teal-300 mt-0 mb-3">Chapter 4</h2>
              <h3 className="text-lg font-medium mb-3">Assists, Props & Safety</h3>
              <p className="mb-4 text-gray-400 leading-relaxed">
                Master hands-on assists, intelligent prop use, and safety principles. Learn consent-based teaching, contraindications, and brand-neutral techniques.
              </p>
              <a 
                href="/chapter4.html"
                className="inline-block bg-teal-300 text-gray-900 py-2.5 px-5 rounded-lg font-semibold no-underline transition-all duration-200 hover:bg-blue-400"
              >
                Read Chapter 4
              </a>
            </div>

            <div 
              className="rounded-2xl p-6 transition-all duration-200 hover:transform hover:-translate-y-1 hover:border-blue-400"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
                border: '1px solid #26303a'
              }}
            >
              <h2 className="text-xl font-semibold text-teal-300 mt-0 mb-3">Chapter 5</h2>
              <h3 className="text-lg font-medium mb-3">Yoga Philosophy & Lifestyle</h3>
              <p className="mb-4 text-gray-400 leading-relaxed">
                Dive deep into yoga philosophy, the eight limbs of yoga, and how to integrate ancient wisdom into modern teaching and daily life.
              </p>
              <a 
                href="/chapter5.html"
                className="inline-block bg-teal-300 text-gray-900 py-2.5 px-5 rounded-lg font-semibold no-underline transition-all duration-200 hover:bg-blue-400"
              >
                Read Chapter 5
              </a>
            </div>
          </div>
        </main>

        <footer className="max-w-7xl mx-auto my-6 mb-20 px-5 text-gray-400">
          <p>© YogaFlow University — Training Manual. For internal training use.</p>
        </footer>
      </div>
    </div>
  );
}