import { useEffect, useRef, useState } from 'react';
import { NodeCanvas } from './background/NodeCanvas';

interface PondBackgroundProps {
  hoveredMode?: 'academic' | 'build' | null;
}

export function PondBackground({ hoveredMode }: PondBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  // Handle mouse movement for cursor-following glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      setMousePosition({ x, y });
    };

    const container = containerRef.current;
    container?.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      container?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const getBackgroundGradient = () => {
    if (hoveredMode === 'academic') {
      return 'from-stone-100 via-stone-200 to-stone-300';
    }
    if (hoveredMode === 'build') {
      return 'from-slate-200 via-slate-300 to-slate-400';
    }
    return 'from-sky-100 via-sky-200 to-sky-300';
  };

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 overflow-hidden transition-colors duration-700 bg-gradient-to-br ${getBackgroundGradient()}`}
    >
      {/* Canvas-based node network */}
      <NodeCanvas hoveredMode={hoveredMode ?? null} />

      {/* Ambient shimmer layer */}
      <div 
        className="absolute inset-0 animate-shimmer pointer-events-none"
        style={{
          background: hoveredMode === 'academic' 
            ? 'radial-gradient(ellipse at 30% 20%, rgba(251,191,36,0.08) 0%, transparent 50%)'
            : hoveredMode === 'build'
            ? 'radial-gradient(ellipse at 70% 30%, rgba(59,130,246,0.08) 0%, transparent 50%)'
            : 'radial-gradient(ellipse at 50% 50%, rgba(56,189,248,0.1) 0%, transparent 60%)',
        }}
      />

      {/* Cursor-following glow */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none transition-opacity duration-300"
        style={{
          backgroundImage: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
            rgba(255,255,255,0.5) 0%, 
            transparent 30%)`,
        }}
      />

      {/* Grid pattern for Build mode hover */}
      {hoveredMode === 'build' && (
        <div 
          className="absolute inset-0 opacity-[0.05] transition-opacity duration-500 animate-scan pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(100,116,139,0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(100,116,139,0.4) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      )}

      {/* Paper texture for Academic mode hover */}
      {hoveredMode === 'academic' && (
        <>
          <div 
            className="absolute inset-0 opacity-[0.12] transition-opacity duration-500 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
          {/* Warm glow */}
          <div 
            className="absolute inset-0 animate-pulse-glow pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 40% 30%, rgba(251,191,36,0.1) 0%, transparent 50%)',
            }}
          />
        </>
      )}

      {/* CSS for animations */}
      <style>{`
        @keyframes shimmer {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.02);
          }
        }

        .animate-shimmer {
          animation: shimmer 8s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }

        .animate-pulse-glow {
          animation: pulse-glow 4s ease-in-out infinite;
        }

        @keyframes scan {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 40px 40px;
          }
        }

        .animate-scan {
          animation: scan 20s linear infinite;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-shimmer,
          .animate-pulse-glow,
          .animate-scan {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
