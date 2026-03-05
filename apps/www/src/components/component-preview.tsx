"use client"

import { useState } from "react"
import type { TawToolPart } from "@taw-ui/core"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@taw-ui/react"

interface ComponentPreviewProps {
  fixtures: Record<string, TawToolPart>
  children: (part: TawToolPart, key: string) => React.ReactNode
}

export function ComponentPreview({ fixtures, children }: ComponentPreviewProps) {
  const entries = Object.entries(fixtures)
  const [active, setActive] = useState(entries[0]?.[0] ?? "")
  const activePart = fixtures[active]

  return (
    <div className="overflow-hidden rounded-[--taw-radius-lg] border border-[--taw-border] shadow-[--taw-shadow-md]">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-[--taw-border] bg-[--taw-surface] px-4 py-2">
        {/* Traffic lights */}
        <div className="mr-2 flex items-center gap-1.5">
          <span className="h-[10px] w-[10px] rounded-full bg-[--taw-error]" />
          <span className="h-[10px] w-[10px] rounded-full bg-[--taw-warning]" />
          <span className="h-[10px] w-[10px] rounded-full bg-[--taw-success]" />
        </div>

        {/* State tabs */}
        <div className="flex gap-px rounded-lg bg-[--taw-surface-sunken] p-0.5">
          {entries.map(([key]) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={cn(
                "relative rounded-md px-2.5 py-1 font-mono text-[11px] transition-colors",
                active === key
                  ? "font-medium text-[--taw-text-primary]"
                  : "text-[--taw-text-muted] hover:text-[--taw-text-secondary]",
              )}
            >
              {active === key && (
                <motion.div
                  layoutId="preview-tab"
                  className="absolute inset-0 rounded-md bg-[--taw-surface-raised] shadow-[--taw-shadow-sm]"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative">{key}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preview area */}
      <div className="relative bg-[--taw-surface-sunken] p-6">
        {/* Dot grid background */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle, oklch(0.5 0 0 / 0.12) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="relative"
          >
            {activePart && children(activePart, active)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
