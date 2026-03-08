"use client"

import { motion } from "framer-motion"
import {
  PostCard as PostCardContract,
  type PostCardData,
  type PostMediaData,
  type TawToolPart,
} from "taw-ui"

import { cn } from "./utils/cn"
import { getEnterProps, staggerParent, enterVariants } from "./motion"
import { SourceLabel, TawError, TawSkeleton, ConfidenceBadge } from "./shared"

// ─── Provider config ────────────────────────────────────────────────────────

const providerConfig = {
  x: { strip: "bg-black dark:bg-white", label: "X" },
  instagram: { strip: "bg-gradient-to-b from-[#833ab4] via-[#fd1d1d] to-[#fcb045]", label: "Instagram" },
  linkedin: { strip: "bg-[#0A66C2]", label: "LinkedIn" },
  threads: { strip: "bg-black dark:bg-white", label: "Threads" },
  other: { strip: "bg-(--taw-border-subtle)", label: "Post" },
} as const

// ─── Provider icons (SVG) ───────────────────────────────────────────────────

function ProviderIcon({ provider, className }: { provider: string; className?: string }) {
  const size = 14
  const props = { width: size, height: size, fill: "currentColor", className }

  if (provider === "x") {
    return (
      <svg {...props} viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  }

  if (provider === "instagram") {
    return (
      <svg {...props} viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    )
  }

  if (provider === "linkedin") {
    return (
      <svg {...props} viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    )
  }

  if (provider === "threads") {
    return (
      <svg {...props} viewBox="0 0 24 24">
        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.34-.779-.963-1.4-1.18-1.564a7.17 7.17 0 01-.45 1.857c-.37.88-.977 1.604-1.803 2.147-1.135.746-2.507 1.084-3.755 1.084a7.07 7.07 0 01-1.56-.175c-1.27-.288-2.323-.956-2.955-1.881-.6-.878-.847-1.94-.696-2.99.296-2.07 2.096-3.57 4.593-3.832a9.85 9.85 0 011.12-.05c.94.017 1.828.168 2.642.45-.06-.38-.174-.725-.342-1.03-.488-.88-1.41-1.37-2.597-1.382h-.045c-.88 0-1.874.315-2.378.795l-1.378-1.55c.852-.752 2.2-1.35 3.756-1.35h.075c3.025.043 4.716 2.065 4.855 5.376a8.49 8.49 0 01.155.543c.667.292 1.25.668 1.743 1.128 1.078 1.005 1.678 2.396 1.735 4.023.065 1.857-.582 3.564-1.82 4.806-1.753 1.757-4.122 2.586-7.238 2.533zM10.39 14.34c-1.47.188-2.468 1.007-2.597 2.025-.086.672.103 1.29.534 1.74.484.505 1.248.81 2.154.86a5.3 5.3 0 001.172-.083c1.604-.345 2.663-1.398 2.91-2.672a4.85 4.85 0 00.089-.726c-.818-.35-1.766-.551-2.819-.586a7.59 7.59 0 00-1.443.042z" />
      </svg>
    )
  }

  // Generic fallback — chat bubble
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  )
}

// ─── Verified badge ─────────────────────────────────────────────────────────

function VerifiedBadge({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className={cn("text-(--taw-accent)", className)}>
      <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.47 1.39-.2 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
    </svg>
  )
}

// ─── Metric formatting ──────────────────────────────────────────────────────

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(/\.0$/, "")}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`
  return n.toString()
}

// ─── Timestamp helper ───────────────────────────────────────────────────────

function formatTimestamp(ts: string): string {
  if (!/^\d{4}-/.test(ts)) return ts
  try {
    const d = new Date(ts)
    const now = Date.now()
    const diff = now - d.getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "just now"
    if (mins < 60) return `${mins}m`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h`
    const days = Math.floor(hrs / 24)
    if (days < 30) return `${days}d`
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
  } catch {
    return ts
  }
}

