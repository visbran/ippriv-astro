import type { CollectionEntry } from 'astro:content';
import { topicsForTags, topicLabel } from '@/utils/topics';

interface ArchiveGroup {
  year: number;
  month: number;
  monthName: string;
  posts: CollectionEntry<'blog'>[];
}

interface ArchiveListProps {
  groups: ArchiveGroup[];
}

const dayFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

export default function ArchiveList({ groups }: ArchiveListProps) {
  return (
    <div className="max-w-3xl">
      {groups.map((group) => (
        <section key={`${group.year}-${group.month}`} className="mb-12" aria-labelledby={`m-${group.year}-${group.month}`}>
          <h2
            id={`m-${group.year}-${group.month}`}
            className="flex items-baseline gap-3 text-xl font-semibold tracking-tight text-foreground"
          >
            {group.monthName} {group.year}
            <span className="text-sm font-normal text-muted-foreground">
              {group.posts.length} {group.posts.length === 1 ? 'article' : 'articles'}
            </span>
          </h2>

          <ul className="mt-4 divide-y divide-border border-y border-border">
            {group.posts.map((post) => {
              const topic = topicsForTags(post.data.tags)[0];
              return (
                <li key={post.slug}>
                  <a
                    href={`/blog/${post.slug}`}
                    className="group grid grid-cols-[4.5rem_1fr] gap-4 py-4 sm:grid-cols-[4.5rem_1fr_auto] sm:items-baseline"
                  >
                    <time
                      dateTime={post.data.publishedAt.toISOString()}
                      className="font-mono text-xs text-muted-foreground pt-0.5"
                    >
                      {dayFormat.format(post.data.publishedAt)}
                    </time>
                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {post.data.title}
                    </span>
                    {topic && (
                      <span className="col-start-2 sm:col-start-auto text-xs text-muted-foreground whitespace-nowrap">
                        {topicLabel(topic)}
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
