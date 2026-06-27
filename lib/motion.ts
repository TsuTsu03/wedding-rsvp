import type { Variants, Transition } from "framer-motion";

// Shared motion vocabulary. One set of curves, used everywhere, so the whole
// site moves with a single voice (emil-design-eng: cohesion).

export const easeOut = [0.23, 1, 0.32, 1] as const;
export const easeInOut = [0.77, 0, 0.175, 1] as const;
export const easeDrawer = [0.32, 0.72, 0, 1] as const;

// Tactile spring for things that should feel "alive" (seats, the envelope flap).
export const tactileSpring: Transition = {
  type: "spring",
  duration: 0.5,
  bounce: 0.2,
};

// Scroll reveal: nothing appears from nothing - start at 0.96/translateY.
export const reveal: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOut },
  },
};

// Stagger container - 50ms between children (emil: 30-80ms).
export const stagger = (delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05, delayChildren },
  },
});

export const revealChild: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut },
  },
};

// In-view defaults: fire once, a touch before fully in frame.
export const inViewOnce = { once: true, margin: "0px 0px -12% 0px" } as const;
