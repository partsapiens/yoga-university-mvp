# Pose Library – Implementation Guide

This guide outlines how to apply the Pose Library requirements to the `yoga-university-mvp` website.

## Navigation & Access

- Add a persistent “Pose Library” link to the global navigation bar.
- Add contextual links from:
  - AI Flow Builder
  - Dashboard
  - Pose detail pages

## Layout & Structure

- Use Tailwind CSS for a mobile-first, responsive grid.
- Pose cards include:
  - Thumbnail
  - Name (EN & Sanskrit)
  - Category
- Add sorting/filtering controls at the top.
- Implement infinite scroll (lazy loading).

## Pose Content Schema

- Each pose stores:
  - id, slug, name_en, name_sanskrit
  - icon_url, image_url, thumbnail_url
  - family_id, intensity
  - relationships (prep, counter, next)
  - meta (joint actions, muscle engagement, benefits, risks, cues, mistakes/corrections, audio cue)

## Search, Sort & Filter

- Search bar: pose name, Sanskrit, family.
- Filters:
  - Category/family
  - Intensity
  - Focus area
  - Plane of motion
  - Joint actions
- Sorting: alphabetical, intensity, family, recent/most used.

## Integrations

- Supabase: store pose data per schema.
- AI Flow Builder: support pose selection by filter.
- Dashboard: widget for “Recent Poses Viewed”.

## Performance & UX

- Lazy load images with skeleton loaders.
- Keyboard navigation (arrow keys, Enter for details).
- Mobile: swipe for cards.

## Pose Detail Page

- Full photo, metadata, anatomy breakdown.
- Teaching: cues, sequencing, adjustments.
- Safety: benefits, risks, contraindications.
- Playback button (TTS audio cue).

## Admin & Content Management

- CRUD via Supabase dashboard.
- Bulk import support (CSV/JSON).
- Images auto-named by slug.

## Future Enhancements

- 3D anatomy overlays
- AI-generated counterposes
- AR/VR alignment
- Pose statistics

---
For technical details, see `/docs/POSE_LIBRARY_SCHEMA.md` and `/docs/POSE_LIBRARY_STRUCTURE.md`.  
