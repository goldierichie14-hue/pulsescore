'use client';

import { cn } from '@/lib/utils';

export function MatchCardSkeleton() {
  return (
    <div className="glass-card rounded-xl p-4 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-3 w-24 rounded bg-white/5" />
        <div className="h-5 w-12 rounded bg-white/5" />
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-3 justify-end">
          <div className="h-4 w-20 rounded bg-white/5" />
          <div className="h-10 w-10 rounded-full bg-white/5" />
        </div>
        <div className="w-20 flex items-center justify-center">
          <div className="h-8 w-16 rounded bg-white/5" />
        </div>
        <div className="flex-1 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white/5" />
          <div className="h-4 w-20 rounded bg-white/5" />
        </div>
      </div>
    </div>
  );
}

export function MatchListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <MatchCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StandingsSkeleton() {
  return (
    <div className="glass-card rounded-xl overflow-hidden animate-pulse">
      <div className="p-4 border-b border-glass-border">
        <div className="h-5 w-36 rounded bg-white/5" />
      </div>
      <div className="p-4 space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-4 w-4 rounded bg-white/5" />
            <div className="h-6 w-6 rounded-full bg-white/5" />
            <div className="h-4 w-28 rounded bg-white/5 flex-1" />
            <div className="h-4 w-8 rounded bg-white/5" />
            <div className="h-4 w-8 rounded bg-white/5" />
            <div className="h-4 w-8 rounded bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MatchDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Score header */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4 justify-center">
          <div className="h-4 w-32 rounded bg-white/5" />
        </div>
        <div className="flex items-center justify-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="h-14 w-14 rounded-full bg-white/5" />
            <div className="h-4 w-24 rounded bg-white/5" />
          </div>
          <div className="text-center">
            <div className="h-12 w-24 rounded bg-white/5 mx-auto" />
            <div className="h-4 w-16 rounded bg-white/5 mx-auto mt-2" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-14 w-14 rounded-full bg-white/5" />
            <div className="h-4 w-24 rounded bg-white/5" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 w-20 rounded-lg bg-white/5" />
        ))}
      </div>

      {/* Content */}
      <div className="glass-card rounded-xl p-6">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 rounded bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}