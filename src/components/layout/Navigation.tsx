"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserRole } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

// Type declarations for speech recognition API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface NavigationProps {
  userRole?: UserRole;
}

export const Navigation = ({ userRole }: NavigationProps) => {
  const { language, setLanguage, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [voiceControlEnabled, setVoiceControlEnabled] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load preferences from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedTts = localStorage.getItem('ttsEnabled') === 'true';
    const savedVoiceControl = localStorage.getItem('voiceControlEnabled') === 'true';

    setDarkMode(savedDarkMode);
    setTtsEnabled(savedTts);
    setVoiceControlEnabled(savedVoiceControl);
    
    // Apply dark mode class
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const navItems = [
    { href: '/dashboard', label: t('nav.dashboard') },
    { href: '/poses', label: t('nav.poses') },
    { href: '/flows/create', label: t('nav.flows') },
    { href: '/meditation', label: t('nav.meditation') },
    { href: '/manual', label: t('nav.manual') },
    { href: '/about', label: t('nav.about') },
    { href: '/pricing', label: t('nav.pricing') },
  ];

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleVoiceControl = () => {
    const newVoiceControl = !voiceControlEnabled;
    setVoiceControlEnabled(newVoiceControl);
    localStorage.setItem('voiceControlEnabled', newVoiceControl.toString());

    if (newVoiceControl) {
      console.log('Voice control enabled');
      // Test voice recognition availability
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        console.log('Voice recognition is available');
      } else {
        console.log('Voice recognition not supported in this browser');
        alert('Voice recognition is not supported in your browser');
        setVoiceControlEnabled(false);
        localStorage.setItem('voiceControlEnabled', 'false');
      }
    } else {
      console.log('Voice control disabled');
      setIsVoiceListening(false);
    }
  };

  const startVoiceListening = () => {
    if (!voiceControlEnabled) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice recognition is not supported in your browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    setIsVoiceListening(true);

    recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase();
      console.log('Voice command:', command);

      // Basic voice commands
      if (command.includes('go home') || command.includes('home page')) {
        window.location.href = '/';
      } else if (command.includes('meditation') || command.includes('meditate')) {
        window.location.href = '/meditation';
      } else if (command.includes('poses') || command.includes('pose library')) {
        window.location.href = '/poses';
      } else if (command.includes('create flow') || command.includes('new flow')) {
        window.location.href = '/flows/create';
      } else if (command.includes('dashboard')) {
        window.location.href = '/dashboard';
      } else if (command.includes('search')) {
        setSearchOpen(true);
      } else {
        console.log('Command not recognized:', command);
        // Show a visual feedback that command wasn't recognized
        alert(`Command "${command}" not recognized. Try saying: "go home", "meditation", "poses", "create flow", "dashboard", or "search"`);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Voice recognition error:', event.error);
      setIsVoiceListening(false);
    };

    recognition.onend = () => {
      setIsVoiceListening(false);
    };

    recognition.start();
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang as 'en' | 'de' | 'ro' | 'ru');

    // Apply language to document for basic support
    document.documentElement.lang = newLang;

    console.log('Language changed to:', newLang);

    // Show user feedback about language functionality
    const messages = {
      en: 'Language set to English',
      de: 'Sprache auf Deutsch eingestellt',
      ru: 'Язык установлен на русский',
      ro: 'Limba setată în română'
    };

    const message = messages[newLang as keyof typeof messages] || messages.en;

    console.log(message);

    // For now, show a brief visual feedback
    setTimeout(() => {
      console.log(`Translation system activated for ${newLang.toUpperCase()}`);
    }, 100);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Basic search functionality implementation
      console.log('Searching for:', searchQuery);

      // Navigate to poses page with search query
      // In a real app, you would pass this as a URL parameter or use a search API
      const searchParams = new URLSearchParams({ q: searchQuery.trim() });
      window.location.href = `/poses?${searchParams.toString()}`;

      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container-wide">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 touch-target">
            <span className="text-2xl">🧘‍♀️</span>
            <span className="text-responsive-lg font-bold text-blue-600 dark:text-blue-400">
              Yoga Flow
            </span>
          </Link>

          {/* Main Navigation - Desktop */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-item-responsive text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side Tools */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="touch-target p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Voice Control Toggle */}
            <button
              onClick={toggleVoiceControl}
              className={`p-2 rounded-lg transition-colors ${
                voiceControlEnabled
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
              aria-label="Toggle Voice Control"
              title="Voice Control"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>

            {/* Voice Listening Button - Only show when voice control is enabled */}
            {voiceControlEnabled && (
              <button
                onClick={startVoiceListening}
                disabled={isVoiceListening}
                className={`p-2 rounded-lg transition-colors ${
                  isVoiceListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
                aria-label={isVoiceListening ? 'Listening...' : 'Start Voice Command'}
                title={isVoiceListening ? 'Listening...' : 'Speak a command'}
              >
                {isVoiceListening ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                )}
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Notifications Bell */}
            <button
              onClick={() => {
                // Simple notification functionality - in a real app this would show a notification panel
                console.log('Notifications clicked');
                alert('Notifications feature coming soon! 🔔');
              }}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative"
              aria-label="Notifications"
              title="Notifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 21.5a2.5 2.5 0 005 0M7 7v2a7 7 0 0014 0V7" />
              </svg>
              {/* Notification dot placeholder */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Language Switcher */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-gray-700 dark:text-gray-300 focus:outline-none focus:border-blue-500"
                title="Language selection"
              >
                <option value="en" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">EN</option>
                <option value="de" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">DE</option>
                <option value="ro" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">RO</option>
                <option value="ru" className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">RU</option>
              </select>
            </div>

            {/* Contact Icon */}
            <Link
              href="/contact"
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label="Contact"
              title="Contact Us"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </Link>

            {/* Profile Icon */}
            <button
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label="Profile"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="py-4 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search poses, flows, techniques..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
