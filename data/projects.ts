export interface Project {
  id: string
  name: string
  batmanName: string
  jokerName: string
  type: string
  description: string
  stack: string[]
  status: 'live' | 'development' | 'this-site' | 'coming-soon'
  link?: string
}

export const projects: readonly Project[] = [
  {
    id: 'nyraai',
    name: 'NyraAI Dashboard',
    batmanName: 'Case File #001',
    jokerName: 'Heist #001',
    type: 'AI Healthcare Platform',
    description:
      'Production-grade patient management dashboard with AI-powered insights, real-time analytics, and role-based access. Built for clinical teams.',
    stack: ['Next.js 14', 'Tailwind', 'TypeScript', 'Supabase'],
    status: 'live',
  },
  {
    id: 'growcircle',
    name: 'GrowCircle',
    batmanName: 'Case File #002',
    jokerName: 'Heist #002',
    type: 'Community Platform',
    description:
      'A growth-focused community platform connecting early-stage founders with mentors, resources, and peer accountability groups.',
    stack: ['Next.js', 'Tailwind', 'Supabase', 'TypeScript'],
    status: 'development',
  },
  {
    id: 'portfolio',
    name: 'Batman \u00d7 Joker Portfolio',
    batmanName: 'Case File #003',
    jokerName: 'Heist #003',
    type: 'Interactive Portfolio',
    description:
      'This very site. A dual-theme interactive experience built with Three.js, GSAP, and Next.js. The most ambitious personal project.',
    stack: ['Next.js', 'Three.js', 'GSAP', 'Framer Motion'],
    status: 'this-site',
  },
  {
    id: 'classified',
    name: 'Classified',
    batmanName: 'Case File #004',
    jokerName: 'Heist #004',
    type: 'UI/UX Case Study',
    description:
      'Coming soon — a product design case study showcasing end-to-end design process from wireframes to production.',
    stack: ['Figma', 'Next.js', 'Tailwind'],
    status: 'coming-soon',
  },
]
