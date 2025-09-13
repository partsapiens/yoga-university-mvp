'use client';

import React from 'react';
import Link from 'next/link';
import { ManualLayout } from '@/components/manual';

export default function ManualPage() {
  const breadcrumbs = [
    { label: '← Back to Yoga Flow', href: '/' }
  ];

  return (
    <ManualLayout 
      title="YogaFlow 200-Hour Teacher Training Manual" 
      breadcrumbs={breadcrumbs}
    >
      <div className="max-w-5xl mx-auto">
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
            <Link 
              href="/manual/chapter-1"
              className="inline-block bg-teal-300 text-gray-900 py-2.5 px-5 rounded-lg font-semibold no-underline transition-all duration-200 hover:bg-blue-400"
            >
              Read Chapter 1
            </Link>
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
            <Link 
              href="/manual/chapter-2"
              className="inline-block bg-teal-300 text-gray-900 py-2.5 px-5 rounded-lg font-semibold no-underline transition-all duration-200 hover:bg-blue-400"
            >
              Read Chapter 2
            </Link>
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
            <Link 
              href="/manual/chapter-4"
              className="inline-block bg-teal-300 text-gray-900 py-2.5 px-5 rounded-lg font-semibold no-underline transition-all duration-200 hover:bg-blue-400"
            >
              Read Chapter 4
            </Link>
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
            <Link 
              href="/manual/chapter-5"
              className="inline-block bg-teal-300 text-gray-900 py-2.5 px-5 rounded-lg font-semibold no-underline transition-all duration-200 hover:bg-blue-400"
            >
              Read Chapter 5
            </Link>
          </div>

          <div 
            className="rounded-2xl p-6 transition-all duration-200 hover:transform hover:-translate-y-1 hover:border-blue-400"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
              border: '1px solid #26303a'
            }}
          >
            <h2 className="text-xl font-semibold text-teal-300 mt-0 mb-3">Chapter 6</h2>
            <h3 className="text-lg font-medium mb-3">Chakras & Energy</h3>
            <p className="mb-4 text-gray-400 leading-relaxed">
              Explore the chakra system, energy anatomy, and how to incorporate energetic principles into your teaching and personal practice.
            </p>
            <Link 
              href="/manual/chapter-6"
              className="inline-block bg-teal-300 text-gray-900 py-2.5 px-5 rounded-lg font-semibold no-underline transition-all duration-200 hover:bg-blue-400"
            >
              Read Chapter 6
            </Link>
          </div>

          <div 
            className="rounded-2xl p-6 transition-all duration-200 hover:transform hover:-translate-y-1 hover:border-blue-400"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
              border: '1px solid #26303a'
            }}
          >
            <h2 className="text-xl font-semibold text-teal-300 mt-0 mb-3">Chapter 7</h2>
            <h3 className="text-lg font-medium mb-3">Teaching Skills & Professional Development</h3>
            <p className="mb-4 text-gray-400 leading-relaxed">
              Develop your teaching voice, learn effective cueing techniques, and explore the business aspects of yoga instruction.
            </p>
            <Link 
              href="/manual/chapter-7"
              className="inline-block bg-teal-300 text-gray-900 py-2.5 px-5 rounded-lg font-semibold no-underline transition-all duration-200 hover:bg-blue-400"
            >
              Read Chapter 7
            </Link>
          </div>
        </div>

        <footer className="mt-12 pt-6 border-t border-gray-600 text-gray-400">
          <p>© YogaFlow University — Training Manual. For internal training use.</p>
        </footer>
      </div>
    </ManualLayout>
  );
}