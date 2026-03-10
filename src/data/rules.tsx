import { RuleData } from "@/components/common/RulePage";


export const deductiveChallengeRules: RuleData = {
  title: "Deductive Challenge",
  description:
    "At the beginning of the game, a matrix like 3×3, 4×4, 5×5 etc is displayed on the screen with different symbols without a picturesque manner. To make it a picturesque matrix, you have to select appropriate symbols from the options given below the matrix.",
  howToPlay: [
    "Time duration is 4 minutes.",
    "Neither a row nor a column should have similar symbols.",
    "One mark is added for each correct attempt and one mark is subtracted for each wrong attempt.",
  ],
  playLink: "/play/deductive-challenge",
};

export const SwitchChallengeRules: RuleData = {
  title: "Switch Challenge",
  description:
    "Match the displayed color names with their actual colors as quickly as possible. Be alert — the text and color may differ to trick your mind.",
  howToPlay: [
    "You will see color names shown in various font colors.",
    "Click the box that matches the actual color (not the text meaning).",
    "Gain points for correct matches. Wrong selections will reduce your score.",
  ],
  Solution: "/Switchchallenge-solution.png",
  playLink: "/play/switch-challenge",
};

export const DigitChallengeRules: RuleData = {
  title: "Digit Challenge",
  description:
    "Match the displayed color names with their actual colors as quickly as possible. Be alert — the text and color may differ to trick your mind.",
  howToPlay: [
    "You will be given a mathematical operation to solve.",
    "Use the available digits shown on the screen to form your answer.",
    "Each digit can be used only once; no digit will repeat.",
    "Correct answers earn you points, while wrong answers reduce your score.",
    "Try to solve as many as possible before the timer runs out."
  ],
  playLink: "/play/digit-challenge",
};

export const gridChallengeRules: RuleData = {
  title: "Grid Challenge",
  description:
    "Memorize a matrix of characters and determine if the rows remain in non-decreasing order after sorting each row alphabetically.",
  howToPlay: [
    "You will be shown a grid of letters.",
    "Sort each row alphabetically.",
    "Check if the columns are also in alphabetical order from top to bottom.",
    "Select 'YES' or 'NO' based on your answer.",
  ],
  playLink: "/play/grid-challenge",
};

export const inductiveChallengeRules: RuleData = {
  title: "Inductive Challenge",
  description:
    "Identify patterns in sequences of figures and determine the next figure that completes the sequence logically.",
  howToPlay: [
    "You will be shown a sequence of figures following a pattern.",
    "Choose the figure that best continues the sequence.",
    "The faster and more accurate you are, the better your score.",
  ],
  playLink: "/play/inductive-challenge",
};

export const motionChallengeRules: RuleData = {
  title: "Motion Challenge",
  description:
    "Track the movement of objects and identify their final positions. Tests your short-term memory and spatial tracking.",
  howToPlay: [
    "Objects will move around the screen for a few seconds.",
    "After they stop, you need to recall the position of a specific object.",
    "Answer accurately and quickly to earn a higher score.",
  ],
  playLink: "/play/motion-challenge",
};
