import { Badge } from '@/components/ui/badge';
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

export default function TagFilter({ tags, selectedTag, onTagSelect }: TagFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-8">
      <span className="text-sm text-muted-foreground font-medium">Filter by tag:</span>
      
      <Badge
        variant={selectedTag === null ? 'default' : 'outline'}
        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
        onClick={() => onTagSelect(null)}
      >
        All
      </Badge>
      
      {tags.map(({ tag, count }) => (
        <Badge
          key={tag}
          variant={selectedTag === tag ? 'default' : 'outline'}
          className="cursor-pointer capitalize hover:bg-primary hover:text-primary-foreground 
                     transition-colors gap-1.5"
          onClick={() => onTagSelect(tag)}
        >
          {tag}
          <span className="text-xs opacity-70">({count})</span>
        </Badge>
      ))}
      
      {selectedTag && (
        <button
          onClick={() => onTagSelect(null)}
          className="ml-2 text-sm text-muted-foreground hover:text-foreground flex items-center gap-1
                     transition-colors"
        >
          <X className="w-3 h-3" />
          Clear filter
        </button>
      )}
    </div>
  );
}
