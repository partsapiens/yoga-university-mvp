import React from 'react'
import Link from 'next/link'
import { MountainMeditationHero } from '@/components/home/MountainMeditationHero'

const HomePage = () => {
  return (
    <div>
      {/* Mountain Meditation Hero Section */}
      <section className="relative">
        <MountainMeditationHero />
        
        {/* Floating Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center px-responsive">
            <h1 className="heading-responsive-1 text-white mb-6 drop-shadow-lg">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                Yoga Flow University
              </span>
            </h1>
            
            <p className="text-responsive-lg text-white/90 mb-8 max-w-3xl mx-auto drop-shadow-md leading-relaxed">
              Create personalized yoga flows with intelligent assistance, track your practice, 
              and grow your teaching skills in our comprehensive platform.
            </p>
            
            <div className="flex-responsive justify-center max-w-md mx-auto">
              <Link
                href="/flows/create"
                className="btn btn-primary touch-target-large bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 border-2 border-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg w-full sm:w-auto"
              >
                Start Creating Flows
              </Link>
              <Link
                href="/poses"
                className="btn btn-primary touch-target-large bg-blue-600 backdrop-blur-sm hover:bg-blue-700 text-white border-2 border-blue-500 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg w-full sm:w-auto"
              >
                Explore Pose Library
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-responsive bg-white dark:bg-gray-800">
        <div className="container-wide">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="heading-responsive-2 text-gray-900 dark:text-white mb-4">
              Everything You Need for Your Yoga Journey
            </h2>
          </div>
          
          <div className="grid-responsive grid-responsive-md-3 gap-6">
            <div className="card-responsive bg-gray-50 dark:bg-gray-700">
              <h3 className="heading-responsive-3 mb-3 text-gray-900 dark:text-white">✨ Intelligent Flow Creation</h3>
              <p className="text-responsive-sm text-gray-600 dark:text-gray-300">Generate personalized yoga sequences based on your goals.</p>
            </div>
            
            <div className="card-responsive bg-gray-50 dark:bg-gray-700">
              <h3 className="heading-responsive-3 mb-3 text-gray-900 dark:text-white">Comprehensive Pose Library</h3>
              <p className="text-responsive-sm text-gray-600 dark:text-gray-300">Access detailed instructions for hundreds of poses.</p>
            </div>
            
            <div className="card-responsive bg-gray-50 dark:bg-gray-700">
              <h3 className="heading-responsive-3 mb-3 text-gray-900 dark:text-white">Guided Meditation</h3>
              <p className="text-responsive-sm text-gray-600 dark:text-gray-300">Enhance your practice with meditation techniques.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage