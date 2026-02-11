'use client';

import { motion } from 'framer-motion';
import { cn, getEventIcon, getEventColor } from '@/lib/utils';
import type { MatchEvent } from '@/lib/types';

interface EventTimelineProps {
  events: MatchEvent[];
  homeTeamName: string;
  awayTeamName: string;
}

export function EventTimeline({ events, homeTeamName, awayTeamName }: EventTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No events recorded yet
      </div>
    );
  }

  const sortedEvents = [...events].sort((a, b) => a.minute - b.minute);

  return (
    <div className="relative space-y-0">
      {/* Center line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-glass-border -translate-x-1/2" />

      {sortedEvents.map((event, index) => {
        const isHome = event.team === 'home';
        const icon = getEventIcon(event.type);
        const colorClass = getEventColor(event.type);

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: isHome ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.08 }}
            className={cn(
              'relative flex items-center gap-3 py-2.5',
              isHome ? 'flex-row pr-[52%]' : 'flex-row-reverse pl-[52%]'
            )}
          >
            {/* Event content */}
            <div className={cn(
              'flex-1',
              isHome ? 'text-right' : 'text-left'
            )}>
              <div className={cn('text-sm font-medium', colorClass)}>
                {event.player}
              </div>
              {event.assist && (
                <div className="text-xs text-muted-foreground">
                  Assist: {event.assist}
                </div>
              )}
              {event.detail && event.type === 'substitution' && (
                <div className="text-xs text-muted-foreground">
                  {event.detail}
                </div>
              )}
            </div>

            {/* Minute dot */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
              <div className={cn(
                'flex items-center justify-center w-8 h-8 rounded-full text-sm',
                'bg-sport-card border border-glass-border',
                colorClass
              )}>
                {icon}
              </div>
            </div>

            {/* Minute text */}
            <div className={cn(
              'absolute top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-muted-foreground',
              isHome ? 'left-[52%] ml-6' : 'right-[52%] mr-6'
            )}>
              {event.minute}&apos;{event.extraMinute ? `+${event.extraMinute}` : ''}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}