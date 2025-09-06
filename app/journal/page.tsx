"use client";
import { useState } from "react";

type Entry = { date: string; mood: string; text: string; type?: "taught"|"attended"|null; classType?: string; durationMin?: number };

export default function JournalPage() {
  const [entries, setEntries] = useState<Entry[]>([
    { date: new Date().toISOString().slice(0,10), mood: "🙂", text: "Soft, stretchy practice." }
  ]);
  const [curr, setCurr] = useState<Entry>({ date: new Date().toISOString().slice(0,10), mood: "🙂", text: ""});

  const add = () => {
    setEntries(e => [curr, ...e]);
    setCurr({ date: new Date().toISOString().slice(0,10), mood: "🙂", text: ""});
  };

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
      <section className="grid gap-3">
        <h2 className="font-semibold">New Entry</h2>
        <div className="grid gap-2">
          <input type="date" value={curr.date} onChange={e=>setCurr({...curr, date:e.target.value})} className="rounded-xl border px-3 py-2 w-56" />
          <input value={curr.mood} onChange={e=>setCurr({...curr, mood:e.target.value})} className="rounded-xl border px-3 py-2 w-20" />
          <textarea value={curr.text} onChange={e=>setCurr({...curr, text:e.target.value})} placeholder="Reflection..." className="min-h-[120px] rounded-xl border px-3 py-2" />
          <div className="grid grid-cols-3 gap-2">
            <select value={curr.type ?? ""} onChange={e=>setCurr({...curr, type: (e.target.value || null) as any})} className="rounded-xl border px-3 py-2">
              <option value="">—</option>
              <option value="taught">Taught</option>
              <option value="attended">Attended</option>
            </select>
            <input placeholder="Class type (C1/HPF/...)" value={curr.classType ?? ""} onChange={e=>setCurr({...curr, classType:e.target.value})} className="rounded-xl border px-3 py-2" />
            <input type="number" placeholder="Minutes" value={curr.durationMin ?? 60} onChange={e=>setCurr({...curr, durationMin: Number(e.target.value)})} className="rounded-xl border px-3 py-2" />
          </div>
          <button onClick={add} className="rounded-xl border px-4 py-2 w-fit">Save entry</button>
        </div>
      </section>

      <section className="grid gap-3">
        <h2 className="font-semibold">History</h2>
        <div className="grid gap-3">
          {entries.map((e, i)=> (
            <article key={i} className="rounded-2xl border p-4">
              <div className="text-sm text-gray-500">{e.date} • {e.mood} {e.type ? `• ${e.type}` : ""} {e.classType ? `• ${e.classType}`: ""} {e.durationMin ? `• ${e.durationMin} min`:""}</div>
              <p className="mt-2 text-gray-800 whitespace-pre-wrap">{e.text || "—"}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
