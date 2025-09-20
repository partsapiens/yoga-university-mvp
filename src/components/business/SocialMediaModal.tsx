"use client";

import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/Modal';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SocialMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SocialMediaModal({ isOpen, onClose }: SocialMediaModalProps) {
  const [isTextExpanded, setIsTextExpanded] = useState(false);

  const socialMediaContent = `Social Media Strategy for Yoga Instructors

Page 1: Mastering the Big Three Social Media Platforms

The implementation of any social media strategy for yoga instructors is most effective when it is grounded in a strong, authentic brand identity. This foundation is necessary to ensure that messaging and content consistently resonate with the target audience.

The strategy centers on leveraging the "Big Three" platforms, each utilized for distinct purposes aligned with the goals of sharing content and building community:

Platform | Primary Purpose and Utility | Key Content Types
---------|---------------------------|------------------
Instagram | Visual storytelling, live sessions, and Reels. | High-quality videos and tutorials. Its focus on visual language aligns well with the practice of yoga.
Facebook | Groups, event promotions, and community building. | Supports the goal of nurturing a loyal and supportive community around the instructor's practice.
TikTok | Leveraging Quick, creative videos and trending challenges. | Focuses on high visibility through rapidly consumed, engaging content.

When implementing this strategy, it is crucial to select the platforms where your ideal students spend their time.

Page 2: Growth & Engagement Strategy Expansion

The overall strategy emphasizes three interconnected areas essential for growth: consistency, engagement, and tracking.

A. Create Consistent Content

Consistency is key. Instructors must schedule regular posts and stories and post high-quality videos, tutorials, and inspirational quotes. To ensure effectiveness and instant recognition, this content must align directly with the established brand:

Reflect Your Brand Identity: High-quality content should embody the defined Brand Voice (which could be encouraging and supportive, or informative and technical) and the unique Personality and Voice (such as calm, energetic, or playful).

Visual Consistency: Content must maintain a consistent Visual Identity, which includes a selected color palette, complementary fonts, and a photography style that accurately reflects the brand's personality.

Solve Pain Points: Videos and tutorials must articulate a clear and compelling solution to the specific problems or "pain points" that ideal students are trying to solve. Examples include providing stress relief for corporate professionals or improved flexibility for athletes.

B. Engage Your Audience

Engagement is the process that transforms followers into a community. The strategy requires instructors to reply to comments and messages and collaborate with other wellness brands and instructors. Collaboration and interaction are vital for building community by reaching shared audiences.

Successful engagement is founded on first attracting the right students. This is achieved by clearly articulating the brand's Mission and Values and defining the instructor's specific Expertise and Niche (for example, restorative yoga for seniors or pre-natal yoga).

C. Track Analytics

To effectively refine the strategy, instructors are required to Monitor reach, engagement, and conversions. By tracking these metrics, you can determine if the tailored schedule, content offerings, and messaging are successfully meeting the specific needs of the students you want to serve. This measurable, focused approach is considered the essence of effective and authentic branding and growth.

Page 3: Branding as the Foundation

The entire success of any social media growth strategy for a yoga teacher ultimately hinges on first creating a compelling brand identity that is designed to attract their ideal students. A strong brand helps the instructor stand out effectively in what is often a crowded market.

Before an instructor begins posting consistent content, they must clearly define two foundational elements:

Your Identity

Defining your identity involves articulating the following foundational aspects:

Mission and Values: This encompasses the overarching principles and purpose of the instructor's teaching.

Expertise and Niche: This describes the specific area that sets the instructor apart from others.

Your Ideal Student

It is critical to understand who you are trying to reach. This involves describing in detail:

Their goals and interests.

Their challenges.

What specifically motivates them to practice yoga.

Instead of attempting to appeal to everyone, the strategy emphasizes focusing on connecting deeply with this specific ideal student population. This deep connection ensures the content created is relevant and the growth strategy is targeted.`;

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="lg" className="max-w-4xl max-h-[90vh] overflow-hidden">
        <ModalHeader>
          <ModalTitle>Social Media Management for Yoga Teachers</ModalTitle>
        </ModalHeader>
        
        <div className="space-y-6 overflow-y-auto">
          {/* YouTube Video Embed */}
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/Csq5TpRuGY8"
              title="Social Media Management for Yoga Teachers"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Expandable Text Content */}
          <div className="border-t pt-6">
            <button
              onClick={() => setIsTextExpanded(!isTextExpanded)}
              className="flex items-center justify-between w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="font-semibold text-gray-900 dark:text-white">
                Social Media Strategy Guide - Complete Manual
              </span>
              {isTextExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            
            {isTextExpanded && (
              <div className="mt-4 max-h-96 overflow-y-auto">
                <div className="prose prose-sm dark:prose-invert max-w-none p-4 bg-white dark:bg-gray-900 rounded-lg border">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {socialMediaContent}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}