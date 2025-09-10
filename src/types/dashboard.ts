export interface DashboardStat {
  title: string;
  value: string | number;
}

export interface DashboardData {
  stats: DashboardStat[];
}
