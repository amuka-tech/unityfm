'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getTipsDb } from '@/lib/server-actions';
import { WhistleblowerDesk } from '@/components/admin/WhistleblowerDesk';

export default function WhistleblowerPage() {
  const router = useRouter();
  const [tips, setTips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const tipList = await getTipsDb();
      setTips(tipList);
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

  const handleConvertTipToStory = (tip: any) => {
    router.push('/admin/newsroom?new=true');
  };

  if (isLoading) return <div className="p-4 text-center">Loading Tips...</div>;

  return (
    <WhistleblowerDesk
      tips={tips}
      onConvertToStory={handleConvertTipToStory}
      notify={notify}
    />
  );
}
