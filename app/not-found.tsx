import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="text-6xl mb-4">⚽</div>
        <h1 className="text-3xl font-black mb-2">404</h1>
        <p className="text-muted-foreground mb-6">Page not found. The match you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-score-green/10 text-score-green font-semibold text-sm hover:bg-score-green/20 transition-colors"
        >
          Back to Scores
        </Link>
      </div>
    </div>
  );
}