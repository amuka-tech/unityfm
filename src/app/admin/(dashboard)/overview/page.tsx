'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Article } from '@/types';
import { OverviewDesk } from '@/components/admin/OverviewDesk';
import { getLiveListenersCount } from '@/lib/listener-actions';

export default function OverviewPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [tips, setTips] = useState<any[]>([]);
  const [listeners, setListeners] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [arts, tipList, listenerCount] = await Promise.all([
          api.getArticles(),
          api.getTips(),
          getLiveListenersCount()
        ]);
        setArticles(arts);
        setTips(tipList);
        setListeners(listenerCount);
      } catch (e) {
        console.error('Error loading overview data:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();

    // Poll live listeners every 10 seconds so the count is real-time without refreshing
    const interval = setInterval(async () => {
      try {
        const count = await getLiveListenersCount();
        setListeners(count);
      } catch (e) {
        console.error('Error polling live listeners:', e);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) return <div className="p-4 text-center">Loading Overview...</div>;

  return (
    <OverviewDesk
      articles={articles}
      tips={tips}
      listeners={listeners}
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
