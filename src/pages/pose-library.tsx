import { useEffect, useState, useRef } from 'react';
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
  const page = useRef(0);

  useEffect(() => {
    // Load recent poses from localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const recent = JSON.parse(localStorage.getItem('recentPoses') || '[]');
      setRecentPoses(recent);
    }
    
    // Generate search suggestions from pose names
    const suggestions = [
      'Downward Dog', 'Warrior', 'Tree Pose', 'Child\'s Pose', 'Cobra',
      'Mountain Pose', 'Forward Fold', 'Triangle', 'Plank', 'Bridge'
    ];
    setSearchSuggestions(suggestions);
  }, []);

  async function fetchPoses(isInit = false) {
    setLoading(true);
    let query = supabase.from('poses').select('*');

    // Apply filters (family, intensity)
    if (filters.family) query = query.eq('family_id', filters.family);
    if (filters.intensity) query = query.eq('intensity', filters.intensity);

    // Search by name/Sanskrit
    if (search)
      query = query.ilike('name_en', `%${search}%`).or(`name_sanskrit.ilike.%${search}%`);

    // Sorting
    if (sort === 'alphabetical') query = query.order('name_en');
    if (sort === 'intensity') query = query.order('intensity');
    if (sort === 'recent') query = query.order('created_at', { ascending: false });

    // Pagination
    query = query.range(page.current * PAGE_SIZE, (page.current + 1) * PAGE_SIZE - 1);

    const { data, error } = await query;

    if (error) {
      setLoading(false);
      return;
    }

    if (isInit) setPoses(data || []);
    else setPoses((prev) => [...prev, ...(data || [])]);

    setHasMore((data || []).length === PAGE_SIZE);
    setLoading(false);
  }

  useEffect(() => {
    page.current = 0;
    fetchPoses(true);
  }, [filters, search, sort]);

  useEffect(() => {
    function handleScroll() {
      if (loading || !hasMore) return;
      if (window.innerHeight + document.documentElement.scrollTop + 100 >= document.documentElement.offsetHeight) {
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <h1 className="text-2xl font-bold mb-4 dark:text-white">Pose Library</h1>
          
          <SearchBar 
            value={search} 
            onChange={setSearch} 
            suggestions={searchSuggestions}
          />
          
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
            {loading && <SkeletonLoader count={4} />}
          </div>

          {!loading && poses.length === 0 && search && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No poses found for "{search}". Try a different search term.
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