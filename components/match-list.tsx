'use client';

import { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MatchCard } from './match-card';
import { cn, isLive, isFinished, isUpcoming } from '@/lib/utils';
import type { Match, TabType } from '@/lib/types';

interface MatchListProps {
  matches: Match[];
  activeTab: TabType;
  searchQuery: string;
  showFavoritesOnly: boolean;
  favoriteMatches: number[];
  onToggleFavorite: (matchId: number) => void;
}

export function MatchList({
  matches,
  activeTab,
  searchQuery,
  showFavoritesOnly,
  favoriteMatches,
  onToggleFavorite,
}: MatchListProps) {
  const filteredMatches = useMemo(() => {
    let filtered = [...matches];

    // Filter by tab
    if (activeTab === 'live') {
      filtered = filtered.filter(m => isLive(m.status));
    } else if (activeTab === 'fixtures') {
      filtered = filtered.filter(m => isUpcoming(m.status));
    } else if (activeTab === 'results') {
      filtered = filtered.filter(m => isFinished(m.status));
    }

    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(m =>
        m.homeTeam.name.toLowerCase().includes(q) ||
        m.awayTeam.name.toLowerCase().includes(q) ||
        m.league.name.toLowerCase().includes(q) ||
        m.homeTeam.shortName.toLowerCase().includes(q) ||
        m.awayTeam.shortName.toLowerCase().includes(q)
      );
    }

    // Filter by favorites
    if (showFavoritesOnly) {
      filtered = filtered.filter(m => favoriteMatches.includes(m.id));
    }

    // Sort: live first, then upcoming by time, then finished
    filtered.sort((a, b) => {
      const aLive = isLive(a.status) ? 0 : isUpcoming(a.status) ? 1 : 2;
      const bLive = isLive(b.status) ? 0 : isUpcoming(b.status) ? 1 : 2;
      if (aLive !== bLive) return aLive - bLive;
      return a.time.localeCompare(b.time);
    });

    return filtered;
  }, [matches, activeTab, searchQuery, showFavoritesOnly, favoriteMatches]);

  // Group by league
  const groupedMatches = useMemo(() => {
    const groups = new Map<string, Match[]>();
    filteredMatches.forEach(match => {
      const key = `${match.league.id}-${match.league.name}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(match);
    });
    return Array.from(groups.entries());
  }, [filteredMatches]);

  if (filteredMatches.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16 text-muted-foreground"
      >
        <div className="text-4xl mb-3">
          {activeTab === 'live' ? '📡' : activeTab === 'fixtures' ? '📅' : '📊'}
        </div>
        <p className="text-sm font-medium">
          {showFavoritesOnly
            ? 'No favorite matches found'
            : searchQuery
              ? `No matches found for "${searchQuery}"`
              : activeTab === 'live'
                ? 'No live matches right now'
                : activeTab === 'fixtures'
                  ? 'No upcoming fixtures'
                  : 'No results available'}
        </p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          {activeTab === 'live' ? 'Check back later for live action' : 'Try adjusting your filters'}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {groupedMatches.map(([key, leagueMatches]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-2"
          >
            {/* League header */}
            <div className="flex items-center gap-2 px-1 mb-3">
              {leagueMatches[0].league.flag && (
                <span className="text-sm">{leagueMatches[0].league.flag}</span>
              )}
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {leagueMatches[0].league.country} — {leagueMatches[0].league.name}
              </h3>
            </div>

            {/* Matches */}
            <div className="space-y-2">
              {leagueMatches.map((match, index) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  isFavorite={favoriteMatches.includes(match.id)}
                  onToggleFavorite={() => onToggleFavorite(match.id)}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}