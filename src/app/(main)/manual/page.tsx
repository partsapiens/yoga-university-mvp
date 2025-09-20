'use client';

import React from 'react';
import Link from 'next/link';
import { ManualLayout } from '@/components/manual';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ManualPage() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  
  const breadcrumbs = [
    { label: t('manual.back-to-home'), href: '/' }
  ];

  return (
    <ManualLayout 
      title={t('manual.title')} 
      breadcrumbs={breadcrumbs}
    >
      <div className="max-w-5xl mx-auto">
        <div 
          className={`rounded-2xl p-6 mb-8 transition-colors duration-200 ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/30 border border-slate-700' 
              : 'bg-gray-50 border border-gray-200 shadow-sm'
          }`}
        >
          <h2 className={`text-xl font-semibold mt-0 mb-3 ${
            theme === 'dark' ? 'text-teal-300' : 'text-teal-700'
          }`}>{t('manual.welcome.title')}</h2>
          <p className={`mb-4 leading-relaxed ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {t('manual.welcome.description')}
          </p>
          <p className={`mb-0 leading-relaxed ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {t('manual.welcome.navigation')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            className={`rounded-2xl p-6 transition-all duration-200 hover:transform hover:-translate-y-1 ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/30 border border-slate-700 hover:border-blue-400' 
                : 'bg-white border border-gray-200 shadow-lg hover:border-blue-500 hover:shadow-xl'
            }`}
          >
            <h2 className={`text-xl font-semibold mt-0 mb-3 ${
              theme === 'dark' ? 'text-teal-300' : 'text-teal-700'
            }`}>Chapter 1</h2>
            <h3 className={`text-lg font-medium mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Welcome & Program Overview</h3>
            <p className={`mb-4 leading-relaxed ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Begin your journey with an introduction to the YogaFlow methodology, program commitments, and setting yourself up for success in your teacher training experience.
            </p>
            <Link 
              href="/manual/chapter-1"
              className={`inline-block py-2.5 px-5 rounded-lg font-semibold no-underline transition-all duration-200 ${
                theme === 'dark' 
                  ? 'bg-teal-300 text-gray-900 hover:bg-blue-400' 
                  : 'bg-teal-600 text-white hover:bg-teal-700'
              }`}
            >
              Read Chapter 1
            </Link>
          </div>

          <div 
            className={`rounded-2xl p-6 transition-all duration-200 hover:transform hover:-translate-y-1 ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/30 border border-slate-700 hover:border-blue-400' 
                : 'bg-white border border-gray-200 shadow-lg hover:border-blue-500 hover:shadow-xl'
            }`}
          >
            <h2 className={`text-xl font-semibold mt-0 mb-3 ${
              theme === 'dark' ? 'text-teal-300' : 'text-teal-700'
            }`}>Chapter 2</h2>
            <h3 className={`text-lg font-medium mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Foundations of Yoga Practice</h3>
            <p className={`mb-4 leading-relaxed ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Explore the fundamental principles of yoga practice, including breath awareness, basic alignment principles, and developing a consistent personal practice.
            </p>
            <Link 
              href="/manual/chapter-2"
              className={`inline-block py-2.5 px-5 rounded-lg font-semibold no-underline transition-all duration-200 ${
                theme === 'dark' 
                  ? 'bg-teal-300 text-gray-900 hover:bg-blue-400' 
                  : 'bg-teal-600 text-white hover:bg-teal-700'
              }`}
            >
              Read Chapter 2
            </Link>
          </div>

          <div 
            className={`rounded-2xl p-6 transition-all duration-200 hover:transform hover:-translate-y-1 ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/30 border border-slate-700 hover:border-blue-400' 
                : 'bg-white border border-gray-200 shadow-lg hover:border-blue-500 hover:shadow-xl'
            }`}
          >
            <h2 className={`text-xl font-semibold mt-0 mb-3 ${
              theme === 'dark' ? 'text-teal-300' : 'text-teal-700'
            }`}>Chapter 3</h2>
            <h3 className={`text-lg font-medium mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Integration & Sun Salutations</h3>
            <p className={`mb-4 leading-relaxed ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Learn integration techniques and master the foundational Sun Salutation sequences with detailed Sanskrit pose names and alignment cues.
            </p>
            <Link 
              href="/manual/chapter-3"
              className={`inline-block py-2.5 px-5 rounded-lg font-semibold no-underline transition-all duration-200 ${
                theme === 'dark' 
                  ? 'bg-teal-300 text-gray-900 hover:bg-blue-400' 
                  : 'bg-teal-600 text-white hover:bg-teal-700'
              }`}
            >
              Read Chapter 3
            </Link>
          </div>

          <div 
            className={`rounded-2xl p-6 transition-all duration-200 hover:transform hover:-translate-y-1 ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/30 border border-slate-700 hover:border-blue-400' 
                : 'bg-white border border-gray-200 shadow-lg hover:border-blue-500 hover:shadow-xl'
            }`}
          >
            <h2 className={`text-xl font-semibold mt-0 mb-3 ${
              theme === 'dark' ? 'text-teal-300' : 'text-teal-700'
            }`}>Chapter 4</h2>
            <h3 className={`text-lg font-medium mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Assists, Props & Safety</h3>
            <p className={`mb-4 leading-relaxed ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Master hands-on assists, intelligent prop use, and safety principles. Learn consent-based teaching, contraindications, and brand-neutral techniques.
            </p>
            <Link 
              href="/manual/chapter-4"
              className={`inline-block py-2.5 px-5 rounded-lg font-semibold no-underline transition-all duration-200 ${
                theme === 'dark' 
                  ? 'bg-teal-300 text-gray-900 hover:bg-blue-400' 
                  : 'bg-teal-600 text-white hover:bg-teal-700'
              }`}
            >
              Read Chapter 4
            </Link>
          </div>

          <div 
            className={`rounded-2xl p-6 transition-all duration-200 hover:transform hover:-translate-y-1 ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/30 border border-slate-700 hover:border-blue-400' 
                : 'bg-white border border-gray-200 shadow-lg hover:border-blue-500 hover:shadow-xl'
            }`}
          >
            <h2 className={`text-xl font-semibold mt-0 mb-3 ${
              theme === 'dark' ? 'text-teal-300' : 'text-teal-700'
            }`}>Chapter 5</h2>
            <h3 className={`text-lg font-medium mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Yoga Philosophy & Lifestyle</h3>
            <p className={`mb-4 leading-relaxed ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Dive deep into yoga philosophy, the eight limbs of yoga, and how to integrate ancient wisdom into modern teaching and daily life.
            </p>
            <Link 
              href="/manual/chapter-5"
              className={`inline-block py-2.5 px-5 rounded-lg font-semibold no-underline transition-all duration-200 ${
                theme === 'dark' 
                  ? 'bg-teal-300 text-gray-900 hover:bg-blue-400' 
                  : 'bg-teal-600 text-white hover:bg-teal-700'
              }`}
            >
              Read Chapter 5
            </Link>
          </div>

          <div 
            className={`rounded-2xl p-6 transition-all duration-200 hover:transform hover:-translate-y-1 ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/30 border border-slate-700 hover:border-blue-400' 
                : 'bg-white border border-gray-200 shadow-lg hover:border-blue-500 hover:shadow-xl'
            }`}
          >
            <h2 className={`text-xl font-semibold mt-0 mb-3 ${
              theme === 'dark' ? 'text-teal-300' : 'text-teal-700'
            }`}>Chapter 6</h2>
            <h3 className={`text-lg font-medium mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Chakras & Energy</h3>
            <p className={`mb-4 leading-relaxed ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Explore the chakra system, energy anatomy, and how to incorporate energetic principles into your teaching and personal practice.
            </p>
            <Link 
              href="/manual/chapter-6"
              className={`inline-block py-2.5 px-5 rounded-lg font-semibold no-underline transition-all duration-200 ${
                theme === 'dark' 
                  ? 'bg-teal-300 text-gray-900 hover:bg-blue-400' 
                  : 'bg-teal-600 text-white hover:bg-teal-700'
              }`}
            >
              Read Chapter 6
            </Link>
          </div>

          <div 
            className={`rounded-2xl p-6 transition-all duration-200 hover:transform hover:-translate-y-1 ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/30 border border-slate-700 hover:border-blue-400' 
                : 'bg-white border border-gray-200 shadow-lg hover:border-blue-500 hover:shadow-xl'
            }`}
          >
            <h2 className={`text-xl font-semibold mt-0 mb-3 ${
              theme === 'dark' ? 'text-teal-300' : 'text-teal-700'
            }`}>Chapter 7</h2>
            <h3 className={`text-lg font-medium mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Teaching Skills & Professional Development</h3>
            <p className={`mb-4 leading-relaxed ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Develop your teaching voice, learn effective cueing techniques, and explore the business aspects of yoga instruction.
            </p>
            <Link 
              href="/manual/chapter-7"
              className={`inline-block py-2.5 px-5 rounded-lg font-semibold no-underline transition-all duration-200 ${
                theme === 'dark' 
                  ? 'bg-teal-300 text-gray-900 hover:bg-blue-400' 
                  : 'bg-teal-600 text-white hover:bg-teal-700'
              }`}
            >
              Read Chapter 7
            </Link>
          </div>
        </div>

        <footer className={`mt-12 pt-6 border-t ${
          theme === 'dark' ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-600'
        }`}>
          <p>© YogaFlow University — Training Manual. For internal training use.</p>
        </footer>
      </div>
    </ManualLayout>
  );
}