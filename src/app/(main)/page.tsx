import React from 'react'
import Link from 'next/link'
import { MountainMeditationHero } from '@/components/home/MountainMeditationHero'
import { CheckCircle } from 'lucide-react'

const HomePage = () => {
  return (
    <div>
      {/* Mountain Meditation Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <MountainMeditationHero />
        
        {/* Floating Content Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/20">
          <div className="text-center px-responsive max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              The Future of Yoga Practice is Here
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-8 drop-shadow-md leading-relaxed">
              Create personalized yoga flows with intelligent assistance, track your practice, 
              and grow your teaching skills on our comprehensive platform.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/flows/create"
                className="btn btn-primary w-full sm:w-auto text-lg px-8 py-4 rounded-xl font-bold transition-transform duration-300 hover:scale-105 shadow-2xl bg-white text-gray-900"
              >
                Create Your First Flow
              </Link>
              <Link
                href="/poses"
                className="btn btn-secondary w-full sm:w-auto text-lg px-8 py-4 rounded-xl font-semibold transition-transform duration-300 hover:scale-105 bg-white/20 text-white backdrop-blur-md border border-white/30"
              >
                Explore Pose Library
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Product Screenshot Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container-wide text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Visualize Your Perfect Flow
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Our intuitive interface makes it easy to design, visualize, and practice your custom yoga sequences.
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 max-w-4xl mx-auto">
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">High-quality product screenshot coming soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-800">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              A Smarter Way to Practice and Teach
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need for your yoga journey, from personal practice to professional development.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl shadow-lg transition-transform hover:scale-105">
              <div className="flex-shrink-0">
                <CheckCircle className="h-10 w-10 text-blue-500 mb-4" />
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Intelligent Flow Creation</h3>
              </div>
              <div className="flex-grow">
                <p className="text-base text-gray-600 dark:text-gray-400">
                  Generate personalized yoga sequences based on your goals, experience level, and desired intensity.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl shadow-lg transition-transform hover:scale-105">
              <div className="flex-shrink-0">
                <CheckCircle className="h-10 w-10 text-blue-500 mb-4" />
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Comprehensive Pose Library</h3>
              </div>
              <div className="flex-grow">
                <p className="text-base text-gray-600 dark:text-gray-400">
                  Access detailed instructions, benefits, and modifications for hundreds of poses.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl shadow-lg transition-transform hover:scale-105">
              <div className="flex-shrink-0">
                <CheckCircle className="h-10 w-10 text-blue-500 mb-4" />
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Guided Meditation</h3>
              </div>
              <div className="flex-grow">
                <p className="text-base text-gray-600 dark:text-gray-400">
                  Enhance your practice with a variety of guided meditation techniques for focus and relaxation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage