"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Users, 
  Award, 
  Clock, 
  CheckCircle, 
  Play,
  Download,
  Calendar,
  MapPin,
  Star,
  ArrowRight,
  Target,
  Brain,
  Heart
} from 'lucide-react';

export default function CertificationPathwayPage() {
  const [selectedLevel, setSelectedLevel] = useState<'200hr' | '300hr' | '500hr'>('200hr');

  const certificationLevels = {
    '200hr': {
      title: '200-Hour Yoga Teacher Training',
      duration: '8 weeks intensive or 16 weeks part-time',
      price: '$2,499',
      description: 'Foundation certification for new yoga teachers',
      prerequisites: 'Minimum 6 months regular yoga practice',
      modules: [
        {
          title: 'Philosophy & History',
          hours: 30,
          topics: ['Ancient yoga texts', 'Eight limbs of yoga', 'Modern applications']
        },
        {
          title: 'Anatomy & Physiology',
          hours: 30,
          topics: ['Body systems', 'Injury prevention', 'Modifications']
        },
        {
          title: 'Asana Practice & Teaching',
          hours: 100,
          topics: ['Proper alignment', 'Sequencing', 'Hands-on adjustments']
        },
        {
          title: 'Pranayama & Meditation',
          hours: 20,
          topics: ['Breathing techniques', 'Meditation styles', 'Energy work']
        },
        {
          title: 'Teaching Methodology',
          hours: 20,
          topics: ['Class planning', 'Student interaction', 'Business basics']
        }
      ]
    },
    '300hr': {
      title: '300-Hour Advanced Training',
      duration: '12 weeks',
      price: '$3,499',
      description: 'Advanced training for experienced teachers',
      prerequisites: 'RYT-200 certification and 1 year teaching experience',
      modules: [
        {
          title: 'Advanced Philosophy',
          hours: 40,
          topics: ['Sanskrit studies', 'Yoga therapy principles', 'Spiritual guidance']
        },
        {
          title: 'Advanced Anatomy',
          hours: 50,
          topics: ['Biomechanics', 'Therapeutic applications', 'Advanced modifications']
        },
        {
          title: 'Specialized Teaching',
          hours: 120,
          topics: ['Trauma-informed yoga', 'Prenatal yoga', 'Senior yoga']
        },
        {
          title: 'Energy & Subtle Body',
          hours: 40,
          topics: ['Chakra system', 'Prana vayus', 'Meditation techniques']
        },
        {
          title: 'Business & Ethics',
          hours: 50,
          topics: ['Studio management', 'Professional ethics', 'Marketing']
        }
      ]
    },
    '500hr': {
      title: '500-Hour Master Teacher',
      duration: 'Combined 200hr + 300hr programs',
      price: '$5,499',
      description: 'Complete master-level certification',
      prerequisites: 'Open to all levels (includes 200hr content)',
      modules: [
        {
          title: 'Complete Foundation',
          hours: 200,
          topics: ['All 200hr curriculum', 'Comprehensive practice', 'Teaching basics']
        },
        {
          title: 'Advanced Studies',
          hours: 300,
          topics: ['All 300hr curriculum', 'Specialized training', 'Master teaching']
        }
      ]
    }
  };

  const learningPath = [
    {
      step: 1,
      title: 'Foundation Studies',
      description: 'Master the fundamentals of yoga philosophy, anatomy, and basic teaching skills',
      weeks: '1-4',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'blue'
    },
    {
      step: 2,
      title: 'Practice & Methodology',
      description: 'Develop your personal practice and learn effective teaching techniques',
      weeks: '5-8',
      icon: <Users className="w-6 h-6" />,
      color: 'purple'
    },
    {
      step: 3,
      title: 'Teaching Practicum',
      description: 'Lead practice sessions with feedback from experienced instructors',
      weeks: '9-12',
      icon: <Target className="w-6 h-6" />,
      color: 'green'
    },
    {
      step: 4,
      title: 'Assessment & Certification',
      description: 'Final examination and receive your Yoga Alliance certification',
      weeks: '13-16',
      icon: <Award className="w-6 h-6" />,
      color: 'gold'
    }
  ];

  const instructors = [
    {
      name: 'Sarah Johnson',
      credentials: 'E-RYT 500, YACEP',
      specialties: ['Vinyasa', 'Philosophy', 'Meditation'],
      experience: '15 years',
      photo: '/images/instructors/sarah.jpg'
    },
    {
      name: 'Michael Chen',
      credentials: 'E-RYT 200, Licensed Massage Therapist',
      specialties: ['Anatomy', 'Therapeutic Yoga', 'Injury Prevention'],
      experience: '12 years',
      photo: '/images/instructors/michael.jpg'
    },
    {
      name: 'Emma Rodriguez',
      credentials: 'RYT 500, Ayurveda Practitioner',
      specialties: ['Pranayama', 'Sanskrit', 'Holistic Health'],
      experience: '10 years',
      photo: '/images/instructors/emma.jpg'
    }
  ];

  const currentLevel = certificationLevels[selectedLevel];

  const getStepColor = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      gold: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Teacher Certification Pathway
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Transform your practice into a teaching career with our comprehensive, 
              Yoga Alliance certified teacher training programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#programs"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Explore Programs
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/manual"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <BookOpen className="mr-2 w-5 h-5" />
                View Manual
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Certification Levels */}
      <div id="programs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Certification Level
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            From beginner teacher to master instructor, we have the program for you
          </p>
        </div>

        {/* Level Selector */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
            {Object.keys(certificationLevels).map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level as any)}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  selectedLevel === level
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {level.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Program Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-2">{currentLevel.title}</h3>
                <p className="text-blue-100 mb-4">{currentLevel.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{currentLevel.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span>{currentLevel.prerequisites}</span>
                  </div>
                </div>
              </div>
              <div className="text-center md:text-right">
                <div className="text-3xl font-bold mb-2">{currentLevel.price}</div>
                <div className="text-blue-100 mb-4">Full program</div>
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                  Enroll Now
                </button>
              </div>
            </div>
          </div>

          <div className="p-8">
            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Program Modules
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentLevel.modules.map((module, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-semibold text-gray-900 dark:text-white">
                      {module.title}
                    </h5>
                    <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                      {module.hours} hours
                    </span>
                  </div>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {module.topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Learning Path */}
      <div className="bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Your Learning Journey
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Step-by-step progression to becoming a confident yoga teacher
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {learningPath.map((step, index) => (
              <div key={index} className="text-center">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full border-4 flex items-center justify-center ${getStepColor(step.color)}`}>
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Weeks {step.weeks}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructors */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Meet Your Instructors
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Learn from experienced, certified yoga teachers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {instructors.map((instructor, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {instructor.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {instructor.credentials}
                </p>
                <div className="mb-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <strong>Specialties:</strong> {instructor.specialties.join(', ')}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Experience:</strong> {instructor.experience}
                  </p>
                </div>
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    4.9/5 rating
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Begin Your Teaching Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of graduates who have transformed their practice into a fulfilling teaching career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors">
                Start Application
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-colors"
              >
                Schedule Info Session
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}