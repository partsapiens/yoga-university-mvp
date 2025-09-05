import { Brain } from 'lucide-react';

export default function AIDashboard() {
  return (
    <div className="bg-gradient-to-r from-pink-400 via-red-400 to-yellow-500 text-white p-8">
      <div className="grid md:grid-cols-3 gap-8 items-center">
        <div className="md:col-span-2 bg-white/20 backdrop-blur-lg rounded-xl p-6">
          <h2 className="font-bold text-xl flex items-center gap-2">
            <Brain className="text-yellow-300" />
            AI Recommendation
          </h2>
          <p className="opacity-90 mb-4">Based on your recent lower back tension</p>
          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-lg">
            <div className="text-4xl">🧘‍♀️</div>
            <div>
              <div className="font-semibold">Gentle Hip Release Flow</div>
              <div className="text-sm opacity-90">25 min • Focus on psoas & piriformis</div>
            </div>
          </div>
          <button className="mt-4 bg-white/20 border border-white/30 text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/30 transition">
            Start Flow
          </button>
        </div>
        <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 text-center">
          <div className="text-4xl font-bold">87%</div>
          <div className="opacity-90">Form Accuracy</div>
          <div className="text-sm opacity-80 mt-2">+5% from last week</div>
        </div>
        <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 text-center">
          <div className="text-4xl font-bold">4.2h</div>
          <div className="opacity-90">Weekly Practice</div>
          <div className="text-sm opacity-80 mt-2">Goal: 5h</div>
        </div>
      </div>
    </div>
  );
}
