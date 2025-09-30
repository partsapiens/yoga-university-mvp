"use client";

import React, { useState } from 'react';
import { Mail, MapPin, Clock, MessageCircle, Users, BookOpen, CreditCard, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic form validation
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      // In a real application, you would send this to your backend API
      // For now, we'll simulate the submission and provide user feedback
      console.log('Form submitted:', formData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: '',
        message: ''
      });
      
      alert('Thank you for your message! We\'ll get back to you within 24 hours.');
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error sending your message. Please try again.');
    }
  };

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support",
      description: "Get help with technical issues, billing, or general questions",
      contact: "support@fltwht.com",
      responseTime: "Within 24 hours"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Live Chat",
      description: "Quick answers to your questions",
      contact: "Available in app",
      responseTime: "Mon-Fri, 9AM-6PM CET"
    }
  ];

  const supportCategories = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Account & Billing",
      description: "Help with subscriptions, payments, and account management",
      topics: ["Subscription changes", "Payment issues", "Account recovery", "Refund requests"]
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Learning & Content",
      description: "Questions about poses, flows, and educational materials",
      topics: ["Pose instructions", "Flow building", "Teacher training", "Mobile app help"]
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Technical Support",
      description: "Technical issues with our platform or mobile app",
      topics: ["Login problems", "App crashes", "Video playback", "Sync issues"]
    }
  ];

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "Click 'Forgot Password' on the login page and follow the instructions sent to your email."
    },
    {
      question: "Can I download content for offline use?",
      answer: "Yes! Practitioner and Teacher plan subscribers can download poses, flows, and videos for offline access."
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can cancel anytime from your account settings or by contacting our support team."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for annual subscriptions and 14-day free trials for all paid plans."
    },
    {
      question: "Is the content suitable for beginners?",
      answer: "Absolutely! We have content for all levels, with clear difficulty indicators and modification options."
    },
    {
      question: "How often is new content added?",
      answer: "We add new poses, flows, and educational content weekly, plus monthly live sessions and workshops."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              We&apos;re Here to Help
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Have a question about your practice, our platform, or need technical support? 
              Our team is ready to assist you on your yoga journey.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                24-hour response time
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Expert support team
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Get in Touch</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">Choose the method that works best for you</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {contactMethods.map((method, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                {method.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {method.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {method.description}
              </p>
              <div className="text-blue-600 font-medium mb-2">
                {method.contact}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {method.responseTime}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form and Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  <option value="account">Account & Billing</option>
                  <option value="technical">Technical Support</option>
                  <option value="content">Learning & Content</option>
                  <option value="general">General Question</option>
                  <option value="feedback">Feedback & Suggestions</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Please provide as much detail as possible..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
              >
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </button>
            </form>
          </div>

          {/* Support Categories */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How Can We Help?</h2>
            <div className="space-y-6">
              {supportCategories.map((category, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {category.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {category.description}
                      </p>
                      <ul className="text-sm text-gray-500 space-y-1">
                        {category.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">
              Quick answers to common questions
            </p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Office Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Visit Our Studio</h2>
              <p className="text-blue-100 mb-6">
                While we&apos;re primarily online, our team is based in Berlin. We occasionally host 
                in-person workshops and teacher trainings.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3" />
                  <span>Musterstraße 123, 10115 Berlin, Germany</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-3" />
                  <span>Monday - Friday: 9:00 AM - 6:00 PM CET</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-3" />
                  <span>hello@fltwht.com</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-6xl">🧘‍♀️</div>
              </div>
              <p className="text-blue-100">
                We&apos;d love to hear from you!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}