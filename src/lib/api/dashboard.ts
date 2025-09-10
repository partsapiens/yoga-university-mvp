import { DashboardData } from '@/types/dashboard';

export async function fetchDashboardData(): Promise<DashboardData> {
  // TODO: replace with real API call
  return {
    stats: [
      { title: 'Total Sessions', value: 0 },
      { title: 'Minutes Practiced', value: 0 },
      { title: 'Current Streak', value: '0 days' },
    ],
  };
}
