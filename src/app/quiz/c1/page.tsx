import { createClient } from "@supabase/supabase-js";

type QA = { prompt: string; answer: string };
type Board = { categories: string[]; grid: Record<string, Record<number, QA>> };

async function fetchBoard(): Promise<Board> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn("Supabase URL or key is missing. Returning empty board for build process.");
    return { categories: [], grid: {} };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data: setRow } = await supabase.from("quiz_sets").select("id").eq("title", "C1 Review Jeopardy").maybeSingle();
  if (!setRow) {
    console.warn("Jeopardy set 'C1 Review Jeopardy' not found. Returning empty board.");
    return { categories: [], grid: {} };
  }

  const { data: rows } = await supabase
    .from("quiz_questions")
    .select("category,value,prompt,answer")
    .eq("set_id", setRow.id)
    .order("category")
    .order("value");

  const categories = Array.from(new Set((rows ?? []).map(r => r.category)));
  const grid: Board["grid"] = {};
  for (const c of categories) grid[c] = {};
  for (const r of rows ?? []) grid[r.category][r.value] = { prompt: r.prompt, answer: r.answer };
  return { categories, grid };
}

export default async function Page() {
  const board = await fetchBoard();
  const values = [200, 400, 600, 800, 1000];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 grid gap-6">
      <h1 className="text-2xl font-bold">C1 Review Jeopardy</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {board.categories.map(c => (
          <div key={c} className="rounded-2xl bg-indigo-600 text-white px-4 py-3 font-semibold shadow">{c}</div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {board.categories.map(c => (
          <div key={c} className="grid gap-3">
            {values.map(v => (
              <details key={v} className="rounded-2xl border bg-white p-3">
                <summary className="cursor-pointer font-semibold">{v}</summary>
                <div className="mt-2 text-sm">{board.grid[c]?.[v]?.prompt}</div>
                <div className="mt-2 text-sm font-medium text-green-700">{board.grid[c]?.[v]?.answer}</div>
              </details>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
