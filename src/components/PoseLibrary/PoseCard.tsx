import Link from 'next/link';
import FavoriteButton from './FavoriteButton';
import AddToFlowButton from './AddToFlowButton';

interface Pose {
  id: string;
  slug: string;
  name_en: string;
  name_sanskrit: string;
  family_id: string;
  thumbnail_url?: string;
  icon_url?: string;
}

interface PoseCardProps {
  pose: Pose;
}

export default function PoseCard({ pose }: PoseCardProps) {
  const handleViewPose = () => {
    // Track recently viewed poses (client-side only)
    if (typeof window !== 'undefined') {
      const recentPoses = JSON.parse(localStorage.getItem('recentPoses') || '[]');
      const updatedRecent = [
        { ...pose, viewedAt: new Date().toISOString() },
        ...recentPoses.filter((p: any) => p.id !== pose.id)
      ].slice(0, 10); // Keep only last 10
      
      localStorage.setItem('recentPoses', JSON.stringify(updatedRecent));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-md p-3 transition hover:shadow-lg flex flex-col items-center relative group">
      {/* Favorite button - appears on hover */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <FavoriteButton poseId={pose.id} className="text-yellow-500" />
      </div>
      
      <Link href={`/pose/${pose.slug}`} onClick={handleViewPose}>
        <div className="cursor-pointer flex flex-col items-center">
          <img 
            src={pose.thumbnail_url || pose.icon_url} 
            alt={pose.name_en} 
            className="h-24 w-24 object-cover mb-2 rounded" 
          />
          <div className="font-semibold text-center dark:text-white">{pose.name_en}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center">{pose.name_sanskrit}</div>
          <div className="mt-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded">
            {pose.family_id}
          </div>
        </div>
      </Link>
      
      {/* Add to Flow button - appears on hover */}
      <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <AddToFlowButton pose={pose} className="text-xs" />
      </div>
    </div>
  );
}