import { useState, useMemo, useEffect } from 'react';
import SearchBar from './SearchBar';
import TagFilter from './TagFilter';
import BlogCard from './BlogCard';
import type { PostSummary } from '@/utils/blog';

interface TagCount {
  tag: string;
  count: number;
}

interface BlogListProps {
  posts: PostSummary[];
  tags: TagCount[];
}

const sameTag = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

export default function BlogList({ posts, tags }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [initialQuery, setInitialQuery] = useState('');

  // Restore filters from the URL (?tag=, ?q=) so tag links in articles work
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tag = params.get('tag');
    const q = params.get('q') ?? '';
    if (tag) setSelectedTag(tags.find((t) => sameTag(t.tag, tag))?.tag ?? tag);
    if (q) {
      setInitialQuery(q);
      setSearchQuery(q);
    }
  }, [tags]);

  // Keep the URL in sync so a filtered view can be shared or restored on back
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (selectedTag) params.set('tag', selectedTag);
    else params.delete('tag');
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    else params.delete('q');
    const query = params.toString();
    const url = `${window.location.pathname}${query ? `?${query}` : ''}`;
    if (url !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState(window.history.state, '', url);
    }
  }, [selectedTag, searchQuery]);

  const filteredPosts = useMemo(() => {
    let result = posts;

    if (selectedTag) {
      result = result.filter((post) => post.tags.some((tag) => sameTag(tag, selectedTag)));
    }

    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter((post) => {
        const title = post.title.toLowerCase();
        const description = post.description.toLowerCase();
        const tagList = post.tags.join(' ').toLowerCase();

        return (
          title.includes(lowerQuery) ||
          description.includes(lowerQuery) ||
          tagList.includes(lowerQuery)
        );
      });
    }

    return result;
  }, [posts, selectedTag, searchQuery]);

  const clearFilters = () => {
    setSelectedTag(null);
    setSearchQuery('');
    setInitialQuery('');
  };

  return (
    <>
      <div className="mb-8">
        <SearchBar key={initialQuery} initialQuery={initialQuery} onSearch={setSearchQuery} />
      </div>

      <TagFilter tags={tags} selectedTag={selectedTag} onTagSelect={setSelectedTag} />

      <p className="mb-4 text-sm text-muted-foreground" role="status" aria-live="polite">
        {filteredPosts.length === 0
          ? 'No articles found'
          : `Showing ${filteredPosts.length} ${filteredPosts.length === 1 ? 'article' : 'articles'}`}
      </p>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No article matches this search or tag.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-primary hover:underline underline-offset-4"
          >
            Clear search and filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </>
  );
}
