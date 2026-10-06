import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
  placeholder?: string;
}

export default function SearchBar({ onSearch, initialQuery = '', placeholder = 'Search articles...' }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, onSearch]);

  return (
    <div className="relative max-w-md">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 w-5 h-5 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label="Search articles"
        className="pl-10 pr-10 h-12 bg-card border-border focus:border-primary/50 transition-colors [&::-webkit-search-cancel-button]:hidden"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground
                     hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
