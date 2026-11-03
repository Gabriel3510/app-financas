import React from 'react';
import { ICONS, LEGACY } from './icons';

interface AppIconProps {
  icon: string;
  size?: number;
  className?: string;
}

export const AppIcon: React.FC<AppIconProps> = ({ icon, size = 18, className }) => {
  const Icon = ICONS[icon] ?? ICONS[LEGACY[icon]];
  if (Icon) return <Icon size={size} className={className} strokeWidth={2} />;
  return <span className={className} style={{ fontSize: size }}>{icon}</span>;
};

interface CategoryBadgeProps {
  icon: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = { sm: { box: 'w-7 h-7', icon: 15 }, md: { box: 'w-9 h-9', icon: 18 }, lg: { box: 'w-11 h-11', icon: 22 } };

// The category color drives both the soft background and the icon stroke
export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ icon, color, size = 'md' }) => (
  <span
    className={`${SIZES[size].box} rounded-full flex items-center justify-center flex-shrink-0`}
    style={{ backgroundColor: `${color}22`, color }}
  >
    <AppIcon icon={icon} size={SIZES[size].icon} />
  </span>
);
