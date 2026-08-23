'use client';

import React from 'react';
import { 
  Settings, 
  Server
} from 'lucide-react';
import { Role } from '@/types';

interface RolesSettingsDeskProps {
  currentRole: Role | null;
  onSetRole: (role: Role) => Promise<void>;
  notify: (msg: string) => void;
}

export function RolesSettingsDesk({
  currentRole,
  onSetRole,
  notify,
}: RolesSettingsDeskProps) {
  const roles: { role: Role; title: string; desc: string; permissions: string[] }[] = [
    {
      role: 'super_admin',
      title: 'Managing Director / Super Admin',
      desc: 'Full administrative authority across broadcast streams, editorial publishing, commercial ad billing, and database records.',
      permissions: ['All Editorial Rights', 'MCR Stream & RTMP Keys', 'Monetization & Ad Units', 'Security & User Management'],
    },
    {
      role: 'news_editor',
      title: 'Senior News Editor',
      desc: 'Oversees regional reporting bureaus, breaks major headlines, approves and edits investigative stories.',
      permissions: ['Publish Breaking News', 'Edit All Articles', 'Review Whistleblower Leaks', 'Manage Hero Layout'],
    },
    {
      role: 'broadcast_director',
      title: 'Broadcast Director (MCR)',
      desc: 'Master of studio satellite links, RTMP ingest keys, on-air bulletin tickers, and weekly EPG program guides.',
      permissions: ['Manage RTMP Stream Keys', 'Trigger Emergency Standby Slate', 'Update On-Air Ticker & Anchors', 'Edit 7-Day TV Guide'],
    },
    {
      role: 'field_reporter',
      title: 'Field Correspondent',
      desc: 'Dispatches instant breaking reports from Lira City and regional field bureaus.',
      permissions: ['Draft & Publish Field Stories', 'Upload Story Media', 'Tag Locations across Lango'],
    },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 flex items-center space-x-4">
        <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 flex items-center justify-center">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Access Control & Roles</h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure newsroom role credentials and system diagnostics.
          </p>
        </div>
      </div>

      {/* Role Switcher Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((r) => {
          const isCurrent = currentRole === r.role;

          return (
            <div
              key={r.role}
              onClick={() => {
                onSetRole(r.role);
                notify(`Switched active role to: ${r.title}`);
              }}
              className={`p-6 rounded-lg border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                isCurrent
                  ? 'bg-white border-gray-900 shadow-sm ring-1 ring-gray-900'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-900">
                    {r.title}
                  </span>
                  {isCurrent && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border bg-gray-50 text-gray-900 border-gray-200">
                      Active
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {r.desc}
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-gray-200">
                <span className="text-xs text-gray-500 font-medium">Permissions</span>
                <div className="flex flex-wrap gap-2">
                  {r.permissions.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium border bg-gray-50 text-gray-700 border-gray-200"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* System Infrastructure Telemetry Card */}
      <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center space-x-2">
          <Server className="w-4 h-4 text-gray-500" />
          <span>System Infrastructure</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white border border-gray-200 rounded-lg space-y-1">
            <span className="text-xs text-gray-500 font-medium block">Database Engine</span>
            <span className="text-sm font-medium text-gray-900 block">SQLite WAL Mode</span>
            <span className="text-xs text-gray-500 font-mono">unitytv.sqlite • Connected</span>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg space-y-1">
            <span className="text-xs text-gray-500 font-medium block">RTMP Media Ingest</span>
            <span className="text-sm font-medium text-gray-900 block">NodeMediaServer</span>
            <span className="text-xs text-gray-500 font-mono">HTTP-FLV Port 8000 • Active</span>
          </div>

          <div className="p-4 bg-white border border-gray-200 rounded-lg space-y-1">
            <span className="text-xs text-gray-500 font-medium block">Stream Auth Webhook</span>
            <span className="text-sm font-medium text-gray-900 block">/api/auth-stream</span>
            <span className="text-xs text-gray-500 font-mono">Dynamic Key Validation • 200 OK</span>
          </div>
        </div>
      </div>

    </div>
  );
}
