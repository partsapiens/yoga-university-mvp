'use client'

import { useState } from 'react'

export default function Journal() {
  const [selectedMood, setSelectedMood] = useState('😊')
  const [notes, setNotes] = useState('')

  const moods = ['😊', '🙂', '😐', '😔', '😴']

  const handleSave = () => {
    console.log('Saving journal entry:', { mood: selectedMood, notes })
    alert('Journal entry saved!')
    setNotes('')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Today's Practice</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How are you feeling?
            </label>
            <div className="flex gap-3">
              {moods.map(mood => (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  className={`text-3xl p-2 rounded-lg transition-colors ${
                    selectedMood === mood
                      ? 'bg-blue-100 ring-2 ring-blue-500'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Practice Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How was your practice today? What did you notice?"
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                defaultValue={60}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Energy Level
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Low</option>
                <option>Moderate</option>
                <option>High</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save Entry
          </button>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Recent Entries</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">Yesterday</span>
              <span className="text-2xl">😊</span>
            </div>
            <p className="text-gray-600 text-sm">Great flow today. Felt strong in warrior poses and managed to hold crow for 10 seconds!</p>
            <div className="text-xs text-gray-500 mt-1">75 min • High energy</div>
          </div>

          <div className="border-l-4 border-gray-300 pl-4 py-2">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">2 days ago</span>
              <span className="text-2xl">😐</span>
            </div>
            <p className="text-gray-600 text-sm">Challenging practice. Lower back was tight, focused on gentle hip openers.</p>
            <div className="text-xs text-gray-500 mt-1">45 min • Low energy</div>
          </div>
        </div>
      </div>
    </div>
  )
}
