

# Google AI Studio-Inspired Interactive Node Network Background

## Description of the Animation Concept

Based on your description, the Google AI Studio background features a **responsive particle/node network system** with the following characteristics:

### Visual Elements
- **Connected Nodes**: Multiple floating dots/points scattered across the canvas
- **Dynamic Lines**: Lines connecting nearby nodes, creating a network graph visualization
- **Flowing Particles**: Small particles that travel along the connection lines or drift independently
- **Morphing Shapes**: Abstract blobs or clusters that reshape based on the current mode

### Interaction Behavior
- **Cursor Reactivity**: Nodes near the cursor move away or toward it, creating a "magnetic field" effect
- **Mode Reorganization**: When switching modes, nodes physically rearrange into different patterns:
  - **Academic Mode**: Organized, structured grid-like arrangement (scholarly, ordered)
  - **Build Mode**: Web/network cluster formation (collaborative, interconnected)
- **Color Palette Shift**: Warm tones for Academic, cool technical tones for Build
- **Density Changes**: Build mode may show more connections/complexity; Academic may be sparser and cleaner

### Motion Quality
- **Responsive**: Elements react quickly to mouse movement
- **Organic Flow**: Smooth easing, natural-feeling physics
- **Living Background**: Continuous subtle movement even without interaction

---

## Implementation Plan

### Architecture: Canvas-Based Particle System

Replace the current CSS-only approach with a **hybrid Canvas + React** system for performance and flexibility.

```text
+--------------------------------------------------+
|  PondBackground (Container)                      |
|  +--------------------------------------------+  |
|  |  <canvas> - Particles, Nodes, Lines        |  |
|  |  - High-performance 2D rendering           |  |
|  |  - Physics simulation (spring/repulsion)   |  |
|  |  - 60fps animation loop                    |  |
|  +--------------------------------------------+  |
|  +--------------------------------------------+  |
|  |  CSS Layers (existing)                     |  |
|  |  - Gradient backgrounds                    |  |
|  |  - Mode-specific textures                  |  |
|  +--------------------------------------------+  |
+--------------------------------------------------+
```

---

### Core Components

#### 1. Node System
```text
interface Node {
  id: number;
  x: number;           // Current position
  y: number;
  targetX: number;     // Target position (for mode transitions)
  targetY: number;
  vx: number;          // Velocity for physics
  vy: number;
  radius: number;      // Visual size (3-8px)
  connections: number[]; // IDs of connected nodes
}
```

- Generate 40-60 nodes distributed across the canvas
- Each node has physics properties (position, velocity)
- Nodes ease toward target positions when mode changes

#### 2. Connection Lines
```text
- Calculate distances between all node pairs
- Draw lines for pairs within threshold distance (150-200px)
- Line opacity based on distance (closer = more opaque)
- Line color transitions with mode
```

#### 3. Mode-Specific Formations

**Neutral State (Welcome)**
- Random, organic distribution
- Gentle ambient drift
- Sparse connections

**Academic Mode**
- Nodes reorganize into a loose grid pattern
- Reduced connections (cleaner, focused)
- Warm amber connection colors
- Slower, more deliberate movement

**Build Mode**  
- Nodes cluster into interconnected groups
- Dense network of connections
- Cool blue connection colors
- More dynamic, responsive movement

```text
NEUTRAL:              ACADEMIC:             BUILD:
  o     o               o   o   o            o---o---o
    o       o           o   o   o           /|\ /|\ /|
  o   o                 o   o   o          o-+-o-+-o
      o   o             o   o   o           \|/ \|/ \|
  o                     o   o   o            o---o---o
```

---

### Animation Loop

```text
function animate() {
  1. Clear canvas
  
  2. Update node positions
     - Apply velocity
     - Apply cursor repulsion/attraction
     - Ease toward target positions
     - Add ambient drift
     - Dampen velocity
  
  3. Calculate connections
     - Find nodes within connection distance
     - Filter based on mode density
  
  4. Draw connections
     - Line with distance-based opacity
     - Mode-specific color
  
  5. Draw nodes
     - Filled circles with glow effect
     - Mode-specific color
  
  6. requestAnimationFrame(animate)
}
```

