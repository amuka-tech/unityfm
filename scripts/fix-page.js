const fs = require('fs');

const pathStr = 'd:/Unitytvsite/src/app/news/[category]/[slug]/page.tsx';
let content = fs.readFileSync(pathStr, 'utf8');

// I will just rewrite the top of the file up to interface ArticlePageProps
const expectedTop = `import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { api } from '@/lib/api';
import { ArticleBody } from '@/components/article/ArticleBody';
import { NewsArticleJsonLd } from '@/components/seo/JsonLd';
import { AdSlot } from '@/components/ads/AdSlot';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ArticlePageProps {`;

// We'll chop the string at interface ArticlePageProps and replace the top
const splitAt = 'interface ArticlePageProps {';
const bottom = content.substring(content.indexOf(splitAt) + splitAt.length);

fs.writeFileSync(pathStr, expectedTop + bottom, 'utf8');
console.log('Fixed imports in page.tsx');
