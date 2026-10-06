import type { PostSummary } from '@/utils/blog';
import { topicLabel } from '@/utils/topics';
import { cn } from '@/lib/utils';

interface BlogCardProps {
  post: PostSummary;
  /** Larger horizontal layout for the latest article. */
  featured?: boolean;
  /** Image loading hint: eager for above-the-fold cards. */
  eager?: boolean;
}

// Cards render at most ~800px wide: ask Unsplash for a smaller crop.
const cardImage = (url: string) =>
  url.includes('images.unsplash.com') ? url.replace('w=1200', 'w=800').replace('h=600', 'h=450') : url;

const dateFormat = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export default function BlogCard({ post, featured = false, eager = false }: BlogCardProps) {
  const topic = post.topics[0];

  return (
    <article
      className={cn(
        'group relative h-full rounded-lg border border-border bg-card overflow-hidden transition-colors hover:border-foreground/20',
        featured ? 'grid md:grid-cols-[1.15fr_1fr]' : 'flex flex-col'
      )}
    >
      <div className={cn('overflow-hidden bg-muted', featured ? 'aspect-[16/9] md:aspect-auto md:min-h-[300px]' : 'aspect-[16/9]')}>
        <img
          src={cardImage(post.heroImage)}
          alt=""
          width="800"
          height="450"
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>

      <div className={cn('flex flex-1 flex-col', featured ? 'p-6 sm:p-8 md:justify-center' : 'p-5')}>
        {topic && <p className="text-xs font-medium text-primary">{topicLabel(topic)}</p>}

        <h2
          className={cn(
            'mt-2 font-semibold tracking-tight text-foreground text-balance',
            featured ? 'text-2xl md:text-3xl' : 'text-lg leading-snug line-clamp-3'
          )}
        >
          {/* Stretched link: the whole card is clickable, one tab stop */}
          <a href={`/blog/${post.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {post.title}
          </a>
        </h2>

        <p className={cn('mt-2 text-muted-foreground leading-relaxed', featured ? 'text-base line-clamp-3' : 'text-sm line-clamp-2')}>
          {post.description}
        </p>

        <p className="mt-auto pt-4 text-xs text-muted-foreground">
          <time dateTime={post.publishedAt.toISOString()}>{dateFormat.format(post.publishedAt)}</time>
          <span aria-hidden="true"> · </span>
          {post.readingTime} min read
        </p>
      </div>
    </article>
  );
}
