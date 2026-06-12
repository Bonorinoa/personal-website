import { Link, useLocation } from 'react-router-dom';
import { useMode } from '@/hooks/useMode';
import { useTheme } from '@/hooks/useTheme';
import { Moon, Sun } from 'lucide-react';

export function Navigation() {
  const { mode } = useMode();
  const location = useLocation();
  const { isDark, toggle } = useTheme();

  if (location.pathname === '/') return null;

  const isAcademic = mode === 'academic';
  const navLink =
    'transition-colors hover:text-cobalt min-h-[44px] inline-flex items-center px-1';

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-background/85 backdrop-blur hairline-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link
            to="/"
            className="group flex items-baseline gap-2 text-sm tracking-tight text-foreground min-h-[44px] py-2"
          >
            <span className={isAcademic ? 'font-serif text-base' : 'font-mono text-[13px]'}>
              A. González-Bonorino
            </span>
            <span className="text-muted-foreground hidden sm:inline">·</span>
            <span className="hidden sm:inline text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {isAcademic ? 'Research' : 'Build'}
            </span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-5 text-xs uppercase tracking-[0.14em]">
            <Link
              to="/academic"
              className={`${navLink} ${location.pathname === '/academic' ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              Research
            </Link>
            <Link
              to="/build"
              className={`${navLink} ${location.pathname === '/build' ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              Build
            </Link>
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
