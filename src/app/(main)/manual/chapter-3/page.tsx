import React from 'react';

export default function Chapter3Page() {
  return (
    <div className="min-h-screen" style={{
      background: 'radial-gradient(1200px 800px at 10% -10%, #14202a 0%, transparent 40%), radial-gradient(1200px 800px at 100% 0%, #1a142a 0%, transparent 40%), #0b0d10',
      color: '#e9f1f7'
    }}>
      <div className="max-w-7xl mx-auto">
        <header className="pt-12 pb-6 px-5">
          <div className="mb-6">
            <a 
              href="/manual" 
              className="text-blue-400 hover:text-blue-300 no-underline hover:underline"
            >
              ← Back to Manual
            </a>
          </div>
          <h1 className="text-4xl font-extrabold tracking-wide leading-tight mt-2 mb-0">
            Chapter 3 — Integration & Sun Salutations
          </h1>
          <p className="mt-2 text-gray-400">
            YogaFlow University edition with Sanskrit pose names and alignment / cue bullets.
          </p>
        </header>

        <main className="max-w-7xl mx-auto my-6 mb-20 px-5 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
          <nav 
            className="sticky top-4 h-fit rounded-2xl p-4"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
              border: '1px solid #26303a'
            }}
          >
            <h3 className="text-base font-medium text-teal-300 mb-2 mt-0">On this page</h3>
            <a 
              href="#integration" 
              className="block py-2 px-2.5 rounded-xl text-gray-400 no-underline hover:bg-gray-800 hover:text-white"
            >
              Integration Series
            </a>
            <a 
              href="#sunA" 
              className="block py-2 px-2.5 rounded-xl text-gray-400 no-underline hover:bg-gray-800 hover:text-white"
            >
              Sun Salutation A
            </a>
            <a 
              href="#sunB" 
              className="block py-2 px-2.5 rounded-xl text-gray-400 no-underline hover:bg-gray-800 hover:text-white"
            >
              Sun Salutation B
            </a>
          </nav>

          <article>
            <section 
              id="integration"
              className="rounded-2xl p-6 mb-5"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
                border: '1px solid #26303a'
              }}
            >
              <h2 className="text-xl font-semibold text-teal-300 mt-0 mb-1.5">Integration Series</h2>
              <ol className="mb-2 ml-5 space-y-4">
                <li>
                  <strong>Child's Pose — Balasana</strong>
                  <ul className="mt-1 ml-5 mb-2">
                    <li>Knees wide or together; big toes touch.</li>
                    <li>Lengthen spine from sacrum through crown.</li>
                    <li>Soften shoulders and jaw; deepen breath.</li>
                  </ul>
                </li>
                <li>
                  <strong>Downward Facing Dog — Adho Mukha Svanasana</strong>
                  <ul className="mt-1 ml-5 mb-2">
                    <li>Hands shoulder-width; root through thumb/index.</li>
                    <li>Lift hips high; lengthen spine.</li>
                    <li>Micro-bend knees to free low back.</li>
                  </ul>
                </li>
                <li>
                  <strong>Ragdoll — Uttanasana variation</strong>
                  <ul className="mt-1 ml-5 mb-2">
                    <li>Feet hip-width; soft knees.</li>
                    <li>Hinge from hips; hang head heavy.</li>
                    <li>Optional clasp elbows to traction spine.</li>
                  </ul>
                </li>
              </ol>
              <div 
                className="border-l-4 py-2.5 px-3 rounded-lg my-2.5"
                style={{
                  borderLeftColor: '#6ea8fe',
                  background: '#141921',
                  color: '#d8e5ff'
                }}
              >
                Objective: awaken breath and hamstrings; set steady drishti and rhythm.
              </div>
            </section>

            <section 
              id="sunA"
              className="rounded-2xl p-6 mb-5"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
                border: '1px solid #26303a'
              }}
            >
              <h2 className="text-xl font-semibold text-teal-300 mt-0 mb-1.5">Sun Salutation A — Surya Namaskar A</h2>
              <ol className="mb-2 ml-5 space-y-4">
                <li>
                  <strong>Mountain — Tadasana</strong>
                  <ul className="mt-1 ml-5 mb-2">
                    <li>Ground through four corners of feet.</li>
                    <li>Lift kneecaps, lengthen tailbone.</li>
                    <li>Draw shoulders back and down; crown to sky.</li>
                  </ul>
                </li>
                <li>
                  <strong>Extended Mountain — Urdhva Hastasana</strong>
                  <ul className="mt-1 ml-5 mb-2">
                    <li>Arms overhead, palms face or touch.</li>
                    <li>Wrap triceps forward; soften ribs.</li>
                  </ul>
                </li>
                <li>
                  <strong>Forward Fold — Uttanasana</strong>
                  <ul className="mt-1 ml-5 mb-2">
                    <li>Hinge at hips, fold deeply.</li>
                    <li>Micro-bend knees; relax neck and jaw.</li>
                  </ul>
                </li>
                <li>
                  <strong>Halfway Lift — Ardha Uttanasana</strong>
                  <ul className="mt-1 ml-5 mb-2">
                    <li>Hands to shins or floor; spine long.</li>
                    <li>Draw navel to spine; extend crown forward.</li>
                  </ul>
                </li>
                <li>
                  <strong>High to Low Plank — Chaturanga Dandasana</strong>
                  <ul className="mt-1 ml-5 mb-2">
                    <li>Shoulders above wrists; core engaged.</li>
                    <li>Lower halfway with elbows hugging ribs.</li>
                  </ul>
                </li>
                <li>
                  <strong>Upward Facing Dog — Urdhva Mukha Svanasana</strong>
                  <ul className="mt-1 ml-5 mb-2">
                    <li>Press palms and tops of feet; thighs lifted.</li>
                    <li>Open chest; shoulders over wrists.</li>
                  </ul>
                </li>
                <li>
                  <strong>Downward Facing Dog — Adho Mukha Svanasana</strong>
                  <ul className="mt-1 ml-5 mb-2">
                    <li>Return to steady breath; hold 3–5 cycles.</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section 
              id="sunB"
              className="rounded-2xl p-6"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
                border: '1px solid #26303a'
              }}
            >
              <h2 className="text-xl font-semibold text-teal-300 mt-0 mb-1.5">Sun Salutation B — Surya Namaskar B</h2>
              <ol className="mb-2 ml-5 space-y-4">
                <li>
                  <strong>Chair Pose — Utkatasana</strong>
                  <ul className="mt-1 ml-5 mb-2">
                    <li>Feet together or hip-width; sit low.</li>
                    <li>Draw tailbone down, lift chest.</li>
                  </ul>
                </li>
                <li>Flow through <strong>Forward Fold / Halfway Lift / Chaturanga / Up Dog / Down Dog</strong>.</li>
                <li>
                  <strong>Warrior I — Virabhadrasana I (Right)</strong>
                  <ul className="mt-1 ml-5 mb-2">
                    <li>Front knee over ankle; back heel roots down.</li>
                    <li>Square hips forward; reach arms overhead.</li>
                  </ul>
                </li>
                <li>Vinyasa back to Down Dog.</li>
                <li><strong>Warrior I — Virabhadrasana I (Left)</strong> → Vinyasa to Down Dog.</li>
              </ol>
            </section>
          </article>
        </main>

        <footer className="max-w-7xl mx-auto my-6 mb-20 px-5 text-gray-400">
          <p>© YogaFlow University — Chapter 3 (Integration & Sun Salutations). For internal training use.</p>
        </footer>
      </div>
    </div>
  );
}