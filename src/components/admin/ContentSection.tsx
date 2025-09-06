import React, { useState } from 'react';
import { Card, Button, Badge } from '@/components/ui';

const mockStats = {
    totalPoses: 892,
    totalFlows: 3247,
    totalCourses: 67,
}

export const ContentSection: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'poses' | 'flows' | 'courses'>('poses')

    return (
      <div className="space-y-6">
        {/* Content Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <div className="text-3xl mb-2">🧘</div>
            <div className="text-2xl font-bold text-emerald-600">{mockStats.totalPoses}</div>
            <div className="text-sm text-slate-600">Total Poses</div>
            <Button variant="outline" size="sm" className="mt-2">Manage Poses</Button>
          </Card>

          <Card className="text-center">
            <div className="text-3xl mb-2">🌊</div>
            <div className="text-2xl font-bold text-emerald-600">{mockStats.totalFlows}</div>
            <div className="text-sm text-slate-600">User Flows</div>
            <Button variant="outline" size="sm" className="mt-2">Review Flows</Button>
          </Card>

          <Card className="text-center">
            <div className="text-3xl mb-2">📚</div>
            <div className="text-2xl font-bold text-emerald-600">{mockStats.totalCourses}</div>
            <div className="text-sm text-slate-600">Published Courses</div>
            <Button variant="outline" size="sm" className="mt-2">Add Course</Button>
          </Card>
        </div>

        {/* Content Management */}
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Content Management</h3>
            <Button>Add New Content</Button>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-slate-200 mb-6">
            <nav className="flex space-x-8">
              {['poses', 'flows', 'courses'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`
                    py-2 px-1 border-b-2 font-medium text-sm transition-colors capitalize
                    ${activeTab === tab
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                    }
                  `}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Content Lists */}
          <div className="space-y-4">
            {activeTab === 'poses' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-900">Mountain Pose</h4>
                    <p className="text-sm text-slate-600">Tadasana • Standing • Beginner</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="success">Published</Badge>
                    <Button size="sm" variant="outline">Edit</Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-900">Warrior III</h4>
                    <p className="text-sm text-slate-600">Virabhadrasana III • Standing • Advanced</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="warning">Review Needed</Badge>
                    <Button size="sm" variant="outline">Edit</Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'flows' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-900">Morning Energizer</h4>
                    <p className="text-sm text-slate-600">20 min • Vinyasa • 156 practices</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="info">AI Generated</Badge>
                    <Button size="sm" variant="outline">View</Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-900">200 Hour Teacher Training</h4>
                    <p className="text-sm text-slate-600">200 hours • 1,250 students • $2,500</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="success">Published</Badge>
                    <Button size="sm" variant="outline">Manage</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    )
  }
