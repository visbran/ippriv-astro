import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav 
      className="flex items-center gap-2 text-sm mb-6" 
      aria-label="Breadcrumb"
    >
      <a 
        href="/"
        className="flex items-center gap-1 text-muted-foreground hover:text-foreground 
                   transition-colors group"
      >
        <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
      </a>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={index} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            
            {item.href && !isLast ? (
              <a
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors
                           hover:underline decoration-primary/50 underline-offset-4"
              >
                {item.label}
              </a>
            ) : (
              <span 
                className={`${
                  isLast 
                    ? 'text-foreground font-medium' 
                    : 'text-muted-foreground'
                } line-clamp-1`}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
