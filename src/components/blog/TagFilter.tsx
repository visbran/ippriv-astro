import { badgeVariants } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface TagCount {
  tag: string;
  count: number;
}

interface TagFilterProps {
  tags: TagCount[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

const chip = (active: boolean) =>
  cn(
    badgeVariants({ variant: active ? 'default' : 'outline' }),
    'cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors'
  );

export default function TagFilter({ tags, selectedTag, onTagSelect }: TagFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-8" role="group" aria-labelledby="tag-filter-label">
      <span id="tag-filter-label" className="text-sm text-muted-foreground font-medium">
        Filter by tag:
      </span>

      <button
        type="button"
        className={chip(selectedTag === null)}
        aria-pressed={selectedTag === null}
        onClick={() => onTagSelect(null)}
      >
        All
      </button>

      {tags.map(({ tag, count }) => (
        <button
          type="button"
          key={tag}
          className={cn(chip(selectedTag === tag), 'capitalize gap-1.5')}
          aria-pressed={selectedTag === tag}
          onClick={() => onTagSelect(selectedTag === tag ? null : tag)}
        >
          {tag}
          <span className="text-xs opacity-70">
            ({count})
          </span>
        </button>
      ))}

      {selectedTag && (
        <button
          type="button"
          onClick={() => onTagSelect(null)}
          className="ml-2 text-sm text-muted-foreground hover:text-foreground flex items-center gap-1
                     transition-colors"
        >
          <X className="w-3 h-3" aria-hidden="true" />
          Clear filter
        </button>
      )}
    </div>
  );
}
