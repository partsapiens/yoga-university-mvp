import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

export default function PoseDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [pose, setPose] = useState(null);

  useEffect(() => {
    if (!slug) return;
    supabase.from('poses').select('*').eq('slug', slug).single().then(({ data }) => setPose(data));
  }, [slug]);

  if (!pose) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">  
      <img src={pose.image_url} alt={pose.name_en} className="w-full rounded mb-4" />  
      <h2 className="text-3xl font-bold">{pose.name_en} <span className="text-gray-500 text-lg">({pose.name_sanskrit})</span></h2>  
      <div className="mt-2 text-blue-700">{pose.family_id}</div>  
      <div className="mt-2 font-semibold">Intensity: {pose.intensity}</div>  
      {/* Anatomy breakdown, teaching cues, relationships, etc. */}  
      <div className="mt-4">  
        <h3 className="font-bold">Anatomy</h3>  
        <pre className="bg-gray-100 p-3 rounded">{JSON.stringify(pose.meta, null, 2)}</pre>  
      </div>  
      {/* Add TTS playback etc. */}  
    </div>
  );
}