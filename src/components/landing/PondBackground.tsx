import { useEffect, useRef, useState, useMemo } from 'react';

interface Ripple {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

interface FloatingOrb {
  id: number;
  size: number;
  initialX: number;
  initialY: number;
  duration: number;
  delay: number;
}

interface PondBackgroundProps {
  hoveredMode?: 'academic' | 'build' | null;
}

export function PondBackground({ hoveredMode }: PondBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const rippleId = useRef(0);
  const lastRippleTime = useRef(0);

  // Generate floating orbs once
  const floatingOrbs = useMemo<FloatingOrb[]>(() => [
    { id: 1, size: 60, initialX: 15, initialY: 20, duration: 20, delay: 0 },
    { id: 2, size: 40, initialX: 75, initialY: 60, duration: 25, delay: 5 },
    { id: 3, size: 80, initialX: 50, initialY: 80, duration: 30, delay: 2 },
    { id: 4, size: 30, initialX: 85, initialY: 25, duration: 22, delay: 8 },
    { id: 5, size: 50, initialX: 25, initialY: 70, duration: 28, delay: 12 },
  ], []);

  // Handle mouse movement for cursor-following effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      setMousePosition({ x, y });
      
      // Create ripple on movement (throttled)
      const now = Date.now();
      if (now - lastRippleTime.current > 150) {
        lastRippleTime.current = now;
        setRipples(prev => [
          ...prev.slice(-4),
          { id: rippleId.current++, x: e.clientX - rect.left, y: e.clientY - rect.top, timestamp: now }
        ]);
      }
    };

    const container = containerRef.current;
    container?.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      container?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Clean up old ripples
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setRipples(prev => prev.filter(r => now - r.timestamp < 3000));
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  // Mobile idle animation
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (!isMobile) return;

    const interval = setInterval(() => {
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const x = Math.random() * rect.width;
      const y = Math.random() * rect.height;
      
      setRipples(prev => [
        ...prev.slice(-3),
        { id: rippleId.current++, x, y, timestamp: Date.now() }
      ]);
    }, 2500);

    return () => clearInterval(interval);
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

  const getOrbColor = () => {
    if (hoveredMode === 'academic') {
      return 'bg-amber-300/15';
    }
    if (hoveredMode === 'build') {
      return 'bg-blue-300/15';
    }
    return 'bg-sky-300/20';
  };

  const getRippleColor = () => {
    if (hoveredMode === 'academic') {
      return 'border-amber-400/30';
    }
    if (hoveredMode === 'build') {
      return 'border-blue-400/30';
    }
    return 'border-sky-400/35';
  };

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 overflow-hidden transition-colors duration-700 bg-gradient-to-br ${getBackgroundGradient()}`}
    >
      {/* Ambient shimmer layer */}
      <div 
        className="absolute inset-0 animate-shimmer"
        style={{
          background: hoveredMode === 'academic' 
            ? 'radial-gradient(ellipse at 30% 20%, rgba(251,191,36,0.08) 0%, transparent 50%)'
            : hoveredMode === 'build'
            ? 'radial-gradient(ellipse at 70% 30%, rgba(59,130,246,0.08) 0%, transparent 50%)'
            : 'radial-gradient(ellipse at 50% 50%, rgba(56,189,248,0.1) 0%, transparent 60%)',
        }}
      />

      {/* Floating orbs */}
      {floatingOrbs.map((orb) => (
        <div
          key={orb.id}
          className={`absolute rounded-full ${getOrbColor()} blur-sm pointer-events-none transition-colors duration-700`}
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.initialX}%`,
            top: `${orb.initialY}%`,
            animation: `float ${orb.duration}s ease-in-out infinite`,
            animationDelay: `${orb.delay}s`,
          }}
        />
      ))}

      {/* Cursor-following glow */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none transition-opacity duration-300"
        style={{
          backgroundImage: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
            rgba(255,255,255,0.4) 0%, 
            transparent 35%)`,
        }}
      />

      {/* Secondary depth layer - slower parallax */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at ${50 + (mousePosition.x - 50) * 0.3}% ${50 + (mousePosition.y - 50) * 0.3}%, 
            rgba(255,255,255,0.3) 0%, 
            transparent 60%)`,
          transition: 'background-image 0.5s ease-out',
        }}
      />
      
      {/* Ripple effects - enhanced with multiple rings */}
      {ripples.map((ripple) => (
        <div key={ripple.id} className="pointer-events-none">
          {/* Primary ring */}
          <div
            className={`absolute rounded-full border-2 ${getRippleColor()} blur-[0.5px]`}
            style={{
              left: ripple.x,
              top: ripple.y,
              transform: 'translate(-50%, -50%)',
              animation: 'ripple-expand 2.5s ease-out forwards',
            }}
          />
          {/* Secondary ring - delayed */}
          <div
            className={`absolute rounded-full border ${getRippleColor()} blur-[1px]`}
            style={{
              left: ripple.x,
              top: ripple.y,
              transform: 'translate(-50%, -50%)',
              animation: 'ripple-expand-secondary 3s ease-out forwards',
              animationDelay: '0.2s',
            }}
          />
        </div>
      ))}

      {/* Grid pattern for Build mode hover */}
      {hoveredMode === 'build' && (
        <div 
          className="absolute inset-0 opacity-[0.07] transition-opacity duration-500 animate-scan"
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
            className="absolute inset-0 opacity-[0.15] transition-opacity duration-500"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
          {/* Warm glow */}
          <div 
            className="absolute inset-0 animate-pulse-glow pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 40% 30%, rgba(251,191,36,0.12) 0%, transparent 50%)',
            }}
          />
        </>
      )}

      {/* CSS for animations */}
      <style>{`
        @keyframes ripple-expand {
          0% {
            width: 0;
            height: 0;
            opacity: 0.5;
          }
          100% {
            width: 300px;
            height: 300px;
            opacity: 0;
          }
        }

        @keyframes ripple-expand-secondary {
          0% {
            width: 0;
            height: 0;
            opacity: 0.3;
          }
          100% {
            width: 400px;
            height: 400px;
            opacity: 0;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(15px, -20px) scale(1.05);
          }
          50% {
            transform: translate(-10px, -35px) scale(0.95);
          }
          75% {
            transform: translate(-20px, -15px) scale(1.02);
          }
        }

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
          
          [style*="animation: float"],
          [style*="animation: ripple"] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
