"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export const Footer = () => {
  const [yogisInspired, setYogisInspired] = useState(0);

  // Load and increment Yogis Inspired counter
  useEffect(() => {
    const today = new Date().toDateString();
    const lastVisit = localStorage.getItem('lastVisitDate');
    const currentCount = parseInt(localStorage.getItem('yogisInspiredCount') || '42000', 10);

    if (lastVisit !== today) {
      // New day, increment counter
      const newCount = currentCount + 1;
      setYogisInspired(newCount);
      localStorage.setItem('yogisInspiredCount', newCount.toString());
      localStorage.setItem('lastVisitDate', today);
    } else {
      setYogisInspired(currentCount);
    }
  }, []);

  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://instagram.com/yogaflowuniversity',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.328-1.297L6.24 14.573c.569.569 1.297.879 2.113.879 1.657 0 3.002-1.345 3.002-3.002S9.01 9.448 7.353 9.448s-3.002 1.345-3.002 3.002c0 .816.31 1.544.879 2.113L4.112 15.68c-.807-.88-1.297-2.031-1.297-3.328 0-2.655 2.157-4.812 4.812-4.812s4.812 2.157 4.812 4.812-2.157 4.812-4.812 4.812z"/>
        </svg>
      )
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com/@yogaflowuniversity',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/yogaflowuni',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com/yogaflowuniversity',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    }
  ];

  const legalLinks = [
    { name: 'Imprint', href: '/legal/imprint' },
    { name: 'Privacy Policy', href: '/legal/privacy' },
    { name: 'Terms of Service', href: '/legal/terms' },
    { name: 'Legal Overview', href: '/legal' }
  ];

  const quickLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Pose Library', href: '/poses' },
    { name: 'Create Flow', href: '/flows/create' },
    { name: 'Meditation', href: '/meditation' },
    { name: 'Manual', href: '/manual' },
    { name: 'About', href: '/about' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand and Yogis Inspired Counter */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-3xl">🧘‍♀️</span>
              <span className="text-2xl font-bold text-blue-400">Yoga Flow University</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Empowering yoga practitioners and teachers with AI-powered flow creation, 
              comprehensive pose libraries, and mindful meditation practices.
            </p>
            
            {/* Yogis Inspired Counter */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {yogisInspired.toLocaleString()}
                </div>
                <div className="text-blue-100 text-sm font-medium">
                  Yogis Inspired Today
                </div>
                <div className="text-blue-200 text-xs mt-1">
                  Counter increments once per unique visitor per day
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="font-semibold text-white mb-3">Connect With Us</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Legal & Support</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="mailto:support@yogaflowuniversity.com"
                  className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                >
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Yoga Flow University. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>Made with 💙 for the yoga community</span>
              <div className="flex items-center space-x-1">
                <span>🌱</span>
                <span>Carbon neutral hosting</span>
              </div>
            </div>
          </div>
        </div>
      </div>


    </footer>
  );
};