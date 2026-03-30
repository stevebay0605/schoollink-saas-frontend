/**
 * SchoolLink — Atomic UI Components
 * Import everything from this barrel to keep consumer imports clean:
 *   import { Button, Badge, DataTable } from '@/components/ui';
 */

export { default as Button }        from './Button';
export { default as Input }         from './Input';
export { default as Select }        from './Select';
export { default as Badge }         from './Badge';
export { default as Avatar }        from './Avatar';
export { default as Modal }         from './Modal';
export { default as ConfirmDialog } from './ConfirmDialog';
export { default as Skeleton, CardSkeleton } from './Skeleton';
export { default as EmptyState }    from './EmptyState';
export { default as Pagination }    from './Pagination';
export { default as StatCard }      from './StatCard';
export { default as DataTable }     from './DataTable';
export { default as PageHeader }    from './PageHeader';

// Re-export relevant types
export type { SelectOption }   from './Select';
export type { BadgeVariant }   from './Badge';
export type { Column }         from './DataTable';
