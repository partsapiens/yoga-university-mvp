interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  userId?: string;
  metadata?: Record<string, any>;
}

class Analytics {
  private isEnabled: boolean;
  
  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'production' && 
                     typeof window !== 'undefined';
  }

  track(event: AnalyticsEvent) {
    if (!this.isEnabled) {
      // In development, just log to console
      console.log('Analytics Event:', event);
      return;
    }

    // In production, you would integrate with analytics services
    // Examples of integrations:
    
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_parameter_1: event.metadata,
      });
    }

    // Plausible Analytics
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible(event.action, {
        props: {
          category: event.category,
          label: event.label,
          ...event.metadata,
        }
      });
    }

    // Custom analytics endpoint
    if (typeof window !== 'undefined') {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...event,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      }).catch(error => {
        console.warn('Analytics tracking failed:', error);
      });
    }
  }

  // Convenience methods for common events
  trackPoseView(poseId: string, poseName: string) {
    this.track({
      action: 'pose_view',
      category: 'pose_library',
      label: poseName,
      metadata: { poseId }
    });
  }

  trackPoseFavorite(poseId: string, poseName: string, isFavorited: boolean) {
    this.track({
      action: isFavorited ? 'pose_favorited' : 'pose_unfavorited',
      category: 'pose_library',
      label: poseName,
      metadata: { poseId }
    });
  }

  trackPoseAddedToFlow(poseId: string, poseName: string) {
    this.track({
      action: 'pose_added_to_flow',
      category: 'flow_builder',
      label: poseName,
      metadata: { poseId }
    });
  }

  trackSearch(query: string, resultsCount: number) {
    this.track({
      action: 'search',
      category: 'pose_library',
      label: query,
      value: resultsCount
    });
  }

  trackFilter(filterType: string, filterValue: string | string[]) {
    this.track({
      action: 'filter_applied',
      category: 'pose_library',
      label: filterType,
      metadata: { filterValue }
    });
  }

  trackTTSPlayback(poseId: string, poseName: string) {
    this.track({
      action: 'tts_playback',
      category: 'accessibility',
      label: poseName,
      metadata: { poseId }
    });
  }

  trackKeyboardNavigation(action: string) {
    this.track({
      action: 'keyboard_navigation',
      category: 'accessibility',
      label: action
    });
  }
}

export const analytics = new Analytics();