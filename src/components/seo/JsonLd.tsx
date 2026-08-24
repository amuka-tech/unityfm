import React from 'react';
import { Article, BroadcastState } from '@/types';

export function NewsArticleJsonLd({ article }: { article: Article }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://radiounity.ug/news/${article.category.slug}/${article.slug}`,
    },
    headline: article.title,
    description: article.excerpt,
    image: [article.featured_image],
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
    author: {
      '@type': 'Person',
      name: article.author.name,
      jobTitle: article.author.designation,
    },
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: 'Radio Unity FM Uganda',
      url: 'https://radiounity.ug',
      logo: {
        '@type': 'ImageObject',
        url: 'https://radiounity.ug/logo.png',
      },
    },
    articleSection: article.category.name,
    contentLocation: {
      '@type': 'Place',
      name: article.location_tag,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BroadcastJsonLd({ broadcast }: { broadcast: BroadcastState }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BroadcastService',
    name: 'Radio Unity FM Uganda Live Broadcast',
    broadcastDisplayName: 'Radio Unity FM Lira',
    videoFormat: 'HD',
    broadcastTimezone: 'Africa/Kampala',
    broadcaster: {
      '@type': 'Organization',
      name: 'Radio Unity FM Uganda',
      url: 'https://radiounity.ug',
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Northern Uganda',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: 'Radio Unity FM Uganda',
    url: 'https://radiounity.ug',
    logo: 'https://radiounity.ug/logo.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Plot 18, Obote Avenue',
      addressLocality: 'Lira City',
      addressRegion: 'Northern Uganda',
      addressCountry: 'UG',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+256-473-420-190',
      contactType: 'newsroom',
      areaServed: 'UG',
      availableLanguage: ['en', 'Luo'],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
