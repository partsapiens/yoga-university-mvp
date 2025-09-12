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
          <div className="text-center px-4">
            <h1 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">
              Welcome to{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                Yoga Flow University
              </span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto drop-shadow-md">
              Create personalized yoga flows with intelligent assistance, track your practice, 
              and grow your teaching skills in our comprehensive platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/flows/create"
                className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 border-2 border-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Start Creating Flows
              </Link>
              <Link
                href="/poses"
                className="bg-blue-600 backdrop-blur-sm hover:bg-blue-700 text-white border-2 border-blue-500 px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Explore Pose Library
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need for Your Yoga Journey
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">🤖 Intelligent Flow Creation</h3>
              <p className="text-gray-600">Generate personalized yoga sequences based on your goals.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Comprehensive Pose Library</h3>
              <p className="text-gray-600">Access detailed instructions for hundreds of poses.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Guided Meditation</h3>
              <p className="text-gray-600">Enhance your practice with meditation techniques.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage