import Link from "next/link";

export function PoseCard({
  slug, name, sanskrit, category, thumbnail_url, families,
}: {
  slug: string; name: string;
  sanskrit?: string | null; category?: string | null;
  thumbnail_url?: string | null; families?: string[];
}) {
  return (
    <Link href={`/poses/${slug}`} className="block rounded-2xl border bg-white hover:bg-gray-50 transition shadow-sm overflow-hidden">
      <div className="aspect-video bg-gray-100">
        {thumbnail_url && <img src={thumbnail_url} alt={name} className="w-full h-full object-cover" />}
      </div>
      <div className="p-3 grid gap-1">
        <div className="font-semibold">{name}</div>
        {sanskrit && <div className="text-xs text-gray-500">{sanskrit}</div>}
        <div className="text-xs text-gray-400">{category}</div>
        {families?.length ? (
          <div className="flex flex-wrap gap-1 pt-1">
            {families.slice(0, 3).map((f) => (
              <span key={f} className="px-2 py-0.5 text-[11px] rounded-full border bg-white">{f}</span>
            ))}
            {families.length > 3 && (
              <span className="px-2 py-0.5 text-[11px] rounded-full border bg-white">+{families.length - 3}</span>
            )}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
