import { useEffect, useRef } from 'react';

/**
 * Full-screen canvas that paints a slow ink-bleed trail following the cursor.
 * Reads --ink and --paper from the active theme so it inherits the world.
 * No-op when prefers-reduced-motion is set or on touch-only devices.
 */
export function InkTrail() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover)').matches) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Read live theme tokens
    const readToken = (name: string, fallback: string) => {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
      return v || fallback;
    };
    const inkHsl = readToken('--ink', '24 28% 9%');
    const paperHsl = readToken('--paper', '38 38% 94%');

    const drops: { x: number; y: number; r: number; life: number; max: number }[] = [];
    let mx = -1000;
    let my = -1000;
    let lastDrop = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let raf = 0;
    const tick = (t: number) => {
      // Fade the whole canvas toward paper — old ink bleeds away
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = `hsla(${paperHsl} / 0.045)`;
      ctx.fillRect(0, 0, width, height);

      // Drop a new ink sample every ~28ms while cursor is in range
      if (t - lastDrop > 28 && mx > 0 && my > 0) {
        const r = 14 + Math.random() * 10;
        drops.push({ x: mx, y: my, r, life: 0, max: 900 + Math.random() * 600 });
        lastDrop = t;
        if (drops.length > 80) drops.shift();
      }

      // Render drops as soft radial gradients in ink
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.life += 16;
        if (d.life > d.max) {
          drops.splice(i, 1);
          continue;
        }
        const p = d.life / d.max;
        const radius = d.r * (1 + p * 1.8);
        const alpha = 0.085 * (1 - p);
        const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, radius);
        g.addColorStop(0, `hsla(${inkHsl} / ${alpha})`);
        g.addColorStop(0.55, `hsla(${inkHsl} / ${alpha * 0.35})`);
        g.addColorStop(1, `hsla(${inkHsl} / 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 w-full h-full z-0"
    />
  );
}
