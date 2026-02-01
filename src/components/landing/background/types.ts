export interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

export type BackgroundMode = 'neutral' | 'academic' | 'build';

// Physics constants per mode
export const MODE_PHYSICS = {
  neutral: {
    wanderForce: 0.1,
    originPull: 0.001,
    friction: 0.95,
    mouseRadius: 150,
    mousePush: 10,
    particleColor: 'rgba(56, 189, 248, 0.5)',  // sky-400
    lineColor: 'rgba(56, 189, 248, 0.1)',
  },
  academic: {
    springForce: 0.05,
    friction: 0.8,
    mouseRadius: 100,
    mousePush: 5,
    particleColor: 'rgba(180, 140, 60, 0.5)',  // warm gold/amber
    lineColor: 'rgba(180, 140, 60, 0.08)',
  },
  build: {
    wanderForce: 0.4,
    friction: 0.98,
    mouseRadius: 200,
    mousePush: 15,
    particleColor: 'rgba(59, 130, 246, 0.7)',  // blue-500
    lineColor: 'rgba(59, 130, 246, 0.35)',     // More visible lines
    connectionDistance: 150,                   // Larger connection radius
  },
} as const;

export const GRID_SPACING = 45;  // Spacing between grid points
