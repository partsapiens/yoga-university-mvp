interface PoseVideoProps {
  url?: string;
  title?: string;
  className?: string;
}

export default function PoseVideo({ url, title = "Pose Video", className = "" }: PoseVideoProps) {
  if (!url) return null;

  // Check if it's a YouTube URL and convert to embed format
  const getEmbedUrl = (originalUrl: string) => {
    if (originalUrl.includes('youtube.com/watch?v=')) {
      const videoId = originalUrl.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (originalUrl.includes('youtu.be/')) {
      const videoId = originalUrl.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return originalUrl;
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg overflow-hidden ${className}`}>
      <div className="aspect-video relative">
        <iframe 
          src={getEmbedUrl(url)}
          frameBorder="0" 
          allowFullScreen 
          title={title}
          className="absolute inset-0 w-full h-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    </div>
  );
}