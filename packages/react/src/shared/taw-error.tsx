"use client"

import { motion } from "framer-motion"
import type { TawParseError } from "@taw-ui/core"
import { cn } from "../utils/cn"
import { getEnterProps } from "../motion"

interface TawErrorProps {
  /** Tool execution error (string or Error) */
  error?: Error | string | undefined
  /** Structured parse error with field suggestions */
  parseError?: TawParseError | null | undefined
  /** Whether to animate entrance */
  animate: boolean
  /** Additional class names */
  className?: string | undefined
}

/**
 * Shared error display used by all taw-ui components.
 * Never returns null — always renders a visible error state.
 */
export function TawError({
  error,
  parseError,
  animate,
  className,
}: TawErrorProps) {
  const msg = parseError
    ? parseError.message
    : error instanceof Error
      ? error.message
      : error ?? "Unknown error"

  return (
    <motion.div
      {...(animate ? getEnterProps(true) : {})}
      className={cn(
        "relative flex flex-col gap-1.5 rounded-[--taw-radius] border p-4",
        "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30",
        className,
      )}
    >
      <span className="text-[11px] font-medium uppercase tracking-widest text-red-500">
        Error
      </span>
      <span className="font-mono text-xs text-red-700 dark:text-red-400">
        {msg}
      </span>

      {parseError?.issues.map((issue, i) => (
        <div key={i} className="flex flex-col gap-0.5 pl-2">
          <span className="font-mono text-[10px] text-red-600/70 dark:text-red-400/70">
            {issue.path}: expected {issue.expected}, got {issue.received}
          </span>
          {issue.suggestion && (
            <span className="font-mono text-[10px] text-amber-600 dark:text-amber-400">
              {issue.suggestion}
            </span>
          )}
        </div>
      ))}
    </motion.div>
  )
}
