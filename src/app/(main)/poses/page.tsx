"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Pose } from '@/types';
import { searchPoses, getPoses } from '@/lib/database';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useDebounce } from '@/hooks/useDebounce';

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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchPoses = useCallback(async (query: string) => {
    setLoading(true);
    const fetchedPoses = query ? await searchPoses(query) : await getPoses();
    setPoses(fetchedPoses);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPoses(debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchPoses]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-8">Pose Library</h1>

      <div className="mb-8">
        <Input
          type="text"
          placeholder="Search by name or Sanskrit term..."
          className="w-full md:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* TODO: Add category and difficulty filters */}
      </div>

      {loading ? (
        <div>Loading...</div> // TODO: Replace with a proper loading skeleton
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {poses.map(pose => (
            <PoseCard key={pose.id} pose={pose} />
          ))}
        </div>
      )}
      {/* TODO: Add modal for pose details */}
    </div>
  );
};

export default PoseLibraryPage;
