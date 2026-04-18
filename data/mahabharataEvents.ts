// ============================================================
// Mahabharata — Event paintings dataset for the Ancient-India
// theme. Images sourced from Wikimedia Commons (public domain,
// Raja Ravi Varma and other 18th–19th century paintings).
// ============================================================

export interface MahabharataEvent {
  id: string;
  title: string;
  hindi: string;
  caption: string;
  image: string;
}

export const mahabharataEvents: readonly MahabharataEvent[] = [
  {
    id: 'kurukshetra',
    title: 'The Chariot on the Battlefield',
    hindi: 'कुरुक्षेत्रम्',
    caption:
      "Krishna's counsel to Arjuna — the Gita unfolds between two armies.",
    image: '/mahabharata/events/krishna-arjuna.jpg',
  },
  {
    id: 'vastraharan',
    title: "Draupadi's Honour",
    hindi: 'वस्त्रहरण',
    caption:
      "Panchali staked at dice — and Krishna's unseen cloth, endless.",
    image: '/mahabharata/events/draupadi-vastraharan.jpg',
  },
  {
    id: 'shantanu',
    title: 'Shantanu and Satyavati',
    hindi: 'शन्तनु',
    caption:
      "A king's love, a ferryman's daughter — the vow that shaped a dynasty.",
    image: '/mahabharata/events/shantanu-satyavati.jpg',
  },
  {
    id: 'damayanti',
    title: 'Damayanti and the Swan',
    hindi: 'दमयन्ती',
    caption:
      "A royal swan bears word of Nala — the secret flight of a princess's heart.",
    image: '/mahabharata/events/damayanti-swan.jpg',
  },
  {
    id: 'subhadra',
    title: 'Arjuna and Subhadra',
    hindi: 'सुभद्राहरण',
    caption:
      "At Krishna's quiet signal, Arjuna carries Subhadra from Dvaraka.",
    image: '/mahabharata/events/arjuna-subhadra.jpg',
  },
  {
    id: 'shakuntala',
    title: 'Shakuntala',
    hindi: 'शकुन्तला',
    caption:
      "The mother of Bharata — remembered through a ring, lost and restored.",
    image: '/mahabharata/events/shakuntala.jpg',
  },
];
