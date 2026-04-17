'use client';

import { motion } from 'framer-motion';
import { THEMES, useTheme, type Theme } from './ThemeProvider';

type Segment = {
  id: Theme;
  label: string;
  aria: string;
};

const SEGMENTS: readonly Segment[] = [
  { id: 'batman', label: 'BAT', aria: 'Batman theme — dark red' },
  { id: 'ancient-india', label: 'ॐ', aria: 'Ancient India theme' },
  { id: 'futuristic', label: '01', aria: 'Futuristic theme — electric cyan' },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Theme selector"
      className="fixed right-6 top-6 z-50 flex items-center rounded-full border border-theme-line bg-theme-surface/70 p-1 backdrop-blur"
    >
      {SEGMENTS.map((seg) => {
        const active = seg.id === theme;
        return (
          <button
            key={seg.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={seg.aria}
            data-cursor-hover
            onClick={() => setTheme(seg.id)}
            className={`relative z-10 flex h-7 min-w-[2.25rem] items-center justify-center px-3 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 ${
              active ? 'text-theme-bg' : 'text-theme-ink/60 hover:text-theme-ink'
            }`}
          >
            {active && (
              <motion.span
                layoutId="theme-toggle-pill"
                aria-hidden="true"
                className="absolute inset-0 -z-10 rounded-full bg-theme-accent"
                transition={{ type: 'spring', stiffness: 420, damping: 36 }}
              />
            )}
            <span className="relative">{seg.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Exported for sections that want to reference the ordered theme list.
export { THEMES };
