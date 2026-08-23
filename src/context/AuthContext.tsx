'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, User } from '@/types';
import { loginServerAction, logoutServerAction, getServerSession } from '@/lib/auth-server';

interface AuthContextType {
  user: User | null;
  currentRole: Role | null;
  setRole: (role: Role) => Promise<void>;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  canPublishDirectly: boolean;
  canEditStream: boolean;
  canManageAds: boolean;
  isInitialized: boolean;
}

const mockUsersByRole: Record<Role, User> = {
  managing_director: {
    id: 1,
    name: 'Chief Managing Editor',
    email: 'admin@unitytv.ug',
    role: 'managing_director',
    bureau: 'Lira City Head Office',
    designation: 'Managing Director & Station Head',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    bio: 'Oversees overall editorial direction, broadcast compliance, and business monetization.',
    canImpersonate: true,
  },
  super_admin: {
    id: 2,
    name: 'System Admin',
    email: 'sysadmin@unitytv.ug',
    role: 'super_admin',
    bureau: 'Lira City Hub',
    designation: 'IT & Security Administrator',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    bio: 'Handles user access control, encryption keys, and system diagnostics.',
    canImpersonate: true,
  },
  news_editor: {
    id: 3,
    name: 'Sarah Awor',
    email: 'editor@unitytv.ug',
    role: 'news_editor',
    bureau: 'Lira City Hub',
    designation: 'Senior News Editor',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    bio: 'Lead editor overseeing regional reporting, live breaking tickers, and homepage curation.',
  },
  broadcast_director: {
    id: 4,
    name: 'Patrick Okot',
    email: 'producer@unitytv.ug',
    role: 'broadcast_director',
    bureau: 'Broadcast Master Control',
    designation: 'Executive Broadcast Producer',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    bio: 'Controls live studio satellite streams, HLS encoders, EPG schedules, and video packages.',
  },
  field_reporter: {
    id: 5,
    name: 'Moses Okello',
    email: 'reporter@unitytv.ug',
    role: 'field_reporter',
    bureau: 'Northern Uganda Agribusiness Desk',
    designation: 'Field Correspondent',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    bio: 'Field reporter with fast draft publishing rights for rapid breaking news deployment.',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check server session cookie first
    getServerSession().then((serverUser) => {
      if (serverUser) {
        setUser(serverUser);
        setCurrentRole(serverUser.role);
      } else {
        const savedRole = localStorage.getItem('unity_admin_role') as Role;
        if (savedRole && mockUsersByRole[savedRole]) {
          setUser(mockUsersByRole[savedRole]);
          setCurrentRole(savedRole);
        }
      }
      setIsInitialized(true);
    });
  }, []);

  const setRole = async (role: Role) => {
    const targetUser = mockUsersByRole[role];
    if (targetUser) {
      const res = await loginServerAction(targetUser.email, 'password123');
      if (res.success && res.user) {
        setUser(res.user);
        setCurrentRole(role);
        localStorage.setItem('unity_admin_role', role);
      }
    }
  };

  const login = async (email: string, pass: string) => {
    const res = await loginServerAction(email, pass);
    if (res.success && res.user) {
      setUser(res.user);
      setCurrentRole(res.user.role);
      localStorage.setItem('unity_admin_role', res.user.role);
      return { success: true };
    }
    return { success: false, error: res.error || 'Authentication failed' };
  };

  const logout = async () => {
    await logoutServerAction();
    setUser(null);
    setCurrentRole(null);
    localStorage.removeItem('unity_admin_role');
  };

  // RBAC permissions logic
  const canPublishDirectly = currentRole === 'managing_director' || currentRole === 'super_admin' || currentRole === 'news_editor';
  const canEditStream = currentRole === 'managing_director' || currentRole === 'super_admin' || currentRole === 'broadcast_director';
  const canManageAds = currentRole === 'managing_director' || currentRole === 'super_admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        currentRole,
        setRole,
        login,
        logout,
        canPublishDirectly,
        canEditStream,
        canManageAds,
        isInitialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
