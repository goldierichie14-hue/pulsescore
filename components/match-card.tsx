'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn, isLive, isFinished, isUpcoming, formatMatchTime } from '@/lib/utils';
import { LiveBadge } from './live-badge';
import { TeamLogo } from './team-logo';
import { FavoriteButton } from './favorite-button';
import type { Match } from '@/lib/types';

interface MatchCardProps {
  match: Match;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  index?: number;
}

export function MatchCard({ match, isFavorite, onToggleFavorite, index = 0 }: MatchCardProps) {
  const live = isLive(match.status);
  const finished = isFinished(match.status);
  const upcoming = isUpcoming(match.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/match/${match.id}`}>
        <div
          className={cn(
            'group relative rounded-xl p-4 transition-all duration-300',
            'glass-card hover:translate-y-[-2px] hover:shadow-lg',
            live && 'border-live-red/20 glow-red',
          )}
        >
          {/* Header: League + Status + Favorite */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium">{match.league.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <LiveBadge
                status={match.status}
                minute={match.minute}
                extraMinute={match.extraMinute}
                size="sm"
              />
              <FavoriteButton
                isFavorite={isFavorite}
                onToggle={onToggleFavorite}
                size="sm"
              />
            </div>
          </div>

          {/* Match Content */}
          <div className="flex items-center gap-3">
            {/* Home Team */}
            <div className="flex-1 flex items-center gap-3 justify-end">
              <span className={cn(
                'text-sm font-semibold truncate text-right',
                live && 'text-foreground',
                finished && 'text-muted-foreground',
              )}>
                {match.homeTeam.name}
              </span>
              <TeamLogo src={match.homeTeam.logo} alt={match.homeTeam.name} size="lg" />
            </div>

            {/* Score / Time */}
            <div className="flex-shrink-0 w-20 text-center">
              {upcoming ? (
                <div className="text-lg font-bold text-muted-foreground">
                  {formatMatchTime(match.date, match.time)}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span className={cn(
                    'text-2xl font-black score-text',
                    live && 'text-foreground',
                    finished && 'text-muted-foreground',
                  )}>
                    {match.score.home}
                  </span>
                  <span className="text-lg text-muted-foreground/40 font-light">-</span>
                  <span className={cn(
                    'text-2xl font-black score-text',
                    live && 'text-foreground',
                    finished && 'text-muted-foreground',
                  )}>
                    {match.score.away}
                  </span>
                </div>
              )}
              {/* Half-time score */}
              {(finished || live) && match.score.htHome !== undefined && match.score.htAway !== undefined && (
                <div className="text-[10px] text-muted-foreground/60 mt-0.5">
                  HT {match.score.htHome}-{match.score.htAway}
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="flex-1 flex items-center gap-3">
              <TeamLogo src={match.awayTeam.logo} alt={match.awayTeam.name} size="lg" />
              <span className={cn(
                'text-sm font-semibold truncate',
                live && 'text-foreground',
                finished && 'text-muted-foreground',
              )}>
                {match.awayTeam.name}
              </span>
            </div>
          </div>

          {/* Goal Scorers (compact) */}
          {match.events.length > 0 && (
            <div className="flex items-start justify-between mt-3 pt-3 border-t border-glass-border gap-4">
              {/* Home events */}
              <div className="flex-1 text-right">
                {match.events
                  .filter(e => e.team === 'home' && (e.type === 'goal' || e.type === 'penalty_goal' || e.type === 'own_goal'))
                  .map(e => (
                    <div key={e.id} className="text-[11px] text-muted-foreground leading-relaxed">
                      <span className="text-score-green">⚽</span>{' '}
                      <span>{e.player}</span>{' '}
                      <span className="text-muted-foreground/60">{e.minute}&apos;</span>
                    </div>
                  ))}
              </div>
              {/* Away events */}
              <div className="flex-1 text-left">
                {match.events
                  .filter(e => e.team === 'away' && (e.type === 'goal' || e.type === 'penalty_goal' || e.type === 'own_goal'))
                  .map(e => (
                    <div key={e.id} className="text-[11px] text-muted-foreground leading-relaxed">
                      <span className="text-score-green">⚽</span>{' '}
                      <span>{e.player}</span>{' '}
                      <span className="text-muted-foreground/60">{e.minute}&apos;</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Venue for upcoming */}
          {upcoming && match.venue && (
            <div className="mt-2 text-[11px] text-muted-foreground/50 text-center">
              {match.venue}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}