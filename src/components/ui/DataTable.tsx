import React from 'react';
import { clsx } from 'clsx';
import Skeleton from './Skeleton';
import EmptyState from './EmptyState';
import Pagination from './Pagination';

export interface Column<T> {
  /** Must match a key of T, or be a unique virtual key for render-only columns */
  key: string;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface EmptyConfig {
  title?: string;
  description?: string;
  action?: { label: string; onClick: () => void; icon?: React.ReactNode };
}

interface DataTableProps<T extends { id: number | string }> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: EmptyConfig['action'];
  className?: string;
}

function DataTable<T extends { id: number | string }>({
  columns,
  data,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  onRowClick,
  emptyTitle,
  emptyDescription,
  emptyAction,
  className,
}: DataTableProps<T>) {
  /* ── Loading state ───────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  /* ── Empty state ─────────────────────────────────────────────────────── */
  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  /* ── Table ───────────────────────────────────────────────────────────── */
  return (
    <div className={className}>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full">
          <thead>
            <tr className="bg-background border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={clsx(
                    'px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide',
                    col.headerClassName,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border bg-white">
            {data.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={clsx(
                  'transition-colors hover:bg-muted/40',
                  onRowClick && 'cursor-pointer',
                )}
              >
                {columns.map((col) => {
                  const rawValue = row[col.key as keyof T];
                  const cell = col.render
                    ? col.render(rawValue, row)
                    : rawValue != null
                      ? String(rawValue)
                      : '—';

                  return (
                    <td
                      key={col.key}
                      className={clsx(
                        'px-4 py-3 text-sm text-foreground',
                        col.className,
                      )}
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages !== undefined &&
        totalPages > 1 &&
        onPageChange !== undefined &&
        currentPage !== undefined && (
          <div className="mt-4 flex justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
    </div>
  );
}

export default DataTable;
