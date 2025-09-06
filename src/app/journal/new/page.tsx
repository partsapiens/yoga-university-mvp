import Link from "next/link";

export default function NewJournalPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link href="/journal" className="text-sm text-indigo-600">← Back to Journal</Link>
        <h1 className="text-2xl font-bold mt-2">New Journal Entry</h1>
      </div>

      <div className="bg-white rounded-2xl border p-6">
        <h2 className="text-lg font-semibold mb-4">Practice Reflection</h2>
        <p className="text-gray-600">This page is working! You can now build your journal form here.</p>
        
        <form className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              className="w-full rounded-xl border px-3 py-2"
              placeholder="Today's practice reflection..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">How did your practice feel?</label>
            <textarea
              rows={4}
              className="w-full rounded-xl border px-3 py-2"
              placeholder="Reflect on your practice..."
            />
          </div>
          
          <button className="rounded-xl border px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 transition">
            Save Entry (Demo)
          </button>
        </form>
      </div>
    </main>
  );
}
