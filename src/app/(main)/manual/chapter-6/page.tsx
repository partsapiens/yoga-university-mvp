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
                The chakra system is a map of the subtle body, an energetic dimension of our being. The word "chakra" means "wheel" in Sanskrit, and they can be thought of as spinning vortexes of energy that correspond to major nerve plexuses in the physical body. We can use the chakra system as a map for self-inquiry and as a tool for creating themed classes.
              </p>
              <p className="mb-4 leading-relaxed">
                When teaching with the chakras, the goal is not to "fix" or "unblock" them, but to bring awareness to a particular area of the body and its associated psycho-emotional qualities. It is a way of making abstract concepts felt and experienced.
              </p>
            </ManualSection>

            <ManualSection id="chakra-root" title="Root — Muladhara">
              <FigureCard title="Root Chakra Visualization">
                <svg viewBox="0 0 200 200" width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(100,100)">
                    <path d="M0,-80 A80,80 0 0,1 80,0 L0,0 Z" fill="#dc2626" fillOpacity="0.6"/>
                    <path d="M80,0 A80,80 0 0,1 0,80 L0,0 Z" fill="#dc2626" fillOpacity="0.6"/>
                    <path d="M0,80 A80,80 0 0,1 -80,0 L0,0 Z" fill="#dc2626" fillOpacity="0.6"/>
                    <path d="M-80,0 A80,80 0 0,1 0,-80 L0,0 Z" fill="#dc2626" fillOpacity="0.6"/>
                    <circle cx="0" cy="0" r="20" fill="#fef2f2"/>
                    <text x="0" y="5" textAnchor="middle" fill="#dc2626" fontSize="18" fontWeight="bold">LAM</text>
                  </g>
                </svg>
              </FigureCard>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Location</strong>: Base of spine, pelvic floor</li>
                <li><strong>Color</strong>: Red</li>
                <li><strong>Element</strong>: Earth</li>
                <li><strong>Qualities</strong>: Grounding, stability, survival, foundation</li>
                <li><strong>Poses</strong>: Mountain pose, warrior poses, standing forward folds, squats</li>
                <li><strong>Affirmation</strong>: "I am safe, I am supported, I am grounded."</li>
                 <li><strong>Class Theme Example:</strong> A class focused on Muladhara might involve many standing poses, a slow and mindful pace, and cues that emphasize the connection to the earth.</li>
              </ul>
            </ManualSection>

            <ManualSection id="chakra-sacral" title="Sacral — Svadhisthana">
              <FigureCard title="Sacral Chakra Visualization">
                <svg viewBox="0 0 200 200" width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(100,100) rotate(-30)">
                    {[...Array(6)].map((_, i) => (
                      <path key={i} d={`M0,-80 A80,80 0 0,1 ${80 * Math.sin(2 * Math.PI / 6)},${-80 * Math.cos(2 * Math.PI / 6)} L0,0 Z`} fill="#ea580c" fillOpacity="0.6" transform={`rotate(${i * 60})`}/>
                    ))}
                    <circle cx="0" cy="0" r="20" fill="#fff7ed"/>
                    <text x="0" y="5" textAnchor="middle" fill="#ea580c" fontSize="18" fontWeight="bold">VAM</text>
                  </g>
                </svg>
              </FigureCard>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Location</strong>: Lower abdomen, below navel</li>
                <li><strong>Color</strong>: Orange</li>
                <li><strong>Element</strong>: Water</li>
                <li><strong>Qualities</strong>: Creativity, sexuality, emotion, flow</li>
                <li><strong>Poses</strong>: Hip openers, goddess pose, flowing sequences like Cat-Cow</li>
                <li><strong>Affirmation</strong>: "I embrace my creativity and allow my emotions to flow."</li>
                <li><strong>Class Theme Example:</strong> A fluid, vinyasa-style class with lots of hip-opening poses and an emphasis on moving with the breath like water.</li>
              </ul>
            </ManualSection>

            <ManualSection id="chakra-solar" title="Solar Plexus — Manipura">
              <FigureCard title="Solar Plexus Chakra Visualization">
                <svg viewBox="0 0 200 200" width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(100,100)">
                    {[...Array(10)].map((_, i) => (
                      <path key={i} d={`M0,-80 L${80 * Math.sin(2 * Math.PI / 20)},${-80 * Math.cos(2 * Math.PI / 20)} L0,0 Z`} fill="#eab308" fillOpacity="0.6" transform={`rotate(${i * 36})`}/>
                    ))}
                    <circle cx="0" cy="0" r="20" fill="#fefce8"/>
                    <text x="0" y="5" textAnchor="middle" fill="#eab308" fontSize="18" fontWeight="bold">RAM</text>
                  </g>
                </svg>
              </FigureCard>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Location</strong>: Upper abdomen, diaphragm</li>
                <li><strong>Color</strong>: Yellow</li>
                <li><strong>Element</strong>: Fire</li>
                <li><strong>Qualities</strong>: Personal power, confidence, transformation</li>
                <li><strong>Poses</strong>: Core work, twists, boat pose, plank variations</li>
                <li><strong>Affirmation</strong>: "I am confident, powerful, and worthy."</li>
                 <li><strong>Class Theme Example:</strong> A dynamic and heating practice with a focus on core engagement, building up to a challenging peak pose to build confidence.</li>
              </ul>
            </ManualSection>

            <ManualSection id="chakra-heart" title="Heart — Anahata">
              <FigureCard title="Heart Chakra Visualization">
                <svg viewBox="0 0 200 200" width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                   <g transform="translate(100,100)">
                    {[...Array(12)].map((_, i) => (
                      <path key={i} d={`M0,-80 L${80 * Math.sin(2 * Math.PI / 24)},${-80 * Math.cos(2 * Math.PI / 24)} L0,0 Z`} fill="#16a34a" fillOpacity="0.6" transform={`rotate(${i * 30})`}/>
                    ))}
                    <circle cx="0" cy="0" r="20" fill="#f0fdf4"/>
                    <text x="0" y="5" textAnchor="middle" fill="#16a34a" fontSize="18" fontWeight="bold">YAM</text>
                  </g>
                </svg>
              </FigureCard>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Location</strong>: Center of chest, heart space</li>
                <li><strong>Color</strong>: Green</li>
                <li><strong>Element</strong>: Air</li>
                <li><strong>Qualities</strong>: Love, compassion, connection, healing</li>
                <li><strong>Poses</strong>: Heart openers, backbends, arm balances, partner poses</li>
                <li><strong>Affirmation</strong>: "I give and receive love freely and unconditionally."</li>
                 <li><strong>Class Theme Example:</strong> A practice focused on backbends and chest-opening poses, with a loving-kindness meditation at the end.</li>
              </ul>
            </ManualSection>

            <ManualSection id="chakra-throat" title="Throat — Vishuddha">
              <FigureCard title="Throat Chakra Visualization">
                <svg viewBox="0 0 200 200" width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(100,100)">
                    {[...Array(16)].map((_, i) => (
                      <path key={i} d={`M0,-80 L${80 * Math.sin(2 * Math.PI / 32)},${-80 * Math.cos(2 * Math.PI / 32)} L0,0 Z`} fill="#3b82f6" fillOpacity="0.6" transform={`rotate(${i * 22.5})`}/>
                    ))}
                    <circle cx="0" cy="0" r="20" fill="#eff6ff"/>
                    <text x="0" y="5" textAnchor="middle" fill="#3b82f6" fontSize="18" fontWeight="bold">HAM</text>
                  </g>
                </svg>
              </FigureCard>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Location</strong>: Throat, base of neck</li>
                <li><strong>Color</strong>: Blue</li>
                <li><strong>Element</strong>: Space</li>
                <li><strong>Qualities</strong>: Communication, truth, expression</li>
                <li><strong>Poses</strong>: Neck releases, fish pose, supported shoulder stand, chanting</li>
                <li><strong>Affirmation</strong>: "I speak my truth with clarity and compassion."</li>
                 <li><strong>Class Theme Example:</strong> A practice that includes chanting or humming, with a focus on poses that open the throat and neck area.</li>
              </ul>
            </ManualSection>

            <ManualSection id="chakra-brow" title="Brow — Ajna">
              <FigureCard title="Third Eye Chakra Visualization">
                <svg viewBox="0 0 200 200" width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(100,100) rotate(90)">
                    {[...Array(2)].map((_, i) => (
                      <path key={i} d={`M0,-80 A80,80 0 0,1 ${80 * Math.sin(2 * Math.PI / 2)},${-80 * Math.cos(2 * Math.PI / 2)} L0,0 Z`} fill="#6366f1" fillOpacity="0.6" transform={`rotate(${i * 180})`}/>
                    ))}
                    <circle cx="0" cy="0" r="20" fill="#eef2ff"/>
                    <text x="0" y="5" textAnchor="middle" fill="#6366f1" fontSize="18" fontWeight="bold">OM</text>
                  </g>
                </svg>
              </FigureCard>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Location</strong>: Between eyebrows, third eye</li>
                <li><strong>Color</strong>: Indigo</li>
                <li><strong>Element</strong>: Light</li>
                <li><strong>Qualities</strong>: Intuition, wisdom, inner seeing</li>
                <li><strong>Poses</strong>: Forward folds with forehead supported, meditation, balancing poses</li>
                <li><strong>Affirmation</strong>: "I trust my inner wisdom and intuition."</li>
                 <li><strong>Class Theme Example:</strong> A meditative practice with longer holds, a focus on balancing poses, and an invitation to close the eyes and tune inward.</li>
              </ul>
            </ManualSection>

            <ManualSection id="chakra-crown" title="Crown — Sahasrara">
              <FigureCard title="Crown Chakra Visualization">
                <svg viewBox="0 0 200 200" width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                   <g transform="translate(100,100)">
                    {[...Array(1000)].map((_, i) => (
                      <path key={i} d={`M0,-80 L${80 * Math.sin(2 * Math.PI / 2000)},${-80 * Math.cos(2 * Math.PI / 2000)} L0,0 Z`} fill="#8b5cf6" fillOpacity="0.6" transform={`rotate(${i * 0.36})`}/>
                    ))}
                    <circle cx="0" cy="0" r="20" fill="#f5f3ff"/>
                    <text x="0" y="5" textAnchor="middle" fill="#8b5cf6" fontSize="18" fontWeight="bold">OM</text>
                  </g>
                </svg>
              </FigureCard>
              <ul className="space-y-2 mb-4 ml-5">
                <li><strong>Location</strong>: Top of head, crown</li>
                <li><strong>Color</strong>: Violet/White</li>
                <li><strong>Element</strong>: Thought/Consciousness</li>
                <li><strong>Qualities</strong>: Spiritual connection, unity, transcendence</li>
                <li><strong>Poses</strong>: Inversions, meditation, Savasana</li>
                <li><strong>Affirmation</strong>: "I am connected to the universal consciousness."</li>
                 <li><strong>Class Theme Example:</strong> A practice that culminates in a long, silent meditation or an extended Savasana, with minimal cueing to allow for a deep inner experience.</li>
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