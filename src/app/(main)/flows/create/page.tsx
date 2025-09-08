"use client";

import React, { useMemo, useState } from "react";

interface Pose {
  id: string;
  name: string;
  sanskrit: string;
  defaultSeconds: number;
  icon: string;
}

const POSES: Pose[] = [
  { id: "butterfly", name: "Butterfly Pose", sanskrit: "Baddha Konasana", defaultSeconds: 60, icon: "🦋" },
  { id: "forward_fold", name: "Standing Forward Fold", sanskrit: "Uttanāsana", defaultSeconds: 60, icon: "🧎" },
  { id: "down_dog", name: "Downward Facing Dog", sanskrit: "Adho Mukha Svanasana", defaultSeconds: 45, icon: "🐶" },
  { id: "warrior1_r", name: "Warrior I (Right)", sanskrit: "Virabhadrāsana I", defaultSeconds: 45, icon: "🛡️" },
  { id: "high_lunge_r", name: "High Lunge (Right)", sanskrit: "Añjaneyāsana", defaultSeconds: 45, icon: "🏹" },
  { id: "bridge", name: "Bridge Pose", sanskrit: "Setu Bandha Sarvāṅgāsana", defaultSeconds: 60, icon: "🌉" },
  { id: "pigeon", name: "Sleeping Pigeon", sanskrit: "Eka Pada Rajakapotasana (prep)", defaultSeconds: 60, icon: "🕊️" },
  { id: "boat", name: "Boat Pose", sanskrit: "Nāvāsana", defaultSeconds: 40, icon: "🚤" },
  { id: "child", name: "Child's Pose", sanskrit: "Balasana", defaultSeconds: 75, icon: "🛏️" },
];

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

function HelpIcon({ text }: { text: string }) {
  return (
    <span className="relative ml-1 inline-flex items-center align-middle group">
      <span
        tabIndex={0}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-neutral-300 text-[10px] leading-none text-neutral-500 outline-none focus:ring-2 focus:ring-neutral-300 cursor-help"
      >
        ?
      </span>
      <div
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-64 -translate-x-1/2 rounded-lg border border-neutral-200 bg-white p-3 text-xs text-neutral-700 opacity-0 shadow-lg transition duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {text}
      </div>
    </span>
  );
}

