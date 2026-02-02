'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const size = 24;

/** 해(위) ↔ 달(아래) 스르륵 슬라이드 애니메이션 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  const toggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  if (!mounted) {
    return <div className={cn('size-6 rounded-lg bg-muted', className)} aria-hidden />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        'inline-flex shrink-0 items-start justify-start overflow-hidden rounded-lg',
        'text-foreground transition-colors hover:bg-muted hover:text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
      style={{ width: size, height: size }}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
    >
      <span
        className="flex flex-col transition-transform duration-500 ease-in-out"
        style={{ transform: isDark ? `translateY(-${size}px)` : 'translateY(0)' }}
      >
        <span className="flex shrink-0 items-center justify-center" style={{ width: size, height: size }} aria-hidden>
          <SunIcon className="size-full stroke-yellow-400" />
        </span>
        <span className="flex shrink-0 items-center justify-center" style={{ width: size, height: size }} aria-hidden>
          <MoonIcon className="size-full stroke-yellow-200" />
        </span>
      </span>
    </button>
  );
}
