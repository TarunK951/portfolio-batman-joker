# Satya Tarun K — Batman × Joker Portfolio

Dual-theme personal portfolio by **Satya Tarun K** (`satyatarun`).
Batman (dark red, order) × Joker (toxic green, chaos) — toggle the mask.

## Stack

- Next.js 14 (App Router) + TypeScript (strict)
- Tailwind CSS with CSS-variable driven theming
- Three.js + React Three Fiber + drei
- GSAP + ScrollTrigger
- Framer Motion
- Deployed on Vercel

## Develop

```bash
npm install
npm run dev
```

App runs at <http://localhost:3000>.

## Scripts

| Command             | Description                               |
| ------------------- | ----------------------------------------- |
| `npm run dev`       | Dev server with hot reload                |
| `npm run build`     | Production build                          |
| `npm run start`     | Serve the production build                |
| `npm run lint`      | ESLint (`next/core-web-vitals`)           |
| `npm run typecheck` | `tsc --noEmit` (strict)                   |

## Deployment

Push to the branch connected in Vercel — Next.js is auto-detected, no `vercel.json` required. Update the production URL in `lib/seo.ts` once the domain is assigned so metadata, sitemap, and JSON-LD stay accurate.

## Contact

**Satya Tarun K** — [satyatarun.951@gmail.com](mailto:satyatarun.951@gmail.com)
