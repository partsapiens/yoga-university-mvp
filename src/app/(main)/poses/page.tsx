"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Pose } from '@/types/yoga';
import { getPoses } from '@/lib/database';
import { useDebounce } from '@/hooks/useDebounce';

const PoseCard = ({ pose }: { pose: Pose }) => (
    <div className="bg-card text-card-foreground rounded-2xl border shadow-sm p-4 flex flex-col items-center justify-center text-center">
        <div className="text-5xl mb-2">{pose.icon}</div>
        <h3 className="text-lg font-bold">{pose.name}</h3>
        <p className="text-sm text-muted-foreground">{pose.sanskrit}</p>
    </div>
);

const PoseLibraryPage = () => {
  const [poses, setPoses] = useState<Pose[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const loadPoses = useCallback(async (isNewSearch: boolean) => {
    if (loading || (!hasMore && !isNewSearch)) return;
    setLoading(true);

    const currentPage = isNewSearch ? 0 : page;
    const fetchedPoses = await getPoses({ page: currentPage, searchQuery: debouncedSearchQuery });

    if (fetchedPoses.length === 0) {
      setHasMore(false);
    } else {
      setPoses(prevPoses => isNewSearch ? fetchedPoses : [...prevPoses, ...fetchedPoses]);
      setPage(prevPage => currentPage + 1);
    }
    setLoading(false);
  }, [loading, hasMore, page, debouncedSearchQuery]);

  // Effect for initial load and search changes
  useEffect(() => {
    setPoses([]);
    setPage(0);
    setHasMore(true);
    loadPoses(true);
  }, [debouncedSearchQuery]);

  // Effect for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadPoses(false);
      }
    }, { threshold: 1.0 });

    const loader = loaderRef.current;
    if (loader) {
      observer.observe(loader);
    }

    return () => {
      if (loader) {
        observer.unobserve(loader);
      }
    };
  }, [loadPoses]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-8">Pose Library</h1>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by name..."
          className="input w-full md:w-1/2 p-2 border rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {poses.map(pose => (
          <PoseCard key={pose.id} pose={pose} />
        ))}
      </div>

      <div ref={loaderRef} className="flex justify-center items-center p-8">
        {loading && <p>Loading more poses...</p>}
        {!hasMore && poses.length > 0 && <p>You've reached the end of the list.</p>}
        {!hasMore && poses.length === 0 && !loading && <p>No poses found for your search.</p>}
      </div>
    </div>
  );
};

export default PoseLibraryPage;
