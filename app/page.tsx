'use client';

import { useState, useEffect } from 'react';
import { useMatches } from '@/hooks/use-matches';
import { useFavorites } from '@/hooks/use-favorites';
import { useGoalNotifications } from '@/hooks/use-notifications';
import { SearchFilter } from '@/components/search-filter';
import { MatchList } from '@/components/match-list';
import { MatchListSkeleton } from '@/components/loading-skeleton';
import { isLive } from '@/lib/utils';
import type { TabType } from '@/lib/types';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('live');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const { data: matches, isLoading, error, dataUpdatedAt } = useMatches();
  const { favorites, toggleMatchFavorite } = useFavorites();
  const { checkForGoals } = useGoalNotifications();

  // Check for goals on data update
  useEffect(() => {
    if (matches) {
      checkForGoals(matches);
    }
  }, [matches, dataUpdatedAt, checkForGoals]);

  // Auto-switch to fixtures if no live matches
  useEffect(() => {
    if (matches && activeTab === 'live') {
      const liveCount = matches.filter(m => isLive(m.status)).length;
      if (liveCount === 0 && !isLoading) {
        // Don't auto-switch, let user see the empty state
      }
    }
  }, [matches, activeTab, isLoading]);

  const liveCount = matches?.filter(m => isLive(m.status)).length ?? 0;

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight">
          Football Scores
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {liveCount > 0
            ? `${liveCount} match${liveCount !== 1 ? 'es' : ''} live now`
            : 'All live scores and fixtures'
          }
        </p>
        {dataUpdatedAt > 0 && (
          <p className="text-[10px] text-muted-foreground/40 mt-0.5 font-mono">
            Updated {new Date(dataUpdatedAt).toLocaleTimeString('en-GB')}
          </p>
        )}
      </div>

      {/* Search & Filters */}
      <div className="mb-6">
        <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showFavoritesOnly={showFavoritesOnly}
          onToggleFavorites={() => setShowFavoritesOnly(prev => !prev)}
          liveCount={liveCount}
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="glass-card rounded-xl p-4 mb-6 border-score-red/20">
          <div className="flex items-center gap-2 text-score-red text-sm font-medium">
            <span>⚠</span>
            <span>Failed to load matches. Showing cached data.</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !matches ? (
        <MatchListSkeleton count={6} />
      ) : matches ? (
        <MatchList
          matches={matches}
          activeTab={activeTab}
          searchQuery={searchQuery}
          showFavoritesOnly={showFavoritesOnly}
          favoriteMatches={favorites.matches}
          onToggleFavorite={toggleMatchFavorite}
        />
      ) : null}
    </div>
  );
}