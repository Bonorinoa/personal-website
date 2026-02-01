export interface Node {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  radius: number;
}

export interface ModeConfig {
  nodeColor: string;
  lineColor: string;
  connectionDistance: number;
  maxConnections: number;
  cursorInfluence: number;
  easeSpeed: number;
  ambientDrift: number;
}

export const MODE_CONFIGS: Record<'neutral' | 'academic' | 'build', ModeConfig> = {
  neutral: {
    nodeColor: 'rgba(56, 189, 248, 0.6)',      // sky-400
    lineColor: 'rgba(56, 189, 248, 0.15)',
    connectionDistance: 140,
    maxConnections: 3,
    cursorInfluence: 0.8,
    easeSpeed: 0.03,
    ambientDrift: 0.15,
  },
  academic: {
    nodeColor: 'rgba(251, 191, 36, 0.7)',      // amber-400
    lineColor: 'rgba(251, 191, 36, 0.12)',
    connectionDistance: 120,
    maxConnections: 2,
    cursorInfluence: 0.5,
    easeSpeed: 0.025,
    ambientDrift: 0.08,
  },
  build: {
    nodeColor: 'rgba(96, 165, 250, 0.7)',      // blue-400
    lineColor: 'rgba(96, 165, 250, 0.2)',
    connectionDistance: 180,
    maxConnections: 5,
    cursorInfluence: 1.2,
    easeSpeed: 0.04,
    ambientDrift: 0.2,
  },
};

export const NODE_COUNT = 50;
export const CURSOR_INFLUENCE_RADIUS = 150;
export const VELOCITY_DAMPING = 0.92;
