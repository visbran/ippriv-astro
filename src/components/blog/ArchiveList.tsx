import { ChevronRight } from 'lucide-react';
import type { CollectionEntry } from 'astro:content';

interface ArchiveGroup {
  year: number;
  month: number;
  monthName: string;
  posts: CollectionEntry<'blog'>[];
}

interface ArchiveListProps {
  groups: ArchiveGroup[];
}

export default function ArchiveList({ groups }: ArchiveListProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {groups.map((group) => (
        <div key={`${group.year}-${group.month}`} className="mb-12">
          {/* Month/Year Header */}
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold">
              {group.monthName} {group.year}
            </h2>
            <span className="text-sm text-muted-foreground">
              ({group.posts.length} {group.posts.length === 1 ? 'article' : 'articles'})
            </span>
          </div>

          {/* Posts List */}
          <div className="space-y-3 pl-8 border-l-2 border-border/50">
            {group.posts.map((post) => {
              const date = post.data.publishedAt;
              const monthShort = date.toLocaleString('en-US', { month: 'short' });
              const dayNum = date.getDate();

              return (
                <article 
                  key={post.slug}
                  className="group glass-card rounded-lg p-4 hover:border-primary/30 
                             transition-all duration-300"
                >
                  <a href={`/blog/${post.slug}`} className="block">
                    <div className="flex items-start gap-4">
                      {/* Date Badge */}
                      <div className="flex-shrink-0 w-16 text-center">
                        <div className="text-xs text-muted-foreground font-medium mb-1">
                          {monthShort}
                        </div>
                        <div className="text-2xl font-bold text-primary">
                          {dayNum}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary 
                                       transition-colors line-clamp-1">
                          {post.data.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {post.data.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          {post.data.tags.slice(0, 3).map((tag) => (
                            <span 
                              key={tag}
                              className="text-xs px-2 py-1 rounded bg-accent/50 
                                         text-accent-foreground capitalize"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Arrow Icon */}
                      <ChevronRight className="w-5 h-5 text-muted-foreground 
                                               group-hover:text-primary group-hover:translate-x-1 
                                               transition-all flex-shrink-0" />
                    </div>
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
