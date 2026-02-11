'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface TeamLogoProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
  xl: 'h-14 w-14',
};

const fontSizeMap = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-xl',
};

export function TeamLogo({ src, alt, size = 'md', className }: TeamLogoProps) {
  const [error, setError] = useState(false);
  const initials = alt.substring(0, 2).toUpperCase();

  if (error || !src || src.startsWith('/teams/')) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-glass-border',
          sizeMap[size],
          fontSizeMap[size],
          'font-bold text-muted-foreground',
          className
        )}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn(sizeMap[size], 'object-contain', className)}
      onError={() => setError(true)}
    />
  );
}