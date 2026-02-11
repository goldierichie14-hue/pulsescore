'use client';

import { useLiveTicker } from '@/hooks/use-matches';
import { cn } from '@/lib/utils';

export function LiveTicker() {
  const { data: items } = useLiveTicker();

  if (!items || items.length === 0) return null;

  const tickerText = items.map(item => item.message).join('     •     ');

  return (
    <div className="relative w-full overflow-hidden bg-sport-dark/80 border-b border-glass-border">
      <div className="flex items-center h-8">
        {/* LIVE label */}
        <div className="flex-shrink-0 z-10 flex items-center gap-1.5 px-3 bg-live-red/90 h-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          <span className="text-xs font-bold text-white tracking-wider">LIVE</span>
        </div>

        {/* Scrolling text */}
        <div className="overflow-hidden flex-1">
          <div className="animate-ticker whitespace-nowrap text-xs text-muted-foreground font-medium py-2 pl-4">
            {tickerText}
            <span className="mx-8" />
            {tickerText}
          </div>
        </div>
      </div>
    </div>
  );
}