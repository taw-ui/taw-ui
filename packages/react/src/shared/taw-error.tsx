"use client"

import { motion } from "framer-motion"
import type { TawParseError } from "@taw-ui/core"
import { cn } from "../utils/cn"
import { getEnterProps, enterVariants, staggerParent } from "../motion"

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
  const isParseError = !!parseError
  const msg = parseError
    ? parseError.message
    : error instanceof Error
      ? error.message
      : error ?? "Unknown error"

  return (
    <motion.div
      {...(animate ? getEnterProps(true) : {})}
      variants={{ ...staggerParent }}
      className={cn(
        "relative overflow-hidden rounded-[--taw-radius] border border-[--taw-border] bg-[--taw-surface] font-sans",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-[--taw-border] bg-[--taw-surface-sunken] px-4 py-2.5">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[--taw-error] text-[10px] font-bold leading-none text-white">
          !
        </span>
        <span className="text-[11px] font-medium uppercase tracking-wider text-[--taw-error]">
          {isParseError ? "Schema Validation Failed" : "Tool Error"}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3 p-4">
        {/* Message */}
        <motion.p
          variants={enterVariants}
          className="font-mono text-[12px] leading-relaxed text-[--taw-text-secondary]"
        >
          {msg}
        </motion.p>

        {/* Parse error issues */}
        {parseError && parseError.issues.length > 0 && (
          <motion.div
            variants={enterVariants}
            className="flex flex-col gap-2 rounded-[6px] bg-[--taw-surface-sunken] p-3"
          >
            {parseError.issues.map((issue, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <div className="flex items-baseline gap-2 font-mono text-[11px]">
                  <span className="text-[--taw-error]">missing</span>
                  <span className="font-medium text-[--taw-text-primary]">
                    {issue.path}
                  </span>
                  <span className="text-[--taw-text-muted]">
                    expected {issue.expected}
                  </span>
                </div>
                {issue.received && (
                  <span className="pl-[52px] font-mono text-[10px] text-[--taw-text-muted]">
                    received: {issue.received}
                  </span>
                )}
                {issue.suggestion && (
                  <span className="pl-[52px] font-mono text-[10px] text-[--taw-warning]">
                    {issue.suggestion}
                  </span>
                )}
              </div>
            ))}
          </motion.div>
        )}

        {/* Runtime error — show recoverable hint */}
        {!isParseError && (
          <motion.p
            variants={enterVariants}
            className="text-[11px] text-[--taw-text-muted]"
          >
            The tool returned an error instead of data. This usually means the
            upstream API failed — retry or check the tool{"'"}s logs.
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}
