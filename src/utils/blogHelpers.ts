import type { CollectionEntry } from 'astro:content';

// Fuzzy search function
export function fuzzySearch(
  posts: CollectionEntry<'blog'>[],
  query: string
): CollectionEntry<'blog'>[] {
  if (!query.trim()) return posts;

  const lowerQuery = query.toLowerCase();
  
  return posts.filter(post => {
    const title = post.data.title.toLowerCase();
    const description = post.data.description.toLowerCase();
    const tags = post.data.tags.join(' ').toLowerCase();
    const content = post.body.toLowerCase();
    
    return (
      title.includes(lowerQuery) ||
      description.includes(lowerQuery) ||
      tags.includes(lowerQuery) ||
      content.includes(lowerQuery)
    );
  }).sort((a, b) => {
    // Score based on where the match appears
    const scoreA = getSearchScore(a, lowerQuery);
    const scoreB = getSearchScore(b, lowerQuery);
    return scoreB - scoreA;
  });
}

function getSearchScore(
  post: CollectionEntry<'blog'>,
  query: string
): number {
  let score = 0;
  const title = post.data.title.toLowerCase();
  const description = post.data.description.toLowerCase();
  const tags = post.data.tags.join(' ').toLowerCase();
  
  // Title matches are most valuable
  if (title.includes(query)) score += 10;
  if (title.startsWith(query)) score += 5;
  
  // Description matches
  if (description.includes(query)) score += 5;
  
  // Tag matches
  if (tags.includes(query)) score += 3;
  
  return score;
}

// Get related posts based on tags similarity
export function getRelatedPosts(
  currentPost: CollectionEntry<'blog'>,
  allPosts: CollectionEntry<'blog'>[],
  limit: number = 3
): CollectionEntry<'blog'>[] {
  const currentTags = new Set(currentPost.data.tags);
  
  return allPosts
    .filter(post => post.slug !== currentPost.slug)
    .map(post => ({
      post,
      score: calculateSimilarity(currentTags, new Set(post.data.tags))
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
}

function calculateSimilarity(tagsA: Set<string>, tagsB: Set<string>): number {
  const intersection = new Set([...tagsA].filter(tag => tagsB.has(tag)));
  const union = new Set([...tagsA, ...tagsB]);
  
  return intersection.size / union.size;
}

// Group posts by month/year for archive
export interface ArchiveGroup {
  year: number;
  month: number;
  monthName: string;
  posts: CollectionEntry<'blog'>[];
}

export function groupPostsByMonth(
  posts: CollectionEntry<'blog'>[]
): ArchiveGroup[] {
  const groups = new Map<string, ArchiveGroup>();
  
  posts.forEach(post => {
    const date = post.data.publishedAt;
    const year = date.getFullYear();
    const month = date.getMonth();
    const key = `${year}-${month}`;
    
    if (!groups.has(key)) {
      groups.set(key, {
        year,
        month,
        monthName: date.toLocaleString('en-US', { month: 'long' }),
        posts: []
      });
    }
    
    groups.get(key)!.posts.push(post);
  });
  
  // Sort by date descending
  return Array.from(groups.values()).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
}

// Get all unique tags with counts
export interface TagCount {
  tag: string;
  count: number;
}

export function getAllTags(posts: CollectionEntry<'blog'>[]): TagCount[] {
  const tagCounts = new Map<string, number>();
  
  posts.forEach(post => {
    post.data.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });
  
  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}
