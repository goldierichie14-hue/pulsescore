'use client';

import { motion } from 'framer-motion';
import { cn, getStatPercent } from '@/lib/utils';
import type { MatchStatistic } from '@/lib/types';

interface StatsBarProps {
  statistics: MatchStatistic[];
}

export function StatsBar({ statistics }: StatsBarProps) {
  if (!statistics || statistics.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Statistics not available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {statistics.map((stat, index) => {
        const homeVal = typeof stat.home === 'string' ? stat.home : String(stat.home);
        const awayVal = typeof stat.away === 'string' ? stat.away : String(stat.away);
        const { homePercent, awayPercent } = getStatPercent(stat.home, stat.away);

        // Determine if home or away is "winning" this stat
        const homeNum = parseFloat(homeVal);
        const awayNum = parseFloat(awayVal);
        const homeLeading = !isNaN(homeNum) && !isNaN(awayNum) && homeNum > awayNum;
        const awayLeading = !isNaN(homeNum) && !isNaN(awayNum) && awayNum > homeNum;

        return (
          <motion.div
            key={stat.type}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="space-y-1.5"
          >
            {/* Labels */}
            <div className="flex items-center justify-between text-sm">
              <span className={cn(
                'font-semibold tabular-nums',
                homeLeading ? 'text-score-green' : 'text-foreground'
              )}>
                {homeVal}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                {stat.type}
              </span>
              <span className={cn(
                'font-semibold tabular-nums',
                awayLeading ? 'text-score-green' : 'text-foreground'
              )}>
                {awayVal}
              </span>
            </div>

            {/* Bar */}
            <div className="flex h-1.5 rounded-full overflow-hidden gap-0.5">
              <motion.div
                className={cn(
                  'rounded-l-full',
                  homeLeading ? 'bg-score-green' : 'bg-muted-foreground/30'
                )}
                initial={{ width: '50%' }}
                animate={{ width: `${homePercent}%` }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              />
              <motion.div
                className={cn(
                  'rounded-r-full',
                  awayLeading ? 'bg-score-green' : 'bg-muted-foreground/30'
                )}
                initial={{ width: '50%' }}
                animate={{ width: `${awayPercent}%` }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}