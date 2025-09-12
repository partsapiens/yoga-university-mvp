"use client";

import React, { useState, useEffect } from 'react';

// Privacy-friendly analytics for Yoga Flow University
// This module provides minimal, privacy-respecting analytics without tracking personal data

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  nonInteraction?: boolean;
}

class PrivacyFriendlyAnalytics {
  private endpoint: string;
  private isEnabled: boolean;
  private sessionId: string;

  constructor() {
    this.endpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT || '/api/analytics';
    this.isEnabled = this.checkAnalyticsConsent();
    this.sessionId = this.generateSessionId();
  }

  private checkAnalyticsConsent(): boolean {
    if (typeof window === 'undefined') return false;
    
    // Check if user has consented to analytics
    const consent = localStorage.getItem('analytics_consent');
    return consent === 'true';
  }

  private generateSessionId(): string {
    // Generate a temporary session ID that doesn't persist across sessions
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  public enableAnalytics(): void {
    this.isEnabled = true;
    localStorage.setItem('analytics_consent', 'true');
  }

  public disableAnalytics(): void {
    this.isEnabled = false;
    localStorage.setItem('analytics_consent', 'false');
  }

  public track(event: AnalyticsEvent): void {
    if (!this.isEnabled || typeof window === 'undefined') return;

    const payload = {
      ...event,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      url: window.location.pathname,
      referrer: document.referrer || '(direct)',
      userAgent: navigator.userAgent,
      language: navigator.language,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      // No IP tracking, no cookies, no personal identifiers
    };

    // Send to analytics endpoint
    this.sendAnalytics(payload);
  }

  private async sendAnalytics(payload: any): Promise<void> {
    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      // Silently fail - analytics should never break the user experience
      console.debug('Analytics send failed:', error);
    }
  }

  // Convenience methods for common events
  public trackPageView(path?: string): void {
    this.track({
      action: 'page_view',
      category: 'navigation',
      label: path || window.location.pathname,
    });
  }

  public trackCTA(ctaText: string, location: string): void {
    this.track({
      action: 'cta_click',
      category: 'engagement',
      label: `${ctaText} (${location})`,
    });
  }

  public trackOutboundLink(url: string, linkText?: string): void {
    this.track({
      action: 'outbound_click',
      category: 'external_link',
      label: `${url}${linkText ? ` (${linkText})` : ''}`,
    });
  }

  public trackMeditationSession(duration: number, type: string): void {
    this.track({
      action: 'meditation_complete',
      category: 'practice',
      label: type,
      value: Math.round(duration / 60), // Duration in minutes
    });
  }

  public trackFlowCreation(flowLength: number, duration: number): void {
    this.track({
      action: 'flow_created',
      category: 'creation',
      label: `${flowLength}_poses`,
      value: duration,
    });
  }

  public trackSearch(query: string, resultsCount?: number): void {
    this.track({
      action: 'search',
      category: 'discovery',
      label: query.toLowerCase(),
      value: resultsCount,
    });
  }

  public trackFeatureUsage(feature: string): void {
    this.track({
      action: 'feature_used',
      category: 'engagement',
      label: feature,
    });
  }

  // Enhanced analytics for AI insights
  public trackContentEngagement(contentType: string, contentId: string, timeSpent: number, completionRate?: number): void {
    this.track({
      action: 'content_engagement',
      category: 'content',
      label: `${contentType}:${contentId}`,
      value: timeSpent, // seconds
      nonInteraction: false,
    });

    if (completionRate !== undefined) {
      this.track({
        action: 'content_completion',
        category: 'content',
        label: `${contentType}:${contentId}`,
        value: Math.round(completionRate * 100), // percentage
      });
    }
  }

  public trackSessionQuality(sessionType: string, duration: number, qualityScore: number): void {
    this.track({
      action: 'session_quality',
      category: 'practice',
      label: sessionType,
      value: qualityScore, // 1-10 scale
    });
  }

  public trackContentPreference(contentType: string, preferenceAction: 'like' | 'save' | 'share' | 'skip'): void {
    this.track({
      action: 'content_preference',
      category: 'engagement',
      label: `${contentType}:${preferenceAction}`,
    });
  }

  public trackOptimalSessionLength(sessionType: string, plannedDuration: number, actualDuration: number): void {
    const completionRate = Math.min(actualDuration / plannedDuration, 1);
    this.track({
      action: 'session_duration_analysis',
      category: 'optimization',
      label: sessionType,
      value: Math.round(completionRate * 100),
    });
  }
}

// Singleton instance
const analytics = new PrivacyFriendlyAnalytics();

export { analytics };

// React hook for analytics
export const useAnalytics = () => {
  const trackPageView = (path?: string) => analytics.trackPageView(path);
  const trackCTA = (text: string, location: string) => analytics.trackCTA(text, location);
  const trackOutboundLink = (url: string, text?: string) => analytics.trackOutboundLink(url, text);
  const trackMeditationSession = (duration: number, type: string) => analytics.trackMeditationSession(duration, type);
  const trackFlowCreation = (length: number, duration: number) => analytics.trackFlowCreation(length, duration);
  const trackSearch = (query: string, results?: number) => analytics.trackSearch(query, results);
  const trackFeatureUsage = (feature: string) => analytics.trackFeatureUsage(feature);
  
  // Enhanced analytics for AI insights
  const trackContentEngagement = (contentType: string, contentId: string, timeSpent: number, completionRate?: number) => 
    analytics.trackContentEngagement(contentType, contentId, timeSpent, completionRate);
  const trackSessionQuality = (sessionType: string, duration: number, qualityScore: number) =>
    analytics.trackSessionQuality(sessionType, duration, qualityScore);
  const trackContentPreference = (contentType: string, preferenceAction: 'like' | 'save' | 'share' | 'skip') =>
    analytics.trackContentPreference(contentType, preferenceAction);
  const trackOptimalSessionLength = (sessionType: string, plannedDuration: number, actualDuration: number) =>
    analytics.trackOptimalSessionLength(sessionType, plannedDuration, actualDuration);

  return {
    trackPageView,
    trackCTA,
    trackOutboundLink,
    trackMeditationSession,
    trackFlowCreation,
    trackSearch,
    trackFeatureUsage,
    trackContentEngagement,
    trackSessionQuality,
    trackContentPreference,
    trackOptimalSessionLength,
    enableAnalytics: () => analytics.enableAnalytics(),
    disableAnalytics: () => analytics.disableAnalytics(),
  };
};

// Privacy-friendly analytics consent component
export const AnalyticsConsent: React.FC = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('analytics_consent');
    if (consent === null) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    analytics.enableAnalytics();
    setShowConsent(false);
  };

  const handleDecline = () => {
    analytics.disableAnalytics();
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Privacy-Friendly Analytics
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        We use privacy-friendly analytics to improve our platform. No personal data is collected.
      </p>
      <div className="flex space-x-2">
        <button
          onClick={handleAccept}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm transition-colors"
        >
          Accept
        </button>
        <button
          onClick={handleDecline}
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1.5 rounded text-sm transition-colors"
        >
          Decline
        </button>
      </div>
    </div>
  );
};