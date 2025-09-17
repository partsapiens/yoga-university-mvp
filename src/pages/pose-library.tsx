import { useEffect, useState, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import { supabase } from '../utils/supabaseClient';
import PoseCard from '../components/PoseLibrary/PoseCard';
import Filters from '../components/PoseLibrary/Filters';
import SkeletonLoader from '../components/PoseLibrary/SkeletonLoader';
import SearchBar from '../components/PoseLibrary/SearchBar';
import GridNavigation from '../components/PoseLibrary/GridNavigation';
import RecentPosesWidget from '../components/Dashboard/RecentPosesWidget';

const PAGE_SIZE = 20;

export default function PoseLibraryPage() {
  const [poses, setPoses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<{ family?: string; intensity?: number }>({});
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('alphabetical');
  const [recentPoses, setRecentPoses] = useState<any[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [currentFlowCount, setCurrentFlowCount] = useState(0);
  const page = useRef(0);

  useEffect(() => {
    // Load recent poses from localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const recent = JSON.parse(localStorage.getItem('recentPoses') || '[]');
      setRecentPoses(recent);
      
      // Load current flow count
      const currentFlow = JSON.parse(localStorage.getItem('currentFlow') || '[]');
      setCurrentFlowCount(currentFlow.length);
    }
    
    // Generate search suggestions from pose names
    const suggestions = [
      'Downward Dog', 'Warrior', 'Tree Pose', 'Child\'s Pose', 'Cobra',
      'Mountain Pose', 'Forward Fold', 'Triangle', 'Plank', 'Bridge'
    ];
    setSearchSuggestions(suggestions);

    // Listen for storage changes to update flow count
    const handleStorageChange = () => {
      const currentFlow = JSON.parse(localStorage.getItem('currentFlow') || '[]');
      setCurrentFlowCount(currentFlow.length);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  async function fetchPoses(isInit = false) {
    setLoading(true);
    
    // Use the API endpoint instead of direct Supabase calls for better performance
    const params = new URLSearchParams();
    
    // Apply filters (family -> category, intensity -> level mapping)
    if (filters.family) params.set('category', filters.family);
    if (filters.intensity) {
      const level = filters.intensity <= 2 ? 'beginner' : filters.intensity <= 4 ? 'intermediate' : 'advanced';
      params.set('level', level);
    }
    
    if (search) params.set('search', search);
    params.set('page', (page.current + 1).toString());
    params.set('limit', PAGE_SIZE.toString());

    try {
      const response = await fetch(`/api/poses?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch poses');
      }
      
      const result = await response.json();
      const data = result.data || [];

      if (isInit) setPoses(data);
      else setPoses((prev) => [...prev, ...data]);

      setHasMore(data.length === PAGE_SIZE);
    } catch (error) {
      console.error('Error fetching poses:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    page.current = 0;
    fetchPoses(true);
  }, [filters, search, sort]);

  useEffect(() => {
    function handleScroll() {
      if (loading || !hasMore) return;
      
      const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
      const threshold = document.documentElement.offsetHeight - 1000; // Load more when 1000px from bottom
      
      if (scrollPosition >= threshold) {
        page.current += 1;
        fetchPoses();
      }
    }
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  const handlePoseSelect = (pose: any) => {
    window.location.href = `/pose/${pose.slug}`;
  };

  return (
    <div className="container mx-auto p-4 dark:bg-gray-900 min-h-screen">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
          },
        }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold dark:text-white">Pose Library</h1>
            <button
              onClick={() => window.location.href = '/flows/create'}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
            >
              View Current Flow
              {currentFlowCount > 0 && (
                <span className="bg-blue-800 text-xs px-2 py-1 rounded-full">
                  {currentFlowCount}
                </span>
              )}
            </button>
          </div>
          
          <SearchBar 
            value={search} 
            onChange={setSearch} 
            suggestions={searchSuggestions}
          />

          {!search && (
            <div className="mt-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                <span>ℹ️</span>
                <span>Showing main poses only. Search to include variations.</span>
              </div>
            </div>
          )}
          
          <div className="my-4">
            <Filters filters={filters} setFilters={setFilters} />
          </div>

          {/* Sort Options */}
          <div className="mb-4">
            <select 
              value={sort} 
              onChange={e => setSort(e.target.value)}
              className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="alphabetical">Alphabetical</option>
              <option value="intensity">By Intensity</option>
              <option value="recent">Recently Added</option>
            </select>
          </div>

          {/* Grid Navigation for Accessibility */}
          <GridNavigation items={poses} onSelect={handlePoseSelect} />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {poses.map((pose) => (
              <PoseCard key={pose.id} pose={pose} />
            ))}
          </div>

          {loading && page.current === 0 && <SkeletonLoader count={PAGE_SIZE} />}
          
          {loading && page.current > 0 && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-500 dark:text-gray-400">Loading more poses...</span>
            </div>
          )}

          {!loading && !hasMore && poses.length > 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>You&apos;ve reached the end of the pose library!</p>
              <p className="text-sm mt-1">Found {poses.length} poses</p>
            </div>
          )}

          {!loading && poses.length === 0 && !search && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <div className="text-6xl mb-4">🧘‍♀️</div>
              <h3 className="text-lg font-medium mb-2">No poses found</h3>
              <p>Try adjusting your filters or check back later.</p>
            </div>
          )}

          {!loading && poses.length === 0 && search && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-4">🔍</div>
              <p>No poses found for &ldquo;{search}&rdquo;</p>
              <p className="text-sm mt-1">Try a different search term or browse all poses.</p>
              <button 
                onClick={() => setSearch('')}
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Poses Widget */}
          <RecentPosesWidget poses={recentPoses} />

          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-3 dark:text-white">Library Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between dark:text-gray-300">
                <span>Total Poses:</span>
                <span className="font-medium">{poses.length}+</span>
              </div>
              <div className="flex justify-between dark:text-gray-300">
                <span>Favorites:</span>
                <span className="font-medium">
                  {typeof window !== 'undefined' 
                    ? JSON.parse(localStorage.getItem('yogaFavorites') || '[]').length 
                    : 0}
                </span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
            <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">💡 Tip</h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Use the star icon to save your favorite poses for quick access later!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}