import React from 'react';
import { api } from '@/lib/api';
import { getCommoditiesDb } from '@/lib/server-actions';
import { BreakingNewsTicker } from '@/components/home/BreakingNewsTicker';
import { HeroSection } from '@/components/home/HeroSection';
import { RegionalHubSection } from '@/components/home/RegionalHubSection';
import { PublicLiveBlogSection } from '@/components/home/PublicLiveBlogSection';
import { LatestFeedWithSidebar } from '@/components/home/LatestFeedWithSidebar';
import { PodcastSection } from '@/components/home/PodcastSection';
import { WhistleblowerBanner } from '@/components/home/WhistleblowerBanner';
import { OrganizationJsonLd } from '@/components/seo/JsonLd';

export default async function HomePage() {
  const [articles, breakingNews, commodities] = await Promise.all([
    api.getArticles(),
    api.getBreakingNews(),
    getCommoditiesDb(),
  ]);

  const heroArticle = articles.find((a) => a.is_hero) || articles[0];
  const secondaryArticles = articles.filter((a) => a.id !== heroArticle?.id).slice(0, 4);

  return (
    <div className="bg-brand-surface min-h-screen">
      <OrganizationJsonLd />

      {/* 1. Breaking News Banner (Configurable Ticker) */}
      <BreakingNewsTicker items={breakingNews} />

      {/* 2. Hero Story (Lead) & Secondary Featured (x3) */}
      <HeroSection heroArticle={heroArticle} secondaryArticles={secondaryArticles} />

      {/* 3. Lira City & Northern Uganda Hub (Local Priority) */}
      <RegionalHubSection articles={articles} commodities={commodities} />

      {/* 3.5. Breaking Live Blog Updates (Only renders if an active event exists) */}
      <PublicLiveBlogSection />

      {/* 4. Latest Feed & Sidebar (Now Playing, Most Read, Trending) */}
      <LatestFeedWithSidebar articles={articles} />

      {/* 5. Podcast & Program Showcase */}
      <PodcastSection />

      {/* 6. WhatsApp Community Whistleblower Banner */}
      <WhistleblowerBanner />
    </div>
  );
}
