import Link from "next/link";

export default function AddReadingPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link href="/reading" className="text-sm text-indigo-600">← Back to Reading List</Link>
        <h1 className="text-2xl font-bold mt-2">Add Reading Resource</h1>
      </div>

      <div className="bg-white rounded-2xl border p-6">
        <h2 className="text-lg font-semibold mb-4">Add New Resource</h2>
        <p className="text-gray-600">This page is working! You can now build your reading form here.</p>
        
        <form className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              className="w-full rounded-xl border px-3 py-2"
              placeholder="The Science of Yoga"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Author</label>
            <input
              type="text"
              className="w-full rounded-xl border px-3 py-2"
              placeholder="William J. Broad"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">URL (optional)</label>
            <input
              type="url"
              className="w-full rounded-xl border px-3 py-2"
              placeholder="https://example.com/article"
            />
          </div>
          
          <button className="rounded-xl border px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 transition">
            Add Resource (Demo)
          </button>
        </form>
      </div>
    </main>
  );
}
