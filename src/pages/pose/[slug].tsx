import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getPosesFromDatabase } from '../../lib/database';
import PoseVideo from '../../components/PoseLibrary/PoseVideo';
import TTSPlayback from '../../components/PoseLibrary/TTSPlayback';
import UserNotes from '../../components/PoseLibrary/UserNotes';
import CommentsSection from '../../components/PoseLibrary/CommentsSection';
import FavoriteButton from '../../components/PoseLibrary/FavoriteButton';
import AddToFlowButton from '../../components/PoseLibrary/AddToFlowButton';

interface DetailedPose {
  id: string;
  slug: string;
  name: string;
  sanskrit: string | null;
  family: string | null;
  intensity: number | null;
  image_url?: string | null;
  meta?: any;
  video_url?: string;
  instructions?: string | null;
}

export default function PoseDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [pose, setPose] = useState<DetailedPose | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    
    const loadPose = async () => {
      try {
        setLoading(true);
        console.log('Loading pose with slug:', slug);
        const poses = await getPosesFromDatabase();
        console.log('Found poses:', poses.length);
        
        const foundPose = poses.find(p => p.slug === slug);
        if (foundPose) {
          console.log('Found pose:', foundPose);
          setPose(foundPose);
        } else {
          console.error('Pose not found with slug:', slug);
          console.log('Available slugs:', poses.map(p => p.slug));
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error loading pose:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    
    loadPose();
  }, [slug]);

  if (loading) return <div className="max-w-2xl mx-auto p-6">Loading...</div>;
  
  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Pose Not Found</h1>
        <p className="mb-4">Sorry, we couldn't find the pose you're looking for.</p>
        <button 
          onClick={() => router.push('/poses')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Pose Library
        </button>
      </div>
    );
  }

  if (!pose) return <div className="max-w-2xl mx-auto p-6">Loading...</div>;

  const teachingCues = pose.instructions || `Practice ${pose.name} with awareness. Focus on your breath and alignment.`;

  return (
    <div className="max-w-4xl mx-auto p-6 dark:bg-gray-900 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold dark:text-white">
                  {pose.name} 
                  <span className="text-gray-500 dark:text-gray-400 text-lg ml-2">
                    ({pose.sanskrit || 'Sanskrit name'})
                  </span>
                </h1>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-blue-700 dark:text-blue-400">{pose.family || 'Unknown'}</span>
                  <span className="font-semibold dark:text-white">Intensity: {pose.intensity || 3}/5</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <FavoriteButton poseId={pose.id} poseName={pose.name} className="text-2xl text-yellow-500" />
                <AddToFlowButton pose={{
                  id: pose.id,
                  name_en: pose.name,
                  slug: pose.slug
                }} />
              </div>
            </div>

            {pose.image_url && (
              <img 
                src={pose.image_url} 
                alt={pose.name} 
                className="w-full rounded mb-4 max-h-96 object-cover" 
              />
            )}

            {/* Video */}
            {pose.video_url && (
              <div className="mb-6">
                <h3 className="font-bold mb-2 dark:text-white">Video Demonstration</h3>
                <PoseVideo url={pose.video_url} title={`${pose.name} demonstration`} />
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