import { useState, useMemo } from 'react';
import SearchBar from './SearchBar';
import TagFilter from './TagFilter';
import BlogCard from './BlogCard';
import type { CollectionEntry } from 'astro:content';

interface TagCount {
  tag: string;
  count: number;
}

interface BlogListProps {
  posts: CollectionEntry<'blog'>[];
  tags: TagCount[];
  readingTimes: Record<string, number>;
}

export default function BlogList({ posts, tags, readingTimes }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    let result = posts;

    // Filter by tag
    if (selectedTag) {
      result = result.filter(post => post.data.tags.includes(selectedTag));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(post => {
        const title = post.data.title.toLowerCase();
        const description = post.data.description.toLowerCase();
        const tagList = post.data.tags.join(' ').toLowerCase();
        
        return (
          title.includes(lowerQuery) ||
          description.includes(lowerQuery) ||
          tagList.includes(lowerQuery)
        );
      });
    }

    return result;
  }, [posts, selectedTag, searchQuery]);

  return (
    <>
      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar onSearch={setSearchQuery} />
      </div>

      {/* Tag Filter */}
      <TagFilter 
        tags={tags}
        selectedTag={selectedTag}
        onTagSelect={setSelectedTag}
      />

      {/* Results */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-2">
            No articles found
          </p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => (
              <BlogCard
                key={post.slug}
                post={post}
                readingTime={readingTimes[post.slug] || 5}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
