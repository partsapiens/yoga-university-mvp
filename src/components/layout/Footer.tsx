"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export const Footer = () => {
  const [yogisInspired, setYogisInspired] = useState(0);

  // Load and increment Yogis Inspired counter
  useEffect(() => {
    // Use lifetime count instead of daily
    let currentCount = parseInt(localStorage.getItem('yogisInspiredLifetimeCount') || '42000', 10);
    
    // Check if this is first visit ever
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    
    if (!hasVisited) {
      // New visitor, increment lifetime counter
      currentCount = currentCount + 1;
      localStorage.setItem('yogisInspiredLifetimeCount', currentCount.toString());
      localStorage.setItem('hasVisitedBefore', 'true');
    }
    
    setYogisInspired(currentCount);
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
    { name: 'About', href: '/about' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      {/* Main Footer Content */}
      <div className="py-responsive">
        <div className="container-wide">
          <div className="grid-responsive grid-responsive-md-2 grid-responsive-lg-4 gap-6 lg:gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4 md:mb-6">
                <span className="text-3xl">🧘‍♀️</span>
                <span className="text-responsive-xl font-bold text-blue-400 dark:text-blue-300">Yoga Flow University</span>
              </div>
              <p className="text-responsive-sm text-gray-300 dark:text-gray-400 mb-6 max-w-md leading-relaxed">
                Empowering yoga practitioners and teachers with intelligent flow creation, 
                comprehensive pose libraries, and mindful meditation practices.
              </p>

              {/* Social Links */}
              <div>
                <h3 className="heading-responsive-3 text-white dark:text-gray-100 mb-3">Connect With Us</h3>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="touch-target p-3 text-gray-400 dark:text-gray-500 hover:text-blue-400 dark:hover:text-blue-300 transition-colors rounded-lg border border-gray-700 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-300"
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
              <h3 className="heading-responsive-3 text-white dark:text-gray-100 mb-4">Quick Links</h3>
              <ul className="space-responsive">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-responsive-sm text-gray-400 hover:text-blue-400 transition-colors block py-1 touch-target"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="heading-responsive-3 text-white mb-4">Legal & Support</h3>
              <ul className="space-responsive">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-responsive-sm text-gray-400 hover:text-blue-400 transition-colors block py-1 touch-target"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href="mailto:support@yogaflowuniversity.com"
                    className="text-responsive-sm text-gray-400 hover:text-blue-400 transition-colors block py-1 touch-target"
                  >
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-wide py-6">
          <div className="flex-responsive items-center justify-between">
            <div className="text-center-mobile text-gray-400 text-responsive-xs mb-4 md:mb-0 flex-responsive items-center gap-4">
              <span>© {new Date().getFullYear()} Yoga Flow University. All rights reserved.</span>
              <span className="hidden md:inline text-gray-500">•</span>
              <div className="flex items-center gap-2">
                <span className="text-responsive-sm font-medium text-blue-400">
                  {yogisInspired.toLocaleString()}
                </span>
                <span className="text-responsive-xs text-gray-400">
                  Yogis Inspired
                </span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center justify-center md:justify-start space-x-4 lg:space-x-6">
              <span className="text-responsive-xs text-gray-400">Follow us:</span>
              <div className="flex space-x-3">
                <a
                  href="https://instagram.com/yogaflowuniversity"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target p-2 text-gray-400 hover:text-blue-400 transition-colors rounded-lg"
                  aria-label="Follow us on Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://youtube.com/@yogaflowuniversity"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target p-2 text-gray-400 hover:text-blue-400 transition-colors rounded-lg"
                  aria-label="Subscribe to our YouTube channel"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a
                  href="https://facebook.com/yogaflowuniversity"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target p-2 text-gray-400 hover:text-blue-400 transition-colors rounded-lg"
                  aria-label="Like us on Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://linkedin.com/company/yogaflowuniversity"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target p-2 text-gray-400 hover:text-blue-400 transition-colors rounded-lg"
                  aria-label="Connect with us on LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};