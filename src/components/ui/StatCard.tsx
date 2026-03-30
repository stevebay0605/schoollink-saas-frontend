import React from 'react';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown } from 'lucide-react';

type StatCardColor = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  color?: StatCardColor;
  className?: string;
}

interface ColorTokens {
  iconWrapper: string;
}

const colorMap: Record<StatCardColor, ColorTokens> = {
  primary:   { iconWrapper: 'bg-school-600 text-white' },
  secondary: { iconWrapper: 'bg-gold-500    text-white' },
  success:   { iconWrapper: 'bg-emerald-500 text-white' },
  warning:   { iconWrapper: 'bg-amber-500   text-white' },
  danger:    { iconWrapper: 'bg-red-500     text-white' },
};

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendLabel,
  color = 'primary',
  className,
}) => {
  const { iconWrapper } = colorMap[color];
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <article
      className={clsx(
        'bg-white rounded-xl border border-border p-5 shadow-card',
        className,
      )}
    >
      {/* Top row: label + value / icon */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
        </div>

        {icon && (
          <div
            className={clsx(
              'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
              iconWrapper,
            )}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
      </div>

      {/* Trend */}
      {trend !== undefined && (
        <div className="flex items-center gap-1">
          {isPositive ? (
            <TrendingUp size={14} className="text-emerald-500" aria-hidden="true" />
          ) : (
            <TrendingDown size={14} className="text-red-500" aria-hidden="true" />
          )}
          <span
            className={clsx(
              'text-xs font-medium',
              isPositive ? 'text-emerald-600' : 'text-red-600',
            )}
          >
            {isPositive ? '+' : ''}{trend}%
          </span>
          {trendLabel && (
            <span className="text-xs text-muted-foreground">{trendLabel}</span>
          )}
        </div>
      )}
    </article>
  );
};

export default StatCard;
