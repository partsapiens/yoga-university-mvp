import Link from "next/link";

export default function CreateFlowPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link href="/flows" className="text-sm text-indigo-600">← Back to Flows</Link>
        <h1 className="text-2xl font-bold mt-2">Create New Flow</h1>
      </div>

      <div className="bg-white rounded-2xl border p-6">
        <h2 className="text-lg font-semibold mb-4">Flow Creation Form</h2>
        <p className="text-gray-600">This page is working! You can now build your form here.</p>
        
        <form className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Flow Name</label>
            <input
              type="text"
              className="w-full rounded-xl border px-3 py-2"
              placeholder="Morning Sun Salutation"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              rows={3}
              className="w-full rounded-xl border px-3 py-2"
              placeholder="A gentle morning flow..."
            />
          </div>
          
          <button className="rounded-xl border px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 transition">
            Create Flow (Demo)
          </button>
        </form>
      </div>
    </main>
  );
}
