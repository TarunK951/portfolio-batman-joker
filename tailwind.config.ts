import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        batman: {
          bg: '#0a0a0a',
          surface: '#141414',
          accent: '#b00020',
          ink: '#e8e8e8',
        },
        joker: {
          bg: '#070a07',
          surface: '#12180f',
          accent: '#39ff14',
          ink: '#e8ffe8',
        },
        theme: {
          bg: 'hsl(var(--bg) / <alpha-value>)',
          surface: 'hsl(var(--surface) / <alpha-value>)',
          accent: 'hsl(var(--accent) / <alpha-value>)',
          ink: 'hsl(var(--ink) / <alpha-value>)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px hsl(var(--accent) / 0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
