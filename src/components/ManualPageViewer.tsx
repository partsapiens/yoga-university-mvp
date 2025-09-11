'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Moon, Sun, Bookmark, FileText, Type, Highlighter, StickyNote, Search, Eye } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SkeletonLoader from './PoseLibrary/SkeletonLoader';

interface PageData {
  page_number: number;
  title: string;
  content: string;
  chapter: string;
  slug: string;
  summary: string;
}

interface PageManifest {
  title: string;
  version: string;
  totalPages: number;
  pages: Array<{
    page_number: number;
    title: string;
    chapter: string;
    slug: string;
    summary: string;
  }>;
}

interface ManualPageViewerProps {
  pageNumber: number;
}

export default function ManualPageViewer({ pageNumber }: ManualPageViewerProps) {
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [manifest, setManifest] = useState<PageManifest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [lineHeight, setLineHeight] = useState<'normal' | 'relaxed' | 'loose'>('normal');
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState<string>('');
  const [highlightMode, setHighlightMode] = useState(false);
  const [highlights, setHighlights] = useState<string[]>([]);

  // Load preferences from localStorage
  useEffect(() => {
    const savedPrefs = localStorage.getItem('manual-preferences');
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);
      setIsDarkMode(prefs.isDarkMode || false);
      setFontSize(prefs.fontSize || 'medium');
      setLineHeight(prefs.lineHeight || 'normal');
    }

    const savedBookmarks = localStorage.getItem('manual-bookmarks');
    if (savedBookmarks) {
      const bookmarks = JSON.parse(savedBookmarks);
      setIsBookmarked(bookmarks.includes(pageNumber));
    }
  }, [pageNumber]);

  // Load notes for current page
  useEffect(() => {
    const savedNotes = localStorage.getItem(`manual-notes-${pageNumber}`);
    if (savedNotes) {
      setNotes(savedNotes);
    } else {
      setNotes('');
    }

    const savedHighlights = localStorage.getItem(`manual-highlights-${pageNumber}`);
    if (savedHighlights) {
      setHighlights(JSON.parse(savedHighlights));
    } else {
      setHighlights([]);
    }
  }, [pageNumber]);

  // Save preferences to localStorage
  const savePreferences = () => {
    const prefs = { isDarkMode, fontSize, lineHeight };
    localStorage.setItem('manual-preferences', JSON.stringify(prefs));
  };

  // Save notes
  const saveNotes = (newNotes: string) => {
    setNotes(newNotes);
    localStorage.setItem(`manual-notes-${pageNumber}`, newNotes);
  };

  // Toggle bookmark
  const toggleBookmark = () => {
    const savedBookmarks = localStorage.getItem('manual-bookmarks');
    let bookmarks = savedBookmarks ? JSON.parse(savedBookmarks) : [];
    
    if (isBookmarked) {
      bookmarks = bookmarks.filter((p: number) => p !== pageNumber);
    } else {
      bookmarks.push(pageNumber);
    }
    
    localStorage.setItem('manual-bookmarks', JSON.stringify(bookmarks));
    setIsBookmarked(!isBookmarked);
  };

  // Format content to fix the "wall of text" issue
  const formatContent = (content: string) => {
    if (!content) return content;
    
    // Add proper paragraph breaks and formatting for Sanskrit terms and key concepts
    let formatted = content
      // Split long run-on sentences into paragraphs
      .replace(/([.!?])\s*([A-Z][a-z])/g, '$1\n\n$2')
      // Handle Sanskrit terms with proper formatting
      .replace(/([a-z])([A-Z][a-z]*)/g, '$1 $2')
      // Add space before capital letters that follow lowercase
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      // Fix specific patterns like "chakrasChakra" 
      .replace(/chakras([A-Z])/g, 'chakras. $1')
      // Add breaks before common section starters
      .replace(/(INBALANCE|OUTOFBALANCE|sanskrit:|meaning:|location:|color:|essence:|governs:|actions:|postures)/g, '\n\n**$1**')
      // Clean up multiple spaces
      .replace(/\s+/g, ' ')
      // Clean up excessive line breaks
      .replace(/\n\s*\n\s*\n/g, '\n\n');

    return formatted;
  };

  // Sanskrit glossary data
  const sanskritTerms = {
    'Chakra': 'Sanskrit word meaning "wheel" or "disc", referring to energetic centers in the body',
    'Prana': 'Life force or vital energy that flows through the body',
    'Asana': 'Physical postures in yoga practice',
    'Pranayama': 'Breathing techniques and breath control practices',
    'Vinyasa': 'Flow or connection between poses',
    'Mantra': 'Sacred sounds or phrases used in meditation',
    'Mudra': 'Hand gestures that channel energy',
    'Bandha': 'Energy locks used to direct prana',
    'Drishti': 'Focused gaze or concentration point',
    'Sadhana': 'Spiritual practice or discipline'
  };

  // Add Sanskrit term tooltips to content
  const addSanskritTooltips = (content: string) => {
    let processed = content;
    Object.entries(sanskritTerms).forEach(([term, definition]) => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      processed = processed.replace(regex, `<span class="sanskrit-term" title="${definition}">${term}</span>`);
    });
    return processed;
  };
  useEffect(() => {
    fetch('/manual/page-manifest.json')
      .then(res => res.json())
      .then((data: PageManifest) => setManifest(data))
      .catch(err => console.error('Failed to load manifest:', err));
  }, []);

  // Load page data when pageNumber changes
  useEffect(() => {
    if (!manifest) return;
    
    if (pageNumber < 1 || pageNumber > manifest.totalPages) {
      setError(`Page ${pageNumber} not found. Valid pages: 1-${manifest.totalPages}`);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const pageFile = `page_${String(pageNumber).padStart(3, '0')}.json`;
    
    fetch(`/manual/pages-data/${pageFile}`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load page ${pageNumber}`);
        return res.json();
      })
      .then((data: PageData) => {
        setPageData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [pageNumber, manifest]);

  // Toggle dark mode and save preferences
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    setTimeout(savePreferences, 100);
  };

  // Update font size and save preferences
  const updateFontSize = (newSize: 'small' | 'medium' | 'large') => {
    setFontSize(newSize);
    setTimeout(savePreferences, 100);
  };

  // Update line height and save preferences  
  const updateLineHeight = (newHeight: 'normal' | 'relaxed' | 'loose') => {
    setLineHeight(newHeight);
    setTimeout(savePreferences, 100);
  };

  // Get navigation info
  const getNavigationInfo = () => {
    if (!manifest) return { hasPrev: false, hasNext: false, total: 0 };
    
    return {
      hasPrev: pageNumber > 1,
      hasNext: pageNumber < manifest.totalPages,
      total: manifest.totalPages
    };
  };

  const { hasPrev, hasNext, total } = getNavigationInfo();

  // Get Table of Contents grouped by chapter
  const getTableOfContents = () => {
    if (!manifest) return {};
    
    const toc: Record<string, Array<{ page_number: number; title: string; slug: string }>> = {};
    
    manifest.pages.forEach(page => {
      if (!toc[page.chapter]) {
        toc[page.chapter] = [];
      }
      toc[page.chapter].push({
        page_number: page.page_number,
        title: page.title,
        slug: page.slug
      });
    });
    
    return toc;
  };

  const tableOfContents = getTableOfContents();

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <div className="container mx-auto px-4 py-8">
          <SkeletonLoader count={6} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Page</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link 
            href="/manual" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Back to Manual
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/manual" className="flex items-center text-blue-600 hover:text-blue-700">
                <BookOpen className="w-5 h-5 mr-2" />
                Manual
              </Link>
              <span className="text-sm text-gray-500">
                Page {pageNumber} of {total}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Table of Contents Toggle */}
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className={`p-2 rounded-md transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                title="Table of Contents"
              >
                <FileText className="w-5 h-5" />
              </button>
              
              {/* Bookmark Toggle */}
              <button
                onClick={toggleBookmark}
                className={`p-2 rounded-md transition-colors ${
                  isBookmarked 
                    ? 'text-yellow-500' 
                    : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                title="Bookmark Page"
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>

              {/* Font Size Controls */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => updateFontSize('small')}
                  className={`p-2 rounded-md transition-colors ${
                    fontSize === 'small' 
                      ? 'bg-blue-100 text-blue-700' 
                      : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                  title="Small Text"
                >
                  <Type className="w-4 h-4" />
                </button>
                <button
                  onClick={() => updateFontSize('medium')}
                  className={`p-2 rounded-md transition-colors ${
                    fontSize === 'medium' 
                      ? 'bg-blue-100 text-blue-700' 
                      : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                  title="Medium Text"
                >
                  <Type className="w-5 h-5" />
                </button>
                <button
                  onClick={() => updateFontSize('large')}
                  className={`p-2 rounded-md transition-colors ${
                    fontSize === 'large' 
                      ? 'bg-blue-100 text-blue-700' 
                      : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                  title="Large Text"
                >
                  <Type className="w-6 h-6" />
                </button>
              </div>

              {/* Reading Mode Toggle */}
              <button
                onClick={() => setHighlightMode(!highlightMode)}
                className={`p-2 rounded-md transition-colors ${
                  highlightMode 
                    ? 'bg-yellow-100 text-yellow-700' 
                    : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                title="Highlight Mode"
              >
                <Highlighter className="w-5 h-5" />
              </button>

              {/* Notes Toggle */}
              <button
                onClick={() => setShowNotes(!showNotes)}
                className={`p-2 rounded-md transition-colors ${
                  showNotes 
                    ? 'bg-green-100 text-green-700' 
                    : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                title="Notes"
              >
                <StickyNote className="w-5 h-5" />
              </button>
              
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-md transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                title="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Table of Contents */}
        {showSidebar && (
          <aside className={`w-80 border-r transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <div className="p-4 h-screen overflow-y-auto">
              <h3 className="font-semibold mb-4">Table of Contents</h3>
              {Object.entries(tableOfContents).map(([chapter, pages]) => (
                <div key={chapter} className="mb-6">
                  <h4 className={`font-medium mb-2 text-sm uppercase tracking-wide ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {chapter}
                  </h4>
                  <ul className="space-y-1">
                    {pages.map(page => (
                      <li key={page.page_number}>
                        <Link
                          href={`/manual/page/${page.page_number}`}
                          className={`block p-2 rounded text-sm transition-colors ${
                            page.page_number === pageNumber
                              ? 'bg-blue-100 text-blue-700 font-medium'
                              : isDarkMode 
                                ? 'hover:bg-gray-700 text-gray-300' 
                                : 'hover:bg-gray-100 text-gray-600'
                          }`}
                        >
                          <span className="text-xs text-gray-500 mr-2">
                            {page.page_number}
                          </span>
                          {page.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            {pageData && (
              <>
                <article className={`prose max-w-none transition-colors ${
                  fontSize === 'small' ? 'prose-sm' : fontSize === 'large' ? 'prose-lg' : 'prose-base'
                } ${
                  lineHeight === 'relaxed' ? 'prose-relaxed' : lineHeight === 'loose' ? 'prose-loose' : ''
                } ${
                  isDarkMode 
                    ? 'prose-invert prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white' 
                    : 'prose-gray'
                }`}>
                  <header className="mb-8">
                    <h1 className="mb-2">{pageData.title}</h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Chapter: {pageData.chapter}</span>
                      <span>•</span>
                      <span>Page {pageData.page_number}</span>
                      <span>•</span>
                      <span>~{Math.ceil(formatContent(pageData.content).split(' ').length / 200)} min read</span>
                    </div>
                  </header>
                  
                  <div className="content relative">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({children}) => (
                          <p className={`mb-4 ${
                            lineHeight === 'relaxed' ? 'leading-relaxed' : 
                            lineHeight === 'loose' ? 'leading-loose' : 'leading-normal'
                          }`}>
                            {children}
                          </p>
                        ),
                        strong: ({children}) => (
                          <strong className="font-semibold text-blue-600 dark:text-blue-400">
                            {children}
                          </strong>
                        ),
                        em: ({children}) => (
                          <em className="italic text-purple-600 dark:text-purple-400 font-medium">
                            {children}
                          </em>
                        )
                      }}
                    >
                      {formatContent(pageData.content)}
                    </ReactMarkdown>
                  </div>
                </article>

                {/* Notes Panel */}
                {showNotes && (
                  <div className={`mt-8 p-4 border rounded-lg ${
                    isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <h3 className="font-semibold mb-3 flex items-center">
                      <StickyNote className="w-5 h-5 mr-2" />
                      Your Notes for Page {pageNumber}
                    </h3>
                    <textarea
                      value={notes}
                      onChange={(e) => saveNotes(e.target.value)}
                      placeholder="Add your notes about this page..."
                      className={`w-full h-32 p-3 border rounded-md resize-none ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Navigation Footer */}
          <footer className={`sticky bottom-0 border-t transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div>
                  {hasPrev ? (
                    <Link
                      href={`/manual/page/${pageNumber - 1}`}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Link>
                  ) : (
                    <div></div>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    min="1"
                    max={total}
                    value={pageNumber}
                    onChange={(e) => {
                      const newPage = parseInt(e.target.value, 10);
                      if (newPage >= 1 && newPage <= total) {
                        window.location.href = `/manual/page/${newPage}`;
                      }
                    }}
                    className={`w-20 px-2 py-1 text-center border rounded ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300'
                    }`}
                  />
                  <span className="text-sm text-gray-500">of {total}</span>
                </div>

                <div>
                  {hasNext ? (
                    <Link
                      href={`/manual/page/${pageNumber + 1}`}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}