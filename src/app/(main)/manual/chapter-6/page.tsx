'use client';

import React from 'react';
import { ManualLayout, ManualTOC, ManualSection, FigureCard } from '@/components/manual';

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
              <p className="mb-4 leading-relaxed text-lg">
                Beyond the physical body of muscles and bones lies the subtle body, a network of energy channels (nadis) and centers (chakras). The chakra system provides a profound map for understanding the interplay between our physical, psychological, and spiritual well-being.
              </p>
              <p className="mb-4 leading-relaxed">
                The seven primary chakras are energetic vortices aligned along the central channel (Sushumna Nadi). Each chakra governs specific physical and emotional functions. When they are balanced, energy flows freely, leading to a sense of vitality and harmony. When blocked or imbalanced, it can manifest as physical or emotional dis-ease.
              </p>
            </ManualSection>

            {/* Repeat this structure for each chakra */}
            <ManualSection id="chakra-root" title="1. Root Chakra — Muladhara">
              <div className="md:grid md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-1">
                  <FigureCard>
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                      <defs><filter id="glow"><feGaussianBlur stdDeviation="3.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
                      <path d="M100 20 L170 150 L30 150 Z" fill="#dc2626" fillOpacity="0.3" stroke="#dc2626" strokeWidth="3" filter="url(#glow)"/>
                      <text x="100" y="120" textAnchor="middle" fill="#fef2f2" fontSize="30" fontWeight="bold">LAM</text>
                    </svg>
                  </FigureCard>
                </div>
                <div className="md:col-span-2">
                  <p className="mb-4"><strong>Foundation & Survival.</strong> This chakra governs our sense of safety, stability, and belonging.</p>
                  <ul className="space-y-1 mb-4 text-sm">
                    <li><strong>Element:</strong> Earth</li>
                    <li><strong>Color:</strong> Red</li>
                    <li><strong>Balanced:</strong> Grounded, secure, stable, present.</li>
                    <li><strong>Imbalanced:</strong> Anxiety, fear, insecurity, disconnected.</li>
                    <li><strong>Poses:</strong> Tadasana, Virabhadrasana I/II, Uttanasana.</li>
                    <li><strong>Practice:</strong> Stomping feet, connecting with nature, eating root vegetables.</li>
                  </ul>
                </div>
              </div>
            </ManualSection>

            <ManualSection id="chakra-sacral" title="2. Sacral Chakra — Svadhisthana">
              <div className="md:grid md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-1">
                  <FigureCard>
                     <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                      <defs><filter id="glow2"><feGaussianBlur stdDeviation="3.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
                      <circle cx="100" cy="100" r="60" fill="#ea580c" fillOpacity="0.3" stroke="#ea580c" strokeWidth="3" filter="url(#glow2)"/>
                      <circle cx="100" cy="100" r="30" fill="none" stroke="#ea580c" strokeWidth="2" strokeDasharray="5,5"/>
                      <text x="100" y="110" textAnchor="middle" fill="#fff7ed" fontSize="30" fontWeight="bold">VAM</text>
                    </svg>
                  </FigureCard>
                </div>
                <div className="md:col-span-2">
                  <p className="mb-4"><strong>Flow & Creativity.</strong> Governs our emotions, creativity, and sensual expression.</p>
                  <ul className="space-y-1 mb-4 text-sm">
                    <li><strong>Element:</strong> Water</li>
                    <li><strong>Color:</strong> Orange</li>
                    <li><strong>Balanced:</strong> Creative, joyful, emotionally fluid, adaptable.</li>
                    <li><strong>Imbalanced:</strong> Emotional instability, creative blocks, fear of change.</li>
                    <li><strong>Poses:</strong> Baddha Konasana, Malasana, hip circles.</li>
                    <li><strong>Practice:</strong> Dancing, spending time near water, creative expression.</li>
                  </ul>
                </div>
              </div>
            </ManualSection>

            {/* ... other chakras ... */}

            <ManualSection id="integration" title="Integration in Teaching">
              <div className="p-4 bg-blue-900/20 border-l-4 border-blue-400 rounded-r-lg my-6">
                <h4 className="font-semibold text-blue-300 mb-2">Case Study: Sequencing for the Heart Chakra (Anahata)</h4>
                <p className="text-blue-200/90">
                  To theme a class around Anahata, you could focus on cultivating compassion and connection.
                  <ul className="list-disc ml-5 mt-2">
                    <li><strong>Opening:</strong> A short meditation on loving-kindness (Metta).</li>
                    <li><strong>Asana:</strong> Emphasize chest-opening poses like Cobra, Upward-Facing Dog, Camel, and Bridge Pose. Use cues that encourage broadening across the collarbones.</li>
                    <li><strong>Partner Work:</strong> A simple partner stretch can foster connection.</li>
                    <li><strong>Closing:</strong> A guided relaxation focused on gratitude and sending love to self and others.</li>
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