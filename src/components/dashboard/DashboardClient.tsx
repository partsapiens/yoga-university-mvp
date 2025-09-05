"use client";

import { useState } from 'react';
import { Home, User, Layers, Users, Book, BarChart } from 'lucide-react';

import ProDevelopment from './ProDevelopment';
import ARFormChecker from './ARFormChecker';
import CommunitySection from './CommunitySection';
import Integrations from './Integrations';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'poses', label: 'Pose Library', icon: User },
  { id: 'flows', label: 'Flow Builder', icon: Layers },
  { id: 'community', label: 'Community', icon: Users },
  { id: 'journal', label: 'Journal', icon: Book },
  { id: 'analytics', label: 'Analytics', icon: BarChart },
];

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="p-8 grid gap-8">
            <ProDevelopment />
            <ARFormChecker />
            <CommunitySection />
            <Integrations />
          </div>
        );
      // Other cases will be handled by navigating to different pages,
      // but we can add placeholders here if needed.
      default:
        return <div className="p-8">Content for {activeTab}</div>;
    }
  };

  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div>
        {renderContent()}
      </div>
    </div>
  );
}
