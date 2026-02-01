import { useState, useEffect, useCallback } from 'react';

export type Mode = 'academic' | 'build';

const STORAGE_KEY = 'site-mode';

export function useMode() {
  const [mode, setModeState] = useState<Mode | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load mode from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Mode | null;
    if (stored === 'academic' || stored === 'build') {
      setModeState(stored);
    }
    setIsLoading(false);
  }, []);

  // Persist mode to localStorage
  const setMode = useCallback((newMode: Mode) => {
    setModeState(newMode);
    localStorage.setItem(STORAGE_KEY, newMode);
  }, []);

  // Clear mode (return to landing)
  const clearMode = useCallback(() => {
    setModeState(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Toggle between modes
  const toggleMode = useCallback(() => {
    const newMode = mode === 'academic' ? 'build' : 'academic';
    setMode(newMode);
  }, [mode, setMode]);

  return {
    mode,
    setMode,
    clearMode,
    toggleMode,
    isLoading,
    isAcademic: mode === 'academic',
    isBuild: mode === 'build',
  };
}
