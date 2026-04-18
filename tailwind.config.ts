import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Utopia Tokyo brand palette (literal hex — for special cases only)
        utopia: {
          black: '#0A0A0A',
          cream: '#EDEAE0',
          red: '#D72638',
          neutral: '#161616',
        },
        batman: {
          bg: '#0A0A0A',
          surface: '#111111',
          'surface-raised': '#161616',
          accent: '#D72638',
          'accent-dim': '#8A1824',
          ink: '#EDEAE0',
          'ink-subtle': '#8A8880',
        },
        samurai: {
          bg: '#efe9dd',
          surface: '#e5dfd0',
          accent: '#8a1a1a',
          ink: '#14120f',
        },
        // Token-driven (use these in components)
        theme: {
          bg: 'hsl(var(--bg) / <alpha-value>)',
          surface: 'hsl(var(--surface) / <alpha-value>)',
          'surface-raised': 'hsl(var(--surface-raised, var(--surface)) / <alpha-value>)',
          paper: 'hsl(var(--paper) / <alpha-value>)',
          accent: 'hsl(var(--accent) / <alpha-value>)',
          'accent-soft': 'hsl(var(--accent-soft) / <alpha-value>)',
          'accent-dim': 'hsl(var(--accent-dim, var(--accent)) / <alpha-value>)',
          ink: 'hsl(var(--ink) / <alpha-value>)',
          'ink-muted': 'hsl(var(--ink-muted) / <alpha-value>)',
          'ink-subtle': 'hsl(var(--ink-subtle, var(--ink-muted)) / <alpha-value>)',
          line: 'hsl(var(--line) / <alpha-value>)',
          hairline: 'hsl(var(--hairline, 45 22% 90%) / 0.08)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        code: ['var(--font-code)', 'var(--font-mono)', 'ui-monospace', 'monospace'],
        lore: ['var(--font-lore)', 'var(--font-serif)', 'ui-serif', 'Georgia', 'serif'],
        chaotic: ['var(--font-chaotic)', 'cursive'],
      },
      fontSize: {
        // Utopia-style fluid sizes
        'fluid-h1': ['clamp(4rem, 14vw, 11rem)', { lineHeight: '0.92', letterSpacing: '-0.03em' }],
        'fluid-h2': ['clamp(3rem, 10vw, 9rem)', { lineHeight: '0.9', letterSpacing: '-0.025em' }],
        'fluid-h3': ['clamp(2rem, 4.5vw, 4.5rem)', { lineHeight: '1', letterSpacing: '-0.01em' }],
        'fluid-h4': ['clamp(1.5rem, 3vw, 3rem)', { lineHeight: '1.05' }],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter2: '-0.02em',
      },
      boxShadow: {
        glow: '0 0 40px hsl(var(--accent) / 0.35)',
        'glow-lg': '0 0 80px hsl(var(--accent) / 0.45)',
      },
      transitionTimingFunction: {
        utopia: 'cubic-bezier(.2,.8,.2,1)',
      },
    },
  },
  plugins: [],
};

export default config;
