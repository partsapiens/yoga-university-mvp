import React from 'react'
import Link from 'next/link'

const HomePage = () => {
  return (
    <>
      {/* Hero Section - Full Width */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Background overlay for better text readability */}
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Yoga Flow University
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Create personalized yoga flows with AI assistance, track your practice, 
            and grow your teaching skills in our comprehensive platform.
          </p>
          
          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/flows/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Start Creating Flows
            </Link>
            <Link
              href="/poses"
              className="bg-white hover:bg-gray-50 text-blue-600 border border-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Explore Pose Library
            </Link>
            <Link
              href="/meditation"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Try Meditation
            </Link>
          </div>
        </div>
      </section>

      {/* Features Overview Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need for Your Yoga Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From personalized flows to guided meditation, we provide tools for students and teachers alike.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature cards with placeholder content */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">AI-Powered Flow Creation</h3>
              <p className="text-gray-600">Generate personalized yoga sequences based on your goals, time, and skill level.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Comprehensive Pose Library</h3>
              <p className="text-gray-600">Access detailed instructions, benefits, and modifications for hundreds of poses.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Guided Meditation</h3>
              <p className="text-gray-600">Enhance your practice with meditation techniques and breathing exercises.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage
