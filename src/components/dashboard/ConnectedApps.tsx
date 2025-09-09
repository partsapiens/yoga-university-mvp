import React from 'react';

const apps = [
  { key:'applewatch', icon:'⌚️', name:'Apple Watch', caption:'Heart rate & activity' },
  { key:'sleepcycle', icon:'😴', name:'Sleep Cycle', caption:'Sleep quality tracking' },
  { key:'spotify', icon:'🎵', name:'Spotify', caption:'Class playlists' },
  { key:'mfp', icon:'📋', name:'MyFitnessPal', caption:'Nutrition tracking' },
];

export function ConnectedApps() {
  return (
    <section className="mt-10">
      <h3 className="text-xl font-semibold mb-4">Connected Apps & Devices</h3>
      <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {apps.map(app => (
          <div key={app.key}
               className="rounded-2xl p-5 border border-gray-200 bg-white text-center shadow-sm">
            <div className="text-3xl mb-2">{app.icon}</div>
            <div className="font-medium">{app.name}</div>
            <div className="text-sm text-gray-600">{app.caption}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
