import dynamic from 'next/dynamic';

/**
 * Centralized dynamic imports for heavy components
 * This improves initial bundle size and code splitting
 */

// Game UI Components (lazy loaded)
export const DigitGameUI = dynamic(() => import('@/components/games/DigitGameUI'), {
    loading: () => <div className="flex items-center justify-center p-8"> Loading game...</div>,
});

export const SwitchChallengeUI = dynamic(() => import('@/components/games/SwitchChallengeUI'), {
    loading: () => <div className="flex items-center justify-center p-8"> Loading game...</div>,
});

export const DeductiveChallengeUI = dynamic(() => import('@/components/games/DeductiveChallengeUI'), {
    loading: () => <div className="flex items-center justify-center p-8"> Loading game...</div>,
});

export const InductiveChallengeUI = dynamic(() => import('@/components/games/InductiveChallengeUI'), {
    loading: () => <div className="flex items-center justify-center p-8"> Loading game...</div>,
});

export const GridChallengeUI = dynamic(() => import('@/components/games/GridChallengeUI'), {
    loading: () => <div className="flex items-center justify-center p-8"> Loading game...</div>,
});
