'use client'

interface NavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navigation({ currentTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'poses', label: 'Pose Library', icon: '🧘‍♀️' },
    { id: 'flows', label: 'Flow Builder', icon: '🔄' },
    { id: 'journal', label: 'Journal', icon: '📝' }
  ]

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🧘‍♀️</span>
            <h1 className="text-xl font-bold text-gray-900">
              Yoga Flow University
            </h1>
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
              AI Powered
            </span>
          </div>

          <nav className="flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
