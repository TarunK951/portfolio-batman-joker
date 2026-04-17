// ============================================================
// Ancient-India narrative copy map.
// Consumed by section components to populate the Mahabharata/
// dharma-themed variant of the site. Crawlable English prose
// with elegant Devanagari accents — never cheesy.
// ============================================================

export const ancientIndiaCopy = {
  hero: {
    eyebrow: 'कुरुक्षेत्रम् — the field of dharma',
    headline: 'Between two armies, a choice becomes',
    accentWord: 'धर्म',
    bio: "I build software the way the Gita asks us to act — with full effort and no attachment to the outcome. Interfaces, systems, and stories, engineered as if every line of code were an arrow loosed from the Gandiva.",
    ctaLabel: 'Enter the field',
  },
  loading: {
    eyebrow: 'ॐ · saṅkalpa',
    tagline: 'Gathering the eighteen parvas…',
  },
  projects: {
    title: 'The Parvas',
    intro: "Eighteen chapters, eighteen days of war, and however many projects a lifetime allows. Each one a small dharma-yuddha — chosen with care, fought with focus, finished with offering.",
  },
  about: {
    lead: 'Karmaṇyevādhikāraste mā phaleṣu kadācana.',
    tail: "Act, and leave the fruit to the work. That verse has structured more of my engineering than any framework has.",
    bio: "I\'m Satya Tarun K — an engineer, designer and quiet student of old stories. I write code the way a kshatriya draws a bow: precisely, responsibly, and with an eye on the field beyond the target. The work here is my offering.",
  },
  contact: {
    heading: 'Send a message across the field',
    body: "If there is a project, a collaboration, or a riddle worth an arrow, write. I read every letter and answer most of them — स्वागतम्.",
  },
  footer: {
    wordmark: 'Satya Tarun K · सत्य तरुण',
    locale: 'Bhārata · भारत',
  },
  notFound: {
    eyebrow: '404 — mārga-bhraṣṭa',
    body: 'This path has slipped from the map. Even Arjuna lost his way in the Chakravyuha — try the homepage and choose a truer arrow.',
    cta: 'Return to the field',
  },
  dcGrid: {
    eyebrow: 'महाभारत',
    headline: 'The warriors of Kurukshetra',
    subtitle: "Eighteen days, eighteen akshauhinis, and the souls who shaped every hour of them. Choose a figure — hear their story in their own words.",
  },
} as const

export type AncientIndiaCopy = typeof ancientIndiaCopy
