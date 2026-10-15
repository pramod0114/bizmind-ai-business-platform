/**
 * BizMind – Slide Animation Engine
 * Comprehensive Framer Motion animation orchestrator for executive presentation decks.
 * Provides choreographed entry animations, directional slide transitions,
 * and component-level micro-interactions.
 */
import React from 'react';
import { motion, AnimatePresence, Variants, Transition } from 'motion/react';

export type AnimationPreset = 'smooth' | 'spring' | 'cinematic';
export type TransitionType = 'slide' | 'fade' | 'zoom' | 'flip';

export interface SlideAnimationEngineProps {
  currentSlide?: number;
  slideKey?: number | string;
  direction: number; // 1 for forward, -1 for backward
  preset?: AnimationPreset;
  transitionType?: TransitionType;
  children: React.ReactNode;
}

// Master Transitions Config - Paced for clear visibility without sluggishness
const getTransitionTiming = (preset: AnimationPreset): Transition => {
  switch (preset) {
    case 'spring':
      return { type: 'spring', stiffness: 180, damping: 22 };
    case 'cinematic':
      return { duration: 0.85, ease: [0.16, 1, 0.3, 1] };
    case 'smooth':
    default:
      return { duration: 0.65, ease: [0.22, 1, 0.36, 1] };
  }
};

// Slide-Level Transitions (Directional)
export const getSlideVariants = (
  transitionType: TransitionType,
  preset: AnimationPreset
): Variants => {
  const timing = getTransitionTiming(preset);

  switch (transitionType) {
    case 'fade':
      return {
        enter: { opacity: 0, scale: 0.97 },
        center: { opacity: 1, scale: 1, transition: timing },
        exit: { opacity: 0, scale: 1.02, transition: { duration: 0.35, ease: 'easeOut' } },
      };
    case 'zoom':
      return {
        enter: (dir: number) => ({
          opacity: 0,
          scale: dir > 0 ? 0.93 : 1.07,
        }),
        center: { opacity: 1, scale: 1, transition: timing },
        exit: (dir: number) => ({
          opacity: 0,
          scale: dir > 0 ? 1.07 : 0.93,
          transition: { duration: 0.35, ease: 'easeIn' },
        }),
      };
    case 'flip':
      return {
        enter: (dir: number) => ({
          opacity: 0,
          rotateY: dir > 0 ? 25 : -25,
          scale: 0.96,
        }),
        center: { opacity: 1, rotateY: 0, scale: 1, transition: timing },
        exit: (dir: number) => ({
          opacity: 0,
          rotateY: dir > 0 ? -25 : 25,
          scale: 0.96,
          transition: { duration: 0.35, ease: 'easeIn' },
        }),
      };
    case 'slide':
    default:
      return {
        enter: (dir: number) => ({
          x: dir > 0 ? 70 : -70,
          opacity: 0,
        }),
        center: {
          x: 0,
          opacity: 1,
          transition: timing,
        },
        exit: (dir: number) => ({
          x: dir > 0 ? -70 : 70,
          opacity: 0,
          transition: { duration: 0.35, ease: [0.32, 0, 0.67, 0] },
        }),
      };
  }
};

// Choreographed Stagger Container with gentle lead-in delay
export const containerStaggerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.18,
    },
  },
};

// Element-Level Entrance Animations - Calibrated so user clearly sees them glide in
export const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export const popScaleVariant: Variants = {
  hidden: { opacity: 0, scale: 0.93, y: 14 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
  },
};

export const slideLeftVariant: Variants = {
  hidden: { opacity: 0, x: -28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export const slideRightVariant: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export const badgeBounceVariant: Variants = {
  hidden: { opacity: 0, scale: 0.82 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 220, damping: 18 },
  },
};

export const chartRevealVariant: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.22 },
  },
};

export const SlideAnimationEngine: React.FC<SlideAnimationEngineProps> = ({
  currentSlide,
  slideKey,
  direction,
  preset = 'smooth',
  transitionType = 'slide',
  children,
}) => {
  const activeKey = currentSlide !== undefined ? currentSlide : (slideKey !== undefined ? slideKey : 0);
  const safeTransitionType: TransitionType = (transitionType ?? 'slide') as TransitionType;
  const safePreset: AnimationPreset = (preset ?? 'smooth') as AnimationPreset;
  const variants = getSlideVariants(safeTransitionType, safePreset);

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={activeKey}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        className="w-full h-full flex flex-col justify-between"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
