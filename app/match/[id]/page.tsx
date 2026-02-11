'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, User, Clock } from 'lucide-react';
import { useMatch } from '@/hooks/use-matches';
import { useFavorites } from '@/hooks/use-favorites';
import { cn, isLive, isFinished, formatMatchTime, formatDate } from '@/lib/utils';
import { LiveBadge } from '@/components/live-badge';
import { TeamLogo } from '@/components/team-logo';
import { FavoriteButton } from '@/components/favorite-button';
import { EventTimeline } from '@/components/event-timeline';
import { StatsBar } from '@/components/stats-bar';
import { MatchDetailSkeleton } from '@/components/loading-skeleton';

type DetailTab = 'events' | 'stats' | 'lineups' | 'info';

export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = Number(params.id);
  const [activeTab, setActiveTab] = useState<DetailTab>('events');

  const { data: match, isLoading, error } = useMatch(matchId);
  const { isMatchFavorite, toggleMatchFavorite } = useFavorites();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <MatchDetailSkeleton />
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div className="glass-card rounded-xl p-8 text-center">
          <div className="text-4xl mb-3">😕</div>
          <h2 className="text-lg font-bold mb-1">Match not found</h2>
          <p className="text-sm text-muted-foreground">
            This match may not exist or data is unavailable.
          </p>
        </div>
      </div>
    );
  }

  const live = isLive(match.status);
  const finished = isFinished(match.status);

  const tabs: { id: DetailTab; label: string; disabled?: boolean }[] = [
    { id: 'events', label: 'Events' },
    { id: 'stats', label: 'Statistics', disabled: !match.statistics || match.statistics.length === 0 },
    { id: 'lineups', label: 'Lineups', disabled: !match.lineups },
    { id: 'info', label: 'Info' },
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to scores
      </button>

      {/* Score Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'glass-card rounded-xl p-6 mb-6',
          live && 'border-live-red/20 glow-red'
        )}
      >
        {/* League & Status */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            {match.league.flag && <span className="text-sm">{match.league.flag}</span>}
            <span className="text-xs font-medium text-muted-foreground">
              {match.league.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <LiveBadge
              status={match.status}
              minute={match.minute}
              extraMinute={match.extraMinute}
              size="md"
            />
            <FavoriteButton
              isFavorite={isMatchFavorite(match.id)}
              onToggle={() => toggleMatchFavorite(match.id)}
              size="md"
            />
          </div>
        </div>

        {/* Teams & Score */}
        <div className="flex items-center justify-center gap-6 sm:gap-10">
          {/* Home Team */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <TeamLogo src={match.homeTeam.logo} alt={match.homeTeam.name} size="xl" />
            <span className="text-sm font-bold text-center leading-tight">
              {match.homeTeam.name}
            </span>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3">
              <span className={cn(
                'text-5xl sm:text-6xl font-black score-text',
                live && 'text-foreground',
                finished && 'text-muted-foreground',
              )}>
                {match.score.home}
              </span>
              <span className="text-2xl text-muted-foreground/30 font-light">-</span>
              <span className={cn(
                'text-5xl sm:text-6xl font-black score-text',
                live && 'text-foreground',
                finished && 'text-muted-foreground',
              )}>
                {match.score.away}
              </span>
            </div>

            {/* Sub-scores */}
            <div className="flex items-center gap-3 mt-1">
              {match.score.htHome !== undefined && match.score.htAway !== undefined && (
                <span className="text-xs text-muted-foreground/60 font-mono">
                  HT {match.score.htHome}-{match.score.htAway}
                </span>
              )}
              {match.score.penHome !== undefined && match.score.penAway !== undefined && (
                <span className="text-xs text-muted-foreground/60 font-mono">
                  PEN {match.score.penHome}-{match.score.penAway}
                </span>
              )}
            </div>
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <TeamLogo src={match.awayTeam.logo} alt={match.awayTeam.name} size="xl" />
            <span className="text-sm font-bold text-center leading-tight">
              {match.awayTeam.name}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-sport-card/50 border border-glass-border mb-6 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            disabled={tab.disabled}
            className={cn(
              'flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap',
              activeTab === tab.id
                ? 'bg-score-green/10 text-score-green'
                : tab.disabled
                  ? 'text-muted-foreground/30 cursor-not-allowed'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'events' && (
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-sm font-bold mb-4 text-muted-foreground uppercase tracking-wider">Match Events</h3>
              <EventTimeline
                events={match.events}
                homeTeamName={match.homeTeam.name}
                awayTeamName={match.awayTeam.name}
              />
            </div>
          )}

          {activeTab === 'stats' && match.statistics && (
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-sm font-bold mb-4 text-muted-foreground uppercase tracking-wider">Match Statistics</h3>
              <StatsBar statistics={match.statistics} />
            </div>
          )}

          {activeTab === 'lineups' && match.lineups && (
            <div className="space-y-4">
              {/* Home Lineup */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TeamLogo src={match.homeTeam.logo} alt={match.homeTeam.name} size="sm" />
                    <h3 className="text-sm font-bold">{match.homeTeam.name}</h3>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {match.lineups.home.formation}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mb-3">
                  Coach: {match.lineups.home.coach}
                </div>

                {/* Starting XI */}
                <div className="mb-4">
                  <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-bold mb-2">Starting XI</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {match.lineups.home.startXI.map(player => (
                      <div key={player.id} className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-white/5">
                        <span className="text-xs font-mono text-muted-foreground w-5 text-right">{player.number}</span>
                        <span className="text-sm">{player.name}</span>
                        <span className="text-[10px] text-muted-foreground/50 ml-auto">{player.position}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Substitutes */}
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-bold mb-2">Substitutes</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {match.lineups.home.substitutes.map(player => (
                      <div key={player.id} className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-white/5 opacity-70">
                        <span className="text-xs font-mono text-muted-foreground w-5 text-right">{player.number}</span>
                        <span className="text-sm">{player.name}</span>
                        <span className="text-[10px] text-muted-foreground/50 ml-auto">{player.position}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Away Lineup */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TeamLogo src={match.awayTeam.logo} alt={match.awayTeam.name} size="sm" />
                    <h3 className="text-sm font-bold">{match.awayTeam.name}</h3>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {match.lineups.away.formation}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mb-3">
                  Coach: {match.lineups.away.coach}
                </div>

                {/* Starting XI */}
                <div className="mb-4">
                  <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-bold mb-2">Starting XI</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {match.lineups.away.startXI.map(player => (
                      <div key={player.id} className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-white/5">
                        <span className="text-xs font-mono text-muted-foreground w-5 text-right">{player.number}</span>
                        <span className="text-sm">{player.name}</span>
                        <span className="text-[10px] text-muted-foreground/50 ml-auto">{player.position}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Substitutes */}
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-bold mb-2">Substitutes</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {match.lineups.away.substitutes.map(player => (
                      <div key={player.id} className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-white/5 opacity-70">
                        <span className="text-xs font-mono text-muted-foreground w-5 text-right">{player.number}</span>
                        <span className="text-sm">{player.name}</span>
                        <span className="text-[10px] text-muted-foreground/50 ml-auto">{player.position}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'info' && (
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-sm font-bold mb-4 text-muted-foreground uppercase tracking-wider">Match Info</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium">{formatDate(match.date)}</div>
                    <div className="text-xs text-muted-foreground">
                      Kick-off: {formatMatchTime(match.date, match.time)}
                    </div>
                  </div>
                </div>
                {match.venue && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium">{match.venue}</div>
                      <div className="text-xs text-muted-foreground">Venue</div>
                    </div>
                  </div>
                )}
                {match.referee && (
                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium">{match.referee}</div>
                      <div className="text-xs text-muted-foreground">Referee</div>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="h-4 w-4 flex items-center justify-center text-muted-foreground mt-0.5 flex-shrink-0">
                    🏆
                  </div>
                  <div>
                    <div className="text-sm font-medium">{match.league.name}</div>
                    <div className="text-xs text-muted-foreground">{match.league.country}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}