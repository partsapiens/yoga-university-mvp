import { vi } from 'vitest';

export const supabase = {
  from: vi.fn(() => ({
    select: vi.fn().mockResolvedValue({ data: [], error: null }),
  })),
};
