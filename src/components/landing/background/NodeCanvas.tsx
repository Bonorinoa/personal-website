import { useEffect, useRef, useCallback } from 'react';
import { useNodePhysics } from './useNodePhysics';

interface NodeCanvasProps {
  hoveredMode: 'academic' | 'build' | null;
}

export function NodeCanvas({ hoveredMode }: NodeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Check for reduced motion preference
  const reducedMotion = typeof window !== 'undefined' 
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const {
    initNodes,
    updateTargets,
    animate,
    animationFrameRef,
    handleMouseMove,
    handleMouseLeave,
  } = useNodePhysics(canvasRef, hoveredMode, reducedMotion);

  // Handle resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
    
    initNodes(rect.width, rect.height);
    updateTargets(rect.width, rect.height, hoveredMode);
  }, [initNodes, updateTargets, hoveredMode]);

  // Setup
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Start animation
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleResize, animate, animationFrameRef]);

  // Mouse events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: 0.9 }}
      />
    </div>
  );
}
