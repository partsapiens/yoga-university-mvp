'use client'

import React, { useState } from 'react'
import { Modal, ModalContent, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'
import { PageLayout } from '@/components/layout/PageLayout'
import { User } from '@/types'
import { OverviewSection } from '@/components/admin/OverviewSection'
import { UsersSection } from '@/components/admin/UsersSection'
import { ContentSection } from '@/components/admin/ContentSection'
import { AnalyticsSection } from '@/components/admin/AnalyticsSection'
import { SettingsSection } from '@/components/admin/SettingsSection'
import { UserDetailView } from '@/components/admin/UserDetailView'

// Mock admin data
const mockStats = {
  totalUsers: 15420,
  activeUsers: 8932,
  totalFlows: 3247,
  totalPoses: 892,
  totalCourses: 67,
  totalSessions: 45231,
  revenue: 234567,
  newUsersThisWeek: 234,
  completedSessionsToday: 156
}

const mockUsers: User[] = [
  {
    id: 'user_1',
    email: 'alice@example.com',
    name: 'Alice Johnson',
    role: 'student',
    experienceLevel: 'intermediate',
    preferences: {
      focusAreas: ['flexibility'],
      practiceStyle: ['vinyasa'],
      limitations: [],
      goals: [],
      preferredDuration: 30,
      practiceFrequency: 'daily'
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date()
  },
  {
    id: 'user_2',
    email: 'teacher@example.com',
    name: 'Sarah Williams',
    role: 'teacher',
    experienceLevel: 'advanced',
    preferences: {
      focusAreas: ['strength'],
      practiceStyle: ['hatha'],
      limitations: [],
      goals: [],
      preferredDuration: 45,
      practiceFrequency: 'daily'
    },
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date()
  }
]

export default function AdminDashboard() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const tabsData = [
    { id: 'overview', label: 'Overview', content: <OverviewSection stats={mockStats} /> },
    { id: 'users', label: 'Users', content: <UsersSection users={mockUsers} onSelectUser={setSelectedUser} /> },
    { id: 'content', label: 'Content', content: <ContentSection /> },
    { id: 'analytics', label: 'Analytics', content: <AnalyticsSection /> },
    { id: 'settings', label: 'Settings', content: <SettingsSection /> }
  ]

  return (
    <PageLayout
      title="Admin Dashboard 🔧"
      description="Platform management and analytics"
    >
      <div className="space-y-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            {tabsData.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>
          {tabsData.map(tab => (
            <TabsContent key={tab.id} value={tab.id}>
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>

        {/* User Detail Modal */}
        <Modal open={!!selectedUser} onOpenChange={(isOpen) => !isOpen && setSelectedUser(null)}>
          <ModalContent size="lg">
            {selectedUser && <UserDetailView user={selectedUser} />}
          </ModalContent>
        </Modal>
      </div>
    </PageLayout>
  )
}
