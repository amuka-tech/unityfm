'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { EpgProgram } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { EpgScheduleDesk } from '@/components/admin/EpgScheduleDesk';

export default function EpgPage() {
  const { canEditStream } = useAuth();
  const [epg, setEpg] = useState<EpgProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const epgList = await api.getEpgSchedule();
      setEpg(epgList);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const notify = (msg: string) => {
    alert(msg);
  };

  const handleSaveEpgProgram = async (prog: Partial<EpgProgram>) => {
    await api.saveEpgProgram(prog);
    loadData();
  };

  const handleDeleteEpgProgram = async (id: string | number) => {
    if (confirm('Delete this show from the broadcast schedule?')) {
      await api.deleteEpgProgram(id);
      notify('Program removed from TV Guide.');
      loadData();
    }
  };

  if (isLoading) return <div className="p-4 text-center">Loading EPG...</div>;

  return (
    <EpgScheduleDesk
      epg={epg}
      onSaveProgram={handleSaveEpgProgram}
      onDeleteProgram={handleDeleteEpgProgram}
      canEditStream={canEditStream}
      notify={notify}
    />
  );
}
