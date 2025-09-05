export default function Integrations() {
  return (
    <section className="bg-white p-8 rounded-2xl border">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Connected Apps & Devices</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div className="border p-4 rounded-lg hover:shadow-md transition cursor-pointer border-green-500 bg-green-50">
          <div className="text-4xl">⌚</div>
          <h4 className="font-semibold mt-2">Apple Watch</h4>
          <small className="text-gray-500">Heart rate & activity</small>
        </div>
        <div className="border p-4 rounded-lg hover:shadow-md transition cursor-pointer">
          <div className="text-4xl">😴</div>
          <h4 className="font-semibold mt-2">Sleep Cycle</h4>
          <small className="text-gray-500">Sleep quality tracking</small>
        </div>
        <div className="border p-4 rounded-lg hover:shadow-md transition cursor-pointer border-green-500 bg-green-50">
          <div className="text-4xl">🎵</div>
          <h4 className="font-semibold mt-2">Spotify</h4>
          <small className="text-gray-500">Class playlists</small>
        </div>
        <div className="border p-4 rounded-lg hover:shadow-md transition cursor-pointer">
          <div className="text-4xl">🏥</div>
          <h4 className="font-semibold mt-2">MyFitnessPal</h4>
          <small className="text-gray-500">Nutrition tracking</small>
        </div>
      </div>
    </section>
  );
}
