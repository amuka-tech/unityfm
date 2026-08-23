'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { RolesSettingsDesk } from '@/components/admin/RolesSettingsDesk';

export default function SettingsPage() {
  const { currentRole, setRole } = useAuth();

  const notify = (msg: string) => {
    alert(msg);
  };

  return (
    <RolesSettingsDesk
      currentRole={currentRole}
      onSetRole={setRole}
      notify={notify}
    />
  );
}