export default function Page() {
  const [minutes, setMinutes] = useState<number>(30);
  const [intensity, setIntensity] = useState<number>(3);
  const [flow, setFlow] = useState<string[]>(["down_dog", "warrior1_r", "forward_fold", "child", "butterfly"]);
  const [overrides, setOverrides] = useState<Record<number, number>>({});
  const [preview, setPreview] = useState<string[] | null>(null);

  const openPreview = () => {
    const next = [...flow].sort(() => Math.random() - 0.5);
    setPreview(next);
  };
  const acceptPreview = () => {
    if (!preview) return;
    setFlow(preview);
    setOverrides({});
    setPreview(null);
  };
  const shufflePreview = () => {
    if (preview) setPreview([...preview].sort(() => Math.random() - 0.5));
  };

  const secondsPerPose = useMemo(
    () => flow.map((id, i) => overrides[i] ?? POSES.find((p) => p.id === id)?.defaultSeconds || 45),
    [flow, overrides]
  );
  const totalSeconds = useMemo(() => secondsPerPose.reduce((a, b) => a + b, 0), [secondsPerPose]);
  const suggestions = POSES;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="text-3xl font-semibold text-center tracking-tight">Create your sequence</h1>
        <div className="mx-auto mt-4 rounded-2xl border border-neutral-200 bg-white/90 p-4 shadow-sm overflow-hidden">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-4">
              <label className="flex items-center gap-3">
                <span className="w-16 text-sm text-neutral-600">Time</span>
                <HelpIcon text="Planned length (minutes)" />
                <input
                  type="range"
                  min={10}
                  max={90}
                  step={5}
                  value={minutes}
                  onChange={(e) => setMinutes(Number(e.target.value))}
                />
                <span className="w-14 text-right text-sm font-medium tabular-nums">{minutes}m</span>
              </label>
              <label className="flex items-center gap-3">
                <span className="text-sm text-neutral-600">Intensity</span>
                <HelpIcon text="How strong the practice feels (1–5)." />
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={intensity}
                  step={1}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                />
              </label>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={openPreview}
                className="h-9 rounded-full px-3 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-500"
              >
                Auto-generate
              </button>
              <HelpIcon text="Shows a proposed sequence in a preview you can accept or shuffle." />
              <div className="flex items-center gap-2">
                <input
                  className="h-9 w-36 max-w-full rounded-md border border-neutral-300 px-2 py-1 text-sm"
                  placeholder="Flow name"
                />
                <button className="h-9 rounded-full border px-3 py-1 text-xs hover:bg-neutral-50">Save</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-16">
        <section>
          <h2 className="mb-1 text-lg font-medium">Your Flow</h2>
          <div className="mb-3 flex flex-wrap gap-2 text-sm text-neutral-600">
            <span className="rounded-full border border-neutral-300 px-2 py-0.5">
              Total: <strong className="tabular-nums">{Math.round(totalSeconds / 60)}m</strong>
            </span>
            <span className="rounded-full border border-neutral-300 px-2 py-0.5">
              Poses: <strong className="tabular-nums">{flow.length}</strong>
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {flow.map((id, i) => {
              const p = POSES.find((x) => x.id === id);
              const dur = secondsPerPose[i] || 0;
              const tip = "Balances sequence based on intensity.";
              return (
                <div
                  key={`${id}-${i}`}
                  className="group relative rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="text-xs text-neutral-500 flex items-center gap-2">
                      <span className="cursor-grab select-none" title="Drag to reorder" aria-hidden>≡</span>
                      {i + 1}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="relative">
                        <div className="text-[11px] text-neutral-500">Why?</div>
                        <div className="invisible absolute right-0 z-20 mt-1 w-56 rounded-xl border border-neutral-200 bg-white p-3 text-xs text-neutral-700 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                          {tip}
                        </div>
                      </div>
                      <button
                        aria-label="Remove pose"
                        onClick={() => setFlow((prev) => prev.filter((_, idx) => idx !== i))}
                        className="rounded-full border px-2 py-0.5 text-xs hover:bg-neutral-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-lg">
                      {p?.icon || "🧘"}
                    </div>
                    <div>
                      <div className="font-medium leading-tight">{p?.name || id}</div>
                      <div className="text-xs text-neutral-500">{p?.sanskrit || ""}</div>
                    </div>
                  </div>
                  <label className="mt-2 block text-xs text-neutral-600">
                    Seconds
                    <input
                      type="number"
                      min={5}
                      max={600}
                      step={5}
                      value={dur}
                      onChange={(e) =>
                        setOverrides((prev) => ({ ...prev, [i]: clamp(Number(e.target.value) || 5, 5, 600) }))
                      }
                      className="ml-2 w-24 rounded-md border border-neutral-300 px-2 py-1 text-xs"
                    />
                  </label>
                  <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-neutral-100">
                    <div className="h-full bg-neutral-900" style={{ width: `100%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-medium">Suggestions</h2>
            <div className="text-xs text-neutral-500">Click to add</div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {suggestions.map((p) => (
              <button
                key={p.id}
                onClick={() => setFlow((prev) => [...prev, p.id])}
                className="group rounded-2xl border border-neutral-200 bg-white p-4 text-left shadow-sm transition hover:shadow-md"
              >
                <div className="mb-2 flex h-24 w-full items-center justify-center rounded-xl bg-neutral-100 text-3xl">
                  {p.icon}
                </div>
                <div className="font-medium group-hover:underline">{p.name}</div>
                <div className="text-xs text-neutral-500">{p.sanskrit}</div>
              </button>
            ))}
          </div>
        </section>
      </main>

      {preview && (
        <div
          role="dialog"
          aria-modal
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="text-lg font-medium">Proposed sequence</div>
              <button
                aria-label="Close preview"
                onClick={() => setPreview(null)}
                className="rounded-full border px-2 py-1 text-sm"
              >
                ✕
              </button>
            </div>
            <ol className="mb-3 max-h-[60vh] list-decimal space-y-1 overflow-auto pl-5 text-sm">
              {preview.map((id, i) => {
                const p = POSES.find((x) => x.id === id);
                return <li key={`${id}-${i}`}>{p?.name || id}</li>;
              })}
            </ol>
            <div className="flex items-center justify-end gap-2">
              <button onClick={shufflePreview} className="rounded-full border px-3 py-1 text-sm">
                Shuffle
              </button>
              <button onClick={() => setPreview(null)} className="rounded-full border px-3 py-1 text-sm">
                Cancel
              </button>
              <button
                onClick={acceptPreview}
                className="rounded-full bg-neutral-900 px-3 py-1 text-sm text-white"
              >
                Use this
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

