'use client';

import { useState, useEffect, useCallback } from 'react';

interface Favorites {
  matches: number[];
  teams: number[];
}

const STORAGE_KEY = 'livescore-favorites';

function loadFavorites(): Favorites {
  if (typeof window === 'undefined') return { matches: [], teams: [] };
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { matches: [], teams: [] };
}

function saveFavorites(favorites: Favorites) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch {}
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorites>({ matches: [], teams: [] });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setFavorites(loadFavorites());
    setLoaded(true);
  }, []);

  const toggleMatchFavorite = useCallback((matchId: number) => {
    setFavorites(prev => {
      const next = prev.matches.includes(matchId)
        ? { ...prev, matches: prev.matches.filter(id => id !== matchId) }
        : { ...prev, matches: [...prev.matches, matchId] };
      saveFavorites(next);
      return next;
    });
  }, []);

  const toggleTeamFavorite = useCallback((teamId: number) => {
    setFavorites(prev => {
      const next = prev.teams.includes(teamId)
        ? { ...prev, teams: prev.teams.filter(id => id !== teamId) }
        : { ...prev, teams: [...prev.teams, teamId] };
      saveFavorites(next);
      return next;
    });
  }, []);

  const isMatchFavorite = useCallback((matchId: number) => {
    return favorites.matches.includes(matchId);
  }, [favorites.matches]);

  const isTeamFavorite = useCallback((teamId: number) => {
    return favorites.teams.includes(teamId);
  }, [favorites.teams]);

  return {
    favorites,
    loaded,
    toggleMatchFavorite,
    toggleTeamFavorite,
    isMatchFavorite,
    isTeamFavorite,
  };
}