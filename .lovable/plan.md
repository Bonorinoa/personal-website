
# Landing Page Enhancement: Persistent Hover, Enhanced Background, and Uniform Buttons

## Overview

This plan addresses three improvements to the landing page:
1. **Sticky Hover State** - Once user hovers over either mode, that style persists until they hover the other
2. **Enhanced Pond Animation** - More captivating ambient background with floating elements and depth
3. **Geometrically Identical Buttons** - Both buttons share exact same dimensions and structure

---

## Part 1: Sticky Hover State

### Current Behavior
- Hover over Academic: page shows Academic style
- Mouse leaves button: page reverts to neutral
- This creates visual "flickering" as users explore

### New Behavior
- Page loads with neutral "welcome" state (calm, inviting)
- First hover over either button: that mode's style activates
- Mouse leaves: style PERSISTS (no revert to neutral)
- Hovering other button: switches to that mode's style
- Result: user only sees neutral state once, on initial load

### Implementation
**File: `src/pages/Index.tsx`**
- Change state from `hoveredMode` to `activeMode` with different logic
- Track actual hover separately from persisted selection
- Update handler: `onMouseEnter` sets `activeMode`, `onMouseLeave` does nothing

```text
Before:                          After:
[null] -> hover A -> [A]         [null] -> hover A -> [A]
       -> leave   -> [null]              -> leave   -> [A] (persists!)
       -> hover B -> [B]                 -> hover B -> [B]
       -> leave   -> [null]              -> leave   -> [B] (persists!)
```

---

## Part 2: Enhanced Pond Background

### Current Issues
- Ripples are subtle and can be missed
- No ambient movement when cursor is still
- Background feels static between interactions

### Enhancements

**Floating Orbs/Particles**
- 3-5 slowly drifting translucent circles
- Different sizes (20px to 80px)
- Gentle sine-wave motion paths
- Opacity: 10-20% (subtle, not distracting)

**Layered Depth Effect**
- Multiple gradient layers at different positions
- Parallax-like movement following cursor (slower response)
- Creates sense of depth in the "pond"

**Improved Ripples**
- Larger max size (300px instead of 200px)
- Multiple concentric rings per ripple
- Slight blur for more organic water feel
- Slower, more graceful animation timing

**Ambient Shimmer**
- Subtle CSS animation on the base gradient
- Slow color shifts within the palette
- Creates "living" background even without interaction

**Mode-Specific Enhancements**
- Academic hover: paper-grain texture + warm light glow
- Build hover: subtle scan-line animation + digital particles
- Neutral: calm water with gentle light reflections

### Animation Keyframes to Add
```text
@keyframes float - gentle up/down/drift for orbs
@keyframes shimmer - slow opacity/position shift
@keyframes pulse-glow - soft radial light breathing
```

---

## Part 3: Geometrically Identical Buttons

### Current Issue
Buttons use padding-based sizing:
- `px-8 py-4 md:px-12 md:py-6`
- Content determines final width
- "Academic" and "Build" have different character counts

### Solution: Fixed Dimensions

**Uniform Size Approach**
- Set explicit width: `w-40 md:w-52` (same for both)
- Set explicit height: `h-24 md:h-32`
- Center content with flexbox
- Both buttons become perfect rectangles

**Updated Button Structure**
```text
+------------------+    +------------------+
|                  |    |                  |
|     Academic     |    |      Build       |
|  Research & ...  |    |  Projects & ...  |
|                  |    |                  |
+------------------+    +------------------+
     160px x 96px            160px x 96px
```

**Visual Balance**
- Identical border-radius
- Same glassmorphism effect
- Matching hover animations
- Symmetric accent line widths

---

## Technical Implementation

### Files to Modify

| File | Changes |
|------|---------|
| `src/pages/Index.tsx` | Implement sticky hover logic (activeMode state) |
| `src/components/landing/PondBackground.tsx` | Add floating orbs, layered gradients, enhanced ripples, ambient shimmer |
| `src/components/landing/ModeButton.tsx` | Fixed width/height, flexbox centering, update props to not clear on leave |

### New CSS Animations (in PondBackground)
```text
@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(10px, -15px); }
  50% { transform: translate(-5px, -25px); }
  75% { transform: translate(-15px, -10px); }
}

@keyframes shimmer {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.25; }
}

@keyframes pulse-glow {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.5; }
}
```

### State Logic Change
```text
// Current
const [hoveredMode, setHoveredMode] = useState<Mode | null>(null);
onMouseLeave={() => setHoveredMode(null)}  // resets

// New
const [activeMode, setActiveMode] = useState<Mode | null>(null);
onMouseEnter={() => setActiveMode(mode)}   // sets
onMouseLeave={() => {}}                     // does nothing - persists!
```

---

## Accessibility Considerations

- All animations respect `prefers-reduced-motion`
- Floating elements have reduced/disabled motion for accessibility
- Buttons maintain clear focus states
- Sufficient color contrast maintained in all states

---

## Expected Result

1. **First Visit**: User sees calm, neutral pond with gentle ambient animation
2. **First Hover**: Page smoothly transitions to that mode's style (Academic warm tones or Build cool/technical)
3. **Exploration**: User can hover between buttons, style switches but never reverts to neutral
4. **Visual Impact**: Background feels alive with floating elements, layered depth, and organic ripples
5. **Symmetry**: Both buttons are perfectly identical rectangles, creating balanced composition
