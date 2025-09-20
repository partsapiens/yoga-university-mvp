"use client";

import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/Modal';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const [isTextExpanded, setIsTextExpanded] = useState(false);

  const pricingContent = `Excerpts from "Yoga Teacher Pricing for Profit and Sustainability"

Page 1: Know Your Worth and Build Your Pricing Structure

Pricing your yoga classes and services isn't just about covering your costs; it's a reflection of your worth, your expertise, and the transformative value you offer. It's crucial to distinguish between your intrinsic worth as a teacher and your financial costs.

Worth vs. Cost: Your intrinsic worth comes from your unique training, skills, and personal journey, all of which contribute to the unique experience you provide. Your costs are the tangible expenses of running your business. Pricing for profit means setting a price that honors both.

To begin, take a moment to reflect. List your certifications, years of experience, and specialized skills. Next, translate how each of these differentiators provides a specific benefit to your students. This is the value you will communicate.

Now, let's build a pricing structure. This isn't just about a single number; it's a strategic process:

Calculate Total Operating Costs: List all your expenses, including studio rentals, props, music subscriptions, travel, and continuing education. Don't forget to value your time spent on lesson planning, marketing, and administration.

Determine Your Break-Even Rate: This is the minimum amount you must charge per class or hour to simply cover your costs from step 1.

Add a Profit and Savings Margin: To ensure financial sustainability, your final price must be set above the break-even rate. This margin is what allows you to save, invest in future growth, and truly build a sustainable business.

Finally, structure your rates to encourage student commitment. While drop-in rates are convenient, offer discounts on class packs and memberships. This provides predictable revenue for you and encourages students to make a long-term commitment to their practice.

Page 2: Market Research and Positioning

Once you have a clear understanding of your value and costs, you need to understand your local market. Research what other instructors with similar experience and specializations are charging. This is about finding your place, not just fitting in.

Mitigate Undervaluation Risk: Pricing too low can signal to potential students that you lack confidence or quality, which undermines your professional value. It's better to be a bit more expensive and justify it with a superior offering than to be the cheapest option in the area.

Justifying Premium Rates: If you decide to price slightly above the local market rate, you must justify it. Link your unique value directly to measurable outcomes or experiences for your students. For example, a higher price might be justified by offering highly specialized props, guaranteeing smaller class sizes for personalized attention, or focusing on a niche that no one else in your area offers. Your pricing should align with the quality and uniqueness of what you deliver.

Page 3: Adjusting and Growing

Your pricing strategy isn't static; it should evolve as you grow. As you gain more experience, certifications, and expertise, your value increases, and your prices should reflect that.

Formalize Value-Addition as Strategy: Your approach to growth should be continuous. Regularly introduce advanced workshops, special series, or unique offerings that add value to your overall teaching. These are not just one-off events, but a continuous strategy to justify future rate adjustments based on your growing expertise.

Communication Strategy for Increases: When the time comes to increase your rates, communicate it with confidence. Inform your students well in advance and clearly explain the reason for the adjustment. Frame the increase as a necessary investment in the consistent quality of your instruction and your professional longevity. Your students will understand and appreciate your commitment to your craft. This process reflects your self-respect and commitment to a sustainable professional life.`;

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="lg" className="max-w-4xl max-h-[90vh] overflow-hidden">
        <ModalHeader>
          <ModalTitle>Pricing Your Yoga Services for Profit</ModalTitle>
        </ModalHeader>
        
        <div className="space-y-6 overflow-y-auto">
          {/* YouTube Video Embed */}
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/G4S1YWo1UY4"
              title="Pricing Your Yoga Services for Profit"
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
                Excerpts from "Yoga Teacher Pricing for Profit and Sustainability"
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
                    {pricingContent}
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