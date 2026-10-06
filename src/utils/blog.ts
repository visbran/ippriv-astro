import type { CollectionEntry } from 'astro:content';
import { topicsForTags, type TopicSlug } from './topics';

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export interface TOCItem {
  id: string;
  title: string;
  level: number;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
  }).format(date);
}

/**
 * Card-level fields only. Passed to client islands instead of full
 * collection entries so article bodies are not serialized into the HTML.
 */
export interface PostSummary {
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  tags: string[];
  topics: TopicSlug[];
  publishedAt: Date;
  readingTime: number;
}

export function toPostSummary(post: CollectionEntry<'blog'>): PostSummary {
  return {
    slug: post.slug,
    title: post.data.title,
    description: post.data.description,
    heroImage: post.data.heroImage,
    tags: post.data.tags,
    topics: topicsForTags(post.data.tags),
    publishedAt: post.data.publishedAt,
    readingTime: calculateReadingTime(post.body),
  };
}
