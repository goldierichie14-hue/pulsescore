export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <div className="h-10 w-10 rounded-full border-2 border-glass-border border-t-score-green animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">Loading scores...</p>
      </div>
    </div>
  );
}