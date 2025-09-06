"use client";
import { useState } from "react";
import type { Pose } from "@/lib/types";

const SAMPLE: Pose[] = [
  { id: "1", slug: "mountain", name: "Mountain (Tadasana)", category:"Standing", level:"Beginner", plane:"Frontal", musclesEngaged:["quads","glute med"], musclesStretched:[], cues:["Root through feet","Neutral pelvis"], benefits:["Posture","Balance"], injuries:["If dizzy, widen stance"], thumbnailUrl:"" },
  { id: "2", slug: "down-dog", name: "Downward Facing Dog (Adho Mukha Svanasana)", category:"Inversion", level:"Beginner", plane:"Sagittal", musclesEngaged:["shoulders","core"], musclesStretched:["hamstrings","calves"], cues:["Press through palms","Lift sit bones"], benefits:["Lengthens posterior chain"], injuries:["Modify for wrist pain"], thumbnailUrl:"" },
];

export default function PosesPage() {
  const [q, setQ] = useState("");
  const data = SAMPLE.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-3">
        <input
          value={q}
          onChange={(e)=>setQ(e.target.value)}
          placeholder="Search poses..."
          className="w-full md:w-80 rounded-xl border px-4 py-2"
        />
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {data.map(p => (
          <article key={p.id} className="rounded-2xl border p-4">
            <div className="aspect-video rounded-xl bg-gray-100" />
            <h3 className="mt-3 font-medium">{p.name}</h3>
            <p className="text-xs text-gray-500">{p.category} • {p.level} • {p.plane}</p>
            <details className="mt-2">
              <summary className="cursor-pointer text-sm">View details</summary>
              <div className="mt-2 text-sm grid gap-2">
                <Tab label="Cues" items={p.cues} />
                <Tab label="Benefits" items={p.benefits} />
                <Tab label="Injuries" items={p.injuries} />
                <div>
                  <div className="font-medium">Anatomy</div>
                  <div className="text-gray-600 text-sm">Engaged: {p.musclesEngaged.join(", ") || "—"}</div>
                  <div className="text-gray-600 text-sm">Stretched: {p.musclesStretched.join(", ") || "—"}</div>
                </div>
              </div>
            </details>
          </article>
        ))}
      </div>
    </div>
  );
}

function Tab({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <div className="font-medium">{label}</div>
      <ul className="list-disc pl-5 text-gray-700">
        {items.map((x, i)=>(<li key={i}>{x}</li>))}
      </ul>
    </div>
  );
}
