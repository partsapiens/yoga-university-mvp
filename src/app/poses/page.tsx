import { supabaseBrowser } from "@/lib/supabase-browser";
import { PoseCard } from "@/components/pose-card";
import Link from "next/link";

export const dynamic = "force-dynamic";

type SearchParams = { q?: string; family?: string; page?: string };

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const supabase = supabaseBrowser();
  const q = (searchParams.q ?? "").trim();
  const family = (searchParams.family ?? "").trim();
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);
  const pageSize = 24;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  if (!supabase) {
    return render(q, [], family, [], 0, page, pageSize);
  }

  const { data: fams } = await supabase.from("posture_families").select("name").order("name", { ascending: true });

  let poseQuery = supabase.from("poses").select("slug,name,sanskrit,category,thumbnail_url", { count: "exact" });
  if (q) poseQuery = poseQuery.ilike("name", `%${q}%`);

  if (family) {
    const { data: ids } = await supabase.from("posture_families").select("id").eq("name", family);
    const familyIds = (ids ?? []).map(r => r.id);
    const { data: mapped } = await supabase
      .from("pose_family_map").select("pose_slug")
      .in("family_id", familyIds.length ? familyIds : ["00000000-0000-0000-0000-000000000000"]);
    const slugs = (mapped ?? []).map(m => m.pose_slug);
    if (!slugs.length) return render(q, fams ?? [], family, [], 0, page, pageSize);
    poseQuery = poseQuery.in("slug", slugs);
  }

  const { data: poses, count } = await poseQuery.order("name", { ascending: true }).range(from, to);

  const slugsForPage = (poses ?? []).map(p => p.slug);
  const { data: rows } = slugsForPage.length
    ? await supabase.from("pose_family_map").select("pose_slug, posture_families(name)").in("pose_slug", slugsForPage)
    : { data: [] as any[] };

  const familiesBySlug: Record<string, string[]> = {};
  for (const r of rows ?? []) {
    const k = r.pose_slug;
    if (!familiesBySlug[k]) familiesBySlug[k] = [];
    // @ts-ignore
    if (r.posture_families?.name) familiesBySlug[k].push(r.posture_families.name);
  }

  return render(q, fams ?? [], family, poses ?? [], count ?? 0, page, pageSize, familiesBySlug);
}

function render(
  q: string,
  fams: { name: string }[],
  family: string,
  poses: any[],
  count: number,
  page: number,
  pageSize: number,
  familiesBySlug: Record<string, string[]> = {}
) {
  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  const createQuery = (p: number) => {
    const params: { q?: string; family?: string; page?: string } = {};
    if (q) params.q = q;
    if (family) params.family = family;
    if (p > 1) params.page = String(p);
    return params;
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 grid gap-6">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Pose Library</h1>
          <p className="text-sm text-gray-500">{count} poses</p>
        </div>
        <form className="flex gap-2">
          <input className="rounded-xl border px-3 py-2 w-64" name="q" defaultValue={q} placeholder="Search poses…" />
          <select className="rounded-xl border px-3 py-2" name="family" defaultValue={family}>
            <option value="">All families</option>
            {fams.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
          </select>
          <button className="rounded-xl border px-3 py-2 bg-white">Apply</button>
        </form>
      </div>

      {poses.length === 0 ? (
        <div className="rounded-2xl border p-8 text-center text-gray-500">No poses found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {poses.map((p) => (
            <PoseCard
              key={p.slug}
              slug={p.slug}
              name={p.name}
              sanskrit={p.sanskrit}
              category={p.category}
              thumbnail_url={p.thumbnail_url}
              families={familiesBySlug[p.slug] ?? []}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-center gap-2">
        <Link href={{ pathname: '/poses', query: createQuery(Math.max(1, page - 1)) }} className="rounded-xl border px-3 py-2 bg-white">Prev</Link>
        <div className="text-sm text-gray-500">Page {page} / {totalPages}</div>
        <Link href={{ pathname: '/poses', query: createQuery(Math.min(totalPages, page + 1)) }} className="rounded-xl border px-3 py-2 bg-white">Next</Link>
      </div>
    </main>
  );
}
