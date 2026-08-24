import React from 'react';
import { notFound } from 'next/navigation';
import { getLiveBlogsDb, getLiveBlogUpdatesDb } from '@/lib/server-actions';
import { PublicLiveBlogSection } from '@/components/home/PublicLiveBlogSection';
import { api } from '@/lib/api';

interface LiveBlogPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: LiveBlogPageProps) {
  const { id } = await params;
  const blogs = await getLiveBlogsDb();
  const liveBlog = blogs.find((b: any) => b.id.toString() === id);

  if (!liveBlog) {
    return { title: 'Live Blog - Unity TV Uganda' };
  }

  return {
    title: `LIVE: ${liveBlog.title} - Unity TV Uganda`,
    description: liveBlog.summary,
  };
}

export default async function LiveBlogPage({ params }: LiveBlogPageProps) {
  const { id } = await params;
  const [blogs] = await Promise.all([
    getLiveBlogsDb(),
  ]);
  
  const liveBlog = blogs.find((b: any) => b.id.toString() === id);

  if (!liveBlog) {
    notFound();
  }

  return (
    <div className="bg-brand-surface min-h-screen">
      {/* Top Leaderboard Ad */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 pt-3">
      </div>

      <div className="py-6">
        <PublicLiveBlogSection overrideBlogId={parseInt(id)} />
      </div>
    </div>
  );
}

export function generateStaticParams() { return [{ id: '1' }]; }
