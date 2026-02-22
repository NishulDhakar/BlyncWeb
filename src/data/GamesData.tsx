export interface GameCardData {
  id: number;
  name: string;
  image: string;
  rulesLink: string;
  description: string;
  isAvailable?: boolean;
}

export const gameCards: GameCardData[] = [
  {
    id: 1,
    name: "Swich Challenge",
    image: "/switch.png",
    rulesLink: "/play/Switch-challenge",
    description:
      "A fast-paced game where you match color names with their actual displayed colors, testing speed and focus under tricky visual cues.",
    isAvailable: true
  },
  {
    id: 3,
    name: "Digit Challenge",
    image: "/digit.png",
    rulesLink: "/play/Digit-challenge",
    description:
      "A mathematical Operation needs to be solved, by using a few available digits only once. One digit will come only once.",
    isAvailable: true
  },
  {
    id: 2,
    name: "Deductive Challenge",
    image: "/deductive.png",
    rulesLink: "/play/Deductive-challenge",
    description:
      "Mental or logical puzzle that tests deductive reasoning ability, your skill in drawing specific conclusions based on general rules or facts.",
    isAvailable: true
  },
    {
    id: 4,
    name: "Motion Challenge",
    image: "/games/motion.png",
    rulesLink: "/play/Motion-challenge",
    description:
      "A fast-paced memory game where objects move, and you must track their final positions — testing focus, recall, and spatial skills. (Game is not added yet)",
    isAvailable: true
  },

  {
    id: 6,
    name: "Inductive Challenge",
    image: "/games/InductiveChallenge.jpeg",
    rulesLink: "/rules/Inductive-Challenge",
    description:
      "A visual puzzle where you find the next figure in a sequence by spotting hidden patterns — sharpens logical and abstract thinking.",
    isAvailable: false
  },
  {
    id: 5,
    name: "Grid Challenge",
    image: "/games/GridChallenge.jpeg",
    rulesLink: "/rules/Grid-Challenge",
    description:
      "A logic-based game where you sort rows of letters and check if columns stay in order — testing pattern recognition and analytical speed. (Game is not added yet)",
    isAvailable: false
  },
];
