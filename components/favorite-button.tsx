'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md';
  className?: string;
}

export function FavoriteButton({ isFavorite, onToggle, size = 'sm', className }: FavoriteButtonProps) {
  const sizeClasses = size === 'sm' ? 'h-7 w-7' : 'h-9 w-9';
  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className={cn(
        'flex items-center justify-center rounded-lg transition-all duration-200',
        sizeClasses,
        isFavorite
          ? 'text-score-yellow bg-score-yellow/10 hover:bg-score-yellow/20'
          : 'text-muted-foreground/40 hover:text-muted-foreground hover:bg-white/5',
        className
      )}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Star className={cn(iconSize, isFavorite && 'fill-current')} />
    </button>
  );
}