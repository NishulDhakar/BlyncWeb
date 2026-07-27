export interface GameCardData {
  id: number;
  name: string;
  image: string;
  rulesLink: string;
  description: string;
  isAvailable?: boolean;
  isPremium?: boolean;
}

export const gameCards: GameCardData[] = [
  {
    id: 1,
    name: "Switch Challenge",
    image: "/games/cognitive.png",
    rulesLink: "/play/switch-challenge",
    description:
      "A fast-paced game where you match color names with their actual displayed colors, testing speed and focus under tricky visual cues.",
    isAvailable: true,
    isPremium: true,
  },
  {
    id: 3,
    name: "Digit Challenge",
    image: "/games/cognitive.png",
    rulesLink: "/play/digit-challenge",
    description:
      "A mathematical operation where you must find the correct answer using only the given digits, each used exactly once.",
    isAvailable: true,
    isPremium: true,
  },
  {
    id: 2,
    name: "Deductive Challenge",
    image: "/games/cognitive.png",
    rulesLink: "/play/deductive-challenge",
    description:
      "A logical puzzle that tests deductive reasoning — draw specific conclusions from general rules using a Sudoku-style symbol grid.",
    isAvailable: true,
    isPremium: true,
  },
  {
    id: 4,
    name: "Motion Challenge",
    image: "/games/cognitive.png",
    rulesLink: "/play/motion-challenge",
    description:
      "Objects move across the screen and you must track their final positions — testing focus, recall, and spatial reasoning.",
    isAvailable: true,
    isPremium: true,
  },
  {
    id: 6,
    name: "Inductive Challenge",
    image: "/games/cognitive.png",
    rulesLink: "/play/inductive-challenge",
    description:
      "A visual puzzle where you identify the next figure in a sequence by spotting hidden patterns — sharpens abstract thinking.",
    isAvailable: true,
    isPremium: true,
  },
  {
    id: 5,
    name: "Grid Challenge",
    image: "/games/cognitive.png",
    rulesLink: "/play/grid-challenge",
    description:
      "Memorize blinking dot positions, solve symmetry pattern puzzles, then recall the exact sequence — tests memory, attention, and spatial reasoning.",
    isAvailable: true,
    isPremium: true,
  },
];
