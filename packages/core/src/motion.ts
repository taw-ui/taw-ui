import type { MotionProps, Transition, Variants } from "framer-motion"

// ─── Transitions ──────────────────────────────────────────────────────────────

export const transitions = {
  /** For UI elements that need to feel instant but not harsh */
  snappy: {
    type: "spring",
    stiffness: 500,
    damping: 30,
    mass: 0.8,
  } satisfies Transition,

  /** For content that needs to feel considered, not rushed */
  smooth: {
    duration: 0.25,
    ease: [0.16, 1, 0.3, 1], // expo out
  } satisfies Transition,

  /** For numbers counting up — spring physics feel natural */
  numbers: {
    type: "spring",
    stiffness: 100,
    damping: 20,
    mass: 1,
  } satisfies Transition,

  /** For skeleton shimmer — perfectly linear */
  shimmer: {
    duration: 1.5,
    ease: "linear",
    repeat: Infinity,
  } satisfies Transition,
} as const

// ─── Variants ─────────────────────────────────────────────────────────────────

/**
 * Standard entrance animation.
 * Confidence: elements appear settled, not popped.
 */
export const enterVariants: Variants = {
  initial: {
    opacity: 0,
    y: 6,
    filter: "blur(4px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: transitions.smooth,
  },
}

/**
 * Hover state — subtle lift, not dramatic.
 */
export const hoverVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.01, transition: transitions.snappy },
}

/**
 * Press feedback — immediate, physical.
 */
export const pressProps: MotionProps = {
  whileHover: { scale: 1.01 },
  whileTap: { scale: 0.98 },
  transition: transitions.snappy,
}

// ─── Shimmer ──────────────────────────────────────────────────────────────────

export const shimmerAnimation = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
  },
  transition: transitions.shimmer,
}

// ─── Stagger ──────────────────────────────────────────────────────────────────

/**
 * Parent variants for staggered children entrance.
 * Use on container, enterVariants on each child.
 */
export const staggerParent: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns enter motion props.
 * Pass animate={false} to get static (no animation) version.
 */
export function getEnterProps(animate: boolean): MotionProps {
  if (!animate) return {}
  return {
    initial: "initial",
    animate: "animate",
    variants: enterVariants,
  }
}
