'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

const HomePage = () => {
  const { t } = useLanguage();
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        </div>
        
        <div className="relative container-wide py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main Emoji */}
            <div className="text-8xl mb-8 animate-pulse">🧘‍♀️</div>
            
            {/* Hero Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            
            {/* Hero Subtitle */}
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
              <Link
                href="/flows/create"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-lg"
              >
                {t('cta.start-creating')}
              </Link>
              <Link
                href="/poses"
                className="bg-blue-800 bg-opacity-50 backdrop-blur-sm text-white hover:bg-opacity-70 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg border border-blue-400 text-lg"
              >
                {t('cta.explore-poses')}
              </Link>
            </div>

            {/* App Store Banners */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-sm mx-auto mt-8">
              <Link
                href="https://play.google.com/store/apps"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
              >
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.92 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs opacity-75">Get it on</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </Link>
              <Link
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
              >
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs opacity-75">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Everything You Need for Your Yoga Journey
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover the power of AI-enhanced yoga practice with our comprehensive platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Intelligent Flow Creation
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Generate personalized yoga sequences powered by AI, tailored to your goals, experience level, and preferences.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">📚</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Comprehensive Pose Library
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Access detailed instructions, modifications, and benefits for hundreds of yoga poses with expert guidance.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🧘</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Guided Meditation
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Enhance your practice with meditation techniques, breathing exercises, and mindfulness training.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-300">Yoga Poses</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">1000+</div>
              <div className="text-gray-600 dark:text-gray-300">Flow Combinations</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-300">Meditation Sessions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container-wide text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of yogis who have discovered the power of intelligent, personalized yoga flows.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-white text-blue-600 hover:bg-blue-50 px-10 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-lg"
          >
            Start Your Journey Today
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage