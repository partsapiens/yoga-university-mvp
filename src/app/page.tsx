import AIDashboard from '@/components/dashboard/AIDashboard';
import DashboardClient from '@/components/dashboard/DashboardClient';

export default function Page() {
  return (
    <div className="rounded-2xl shadow-lg bg-white overflow-hidden">
      <AIDashboard />
      <DashboardClient />
    </div>
  );
}
