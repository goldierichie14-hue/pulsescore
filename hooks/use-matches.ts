'use client';

import { useQuery } from '@tanstack/react-query';
import { getMatches, getMatchById, getStandings, getLiveTickerItems } from '@/lib/api';
import { isLive } from '@/lib/utils';
import type { Match } from '@/lib/types';

const POLL_INTERVAL = parseInt(process.env.NEXT_PUBLIC_POLL_INTERVAL || '15000', 10);

export function useMatches(date?: string) {
  return useQuery({
    queryKey: ['matches', date],
    queryFn: () => getMatches(date),
    refetchInterval: (query) => {
      // Poll more frequently if there are live matches
      const data = query.state.data as Match[] | undefined;
      const hasLive = data?.some(m => isLive(m.status));
      return hasLive ? POLL_INTERVAL : 60_000;
    },
    refetchIntervalInBackground: false,
  });
}

export function useMatch(id: number) {
  return useQuery({
    queryKey: ['match', id],
    queryFn: () => getMatchById(id),
    refetchInterval: (query) => {
      const data = query.state.data as Match | null | undefined;
      if (data && isLive(data.status)) return POLL_INTERVAL;
      return 60_000;
    },
    refetchIntervalInBackground: false,
  });
}

export function useStandings(leagueId?: number) {
  return useQuery({
    queryKey: ['standings', leagueId],
    queryFn: () => getStandings(leagueId),
    staleTime: 5 * 60_000, // Standings don't change frequently
    refetchInterval: 5 * 60_000,
  });
}

export function useLiveTicker() {
  return useQuery({
    queryKey: ['ticker'],
    queryFn: getLiveTickerItems,
    refetchInterval: 20_000,
  });
}