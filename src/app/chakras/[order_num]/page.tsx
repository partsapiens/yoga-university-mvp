import { supabaseBrowser } from "@/lib/supabase-browser";
import Link from "next/link";

export default async function Page({ params }: { params: { order_num: string } }) {
  const supabase = supabaseBrowser();

  const { data: chakra } = await supabase
    .from("chakras")
    .select("*")
    .eq("order_num", params.order_num)
    .maybeSingle();

  if (!chakra) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-2xl border p-8">Chakra not found.</div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 grid gap-6">
      <Link href="/chakras" className="text-sm text-indigo-600">&larr; All Chakras</Link>
      <header className="grid gap-1">
        <h1 className="text-2xl font-bold">{chakra.name} ({chakra.sanskrit_name})</h1>
        <div className="text-gray-500">
          Location: {chakra.location} | Element: {chakra.element}
        </div>
      </header>

      {chakra.description && (
        <section>
          <p className="text-gray-700">{chakra.description}</p>
        </section>
      )}

      {chakra.details ? (
        <section>
          <h2 className="font-semibold mb-2">Details</h2>
          <pre className="text-sm bg-gray-50 p-3 rounded-xl border overflow-auto">
            {JSON.stringify(chakra.details, null, 2)}
          </pre>
        </section>
      ) : null}
    </main>
  );
}
