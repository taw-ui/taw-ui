"use client"

import { motion } from "motion/react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { cn } from "./lib/utils"
import type { ToolPart } from "./lib/types"
import { safeParse } from "./lib/types"
import {
  getEnterProps,
  staggerParent,
  enterVariants,
} from "./lib/motion"
import {
  TawSkeleton,
  TawError,
  SourceLabel,
  ConfidenceBadge,
  Typewriter,
} from "./lib/taw"
import { linkCardSchema } from "./link-card.schema"

// ─── Domain extraction ──────────────────────────────────────────────────────

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}

// ─── Favicon ────────────────────────────────────────────────────────────────

function Favicon({
  src,
  domain,
}: {
  src?: string | undefined
  domain: string
}) {
  const [error, setError] = useState(false)

  if (!src || error) {
    return (
      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-muted text-[8px] font-bold uppercase text-muted-foreground">
        {domain.charAt(0)}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt=""
      className="h-4 w-4 shrink-0 rounded"
      onError={() => setError(true)}
    />
  )
}

// ─── LinkCard ───────────────────────────────────────────────────────────────

export interface LinkCardProps {
  part: ToolPart
  animate?: boolean | undefined
  className?: string | undefined
}

export function LinkCard({
  part,
  animate = true,
  className,
}: LinkCardProps) {
  // Guard: loading states
  if (
    part.state === "input-streaming" ||
    part.state === "input-available" ||
    (part.state === "output-available" && part.output == null)
  ) {
    return (
      <TawSkeleton
        lines={[
          ["120px", "100%"],
          ["14px", "60%"],
          ["10px", "40%"],
        ]}
        className={className}
      />
    )
  }

  if (part.state === "output-error") {
    return (
      <TawError
        title="LinkCard"
        message={part.errorText}
        animate={animate}
        className={className}
      />
    )
  }

  const result = safeParse(linkCardSchema, part.output)
  if (!result.ok) {
    return (
      <TawError
        title="LinkCard"
        message="Schema validation failed"
        issues={result.issues}
        animate={animate}
        className={className}
      />
    )
  }

  const data = result.data
  const domain = data.domain || extractDomain(data.url)

  return (
    <motion.div
      {...getEnterProps(animate)}
      variants={staggerParent}
    >
      <Card
        className={cn(
          "group relative gap-0 overflow-hidden py-0 transition-colors",
          className,
        )}
        data-taw="link-card"
      >
        {data.confidence !== undefined && (
          <ConfidenceBadge confidence={data.confidence} />
        )}

        {/* OG Image */}
        {data.image && (
          <motion.div
            variants={enterVariants}
            className="relative overflow-hidden border-b"
          >
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <img
                src={data.image}
                alt=""
                className="h-[160px] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </a>
          </motion.div>
        )}

        {/* Content */}
        <div className="flex flex-col gap-2 p-4">
          {/* Domain + date row */}
          <motion.div
            variants={enterVariants}
            className="flex items-center gap-2"
          >
            <Favicon src={data.favicon} domain={domain} />
            <span className="text-[11px] font-medium text-muted-foreground">
              {domain}
            </span>
            {data.publishedAt && (
              <>
                <span className="text-[10px] text-muted-foreground opacity-40">
                  &middot;
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {data.publishedAt}
                </span>
              </>
            )}
          </motion.div>

          {/* Title */}
          <motion.div variants={enterVariants}>
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[14px] font-semibold leading-snug text-foreground decoration-primary/30 underline-offset-2 hover:underline"
            >
              {data.title}
            </a>
          </motion.div>

          {/* Description */}
          {data.description && (
            <motion.p
              variants={enterVariants}
              className="line-clamp-2 text-[12px] leading-relaxed text-muted-foreground"
            >
              {data.description}
            </motion.p>
          )}

          {/* AI Reasoning */}
          {data.reason && (
            <motion.div
              variants={enterVariants}
              className="mt-1 flex gap-2 rounded-lg bg-primary/5 px-3 py-2"
            >
              <span className="mt-0.5 shrink-0 text-[10px] text-primary">
                {"\u2192"}
              </span>
              <Typewriter
                text={data.reason}
                animate={animate}
                className="text-[11px] leading-relaxed text-primary"
              />
            </motion.div>
          )}

          {/* Caveat */}
          {data.caveat && !data.reason && (
            <motion.div
              variants={enterVariants}
              className="mt-1 flex gap-2 rounded-lg bg-primary/5 px-3 py-2"
            >
              <span className="mt-0.5 shrink-0 text-[10px] text-primary">
                {"\u2192"}
              </span>
              <Typewriter
                text={data.caveat}
                animate={animate}
                className="text-[11px] leading-relaxed text-primary"
              />
            </motion.div>
          )}
        </div>

        {/* Source footer */}
        {data.source && (
          <motion.div
            variants={enterVariants}
            className="border-t px-4 py-2"
          >
            <SourceLabel source={data.source} />
          </motion.div>
        )}
      </Card>
    </motion.div>
  )
}
