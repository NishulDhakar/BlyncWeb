export interface BrainGameCardData {
  id: number;
  name: string;
  image: string;
  playLink: string;
  description: string;
  isAvailable: boolean;
  tag?: string;
  iframeUrl: string;
}

export const brainGameCards: BrainGameCardData[] = [
  {
    id: 1,
    name: "Sudoku",
    image: "/games/comingsoon.png",
    playLink: "/play/brain-games/sudoku",
    description: "Fill the 9×9 grid using logic and deduction. A timeless number puzzle that sharpens concentration.",
    isAvailable: true,
    tag: "Logic",
    iframeUrl: "https://lakshyapachkhede.github.io/brain-games/sudoku/index.html",
  },
  {
    id: 2,
    name: "15 Puzzle",
    image: "/games/comingsoon.png",
    playLink: "/play/brain-games/15-puzzle",
    description: "Slide numbered tiles to arrange them in order. Trains spatial reasoning and planning.",
    isAvailable: true,
    tag: "Spatial",
    iframeUrl: "https://lakshyapachkhede.github.io/brain-games/15puzzle/index.html",
  },
  {
    id: 3,
    name: "Minesweeper",
    image: "/games/comingsoon.png",
    playLink: "/play/brain-games/minesweeper",
    description: "Uncover safe cells and flag mines using deductive logic on a grid. Classic analytical thinking.",
    isAvailable: true,
    tag: "Deduction",
    iframeUrl: "https://lakshyapachkhede.github.io/brain-games/minesweeper/index.html",
  },
  {
    id: 4,
    name: "Tic Tac Toe",
    image: "/games/comingsoon.png",
    playLink: "/play/brain-games/tic-tac-toe",
    description: "Play against the computer in this classic strategy game. Think ahead and block your opponent.",
    isAvailable: true,
    tag: "Strategy",
    iframeUrl: "https://lakshyapachkhede.github.io/brain-games/tic_tac_toe/index.html",
  },
  {
    id: 5,
    name: "Snake",
    image: "/games/comingsoon.png",
    playLink: "/play/brain-games/snake",
    description: "Navigate the growing snake to eat food while avoiding collisions. Tests reflexes and spatial awareness.",
    isAvailable: true,
    tag: "Reflex",
    iframeUrl: "https://lakshyapachkhede.github.io/brain-games/snake/index.html",
  },
  {
    id: 6,
    name: "Memory Match Pairs",
    image: "/games/comingsoon.png",
    playLink: "/play/brain-games/memory-match-pairs",
    description: "Flip cards and find matching pairs. Improves short-term memory, focus, and recall speed.",
    isAvailable: true,
    tag: "Memory",
    iframeUrl: "https://lakshyapachkhede.github.io/brain-games/memoryMatchPairs/index.html",
  },
  {
    id: 7,
    name: "Ant Smasher",
    image: "/games/comingsoon.png",
    playLink: "/play/brain-games/ant-smasher",
    description: "Smash the ants before they escape! Test reflexes and hand-eye coordination at speed.",
    isAvailable: true,
    tag: "Reflex",
    iframeUrl: "https://lakshyapachkhede.github.io/brain-games/antSmasher/index.html",
  },
  {
    id: 8,
    name: "Dice Roller",
    image: "/games/comingsoon.png",
    playLink: "/play/brain-games/dice-roller",
    description: "Roll virtual dice for board games, math practice, or probability experiments.",
    isAvailable: true,
    tag: "Fun",
    iframeUrl: "https://lakshyapachkhede.github.io/brain-games/dice/index.html",
  },
];
