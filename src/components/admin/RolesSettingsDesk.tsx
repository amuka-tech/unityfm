'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Server,
  Users,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { Role, User } from '@/types';
import { getUsersDb, updateUserProfileDb, uploadUserAvatarAction } from '@/lib/server-actions';
import { createUserAction, updateUserPasswordAction } from '@/lib/auth-server';

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
  const [users, setUsers] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [editPassword, setEditPassword] = useState('');
  
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserForm, setNewUserForm] = useState<Partial<User>>({ role: 'field_reporter', bureau: 'Lira City Hub' });
  const [newUserPassword, setNewUserPassword] = useState('');
  
  useEffect(() => {
    if (currentRole === 'super_admin' || currentRole === 'managing_director') {
      getUsersDb().then(setUsers).catch(console.error);
    }
  }, [currentRole]);

  const handleEditUser = (u: User) => {
    setEditingUserId(u.id);
    setEditForm({ name: u.name, designation: u.designation, bureau: u.bureau, role: u.role });
    setEditPassword('');
  };

  const handleSaveUser = async () => {
    if (editingUserId) {
      await updateUserProfileDb(editingUserId, editForm);
      if (editPassword) {
        await updateUserPasswordAction(editingUserId, editPassword);
      }
      notify('User profile updated successfully!');
      setEditingUserId(null);
      setEditPassword('');
      getUsersDb().then(setUsers).catch(console.error);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>, userId: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    notify('Uploading avatar...');
    const formData = new FormData();
    formData.append('file', file);
    const res = await uploadUserAvatarAction(userId, formData);
    
    if (res.success) {
      notify('Avatar updated successfully!');
      getUsersDb().then(setUsers).catch(console.error);
    } else {
      alert(`Avatar upload failed: ${res.error}`);
    }
  };

  const handleCreateUser = async () => {
    if (!newUserForm.name || !newUserForm.email || !newUserForm.role || !newUserPassword) {
      alert('Please fill in all required fields (Name, Email, Role, Password).');
      return;
    }
    
    const res = await createUserAction(newUserForm, newUserPassword);
    if (res.success) {
      notify('New user created successfully!');
      setIsAddingUser(false);
      setNewUserForm({ role: 'field_reporter', bureau: 'Lira City Hub' });
      setNewUserPassword('');
      getUsersDb().then(setUsers).catch(console.error);
    } else {
      alert(`Error creating user: ${res.error}`);
    }
  };

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
      desc: 'Master of studio satellite links, RTMP ingest keys, on-air bulletin tickers, and weekly Schedule program guides.',
      permissions: ['Manage RTMP Stream Keys', 'Trigger Emergency Standby Slate', 'Update On-Air Ticker & Anchors', 'Edit 7-Day '],
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

      {/* Staff Directory Table */}
      {(currentRole === 'super_admin' || currentRole === 'managing_director') && (
        <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span>Staff & Access Management</span>
            </h3>
            <button
              onClick={() => setIsAddingUser(true)}
              className="text-xs bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              + Add User
            </button>
          </div>
          
          {isAddingUser && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                <input type="text" value={newUserForm.name || ''} onChange={e => setNewUserForm({...newUserForm, name: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm" placeholder="e.g. John Doe" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                <input type="email" value={newUserForm.email || ''} onChange={e => setNewUserForm({...newUserForm, email: e.target.value})} className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm" placeholder="john@radiounity.ug" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Role</label>
                <select value={newUserForm.role || ''} onChange={e => setNewUserForm({...newUserForm, role: e.target.value as Role})} className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm bg-white">
                  <option value="super_admin">Super Admin</option>
                  <option value="managing_director">Managing Director</option>
                  <option value="news_editor">News Editor</option>
                  <option value="broadcast_director">Broadcast Director</option>
                  <option value="field_reporter">Field Reporter</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                <input type="password" value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm" placeholder="Temporary password" />
              </div>
              <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
                <button onClick={() => setIsAddingUser(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg">Cancel</button>
                <button onClick={handleCreateUser} className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium">Create User</button>
              </div>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Bureau / Title</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="relative group w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
                          <img src={u.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} alt={u.name} className="w-full h-full object-cover" />
                          {editingUserId === u.id && (
                            <label className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition-all">
                              <span className="text-[9px] font-bold text-white uppercase tracking-wider text-center px-1">Upload</span>
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleAvatarUpload(e, u.id!)} />
                            </label>
                          )}
                        </div>
                        {editingUserId === u.id ? (
                          <input type="text" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} className="border border-gray-300 rounded px-2 py-1 w-full text-sm" />
                        ) : (
                          <span className="font-semibold text-gray-900">{u.name}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {editingUserId === u.id ? (
                        <div className="space-y-1">
                          <div className="text-xs text-gray-400">{u.email}</div>
                          <input type="password" placeholder="New Password (optional)" value={editPassword} onChange={e => setEditPassword(e.target.value)} className="border border-gray-300 rounded px-2 py-1 w-full text-sm" />
                        </div>
                      ) : (
                        u.email
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingUserId === u.id ? (
                        <select value={editForm.role || ''} onChange={e => setEditForm({...editForm, role: e.target.value as Role})} className="border border-gray-300 rounded px-2 py-1 text-sm bg-white">
                          <option value="super_admin">Super Admin</option>
                          <option value="managing_director">Managing Director</option>
                          <option value="news_editor">News Editor</option>
                          <option value="broadcast_director">Broadcast Director</option>
                          <option value="field_reporter">Field Reporter</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${u.role === 'super_admin' ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                          {u.role.replace('_', ' ').toUpperCase()}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {editingUserId === u.id ? (
                        <div className="space-y-1">
                          <input type="text" placeholder="Title" value={editForm.designation || ''} onChange={e => setEditForm({...editForm, designation: e.target.value})} className="border border-gray-300 rounded px-2 py-1 w-full text-sm" />
                          <input type="text" placeholder="Bureau" value={editForm.bureau || ''} onChange={e => setEditForm({...editForm, bureau: e.target.value})} className="border border-gray-300 rounded px-2 py-1 w-full text-sm" />
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium text-gray-800">{u.designation}</div>
                          <div className="text-xs">{u.bureau}</div>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {editingUserId === u.id ? (
                        <div className="flex justify-end gap-2">
                          <button onClick={handleSaveUser} className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingUserId(null)} className="p-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => handleEditUser(u)} className="p-1.5 text-gray-400 hover:text-brand-crimson hover:bg-red-50 rounded transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
            <span className="text-xs text-gray-500 font-mono">radiounity.sqlite • Connected</span>
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
