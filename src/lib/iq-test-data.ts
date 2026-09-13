
export type Category = 'pattern' | 'sequence' | 'spatial' | 'memory' | 'logic';

export interface Question {
    id: number;
    type: Category;
    difficulty: 1 | 2 | 3 | 4 | 5;
    question: string;
    image?: string; // Optional URL for visual questions
    options: string[]; // URLs for image options or text for text options
    correctAnswer: number; // Index of the correct option
    timeLimit?: number; // Optional specific time limit per question (if not global)
    memoryViewTime?: number; // For memory tasks: how long to show the initial pattern
}

export const iqTestQuestions: Question[] = [
    // --- Pattern Recognition (6 Qs) ---
    {
        id: 1,
        type: 'pattern',
        difficulty: 1,
        question: 'Select the missing tile to complete the pattern.',
        // In a real app, these would be image URLs. Using placeholders for dev.
        image: '/iq-test/pattern-1-main.svg',
        options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
        correctAnswer: 2,
    },
    {
        id: 2,
        type: 'pattern',
        difficulty: 2,
        question: 'Which shape logically follows this series?',
        image: '/iq-test/pattern-2-main.svg',
        options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
        correctAnswer: 4,
    },
    {
        id: 3,
        type: 'pattern',
        difficulty: 3,
        question: 'Find the missing piece of the matrix.',
        image: '/iq-test/pattern-3-main.svg',
        options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
        correctAnswer: 0,
    },
    {
        id: 4,
        type: 'pattern',
        difficulty: 4,
        question: 'Complete the grid logic.',
        image: '/iq-test/pattern-4-main.svg',
        options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
        correctAnswer: 7,
    },
    {
        id: 5,
        type: 'pattern',
        difficulty: 5,
        question: 'Select the correct missing component.',
        image: '/iq-test/pattern-5-main.svg',
        options: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
        correctAnswer: 3,
    },


    // --- Sequence Completion (4 Qs) ---
    {
        id: 6,
        type: 'sequence',
        difficulty: 2,
        question: 'Which number completes the sequence: 2, 4, 8, 16, ...?',
        options: ['30', '32', '24', '64'],
        correctAnswer: 1,
    },
    {
        id: 7,
        type: 'sequence',
        difficulty: 3,
        question: 'What comes next: 1, 1, 2, 3, 5, 8, ...?',
        options: ['11', '12', '13', '21'],
        correctAnswer: 2,
    },
    {
        id: 8,
        type: 'sequence',
        difficulty: 4,
        question: 'Select the shape that continues the sequence.',
        image: '/iq-test/sequence-1-main.svg',
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 0,
    },
    {
        id: 9,
        type: 'sequence',
        difficulty: 5,
        question: 'Find the next logical item.',
        image: '/iq-test/sequence-2-main.svg',
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 2,
    },

    // --- Spatial Reasoning (4 Qs) ---
    {
        id: 10,
        type: 'spatial',
        difficulty: 2,
        question: 'Which of the cubes below could be made from this unfolded pattern?',
        image: '/iq-test/spatial-1-main.svg',
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 1,
    },
    {
        id: 11,
        type: 'spatial',
        difficulty: 3,
        question: 'If you rotate the shape on the left 90 degrees clockwise, which shape would you get?',
        image: '/iq-test/spatial-2-main.svg',
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 3,
    },
    {
        id: 12,
        type: 'spatial',
        difficulty: 4,
        question: 'Identify the odd one out based on 3D rotation.',
        image: '/iq-test/spatial-3-main.svg',
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 0,
    },
    {
        id: 13,
        type: 'spatial',
        difficulty: 5,
        question: 'Which shape results from overlapping the first two?',
        image: '/iq-test/spatial-4-main.svg',
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 1,
    },


    // --- Memory Recall (4 Qs) ---
    {
        id: 14,
        type: 'memory',
        difficulty: 2,
        question: 'Memorize the highlighted tiles.',
        image: '/iq-test/memory-1-main.svg',
        options: ['Grid A', 'Grid B', 'Grid C', 'Grid D'],
        correctAnswer: 0,
        memoryViewTime: 3,
    },
    {
        id: 15,
        type: 'memory',
        difficulty: 3,
        question: 'Remember the sequence of colors.',
        image: '/iq-test/memory-2-main.svg',
        options: ['R-G-B', 'G-B-R', 'B-R-G', 'R-B-G'],
        correctAnswer: 3,
        memoryViewTime: 4,
    },
    {
        id: 16,
        type: 'memory',
        difficulty: 4,
        question: 'Memorize the positions of the symbols.',
        image: '/iq-test/memory-3-main.svg',
        options: ['Pos A', 'Pos B', 'Pos C', 'Pos D'],
        correctAnswer: 1,
        memoryViewTime: 5,
    },
    {
        id: 17,
        type: 'memory',
        difficulty: 5,
        question: 'Which item was NOT present in the previous image?',
        image: '/iq-test/memory-4-main.svg',
        options: ['Triangle', 'Square', 'Circle', 'Star'],
        correctAnswer: 3,
        memoryViewTime: 3,
    },

    // --- Logic (2 Qs) ---
    {
        id: 18,
        type: 'logic',
        difficulty: 3,
        question: 'All Bloops are Razzies. Some Razzies are Zazz. Therefore...',
        options: ['All Bloops are Zazz', 'Some Zazz are Bloops', 'No Bloops are Zazz', 'None of the above follows'],
        correctAnswer: 3,
    },
    {
        id: 19,
        type: 'logic',
        difficulty: 4,
        question: 'If Gear A turns clockwise, which way does Gear D turn?',
        image: '/iq-test/logic-1-main.svg',
        options: ['Clockwise', 'Counter-clockwise', 'Stays still', 'Oscillates'],
        correctAnswer: 1,
    }
];

export const calculateIQ = (rawScore: number, totalTime: number) => {
    // A simplified mock IQ calculation
    // Base IQ 100
    // +2 for every correct answer * difficulty modifier?
    // - penalty for slow time?

    // This is just a placeholder logic.
    const base = 70; // Minimum
    const scoreComponent = rawScore * 2.5; // Max 20 * 5 * 2 = 200.. let's normalize
    // Let's say max possible raw score (if we sum weighted difficulties) is approx 70.
    // 20 Qs, avg diff 3 = 60 points max.

    // Normalization: (Score / MaxScore) * 70 + Base + TimeBonus
    // For now returning a dummy calculation suitable for dev
    return Math.min(145, Math.max(70, Math.round(base + scoreComponent)));
}
