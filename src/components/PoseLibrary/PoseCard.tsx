import Link from 'next/link';
import Image from 'next/image';
import FavoriteButton from './FavoriteButton';
import AddToFlowButton from './AddToFlowButton';
import { analytics } from '../../utils/analytics';
import { Card } from '@/components/ui/Card';

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
      
      // Track analytics
      analytics.trackPoseView(pose.id, pose.name_en);
    }
  };

  return (
    <Card
      className="p-4 flex flex-col items-center text-center relative group transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      data-pose-card
      tabIndex={0}
      role="button"
      aria-label={`${pose.name_en} (${pose.name_sanskrit}) - ${pose.family_id} pose`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleViewPose();
          window.location.href = `/pose/${pose.slug}`;
        }
      }}
    >
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-10">
        <FavoriteButton poseId={pose.id} poseName={pose.name_en} className="text-yellow-500" />
      </div>
      
      <Link href={`/pose/${pose.slug}`} onClick={handleViewPose} tabIndex={-1} className="flex flex-col items-center w-full">
        <div className="w-full aspect-square relative mb-4 rounded-lg overflow-hidden">
          <Image
            src={pose.thumbnail_url || pose.icon_url || '/images/pose-placeholder.svg'}
            alt={pose.name_en}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            loading="lazy"
          />
        </div>
        <h3 className="font-semibold text-lg leading-tight dark:text-white">{pose.name_en}</h3>
        <p className="text-sm text-muted-foreground dark:text-gray-400">{pose.name_sanskrit}</p>
        <div className="mt-2 text-xs bg-secondary dark:bg-secondary text-secondary-foreground dark:text-secondary-foreground px-2 py-1 rounded-full">
          {pose.family_id}
        </div>
      </Link>
      
      <div className="mt-4 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
        <AddToFlowButton pose={pose} />
      </div>
    </Card>
  );
}