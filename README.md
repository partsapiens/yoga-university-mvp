<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Yoga Flow Builder (Generate Flow) — README</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    :root { --fg:#0b1320; --muted:#5b6472; --accent:#2563eb; --bg:#ffffff; }
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color: var(--fg); background: var(--bg); line-height: 1.6; margin: 0; padding: 2.5rem 1.25rem; }
    main { max-width: 920px; margin: 0 auto; }
    h1 { font-size: 2.2rem; margin: 0 0 0.75rem; }
    h2 { font-size: 1.4rem; margin-top: 2rem; }
    p.lead { color: var(--muted); font-size: 1.05rem; margin-top: 0.25rem; }
    ul { padding-left: 1.2rem; }
    code, kbd { background: #f5f7fb; border: 1px solid #e7ebf3; border-radius: 6px; padding: 0.1rem 0.35rem; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
    table { border-collapse: collapse; width: 100%; max-width: 640px; }
    th, td { border: 1px solid #e7ebf3; padding: 0.5rem 0.6rem; text-align: left; }
    th { background: #f8fafc; }
    .muted { color: var(--muted); }
    .checklist li { list-style: "✔  "; margin-left: 0.25rem; }
    .pill { display: inline-block; padding: .2rem .55rem; border: 1px solid #e7ebf3; border-radius: 999px; font-size: .8rem; color: var(--muted); }
    .kbd-note { font-size: .9rem; color: var(--muted); }
    hr { border: none; border-top: 1px solid #edf2f7; margin: 2rem 0; }
    a { color: var(--accent); text-decoration: none; }
  </style>
</head>
<body>
<main>

  <header>
    <h1>Yoga Flow Builder (Generate Flow)</h1>
    <p class="lead">A standalone web app for composing, previewing, and playing custom yoga sequences. Built with <strong>React</strong>, <strong>Next.js</strong>, and <strong>Tailwind CSS</strong>, designed to be AI-ready with voice and smart sequencing.</p>
  </header>

  <section>
    <h2>✨ Features</h2>
    <ul>
      <li><strong>Auto-generation</strong> — Create a flow by setting duration, intensity, and focus (hips, hamstrings, shoulders, full-body).</li>
      <li><strong>Customization</strong> — Add, remove, reorder poses; adjust pose durations; apply presets.</li>
      <li><strong>Playback</strong> — Interactive player with timers, progress bars, Text-to-Speech cues, and adjustable tempo.</li>
      <li><strong>Persistence</strong> — Save flows locally on your device for reuse.</li>
      <li><strong>Pose data</strong> — Each pose includes cues, benefits, anatomical focus, contraindications, and a concise <em>Why</em> purpose line.</li>
      <li><strong>Fast search</strong> — JSONB pose metadata with indexes (Supabase-ready) for quick filtering.</li>
    </ul>
  </section>

  <section>
    <h2>🎙️ Voice &amp; AI Integration (in progress)</h2>
    <ul>
      <li><strong>Hands-free commands</strong> — e.g., “Play”, “Next pose”, “Focus hips”, “Tempo 80%”, “Add Downward Dog for 45 seconds”.</li>
      <li><strong>Natural language parsing</strong> — Speech mapped to structured intents with synonyms and slot-filling.</li>
      <li><strong>Feedback</strong> — Visual toasts and optional spoken confirmations.</li>
      <li><strong>Knowledge-aware tooltips</strong> — “Why Warrior I?” opens the tooltip and can be read via TTS.</li>
    </ul>
    <p class="muted">Planned: AI-assisted flow planning, safer sequencing, wearable/HR integration, calendar export, and teacher presentation mode.</p>
  </section>

  <section>
    <h2>⌨️ Keyboard Shortcuts</h2>
    <table>
      <thead>
        <tr><th>Key</th><th>Action</th></tr>
      </thead>
      <tbody>
        <tr><td><kbd>Space</kbd></td><td>Play / Pause / Resume sequence</td></tr>
        <tr><td><kbd>ArrowRight</kbd></td><td>Next pose</td></tr>
        <tr><td><kbd>ArrowLeft</kbd></td><td>Previous pose</td></tr>
        <tr><td><kbd>[</kbd></td><td>Slow down playback</td></tr>
        <tr><td><kbd>]</kbd></td><td>Speed up playback</td></tr>
      </tbody>
    </table>
    <p class="kbd-note">Shortcuts are disabled while typing in an input field.</p>
  </section>

  <section>
    <h2>🚀 Roadmap</h2>
    <ul class="checklist">
      <li>Flow auto-generation</li>
      <li>Manual pose editing &amp; local persistence</li>
      <li>Normalized JSONB pose metadata</li>
      <li>Seeded <em>Why</em> purpose lines</li>
      <li>Voice control MVP (Web Speech API)</li>
      <li>AI-assisted sequencing + LLM fallback</li>
      <li>Wearable/HR integrations</li>
      <li>Teacher/Coach presentation mode</li>
    </ul>
  </section>

  <section>
    <h2>🛠️ Tech Stack</h2>
    <ul>
      <li><strong>Frontend</strong> — React, Next.js, Tailwind CSS</li>
      <li><strong>Data</strong> — Supabase (Postgres, JSONB, <span class="pill">pg_trgm</span>)</li>
      <li><strong>Voice / AI</strong> — Web Speech API (planned), LLM function-calling &amp; RAG (planned)</li>
      <li><strong>UX</strong> — <code>react-hot-toast</code> for feedback; local storage for persistence</li>
    </ul>
  </section>

  <section>
    <h2>⚡ Getting Started</h2>
    <ol>
      <li>Install dependencies: <code>npm install</code></li>
      <li>Run dev server: <code>npm run dev</code> (default at <code>http://localhost:3000</code>)</li>
      <li>Optional: connect Supabase and apply DB migrations for pose metadata and search indexes.</li>
    </ol>
  </section>

  <hr />

  <footer class="muted">
    <p>Made for building safer, smarter, more intentional flows — with space for breath, cues, and voice-guided ease.</p>
  </footer>

</main>
</body>
</html>
