import { useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useMode } from '@/hooks/useMode';
import { ModeToggle } from './ModeToggle';

type Flight = {
  id: number;
  fromX: number;
  fromY: number;
  fromW: number;
  fromH: number;
  toX: number;
  toY: number;
  toW: number;
  toH: number;
  peakY: number;
  destination: 'consulting' | 'mode';
};

let lastNavigationPath: string | null = null;

export function Navigation() {
  const { mode } = useMode();
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const actionsRef = useRef<HTMLDivElement>(null);
  const consultingRef = useRef<HTMLAnchorElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);
  const flightIdRef = useRef(0);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [consultingMarkerReady, setConsultingMarkerReady] = useState(false);

  if (location.pathname === '/') return null;

  const isConsulting = location.pathname === '/consulting';
  const isAcademic = mode === 'academic' || isConsulting;

  useLayoutEffect(() => {
    const previousPath = lastNavigationPath;
    lastNavigationPath = location.pathname;

    if (prefersReducedMotion) {
      setFlight(null);
      setConsultingMarkerReady(isConsulting);
      return;
    }

    const actions = actionsRef.current?.getBoundingClientRect();
    const consulting = consultingRef.current?.getBoundingClientRect();
    const toggle = toggleRef.current?.getBoundingClientRect();
    if (!actions || !consulting || !toggle) {
      setConsultingMarkerReady(isConsulting);
      return;
    }

    const previousWasConsulting = previousPath === '/consulting';
    const shouldEnterConsulting = isConsulting && previousPath !== '/consulting';
    const shouldLeaveConsulting = !isConsulting && previousWasConsulting;

    if (!shouldEnterConsulting && !shouldLeaveConsulting) {
      setFlight(null);
      setConsultingMarkerReady(isConsulting);
      return;
    }

    const targetIsBuild = location.pathname.startsWith('/build');
    const modeX = toggle.left - actions.left + toggle.width * (targetIsBuild ? 0.75 : 0.25) - 10;
    const modeY = toggle.top - actions.top + toggle.height / 2 - 10;
    const consultingX = consulting.left - actions.left + consulting.width / 2 - 10;
    const consultingY = consulting.bottom - actions.top - 2;

    flightIdRef.current += 1;
    setConsultingMarkerReady(false);
    setFlight({
      id: flightIdRef.current,
      fromX: shouldEnterConsulting ? modeX : consultingX,
      fromY: shouldEnterConsulting ? modeY : consultingY,
      toX: shouldEnterConsulting ? consultingX : modeX,
      toY: shouldEnterConsulting ? consultingY : modeY,
      destination: shouldEnterConsulting ? 'consulting' : 'mode',
    });
  }, [isConsulting, location.pathname, prefersReducedMotion]);

  const finishFlight = () => {
    if (!flight) return;
    setConsultingMarkerReady(flight.destination === 'consulting');
    setFlight(null);
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-background/70 backdrop-blur-xl backdrop-saturate-150 hairline-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link
            to="/"
            className="group flex items-baseline gap-2 text-sm tracking-tight text-foreground min-h-[44px] py-2"
          >
            <span
              className={`whitespace-nowrap ${
                isAcademic
                  ? 'font-serif text-[14px] sm:text-base italic'
                  : 'font-mono text-[12px] sm:text-[13px]'
              }`}
            >
              <span className="sm:hidden">A. G-B</span>
              <span className="hidden sm:inline">A. González-Bonorino</span>
            </span>

          </Link>

          <div ref={actionsRef} className="relative flex items-center gap-3 sm:gap-5 shrink-0">
            <Link
              ref={consultingRef}
              to="/consulting"
              className={`relative font-serif text-[15px] transition-colors ${
                isConsulting
                  ? 'text-[hsl(var(--oxblood))]'
                  : 'text-[hsl(var(--muted-ink))] hover:text-[hsl(var(--oxblood))]'
              }`}
            >
              Consulting
              {isConsulting && consultingMarkerReady && (
                <motion.span
                  data-testid="consulting-marker"
                  layoutId="consulting-active-marker"
                  initial={{ opacity: 0, scaleX: 0.55, y: -2 }}
                  animate={{ opacity: 1, scaleX: 1, y: 0 }}
                  className="absolute -bottom-1 left-1/2 h-[3px] w-7 -translate-x-1/2 rounded-full bg-[hsl(var(--oxblood))]/75 shadow-[0_1px_4px_hsl(var(--oxblood)/0.22)]"
                />
              )}
            </Link>
            <div ref={toggleRef}>
              <ModeToggle activeOverride={isConsulting || flight ? null : undefined} />
            </div>

            {flight && (
              <motion.span
                key={flight.id}
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 z-20 h-5 w-5 rounded-full bg-background/80 ring-1 ring-foreground/15 shadow-[inset_0_1px_0_hsl(var(--background)),0_4px_12px_-3px_hsl(var(--foreground)/0.28)] backdrop-blur-md"
                initial={{ x: flight.fromX, y: flight.fromY, scaleX: 1, scaleY: 1, rotate: 0 }}
                animate={{
                  x: [flight.fromX, flight.fromX, (flight.fromX + flight.toX) / 2, flight.toX + (flight.destination === 'consulting' ? -5 : 5), flight.toX],
                  y: [flight.fromY, flight.fromY + 4, Math.min(flight.fromY, flight.toY) - 24, flight.toY - 3, flight.toY],
                  scaleX: [1, 1.3, 0.82, 1.18, 1],
                  scaleY: [1, 0.68, 1.2, 0.82, 1],
                  rotate: [0, -8, 18, -7, 0],
                }}
                transition={{ duration: 0.72, times: [0, 0.14, 0.5, 0.82, 1], ease: 'easeInOut' }}
                onAnimationComplete={finishFlight}
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
