'use client';

import { cn } from '@/lib/utils';
import type { MatchStatus } from '@/lib/types';
import { isLive, isFinished, getStatusDisplay } from '@/lib/utils';

interface LiveBadgeProps {
  status: MatchStatus;
  minute?: number;
  extraMinute?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LiveBadge({ status, minute, extraMinute, className, size = 'md' }: LiveBadgeProps) {
  const live = isLive(status);
  const finished = isFinished(status);
  const display = getStatusDisplay(status, minute, extraMinute);

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5',
    lg: 'text-sm px-3 py-1',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md font-bold tracking-wide',
        sizeClasses[size],
        live && 'bg-live-red/15 text-live-red',
        finished && 'bg-muted text-muted-foreground',
        !live && !finished && 'bg-muted text-muted-foreground',
        className
      )}
    >
      {live && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-pulse-live absolute inline-flex h-full w-full rounded-full bg-live-red" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-live-red" />
        </span>
      )}
      {display}
    </span>
  );
}