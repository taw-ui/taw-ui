"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { motion, useMotionValue, useSpring, useTransform, animate } from "framer-motion"

interface ComparisonSliderProps {
  before: React.ReactNode
  after: React.ReactNode
  beforeLabel: React.ReactNode
  afterLabel: React.ReactNode
  className?: string
}

export function ComparisonSlider({
  before,
  after,
  beforeLabel,
  afterLabel,
  className = "",
}: ComparisonSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const hasInteracted = useRef(false)
  const [interacted, setInteracted] = useState(false)

  const rawPosition = useMotionValue(50)
  const position = useSpring(rawPosition, { stiffness: 300, damping: 30 })
  const clipRight = useTransform(position, (v) => `${100 - v}%`)
  const handleLeft = useTransform(position, (v) => `${v}%`)


  useEffect(() => {
    const nudge = setTimeout(() => {
      if (hasInteracted.current) return
      const controls = animate(rawPosition, [50, 42, 58, 50], {
        duration: 2.4,
        ease: "easeInOut",
        repeat: 1,
        repeatDelay: 3,
      })
      return () => controls.stop()
    }, 2000)
    return () => clearTimeout(nudge)
  }, [rawPosition])

  const moveTo = useCallback(
    (clientX: number) => {
      const el = trackRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = clientX - rect.left
      const pct = Math.max(2, Math.min(98, (x / rect.width) * 100))
      rawPosition.set(pct)
      if (!hasInteracted.current) {
        hasInteracted.current = true
        setInteracted(true)
      }
    },
    [rawPosition],
  )

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      isDragging.current = true
      moveTo(e.clientX)
    },
    [moveTo],
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return
      moveTo(e.clientX)
    },
    [moveTo],
  )

  const onPointerUp = useCallback(() => {
    isDragging.current = false
  }, [])

  return (
    <div ref={containerRef} className={`relative select-none ${className}`}>
      {/* Comparison track — grid overlap so tallest child sets height */}
      <div
        ref={trackRef}
        className="relative isolate grid cursor-ew-resize overflow-hidden rounded-(--taw-radius-lg) shadow-(--taw-shadow-md)"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{ touchAction: "none" }}
      >
        {/* Before layer */}
        <div className="col-start-1 row-start-1 [&>*]:flex [&>*]:h-full [&>*]:flex-col [&>*>*:last-child]:flex-1">{before}</div>

        {/* After layer — clipped from the left */}
        <motion.div
          className="col-start-1 row-start-1 z-10 bg-(--taw-surface-sunken) [&>*]:flex [&>*]:h-full [&>*]:flex-col [&>*>*:last-child]:flex-1"
          style={{ clipPath: useTransform(clipRight, (v) => `inset(0 ${v} 0 0)`) }}
        >
          {after}
        </motion.div>

        {/* Divider line */}
        <motion.div
          className="absolute inset-y-0 z-20 w-px"
          style={{
            left: handleLeft,
            background: "var(--taw-accent)",
            boxShadow: "0 0 8px oklch(0.55 0.18 295 / 0.3), 0 0 2px oklch(0.55 0.18 295 / 0.5)",
          }}
        />

        {/* Drag handle */}
        <motion.div
          className="absolute z-30 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
          style={{ left: handleLeft, top: "50%" }}
        >
          <motion.div
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-(--taw-accent) bg-(--taw-surface) shadow-[0_2px_12px_oklch(0.55_0.18_295/0.25)]"
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-(--taw-accent)"
            >
              <path d="M7 18l-4-4 4-4" />
              <path d="M17 18l4-4-4-4" />
            </svg>
          </motion.div>
        </motion.div>

        {/* "Drag to compare" hint — fades after first interaction */}
        {!interacted && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="absolute bottom-3 left-1/2 z-30 -translate-x-1/2"
          >
            <span className="rounded-full border border-(--taw-border) bg-(--taw-surface)/90 px-3 py-1 font-mono text-[10px] text-(--taw-text-muted) shadow-(--taw-shadow-sm) backdrop-blur-sm">
              drag to compare
            </span>
          </motion.div>
        )}
      </div>

      {/* Labels — always visible below the slider */}
      <div className="mt-3 flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-mono text-[11px] font-medium text-(--taw-error)">
          {beforeLabel}
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[11px] font-medium text-(--taw-success)">
          {afterLabel}
        </span>
      </div>
    </div>
  )
}
