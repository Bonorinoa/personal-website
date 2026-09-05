import { useEffect, useRef } from 'react';

/**
 * LightWell — a soft pool of light fixed near the center of the page.
 * A fine grid is masked so it only surfaces inside the light, which reads
 * as the page bending toward its center. The glow drifts a few percent
 * toward the cursor with heavy easing — present, never demanding.
 */
export function LightWell() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const target = { x: 0.5, y: 0.44 };
    const cur = { x: 0.5, y: 0.44 };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = 0.5 + (e.clientX / window.innerWidth - 0.5) * 0.16;
      target.y = 0.44 + (e.clientY / window.innerHeight - 0.44) * 0.12;
    };

    const tick = () => {
      cur.x += (target.x - cur.x) * 0.055;
      cur.y += (target.y - cur.y) * 0.055;
      el.style.setProperty('--lx', `${(cur.x * 100).toFixed(2)}%`);
      el.style.setProperty('--ly', `${(cur.y * 100).toFixed(2)}%`);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="light-well" aria-hidden />;
}
