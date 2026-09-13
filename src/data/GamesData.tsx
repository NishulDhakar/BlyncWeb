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
      "Deduce the hidden operator that transforms the input row of symbols into the target output sequence.",
    isAvailable: true,
    isPremium: false,
  },
  {
    id: 3,
    name: "Digit Challenge",
    image: "/games/cognitive.png",
    rulesLink: "/play/digit-challenge",
    description:
      "Solve rapid mental math equations using given single digits under strict time constraints.",
    isAvailable: true,
    isPremium: false,
  },
  {
    id: 2,
    name: "Deductive Challenge",
    image: "/games/cognitive.png",
    rulesLink: "/play/deductive-challenge",
    description:
      "Apply Latin square constraints to deduce missing symbols in a grid without repeating rows or columns.",
    isAvailable: true,
    isPremium: false,
  },
  {
    id: 4,
    name: "Motion Challenge",
    image: "/games/cognitive.png",
    rulesLink: "/play/motion-challenge",
    description:
      "Slide blocking obstacles to clear a path for the key ball to reach the target exit in minimal moves.",
    isAvailable: true,
    isPremium: false,
  },
  {
    id: 6,
    name: "Inductive Challenge",
    image: "/games/cognitive.png",
    rulesLink: "/play/inductive-challenge",
    description:
      "Identify the hidden geometric transformation rule between paired diagrams to pick the matching pair.",
    isAvailable: true,
    isPremium: false,
  },
  {
    id: 5,
    name: "Grid Challenge",
    image: "/games/cognitive.png",
    rulesLink: "/play/grid-challenge",
    description:
      "Dual-task working memory challenge: memorize dot coordinates while evaluating grid symmetry under clock pressure.",
    isAvailable: true,
    isPremium: false,
  },
];
