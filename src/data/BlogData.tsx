export interface GameData {
  id: number;
  name: string;
  typeOfQuestions: string;
  duration: string;
  description: string;
  howToPlay: string[];
  playLink: string;
}

export const gamesData: GameData[] = [
      {
    id: 5,
    name: "Switch Challenge",
    typeOfQuestions:
      "Match the displayed color names with their actual colors as quickly as possible",
    duration: "6 mins",
    description:
      "Sequence of geometrical shapes or color names goes through a switch code. The challenge is match the correct output or actual colors, not the misleading text.",
    howToPlay: [
      "You will see color names shown in different font colors.",
      "Click the option that matches the actual color (not the text meaning).",
      "Gain points for correct matches. Wrong selections reduce your score.",
    ],
    playLink: "/play/switch-challenge",
  },
  {
    id: 1,
    name: "Deductive Challenge",
    typeOfQuestions:
      "Find a missing symbol in a 3x3, 4x4, or 5x5 grid based on geometrical Sudoku.",
    duration: "6 mins",
    description:
      "At the beginning of the game, a matrix like 3×3, 4×4, 5×5 etc is displayed with different symbols. You need to complete the grid so that no row or column has repeating symbols.",
    howToPlay: [
      "Time duration is 4 minutes.",
      "Neither a row nor a column should have similar symbols.",
      "One mark is added for each correct attempt and one mark is subtracted for each wrong attempt.",
    ],
    playLink: "/play/deductive-challenge",
  },
  {
    id: 2,
    name: "Inductive Challenge",
    typeOfQuestions:
      "Visual reasoning where you identify the figure that continues a sequence or matches a given rule.",
    duration: "6 mins",
    description:
      "You are shown a sequence of figures that follow a logical pattern. Your task is to pick the figure that best completes the sequence.",
    howToPlay: [
      "Observe the figure sequence carefully.",
      "Identify the logical rule behind the sequence.",
      "Select the figure that best continues the sequence.",
      "The faster and more accurate you are, the better your score.",
    ],
    playLink: "/play/inductive-challenge",
  },
  {
    id: 3,
    name: "Grid Challenge",
    typeOfQuestions:
      "Tests multitasking ability — compare grids and remember positions of coordinates.",
    duration: "6 mins",
    description:
      "Memorize a matrix of characters and determine if the rows remain in non-decreasing order after sorting each row alphabetically.",
    howToPlay: [
      "You will be shown a grid of letters.",
      "Sort each row alphabetically.",
      "Check if the columns are also in alphabetical order from top to bottom.",
      "Select 'YES' or 'NO' based on your answer.",
    ],
    playLink: "/play/grid-challenge",
  },
  {
    id: 4,
    name: "Motion Challenge",
    typeOfQuestions:
      "Plan paths in mazes and track object movements to test short-term memory and planning.",
    duration: "6 mins",
    description:
      "Your planning and spatial memory are tested. Objects or paths move on the screen, and you must recall or find the shortest path.",
    howToPlay: [
      "Objects will move around the screen for a few seconds.",
      "After they stop, recall the position of a specific object.",
      "For path puzzles, find the path in the maze using the fewest steps.",
      "Answer accurately and quickly to earn a higher score.",
    ],
    playLink: "/play/motion-challenge",
  },
  {
    id: 6,
    name: "Digit Challenge",
    typeOfQuestions:
      "Solve mathematical operations using given digits only once.",
    duration: "6 mins",
    description:
      "A mathematical operation is given, and you must solve it using limited available digits, each used only once.",
    howToPlay: [
      "Use the available digits strategically.",
      "Each digit can be used only once.",
      "Perform the calculation to arrive at the correct answer.",
    ],
    playLink: "/play/digit-challenge",
  },
];
