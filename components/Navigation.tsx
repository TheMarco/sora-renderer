'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/new', label: 'New Render', icon: '✨' },
  { href: '/queue', label: 'Queue', icon: '⏳' },
  { href: '/library', label: 'Library', icon: '📚' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="glass-card sticky top-0 z-40 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/new" className="flex items-center space-x-2 group">
            <div className="text-2xl group-hover:scale-110 transition-transform">🎬</div>
            <span className="text-xl font-bold bg-gradient-to-r from-accent-light to-accent bg-clip-text text-transparent">
              Sora Renderer
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-2 rounded-lg font-medium transition-all duration-200',
                    'hover:bg-surface-hover',
                    isActive && 'bg-surface text-text-primary',
                    !isActive && 'text-text-secondary'
                  )}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}

            {/* Settings Link */}
            <Link
              href="/settings"
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-all duration-200',
                'hover:bg-surface-hover',
                pathname === '/settings' && 'bg-surface text-text-primary',
                pathname !== '/settings' && 'text-text-secondary'
              )}
              aria-label="Settings"
            >
              <span className="text-xl">⚙️</span>
            </Link>

            {/* About Link */}
            <Link
              href="/about"
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-all duration-200',
                'hover:bg-surface-hover',
                pathname === '/about' && 'bg-surface text-text-primary',
                pathname !== '/about' && 'text-text-secondary'
              )}
              aria-label="About"
            >
              <span className="text-xl">ℹ️</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

