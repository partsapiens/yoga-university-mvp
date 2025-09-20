"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar, 
  Camera, 
  FileText, 
  Share2, 
  Target,
  ArrowRight,
  Download,
  Play
} from 'lucide-react';
import { BrandingModal } from '@/components/business/BrandingModal';
import { SocialMediaModal } from '@/components/business/SocialMediaModal';
import { PricingModal } from '@/components/business/PricingModal';

export default function BusinessResourcesPage() {
  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState(false);
  const [isSocialMediaModalOpen, setIsSocialMediaModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const resourceCategories = [
    {
      title: 'Marketing & Social Media',
      icon: <Share2 className="w-8 h-8" />,
      color: 'blue',
      description: 'Build your online presence and attract students',
      resources: [
        {
          title: 'Social Media Content Calendar',
          type: 'Template',
          description: '30-day content calendar with post ideas and hashtags',
          downloadUrl: '#',
          icon: <Calendar className="w-5 h-5" />
        },
        {
          title: 'Instagram Story Templates',
          type: 'Design Pack',
          description: 'Professional story templates for classes and workshops',
          downloadUrl: '#',
          icon: <Camera className="w-5 h-5" />
        },
        {
          title: 'Email Marketing Templates',
          type: 'Template',
          description: 'Ready-to-use email templates for newsletters and promotions',
          downloadUrl: '#',
          icon: <FileText className="w-5 h-5" />
        }
      ]
    },
    {
      title: 'Business Planning',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'green',
      description: 'Strategic planning tools for your yoga business',
      resources: [
        {
          title: 'Yoga Business Plan Template',
          type: 'Document',
          description: 'Comprehensive business plan template for yoga studios',
          downloadUrl: '#',
          icon: <FileText className="w-5 h-5" />
        },
        {
          title: 'Pricing Strategy Guide',
          type: 'Guide',
          description: 'How to price your classes, workshops, and retreats',
          downloadUrl: '#',
          icon: <DollarSign className="w-5 h-5" />
        },
        {
          title: 'Financial Tracking Spreadsheet',
          type: 'Template',
          description: 'Track income, expenses, and profit margins',
          downloadUrl: '#',
          icon: <TrendingUp className="w-5 h-5" />
        }
      ]
    },
    {
      title: 'Student Management',
      icon: <Users className="w-8 h-8" />,
      color: 'purple',
      description: 'Tools to manage and grow your student community',
      resources: [
        {
          title: 'Student Intake Forms',
          type: 'Template',
          description: 'Health questionnaires and liability waivers',
          downloadUrl: '#',
          icon: <FileText className="w-5 h-5" />
        },
        {
          title: 'Class Feedback Surveys',
          type: 'Template',
          description: 'Collect valuable feedback to improve your teaching',
          downloadUrl: '#',
          icon: <Target className="w-5 h-5" />
        },
        {
          title: 'Retention Strategies Guide',
          type: 'Guide',
          description: 'Proven methods to keep students coming back',
          downloadUrl: '#',
          icon: <Users className="w-5 h-5" />
        }
      ]
    }
  ];

  const webinars = [
    {
      title: 'Building Your Yoga Brand from Scratch',
      instructor: 'Sarah Johnson',
      duration: '90 minutes',
      description: 'Learn how to create a compelling brand identity that attracts your ideal students.',
      thumbnail: '/images/webinars/branding.jpg',
      videoUrl: '#'
    },
    {
      title: 'Social Media Marketing for Yoga Teachers',
      instructor: 'Mike Chen',
      duration: '75 minutes',
      description: 'Master Instagram, Facebook, and TikTok to grow your following and bookings.',
      thumbnail: '/images/webinars/social-media.jpg',
      videoUrl: '#'
    },
    {
      title: 'Pricing Your Yoga Services for Profit',
      instructor: 'Emma Rodriguez',
      duration: '60 minutes',
      description: 'Strategic pricing models that value your expertise and ensure sustainability.',
      thumbnail: '/images/webinars/pricing.jpg',
      videoUrl: '#'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300',
      green: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300',
      purple: 'bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-900/20 dark:border-purple-700 dark:text-purple-300'
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
              Business & Marketing Resources
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Everything you need to build, market, and grow a successful yoga business. 
              From social media templates to business plans, we have got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#resources"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Browse Resources
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="#webinars"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Watch Webinars
                <Play className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Categories */}
      <div id="resources" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Downloadable Resources
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Professional templates and guides to help you succeed
          </p>
        </div>

        <div className="space-y-12">
          {resourceCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className={`p-6 border-l-4 ${getColorClasses(category.color)}`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-lg ${getColorClasses(category.color)}`}>
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.resources.map((resource, resourceIndex) => (
                    <div key={resourceIndex} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-white dark:bg-gray-600 rounded-lg">
                          {resource.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {resource.title}
                          </h4>
                          <span className="inline-block text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                            {resource.type}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {resource.description}
                      </p>
                      <button
                        onClick={() => window.open(resource.downloadUrl)}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Webinars Section */}
      <div id="webinars" className="bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Business Masterclass Webinars
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Learn from successful yoga entrepreneurs and business experts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {webinars.map((webinar, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden">
                <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500">
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-bold text-lg mb-1">{webinar.title}</h3>
                    <p className="text-white text-sm opacity-90">{webinar.duration}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (webinar.title === 'Building Your Yoga Brand from Scratch') {
                        setIsBrandingModalOpen(true);
                      } else if (webinar.title === 'Social Media Marketing for Yoga Teachers') {
                        setIsSocialMediaModalOpen(true);
                      } else if (webinar.title === 'Pricing Your Yoga Services for Profit') {
                        setIsPricingModalOpen(true);
                      } else {
                        window.open(webinar.videoUrl);
                      }
                    }}
                    className="absolute inset-0 flex items-center justify-center text-white hover:bg-black hover:bg-opacity-20 transition-all"
                  >
                    <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-blue-600 ml-1" />
                    </div>
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {webinar.instructor}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {webinar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Grow Your Yoga Business?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join our Teacher tier to access all business resources, templates, and ongoing mentorship.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pricing"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors"
              >
                View Pricing Plans
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-colors"
              >
                Get Personal Guidance
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Branding Modal */}
      <BrandingModal 
        isOpen={isBrandingModalOpen} 
        onClose={() => setIsBrandingModalOpen(false)} 
      />

      {/* Social Media Modal */}
      <SocialMediaModal 
        isOpen={isSocialMediaModalOpen} 
        onClose={() => setIsSocialMediaModalOpen(false)} 
      />

      {/* Pricing Modal */}
      <PricingModal 
        isOpen={isPricingModalOpen} 
        onClose={() => setIsPricingModalOpen(false)} 
      />
    </div>
  );
}