// ─── Skeleton ───────────────────────────────────────────────────────────────

function PostCardSkeleton({ animate }: { animate: boolean }) {
  return (
    <TawSkeleton
      lines={[
        ["10px", "140px"],
        ["14px", "260px"],
        ["12px", "240px"],
        ["10px", "160px"],
      ]}
      animate={animate}
      className="min-w-[280px]"
    />
  )
}

// ─── PostCard ───────────────────────────────────────────────────────────────

export interface PostCardProps {
  part: TawToolPart<unknown, unknown>
  animate?: boolean | undefined
  className?: string | undefined
}

export function PostCard({
  part,
  animate = true,
  className,
}: PostCardProps) {
  const { state, output, error } = part

  if (state === "input-available" || state === "streaming") {
    return <PostCardSkeleton animate={animate} />
  }

  if (state === "output-error") {
    return <TawError error={error} animate={animate} />
  }

  const result = PostCardContract.parse(output)
  if (!result.success) {
    return <TawError parseError={result.error} animate={animate} />
  }

  const data = result.data as PostCardData
  const pConfig = providerConfig[data.provider] ?? providerConfig.other
  const hasMetrics = data.metrics && (
    data.metrics.likes != null ||
    data.metrics.comments != null ||
    data.metrics.reposts != null ||
    data.metrics.views != null
  )
  const isDeleted = data.status === "deleted"

  return (
    <motion.div
      {...getEnterProps(animate)}
      variants={staggerParent}
      className={cn(
        "relative overflow-hidden rounded-(--taw-radius-lg) border shadow-(--taw-shadow-sm)",
        "bg-(--taw-surface) border-(--taw-border)",
        className,
      )}
      data-taw-component="post-card"
      data-taw-id={data.id}
    >
      {/* Provider accent strip */}
      <div className={cn("absolute left-0 top-0 h-full w-1", pConfig.strip)} />

      {/* Confidence badge */}
      {data.confidence != null && <ConfidenceBadge confidence={data.confidence} />}

      <div className="flex flex-col gap-3 py-4 pr-4 pl-5">
        {/* Author row */}
        <motion.div variants={enterVariants} className="flex items-center gap-2.5">
          {data.author.avatarUrl ? (
            <img
              src={data.author.avatarUrl}
              alt=""
              className="h-8 w-8 shrink-0 rounded-full"
            />
          ) : (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--taw-surface-sunken) text-[12px] font-bold uppercase text-(--taw-text-muted)">
              {data.author.name.charAt(0)}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              {data.author.url ? (
                <a
                  href={data.author.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-[13px] font-semibold text-(--taw-text-primary) hover:text-(--taw-accent) transition-colors"
                >
                  {data.author.name}
                </a>
              ) : (
                <span className="truncate text-[13px] font-semibold text-(--taw-text-primary)">
                  {data.author.name}
                </span>
              )}
              {data.author.isVerified && <VerifiedBadge />}
            </div>
            <div className="flex items-center gap-1.5">
              {data.author.handle && (
                <span className="truncate text-[11px] text-(--taw-text-muted)">
                  {data.author.handle}
                </span>
              )}
              <span className="text-[11px] text-(--taw-text-disabled)">·</span>
              <span className="text-[11px] text-(--taw-text-muted)">
                {formatTimestamp(data.postedAt)}
              </span>
              <span className="ml-auto text-(--taw-text-muted)">
                <ProviderIcon provider={data.provider} />
              </span>
            </div>
          </div>
        </motion.div>

        {/* Body text */}
        <motion.div variants={enterVariants}>
          <p className={cn(
            "whitespace-pre-line text-[13px] leading-relaxed",
            isDeleted
              ? "text-(--taw-text-disabled) italic"
              : "text-(--taw-text-primary)",
          )}>
            {isDeleted ? "[This post has been deleted]" : data.body}
          </p>
        </motion.div>

        {/* Media */}
        {data.media && data.media.length > 0 && !isDeleted && (
          <motion.div variants={enterVariants}>
            <MediaGrid media={data.media} />
          </motion.div>
        )}

        {/* Tags */}
        {data.tags && data.tags.length > 0 && !isDeleted && (
          <motion.div variants={enterVariants} className="flex flex-wrap gap-1">
            {data.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-(--taw-accent-subtle) px-2 py-0.5 text-[10px] font-medium text-(--taw-accent)"
              >
                #{tag}
              </span>
            ))}
          </motion.div>
        )}

        {/* Metrics row */}
        {hasMetrics && !isDeleted && (
          <motion.div variants={enterVariants} className="flex items-center gap-4">
            {data.metrics!.comments != null && (
              <MetricItem
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>}
                value={data.metrics!.comments}
              />
            )}
            {data.metrics!.reposts != null && (
              <MetricItem
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 014-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 01-4 4H3" /></svg>}
                value={data.metrics!.reposts}
              />
            )}
            {data.metrics!.likes != null && (
              <MetricItem
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>}
                value={data.metrics!.likes}
              />
            )}
            {data.metrics!.views != null && (
              <MetricItem
                icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>}
                value={data.metrics!.views}
              />
            )}
          </motion.div>
        )}

        {/* Deleted status */}
        {isDeleted && (
          <motion.div variants={enterVariants}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-(--taw-error)/12 px-2 py-0.5 text-[10px] font-medium text-(--taw-error)">
              <span className="h-1.5 w-1.5 rounded-full bg-(--taw-error)" />
              Deleted
            </span>
          </motion.div>
        )}

        {/* Link to original */}
        {data.url && !isDeleted && (
          <motion.div variants={enterVariants}>
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-medium text-(--taw-accent) hover:underline"
            >
              View on {pConfig.label} →
            </a>
          </motion.div>
        )}

        {/* Caveat */}
        {data.caveat && (
          <motion.div
            variants={enterVariants}
            className="flex gap-2 rounded-(--taw-radius) bg-(--taw-warning)/6 px-3 py-2"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-(--taw-warning)">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span className="text-[11px] leading-relaxed text-(--taw-warning)">
              {data.caveat}
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
    </motion.div>
  )
}

