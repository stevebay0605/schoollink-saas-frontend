import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Breadcrumb {
  label: string;
  /** When provided, the crumb is rendered as a link */
  href?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
}) => (
  <div className="flex items-start justify-between mb-6 gap-4">
    {/* Left: breadcrumbs + title + subtitle */}
    <div className="min-w-0">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Fil d'Ariane" className="flex items-center gap-1 text-xs text-muted-foreground mb-1 flex-wrap">
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <ChevronRight size={12} className="flex-shrink-0" aria-hidden="true" />
              )}
              {crumb.href ? (
                <Link
                  to={crumb.href}
                  className="hover:text-school-600 transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium" aria-current="page">
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <h1 className="text-2xl font-bold text-foreground font-heading truncate">
        {title}
      </h1>

      {subtitle && (
        <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
      )}
    </div>

    {/* Right: action buttons */}
    {actions && (
      <div className="flex items-center gap-2 flex-shrink-0">
        {actions}
      </div>
    )}
  </div>
);

export default PageHeader;
