'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { BroadcastState } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { BroadcastMcrDesk } from '@/components/admin/BroadcastMcrDesk';

export default function StreamsPage() {
  const { canEditStream } = useAuth();
  const [broadcast, setBroadcast] = useState<BroadcastState | null>(null);
  const [streamKeys, setStreamKeys] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const [bState, keys] = await Promise.all([
        api.getBroadcastState(),
        api.getStreamKeys(),
      ]);
      setBroadcast(bState);
      setStreamKeys(keys);
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

  const handleUpdateBroadcast = async (state: Partial<BroadcastState>) => {
    const updated = await api.updateBroadcastState(state);
    setBroadcast(updated);
    loadData();
  };

  const handleGenerateKey = async (label?: string) => {
    const res = await api.generateStreamKey(label);
    loadData();
    return res;
  };

  const handleRevokeKey = async (key: string) => {
    if (confirm('Revoking this stream key will immediately terminate active broadcasts using it. Proceed?')) {
      await api.revokeStreamKey(key);
      notify('Stream Key revoked.');
      loadData();
    }
  };

  if (isLoading) return <div className="p-4 text-center">Loading Streams...</div>;

  return (
    <BroadcastMcrDesk
      broadcast={broadcast}
      onUpdateBroadcast={handleUpdateBroadcast}
      streamKeys={streamKeys}
      onGenerateKey={handleGenerateKey}
      onRevokeKey={handleRevokeKey}
      canEditStream={canEditStream}
      notify={notify}
    />
  );
}
