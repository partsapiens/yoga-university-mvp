import { Award, Users, Calendar } from 'lucide-react';

export default function ProDevelopment() {
  return (
    <section className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 rounded-2xl">
      <h2 className="text-2xl font-bold mb-2">Professional Development</h2>
      <p className="opacity-90 mb-6">Continue your yoga teacher journey</p>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6">
          <h3 className="font-semibold flex items-center gap-2 mb-2">
            <Award />
            Continuing Education
          </h3>
          <p className="text-sm">15 / 20 hours completed this year</p>
          <div className="w-full bg-white/20 rounded-full h-2.5 mt-4">
            <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>
        <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6">
          <h3 className="font-semibold flex items-center gap-2 mb-2">
            <Users />
            Student Progress
          </h3>
          <p className="text-sm">42 active students</p>
          <ul className="text-xs list-disc list-inside mt-2 opacity-90">
            <li>8 new students this month</li>
            <li>12 students showing improvement</li>
          </ul>
        </div>
        <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6">
          <h3 className="font-semibold flex items-center gap-2 mb-2">
            <Calendar />
            Teaching Schedule
          </h3>
          <p className="text-sm">14 classes this week</p>
          <p className="text-xs mt-2 opacity-90">Next: C2 class at 6 PM today</p>
        </div>
      </div>
    </section>
  );
}
