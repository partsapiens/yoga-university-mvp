import Link from 'next/link';

export default function PoseCard({ pose }) {
  return (
    <Link href={`/pose/${pose.slug}`}>  
      <div className="bg-white shadow rounded-md p-3 cursor-pointer transition hover:shadow-lg flex flex-col items-center">  
        <img src={pose.thumbnail_url || pose.icon_url} alt={pose.name_en} className="h-24 w-24 object-cover mb-2" />  
        <div className="font-semibold">{pose.name_en}</div>  
        <div className="text-sm text-gray-500">{pose.name_sanskrit}</div>  
        <div className="mt-1 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{pose.family_id}</div>  
      </div>  
    </Link>  
  );
}