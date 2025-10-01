'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import GooglePlayIcon from '@/components/icons/GooglePlayIcon'
import AppleAppStoreIcon from '@/components/icons/AppleAppStoreIcon'

const HomePageClient = () => {
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
            <div className="text-8xl mb-8 motion-safe:animate-pulse" aria-hidden="true">🧘‍♀️</div>

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
                <GooglePlayIcon />
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
                <AppleAppStoreIcon />
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
              {t('home.features.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl" aria-hidden="true">✨</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('home.features.flow.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('home.features.flow.description')}
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl" aria-hidden="true">📚</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('home.features.library.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('home.features.library.description')}
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl" aria-hidden="true">🧘</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('home.features.meditation.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {t('home.features.meditation.description')}
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
              <div className="text-gray-600 dark:text-gray-300">{t('home.stats.poses')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">1000+</div>
              <div className="text-gray-600 dark:text-gray-300">{t('home.stats.flows')}</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-300">{t('home.stats.sessions')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container-wide text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            {t('home.cta.subtitle')}
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-white text-blue-600 hover:bg-blue-50 px-10 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg text-lg"
          >
            {t('home.cta.button')}
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePageClient