'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Article } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { NewsroomDesk } from '@/components/admin/NewsroomDesk';

import { updateArticleDb } from '@/lib/server-actions';

export default function NewsroomPage() {
  const { canPublishDirectly } = useAuth();
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [showCreateArticleModal, setShowCreateArticleModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const arts = await api.getArticles();
      setArticles(arts);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    if (searchParams.get('new') === 'true') {
      setShowCreateArticleModal(true);
    }
  }, [searchParams]);

  const notify = (msg: string) => {
    alert(msg);
  };

  const handleSaveArticle = async (articleData: Partial<Article>) => {
    if (articleData.id) {
      // EDIT — use dedicated updateArticleDb action
      await updateArticleDb(articleData.id as string, articleData);
      notify(`Article updated successfully!`);
    } else {
      // CREATE — use existing createArticle action
      const created = await api.createArticle(articleData);
      notify(`Story "${created?.title || 'Draft'}" published!`);
    }
    loadData();
  };

  const handleDeleteArticle = async (id: string | number) => {
    if (confirm('Are you sure you want to permanently delete this article?')) {
      await api.deleteArticle(Number(id));
      notify('Article removed.');
      loadData();
    }
  };

  if (isLoading) return <div className="p-4 text-center">Loading Newsroom...</div>;

  return (
    <NewsroomDesk
      articles={articles}
      onSaveArticle={handleSaveArticle}
      onDeleteArticle={handleDeleteArticle}
      searchQuery={searchQuery}
      canPublishDirectly={canPublishDirectly}
      showCreateModal={showCreateArticleModal}
      setShowCreateModal={setShowCreateArticleModal}
    />
  );
}
