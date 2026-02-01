import { Link } from 'react-router-dom';
import type { Mode } from '@/hooks/useMode';

interface ModeButtonProps {
  mode: Mode;
  onHover: (mode: Mode) => void;
  onClick: (mode: Mode) => void;
  isActive?: boolean;
}

export function ModeButton({ mode, onHover, onClick, isActive }: ModeButtonProps) {
  const isAcademic = mode === 'academic';
  
  return (
    <Link
      to={`/${mode}`}
      onClick={() => onClick(mode)}
      onMouseEnter={() => onHover(mode)}
      // No onMouseLeave - hover state persists
      className={`
        group relative
        w-40 h-24 md:w-52 md:h-32
        flex flex-col items-center justify-center
        backdrop-blur-md rounded-2xl
        border transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${isAcademic 
          ? 'bg-stone-50/70 border-stone-300/50 hover:bg-stone-100/80 hover:border-amber-400/50 focus:ring-amber-400'
          : 'bg-slate-50/70 border-slate-300/50 hover:bg-slate-100/80 hover:border-blue-400/50 focus:ring-blue-400'
        }
        ${isActive 
          ? isAcademic 
            ? 'border-amber-400/70 shadow-lg shadow-amber-200/30' 
            : 'border-blue-400/70 shadow-lg shadow-blue-200/30'
          : ''
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
        block mt-1 text-xs md:text-sm text-center px-2
        transition-all duration-300
        ${isActive ? 'opacity-70' : 'opacity-0 group-hover:opacity-70'}
        ${isAcademic 
          ? 'text-stone-500'
          : 'text-slate-500'
        }
      `}>
        {isAcademic ? 'Research & Teaching' : 'Projects & AI'}
      </span>

      {/* Decorative accent */}
      <div className={`
        absolute -bottom-1 left-1/2 -translate-x-1/2
        h-0.5 rounded-full
        transition-all duration-300
        ${isActive ? 'w-3/4' : 'w-0 group-hover:w-3/4'}
        ${isAcademic ? 'bg-amber-400' : 'bg-blue-400'}
      `} />
    </Link>
  );
}
