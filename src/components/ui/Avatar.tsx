import React from 'react';
import { clsx } from 'clsx';
import { getInitials } from '../../utils/formatters';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'w-6  h-6  text-[10px]',
  sm: 'w-8  h-8  text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

/**
 * Colour palette for fallback initials avatar.
 * Colour is chosen deterministically from the first character's char-code
 * so the same name always gets the same colour.
 */
const AVATAR_COLORS = [
  'bg-school-600 text-white',
  'bg-school-700 text-white',
  'bg-gold-500    text-white',
  'bg-gold-600    text-white',
  'bg-blue-600    text-white',
  'bg-purple-600  text-white',
  'bg-rose-600    text-white',
  'bg-teal-600    text-white',
] as const;

const getColorFromName = (name: string): string => {
  const code = name.charCodeAt(0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length] ?? AVATAR_COLORS[0];
};

const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md', className }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={clsx(
          'rounded-full object-cover flex-shrink-0',
          sizeClasses[size],
          className,
        )}
      />
    );
  }

  return (
    <div
      aria-label={name}
      title={name}
      className={clsx(
        'rounded-full flex items-center justify-center font-semibold flex-shrink-0 select-none',
        sizeClasses[size],
        getColorFromName(name),
        className,
      )}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
