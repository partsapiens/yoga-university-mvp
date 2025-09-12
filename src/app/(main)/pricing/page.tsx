import React from 'react';
import Link from 'next/link';
import { Check, Star, Users, Zap, Crown, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: "Explorer",
      price: "Free",
      period: "forever",
      description: "Perfect for getting started with your yoga journey",
      features: [
        "Access to 100+ basic poses",
        "5 guided flows per month",
        "Basic meditation sessions",
        "Community forum access",
        "Mobile app access"
      ],
      limitations: [
        "Limited pose library",
        "Basic flow builder",
        "No offline access",
        "Community support only"
      ],
      cta: "Start Free",
      popular: false,
      icon: <Star className="w-6 h-6" />
    },
    {
      name: "Practitioner",
      price: "€19",
      period: "/month",
      description: "For dedicated practitioners looking to deepen their practice",
      features: [
        "Access to 500+ poses with detailed instructions",
        "Unlimited flow creation and sharing",
        "Advanced pose variations and modifications",
        "Offline access to all content",
        "Progress tracking and analytics",
        "Personalized recommendations",
        "Priority email support",
        "Monthly live Q&A sessions"
      ],
      limitations: [],
      cta: "Start 14-Day Free Trial",
      popular: true,
      icon: <Users className="w-6 h-6" />
    },
    {
      name: "Teacher",
      price: "€49",
      period: "/month",
      description: "Comprehensive tools for yoga teachers and studio owners",
      features: [
        "Everything in Practitioner",
        "Complete Teacher Training Manual",
        "Class planning and sequencing tools",
        "Student progress tracking",
        "Printable pose cards and sequences",
        "Advanced anatomy and alignment guides",
        "Business and marketing resources",
        "1-on-1 mentorship sessions",
        "Teacher certification pathway",
        "Studio management tools"
      ],
      limitations: [],
      cta: "Start Free Trial",
      popular: false,
      icon: <Crown className="w-6 h-6" />
    }
  ];

  const features = [
    {
      category: "Pose Library",
      explorer: "100+ basic poses",
      practitioner: "500+ detailed poses",
      teacher: "500+ poses + teaching cues"
    },
    {
      category: "Flow Builder",
      explorer: "Basic sequences",
      practitioner: "Advanced flow creation",
      teacher: "Class planning tools"
    },
    {
      category: "Offline Access",
      explorer: "❌",
      practitioner: "✅ Full library",
      teacher: "✅ Full library + teaching materials"
    },
    {
      category: "Progress Tracking",
      explorer: "❌",
      practitioner: "✅ Personal analytics",
      teacher: "✅ Personal + student tracking"
    },
    {
      category: "Support",
      explorer: "Community forum",
      practitioner: "Priority email support",
      teacher: "1-on-1 mentorship"
    },
    {
      category: "Training Materials",
      explorer: "❌",
      practitioner: "Basic guides",
      teacher: "Complete training manual"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Choose Your Path
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Whether you&apos;re starting your yoga journey or teaching others, we have a plan that grows with you. 
              All plans include our core features with no hidden fees.
            </p>
            <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-4 py-2 rounded-full text-sm font-medium">
              <Zap className="w-4 h-4" />
              <span>14-day free trial on all paid plans</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden ${
                plan.popular 
                  ? 'ring-2 ring-blue-500 transform scale-105' 
                  : 'hover:shadow-xl transition-shadow'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className={`p-6 ${plan.popular ? 'pt-12' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      plan.popular ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {plan.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                    {plan.period && (
                      <span className="text-gray-500 dark:text-gray-400 ml-1">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">{plan.description}</p>
                </div>

                <button 
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors mb-6 ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {plan.cta}
                </button>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">What&apos;s included:</h4>
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.limitations.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Limitations:</h5>
                      {plan.limitations.map((limitation, limitIndex) => (
                        <div key={limitIndex} className="flex items-start space-x-3">
                          <div className="w-5 h-5 mt-0.5 flex-shrink-0">
                            <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 mt-1"></div>
                          </div>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Compare Plans</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              See exactly what&apos;s included in each plan to find the perfect fit for your needs.
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-600">
                  <th className="text-left py-4 pr-6 font-semibold text-gray-900 dark:text-white">Features</th>
                  <th className="text-center px-6 py-4 font-semibold text-gray-900 dark:text-white">Explorer</th>
                  <th className="text-center px-6 py-4 font-semibold text-blue-600 dark:text-blue-400">Practitioner</th>
                  <th className="text-center px-6 py-4 font-semibold text-gray-900 dark:text-white">Teacher</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-4 pr-6 font-medium text-gray-900 dark:text-white">{feature.category}</td>
                    <td className="text-center px-6 py-4 text-gray-600 dark:text-gray-300">{feature.explorer}</td>
                    <td className="text-center px-6 py-4 text-gray-600 dark:text-gray-300">{feature.practitioner}</td>
                    <td className="text-center px-6 py-4 text-gray-600 dark:text-gray-300">{feature.teacher}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
        </div>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Can I change plans at any time?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, 
              and you&apos;ll be billed or credited proportionally.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Is there a long-term commitment?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              No contracts or long-term commitments. You can cancel your subscription at any time 
              and continue using your plan until the end of your billing period.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Do you offer student discounts?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Yes! We offer 50% off for verified students and recent graduates. 
              Contact us with your student ID for more information.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              What payment methods do you accept?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              We accept all major credit cards, PayPal, and bank transfers. 
              All payments are processed securely through our trusted payment partners.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Practice?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of practitioners who have deepened their understanding of yoga with our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/poses"
                className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-colors"
              >
                Explore Free Content
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}