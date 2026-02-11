'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-black mb-2">Something went wrong</h1>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          We encountered an error loading the data. This might be a temporary issue.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-score-green/10 text-score-green font-semibold text-sm hover:bg-score-green/20 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}