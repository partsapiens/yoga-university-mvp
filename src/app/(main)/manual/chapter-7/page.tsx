'use client';

import React from 'react';
import { ManualLayout, ManualTOC, ManualSection, FigureCard } from '@/components/manual';

export default function Chapter7Page() {
  const breadcrumbs = [
    { label: '← Manual Index', href: '/manual' },
    { label: 'Chapter 7' }
  ];

  const tocItems = [
    { id: 'teaching-voice', title: 'Finding Your Authentic Voice' },
    { id: 'sequencing', title: 'The Art of Sequencing' },
    { id: 'cueing', title: 'Layered & Effective Cueing' },
    { id: 'business', title: 'The Business of Yoga' },
    { id: 'ethics', title: 'Ethics & The Seat of the Teacher' },
    { id: 'closing', title: 'A Beginning, Not an End' }
  ];

  const chapterNavigation = {
    current: 'chapter-7',
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
      title="Chapter 7 — The Art of Teaching & The Path Forward"
      breadcrumbs={breadcrumbs}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <ManualTOC 
            items={tocItems} 
            chapterNavigation={chapterNavigation}
          />
          
          <article>
            <ManualSection id="teaching-voice" title="Finding Your Authentic Voice">
              <p className="mb-4 leading-relaxed text-lg">
                Your teaching voice is the unique alchemy of your knowledge, your personality, and your direct experience of yoga. It is not something to be manufactured, but rather something to be uncovered. Authenticity is your greatest asset as a teacher.
              </p>
              <ul className="space-y-3 mb-4 ml-5 list-disc">
                <li><strong>Teach from Your Scars, Not Your Wounds</strong>: Share what you have integrated and learned, not what you are still actively processing.</li>
                <li><strong>Permission to be Imperfect</strong>: Your students don't need a perfect teacher; they need a real one. It's okay to stumble over words, forget a pose, or laugh at yourself.</li>
                <li><strong>The Power of Silence</strong>: A confident teacher knows when not to talk. Use silence to allow students to have their own experience and feel the effects of a pose.</li>
              </ul>
            </ManualSection>

            <ManualSection id="sequencing" title="The Art of Sequencing">
              <p className="mb-4 leading-relaxed">
                A well-designed sequence is more than a random collection of poses. It is an intentional journey that safely warms the body, explores a specific theme or peak pose, and then gradually cools the body down, leading to a state of deep rest.
              </p>
              <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-4">The Arc of a Class</h3>
              <ol className="space-y-2 mb-4 ml-5 list-decimal">
                <li><strong>Centering & Arrival (5 min)</strong>: Set the theme, introduce breathwork.</li>
                <li><strong>Warm-up (10-15 min)</strong>: Gentle movements to wake up the spine and major joints (e.g., Cat-Cow, Sun Salutation A).</li>
                <li><strong>Building Heat (15-20 min)</strong>: More vigorous flows (e.g., Sun Salutation B, standing pose series).</li>
                <li><strong>Peak Exploration (10-15 min)</strong>: Work towards a specific peak pose (e.g., Crow Pose) or explore the class theme through deeper poses.</li>
                <li><strong>Cool Down (10 min)</strong>: Seated poses, twists, and gentle stretches to down-regulate the nervous system.</li>
                <li><strong>Savasana & Closing (5-10 min)</strong>: Final relaxation for integration.</li>
              </ol>
              <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg my-6">
                <h4 className="font-semibold text-teal-300 mb-2">Sample Theme & Sequence: "Grounding into Gratitude"</h4>
                <p className="text-gray-300">
                  <strong>Theme:</strong> Cultivating stability (Muladhara Chakra) and thankfulness (Santosha).<br/>
                  <strong>Peak Pose:</strong> Vrksasana (Tree Pose).<br/>
                  <strong>Sequence Notes:</strong> Focus on poses with a strong connection to the earth: Tadasana, Warriors, low lunges. Cueing emphasizes rooting down through the feet. The closing meditation could be a simple gratitude practice.
                </p>
              </div>
            </ManualSection>

            <ManualSection id="cueing" title="Layered & Effective Cueing">
              <p className="mb-4 leading-relaxed">Effective cueing is clear, concise, and multi-dimensional. It guides students safely into a pose while also inviting them into a deeper experience.</p>
              <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-4">The Three Layers of a Cue</h3>
              <ul className="space-y-3 mb-4 ml-5">
                <li><strong>Layer 1: Foundational/Anatomical</strong>: The "what" and "how." (e.g., "Step your right foot forward, stack your knee over your ankle.")</li>
                <li><strong>Layer 2: Energetic/Refinement</strong>: The feeling and direction of energy. (e.g., "Press down through your front foot to rise up through your heart.")</li>
                <li><strong>Layer 3: Thematic/Inspirational</strong>: Connects the pose to the class theme or a deeper philosophical concept. (e.g., "As you root down, feel a sense of gratitude for the support of the earth beneath you.")</li>
              </ul>
            </ManualSection>

            <ManualSection id="business" title="The Business of Yoga">
              <p className="mb-4 leading-relaxed">
                Teaching yoga professionally requires not just passion, but also practicality. Understanding the business side will help you build a sustainable and fulfilling career.
              </p>
              <ul className="space-y-3 mb-4 ml-5 list-disc">
                <li><strong>Liability Insurance</strong>: This is non-negotiable. It protects you and your students.</li>
                <li><strong>Setting Your Rates</strong>: Research your local market. Value your time, training, and expertise.</li>
                <li><strong>Marketing Yourself Authentically</strong>: You don't need to be a social media expert. Start by sharing what you love about yoga with your community. A simple website or email list can be very effective.</li>
                <li><strong>Continuing Education</strong>: The 200-hour training is just the beginning. Commit to being a lifelong student. Attend workshops, read books, and maintain your personal practice.</li>
              </ul>
            </ManualSection>

            <ManualSection id="ethics" title="Ethics & The Seat of the Teacher">
              <p className="mb-4 leading-relaxed">
                "The seat of the teacher" (Guru) is a position of trust and responsibility. It requires impeccable integrity, clear boundaries, and a deep sense of humility.
              </p>
              <ul className="space-y-3 mb-4 ml-5 list-disc">
                <li><strong>Scope of Practice</strong>: You are a yoga teacher, not a therapist or a doctor. Refer students to other professionals when their needs are outside your scope.</li>
                <li><strong>Professional Boundaries</strong>: Maintain clear and appropriate boundaries in your relationships with students.</li>
                <li><strong>Cultural Appreciation vs. Appropriation</strong>: Honor the roots of yoga. Study its history, learn basic Sanskrit pronunciation, and avoid presenting the practice as a mere workout.</li>
              </ul>
            </ManualSection>

            <ManualSection id="closing" title="A Beginning, Not an End">
              <div className="p-4 bg-blue-900/20 border-l-4 border-blue-400 rounded-r-lg my-6">
                <h4 className="font-semibold text-blue-300 mb-2">Final Reflection</h4>
                <p className="text-blue-200/90">
                  This training is a significant accomplishment, but it is also the starting line. As you step onto the path of teaching, what is your deepest intention? What unique gifts do you hope to share with your students? Write this down and return to it often as your guidepost on the journey ahead. Congratulations!
                </p>
              </div>
            </ManualSection>
          </article>
        </div>
        
        <footer className="mt-12 pt-6 border-t border-gray-700 text-center text-gray-500">
          <p>© YogaFlow University — Chapter 7: The Art of Teaching & The Path Forward. For internal training use only.</p>
        </footer>
      </div>
    </ManualLayout>
  );
}