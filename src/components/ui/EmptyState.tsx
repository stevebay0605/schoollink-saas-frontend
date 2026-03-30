import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: EmptyStateAction;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title = 'Aucune donnée',
  description = "Il n'y a rien à afficher pour le moment.",
  action,
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    {/* Icon circle */}
    <div className="w-16 h-16 rounded-full bg-school-50 flex items-center justify-center mb-4">
      {icon ?? <Inbox size={28} className="text-school-600" aria-hidden="true" />}
    </div>

    <h3 className="font-semibold text-foreground text-lg mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground max-w-xs mb-4">{description}</p>

    {action && (
      <Button variant="primary" onClick={action.onClick} icon={action.icon}>
        {action.label}
      </Button>
    )}
  </div>
);

export default EmptyState;
