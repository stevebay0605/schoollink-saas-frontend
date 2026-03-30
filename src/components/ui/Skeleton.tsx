import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  /** Render a stacked group of N lines instead of a single block */
  lines?: number;
}

/**
 * Base skeleton shimmer block.
 * Pass `lines` to render a paragraph-style group where the last line
 * is narrower (75 % width) to mimic real text.
 */
const Skeleton: React.FC<SkeletonProps> = ({ className, lines = 1 }) => {
  if (lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={clsx(
              'bg-muted rounded animate-pulse h-4',
              i === lines - 1 ? 'w-3/4' : 'w-full',
              className,
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'bg-muted rounded animate-pulse',
        className ?? 'h-4 w-full',
      )}
    />
  );
};

/** Drop-in skeleton for a card with avatar + text + body */
export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl border border-border p-6 space-y-4">
    <div className="flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
    <Skeleton lines={3} />
  </div>
);

export default Skeleton;
