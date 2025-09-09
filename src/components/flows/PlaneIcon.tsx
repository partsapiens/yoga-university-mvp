import React from 'react';

export function PlaneIcon({ plane }: { plane?: string | null }) {
  const title = plane ? `${plane[0].toUpperCase()}${plane.slice(1)} plane` : 'Unknown plane';

  if (plane === 'sagittal') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" aria-label={title}>
        <title>{title}</title>
        <path d="M8 2v12" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="4" cy="8" r="1.2" fill="currentColor" />
        <circle cx="12" cy="8" r="1.2" fill="currentColor" />
      </svg>
    );
  }
  if (plane === 'frontal') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" aria-label={title}>
        <title>{title}</title>
        <path d="M2 8h12" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="8" cy="4" r="1.2" fill="currentColor" />
        <circle cx="8" cy="12" r="1.2" fill="currentColor" />
      </svg>
    );
  }
  if (plane === 'transverse') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" aria-label={title}>
        <title>{title}</title>
        <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="8" cy="8" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-label={title}>
      <title>{title}</title>
      <text x="4" y="12" fontSize="12" fill="currentColor">?</text>
    </svg>
  );
}
