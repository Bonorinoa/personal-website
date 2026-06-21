import { useEffect } from 'react';

export type World = 'academic' | 'build' | null;

/**
 * Sets the `data-world` attribute on <html> so CSS can swap the entire
 * design-token palette. Pass `null` (or omit) on the landing page to use
 * the shared editorial cream.
 */
export function useWorld(world: World) {
  useEffect(() => {
    const root = document.documentElement;
    if (world) {
      root.setAttribute('data-world', world);
    } else {
      root.removeAttribute('data-world');
    }
    return () => {
      root.removeAttribute('data-world');
    };
  }, [world]);
}
