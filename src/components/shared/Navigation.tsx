import { Link, useLocation } from 'react-router-dom';
import { useMode } from '@/hooks/useMode';
import { ModeToggle } from './ModeToggle';
import { Home } from 'lucide-react';

export function Navigation() {
  const { mode } = useMode();
  const location = useLocation();
  
  // Don't show navigation on landing page
  if (location.pathname === '/') return null;
  
  const isAcademic = mode === 'academic';

  return (
    <nav className={`
      fixed top-0 left-0 right-0 z-50
      backdrop-blur-md border-b
      transition-colors duration-300
      ${isAcademic 
        ? 'bg-stone-50/80 border-stone-200/50' 
        : 'bg-slate-50/80 border-slate-200/50'
      }
    `}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Home */}
          <Link 
            to="/"
            className={`
              flex items-center gap-2 text-lg font-medium
              transition-colors duration-200
              ${isAcademic 
                ? 'text-stone-700 hover:text-stone-900' 
                : 'text-slate-700 hover:text-slate-900'
              }
            `}
          >
            <Home className="w-5 h-5" />
            <span className={isAcademic ? 'font-serif' : 'font-sans'}>
              A. González-Bonorino
            </span>
          </Link>

          {/* External Links */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a 
              href="https://github.com/Bonorinoa" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`
                transition-colors duration-200
                ${isAcademic 
                  ? 'text-stone-600 hover:text-stone-900' 
                  : 'text-slate-600 hover:text-slate-900'
                }
              `}
            >
              GitHub
            </a>
            <a 
              href="https://www.econllm-lab.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`
                transition-colors duration-200
                ${isAcademic 
                  ? 'text-stone-600 hover:text-stone-900' 
                  : 'text-slate-600 hover:text-slate-900'
                }
              `}
            >
              EconLLM Lab
            </a>
            <a 
              href="https://perwellgroup.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`
                transition-colors duration-200
                ${isAcademic 
                  ? 'text-stone-600 hover:text-stone-900' 
                  : 'text-slate-600 hover:text-slate-900'
                }
              `}
            >
              Consulting
            </a>
          </div>

          {/* Mode Toggle */}
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
