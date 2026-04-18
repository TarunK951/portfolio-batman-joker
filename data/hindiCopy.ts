// Maps English phrases used as eyebrows/labels in the ancient-india theme
// to their Devanagari equivalents. Used by UI to render `EN · HI` pairs.
export const hindiCopy = {
  intro: 'प्रस्तावना',
  arrival: 'आगमन',
  journey: 'यात्रा',
  roster: 'पात्र',
  work: 'कर्म',
  signal: 'संदेश',
  contact: 'संपर्क',
  about: 'परिचय',
  projects: 'रचनाएँ',
  skills: 'कौशल',
  timeline: 'कालक्रम',
  chapters: 'अध्याय',
  mythos: 'पुराण',
  selected: 'चयनित',
  flow: 'प्रवाह',
  locale: 'स्थान',
  index: 'सूची',
  elsewhere: 'अन्यत्र',
} as const;

export type HindiCopyKey = keyof typeof hindiCopy;
