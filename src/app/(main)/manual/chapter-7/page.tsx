'use client';

import React from 'react';
import { ManualLayout, ManualTOC, ManualSection, FigureCard } from '@/components/manual';
import PoseVideo from '@/components/PoseLibrary/PoseVideo';

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
              <PoseVideo url="https://youtu.be/vLBptI0ebac" title="Finding Your Authentic Voice" className="mb-8" />
              <p className="mb-4 leading-relaxed text-lg">
                Your authentic teaching voice is the unique, resonant alchemy of your technical knowledge, your distinct personality, and your direct, embodied experience of the yoga practice. It is not something to be manufactured or imitated, but rather something to be uncovered and allowed to emerge. Trust that your authenticity is your single greatest asset as a teacher; it is what will create genuine connection and trust.
              </p>
              <ul className="space-y-4 mb-4 ml-5 list-disc">
                <li><strong>Teach from Your Scars, Not Your Open Wounds</strong>: A powerful and resonant teaching principle. Share the wisdom you have integrated and the lessons you have learned from past challenges, not the raw emotions you are still actively processing. Your students are there for their own healing, not to hold space for yours.</li>
                <li><strong>Give Yourself Permission to be Imperfect</strong>: Your students do not need or want a perfect, robotic teacher; they need a real, relatable human being. It is not only okay, but deeply connecting, to stumble over words, forget a pose in your sequence, or laugh at yourself with grace.</li>
                <li><strong>Master the Power of Silence</strong>: A confident, grounded teacher knows when not to talk. Skillful use of silence is a profound teaching tool. It allows students to have their own direct experience, to feel the subtle effects of a pose, and to connect with their own inner landscape without constant external input.</li>
                <li><strong>Find Your Own Words</strong>: As you learn, you will borrow cues and phrases. This is natural. The next step is to filter them through your own understanding and experience until they become your own. How does a pose *feel* to you? Describe that.</li>
              </ul>
            </ManualSection>

            <ManualSection id="sequencing" title="The Art and Science of Intelligent Sequencing">
              <p className="mb-4 leading-relaxed">
                A well-designed sequence is far more than a random collection of poses. It is an intentional, intelligent, and creative journey—a story with a beginning, a middle, and an end. A great sequence safely and progressively warms the body, mindfully explores a specific theme or peak pose, and then gradually cools the body down, leading to a state of deep, integrative rest.
              </p>
              <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-4">The Universal Arc of a Class</h3>
              <ol className="space-y-3 mb-4 ml-5 list-decimal">
                <li><strong>Centering & Arrival (5-7 min)</strong>: Create the container. Guide students from their busy day into the present moment. Set the class theme, introduce breathwork (pranayama), and land in the room.</li>
                <li><strong>Warm-up (10-15 min)</strong>: Gentle, dynamic movements to wake up the spine and major joints. Examples: Cat-Cow, gentle spinal twists, Sun Salutation A. The goal is to increase synovial fluid and prepare the body for more complex movements.</li>
                <li><strong>Building Heat & Flow (15-20 min)</strong>: More vigorous, rhythmic flows to build internal heat (tapas) and establish a steady vinyasa. Examples: Sun Salutation B, standing pose series (Warriors, lunges, etc.).</li>
                <li><strong>Peak Exploration (10-15 min)</strong>: Intelligently work towards a specific peak pose (e.g., Crow Pose, Bird of Paradise) or explore the class theme through deeper poses (e.g., heart openers for a class on compassion).</li>
                <li><strong>Cool Down & Counter-Posing (10-12 min)</strong>: Gradually down-regulate the nervous system. Include seated poses, gentle twists, and poses that counter the primary actions of the peak work (e.g., forward folds after backbends).</li>
                <li><strong>Savasana & Closing (7-10 min)</strong>: The most important pose. Allow for at least 7 minutes of uninterrupted, silent, or softly guided final relaxation for the body and mind to integrate the benefits of the practice. Close with a moment of gratitude or a return to the initial theme.</li>
              </ol>
              <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg my-6">
                <h4 className="font-semibold text-teal-300 mb-2">Sample Theme & Sequence: "Grounding into Gratitude"</h4>
                <p className="text-gray-300">
                  <strong>Theme:</strong> Cultivating stability and foundation (Muladhara Chakra) as a basis for thankfulness (Santosha).<br/>
                  <strong>Peak Pose:</strong> Vrksasana (Tree Pose) as a metaphor for being rooted yet reaching.<br/>
                  <strong>Sequence Notes:</strong> Focus on poses with a strong, conscious connection to the earth: Tadasana, all Warriors, low lunges, Skandasana. Cueing consistently emphasizes rooting down through all four corners of the feet. The closing meditation could be a simple practice of naming three things one is grateful for.
                </p>
              </div>
            </ManualSection>

            <ManualSection id="cueing" title="Layered, Invitational, and Effective Cueing">
              <p className="mb-4 leading-relaxed">Effective cueing is an art form. It needs to be clear, concise, and multi-dimensional, guiding students safely into the physical form of a pose while also inviting them into a deeper, more personal experience. Use invitational language ("I invite you to...") rather than commands ("You will...").</p>
              <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-4">The Three Layers of a Skillful Cue</h3>
              <ul className="space-y-4 mb-4 ml-5">
                <li><strong>Layer 1: Foundational / Anatomical ("The Bones")</strong>: Clear, simple, and direct instructions for safety and alignment. The "what" and "how." (e.g., "Step your right foot forward between your hands, stacking your front knee directly over your ankle.")</li>
                <li><strong>Layer 2: Energetic / Refinement ("The Energy")</strong>: Cues that describe the feeling, action, and direction of energy in the pose. (e.g., "While rooting down through your feet, feel an uplifting energy rise up through your spine.")</li>
                <li><strong>Layer 3: Thematic / Inspirational ("The Heart")</strong>: Connects the physical experience to the class theme or a deeper philosophical concept. This is what makes the class meaningful. (e.g., "As you root down firmly into the earth, can you feel a sense of gratitude for the unwavering support beneath you?")</li>
              </ul>
            </ManualSection>

            <ManualSection id="business" title="The Business of Yoga: Creating a Sustainable Path">
              <p className="mb-4 leading-relaxed">
                To share your passion for yoga professionally requires not just heart, but also practicality and business acumen. Understanding these fundamentals will help you build a sustainable, ethical, and fulfilling career or side-hustle as a teacher.
              </p>
              <ul className="space-y-4 mb-4 ml-5 list-disc">
                <li><strong>Professional Liability Insurance</strong>: This is absolutely non-negotiable. It protects you, your students, and the studios where you teach. Secure this before you teach your first class.</li>
                <li><strong>Setting Your Rates & Valuing Your Worth</strong>: Research your local market for standard rates for studio classes, private sessions, and corporate events. Value your training, your preparation time, and your expertise. Do not undercharge.</li>
                <li><strong>Marketing Yourself Authentically</strong>: You don't need to be a social media influencer. Start by sharing what you love about yoga with your existing community. A simple, professional website, a clear schedule, and an email list are often the most effective tools.</li>
                <li><strong>Commitment to Continuing Education</strong>: This 200-hour training is the beginning of your journey, not the final destination. Commit to being a lifelong student. Attend workshops with senior teachers, read books, study related modalities, and most importantly, never abandon your personal practice.</li>
              </ul>
            </ManualSection>

            <ManualSection id="ethics" title="Ethics & The Sacred Seat of the Teacher">
              <p className="mb-4 leading-relaxed">
                To take "the seat of the teacher" (a role historically known as Guru) is to step into a position of profound trust and responsibility. It requires impeccable integrity, strong and clear boundaries, a deep sense of humility, and a commitment to always putting the students' well-being first.
              </p>
              <ul className="space-y-4 mb-4 ml-5 list-disc">
                <li><strong>Know Your Scope of Practice</strong>: You are a yoga teacher, not a psychotherapist, a doctor, or a nutritionist. Be confident in what you know, and be humble about what you don't. Refer students to other qualified professionals when their needs are outside your scope.</li>
                <li><strong>Maintain Professional Boundaries</strong>: Maintain clear and appropriate energetic, physical, and personal boundaries in your relationships with students. This is crucial for creating a safe and respected learning environment.</li>
                <li><strong>Cultural Appreciation vs. Appropriation</strong>: Continuously educate yourself and honor the South Asian roots of yoga. Study its history, learn the basic meaning and pronunciation of Sanskrit terms you use, and avoid presenting this profound spiritual practice as a mere workout or commodity.</li>
              </ul>
            </ManualSection>

            <ManualSection id="closing" title="A Beginning, Not an End: Your Path Forward">
              <div className="p-4 bg-blue-900/20 border-l-4 border-blue-400 rounded-r-lg my-6">
                <h4 className="font-semibold text-blue-300 mb-2">Final Reflection & Intention Setting</h4>
                <p className="text-blue-200/90">
                  Completing this training is a significant and commendable accomplishment, but it is also the true starting line of your journey as a teacher. The path of teaching is the path of a dedicated student. As you prepare to step onto this path, take a quiet moment to reflect: What is your deepest, most heartfelt intention for sharing this practice? What unique gifts, perspectives, and experiences do you hope to share with your future students?
                </p>
                <p className="mt-4 text-blue-200/90">
                  Write this intention down. Place it somewhere you can see it. Let it be your compass, your North Star, on the beautiful, challenging, and endlessly rewarding journey ahead. We are so proud of you. Welcome to the community of teachers. Namaste.
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