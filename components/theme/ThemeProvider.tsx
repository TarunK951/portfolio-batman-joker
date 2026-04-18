'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type Theme = 'batman' | 'ancient-india';

export const THEMES: readonly Theme[] = ['batman', 'ancient-india'] as const;

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'portfolio-theme';

function isTheme(value: string | null | undefined): value is Theme {
  return value === 'batman' || value === 'ancient-india';
}

function readStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  // Migration: old 'samurai' key → 'ancient-india'
  if (raw === 'samurai' || raw === 'futuristic') {
    try {
      window.localStorage.setItem(STORAGE_KEY, 'ancient-india');
    } catch {
      /* noop */
    }
    return 'ancient-india';
  }
  return isTheme(raw) ? raw : null;
}

function nextTheme(current: Theme): Theme {
  return current === 'batman' ? 'ancient-india' : 'batman';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('batman');

  useEffect(() => {
    const stored = readStoredTheme();
    if (stored && stored !== theme) {
      setThemeState(stored);
      document.documentElement.dataset.theme = stored;
    }
    // Run once on mount to reconcile with the pre-paint init script.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage unavailable — theme still applies for the session */
    }
  }, []);

  const toggle = useCallback(() => {
    setThemeState((prev) => {
      const next = nextTheme(prev);
      document.documentElement.dataset.theme = next;
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* noop */
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ theme, setTheme, toggle }), [theme, setTheme, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