// ─── Metric item ────────────────────────────────────────────────────────────

function MetricItem({ icon, value }: { icon: React.ReactNode; value: number }) {
  return (
    <div className="flex items-center gap-1 text-(--taw-text-muted)">
      {icon}
      <span className="text-[11px] font-medium">{formatCount(value)}</span>
    </div>
  )
}

// ─── Media grid ─────────────────────────────────────────────────────────────

function MediaGrid({ media }: { media: PostMediaData[] }) {
  if (media.length === 1) {
    const m = media[0]!
    return (
      <div className="overflow-hidden rounded-(--taw-radius)">
        <img
          src={m.url}
          alt={m.alt ?? ""}
          className="w-full object-cover"
          style={{ maxHeight: 280 }}
        />
        {m.type === "video" && <VideoOverlay />}
      </div>
    )
  }

  // Multi-image grid (2–4 images)
  return (
    <div className={cn(
      "grid gap-0.5 overflow-hidden rounded-(--taw-radius)",
      media.length === 2 && "grid-cols-2",
      media.length === 3 && "grid-cols-2",
      media.length >= 4 && "grid-cols-2",
    )}>
      {media.slice(0, 4).map((m, i) => (
        <div
          key={i}
          className={cn(
            "relative overflow-hidden",
            media.length === 3 && i === 0 && "row-span-2",
          )}
          style={{ height: media.length === 3 && i === 0 ? 200 : 100 }}
        >
          <img
            src={m.url}
            alt={m.alt ?? ""}
            className="h-full w-full object-cover"
          />
          {m.type === "video" && <VideoOverlay />}
        </div>
      ))}
    </div>
  )
}

function VideoOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      </div>
    </div>
  )
}
