export default function CommunitySection() {
  return (
    <section className="bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 p-8 rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Community & Social Learning</h2>
      <p className="text-gray-600 mb-6">Connect with fellow practitioners and teachers</p>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white/70 backdrop-blur-lg rounded-xl p-6 text-center">
          <h3 className="font-semibold text-gray-800 mb-2">🧘‍♀️ Practice Buddy</h3>
          <p className="text-sm text-gray-600 mb-4">Find accountability partners for daily practice.</p>
          <button className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-600 transition">
            Find Buddy
          </button>
        </div>
        <div className="bg-white/70 backdrop-blur-lg rounded-xl p-6 text-center">
          <h3 className="font-semibold text-gray-800 mb-2">👩‍🏫 Mentorship</h3>
          <p className="text-sm text-gray-600 mb-4">Connect with experienced teachers for guidance.</p>
          <button className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-600 transition">
            Find Mentor
          </button>
        </div>
        <div className="bg-white/70 backdrop-blur-lg rounded-xl p-6 text-center">
          <h3 className="font-semibold text-gray-800 mb-2">🏆 Monthly Challenge</h3>
          <p className="text-sm text-gray-600 mb-4">30-day hip opening challenge - Join 247 others.</p>
          <button className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-600 transition">
            Join Challenge
          </button>
        </div>
      </div>
    </section>
  );
}
