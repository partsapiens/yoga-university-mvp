import { supabaseBrowser } from "@/lib/supabase-browser";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Page() {
  const supabase = supabaseBrowser();

  if (!supabase) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8 grid gap-6">
        <h1 className="text-2xl font-bold">Themes</h1>
        <div className="rounded-xl border p-8 text-center text-gray-500">
          Error: Supabase client not available. Check environment variables.
        </div>
      </main>
    );
  }

  const { data: themes } = await supabase
    .from("themes")
    .select("id, name")
    .order("name", { ascending: true });

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 grid gap-6">
      <h1 className="text-2xl font-bold">Themes</h1>
      <div className="grid gap-3">
        {(themes ?? []).map((theme) => (
          <Link
            key={theme.id}
            href={`/themes/${theme.id}`}
            className="block rounded-xl border bg-white p-4 hover:bg-gray-50 transition"
          >
            {theme.name}
          </Link>
        ))}
        {themes?.length === 0 && (
          <div className="rounded-xl border p-8 text-center text-gray-500">
            No themes found.
          </div>
        )}
      </div>
    </main>
  );
}
