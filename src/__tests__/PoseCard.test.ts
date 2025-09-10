import { describe, it, expect, vi } from 'vitest';

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => 
    React.createElement('a', { href }, children)
}));

// Mock pose data
const mockPose = {
  id: '1',
  slug: 'downward-dog',
  name_en: 'Downward Dog',
  name_sanskrit: 'Adho Mukha Svanasana',
  family_id: 'Standing',
  thumbnail_url: 'https://example.com/thumb.jpg',
  icon_url: 'https://example.com/icon.jpg'
};

describe('PoseCard Component', () => {
  it('should have correct pose data structure', () => {
    expect(mockPose).toHaveProperty('name_en', 'Downward Dog');
    expect(mockPose).toHaveProperty('name_sanskrit', 'Adho Mukha Svanasana');
    expect(mockPose).toHaveProperty('family_id', 'Standing');
    expect(mockPose).toHaveProperty('slug', 'downward-dog');
  });

  it('should generate correct href for pose link', () => {
    const expectedHref = `/pose/${mockPose.slug}`;
    expect(expectedHref).toBe('/pose/downward-dog');
  });
});