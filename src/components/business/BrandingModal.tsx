"use client";

import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/Modal';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface BrandingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BrandingModal({ isOpen, onClose }: BrandingModalProps) {
  const [isTextExpanded, setIsTextExpanded] = useState(false);

  const brandingContent = `# Building Your Yoga Brand from Scratch

## Introduction

Creating a compelling yoga brand is essential for attracting and retaining your ideal students. This comprehensive guide will walk you through the essential steps to build a strong, authentic yoga brand that resonates with your target audience.

## Core Brand Elements

### 1. Define Your Yoga Philosophy
- Identify your unique teaching style
- Clarify your core values and beliefs
- Determine what makes your approach special
- Connect with your personal yoga journey

### 2. Identify Your Target Audience
- Define your ideal student demographics
- Understand their needs and challenges
- Research their preferences and lifestyle
- Create detailed student personas

### 3. Develop Your Brand Voice
- Choose your communication tone (warm, professional, inspiring, etc.)
- Define your messaging style
- Create consistent language patterns
- Develop your unique value proposition

## Visual Brand Identity

### Logo and Visual Elements
- Design a memorable logo that reflects your style
- Choose a consistent color palette
- Select fonts that match your brand personality
- Create visual guidelines for consistency

### Photography and Imagery
- Develop a consistent photography style
- Use authentic, high-quality images
- Ensure diversity and inclusivity in representation
- Maintain consistent lighting and composition

## Brand Application

### Online Presence
- Create a professional website
- Maintain consistent social media profiles
- Develop engaging content strategies
- Use SEO best practices

### Marketing Materials
- Design professional business cards
- Create branded flyers and posters
- Develop email templates
- Design merchandise and props

## Building Community

### Student Engagement
- Foster authentic connections
- Create inclusive spaces
- Encourage feedback and interaction
- Build loyalty through consistency

### Partnerships and Collaborations
- Connect with local businesses
- Partner with other yoga teachers
- Engage with the broader yoga community
- Participate in wellness events

## Measuring Success

### Key Performance Indicators
- Track student retention rates
- Monitor social media engagement
- Measure class attendance
- Assess brand recognition

### Continuous Improvement
- Regularly review and update your brand
- Stay current with industry trends
- Adapt to student feedback
- Evolve while maintaining core identity

## Conclusion

Building a successful yoga brand takes time, consistency, and authenticity. Focus on serving your students while staying true to your unique teaching style and values. Remember that your brand is not just what you say about yourself, but what others experience when they practice with you.`;

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="lg" className="max-w-4xl max-h-[90vh] overflow-hidden">
        <ModalHeader>
          <ModalTitle>Building Your Yoga Brand from Scratch</ModalTitle>
        </ModalHeader>
        
        <div className="space-y-6 overflow-y-auto">
          {/* YouTube Video Embed */}
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/4b9hAxHO48U"
              title="Building Your Yoga Brand from Scratch"
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
                Branding Manual - Complete Guide
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
                    {brandingContent}
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