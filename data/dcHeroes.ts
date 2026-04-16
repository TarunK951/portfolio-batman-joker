export interface DCCharacter {
  id: string
  name: string
  realName: string
  title: string
  skillMapped: string
  bio: string
  stats: Record<string, number>
}

export const dcHeroes: readonly DCCharacter[] = [
  {
    id: 'batman',
    name: 'Batman',
    realName: 'Bruce Wayne',
    title: 'The Dark Knight',
    skillMapped: 'UI/UX Design',
    bio: "The world's greatest detective. No powers — only preparation, intelligence, and unbreakable will.",
    stats: {
      INTELLIGENCE: 95,
      COMBAT: 97,
      STEALTH: 99,
      WILLPOWER: 98,
      STRATEGY: 96,
      ENDURANCE: 88,
    },
  },
  {
    id: 'superman',
    name: 'Superman',
    realName: 'Clark Kent',
    title: 'Man of Steel',
    skillMapped: 'Frontend Development',
    bio: 'Near-unlimited power, defined by the discipline to use it wisely.',
    stats: {
      STRENGTH: 100,
      SPEED: 96,
      DURABILITY: 100,
      HEAT_VISION: 95,
      FLIGHT: 98,
      LEADERSHIP: 90,
    },
  },
  {
    id: 'wonder-woman',
    name: 'Wonder Woman',
    realName: 'Diana Prince',
    title: 'Princess of Themyscira',
    skillMapped: 'Product Strategy',
    bio: 'Ancient wisdom meets modern strength. She fights not to destroy, but to protect truth.',
    stats: {
      COMBAT: 98,
      WISDOM: 97,
      STRENGTH: 95,
      SPEED: 92,
      LEADERSHIP: 96,
      COURAGE: 99,
    },
  },
  {
    id: 'flash',
    name: 'The Flash',
    realName: 'Barry Allen',
    title: 'The Scarlet Speedster',
    skillMapped: 'Delivery & Performance',
    bio: 'Speed is useless without precision. He has both.',
    stats: {
      SPEED: 100,
      AGILITY: 98,
      REFLEXES: 100,
      TIME_TRAVEL: 85,
      PHASING: 90,
      INTELLIGENCE: 80,
    },
  },
  {
    id: 'green-lantern',
    name: 'Green Lantern',
    realName: 'Hal Jordan',
    title: 'Emerald Knight',
    skillMapped: 'Creative Problem Solving',
    bio: 'Willpower made manifest. Whatever he imagines, he creates.',
    stats: {
      WILLPOWER: 100,
      CONSTRUCTS: 97,
      COURAGE: 95,
      SPACE_COMBAT: 92,
      FLIGHT: 90,
      INTELLIGENCE: 82,
    },
  },
  {
    id: 'aquaman',
    name: 'Aquaman',
    realName: 'Arthur Curry',
    title: 'King of Atlantis',
    skillMapped: 'Full-Stack Adaptability',
    bio: 'Master of two worlds. Equally at home in chaos as in command.',
    stats: {
      STRENGTH: 92,
      ENDURANCE: 98,
      TELEPATHY: 85,
      TRIDENT: 97,
      LEADERSHIP: 90,
      COMBAT: 88,
    },
  },
  {
    id: 'cyborg',
    name: 'Cyborg',
    realName: 'Victor Stone',
    title: 'The Man Machine',
    skillMapped: 'Technical Integration',
    bio: 'Half human, half machine — wholly driven. Tech is only as powerful as its operator.',
    stats: {
      INTELLIGENCE: 94,
      TECH_INTERFACE: 100,
      HACKING: 98,
      STRENGTH: 82,
      BOOM_TUBE: 95,
      DURABILITY: 85,
    },
  },
  {
    id: 'nightwing',
    name: 'Nightwing',
    realName: 'Dick Grayson',
    title: 'The First Robin',
    skillMapped: 'Leadership & Mentorship',
    bio: "Stepped out of the Bat's shadow and built something greater.",
    stats: {
      ACROBATICS: 100,
      COMBAT: 94,
      AGILITY: 98,
      STEALTH: 90,
      LEADERSHIP: 88,
      INTELLIGENCE: 85,
    },
  },
]
