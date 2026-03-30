import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { clsx } from 'clsx';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/** Build a page-number array with optional ellipsis markers (represented as 0) */
const buildPages = (current: number, total: number): number[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: number[] = [1];

  if (current > 3) pages.push(0); // left ellipsis

  const start = Math.max(2, current - 1);
  const end   = Math.min(total - 1, current + 1);

  for (let p = start; p <= end; p++) pages.push(p);

  if (current < total - 2) pages.push(0); // right ellipsis

  pages.push(total);
  return pages;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = buildPages(currentPage, totalPages);

  const btnBase =
    'flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-school-600 focus:ring-offset-1';

  return (
    <nav aria-label="Pagination" className="flex items-center gap-1">
      {/* Previous */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Page précédente"
        className={clsx(
          btnBase,
          'p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed',
        )}
      >
        <ChevronLeft size={16} />
      </button>

      {/* Page numbers */}
      {pages.map((page, idx) =>
        page === 0 ? (
          <span
            key={`ellipsis-${idx}`}
            className="w-8 h-8 flex items-center justify-center text-muted-foreground"
            aria-hidden="true"
          >
            <MoreHorizontal size={14} />
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            className={clsx(
              btnBase,
              'w-8 h-8',
              page === currentPage
                ? 'bg-school-600 text-white shadow-sm'
                : 'text-muted-foreground hover:bg-muted',
            )}
          >
            {page}
          </button>
        ),
      )}

      {/* Next */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Page suivante"
        className={clsx(
          btnBase,
          'p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed',
        )}
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
};

export default Pagination;
