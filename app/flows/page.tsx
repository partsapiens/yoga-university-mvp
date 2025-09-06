"use client";
import { useState } from "react";
import type { Pose, FlowStep } from "@/lib/types";

const POSES: Pose[] = [
  { id:"1", slug:"mountain", name:"Mountain", category:"Standing", level:"Beginner", plane:"Frontal", musclesEngaged:[], musclesStretched:[], cues:["Neutral ribcage"], benefits:["Posture"], injuries:[] },
  { id:"2", slug:"down-dog", name:"Down Dog", category:"Inversion", level:"Beginner", plane:"Sagittal", musclesEngaged:[], musclesStretched:[], cues:["Press floor away"], benefits:["Posterior chain"], injuries:[] },
  { id:"3", slug:"warrior-2", name:"Warrior II", category:"Standing", level:"Beginner", plane:"Frontal", musclesEngaged:[], musclesStretched:[], cues:["Knee tracks over 2nd toe"], benefits:["Hip opening"], injuries:[] },
];

export default function FlowsPage() {
  const [steps, setSteps] = useState<FlowStep[]>([]);
  const add = (poseId: string) => setSteps(s => [...s, { poseId, holdSeconds: 30, sides:"both" }]);
  const remove = (i: number) => setSteps(s => s.filter((_, idx)=> idx !== i));
  const estMin = Math.ceil(steps.reduce((sum, s)=> sum + (s.holdSeconds ?? 0), 0) / 60);

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
      <section className="grid gap-3">
        <h2 className="font-semibold">Pose palette</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {POSES.map(p => (
            <button key={p.id} onClick={()=>add(p.id)} className="rounded-xl border p-3 text-left hover:shadow-sm">
              <div className="aspect-video rounded-lg bg-gray-100" />
              <div className="mt-2 font-medium">{p.name}</div>
              <div className="text-xs text-gray-500">{p.category}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Timeline</h2>
          <div className="text-sm text-gray-600">Estimated: {estMin} min</div>
        </div>
        {steps.length === 0 && <p className="text-sm text-gray-600">Add poses from the left to start building your flow.</p>}
        <ol className="grid gap-3">
          {steps.map((s, i)=> (
            <li key={i} className="rounded-xl border p-3 flex items-center gap-3">
              <div className="h-16 w-24 rounded bg-gray-100" />
              <div className="grid gap-1">
                <div className="font-medium">{getPoseName(s.poseId)}</div>
                <div className="text-xs text-gray-600">Hold: {s.holdSeconds}s • Sides: {s.sides}</div>
              </div>
              <div className="ml-auto flex gap-2">
                <button onClick={()=>remove(i)} className="text-sm text-red-600">Remove</button>
              </div>
            </li>
          ))}
        </ol>
        <div className="flex gap-3">
          <button className="rounded-xl border px-4 py-2">Preview</button>
          <button className="rounded-xl border px-4 py-2">Save</button>
        </div>
      </section>
    </div>
  );
}

function getPoseName(id: string) {
  const map: Record<string, string> = { "1":"Mountain", "2":"Down Dog", "3":"Warrior II" };
  return map[id] ?? id;
}
