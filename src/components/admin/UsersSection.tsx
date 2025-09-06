import React, { useState } from 'react';
import { Card, Button, Badge, SearchInput, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import { User } from '@/types';

interface UsersSectionProps {
    users: User[]
    onSelectUser: (user: User) => void
}

export const UsersSection: React.FC<UsersSectionProps> = ({ users, onSelectUser }) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [roleFilter, setRoleFilter] = useState('')

    const filteredUsers = users.filter(user => {
      if (searchQuery && !user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !user.email.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      if (roleFilter && user.role !== roleFilter) {
        return false
      }

      return true
    })

    return (
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              onClear={() => setSearchQuery('')}
            />

            <Select onValueChange={setRoleFilter} value={roleFilter}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="">All Roles</SelectItem>
                    <SelectItem value="student">Students</SelectItem>
                    <SelectItem value="teacher">Teachers</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
            </Select>

            <Button>
              Export Users
            </Button>
          </div>
        </Card>

        {/* Users Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-4 font-medium text-slate-900">User</th>
                  <th className="text-left p-4 font-medium text-slate-900">Role</th>
                  <th className="text-left p-4 font-medium text-slate-900">Experience</th>
                  <th className="text-left p-4 font-medium text-slate-900">Joined</th>
                  <th className="text-left p-4 font-medium text-slate-900">Status</th>
                  <th className="text-left p-4 font-medium text-slate-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                          <span className="text-emerald-600 font-medium text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{user.name}</div>
                          <div className="text-sm text-slate-600">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={user.role === 'admin' ? 'destructive' : user.role === 'teacher' ? 'info' : 'default'}
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="capitalize text-slate-600">{user.experienceLevel}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-600">{user.createdAt.toLocaleDateString()}</span>
                    </td>
                    <td className="p-4">
                      <Badge variant="success">Active</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => onSelectUser(user)}>
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    )
  }
