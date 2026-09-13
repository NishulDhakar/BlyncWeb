import { RuleData } from "@/components/common/RulePage";

export const deductiveChallengeRules: RuleData = {
  title: "Deductive Challenge",
  description:
    "Test your deductive logic with a Sudoku-style symbol puzzle (Latin square). Each grid contains unique geometric symbols where no symbol can repeat within any row or column. Deduce which symbol belongs in the question mark cell.",
  howToPlay: [
    "You have roughly 4 minutes to solve as many grids as possible.",
    "Examine rows and columns containing the target cell to eliminate existing symbols.",
    "No symbol may appear more than once in any row or column.",
    "Select the only possible remaining symbol from the options below.",
    "Maintain high accuracy: incorrect answers penalize your overall efficiency score.",
  ],
  playLink: "/play/deductive-challenge",
};

export const SwitchChallengeRules: RuleData = {
  title: "Switch Challenge",
  description:
    "Analyze an input row of 4 symbols and an output row that has been rearranged by an operator. Deduce the correct numeric operator (e.g., 3241) that describes how the symbols shifted position.",
  howToPlay: [
    "Compare the input sequence of four symbols with the target output sequence.",
    "Each 4-digit operator indicates which input position moves to each output slot (e.g., '3241' moves the 3rd symbol to slot 1, 2nd to slot 2, 4th to slot 3, and 1st to slot 4).",
    "On advanced levels, two stacked operators transform the symbols sequentially.",
    "Quickly eliminate wrong operators by checking just one unique symbol position first.",
    "You have ~20 seconds per puzzle with ~3 minutes total round duration.",
  ],
  Solution: "/Switchchallenge-solution.png",
  playLink: "/play/switch-challenge",
};

export const DigitChallengeRules: RuleData = {
  title: "Digit Challenge",
  description:
    "Fast-paced quantitative agility drill. Construct target mathematical values or complete arithmetic equations using single-digit numbers under tight time limits.",
  howToPlay: [
    "Observe the target equation and the target result shown on screen.",
    "Select the required digits and operators from the available pool to balance the equation.",
    "Each digit can only be used once per equation.",
    "Calculate mentally with speed: practice mental arithmetic shortcuts to save precious seconds.",
    "Score points for every correct equation solved before the round timer expires.",
  ],
  playLink: "/play/digit-challenge",
};

export const gridChallengeRules: RuleData = {
  title: "Grid Challenge",
  description:
    "A dual-task working memory test. Memorize the sequential positions of highlighted dots across a grid while answering alternating spatial symmetry questions under strict timing.",
  howToPlay: [
    "A dot briefly blinks on a coordinate within the grid — memorize its location.",
    "An intermediate task appears (such as evaluating whether a geometric figure is vertically symmetrical). Answer quickly.",
    "Another dot position is revealed, followed by another symmetry check.",
    "At the end of the round, recall and tap the dot positions in the exact order they appeared.",
    "Accuracy in both the dot recall and the symmetry checks contributes to your final working memory score.",
  ],
  playLink: "/play/grid-challenge",
};

export const inductiveChallengeRules: RuleData = {
  title: "Inductive Challenge",
  description:
    "Evaluate abstract geometric diagrams to discover the underlying transformation rule. Identify which figure or pair of figures logically satisfies the derived rule.",
  howToPlay: [
    "Examine the top set of paired diagrams to understand the relationship (rotation, shading, count, inversion, or scale).",
    "Formulate an inductive rule that applies universally to the valid diagrams.",
    "Compare the question diagram against your rule to determine the missing pair or figure.",
    "Eliminate options that violate even a single geometric constraint.",
    "Focus on rule consistency across shape count, orientation, and color fills.",
  ],
  playLink: "/play/inductive-challenge",
};

export const motionChallengeRules: RuleData = {
  title: "Motion Challenge",
  description:
    "A spatial planning and problem-solving puzzle. Slide obstacles across a restricted grid to clear an unobstructed path for the main ball to reach the target exit hole in the minimum number of moves.",
  howToPlay: [
    "Analyze the maze configuration to identify which blocks are impeding the main ball's route.",
    "Slide vertical blocks up/down and horizontal blocks left/right to free up space.",
    "Plan your move sequence mentally before sliding to achieve the optimal path.",
    "Fewer moves equate to a higher efficiency rating and placement score.",
    "Complete the exit maneuvers swiftly before the round timer runs out.",
  ],
  playLink: "/play/motion-challenge",
};
