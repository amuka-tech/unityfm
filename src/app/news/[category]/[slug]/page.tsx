import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { api } from '@/lib/api';
import { ArticleBody } from '@/components/article/ArticleBody';
import { NewsArticleJsonLd } from '@/components/seo/JsonLd';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ArticlePageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const { article } = await api.getArticleBySlug(slug, false);

  if (!article) {
    return {
      title: 'Article Not Found — Unity TV Uganda',
    };
  }

  return {
    title: `${article.title} — Unity TV Uganda`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.featured_image }],
      type: 'article',
      publishedTime: article.published_at,
      authors: [article.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.featured_image],
    },
  };
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const [{ article, related }] = await Promise.all([
    api.getArticleBySlug(slug),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen">
      <NewsArticleJsonLd article={article} />

      {/* Top Leaderboard Ad */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 pt-3">
      </div>

      {/* Main Article Body & Interactivity */}
      <ArticleBody
        article={article}
        relatedArticles={related}
        
      />
    </div>
  );
}

export function generateStaticParams() { return [{ category: 'politics', slug: 'dummy' }]; }
