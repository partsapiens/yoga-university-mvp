"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Users, 
  BarChart3, 
  DollarSign, 
  Clock, 
  MapPin,
  Plus,
  Eye,
  Edit,
  UserCheck,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function StudioManagementPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'classes' | 'students' | 'analytics'>('dashboard');

  // Mock data - in a real app, this would come from your database
  const upcomingClasses = [
    {
      id: 1,
      title: 'Morning Vinyasa Flow',
      time: '07:00 AM',
      date: 'Today',
      instructor: 'Sarah Johnson',
      enrolled: 12,
      capacity: 20,
      room: 'Studio A',
      status: 'confirmed'
    },
    {
      id: 2,
      title: 'Beginner Hatha',
      time: '09:30 AM',
      date: 'Today',
      instructor: 'Mike Chen',
      enrolled: 8,
      capacity: 15,
      room: 'Studio B',
      status: 'confirmed'
    },
    {
      id: 3,
      title: 'Power Yoga',
      time: '06:00 PM',
      date: 'Today',
      instructor: 'Emma Rodriguez',
      enrolled: 18,
      capacity: 20,
      room: 'Studio A',
      status: 'nearly_full'
    }
  ];

  const recentStudents = [
    {
      id: 1,
      name: 'Alice Cooper',
      email: 'alice@example.com',
      joinDate: '2024-01-15',
      classesAttended: 24,
      membershipType: 'Monthly Unlimited',
      status: 'active'
    },
    {
      id: 2,
      name: 'Bob Wilson',
      email: 'bob@example.com',
      joinDate: '2024-02-01',
      classesAttended: 12,
      membershipType: 'Class Pack (10)',
      status: 'active'
    },
    {
      id: 3,
      name: 'Carol Davis',
      email: 'carol@example.com',
      joinDate: '2023-11-20',
      classesAttended: 48,
      membershipType: 'Annual Membership',
      status: 'active'
    }
  ];

  const analyticsData = {
    totalRevenue: 12450,
    totalStudents: 156,
    classesThisMonth: 89,
    averageAttendance: 82,
    monthlyGrowth: 8.5,
    popularTimes: [
      { time: '7:00 AM', percentage: 85 },
      { time: '9:30 AM', percentage: 65 },
      { time: '12:00 PM', percentage: 45 },
      { time: '6:00 PM', percentage: 95 },
      { time: '7:30 PM', percentage: 70 }
    ]
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'classes', label: 'Classes', icon: <Calendar className="w-4 h-4" /> },
    { id: 'students', label: 'Students', icon: <Users className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Studio Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your yoga studio with ease
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                <Plus className="w-4 h-4" />
                New Class
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Monthly Revenue
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${analyticsData.totalRevenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">+{analyticsData.monthlyGrowth}%</span>
                  <span className="text-gray-500 ml-1">from last month</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Students
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {analyticsData.totalStudents}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Classes This Month
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {analyticsData.classesThisMonth}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Avg. Attendance
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {analyticsData.averageAttendance}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Classes */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Today&apos;s Classes
                </h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {upcomingClasses.map((classItem) => (
                  <div key={classItem.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {classItem.time}
                          </div>
                          <div className="text-xs text-gray-500">
                            {classItem.room}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {classItem.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            with {classItem.instructor}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {classItem.enrolled}/{classItem.capacity}
                          </div>
                          <div className="text-xs text-gray-500">enrolled</div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          classItem.status === 'nearly_full'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {classItem.status === 'nearly_full' ? 'Nearly Full' : 'Available'}
                        </div>
                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'classes' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Class Schedule
                  </h2>
                  <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Class
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Class Management Coming Soon
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Full class scheduling and management features will be available in the next update.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Student Directory
                  </h2>
                  <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Student
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Membership
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Classes Attended
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Join Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {recentStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {student.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {student.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {student.membershipType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {student.classesAttended}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {new Date(student.joinDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                            <Edit className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Popular Class Times
                </h3>
                <div className="space-y-4">
                  {analyticsData.popularTimes.map((time, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {time.time}
                      </span>
                      <div className="flex items-center gap-2 flex-1 ml-4">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${time.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {time.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Revenue Insights
                </h3>
                <div className="text-center py-8">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Detailed analytics charts coming soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}