import { Clock, Calendar, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { CollectionEntry } from 'astro:content';

interface BlogCardProps {
  post: CollectionEntry<'blog'>;
  readingTime: number;
}

export default function BlogCard({ post, readingTime }: BlogCardProps) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(post.data.publishedAt);

  return (
    <article className="group glass-card rounded-xl overflow-hidden hover:border-primary/30 
                        transition-all duration-300 h-full flex flex-col">
      <a href={`/blog/${post.slug}`} className="block flex-1 flex flex-col">
        {/* Hero Image */}
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={post.data.heroImage}
            alt={post.data.title}
            className="w-full h-full object-cover transition-transform duration-500 
                       group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {post.data.tags.slice(0, 3).map(tag => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-xs font-medium capitalize"
              >
                {tag}
              </Badge>
            ))}
          </div>
          
          {/* Title */}
          <h2 className="text-xl font-semibold mb-2 group-hover:text-primary 
                         transition-colors line-clamp-2 flex-1">
            {post.data.title}
          </h2>
          
          {/* Description */}
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {post.data.description}
          </p>
          
          {/* Meta */}
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {readingTime} min read
              </span>
            </div>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </a>
    </article>
  );
}
