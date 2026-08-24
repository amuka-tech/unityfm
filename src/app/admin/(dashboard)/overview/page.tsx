'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Article, BroadcastState, EpgProgram } from '@/types';
import { OverviewDesk } from '@/components/admin/OverviewDesk';

export default function OverviewPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [broadcast, setBroadcast] = useState<BroadcastState | null>(null);
  const [epg, setEpg] = useState<EpgProgram[]>([]);
  const [tips, setTips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [arts, bState, epgList, tipList] = await Promise.all([
          api.getArticles(),
          api.getBroadcastState(),
          api.getEpgSchedule(),
          api.getTips(),
        ]);
        setArticles(arts);
        setBroadcast(bState);
        setEpg(epgList);
        setTips(tipList);
      } catch (e) {
        console.error('Error loading overview data:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) return <div className="p-4 text-center">Loading Overview...</div>;

  return (
    <OverviewDesk
      articles={articles}
      tips={tips}
      onNavigateTab={(tab: string) => {
        if (tab === 'broadcast') router.push('/admin/streams');
        else router.push(`/admin/${tab}`);
      }}
      onNewArticle={() => {
        router.push('/admin/newsroom?new=true');
      }}
      onNewStreamKey={() => {
        router.push('/admin/streams?new=true');
      }}
    />
  );
}
