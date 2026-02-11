import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { MatchStatus, EventType } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isLive(status: MatchStatus): boolean {
  return ['1H', '2H', 'HT', 'ET', 'BT', 'P', 'LIVE'].includes(status);
}

export function isFinished(status: MatchStatus): boolean {
  return ['FT', 'AET', 'PEN', 'AWD', 'WO'].includes(status);
}

export function isUpcoming(status: MatchStatus): boolean {
  return ['TBD', 'NS'].includes(status);
}

export function getStatusDisplay(status: MatchStatus, minute?: number, extraMinute?: number): string {
  switch (status) {
    case 'NS': return 'Not Started';
    case '1H': return extraMinute ? `${minute}'+${extraMinute}` : `${minute}'`;
    case 'HT': return 'HT';
    case '2H': return extraMinute ? `${minute}'+${extraMinute}` : `${minute}'`;
    case 'ET': return `ET ${minute}'`;
    case 'BT': return 'Break';
    case 'P': return 'PEN';
    case 'FT': return 'FT';
    case 'AET': return 'AET';
    case 'PEN': return 'PEN';
    case 'SUSP': return 'SUSP';
    case 'PST': return 'PST';
    case 'CANC': return 'CANC';
    case 'ABD': return 'ABD';
    case 'LIVE': return minute ? `${minute}'` : 'LIVE';
    default: return status;
  }
}

export function getEventIcon(type: EventType): string {
  switch (type) {
    case 'goal': return '⚽';
    case 'penalty_goal': return '⚽ (P)';
    case 'own_goal': return '⚽ (OG)';
    case 'penalty_missed': return '❌ (P)';
    case 'yellow_card': return '🟨';
    case 'red_card': return '🟥';
    case 'substitution': return '🔄';
    case 'var': return '📺';
    default: return '•';
  }
}

export function getEventColor(type: EventType): string {
  switch (type) {
    case 'goal':
    case 'penalty_goal':
      return 'text-score-green';
    case 'own_goal':
    case 'penalty_missed':
    case 'red_card':
      return 'text-score-red';
    case 'yellow_card':
      return 'text-score-yellow';
    case 'substitution':
      return 'text-blue-400';
    case 'var':
      return 'text-purple-400';
    default:
      return 'text-muted-foreground';
  }
}

export function formatMatchTime(dateStr: string, timeStr: string): string {
  try {
    const date = new Date(`${dateStr}T${timeStr}`);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return timeStr;
  }
}

export function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return dateStr;
  }
}

export function getStatPercent(home: number | string, away: number | string): { homePercent: number; awayPercent: number } {
  const h = typeof home === 'string' ? parseFloat(home) : home;
  const a = typeof away === 'string' ? parseFloat(away) : away;
  const total = h + a;
  if (total === 0) return { homePercent: 50, awayPercent: 50 };
  return {
    homePercent: Math.round((h / total) * 100),
    awayPercent: Math.round((a / total) * 100),
  };
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}