import BlogCard from './BlogCard';
import type { PostSummary } from '@/utils/blog';

interface RelatedPostsProps {
  posts: PostSummary[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-border" aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-2xl font-semibold tracking-tight text-foreground mb-6">
        Related Articles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
