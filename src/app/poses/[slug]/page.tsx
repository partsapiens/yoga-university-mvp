import { supabaseBrowser } from "@/lib/supabase-browser";
import Link from "next/link";

export default async function Page({ params }: { params: { slug: string } }) {
  const supabase = supabaseBrowser();

  if (!supabase) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-2xl border p-8">Error: Supabase client not available. Check environment variables.</div>
      </main>
    );
  }

  const { data: pose } = await supabase.from("poses").select("*").eq("slug", params.slug).maybeSingle();
  if (!pose) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-2xl border p-8">Pose not found.</div>
      </main>
    );
  }

  const { data: famRows } = await supabase
    .from("pose_family_map")
    .select("posture_families(name)")
    .eq("pose_slug", params.slug);

  const families = (famRows ?? []).map((r: any) => r.posture_families?.name).filter(Boolean);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 grid gap-6">
      <Link href="/poses" className="text-sm text-indigo-600">&larr; Library</Link>
      <header className="grid gap-1">
        <h1 className="text-2xl font-bold">{pose.name}</h1>
        {pose.sanskrit && <div className="text-sm text-gray-500">{pose.sanskrit}</div>}
        <div className="text-xs text-gray-400">{pose.category} {families.length ? `• ${families.join(" · ")}` : ""}</div>
      </header>

      {pose.thumbnail_url && <img src={pose.thumbnail_url} alt={pose.name} className="w-full rounded-2xl border" />}

      {pose.cues?.length ? (
        <section>
          <h2 className="font-semibold mb-2">Cues</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {pose.cues.map((c: string) => <li key={c}>{c}</li>)}
          </ul>
        </section>
      ) : null}

      {pose.benefits?.length ? (
        <section>
          <h2 className="font-semibold mb-2">Benefits</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {pose.benefits.map((b: string) => <li key={b}>{b}</li>)}
          </ul>
        </section>
      ) : null}

      {pose.meta ? (
        <section>
          <h2 className="font-semibold mb-2">Meta</h2>
          <pre className="text-xs bg-gray-50 p-3 rounded-xl border overflow-auto">{JSON.stringify(pose.meta, null, 2)}</pre>
        </section>
      ) : null}
    </main>
  );
}
