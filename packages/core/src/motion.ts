/**
 * Motion tokens for taw-ui components.
 *
 * These are pure data objects — no React imports.
 * framer-motion types are used only for type annotations;
 * the values are plain objects safe to import anywhere.
 */

// ─── Transitions ──────────────────────────────────────────────────────────────

export const transitions = {
  snappy: {
    type: "spring" as const,
    stiffness: 500,
    damping: 30,
    mass: 0.8,
  },

  smooth: {
    duration: 0.25,
    ease: [0.16, 1, 0.3, 1] as readonly number[],
  },

  numbers: {
    type: "spring" as const,
    stiffness: 100,
    damping: 20,
    mass: 1,
  },

  shimmer: {
    duration: 1.5,
    ease: "linear" as const,
    repeat: Infinity,
  },
} as const

// ─── Variants ─────────────────────────────────────────────────────────────────

export const enterVariants = {
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

export const hoverVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.01, transition: transitions.snappy },
}

export const pressProps = {
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

export const staggerParent = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getEnterProps(animate: boolean) {
  if (!animate) return {}
  return {
    initial: "initial" as const,
    animate: "animate" as const,
    variants: enterVariants,
  }
}
