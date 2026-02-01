import { useRef, useCallback, useEffect } from 'react';
import { 
  Node, 
  ModeConfig, 
  MODE_CONFIGS, 
  NODE_COUNT, 
  CURSOR_INFLUENCE_RADIUS, 
  VELOCITY_DAMPING 
} from './types';

type Mode = 'academic' | 'build' | null;

function generateNodes(width: number, height: number): Node[] {
  const nodes: Node[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    nodes.push({
      id: i,
      x,
      y,
      targetX: x,
      targetY: y,
      vx: 0,
      vy: 0,
      radius: 3 + Math.random() * 4,
    });
  }
  return nodes;
}

function calculateGridPositions(width: number, height: number, count: number): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  const cols = Math.ceil(Math.sqrt(count * (width / height)));
  const rows = Math.ceil(count / cols);
  const cellWidth = width / (cols + 1);
  const cellHeight = height / (rows + 1);
  
  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    // Add slight randomness to grid positions for organic feel
    const jitterX = (Math.random() - 0.5) * cellWidth * 0.3;
    const jitterY = (Math.random() - 0.5) * cellHeight * 0.3;
    positions.push({
      x: (col + 1) * cellWidth + jitterX,
      y: (row + 1) * cellHeight + jitterY,
    });
  }
  return positions;
}

function calculateClusterPositions(width: number, height: number, count: number): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  // Create 3-4 cluster centers
  const clusterCenters = [
    { x: width * 0.25, y: height * 0.3 },
    { x: width * 0.7, y: height * 0.25 },
    { x: width * 0.5, y: height * 0.65 },
    { x: width * 0.8, y: height * 0.7 },
  ];
  
  for (let i = 0; i < count; i++) {
    const cluster = clusterCenters[i % clusterCenters.length];
    // Nodes cluster around centers with some spread
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * Math.min(width, height) * 0.15;
    positions.push({
      x: cluster.x + Math.cos(angle) * distance,
      y: cluster.y + Math.sin(angle) * distance,
    });
  }
  return positions;
}

function calculateRandomPositions(width: number, height: number, count: number): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    positions.push({
      x: Math.random() * width,
      y: Math.random() * height,
    });
  }
  return positions;
}

export function useNodePhysics(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  hoveredMode: Mode,
  reducedMotion: boolean
) {
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationFrameRef = useRef<number>(0);
  const currentConfigRef = useRef<ModeConfig>(MODE_CONFIGS.neutral);
  const timeRef = useRef(0);

  // Initialize nodes
  const initNodes = useCallback((width: number, height: number) => {
    if (nodesRef.current.length === 0) {
      nodesRef.current = generateNodes(width, height);
    }
  }, []);

  // Update target positions based on mode
  const updateTargets = useCallback((width: number, height: number, mode: Mode) => {
    let positions: { x: number; y: number }[];
    
    if (mode === 'academic') {
      positions = calculateGridPositions(width, height, NODE_COUNT);
    } else if (mode === 'build') {
      positions = calculateClusterPositions(width, height, NODE_COUNT);
    } else {
      positions = calculateRandomPositions(width, height, NODE_COUNT);
    }
    
    nodesRef.current.forEach((node, i) => {
      if (positions[i]) {
        node.targetX = positions[i].x;
        node.targetY = positions[i].y;
      }
    });
  }, []);

  // Update config when mode changes
  useEffect(() => {
    const modeKey = hoveredMode || 'neutral';
    currentConfigRef.current = MODE_CONFIGS[modeKey];
    
    const canvas = canvasRef.current;
    if (canvas) {
      updateTargets(canvas.width, canvas.height, hoveredMode);
    }
  }, [hoveredMode, updateTargets, canvasRef]);

  // Physics update
  const updatePhysics = useCallback(() => {
    const config = currentConfigRef.current;
    const mouse = mouseRef.current;
    timeRef.current += 0.016; // ~60fps
    
    nodesRef.current.forEach((node, index) => {
      if (reducedMotion) {
        // In reduced motion, just snap to targets
        node.x = node.targetX;
        node.y = node.targetY;
        return;
      }

      // Ease toward target
      const dx = node.targetX - node.x;
      const dy = node.targetY - node.y;
      node.vx += dx * config.easeSpeed;
      node.vy += dy * config.easeSpeed;
      
      // Cursor repulsion
      const distX = node.x - mouse.x;
      const distY = node.y - mouse.y;
      const dist = Math.sqrt(distX * distX + distY * distY);
      
      if (dist < CURSOR_INFLUENCE_RADIUS && dist > 0) {
        const force = ((CURSOR_INFLUENCE_RADIUS - dist) / CURSOR_INFLUENCE_RADIUS) * config.cursorInfluence;
        const angle = Math.atan2(distY, distX);
        node.vx += Math.cos(angle) * force * 2;
        node.vy += Math.sin(angle) * force * 2;
      }
      
      // Ambient drift (sine wave motion)
      const driftX = Math.sin(timeRef.current * 0.5 + index * 0.3) * config.ambientDrift;
      const driftY = Math.cos(timeRef.current * 0.4 + index * 0.5) * config.ambientDrift;
      node.vx += driftX * 0.1;
      node.vy += driftY * 0.1;
      
      // Apply velocity
      node.x += node.vx;
      node.y += node.vy;
      
      // Damping
      node.vx *= VELOCITY_DAMPING;
      node.vy *= VELOCITY_DAMPING;
    });
  }, [reducedMotion]);

  // Draw frame
  const drawFrame = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const config = currentConfigRef.current;
    const nodes = nodesRef.current;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw connections
    ctx.strokeStyle = config.lineColor;
    ctx.lineWidth = 1;
    
    for (let i = 0; i < nodes.length; i++) {
      let connections = 0;
      for (let j = i + 1; j < nodes.length; j++) {
        if (connections >= config.maxConnections) break;
        
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < config.connectionDistance) {
          const opacity = 1 - (dist / config.connectionDistance);
          ctx.globalAlpha = opacity * 0.6;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
          connections++;
        }
      }
    }
    
    ctx.globalAlpha = 1;
    
    // Draw nodes with glow
    nodes.forEach(node => {
      // Glow effect
      const gradient = ctx.createRadialGradient(
        node.x, node.y, 0,
        node.x, node.y, node.radius * 3
      );
      gradient.addColorStop(0, config.nodeColor);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Core
      ctx.fillStyle = config.nodeColor;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    updatePhysics();
    drawFrame(ctx, canvas.width, canvas.height);
    
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [canvasRef, updatePhysics, drawFrame]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    };
  }, [canvasRef]);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -1000, y: -1000 };
  }, []);

  return {
    nodesRef,
    mouseRef,
    animationFrameRef,
    initNodes,
    updateTargets,
    animate,
    handleMouseMove,
    handleMouseLeave,
  };
}
