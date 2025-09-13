'use client';

import React from 'react';
import { ManualLayout, ManualTOC, ManualSection, FigureCard } from '@/components/manual';
import PoseVideo from '@/components/PoseLibrary/PoseVideo';

export default function Chapter6Page() {
  const breadcrumbs = [
    { label: '← Manual Index', href: '/manual' },
    { label: 'Chapter 6' }
  ];

  const tocItems = [
    { id: 'chakras-overview', title: 'The Subtle Body: An Overview' },
    { id: 'chakra-root', title: '1. Root Chakra — Muladhara' },
    { id: 'chakra-sacral', title: '2. Sacral Chakra — Svadhisthana' },
    { id: 'chakra-solar', title: '3. Solar Plexus — Manipura' },
    { id: 'chakra-heart', title: '4. Heart Chakra — Anahata' },
    { id: 'chakra-throat', title: '5. Throat Chakra — Vishuddha' },
    { id: 'chakra-brow', title: '6. Third Eye Chakra — Ajna' },
    { id: 'chakra-crown', title: '7. Crown Chakra — Sahasrara' },
    { id: 'integration', title: 'Integration in Teaching' }
  ];

  const chapterNavigation = {
    current: 'chapter-6',
    chapters: [
        { id: 'chapter-1', title: 'Chapter 1', href: '/manual/chapter-1' },
        { id: 'chapter-2', title: 'Chapter 2', href: '/manual/chapter-2' },
        { id: 'chapter-3', title: 'Chapter 3', href: '/manual/chapter-3' },
        { id: 'chapter-4', title: 'Chapter 4', href: '/manual/chapter-4' },
        { id: 'chapter-5', title: 'Chapter 5', href: '/manual/chapter-5' },
        { id: 'chapter-6', title: 'Chapter 6', href: '/manual/chapter-6' },
        { id: 'chapter-7', title: 'Chapter 7', href: '/manual/chapter-7' }
    ]
  };

  return (
    <ManualLayout 
      title="Chapter 6 — Working with Chakras & Subtle Energy"
      breadcrumbs={breadcrumbs}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <ManualTOC 
            items={tocItems} 
            chapterNavigation={chapterNavigation}
          />
          
          <article>
            <ManualSection id="chakras-overview" title="The Subtle Body: An Overview">
              <PoseVideo url="https://youtu.be/MkVLuiAzPJ4" title="The Subtle Body: An Overview" className="mb-8" />
              <p className="mb-4 leading-relaxed text-lg">
                Beneath the tangible physical body of muscles, bones, and organs lies the subtle or energetic body, a complex network of energy channels (nadis) and powerful energy centers (chakras). The chakra system, originating from the tantric traditions of yoga, provides a profound and practical map for understanding the intricate interplay between our physical, psychological, and spiritual well-being.
              </p>
              <p className="mb-4 leading-relaxed">
                The seven primary chakras are energetic vortices, or spinning wheels of prana, aligned along the central energy channel (Sushumna Nadi) that runs parallel to the spinal cord. Each chakra governs specific physical functions, emotional patterns, and spiritual lessons. When they are balanced and open, energy flows freely, leading to a sense of vitality, clarity, and harmony. When blocked or imbalanced (either deficient or excessive), it can manifest as physical ailments or emotional and psychological dis-ease.
              </p>
            </ManualSection>

            <div className="space-y-8">
              <ManualSection id="chakra-root" title="1. Root Chakra — Muladhara">
                <div className="md:grid md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-1"><FigureCard><svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><filter id="glow1"><feGaussianBlur stdDeviation="3.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d="M100 20 L170 150 L30 150 Z" fill="#dc2626" fillOpacity="0.3" stroke="#dc2626" strokeWidth="3" filter="url(#glow1)"/><text x="100" y="120" textAnchor="middle" fill="#fef2f2" fontSize="30" fontWeight="bold">LAM</text></svg></FigureCard></div>
                  <div className="md:col-span-2">
                    <p className="mb-4 font-semibold">The Right to Be Here: Foundation, Survival, and Grounding.</p>
                    <ul className="space-y-1 mb-4 text-sm">
                      <li><strong>Element/Color:</strong> Earth / Red</li>
                      <li><strong>Balanced:</strong> Feeling grounded, secure, stable, present, and safe in your body.</li>
                      <li><strong>Imbalanced:</strong> Anxiety, pervasive fear, insecurity, financial instability, feeling disconnected or "spacey."</li>
                      <li><strong>Poses:</strong> Grounding poses like Tadasana (Mountain), Virabhadrasana I/II (Warrior), Uttanasana (Forward Fold), Malasana (Squat).</li>
                      <li><strong>Practice:</strong> Connect with nature, walk barefoot, stomp your feet, practice mindful eating with root vegetables.</li>
                    </ul>
                  </div>
                </div>
              </ManualSection>

              <ManualSection id="chakra-sacral" title="2. Sacral Chakra — Svadhisthana">
                <div className="md:grid md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-1"><FigureCard><svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><filter id="glow2"><feGaussianBlur stdDeviation="3.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><circle cx="100" cy="100" r="60" fill="#ea580c" fillOpacity="0.3" stroke="#ea580c" strokeWidth="3" filter="url(#glow2)"/><circle cx="100" cy="100" r="30" fill="none" stroke="#ea580c" strokeWidth="2" strokeDasharray="5,5"/><text x="100" y="110" textAnchor="middle" fill="#fff7ed" fontSize="30" fontWeight="bold">VAM</text></svg></FigureCard></div>
                  <div className="md:col-span-2">
                    <p className="mb-4 font-semibold">The Right to Feel: Flow, Creativity, and Emotional Intelligence.</p>
                    <ul className="space-y-1 mb-4 text-sm">
                      <li><strong>Element/Color:</strong> Water / Orange</li>
                      <li><strong>Balanced:</strong> Feeling creative, joyful, emotionally fluid, adaptable, and able to enjoy pleasure.</li>
                      <li><strong>Imbalanced:</strong> Emotional instability, creative blocks, fear of change, addiction, guilt.</li>
                      <li><strong>Poses:</strong> Fluid hip-opening poses like Baddha Konasana (Bound Angle), Malasana, deep lunges, and flowing cat/cow or hip circles.</li>
                      <li><strong>Practice:</strong> Dancing, swimming, spending time near water, engaging in creative hobbies, practicing emotional expression.</li>
                    </ul>
                  </div>
                </div>
              </ManualSection>

              <ManualSection id="chakra-solar" title="3. Solar Plexus Chakra — Manipura">
                <div className="md:grid md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-1"><FigureCard><svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><filter id="glow3"><feGaussianBlur stdDeviation="3.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d="M100 20 L150 70 L130 130 L70 130 L50 70 Z" fill="#facc15" fillOpacity="0.3" stroke="#facc15" strokeWidth="3" filter="url(#glow3)"/><text x="100" y="90" textAnchor="middle" fill="#fefce8" fontSize="30" fontWeight="bold">RAM</text></svg></FigureCard></div>
                  <div className="md:col-span-2">
                    <p className="mb-4 font-semibold">The Right to Act: Personal Power, Will, and Transformation.</p>
                    <ul className="space-y-1 mb-4 text-sm">
                      <li><strong>Element/Color:</strong> Fire / Yellow</li>
                      <li><strong>Balanced:</strong> Confident, purposeful, reliable, high self-esteem, able to take action and meet challenges.</li>
                      <li><strong>Imbalanced:</strong> Low self-esteem, passivity, victim mentality, or conversely, being aggressive, controlling, and stubborn.</li>
                      <li><strong>Poses:</strong> Core-strengthening poses like Navasana (Boat Pose), Plank Pose, twists like Ardha Matsyendrasana, and sun salutations.</li>
                      <li><strong>Practice:</strong> Breath of Fire (Kapalabhati), setting and achieving small goals, stepping out of your comfort zone.</li>
                    </ul>
                  </div>
                </div>
              </ManualSection>

              <ManualSection id="chakra-heart" title="4. Heart Chakra — Anahata">
                <div className="md:grid md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-1"><FigureCard><svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><filter id="glow4"><feGaussianBlur stdDeviation="3.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d="M100 40 L130 90 L100 140 L70 90 Z" fill="#4ade80" fillOpacity="0.3" stroke="#4ade80" strokeWidth="3" filter="url(#glow4)"/><path d="M60 90 L140 90 M100 50 L100 130" stroke="#bef264" strokeWidth="1.5"/><text x="100" y="100" textAnchor="middle" fill="#f7fee7" fontSize="30" fontWeight="bold">YAM</text></svg></FigureCard></div>
                  <div className="md:col-span-2">
                    <p className="mb-4 font-semibold">The Right to Love and Be Loved: Compassion, Connection, and Acceptance.</p>
                    <ul className="space-y-1 mb-4 text-sm">
                      <li><strong>Element/Color:</strong> Air / Green</li>
                      <li><strong>Balanced:</strong> Compassionate, empathetic, forgiving, able to form deep connections, accepting of self and others.</li>
                      <li><strong>Imbalanced:</strong> Grief, loneliness, jealousy, fear of intimacy, codependency, being overly critical.</li>
                      <li><strong>Poses:</strong> Chest-opening poses like Ustrasana (Camel), Bhujangasana (Cobra), Urdhva Mukha Svanasana, and gentle backbends.</li>
                      <li><strong>Practice:</strong> Loving-kindness (Metta) meditation, practicing gratitude, performing acts of kindness, conscious breathing.</li>
                    </ul>
                  </div>
                </div>
              </ManualSection>

              <ManualSection id="chakra-throat" title="5. Throat Chakra — Vishuddha">
                <div className="md:grid md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-1"><FigureCard><svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><filter id="glow5"><feGaussianBlur stdDeviation="3.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><circle cx="100" cy="100" r="50" fill="#38bdf8" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="3" filter="url(#glow5)"/><path d="M70 100 A 30 30 0 0 0 130 100" fill="none" stroke="#e0f2fe" strokeWidth="2"/><text x="100" y="110" textAnchor="middle" fill="#f0f9ff" fontSize="30" fontWeight="bold">HAM</text></svg></FigureCard></div>
                  <div className="md:col-span-2">
                    <p className="mb-4 font-semibold">The Right to Speak and Be Heard: Communication and Authentic Expression.</p>
                    <ul className="space-y-1 mb-4 text-sm">
                      <li><strong>Element/Color:</strong> Ether/Sound / Blue</li>
                      <li><strong>Balanced:</strong> Clear communicator, good listener, able to express one's truth skillfully and creatively.</li>
                      <li><strong>Imbalanced:</strong> Fear of speaking, shyness, inability to listen, or conversely, gossiping and dominating conversations.</li>
                      <li><strong>Poses:</strong> Neck stretches, Salamba Sarvangasana (Shoulderstand), Matsyasana (Fish Pose), Ujjayi breath.</li>
                      <li><strong>Practice:</strong> Chanting (mantra), singing, journaling, practicing active listening, speaking your truth in safe spaces.</li>
                    </ul>
                  </div>
                </div>
              </ManualSection>

              <ManualSection id="chakra-brow" title="6. Third Eye Chakra — Ajna">
                <div className="md:grid md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-1"><FigureCard><svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><filter id="glow6"><feGaussianBlur stdDeviation="3.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d="M30 100 L100 40 L170 100 L100 160 Z" fill="#818cf8" fillOpacity="0.3" stroke="#818cf8" strokeWidth="3" filter="url(#glow6)"/><text x="100" y="115" textAnchor="middle" fill="#eef2ff" fontSize="30" fontWeight="bold">OM</text></svg></FigureCard></div>
                  <div className="md:col-span-2">
                    <p className="mb-4 font-semibold">The Right to See: Intuition, Imagination, and Wisdom.</p>
                    <ul className="space-y-1 mb-4 text-sm">
                      <li><strong>Element/Color:</strong> Light / Indigo</li>
                      <li><strong>Balanced:</strong> Intuitive, perceptive, imaginative, clear-thinking, able to see the bigger picture.</li>
                      <li><strong>Imbalanced:</strong> Lack of imagination, confusion, poor memory, nightmares, denial, distrust of intuition.</li>
                      <li><strong>Poses:</strong> Child's Pose (forehead on mat/block), Dolphin Pose, meditation focusing on the space between the eyebrows.</li>
                      <li><strong>Practice:</strong> Meditation, visualization, dream journaling, trusting your intuitive hits.</li>
                    </ul>
                  </div>
                </div>
              </ManualSection>

              <ManualSection id="chakra-crown" title="7. Crown Chakra — Sahasrara">
                <div className="md:grid md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-1"><FigureCard><svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><filter id="glow7"><feGaussianBlur stdDeviation="3.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><circle cx="100" cy="100" r="60" fill="#c084fc" fillOpacity="0.2" stroke="#c084fc" strokeWidth="2" filter="url(#glow7)"/><circle cx="100" cy="100" r="50" fill="#a855f7" fillOpacity="0.3" stroke="none"/><text x="100" y="110" textAnchor="middle" fill="#f3e8ff" fontSize="24" fontWeight="bold">Silence</text></svg></FigureCard></div>
                  <div className="md:col-span-2">
                    <p className="mb-4 font-semibold">The Right to Know: Consciousness, Connection to the Divine, and Liberation.</p>
                    <ul className="space-y-1 mb-4 text-sm">
                      <li><strong>Element/Color:</strong> Consciousness / Violet or White</li>
                      <li><strong>Balanced:</strong> Spiritually connected, sense of oneness, wisdom, open-minded, blissful.</li>
                      <li><strong>Imbalanced:</strong> Spiritual cynicism, disconnection, materialism, apathy, confusion.</li>
                      <li><strong>Poses:</strong> Savasana (Corpse Pose), Padmasana (Lotus Pose) with meditation, Sirsasana (Headstand) for advanced practitioners.</li>
                      <li><strong>Practice:</strong> Seated meditation, practicing gratitude, spending time in silence, studying spiritual texts.</li>
                    </ul>
                  </div>
                </div>
              </ManualSection>
            </div>

            <ManualSection id="integration" title="Integration in Teaching">
              <div className="p-4 bg-blue-900/20 border-l-4 border-blue-400 rounded-r-lg my-6">
                <h4 className="font-semibold text-blue-300 mb-2">Case Study: Sequencing for the Heart Chakra (Anahata)</h4>
                <p className="text-blue-200/90">
                  To theme a class around Anahata (the right to love and be loved), you could focus on cultivating compassion, connection, and equanimity.
                  <ul className="list-disc ml-5 mt-2 space-y-1">
                    <li><strong>Opening & Dharma Talk:</strong> Introduce the concept of Anahata as the bridge between the lower (earthly) and upper (spiritual) chakras. Offer a short meditation on loving-kindness (Metta).</li>
                    <li><strong>Asana:</strong> Emphasize expansive, chest-opening poses like Bhujangasana (Cobra), Upward-Facing Dog, Ustrasana (Camel), and supported backbends. Use cues that encourage broadening across the collarbones and breathing into the back of the heart.</li>
                    <li><strong>Partner Work (Optional):</strong> A simple, consent-based partner stretch, like a supported backbend, can foster connection and trust.</li>
                    <li><strong>Closing:</strong> A guided Savasana focused on gratitude, forgiveness, and sending love to oneself and all beings.</li>
                  </ul>
                </p>
              </div>
            </ManualSection>
          </article>
        </div>
        
        <footer className="mt-12 pt-6 border-t border-gray-700 text-center text-gray-500">
          <p>© YogaFlow University — Chapter 6: Working with Chakras & Subtle Energy. For internal training use only.</p>
        </footer>
      </div>
    </ManualLayout>
  );
}