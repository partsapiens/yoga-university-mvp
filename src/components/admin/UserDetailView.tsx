import React from 'react';
import { Button, Badge } from '@/components/ui';
import { User } from '@/types';

interface UserDetailViewProps {
    user: User
}

export const UserDetailView: React.FC<UserDetailViewProps> = ({ user }) => {
    return (
      <div className="space-y-6">
        {/* User Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-emerald-600 font-semibold text-xl">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900">{user.name}</h2>
          <p className="text-slate-600">{user.email}</p>
          <div className="flex justify-center space-x-2 mt-2">
            <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'teacher' ? 'info' : 'default'}>
              {user.role}
            </Badge>
            <Badge variant="default">{user.experienceLevel}</Badge>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-emerald-600">47</div>
            <div className="text-sm text-slate-600">Practice Sessions</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-emerald-600">3</div>
            <div className="text-sm text-slate-600">Courses Enrolled</div>
          </div>
        </div>

        {/* User Preferences */}
        <div>
          <h3 className="font-semibold text-slate-900 mb-3">Preferences</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600">Focus Areas</span>
              <span>{user.preferences.focusAreas.join(', ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Practice Style</span>
              <span>{user.preferences.practiceStyle.join(', ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Preferred Duration</span>
              <span>{user.preferences.preferredDuration} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Frequency</span>
              <span className="capitalize">{user.preferences.practiceFrequency}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 pt-4 border-t border-slate-200">
          <Button variant="outline" className="flex-1">
            Send Message
          </Button>
          <Button variant="outline" className="flex-1">
            View Activity
          </Button>
          <Button variant="destructive">
            Suspend User
          </Button>
        </div>
      </div>
    )
  }
