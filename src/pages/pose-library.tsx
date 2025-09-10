import { useEffect, useState, useRef } from 'react';
import { supabase } from '../utils/supabaseClient';
import PoseCard from '../components/PoseLibrary/PoseCard';
import Filters from '../components/PoseLibrary/Filters';
import SkeletonLoader from '../components/PoseLibrary/SkeletonLoader';
import SearchBar from '../components/PoseLibrary/SearchBar';

const PAGE_SIZE = 20;

export default function PoseLibraryPage() {
  const [poses, setPoses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('alphabetical');
  const page = useRef(0);

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pose Library</h1>
      <SearchBar value={search} onChange={setSearch} />
      <Filters filters={filters} setFilters={setFilters} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {poses.map((pose) => (
          <PoseCard key={pose.id} pose={pose} />
        ))}
        {loading && <SkeletonLoader count={4} />}
      </div>
    </div>
  );
}