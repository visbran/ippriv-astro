import { useState, useMemo, useEffect } from 'react';
import SearchBar from './SearchBar';
import TagFilter from './TagFilter';
import BlogCard from './BlogCard';
import type { PostSummary } from '@/utils/blog';
import { resolveTopic, type TopicCount, type TopicSlug } from '@/utils/topics';

interface BlogListProps {
  posts: PostSummary[];
  topics: TopicCount[];
}

const PAGE_SIZE = 12;

export default function BlogList({ posts, topics }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<TopicSlug | null>(null);
  const [initialQuery, setInitialQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Restore filters from the URL (?tag=, ?q=) so topic links in articles work.
  // ?tag= accepts a topic slug or a legacy raw tag from older links.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tag = params.get('tag');
    const q = params.get('q') ?? '';
    if (tag) setSelectedTopic(resolveTopic(tag) ?? null);
    if (q) {
      setInitialQuery(q);
      setSearchQuery(q);
    }
  }, []);

  // Keep the URL in sync so a filtered view can be shared or restored on back
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (selectedTopic) params.set('tag', selectedTopic);
    else params.delete('tag');
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    else params.delete('q');
    const query = params.toString();
    const url = `${window.location.pathname}${query ? `?${query}` : ''}`;
    if (url !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState(window.history.state, '', url);
    }
  }, [selectedTopic, searchQuery]);

  const filteredPosts = useMemo(() => {
    let result = posts;

    if (selectedTopic) {
      result = result.filter((post) => post.topics.includes(selectedTopic));
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
  }, [posts, selectedTopic, searchQuery]);

  const isFiltering = selectedTopic !== null || searchQuery.trim() !== '';

  // Reset the page size whenever the filter changes
  useEffect(() => setVisibleCount(PAGE_SIZE), [selectedTopic, searchQuery]);

  // Unfiltered: the latest article is featured above the grid
  const featured = isFiltering ? null : filteredPosts[0];
  const gridPosts = featured ? filteredPosts.slice(1) : filteredPosts;
  const shownPosts = gridPosts.slice(0, visibleCount);
  const remaining = gridPosts.length - shownPosts.length;

  const clearFilters = () => {
    setSelectedTopic(null);
    setSearchQuery('');
    setInitialQuery('');
  };

  return (
    <>
      <div className="mb-8">
        <SearchBar key={initialQuery} initialQuery={initialQuery} onSearch={setSearchQuery} />
      </div>

      <TagFilter topics={topics} selectedTopic={selectedTopic} onSelect={setSelectedTopic} />

      <p className="mb-4 text-sm text-muted-foreground" role="status" aria-live="polite">
        {filteredPosts.length === 0
          ? 'No articles found'
          : `Showing ${filteredPosts.length} ${filteredPosts.length === 1 ? 'article' : 'articles'}`}
      </p>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No article matches this search or topic.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-primary hover:underline underline-offset-4"
          >
            Clear search and filters
          </button>
        </div>
      ) : (
        <>
          {featured && (
            <div className="mb-6">
              <BlogCard post={featured} featured eager />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shownPosts.map((post, i) => (
              <BlogCard key={post.slug} post={post} eager={i < 3} />
            ))}
          </div>

          {remaining > 0 && (
            <div className="mt-10 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                className="px-5 py-2.5 text-sm font-medium rounded-md border border-border text-foreground hover:bg-secondary active:translate-y-px transition-colors"
              >
                Show more articles
              </button>
              <p className="text-xs text-muted-foreground">
                {remaining} more, or{' '}
                <a href="/blog/archive" className="underline underline-offset-4 hover:text-foreground">
                  browse the archive
                </a>
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
}
