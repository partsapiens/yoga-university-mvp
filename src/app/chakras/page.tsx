import { supabaseBrowser } from "@/lib/supabase-browser";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Page() {
  const supabase = supabaseBrowser();
  const { data: chakras } = await supabase
    .from("chakras")
    .select("order_num, name, sanskrit_name")
    .order("order_num", { ascending: true });

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 grid gap-6">
      <h1 className="text-2xl font-bold">The Seven Chakras</h1>
      <div className="grid gap-3">
        {(chakras ?? []).map((chakra) => (
          <Link
            key={chakra.order_num}
            href={`/chakras/${chakra.order_num}`}
            className="block rounded-xl border bg-white p-4 hover:bg-gray-50 transition"
          >
            <span className="font-semibold">{chakra.name}</span>
            <span className="text-gray-500 ml-2">({chakra.sanskrit_name})</span>
          </Link>
        ))}
        {chakras?.length === 0 && (
          <div className="rounded-xl border p-8 text-center text-gray-500">
            No chakras found.
          </div>
        )}
      </div>
    </main>
  );
}
