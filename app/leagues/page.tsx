'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import { useStandings } from '@/hooks/use-matches';
import { cn } from '@/lib/utils';
import { TeamLogo } from '@/components/team-logo';
import { StandingsSkeleton } from '@/components/loading-skeleton';
import type { LeagueStanding } from '@/lib/types';

export default function LeaguesPage() {
  const { data: standings, isLoading, error } = useStandings();
  const [expandedLeague, setExpandedLeague] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-black tracking-tight">League Standings</h1>
          <p className="text-sm text-muted-foreground mt-1">Tables from top leagues</p>
        </div>
        <div className="space-y-4">
          <StandingsSkeleton />
          <StandingsSkeleton />
        </div>
      </div>
    );
  }

  if (error || !standings) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="glass-card rounded-xl p-8 text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <h2 className="text-lg font-bold mb-1">Failed to load standings</h2>
          <p className="text-sm text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
          <Trophy className="h-6 w-6 text-score-green" />
          League Standings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {standings.length} league{standings.length !== 1 ? 's' : ''} available
        </p>
      </div>

      <div className="space-y-4">
        {standings.map((standing, leagueIndex) => (
          <StandingsTable
            key={standing.league.id}
            standing={standing}
            index={leagueIndex}
            isExpanded={expandedLeague === standing.league.id || expandedLeague === null}
            onToggle={() => setExpandedLeague(
              expandedLeague === standing.league.id ? null : standing.league.id
            )}
          />
        ))}
      </div>
    </div>
  );
}

interface StandingsTableProps {
  standing: LeagueStanding;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

function StandingsTable({ standing, index, isExpanded, onToggle }: StandingsTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="glass-card rounded-xl overflow-hidden"
    >
      {/* League header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          {standing.league.flag && (
            <span className="text-lg">{standing.league.flag}</span>
          )}
          <div className="text-left">
            <h3 className="text-sm font-bold">{standing.league.name}</h3>
            <p className="text-xs text-muted-foreground">{standing.league.country}</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-glass-border">
              {/* Table header */}
              <div className="grid grid-cols-[2rem_1fr_repeat(7,2.5rem)_4rem] sm:grid-cols-[2rem_1fr_repeat(7,2.5rem)_4rem] items-center gap-1 px-4 py-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider border-b border-glass-border">
                <span className="text-center">#</span>
                <span>Team</span>
                <span className="text-center">MP</span>
                <span className="text-center">W</span>
                <span className="text-center">D</span>
                <span className="text-center">L</span>
                <span className="text-center">GF</span>
                <span className="text-center">GA</span>
                <span className="text-center">GD</span>
                <span className="text-center">Pts</span>
              </div>

              {/* Rows */}
              {standing.standings.map((entry, rowIndex) => (
                <motion.div
                  key={entry.team.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: rowIndex * 0.03 }}
                  className={cn(
                    'grid grid-cols-[2rem_1fr_repeat(7,2.5rem)_4rem] sm:grid-cols-[2rem_1fr_repeat(7,2.5rem)_4rem] items-center gap-1 px-4 py-2.5 text-sm',
                    'hover:bg-white/5 transition-colors',
                    rowIndex < standing.standings.length - 1 && 'border-b border-glass-border/50',
                    entry.description && 'relative'
                  )}
                >
                  {/* Rank */}
                  <span className={cn(
                    'text-center text-xs font-bold',
                    entry.description?.includes('Champions League') && 'text-blue-400',
                    entry.description?.includes('Europa League') && 'text-orange-400',
                    entry.description?.includes('Conference') && 'text-green-400',
                    entry.description?.includes('Relegation') && 'text-score-red',
                  )}>
                    {entry.rank}
                  </span>

                  {/* Qualification indicator */}
                  {entry.description && (
                    <div className={cn(
                      'absolute left-0 top-0 bottom-0 w-0.5',
                      entry.description.includes('Champions League') && 'bg-blue-400',
                      entry.description.includes('Europa League') && 'bg-orange-400',
                      entry.description.includes('Conference') && 'bg-green-400',
                      entry.description.includes('Relegation') && 'bg-score-red',
                    )} />
                  )}

                  {/* Team */}
                  <div className="flex items-center gap-2 min-w-0">
                    <TeamLogo src={entry.team.logo} alt={entry.team.name} size="sm" />
                    <span className="text-sm font-medium truncate">{entry.team.name}</span>

                    {/* Form */}
                    {entry.form && (
                      <div className="hidden sm:flex items-center gap-0.5 ml-auto flex-shrink-0">
                        {entry.form.split('').slice(-5).map((result, i) => (
                          <span
                            key={i}
                            className={cn(
                              'w-4 h-4 rounded-sm text-[9px] font-bold flex items-center justify-center',
                              result === 'W' && 'bg-score-green/20 text-score-green',
                              result === 'D' && 'bg-score-yellow/20 text-score-yellow',
                              result === 'L' && 'bg-score-red/20 text-score-red',
                            )}
                          >
                            {result}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <span className="text-center text-xs text-muted-foreground tabular-nums">{entry.played}</span>
                  <span className="text-center text-xs tabular-nums">{entry.won}</span>
                  <span className="text-center text-xs tabular-nums">{entry.drawn}</span>
                  <span className="text-center text-xs tabular-nums">{entry.lost}</span>
                  <span className="text-center text-xs text-muted-foreground tabular-nums">{entry.goalsFor}</span>
                  <span className="text-center text-xs text-muted-foreground tabular-nums">{entry.goalsAgainst}</span>
                  <span className={cn(
                    'text-center text-xs tabular-nums font-medium',
                    entry.goalDifference > 0 && 'text-score-green',
                    entry.goalDifference < 0 && 'text-score-red',
                  )}>
                    {entry.goalDifference > 0 ? '+' : ''}{entry.goalDifference}
                  </span>
                  <span className="text-center text-sm font-black tabular-nums">{entry.points}</span>
                </motion.div>
              ))}

              {/* Legend */}
              {standing.standings.some(s => s.description) && (
                <div className="px-4 py-3 border-t border-glass-border flex flex-wrap gap-3 text-[10px] text-muted-foreground/60">
                  {standing.standings
                    .filter(s => s.description)
                    .reduce((acc, s) => {
                      if (s.description && !acc.includes(s.description)) acc.push(s.description);
                      return acc;
                    }, [] as string[])
                    .map(desc => (
                      <div key={desc} className="flex items-center gap-1.5">
                        <div className={cn(
                          'w-2 h-2 rounded-sm',
                          desc.includes('Champions League') && 'bg-blue-400',
                          desc.includes('Europa League') && 'bg-orange-400',
                          desc.includes('Conference') && 'bg-green-400',
                          desc.includes('Relegation') && 'bg-score-red',
                        )} />
                        <span>{desc}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}