'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type Theme = 'batman' | 'samurai' | 'futuristic';

export const THEMES: readonly Theme[] = ['batman', 'samurai', 'futuristic'] as const;

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'portfolio-theme';

function isTheme(value: string | null | undefined): value is Theme {
  return value === 'batman' || value === 'samurai' || value === 'futuristic';
}

function readStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isTheme(stored) ? stored : null;
}

function nextTheme(current: Theme): Theme {
  // batman → samurai → futuristic → batman
  switch (current) {
    case 'batman':
      return 'samurai';
    case 'samurai':
      return 'futuristic';
    case 'futuristic':
      return 'batman';
  }
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
