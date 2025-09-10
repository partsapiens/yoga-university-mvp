interface CommentsSectionProps {
  poseId: string;
  className?: string;
}

export default function CommentsSection({ poseId, className = "" }: CommentsSectionProps) {
  // Replace with real comment system integration
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 ${className}`}>
      <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Community Comments</h4>
      <div className="text-gray-500 dark:text-gray-400 text-center py-8">
        <p className="mb-2">💬 Community features coming soon!</p>
        <p className="text-sm">Share your insights and learn from others.</p>
      </div>
    </div>
  );
}