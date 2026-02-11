import type { Metadata, Viewport } from 'next';
import { Providers } from '@/components/providers';
import { Header } from '@/components/header';
import { LiveTicker } from '@/components/live-ticker';
import './globals.css';

export const metadata: Metadata = {
  title: 'LiveScore — Real-Time Football Scores',
  description: 'Live football scores, fixtures, results, standings and match statistics. Follow your favorite teams and leagues in real-time.',
  keywords: ['livescore', 'football', 'soccer', 'live scores', 'premier league', 'champions league'],
  openGraph: {
    title: 'LiveScore — Real-Time Football Scores',
    description: 'Live football scores, fixtures, results and standings.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0e17',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <LiveTicker />
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <footer className="border-t border-border/40 py-6">
              <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                <p>LiveScore &copy; {new Date().getFullYear()} — Real-time football scores and statistics</p>
                <p className="mt-1 text-xs opacity-60">Data provided by football APIs. Scores may be delayed.</p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}