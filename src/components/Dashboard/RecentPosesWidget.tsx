interface RecentPose {
  id: string;
  name_en: string;
  slug: string;
  viewedAt?: string;
}

interface RecentPosesWidgetProps {
  poses: RecentPose[];
  className?: string;
}

export default function RecentPosesWidget({ poses = [], className = "" }: RecentPosesWidgetProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Recently Viewed Poses</h3>
      {poses.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">No recent poses yet. Start exploring!</p>
      ) : (
        <ul className="space-y-2">
          {poses.slice(0, 5).map(pose => (
            <li key={pose.id}>
              <a 
                href={`/pose/${pose.slug}`}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm block truncate"
              >
                {pose.name_en}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}