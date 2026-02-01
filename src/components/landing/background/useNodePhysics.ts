import { useRef, useCallback, useEffect } from 'react';
import { Particle, BackgroundMode, MODE_PHYSICS, GRID_SPACING } from './types';

export function useNodePhysics(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  mode: BackgroundMode,
  reducedMotion: boolean
) {
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const frameIdRef = useRef<number>(0);

  // Initialize particles based on screen size
  const initParticles = useCallback((width: number, height: number) => {
    const cols = Math.floor(width / GRID_SPACING);
    const rows = Math.floor(height / GRID_SPACING);
    const newParticles: Particle[] = [];

    // Create grid-based origins, but start particles randomly (chaotic start)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Grid position with slight jitter
        const originX = c * GRID_SPACING + GRID_SPACING / 2 + (Math.random() * 10 - 5);
        const originY = r * GRID_SPACING + GRID_SPACING / 2 + (Math.random() * 10 - 5);
        
        newParticles.push({
          x: Math.random() * width,   // Start chaotically spread
          y: Math.random() * height,
          originX,
          originY,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 2 + 1,
          color: MODE_PHYSICS.neutral.particleColor,
        });
      }
    }
    
    particlesRef.current = newParticles;
  }, []);

  // Main animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const physics = MODE_PHYSICS[mode];
    const mouse = mouseRef.current;

    // Clear canvas (transparent - background color handled by CSS)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update each particle
    particlesRef.current.forEach(p => {
      if (reducedMotion) {
        // In reduced motion, snap to origins
        p.x = p.originX;
        p.y = p.originY;
        p.color = physics.particleColor;
      } else {
        // --- ACADEMIC MODE: SPRING TO GRID ---
        if (mode === 'academic') {
          const dx = p.originX - p.x;
          const dy = p.originY - p.y;
          // Spring force pulls toward grid position
          p.vx += dx * MODE_PHYSICS.academic.springForce;
          p.vy += dy * MODE_PHYSICS.academic.springForce;
          // Heavy friction for order
          p.vx *= MODE_PHYSICS.academic.friction;
          p.vy *= MODE_PHYSICS.academic.friction;
          p.color = MODE_PHYSICS.academic.particleColor;
        }
        // --- BUILD MODE: CHAOS & NETWORK ---
        else if (mode === 'build') {
          // Wander force - random movement
          p.vx += (Math.random() - 0.5) * MODE_PHYSICS.build.wanderForce;
          p.vy += (Math.random() - 0.5) * MODE_PHYSICS.build.wanderForce;
          // Low friction for energy
          p.vx *= MODE_PHYSICS.build.friction;
          p.vy *= MODE_PHYSICS.build.friction;
          p.color = MODE_PHYSICS.build.particleColor;
        }
        // --- NEUTRAL MODE: FLUID DRIFT ---
        else {
          // Gentle wander
          p.vx += (Math.random() - 0.5) * MODE_PHYSICS.neutral.wanderForce;
          p.vy += (Math.random() - 0.5) * MODE_PHYSICS.neutral.wanderForce;
          // Gentle return toward origin to keep density uniform
          const dx = p.originX - p.x;
          const dy = p.originY - p.y;
          p.vx += dx * MODE_PHYSICS.neutral.originPull;
          p.vy += dy * MODE_PHYSICS.neutral.originPull;
          p.vx *= MODE_PHYSICS.neutral.friction;
          p.vy *= MODE_PHYSICS.neutral.friction;
          p.color = MODE_PHYSICS.neutral.particleColor;
        }

        // --- MOUSE INTERACTION (REPULSOR) ---
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const interactionRadius = physics.mouseRadius;

        if (dist < interactionRadius && dist > 0) {
          const force = (interactionRadius - dist) / interactionRadius;
          const angle = Math.atan2(dy, dx);
          const pushStrength = physics.mousePush;
          p.vx += Math.cos(angle) * force * pushStrength;
          p.vy += Math.sin(angle) * force * pushStrength;
        }

        // Apply velocity
        p.x += p.vx;
        p.y += p.vy;
      }

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });

    // --- BUILD MODE: DRAW NETWORK LINES ---
    if (mode === 'build' && !reducedMotion) {
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = MODE_PHYSICS.build.lineColor;
      
      const particles = particlesRef.current;
      const connectionDist = MODE_PHYSICS.build.connectionDistance;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            // Fade lines based on distance
            const opacity = 1 - (dist / connectionDist);
            ctx.globalAlpha = opacity * 0.3;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    }

    frameIdRef.current = requestAnimationFrame(animate);
  }, [canvasRef, mode, reducedMotion]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    mouseRef.current = {
      x: (e.clientX - rect.left) * dpr,
      y: (e.clientY - rect.top) * dpr,
    };
  }, [canvasRef]);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -1000, y: -1000 };
  }, []);

  return {
    particlesRef,
    frameIdRef,
    initParticles,
    animate,
    handleMouseMove,
    handleMouseLeave,
  };
}
