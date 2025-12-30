import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { CollectionEntry } from 'astro:content';

interface RelatedPostsProps {
  posts: CollectionEntry<'blog'>[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 pt-8 border-t border-border">
      <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map(post => {
          const formattedDate = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }).format(post.data.publishedAt);

          return (
            <article 
              key={post.slug}
              className="group glass-card rounded-xl overflow-hidden hover:border-primary/30 
                         transition-all duration-300"
            >
              <a href={`/blog/${post.slug}`} className="block">
                {/* Image */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={post.data.heroImage}
                    alt={post.data.title}
                    className="w-full h-full object-cover transition-transform duration-500 
                               group-hover:scale-105"
                  />
                </div>
                
                {/* Content */}
                <div className="p-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {post.data.tags.slice(0, 2).map(tag => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="text-xs capitalize"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-semibold mb-2 group-hover:text-primary 
                                 transition-colors line-clamp-2">
                    {post.data.title}
                  </h3>
                  
                  {/* Date */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{formattedDate}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
