import React from 'react';
import { Card, ProgressBar } from '@/components/ui';

export const AnalyticsSection: React.FC = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Platform Usage */}
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Platform Usage (30 days)</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Daily Active Users</span>
                  <span>8,932</span>
                </div>
                <ProgressBar value={85} color="emerald" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Practice Sessions</span>
                  <span>15,247</span>
                </div>
                <ProgressBar value={68} color="blue" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Course Enrollments</span>
                  <span>892</span>
                </div>
                <ProgressBar value={45} color="purple" />
              </div>
            </div>
          </Card>

          {/* Revenue Analytics */}
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue Breakdown</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Course Sales</span>
                <span className="font-semibold">$156,780 (67%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Subscriptions</span>
                <span className="font-semibold">$67,890 (29%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Merchandise</span>
                <span className="font-semibold">$9,897 (4%)</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Detailed Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">4.8</div>
              <div className="text-sm text-slate-600">Average Rating</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">23 min</div>
              <div className="text-sm text-slate-600">Avg Session Length</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">78%</div>
              <div className="text-sm text-slate-600">Course Completion</div>
            </div>
          </div>
        </Card>
      </div>
    )
  }
