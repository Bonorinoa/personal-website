import { Link, useLocation } from 'react-router-dom';
import { useMode } from '@/hooks/useMode';
import { ModeToggle } from './ModeToggle';

export function Navigation() {
  const { mode } = useMode();
  const location = useLocation();

  if (location.pathname === '/') return null;

  const isConsulting = location.pathname === '/consulting';
  const isAcademic = mode === 'academic' || isConsulting;

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-background/70 backdrop-blur-xl backdrop-saturate-150 hairline-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link
            to="/"
            className="group flex items-baseline gap-2 text-sm tracking-tight text-foreground min-h-[44px] py-2"
          >
            <span
              className={`whitespace-nowrap ${
                isAcademic
                  ? 'font-serif text-[14px] sm:text-base italic'
                  : 'font-mono text-[12px] sm:text-[13px]'
              }`}
            >
              <span className="sm:hidden">A. G-B</span>
              <span className="hidden sm:inline">A. González-Bonorino</span>
            </span>

          </Link>

          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <Link
              to="/consulting"
              className={`font-serif text-[15px] transition-colors ${
                isConsulting
                  ? 'text-[hsl(var(--oxblood))]'
                  : 'text-[hsl(var(--muted-ink))] hover:text-[hsl(var(--oxblood))]'
              }`}
            >
              Consulting
            </Link>
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
