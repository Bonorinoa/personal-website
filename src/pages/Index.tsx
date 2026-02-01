import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PondBackground } from '@/components/landing/PondBackground';
import { ModeButton } from '@/components/landing/ModeButton';
import { useMode, type Mode } from '@/hooks/useMode';

const Index = () => {
  const [hoveredMode, setHoveredMode] = useState<Mode | null>(null);
  const { setMode } = useMode();
  const navigate = useNavigate();

  const handleModeSelect = (mode: Mode) => {
    setMode(mode);
    navigate(`/${mode}`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <PondBackground hoveredMode={hoveredMode} />
      
      {/* Content overlay */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Name / Title */}
        <div className="text-center mb-12 md:mb-16 animate-fade-in">
          <h1 className={`
            text-3xl md:text-5xl font-light tracking-wide mb-3
            transition-all duration-500
            ${hoveredMode === 'academic' 
              ? 'font-serif text-stone-800' 
              : hoveredMode === 'build'
              ? 'font-sans text-slate-800'
              : 'font-sans text-slate-700'
            }
          `}>
            Augusto González-Bonorino
          </h1>
          <p className={`
            text-lg md:text-xl
            transition-all duration-500
            ${hoveredMode === 'academic' 
              ? 'text-stone-600' 
              : hoveredMode === 'build'
              ? 'text-slate-600'
              : 'text-slate-500'
            }
          `}>
            Economist · Researcher · Builder
          </p>
        </div>

        {/* Mode Selection Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <ModeButton 
            mode="academic" 
            onHover={setHoveredMode}
            onClick={handleModeSelect}
          />
          <ModeButton 
            mode="build" 
            onHover={setHoveredMode}
            onClick={handleModeSelect}
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
