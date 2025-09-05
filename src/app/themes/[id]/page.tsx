import { supabaseBrowser } from "@/lib/supabase-browser";
import Link from "next/link";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = supabaseBrowser();

  const { data: theme } = await supabase
    .from("themes")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (!theme) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="rounded-2xl border p-8">Theme not found.</div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 grid gap-6">
      <Link href="/themes" className="text-sm text-indigo-600">&larr; All Themes</Link>
      <header className="grid gap-1">
        <h1 className="text-2xl font-bold">{theme.name}</h1>
        {theme.description && <p className="text-gray-600">{theme.description}</p>}
      </header>

      {theme.prompts?.length ? (
        <section>
          <h2 className="font-semibold mb-2">Prompts</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {theme.prompts.map((p: string) => <li key={p}>{p}</li>)}
          </ul>
        </section>
      ) : null}

      {theme.mantras?.length ? (
        <section>
          <h2 className="font-semibold mb-2">Mantras</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {theme.mantras.map((m: string) => <li key={m}>{m}</li>)}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
