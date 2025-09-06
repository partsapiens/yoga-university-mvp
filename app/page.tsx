import Link from "next/link";

export default function Home() {
  return (
    <section className="grid gap-8">
      <h1 className="text-3xl font-semibold">Build flows. Learn anatomy. Reflect daily.</h1>
      <p className="text-gray-600 max-w-2xl">
        An MVP starter for your Yoga Flow / Yoga University project. Pose Library, Flow Builder, and Journal pages are scaffolded and ready for Supabase wiring.
      </p>
      <div className="grid md:grid-cols-3 gap-6">
        <Card title="Pose Library" href="/poses" desc="Browse poses with cues, benefits, and injuries." />
        <Card title="Flow Builder" href="/flows" desc="Drag poses into a sequence and preview." />
        <Card title="Journal" href="/journal" desc="Log reflections and class attendance." />
      </div>
    </section>
  );
}

function Card({ title, desc, href }: { title: string; desc: string; href: string; }) {
  return (
    <Link href={href} className="block rounded-2xl border p-5 hover:shadow-sm transition">
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-gray-600 mt-2">{desc}</p>
    </Link>
  );
}
