import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // Show max 7 page numbers with ellipsis
  const getVisiblePages = () => {
    if (totalPages <= 7) return pages;
    
    if (currentPage <= 4) {
      return [...pages.slice(0, 5), '...', totalPages];
    }
    
    if (currentPage >= totalPages - 3) {
      return [1, '...', ...pages.slice(-5)];
    }
    
    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages
    ];
  };

  const visiblePages = getVisiblePages();

  return (
    <nav className="flex items-center justify-center gap-2 mt-12">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        asChild={currentPage > 1}
        className="gap-1"
      >
        {currentPage > 1 ? (
          <a href={currentPage === 2 ? baseUrl : `${baseUrl}/${currentPage - 1}`}>
            <ChevronLeft className="w-4 h-4" />
            Previous
          </a>
        ) : (
          <>
            <ChevronLeft className="w-4 h-4" />
            Previous
          </>
        )}
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <Button
              key={pageNum}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              asChild={!isActive}
              disabled={isActive}
              className="w-10"
            >
              {isActive ? (
                <span>{pageNum}</span>
              ) : (
                <a href={pageNum === 1 ? baseUrl : `${baseUrl}/${pageNum}`}>
                  {pageNum}
                </a>
              )}
            </Button>
          );
        })}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        asChild={currentPage < totalPages}
        className="gap-1"
      >
        {currentPage < totalPages ? (
          <a href={`${baseUrl}/${currentPage + 1}`}>
            Next
            <ChevronRight className="w-4 h-4" />
          </a>
        ) : (
          <>
            Next
            <ChevronRight className="w-4 h-4" />
          </>
        )}
      </Button>
    </nav>
  );
}
