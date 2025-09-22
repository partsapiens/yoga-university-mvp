import React from 'react';
import { Card, Button, ProgressBar, Badge } from '@/components/ui';

interface OverviewSectionProps {
    stats: {
        totalUsers: number;
        activeUsers: number;
        totalFlows: number;
        totalPoses: number;
        totalCourses: number;
        totalSessions: number;
        revenue: number;
        newUsersThisWeek: number;
        completedSessionsToday: number;
    }
  }

  const mockRecentActivity = [
    { type: 'user_signup', user: 'John Doe', timestamp: new Date(), details: 'New student registration' },
    { type: 'flow_created', user: '🤖 System', timestamp: new Date(Date.now() - 300000), details: 'Morning Flow generated' },
    { type: 'course_completed', user: 'Emma Wilson', timestamp: new Date(Date.now() - 600000), details: 'Yoga Philosophy course completed' },
    { type: 'pose_added', user: 'Admin', timestamp: new Date(Date.now() - 900000), details: 'Bird of Paradise pose added to library' }
  ]

export const OverviewSection: React.FC<OverviewSectionProps> = ({ stats }) => {
    return (
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold text-emerald-600">{stats.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-slate-600">Total Users</div>
            <div className="text-xs text-emerald-600 mt-1">+{stats.newUsersThisWeek} this week</div>
          </Card>

          <Card className="text-center">
            <div className="text-3xl mb-2">🧘‍♀️</div>
            <div className="text-2xl font-bold text-emerald-600">{stats.totalSessions.toLocaleString()}</div>
            <div className="text-sm text-slate-600">Practice Sessions</div>
            <div className="text-xs text-emerald-600 mt-1">+{stats.completedSessionsToday} today</div>
          </Card>

          <Card className="text-center">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold text-emerald-600">${stats.revenue.toLocaleString()}</div>
            <div className="text-sm text-slate-600">Monthly Revenue</div>
            <div className="text-xs text-emerald-600 mt-1">+12% vs last month</div>
          </Card>

          <Card className="text-center">
            <div className="text-3xl mb-2">📚</div>
            <div className="text-2xl font-bold text-emerald-600">{stats.totalCourses}</div>
            <div className="text-sm text-slate-600">Active Courses</div>
            <div className="text-xs text-emerald-600 mt-1">3 pending review</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">User Growth</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Active Users</span>
                  <span>{stats.activeUsers.toLocaleString()}</span>
                </div>
                <ProgressBar value={(stats.activeUsers / stats.totalUsers) * 100} color="emerald" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Students</span>
                  <span>{Math.floor(stats.totalUsers * 0.85).toLocaleString()}</span>
                </div>
                <ProgressBar value={85} color="blue" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Teachers</span>
                  <span>{Math.floor(stats.totalUsers * 0.12).toLocaleString()}</span>
                </div>
                <ProgressBar value={12} color="purple" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Admins</span>
                  <span>{Math.floor(stats.totalUsers * 0.03).toLocaleString()}</span>
                </div>
                <ProgressBar value={3} color="orange" />
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {mockRecentActivity.map((activity, index) => {
                const getActivityIcon = (type: string) => {
                  switch (type) {
                    case 'user_signup': return '👋'
                    case 'flow_created': return '🌊'
                    case 'course_completed': return '🎓'
                    case 'pose_added': return '🧘'
                    default: return '📝'
                  }
                }

                const getActivityColor = (type: string) => {
                  switch (type) {
                    case 'user_signup': return 'text-green-600'
                    case 'flow_created': return 'text-blue-600'
                    case 'course_completed': return 'text-purple-600'
                    case 'pose_added': return 'text-emerald-600'
                    default: return 'text-slate-600'
                  }
                }

                return (
                  <div key={index} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-slate-50">
                    <span className="text-xl">{getActivityIcon(activity.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{activity.user}</p>
                      <p className="text-sm text-slate-600">{activity.details}</p>
                      <p className="text-xs text-slate-500">
                        {activity.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <Badge variant="default" className={getActivityColor(activity.type)}>
                      {activity.type.replace('_', ' ')}
                    </Badge>
                  </div>
                )
              })}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Activity
            </Button>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <div className="text-2xl mb-1">➕</div>
              <div className="text-sm">Add Pose</div>
            </Button>

            <Button variant="outline" className="h-20 flex-col">
              <div className="text-2xl mb-1">📧</div>
              <div className="text-sm">Send Newsletter</div>
            </Button>

            <Button variant="outline" className="h-20 flex-col">
              <div className="text-2xl mb-1">🎓</div>
              <div className="text-sm">Review Courses</div>
            </Button>

            <Button variant="outline" className="h-20 flex-col">
              <div className="text-2xl mb-1">📊</div>
              <div className="text-sm">Export Data</div>
            </Button>
          </div>
        </Card>
      </div>
    )
  }