---

### Cursor Interaction

```text
Mouse Position -> Force Field

For each node:
  distance = sqrt((node.x - mouse.x)² + (node.y - mouse.y)²)
  
  if distance < INFLUENCE_RADIUS (150px):
    // Repulsion force (nodes move away from cursor)
    force = (INFLUENCE_RADIUS - distance) / INFLUENCE_RADIUS
    angle = atan2(node.y - mouse.y, node.x - mouse.x)
    
    node.vx += cos(angle) * force * STRENGTH
    node.vy += sin(angle) * force * STRENGTH
```

---

### Mode Transition Animation

```text
When hoveredMode changes:

1. Calculate new target positions for all nodes
   - Academic: grid positions
   - Build: cluster positions  
   - Neutral: random positions

2. Nodes ease toward targets over 0.8-1.2 seconds
   node.x += (node.targetX - node.x) * 0.05
   node.y += (node.targetY - node.y) * 0.05

3. Connection threshold and color transition simultaneously
```

---

### Technical Implementation

#### Files to Modify

| File | Changes |
|------|---------|
| `src/components/landing/PondBackground.tsx` | Major rewrite: Add canvas element, particle system, animation loop |

#### New Additions to PondBackground.tsx

**State & Refs**
- `canvasRef` - Reference to canvas element
- `nodesRef` - Array of node objects (mutable for performance)
- `animationFrameRef` - For cleanup
- `mouseRef` - Current mouse position

**New Functions**
- `generateNodes()` - Create initial node array
- `calculateTargetPositions(mode)` - Get grid/cluster/random positions
- `updatePhysics()` - Apply forces, velocity, damping
- `drawFrame()` - Render nodes and connections
- `animate()` - Main loop

**Canvas Layer**
- Positioned behind CSS layers
- Sized to fill container
- Handles resize events

---

### Visual Parameters by Mode

| Parameter | Neutral | Academic | Build |
|-----------|---------|----------|-------|
| Node count | 45 | 45 | 45 |
| Node color | `sky-300` | `amber-400` | `blue-400` |
| Line color | `sky-200/30` | `amber-300/25` | `blue-300/40` |
| Connection distance | 140px | 120px | 180px |
| Max connections/node | 3 | 2 | 5 |
| Movement speed | Medium | Slow | Fast |
| Cursor influence | Medium | Gentle | Strong |
| Formation | Random | Grid | Clusters |

---

### Keeping Existing Features

The current background effects will be preserved as overlay layers:
- Gradient backgrounds (mode-specific colors)
- Paper texture (Academic mode)
- Scan-line grid (Build mode)  
- Cursor-following glow
- Ambient shimmer

The canvas particle system adds a new base layer underneath these.

---

### Performance Considerations

1. **Use Canvas 2D** - More performant than DOM-based particles
2. **Limit node count** - 40-60 nodes is visually rich but performant
3. **Throttle mouse events** - Update mouse position at 60fps max
4. **Use refs for mutable data** - Avoid React state for physics calculations
5. **Respect reduced motion** - Fall back to static/minimal animation

---

### Accessibility

```text
@media (prefers-reduced-motion: reduce) {
  - Disable cursor reactivity
  - Freeze nodes in place
  - Remove ambient drift
  - Keep static connection lines visible
}
```

---

### Expected Result

1. **Page Load**: Nodes fade in with organic random positions, gentle drift
2. **Cursor Movement**: Nodes smoothly push away from cursor, creating a ripple effect
3. **Hover Academic**: Nodes gracefully reorganize into a structured grid, colors warm
4. **Hover Build**: Nodes cluster into interconnected groups, colors shift cool/blue
5. **Mode Persistence**: Formation remains after cursor leaves button (sticky state)
6. **Overall Feel**: Living, breathing background that visually signals each mode's philosophy

