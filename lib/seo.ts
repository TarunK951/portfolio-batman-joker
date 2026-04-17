export const SITE = {
  name: 'Satya Tarun K',
  alias: 'satyatarun',
  alternateNames: ['Satya Tarun', 'satyatarun', 'Satya Tarun K'],
  email: 'satyatarun.951@gmail.com',
  url: 'https://satyatarun.vercel.app',
  locale: 'en_US',
  locality: 'Hyderabad',
  country: 'IN',
  jobTitle: 'Creative Developer',
  // Social profiles. Fill in as they go live — schema/sameAs uses these.
  socials: {
    github: 'https://github.com/satyatarun',
    // TODO: set to real LinkedIn URL (e.g. https://www.linkedin.com/in/satyatarun)
    linkedin: '' as string,
    // TODO: set to real Twitter/X URL (e.g. https://twitter.com/satyatarun)
    twitter: '' as string,
  },
} as const;

export type SiteConfig = typeof SITE;
