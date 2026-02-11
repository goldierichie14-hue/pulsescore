'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy, Home, BarChart3, Bell, BellOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';
import { useGoalNotifications } from '@/hooks/use-notifications';

const navItems = [
  { href: '/', label: 'Scores', icon: Home },
  { href: '/leagues', label: 'Leagues', icon: Trophy },
];

export function Header() {
  const pathname = usePathname();
  const { enabled, toggleNotifications, permission } = useGoalNotifications();

  return (
    <header className="sticky top-0 z-50 glass border-b border-glass-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-score-green/10 group-hover:bg-score-green/20 transition-colors">
              <BarChart3 className="h-5 w-5 text-score-green" />
            </div>
            <span className="text-xl font-black tracking-tight">
              <span className="text-gradient">Live</span>
              <span className="text-foreground">Score</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-score-green/10 text-score-green'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleNotifications}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200',
                enabled
                  ? 'bg-score-green/10 text-score-green'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              )}
              title={enabled ? 'Goal notifications on' : 'Goal notifications off'}
            >
              {enabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            </button>
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile navigation */}
        <nav className="flex sm:hidden items-center gap-1 pb-3 -mx-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-score-green/10 text-score-green'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}