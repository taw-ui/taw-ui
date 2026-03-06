"use client"

import { motion } from "framer-motion"
import { cn } from "../utils"
import { shimmerAnimation } from "../motion"

interface TawSkeletonProps {
  lines: Array<[height: string, width: string]>
  animate: boolean
  className?: string | undefined
}

export function TawSkeleton({ lines, animate, className }: TawSkeletonProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-2 rounded-(--taw-radius) border p-4",
        "bg-(--taw-surface) border-(--taw-border)",
        className,
      )}
    >
      {lines.map(([height, width], i) => (
        <div
          key={i}
          className={cn("rounded bg-(--taw-border)", animate && "overflow-hidden")}
          style={{ height, width }}
        >
          {animate && <ShimmerBar />}
        </div>
      ))}
    </div>
  )
}

function ShimmerBar() {
  return (
    <motion.div
      className="h-full w-full"
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, oklch(0.88 0 0 / 0.6) 50%, transparent 100%)",
        backgroundSize: "200% 100%",
      }}
      animate={shimmerAnimation.animate}
      transition={shimmerAnimation.transition}
    />
  )
}
