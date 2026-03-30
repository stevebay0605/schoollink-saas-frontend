import React from 'react';
import { clsx } from 'clsx';

export type BadgeVariant =
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'muted'
  | 'primary'
  | 'secondary';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  success:   'bg-emerald-50   text-emerald-700  border border-emerald-200',
  danger:    'bg-red-50       text-red-700      border border-red-200',
  warning:   'bg-amber-50     text-amber-700    border border-amber-200',
  info:      'bg-blue-50      text-blue-700     border border-blue-200',
  muted:     'bg-gray-100     text-gray-600     border border-gray-200',
  primary:   'bg-school-50    text-school-600   border border-school-200',
  secondary: 'bg-gold-50      text-gold-600     border border-gold-200',
};

const dotStyles: Record<BadgeVariant, string> = {
  success:   'bg-emerald-500',
  danger:    'bg-red-500',
  warning:   'bg-amber-500',
  info:      'bg-blue-500',
  muted:     'bg-gray-400',
  primary:   'bg-school-600',
  secondary: 'bg-gold-500',
};

const Badge: React.FC<BadgeProps> = ({
  variant = 'muted',
  children,
  className,
  dot = false,
}) => (
  <span
    className={clsx(
      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium',
      variantStyles[variant],
      className,
    )}
  >
    {dot && (
      <span
        className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0', dotStyles[variant])}
        aria-hidden="true"
      />
    )}
    {children}
  </span>
);

export default Badge;
