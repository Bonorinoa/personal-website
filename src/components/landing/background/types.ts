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
    connectionDistance: 100,
    maxConnections: 3,
    cursorInfluence: 0.8,
    easeSpeed: 0.03,
    ambientDrift: 0.12,
  },
  academic: {
    nodeColor: 'rgba(251, 191, 36, 0.7)',      // amber-400
    lineColor: 'rgba(251, 191, 36, 0.1)',
    connectionDistance: 80,
    maxConnections: 2,
    cursorInfluence: 0.3,
    easeSpeed: 0.06,           // Fast snap to grid
    ambientDrift: 0.02,        // Minimal movement - solid foundation
  },
  build: {
    nodeColor: 'rgba(96, 165, 250, 0.7)',      // blue-400
    lineColor: 'rgba(96, 165, 250, 0.25)',
    connectionDistance: 120,
    maxConnections: 6,
    cursorInfluence: 1.0,
    easeSpeed: 0.035,
    ambientDrift: 0.25,        // Dynamic movement
  },
};

// Base node count - Build mode will multiply this
export const BASE_NODE_COUNT = 80;
export const BUILD_NODE_MULTIPLIER = 1.8;  // 80 * 1.8 = ~144 nodes in Build mode
export const CURSOR_INFLUENCE_RADIUS = 120;
export const VELOCITY_DAMPING = 0.9;
export const MIN_NODE_RADIUS = 1.5;
export const MAX_NODE_RADIUS = 5;  // Max ~10px diameter (roughly 1cm on screen)
