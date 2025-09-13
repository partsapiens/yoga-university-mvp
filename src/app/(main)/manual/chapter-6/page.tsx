'use client';

import React from 'react';
import { ManualLayout, ManualTOC, ManualSection, FigureCard } from '@/components/manual';

export default function Chapter6Page() {
  const breadcrumbs = [
    { label: '← Manual Index', href: '/manual' },
    { label: 'Chapter 6' }
  ];

  const tocItems = [
    { id: 'chakras-overview', title: 'Chakras — Overview' },
    { id: 'chakra-root', title: 'Root — Muladhara' },
    { id: 'chakra-sacral', title: 'Sacral — Svadhisthana' },
    { id: 'chakra-solar', title: 'Solar Plexus — Manipura' },
    { id: 'chakra-heart', title: 'Heart — Anahata' },
    { id: 'chakra-throat', title: 'Throat — Vishuddha' },
    { id: 'chakra-brow', title: 'Brow — Ajna' },
    { id: 'chakra-crown', title: 'Crown — Sahasrara' }
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
      title="Chapter 6 — Chakras & Energy" 
      breadcrumbs={breadcrumbs}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <ManualTOC 
            items={tocItems} 
            chapterNavigation={chapterNavigation}
          />
          
          <article>
            <ManualSection id="chakras-overview" title="Chakras — Overview">
              <p className="mb-4 leading-relaxed">
                The chakra system is a map of subtle energy centers along the spine, each associated with different aspects of human experience. While rooted in ancient traditions, this system can be a useful framework for understanding the connection between physical postures and energetic qualities.
              </p>
              <p className="mb-4 leading-relaxed">
                The seven main chakras run from the base of the spine to the crown of the head, each having its own characteristics, colors, elements, and associated qualities. Understanding these can help inform sequencing, theming, and the energetic quality of your classes.
              </p>
            </ManualSection>

            <ManualSection id="chakra-root" title="Root — Muladhara">
              <FigureCard title="Root Chakra Visualization">
                <svg viewBox="0 0 200 200" width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="100" cy="100" r="70" fill="none" stroke="#dc2626" strokeWidth="4"/>
                  <circle cx="100" cy="100" r="40" fill="#dc2626" fillOpacity="0.3"/>
                  <rect x="80" y="80" width="40" height="40" fill="none" stroke="#dc2626" strokeWidth="3"/>
                  <text x="100" y="185" textAnchor="middle" fill="#dc2626" fontSize="14">LAM</text>
                </svg>
              </FigureCard>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Location</strong>: Base of spine, pelvic floor</li>
                <li><strong>Color</strong>: Red</li>
                <li><strong>Element</strong>: Earth</li>
                <li><strong>Qualities</strong>: Grounding, stability, survival, foundation</li>
                <li><strong>Poses</strong>: Mountain pose, warrior poses, standing forward folds</li>
                <li><strong>Affirmation</strong>: "I am safe and grounded"</li>
              </ul>
            </ManualSection>

            <ManualSection id="chakra-sacral" title="Sacral — Svadhisthana">
              <FigureCard title="Sacral Chakra Visualization">
                <svg viewBox="0 0 200 200" width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="100" cy="100" r="70" fill="none" stroke="#ea580c" strokeWidth="4"/>
                  <circle cx="100" cy="100" r="40" fill="#ea580c" fillOpacity="0.3"/>
                  <circle cx="100" cy="80" r="20" fill="none" stroke="#ea580c" strokeWidth="3"/>
                  <circle cx="100" cy="120" r="20" fill="none" stroke="#ea580c" strokeWidth="3"/>
                  <text x="100" y="185" textAnchor="middle" fill="#ea580c" fontSize="14">VAM</text>
                </svg>
              </FigureCard>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Location</strong>: Lower abdomen, below navel</li>
                <li><strong>Color</strong>: Orange</li>
                <li><strong>Element</strong>: Water</li>
                <li><strong>Qualities</strong>: Creativity, sexuality, emotion, flow</li>
                <li><strong>Poses</strong>: Hip openers, goddess pose, flowing sequences</li>
                <li><strong>Affirmation</strong>: "I embrace my creativity and emotions"</li>
              </ul>
            </ManualSection>

            <ManualSection id="chakra-solar" title="Solar Plexus — Manipura">
              <FigureCard title="Solar Plexus Chakra Visualization">
                <svg viewBox="0 0 200 200" width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="100" cy="100" r="70" fill="none" stroke="#eab308" strokeWidth="4"/>
                  <circle cx="100" cy="100" r="40" fill="#eab308" fillOpacity="0.3"/>
                  <polygon points="100,70 110,90 130,90 116,104 122,124 100,112 78,124 84,104 70,90 90,90" 
                           fill="none" stroke="#eab308" strokeWidth="3"/>
                  <text x="100" y="185" textAnchor="middle" fill="#eab308" fontSize="14">RAM</text>
                </svg>
              </FigureCard>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Location</strong>: Upper abdomen, diaphragm</li>
                <li><strong>Color</strong>: Yellow</li>
                <li><strong>Element</strong>: Fire</li>
                <li><strong>Qualities</strong>: Personal power, confidence, transformation</li>
                <li><strong>Poses</strong>: Core work, twists, boat pose, plank variations</li>
                <li><strong>Affirmation</strong>: "I am confident and powerful"</li>
              </ul>
            </ManualSection>

            <ManualSection id="chakra-heart" title="Heart — Anahata">
              <FigureCard title="Heart Chakra Visualization">
                <svg viewBox="0 0 200 200" width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="100" cy="100" r="70" fill="none" stroke="#16a34a" strokeWidth="4"/>
                  <circle cx="100" cy="100" r="40" fill="#16a34a" fillOpacity="0.3"/>
                  <polygon points="100,80 112,88 124,80 124,92 112,100 124,108 124,120 112,112 100,120 88,112 76,120 76,108 88,100 76,92 76,80 88,88" 
                           fill="none" stroke="#16a34a" strokeWidth="3"/>
                  <text x="100" y="185" textAnchor="middle" fill="#16a34a" fontSize="14">YAM</text>
                </svg>
              </FigureCard>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Location</strong>: Center of chest, heart space</li>
                <li><strong>Color</strong>: Green</li>
                <li><strong>Element</strong>: Air</li>
                <li><strong>Qualities</strong>: Love, compassion, connection, healing</li>
                <li><strong>Poses</strong>: Heart openers, backbends, arm variations</li>
                <li><strong>Affirmation</strong>: "I give and receive love freely"</li>
              </ul>
            </ManualSection>

            <ManualSection id="chakra-throat" title="Throat — Vishuddha">
              <FigureCard title="Throat Chakra Visualization">
                <svg viewBox="0 0 200 200" width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="100" cy="100" r="70" fill="none" stroke="#3b82f6" strokeWidth="4"/>
                  <circle cx="100" cy="100" r="40" fill="#3b82f6" fillOpacity="0.3"/>
                  <circle cx="100" cy="100" r="25" fill="none" stroke="#3b82f6" strokeWidth="3"/>
                  <polygon points="100,85 108,92 115,85 115,100 108,107 115,115 108,108 100,115 92,108 85,115 85,100 92,92 85,85 92,92" 
                           fill="none" stroke="#3b82f6" strokeWidth="2"/>
                  <text x="100" y="185" textAnchor="middle" fill="#3b82f6" fontSize="14">HAM</text>
                </svg>
              </FigureCard>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Location</strong>: Throat, base of neck</li>
                <li><strong>Color</strong>: Blue</li>
                <li><strong>Element</strong>: Space</li>
                <li><strong>Qualities</strong>: Communication, truth, expression</li>
                <li><strong>Poses</strong>: Neck releases, fish pose, supported backbends</li>
                <li><strong>Affirmation</strong>: "I speak my truth clearly"</li>
              </ul>
            </ManualSection>

            <ManualSection id="chakra-brow" title="Brow — Ajna">
              <FigureCard title="Third Eye Chakra Visualization">
                <svg viewBox="0 0 200 200" width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="100" cy="100" r="70" fill="none" stroke="#6366f1" strokeWidth="4"/>
                  <circle cx="100" cy="100" r="40" fill="#6366f1" fillOpacity="0.3"/>
                  <circle cx="100" cy="100" r="15" fill="none" stroke="#6366f1" strokeWidth="3"/>
                  <circle cx="100" cy="100" r="5" fill="#6366f1"/>
                  <text x="100" y="185" textAnchor="middle" fill="#6366f1" fontSize="14">OM</text>
                </svg>
              </FigureCard>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Location</strong>: Between eyebrows, third eye</li>
                <li><strong>Color</strong>: Indigo</li>
                <li><strong>Element</strong>: Light</li>
                <li><strong>Qualities</strong>: Intuition, wisdom, inner seeing</li>
                <li><strong>Poses</strong>: Forward folds, meditation, balancing poses</li>
                <li><strong>Affirmation</strong>: "I trust my inner wisdom"</li>
              </ul>
            </ManualSection>

            <ManualSection id="chakra-crown" title="Crown — Sahasrara">
              <FigureCard title="Crown Chakra Visualization">
                <svg viewBox="0 0 200 200" width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="100" cy="100" r="70" fill="none" stroke="#8b5cf6" strokeWidth="4"/>
                  <circle cx="100" cy="100" r="40" fill="#8b5cf6" fillOpacity="0.3"/>
                  <g fill="none" stroke="#8b5cf6" strokeWidth="2">
                    <path d="M100,75 L100,125 M85,90 L115,110 M115,90 L85,110"/>
                    <circle cx="100" cy="85" r="5"/>
                    <circle cx="100" cy="115" r="5"/>
                    <circle cx="85" cy="100" r="5"/>
                    <circle cx="115" cy="100" r="5"/>
                  </g>
                  <text x="100" y="185" textAnchor="middle" fill="#8b5cf6" fontSize="14">Silent OM</text>
                </svg>
              </FigureCard>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Location</strong>: Top of head, crown</li>
                <li><strong>Color</strong>: Violet/White</li>
                <li><strong>Element</strong>: Thought</li>
                <li><strong>Qualities</strong>: Spiritual connection, unity, transcendence</li>
                <li><strong>Poses</strong>: Inversions, meditation, savasana</li>
                <li><strong>Affirmation</strong>: "I am connected to divine wisdom"</li>
              </ul>
            </ManualSection>
          </article>
        </div>
        
        <footer className="mt-12 pt-6 border-t border-gray-600 text-gray-400">
          <p>© YogaFlow University — Chapter 6. For internal training use.</p>
        </footer>
      </div>
    </ManualLayout>
  );
}