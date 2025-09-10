export async function fetchVisitorCount(): Promise<number> {
  try {
    const res = await fetch('/api/metrics/visitors', { next: { revalidate: 0 } });
    if (!res.ok) throw new Error('Failed to fetch visitor count');
    const data = await res.json();
    return typeof data.total === 'number' ? data.total : 0;
  } catch {
    return 0;
  }
}
