"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useDebounce } from 'use-debounce';
import { Pose } from '@/types';
import { getPoses } from '@/lib/database';
import { Card } from '@/components/ui';

const PAGE_SIZE = 20;

const PoseCard = ({ pose }: { pose: Pose }) => (
    <div className="card">
        <Image src={pose.imageUrl} alt={pose.name} width={300} height={200} className="w-full h-48 object-cover" />
        <div className="p-4">
            <h3 className="text-lg font-bold">{pose.name}</h3>
            <p className="text-sm text-muted-foreground">{pose.sanskritName}</p>
        </div>
    </div>
);

const PoseLibraryPage = () => {
  const [poses, setPoses] = useState<Pose[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const loadPoses = useCallback(async (pageToLoad: number, searchToLoad: string, isNewSearch: boolean) => {
    setLoading(true);
    const fetchedPoses = await getPoses(pageToLoad, PAGE_SIZE, searchToLoad);
    if (fetchedPoses.length > 0) {
        setPoses(prev => isNewSearch ? fetchedPoses : [...prev, ...fetchedPoses]);
      if (fetchedPoses.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } else {
      setHasMore(false);
        if (isNewSearch) {
            setPoses([]);
        }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // We need to reset the state when the search term changes.
    setPoses([]);
    setPage(0);
    setHasMore(true);
  }, [debouncedSearch]);

  useEffect(() => {
    // a new search will reset the page to 0, so this will fire
    // on a new search, and also when the page is incremented by the observer
    loadPoses(page, debouncedSearch, page === 0);
  }, [page, debouncedSearch, loadPoses]);

  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage(prev => prev + 1);
      }
    });
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-8">Pose Library</h1>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by name or Sanskrit term..."
          className="input w-full md:w-1/2"
          value={search}
          onChange={handleSearch}
        />
        {/* TODO: Add category and difficulty filters */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {poses.map(pose => (
          <PoseCard key={pose.id} pose={pose} />
        ))}
      </div>
      <div ref={loaderRef} />
      {loading && <div className="col-span-full text-center p-8">Loading more poses...</div>}
      {!hasMore && <div className="col-span-full text-center p-8 text-muted-foreground">You've reached the end.</div>}
      {/* TODO: Add modal for pose details */}
    </div>
  );
};

export default PoseLibraryPage;
