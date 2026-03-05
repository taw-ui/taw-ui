"use client"

import { motion } from "framer-motion"
import { LinkCard as LinkCardContract, type LinkCardData, type TawToolPart } from "@taw-ui/core"

import { cn } from "./utils/cn"
import { getEnterProps, staggerParent, enterVariants } from "./motion"
import { ConfidenceBadge, SourceLabel, TawError, TawSkeleton } from "./shared"

// ─── LinkCard ────────────────────────────────────────────────────────────────

export interface LinkCardProps {
  part: TawToolPart<unknown, unknown>
  animate?: boolean | undefined
  className?: string | undefined
}

export function LinkCard({
  part,
  animate = true,
  className,
}: LinkCardProps) {
  const { state, output, error } = part

  // Loading
  if (state === "input-available" || state === "streaming") {
    return (
      <div className="overflow-hidden rounded-[--taw-radius] border border-[--taw-border] bg-[--taw-surface]">
        <div className="h-[140px] bg-[--taw-surface-sunken]" />
        <div className="p-4">
          <TawSkeleton
            lines={[["10px", "80px"], ["14px", "100%"], ["10px", "65%"]]}
            animate={animate}
            className="border-0 p-0"
          />
        </div>
      </div>
    )
  }

  // Error
  if (state === "output-error") {
    return <TawError error={error} animate={animate} />
  }

  // Parse
  const result = LinkCardContract.parse(output)
  if (!result.success) {
    return <TawError parseError={result.error} animate={animate} />
  }

  const data = result.data as LinkCardData
  const domain = data.domain ?? extractDomain(data.url)

  return (
    <motion.a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      {...getEnterProps(animate)}
      variants={{
        ...staggerParent,
      }}
      className={cn(
        "group relative block overflow-hidden rounded-[--taw-radius] border border-[--taw-border] bg-[--taw-surface] font-sans transition-all",
        "hover:border-[--taw-accent] hover:shadow-[0_0_0_1px_var(--taw-accent)]",
        className,
      )}
      data-taw-component="link-card"
      data-taw-id={data.id}
    >
      {/* Image */}
      {data.image && (
        <motion.div
          variants={enterVariants}
          className="relative h-[140px] overflow-hidden bg-[--taw-surface-sunken]"
        >
          <img
            src={data.image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </motion.div>
      )}

      {/* Content */}
      <div className="flex flex-col gap-2 p-4">
        {data.confidence !== undefined && (
          <ConfidenceBadge confidence={data.confidence} />
        )}

        {/* Domain + favicon */}
        <motion.div variants={enterVariants} className="flex items-center gap-2">
          {data.favicon ? (
            <img
              src={data.favicon}
              alt=""
              className="h-4 w-4 rounded-sm"
            />
          ) : (
            <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-[--taw-surface-sunken] text-[8px] font-bold uppercase text-[--taw-text-muted]">
              {domain.charAt(0)}
            </span>
          )}
          <span className="text-[11px] text-[--taw-text-muted]">
            {domain}
          </span>
          {data.publishedAt && (
            <>
              <span className="text-[11px] text-[--taw-border]">·</span>
              <span className="text-[11px] text-[--taw-text-muted]">
                {data.publishedAt}
              </span>
            </>
          )}
        </motion.div>

        {/* Title */}
        <motion.h3
          variants={enterVariants}
          className="text-[14px] font-semibold leading-snug text-[--taw-text-primary] group-hover:text-[--taw-accent]"
        >
          {data.title}
        </motion.h3>

        {/* Description */}
        {data.description && (
          <motion.p
            variants={enterVariants}
            className="line-clamp-2 text-[12px] leading-relaxed text-[--taw-text-muted]"
          >
            {data.description}
          </motion.p>
        )}

        {/* Reason — why the AI shared this */}
        {data.reason && (
          <motion.div
            variants={enterVariants}
            className="mt-1 flex gap-2 rounded-[6px] bg-[--taw-accent-subtle] px-3 py-2"
          >
            <span className="mt-px text-[10px] text-[--taw-accent]">→</span>
            <span className="text-[11px] leading-relaxed text-[--taw-accent]">
              {data.reason}
            </span>
          </motion.div>
        )}

        {/* Source */}
        {data.source && (
          <motion.div variants={enterVariants}>
            <SourceLabel source={data.source} />
          </motion.div>
        )}
      </div>
    </motion.a>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}
