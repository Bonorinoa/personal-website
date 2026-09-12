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
    const segW = (toggle.width - 8) / 2;
    const segH = toggle.height - 8;
    const modeX = toggle.left - actions.left + 4 + (targetIsBuild ? segW : 0);
    const modeY = toggle.top - actions.top + 4;
    const markerW = 28;
    const markerH = 3;
    const consultingX = consulting.left - actions.left + consulting.width / 2 - markerW / 2;
    const consultingY = consulting.bottom - actions.top + 4;

    flightIdRef.current += 1;
    setConsultingMarkerReady(false);
    setFlight({
      id: flightIdRef.current,
      fromX: shouldEnterConsulting ? modeX : consultingX,
      fromY: shouldEnterConsulting ? modeY : consultingY,
      fromW: shouldEnterConsulting ? segW : markerW,
      fromH: shouldEnterConsulting ? segH : markerH,
      toX: shouldEnterConsulting ? consultingX : modeX,
      toY: shouldEnterConsulting ? consultingY : modeY,
      toW: shouldEnterConsulting ? markerW : segW,
      toH: shouldEnterConsulting ? markerH : segH,
      peakY: Math.min(modeY, consultingY) - 14,
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
                className="pointer-events-none absolute left-0 top-0 z-20 rounded-full overflow-hidden
                           bg-background/70 ring-1 ring-foreground/10 backdrop-blur-md backdrop-saturate-150
                           shadow-[inset_0_1px_0_hsl(var(--background)),inset_0_-1px_1px_hsl(var(--foreground)/0.08),0_4px_14px_-4px_hsl(var(--foreground)/0.2)]"
                initial={{
                  x: flight.fromX,
                  y: flight.fromY,
                  width: flight.fromW,
                  height: flight.fromH,
                  scaleX: 1,
                  scaleY: 1,
                }}
                animate={{
                  x: [flight.fromX, (flight.fromX + flight.toX) / 2, flight.toX],
                  y: [flight.fromY, flight.peakY, flight.toY],
                  width: [flight.fromW, (flight.fromW + flight.toW) / 2, flight.toW],
                  height: [flight.fromH, (flight.fromH + flight.toH) / 2 + 2, flight.toH],
                  scaleX: [1, 0.94, 1.04, 1],
                  scaleY: [1, 1.06, 0.96, 1],
                }}
                transition={{
                  duration: 0.58,
                  ease: [0.33, 0.02, 0.2, 1],
                  x: { duration: 0.58, ease: [0.4, 0, 0.2, 1] },
                  y: { duration: 0.58, times: [0, 0.48, 1], ease: [0.34, 0.8, 0.3, 1] },
                  scaleX: { duration: 0.58, times: [0, 0.35, 0.78, 1], ease: 'easeInOut' },
                  scaleY: { duration: 0.58, times: [0, 0.35, 0.78, 1], ease: 'easeInOut' },
                }}
                onAnimationComplete={finishFlight}
              >
                <motion.span
                  aria-hidden
                  className="absolute inset-x-1 top-[1px] h-1/2 rounded-full bg-gradient-to-b from-background to-transparent"
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: flight.destination === 'consulting' ? [0.8, 0.5, 0] : [0, 0.5, 0.8] }}
                  transition={{ duration: 0.58, ease: 'easeInOut' }}
                />
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-[hsl(var(--oxblood))]"
                  initial={{ opacity: flight.destination === 'consulting' ? 0 : 0.75 }}
                  animate={{ opacity: flight.destination === 'consulting' ? [0, 0.15, 0.75] : [0.75, 0.15, 0] }}
                  transition={{ duration: 0.58, ease: 'easeInOut' }}
                />
              </motion.span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
