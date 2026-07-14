import { Link, useLocation } from 'react-router-dom';
import { useMode } from '@/hooks/useMode';
import { ModeToggle } from './ModeToggle';

export function Navigation() {
  const { mode } = useMode();
  const location = useLocation();

  if (location.pathname === '/') return null;

  const isAcademic = mode === 'academic';

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-background/70 backdrop-blur-xl backdrop-saturate-150 hairline-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link
            to="/"
            className="group flex items-baseline gap-2 text-sm tracking-tight text-foreground min-h-[44px] py-2"
          >
            <span className={isAcademic ? 'font-serif text-base italic' : 'font-mono text-[13px]'}>
              A. González-Bonorino
            </span>
            <span className="text-muted-foreground hidden sm:inline">·</span>
            <span className="hidden sm:inline text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {isAcademic ? 'Research' : 'Build'}
            </span>
          </Link>

          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}

