import { useEffect, useRef, useState } from 'react';

interface Ripple {
  id: number;
  x: number;
  y: number;
  timestamp: number;
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
      if (now - lastRippleTime.current > 100) {
        lastRippleTime.current = now;
        setRipples(prev => [
          ...prev.slice(-5), // Keep only last 5 ripples
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
      setRipples(prev => prev.filter(r => now - r.timestamp < 2000));
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
    }, 2000);

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

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 overflow-hidden transition-colors duration-700 bg-gradient-to-br ${getBackgroundGradient()}`}
    >
      {/* Ambient water texture */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
            rgba(255,255,255,0.3) 0%, 
            transparent 50%)`,
          transition: 'background-image 0.3s ease-out'
        }}
      />
      
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className={`absolute rounded-full border pointer-events-none ${
            hoveredMode === 'academic' 
              ? 'border-amber-400/40' 
              : hoveredMode === 'build'
              ? 'border-blue-400/40'
              : 'border-sky-400/40'
          }`}
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)',
            animation: `ripple-expand ${hoveredMode === 'build' ? '1.5s' : '2s'} ease-out forwards`,
          }}
        />
      ))}

      {/* Grid pattern for Build mode hover */}
      {hoveredMode === 'build' && (
        <div 
          className="absolute inset-0 opacity-10 transition-opacity duration-500"
          style={{
            backgroundImage: `
              linear-gradient(rgba(100,116,139,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(100,116,139,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      )}

      {/* Paper texture for Academic mode hover */}
      {hoveredMode === 'academic' && (
        <div 
          className="absolute inset-0 opacity-20 transition-opacity duration-500"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      {/* CSS for ripple animation */}
      <style>{`
        @keyframes ripple-expand {
          0% {
            width: 0;
            height: 0;
            opacity: 0.6;
          }
          100% {
            width: 200px;
            height: 200px;
            opacity: 0;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .ripple-expand {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
