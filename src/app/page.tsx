export default function Page() {
  return (
    <div className="rounded-2xl shadow bg-white p-6 grid gap-2">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-gray-600">Pose Library · Themes · Chakras · C1 Jeopardy</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        <a className="rounded-xl border px-4 py-3 bg-white" href="/poses">Pose Library</a>
        <a className="rounded-xl border px-4 py-3 bg-white" href="/themes">Themes</a>
        <a className="rounded-xl border px-4 py-3 bg-white" href="/chakras">Chakras</a>
        <a className="rounded-xl border px-4 py-3 bg-white" href="/quiz/c1">C1 Jeopardy</a>
      </div>
    </div>
  );
}
