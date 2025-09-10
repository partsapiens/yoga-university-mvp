import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import PoseVideo from '../../components/PoseLibrary/PoseVideo';
import TTSPlayback from '../../components/PoseLibrary/TTSPlayback';
import UserNotes from '../../components/PoseLibrary/UserNotes';
import CommentsSection from '../../components/PoseLibrary/CommentsSection';
import FavoriteButton from '../../components/PoseLibrary/FavoriteButton';
import AddToFlowButton from '../../components/PoseLibrary/AddToFlowButton';

interface DetailedPose {
  id: string;
  slug: string;
  name_en: string;
  name_sanskrit: string;
  family_id: string;
  intensity: number;
  image_url?: string;
  meta?: any;
  video_url?: string;
  teaching_cues?: string;
}

export default function PoseDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [pose, setPose] = useState<DetailedPose | null>(null);

  useEffect(() => {
    if (!slug) return;
    supabase.from('poses').select('*').eq('slug', slug).single().then(({ data }) => setPose(data));
  }, [slug]);

  if (!pose) return <div className="max-w-2xl mx-auto p-6">Loading...</div>;

  const teachingCues = pose.teaching_cues || `Practice ${pose.name_en} with awareness. Focus on your breath and alignment.`;

  return (
    <div className="max-w-4xl mx-auto p-6 dark:bg-gray-900 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold dark:text-white">
                  {pose.name_en} 
                  <span className="text-gray-500 dark:text-gray-400 text-lg ml-2">
                    ({pose.name_sanskrit})
                  </span>
                </h1>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-blue-700 dark:text-blue-400">{pose.family_id}</span>
                  <span className="font-semibold dark:text-white">Intensity: {pose.intensity}/5</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <FavoriteButton poseId={pose.id} className="text-2xl text-yellow-500" />
                <AddToFlowButton pose={pose} />
              </div>
            </div>

            {pose.image_url && (
              <img 
                src={pose.image_url} 
                alt={pose.name_en} 
                className="w-full rounded mb-4 max-h-96 object-cover" 
              />
            )}

            {/* Video */}
            {pose.video_url && (
              <div className="mb-6">
                <h3 className="font-bold mb-2 dark:text-white">Video Demonstration</h3>
                <PoseVideo url={pose.video_url} title={`${pose.name_en} demonstration`} />
              </div>
            )}

            {/* Teaching Cues with TTS */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold dark:text-white">Teaching Cues</h3>
                <TTSPlayback text={teachingCues} />
              </div>
              <p className="text-gray-700 dark:text-gray-300">{teachingCues}</p>
            </div>

            {/* Anatomy & Meta Information */}
            {pose.meta && (
              <div className="mb-6">
                <h3 className="font-bold mb-2 dark:text-white">Anatomy & Benefits</h3>
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
                  <pre className="text-sm dark:text-gray-300 whitespace-pre-wrap">
                    {JSON.stringify(pose.meta, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <CommentsSection poseId={pose.id} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Notes */}
          <UserNotes poseId={pose.id} />
          
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold mb-3 dark:text-white">Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors">
                View Related Poses
              </button>
              <button className="w-full text-left px-3 py-2 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-100 dark:hover:bg-green-800 transition-colors">
                Create Practice with This Pose
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}