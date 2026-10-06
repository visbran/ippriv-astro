import { badgeVariants } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { TopicCount, TopicSlug } from '@/utils/topics';

interface TagFilterProps {
  topics: TopicCount[];
  selectedTopic: TopicSlug | null;
  onSelect: (topic: TopicSlug | null) => void;
}

const chip = (active: boolean) =>
  cn(
    badgeVariants({ variant: active ? 'default' : 'outline' }),
    'cursor-pointer rounded-md px-3 py-1 text-sm font-medium gap-1.5 transition-colors',
    active ? '' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
  );

export default function TagFilter({ topics, selectedTopic, onSelect }: TagFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-8" role="group" aria-label="Filter by topic">
      <button
        type="button"
        className={chip(selectedTopic === null)}
        aria-pressed={selectedTopic === null}
        onClick={() => onSelect(null)}
      >
        All
      </button>

      {topics.map(({ slug, label, count }) => (
        <button
          type="button"
          key={slug}
          className={chip(selectedTopic === slug)}
          aria-pressed={selectedTopic === slug}
          onClick={() => onSelect(selectedTopic === slug ? null : slug)}
        >
          {label}
          <span className="text-xs opacity-70">{count}</span>
        </button>
      ))}
    </div>
  );
}
