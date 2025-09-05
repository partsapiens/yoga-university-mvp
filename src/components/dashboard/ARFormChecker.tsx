import { Camera } from 'lucide-react';

export default function ARFormChecker() {
  return (
    <section className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-8 rounded-2xl text-center">
      <h2 className="text-2xl font-bold mb-2">AI Form Checker</h2>
      <p className="opacity-90 mb-6">Use your camera for real-time pose alignment feedback</p>
      <div className="bg-black/20 w-full max-w-md mx-auto h-64 rounded-lg flex flex-col items-center justify-center mb-6">
        <Camera className="w-16 h-16 opacity-50 mb-4" />
        <p>Click to enable camera and start pose detection</p>
      </div>
      <button className="bg-white/20 border border-white/30 text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/30 transition flex items-center gap-2 mx-auto">
        <Camera className="w-5 h-5" />
        Enable Camera
      </button>
    </section>
  );
}
