'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Match } from '@/lib/types';
import { isLive } from '@/lib/utils';

export function useGoalNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [enabled, setEnabled] = useState(false);
  const previousScores = useRef<Map<number, { home: number; away: number }>>(new Map());

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      setEnabled(true);
    }
  }, []);

  const toggleNotifications = useCallback(() => {
    if (permission !== 'granted') {
      requestPermission();
    } else {
      setEnabled(prev => !prev);
    }
  }, [permission, requestPermission]);

  const checkForGoals = useCallback((matches: Match[]) => {
    if (!enabled || permission !== 'granted') return;

    matches.forEach(match => {
      if (!isLive(match.status)) return;

      const prev = previousScores.current.get(match.id);
      if (prev) {
        if (match.score.home > prev.home) {
          new Notification(`⚽ GOAL! ${match.homeTeam.name}`, {
            body: `${match.homeTeam.shortName} ${match.score.home} - ${match.score.away} ${match.awayTeam.shortName} (${match.minute}')`,
            icon: '/favicon.ico',
            tag: `goal-${match.id}-${match.score.home}-${match.score.away}`,
          });
        }
        if (match.score.away > prev.away) {
          new Notification(`⚽ GOAL! ${match.awayTeam.name}`, {
            body: `${match.homeTeam.shortName} ${match.score.home} - ${match.score.away} ${match.awayTeam.shortName} (${match.minute}')`,
            icon: '/favicon.ico',
            tag: `goal-${match.id}-${match.score.home}-${match.score.away}`,
          });
        }
      }
      previousScores.current.set(match.id, { home: match.score.home, away: match.score.away });
    });
  }, [enabled, permission]);

  return {
    permission,
    enabled,
    toggleNotifications,
    requestPermission,
    checkForGoals,
  };
}