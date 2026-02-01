import { Link } from 'react-router-dom';
import type { Mode } from '@/hooks/useMode';

interface ModeButtonProps {
  mode: Mode;
  onHover: (mode: Mode | null) => void;
  onClick: (mode: Mode) => void;
}

export function ModeButton({ mode, onHover, onClick }: ModeButtonProps) {
  const isAcademic = mode === 'academic';
  
  return (
    <Link
      to={`/${mode}`}
      onClick={() => onClick(mode)}
      onMouseEnter={() => onHover(mode)}
      onMouseLeave={() => onHover(null)}
      className={`
        group relative px-8 py-4 md:px-12 md:py-6
        backdrop-blur-md rounded-2xl
        border transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${isAcademic 
          ? 'bg-stone-50/70 border-stone-300/50 hover:bg-stone-100/80 hover:border-amber-400/50 focus:ring-amber-400'
          : 'bg-slate-50/70 border-slate-300/50 hover:bg-slate-100/80 hover:border-blue-400/50 focus:ring-blue-400'
        }
        hover:scale-105 hover:shadow-xl
        active:scale-100
      `}
    >
      {/* Mode label */}
      <span className={`
        text-xl md:text-2xl font-medium tracking-wide
        transition-all duration-300
        ${isAcademic 
          ? 'font-academic text-stone-700 group-hover:text-stone-900'
          : 'font-build text-slate-700 group-hover:text-slate-900'
        }
      `}>
        {isAcademic ? 'Academic' : 'Build'}
      </span>
      
      {/* Subtitle hint */}
      <span className={`
        block mt-1 text-xs md:text-sm
        transition-all duration-300 opacity-0 group-hover:opacity-70
        ${isAcademic 
          ? 'text-stone-500'
          : 'text-slate-500'
        }
      `}>
        {isAcademic ? 'Research & Teaching' : 'Projects & AI Collaboration'}
      </span>

      {/* Decorative accent */}
      <div className={`
        absolute -bottom-1 left-1/2 -translate-x-1/2
        w-0 h-0.5 rounded-full
        transition-all duration-300
        group-hover:w-3/4
        ${isAcademic ? 'bg-amber-400' : 'bg-blue-400'}
      `} />
    </Link>
  );
}
