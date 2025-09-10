export default function SkeletonLoader({ count = 4 }) {
  return (
    <>  
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-gray-200 animate-pulse rounded-md h-32 w-full" />
      ))}
    </>
  );
}