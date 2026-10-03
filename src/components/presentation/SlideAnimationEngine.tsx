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
  currentSlide: number;
  direction: number; // 1 for forward, -1 for backward
  preset?: AnimationPreset;
  transitionType?: TransitionType;
  children: React.ReactNode;
}

// Master Transitions Config
const getTransitionTiming = (preset: AnimationPreset): Transition => {
  switch (preset) {
    case 'spring':
      return { type: 'spring', stiffness: 260, damping: 22 };
    case 'cinematic':
      return { duration: 0.7, ease: [0.16, 1, 0.3, 1] };
    case 'smooth':
    default:
      return { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] };
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
        enter: { opacity: 0, scale: 0.98 },
        center: { opacity: 1, scale: 1, transition: timing },
        exit: { opacity: 0, scale: 1.02, transition: { duration: 0.25 } },
      };
    case 'zoom':
      return {
        enter: (dir: number) => ({
          opacity: 0,
          scale: dir > 0 ? 0.92 : 1.08,
        }),
        center: { opacity: 1, scale: 1, transition: timing },
        exit: (dir: number) => ({
          opacity: 0,
          scale: dir > 0 ? 1.08 : 0.92,
          transition: { duration: 0.25 },
        }),
      };
    case 'flip':
      return {
        enter: (dir: number) => ({
          opacity: 0,
          rotateY: dir > 0 ? 30 : -30,
          scale: 0.95,
        }),
        center: { opacity: 1, rotateY: 0, scale: 1, transition: timing },
        exit: (dir: number) => ({
          opacity: 0,
          rotateY: dir > 0 ? -30 : 30,
          scale: 0.95,
          transition: { duration: 0.25 },
        }),
      };
    case 'slide':
    default:
      return {
        enter: (dir: number) => ({
          x: dir > 0 ? 80 : -80,
          opacity: 0,
        }),
        center: {
          x: 0,
          opacity: 1,
          transition: timing,
        },
        exit: (dir: number) => ({
          x: dir > 0 ? -80 : 80,
          opacity: 0,
          transition: { duration: 0.25 },
        }),
      };
  }
};

// Choreographed Stagger Container
export const containerStaggerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// Element-Level Entrance Animations
export const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export const popScaleVariant: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

export const slideLeftVariant: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export const slideRightVariant: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export const badgeBounceVariant: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 18 },
  },
};

export const chartRevealVariant: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 },
  },
};

export const SlideAnimationEngine: React.FC<SlideAnimationEngineProps> = ({
  currentSlide,
  direction,
  preset = 'smooth',
  transitionType = 'slide',
  children,
}) => {
  const safeTransitionType: TransitionType = (transitionType ?? 'slide') as TransitionType;
  const safePreset: AnimationPreset = (preset ?? 'smooth') as AnimationPreset;
  const variants = getSlideVariants(safeTransitionType, safePreset);

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={currentSlide}
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
