"use client";

import React, { useState, useEffect } from 'react';
import { Pose } from '@/types';
import { getPoses } from '@/lib/database';
import { Card } from '@/components/ui';

const PoseCard = ({ pose }: { pose: Pose }) => (
  <div className="card">
    <img src={pose.imageUrl} alt={pose.name} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h3 className="text-lg font-bold">{pose.name}</h3>
      <p className="text-sm text-muted-foreground">{pose.sanskritName}</p>
    </div>
  </div>
);

const PoseLibraryPage = () => {
  const [poses, setPoses] = useState<Pose[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPoses = async () => {
      setLoading(true);
      const fetchedPoses = await getPoses();
      setPoses(fetchedPoses);
      setLoading(false);
    };
    fetchPoses();
  }, []);

  const filteredPoses = poses.filter(pose =>
    pose.name.toLowerCase().includes(search.toLowerCase()) ||
    pose.sanskritName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  if (loading) {
    return <div>Loading...</div>; // TODO: Replace with a proper loading skeleton
  }

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
        {filteredPoses.map(pose => (
          <PoseCard key={pose.id} pose={pose} />
        ))}
      </div>
      {/* TODO: Add modal for pose details */}
    </div>
  );
};

export default PoseLibraryPage;
