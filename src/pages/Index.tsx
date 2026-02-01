import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PondBackground } from '@/components/landing/PondBackground';
import { ModeButton } from '@/components/landing/ModeButton';
import { useMode, type Mode } from '@/hooks/useMode';

const Index = () => {
  // Sticky hover: once set, only changes when hovering another button (never resets to null)
  const [activeMode, setActiveMode] = useState<Mode | null>(null);
  const { setMode } = useMode();
  const navigate = useNavigate();

  const handleModeSelect = (mode: Mode) => {
    setMode(mode);
    navigate(`/${mode}`);
  };

  // Only set on hover enter, never clear on leave
  const handleModeHover = (mode: Mode) => {
    setActiveMode(mode);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <PondBackground hoveredMode={activeMode} />
      
      {/* Content overlay */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Name / Title */}
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h1 className={`
            text-3xl md:text-5xl font-light tracking-wide mb-3
            transition-all duration-500
            ${activeMode === 'academic' 
              ? 'font-academic text-stone-800' 
              : activeMode === 'build'
              ? 'font-build text-slate-800'
              : 'font-sans text-slate-700'
            }
          `}>
            Augusto González-Bonorino
          </h1>
          <p 
            key={activeMode || 'default'}
            className={`
              text-lg md:text-xl
              animate-fade-in
              ${activeMode === 'academic' 
                ? 'font-academic text-stone-600' 
                : activeMode === 'build'
                ? 'font-build text-slate-600'
                : 'text-slate-500'
              }
            `}
          >
            {activeMode === 'academic' 
              ? 'Economist · Researcher · Teacher'
              : activeMode === 'build'
              ? '// builder · ai_collaborator'
              : 'Economist · Researcher · Builder'
            }
          </p>
        </div>

        {/* Mode Selection Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <ModeButton 
            mode="academic" 
            onHover={handleModeHover}
            onClick={handleModeSelect}
            isActive={activeMode === 'academic'}
          />
          <ModeButton 
            mode="build" 
            onHover={handleModeHover}
            onClick={handleModeSelect}
            isActive={activeMode === 'build'}
          />
        </div>

        {/* Subtle instruction */}
        <p className="mt-12 text-sm text-slate-400 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          Choose how you'd like to explore
        </p>
      </div>
    </div>
  );
};

export default Index;
