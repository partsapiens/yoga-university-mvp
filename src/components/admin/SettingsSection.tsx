"use client";

import React, { useState } from 'react';
import { Card, Toggle, Badge } from '@/components/ui';

export const SettingsSection: React.FC = () => {
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [maintenanceMode, setMaintenanceMode] = useState(false)
    const [registrationOpen, setRegistrationOpen] = useState(true)

    return (
      <div className="space-y-6">
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Platform Settings</h3>
          <div className="space-y-4">
            <Toggle
              checked={registrationOpen}
              onCheckedChange={setRegistrationOpen}
              label="Open Registration"
            />

            <Toggle
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
              label="Email Notifications"
            />

            <Toggle
              checked={maintenanceMode}
              onCheckedChange={setMaintenanceMode}
              label="Maintenance Mode"
            />
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">System Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Platform Version</span>
              <span>v2.1.3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Database Status</span>
              <Badge variant="success">Healthy</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">API Status</span>
              <Badge variant="success">Online</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Last Backup</span>
              <span>2 hours ago</span>
            </div>
          </div>
        </Card>
      </div>
    )
  }
