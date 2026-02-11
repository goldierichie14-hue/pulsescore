'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X, Filter, Zap, Star, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TabType } from '@/lib/types';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  liveCount: number;
}

export function SearchFilter({
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  showFavoritesOnly,
  onToggleFavorites,
  liveCount,
}: SearchFilterProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'live',
      label: 'Live',
      icon: <Zap className="h-3.5 w-3.5" />,
    },
    {
      id: 'fixtures',
      label: 'Fixtures',
      icon: <Calendar className="h-3.5 w-3.5" />,
    },
    {
      id: 'results',
      label: 'Results',
      icon: <Filter className="h-3.5 w-3.5" />,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className={cn(
        'relative flex items-center rounded-xl transition-all duration-300',
        'glass-card',
        isSearchFocused && 'ring-1 ring-score-green/30 glow-green'
      )}>
        <Search className="absolute left-4 h-4 w-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search teams, leagues..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          className={cn(
            'w-full bg-transparent py-3 pl-11 pr-10 text-sm text-foreground',
            'placeholder:text-muted-foreground/50',
            'focus:outline-none'
          )}
        />
        {searchQuery && (
          <button
            onClick={() => {
              onSearchChange('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Tabs + Favorites Filter */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-sport-card/50 border border-glass-border">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
                activeTab === tab.id
                  ? 'bg-score-green/10 text-score-green'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              )}
            >
              {tab.icon}
              {tab.label}
              {tab.id === 'live' && liveCount > 0 && (
                <span className="ml-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-live-red/20 px-1 text-[10px] font-bold text-live-red">
                  {liveCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={onToggleFavorites}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border',
            showFavoritesOnly
              ? 'bg-score-yellow/10 text-score-yellow border-score-yellow/20'
              : 'text-muted-foreground border-glass-border hover:text-foreground hover:bg-white/5'
          )}
        >
          <Star className={cn('h-3.5 w-3.5', showFavoritesOnly && 'fill-current')} />
          <span className="hidden sm:inline">Favorites</span>
        </button>
      </div>
    </div>
  );
}