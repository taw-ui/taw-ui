"use client"

import { motion } from "framer-motion"
import { BadgeCheck, Repeat2, Play, MessageCircle, Heart, Bookmark, Eye } from "lucide-react"
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
import {
  postCardSchema,
  type PostProvider,
  type PostMedia,
  type PostAuthor,
  type PostMetrics,
  type PostLinkPreview,
} from "./post-card.schema"

// ─── Provider icons ─────────────────────────────────────────────────────────

function ProviderIcon({
  provider,
  className,
}: {
  provider: PostProvider
  className?: string
}) {
  const c = cn("h-4 w-4 shrink-0", className)

  switch (provider) {
    case "twitter":
      return (
        <svg viewBox="0 0 16 16" fill="currentColor" className={c}>
          <path d="M9.52 6.77L15.48 0h-1.41L8.9 5.88 4.76 0H0l6.25 9.1L0 16h1.41l5.46-6.35L11.24 16H16L9.52 6.77zm-1.93 2.25l-.63-.91L1.92 1.04h2.17l4.07 5.82.63.91 5.29 7.56h-2.17L7.59 9.02z" />
        </svg>
      )
    case "mastodon":
      return (
        <svg viewBox="0 0 16 16" fill="currentColor" className={c}>
          <path d="M15.17 10.34c-.22 1.14-2 2.38-4.04 2.62-1.07.13-2.12.24-3.24.19-1.83-.09-3.28-.45-3.28-.45 0 .18.01.36.04.53.27 2.04 2 2.16 3.64 2.22 1.66.06 3.13-.41 3.13-.41l.07 1.5s-1.16.62-3.22.74c-1.14.06-2.55-.03-4.2-.47C1.17 16.1.17 13.26.04 10.36a30.3 30.3 0 01-.04-2v-2.2C0 3.01 2.13 1.4 2.13 1.4 3.2.84 5.1.36 7.08.34h.04c1.98.02 3.88.5 4.95 1.06 0 0 2.13 1.61 2.13 4.82 0 0 .03 2.75-.03 4.12zM12.75 6.3c0-1-.25-1.8-.74-2.4-.51-.59-1.18-.9-2.01-.9-.97 0-1.7.37-2.17 1.12l-.47.79-.47-.79c-.48-.75-1.2-1.12-2.17-1.12-.83 0-1.5.3-2.01.9-.5.6-.74 1.4-.74 2.4v4.93h1.95V6.45c0-1 .42-1.51 1.26-1.51.93 0 1.4.6 1.4 1.8v2.62h1.94V6.74c0-1.2.47-1.8 1.4-1.8.84 0 1.26.5 1.26 1.51v4.78h1.95V6.3h-.38z" />
        </svg>
      )
    case "bluesky":
      return (
        <svg viewBox="0 0 16 16" fill="currentColor" className={c}>
          <path d="M3.48 2.03C5.07 3.32 6.8 5.95 8 7.7c1.2-1.75 2.93-4.38 4.52-5.67C13.64 1.12 16 .1 16 2.77c0 .53-.31 4.48-.49 5.12-.63 2.24-2.93 2.81-4.98 2.47 3.59.6 4.5 2.6 2.53 4.59-3.75 3.78-5.4-1-5.82-2.22a3.6 3.6 0 01-.12-.43h-.12l-.12.43c-.43 1.23-2.07 6-5.82 2.22-1.97-1.99-1.06-3.98 2.53-4.59-2.05.34-4.35-.23-4.98-2.47C.31 7.25 0 3.3 0 2.77 0 .1 2.36 1.12 3.48 2.03z" />
        </svg>
      )
    case "linkedin":
      return (
        <svg viewBox="0 0 16 16" fill="currentColor" className={c}>
          <path d="M0 1.78C0 .8.8 0 1.78 0h12.44C15.2 0 16 .8 16 1.78v12.44c0 .98-.8 1.78-1.78 1.78H1.78C.8 16 0 15.2 0 14.22V1.78zM4.94 13.4V6.17H2.54v7.22h2.4zM3.74 5.18c.84 0 1.36-.55 1.36-1.24-.02-.7-.52-1.24-1.34-1.24-.82 0-1.36.53-1.36 1.24 0 .7.52 1.24 1.32 1.24h.02zM6.23 13.4h2.4V9.36c0-.22.01-.43.08-.59.18-.43.58-.88 1.26-.88.89 0 1.24.68 1.24 1.67v3.83h2.4V9.27c0-2.21-1.18-3.24-2.76-3.24-1.29 0-1.86.72-2.18 1.21h.02V6.17H6.23c.03.68 0 7.22 0 7.22z" />
        </svg>
      )
    case "reddit":
      return (
        <svg viewBox="0 0 16 16" fill="currentColor" className={c}>
          <path d="M16 8A8 8 0 110 8a8 8 0 0116 0zm-3.16-.92c-.04-.68-.62-1.2-1.3-1.16a1.24 1.24 0 00-.78.32c-.9-.6-2.04-.98-3.26-1.02l.66-2.76 2 .46a.84.84 0 10.1-.58l-2.24-.52a.28.28 0 00-.34.22l-.74 3.14c-1.28.02-2.48.4-3.42 1.02a1.24 1.24 0 00-1.74.16 1.22 1.22 0 00.34 1.82 2.2 2.2 0 00-.04.42c0 1.92 2.38 3.48 5.32 3.48s5.32-1.56 5.32-3.48c0-.14-.02-.28-.04-.4.4-.24.66-.66.66-1.12.02.02.02 0 .02 0h-.02zM5.3 8.84a.84.84 0 111.68 0 .84.84 0 01-1.68 0zm4.72 2.24c-.58.58-1.68.62-1.98.62-.3 0-1.42-.06-1.98-.62a.24.24 0 01.34-.34c.36.36 1.14.5 1.64.5s1.26-.12 1.64-.5a.24.24 0 01.34.34zm-.14-1.4a.84.84 0 110-1.68.84.84 0 010 1.68z" />
        </svg>
      )
    case "threads":
      return (
        <svg viewBox="0 0 16 16" fill="currentColor" className={c}>
          <path d="M11.64 7.26a4.78 4.78 0 00-.22-.1c-.14-1.96-1.16-3.08-2.86-3.1h-.02c-1.01 0-1.86.43-2.38 1.22l1.06.73c.36-.55.93-.68 1.33-.68.51 0 .9.15 1.15.45.18.22.3.52.36.9a6.3 6.3 0 00-1.64-.08c-1.64.1-2.7.98-2.62 2.18.04.61.36 1.13.9 1.47.46.29 1.05.42 1.67.39.82-.05 1.46-.35 1.9-.9.33-.41.54-.95.64-1.62.39.23.67.54.82.93.26.64.28 1.7-.58 2.56-.75.76-1.66 1.08-3.08 1.1-1.57-.02-2.76-.52-3.53-1.47C3.81 10.4 3.38 9.15 3.36 7.63V7.5c.02-1.52.45-2.77 1.17-3.62.77-.95 1.96-1.45 3.53-1.47 1.59.02 2.8.52 3.59 1.48.38.47.67 1.05.87 1.73l1.2-.32c-.24-.84-.6-1.56-1.1-2.16C11.52 1.73 10 1.12 8.08 1.1H8.04c-1.91.02-3.41.64-4.45 1.84C2.58 4.13 2.06 5.69 2.04 7.5v.13c.02 1.8.54 3.37 1.55 4.56 1.04 1.2 2.54 1.82 4.45 1.84H8.08c1.76-.02 2.96-.47 3.98-1.49 1.28-1.28 1.24-2.87.84-3.86-.29-.71-.82-1.28-1.54-1.66l.28.24zM9.66 9.49c-.07.52-.41 1.31-1.78 1.4-.56.03-1.08-.08-1.33-.52-.14-.25-.2-.56-.06-.82.18-.34.64-.61 1.68-.67.16-.01.32-.01.48-.01.38 0 .73.04 1.04.1-.02.18-.02.35-.03.52z" />
        </svg>
      )
    case "facebook":
      return (
        <svg viewBox="0 0 16 16" fill="currentColor" className={c}>
          <path d="M16 8A8 8 0 100 8a8 8 0 0016 0zm-4.37-.9H9.88V5.66c0-.43.28-.53.48-.53h1.22V3.12L9.9 3.1c-1.87 0-2.3 1.4-2.3 2.3V7.1H6.37v2.04h1.23v5.77A8.06 8.06 0 009.88 15V9.14h1.47l.28-2.04z" />
        </svg>
      )
    case "instagram":
      return (
        <svg viewBox="0 0 16 16" fill="currentColor" className={c}>
          <path d="M8 1.44c2.14 0 2.39.01 3.23.05.78.04 1.2.16 1.48.27.37.14.64.32.92.6.28.28.45.55.6.92.11.28.24.7.27 1.48.04.84.05 1.1.05 3.24s-.01 2.39-.05 3.23c-.04.78-.16 1.2-.27 1.48-.14.37-.32.64-.6.92-.28.28-.55.45-.92.6-.28.11-.7.24-1.48.27-.84.04-1.1.05-3.23.05s-2.4-.01-3.24-.05c-.78-.04-1.2-.16-1.48-.27a2.49 2.49 0 01-.92-.6 2.49 2.49 0 01-.6-.92c-.1-.28-.23-.7-.26-1.48-.04-.84-.05-1.1-.05-3.23s.01-2.4.05-3.24c.03-.78.16-1.2.27-1.48.14-.37.32-.64.6-.92.28-.28.54-.45.91-.6.28-.1.7-.23 1.48-.26.85-.04 1.1-.05 3.24-.05zM8 0C5.83 0 5.55.01 4.7.05c-.84.04-1.42.17-1.92.37-.52.2-.96.47-1.4.91-.44.44-.71.88-.91 1.4-.2.5-.33 1.08-.37 1.92C.01 5.55 0 5.83 0 8s.01 2.44.05 3.3c.04.83.17 1.41.37 1.91.2.52.47.96.91 1.4.44.44.88.71 1.4.91.5.2 1.08.33 1.92.37.85.04 1.13.05 3.35.05s2.44-.01 3.3-.05c.83-.04 1.41-.17 1.91-.37a3.85 3.85 0 001.4-.91c.44-.44.71-.88.91-1.4.2-.5.33-1.08.37-1.92.04-.85.05-1.13.05-3.29s-.01-2.44-.05-3.3c-.04-.83-.17-1.41-.37-1.91a3.85 3.85 0 00-.91-1.4A3.85 3.85 0 0012.91.42C12.41.22 11.83.09 11 .05 10.44.01 10.17 0 8 0zm0 3.89a4.11 4.11 0 100 8.22 4.11 4.11 0 000-8.22zM8 10.67A2.67 2.67 0 118 5.33a2.67 2.67 0 010 5.34zm5.23-6.98a.96.96 0 10-1.92 0 .96.96 0 001.92 0z" />
        </svg>
      )
  }
}

// ─── Compact number ──────────────────────────────────────────────────────────

function compactNumber(n: number): string {
  if (n < 1000) return String(n)
  if (n < 1_000_000) return `${(n / 1000).toFixed(n < 10_000 ? 1 : 0)}K`
  return `${(n / 1_000_000).toFixed(1)}M`
}

// ─── Relative time ───────────────────────────────────────────────────────────

function relativeTime(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = now - then
  const secs = Math.floor(diff / 1000)
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (secs < 60) return `${secs}s`
  if (mins < 60) return `${mins}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}d`
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })
}

// ─── Verified badge ──────────────────────────────────────────────────────────

function VerifiedBadge() {
  return (
    <BadgeCheck size={14} className="text-primary" />
  )
}

// ─── Author header ───────────────────────────────────────────────────────────

function AuthorHeader({
  author,
  provider,
  publishedAt,
  isReply,
  parentAuthor,
}: {
  author: PostAuthor
  provider: PostProvider
  publishedAt?: string | undefined
  isReply?: boolean | undefined
  parentAuthor?: string | undefined
}) {
  return (
    <div className="flex items-start gap-2.5">
      {/* Avatar */}
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
        {author.avatar ? (
          <img
            src={author.avatar}
            alt={author.name}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          author.name.charAt(0).toUpperCase()
        )}
        {/* Provider badge on avatar */}
        <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-card bg-card">
          <ProviderIcon provider={provider} className="!h-2.5 !w-2.5 text-muted-foreground" />
        </span>
      </span>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-1">
          <span className="truncate text-[13px] font-semibold text-foreground">
            {author.name}
          </span>
          {author.verified && <VerifiedBadge />}
        </div>
        <div className="flex items-center gap-1.5">
          {author.handle && (
            <span className="text-[11px] text-muted-foreground">
              @{author.handle}
            </span>
          )}
          {publishedAt && (
            <>
              <span className="text-[10px] text-muted-foreground/50">&middot;</span>
              <span className="text-[11px] text-muted-foreground">
                {relativeTime(publishedAt)}
              </span>
            </>
          )}
        </div>
        {isReply && parentAuthor && (
          <span className="mt-0.5 text-[10px] text-muted-foreground">
            Replying to <span className="text-primary">@{parentAuthor}</span>
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Repost header ───────────────────────────────────────────────────────────

function RepostBanner({ author }: { author: PostAuthor }) {
  return (
    <div className="flex items-center gap-1.5 px-4 pb-0 pt-2.5">
      <Repeat2 size={12} className="text-muted-foreground" />
      <span className="text-[10px] font-medium text-muted-foreground">
        {author.name} reposted
      </span>
    </div>
  )
}

// ─── Media grid ──────────────────────────────────────────────────────────────

function MediaGrid({ media }: { media: PostMedia[] }) {
  if (media.length === 0) return null

  const count = media.length

  return (
    <div
      className={cn(
        "grid gap-0.5 overflow-hidden rounded-lg",
        count === 1 && "grid-cols-1",
        count === 2 && "grid-cols-2",
        count === 3 && "grid-cols-2",
        count === 4 && "grid-cols-2",
      )}
    >
      {media.map((item, i) => {
        const isVideo = item.type === "video"
        const span = count === 3 && i === 0 ? "row-span-2" : ""

        return (
          <div
            key={i}
            className={cn(
              "relative overflow-hidden bg-muted",
              span,
              count === 1 ? "max-h-72" : "max-h-40",
            )}
          >
            {isVideo ? (
              <div className="relative">
                <img
                  src={item.thumbnail ?? item.url}
                  alt={item.alt ?? "Video thumbnail"}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white">
                    <Play size={16} className="ml-0.5 fill-current" />
                  </span>
                </div>
              </div>
            ) : (
              <img
                src={item.url}
                alt={item.alt ?? "Post media"}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Link preview ────────────────────────────────────────────────────────────

function LinkPreviewCard({ preview }: { preview: PostLinkPreview }) {
  return (
    <a
      href={preview.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex overflow-hidden rounded-lg border transition-colors hover:bg-muted/50"
    >
      {preview.image && (
        <div className="relative h-20 w-20 shrink-0 bg-muted sm:h-24 sm:w-24">
          <img
            src={preview.image}
            alt={preview.title ?? "Link preview"}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 px-3 py-2">
        {preview.domain && (
          <span className="text-[10px] text-muted-foreground">{preview.domain}</span>
        )}
        {preview.title && (
          <span className="line-clamp-1 text-[12px] font-medium text-foreground">
            {preview.title}
          </span>
        )}
        {preview.description && (
          <span className="line-clamp-1 text-[11px] text-muted-foreground">
            {preview.description}
          </span>
        )}
      </div>
    </a>
  )
}

// ─── Engagement metrics ──────────────────────────────────────────────────────

function EngagementMetrics({ metrics }: { metrics: PostMetrics }) {
  const items: { icon: React.ReactNode; value: number; label: string }[] = []

  if (metrics.replies !== undefined) {
    items.push({
      icon: <MessageCircle size={14} />,
      value: metrics.replies,
      label: "replies",
    })
  }

  if (metrics.reposts !== undefined) {
    items.push({
      icon: <Repeat2 size={14} />,
      value: metrics.reposts,
      label: "reposts",
    })
  }

  if (metrics.likes !== undefined) {
    items.push({
      icon: <Heart size={14} />,
      value: metrics.likes,
      label: "likes",
    })
  }

  if (metrics.bookmarks !== undefined) {
    items.push({
      icon: <Bookmark size={14} />,
      value: metrics.bookmarks,
      label: "bookmarks",
    })
  }

  if (metrics.views !== undefined) {
    items.push({
      icon: <Eye size={14} />,
      value: metrics.views,
      label: "views",
    })
  }

  if (items.length === 0) return null

  return (
    <div className="flex items-center gap-4">
      {items.map((item) => (
        <span
          key={item.label}
          className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
          title={`${item.value.toLocaleString()} ${item.label}`}
        >
          {item.icon}
          <span className="text-[11px] tabular-nums">
            {compactNumber(item.value)}
          </span>
        </span>
      ))}
    </div>
  )
}

// ─── PostCard ────────────────────────────────────────────────────────────────

export interface PostCardProps {
  part: ToolPart
  animate?: boolean | undefined
  className?: string | undefined
}

export function PostCard({
  part,
  animate = true,
  className,
}: PostCardProps) {
  if (
    part.state === "input-streaming" ||
    part.state === "input-available" ||
    (part.state === "output-available" && part.output == null)
  ) {
    return (
      <TawSkeleton
        lines={[
          ["40px", "40px"],
          ["14px", "120px"],
          ["12px", "260px"],
          ["12px", "200px"],
          ["10px", "160px"],
        ]}
        className={className}
      />
    )
  }

  if (part.state === "output-error") {
    return (
      <TawError
        title="PostCard"
        message={part.errorText}
        animate={animate}
        className={className}
      />
    )
  }

  const result = safeParse(postCardSchema, part.output)
  if (!result.ok) {
    return (
      <TawError
        title="PostCard"
        message="Schema validation failed"
        issues={result.issues}
        animate={animate}
        className={className}
      />
    )
  }

  const data = result.data

  return (
    <motion.div
      {...getEnterProps(animate)}
      variants={staggerParent}
    >
      <Card
        className={cn("relative gap-0 overflow-hidden py-0", className)}
        data-taw="post-card"
      >
        {data.confidence !== undefined && (
          <ConfidenceBadge confidence={data.confidence} />
        )}

        {/* Repost banner */}
        {data.isRepost && data.repostAuthor && (
          <motion.div variants={enterVariants}>
            <RepostBanner author={data.repostAuthor} />
          </motion.div>
        )}

        {/* Author + content */}
        <motion.div variants={enterVariants} className="flex flex-col gap-2.5 px-4 py-3">
          <AuthorHeader
            author={data.author}
            provider={data.provider}
            publishedAt={data.publishedAt}
            isReply={data.isReply}
            parentAuthor={data.parentAuthor}
          />

          {/* Post content */}
          <div className="pl-[50px]">
            <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-foreground">
              {data.url ? (
                <a
                  href={data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {data.content}
                </a>
              ) : (
                data.content
              )}
            </p>
          </div>
        </motion.div>

        {/* Media */}
        {data.media && data.media.length > 0 && (
          <motion.div variants={enterVariants} className="px-4 pb-2 pl-[66px]">
            <MediaGrid media={data.media} />
          </motion.div>
        )}

        {/* Link preview */}
        {data.linkPreview && (
          <motion.div variants={enterVariants} className="px-4 pb-2 pl-[66px]">
            <LinkPreviewCard preview={data.linkPreview} />
          </motion.div>
        )}

        {/* Engagement metrics */}
        {data.metrics && (
          <motion.div variants={enterVariants} className="border-t px-4 py-2 pl-[66px]">
            <EngagementMetrics metrics={data.metrics} />
          </motion.div>
        )}

        {/* Reasoning */}
        {data.reasoning && (
          <motion.div
            variants={enterVariants}
            className="mx-4 mb-3 mt-1 flex gap-2 rounded-lg bg-primary/5 px-3 py-2"
          >
            <span className="mt-0.5 shrink-0 text-[10px] text-primary">
              {"\u2192"}
            </span>
            <Typewriter
              text={data.reasoning}
              animate={animate}
              className="text-[11px] leading-relaxed text-primary"
            />
          </motion.div>
        )}

        {/* Caveat */}
        {data.caveat && (
          <motion.div
            variants={enterVariants}
            className="mx-4 mb-3 mt-1 flex gap-2 rounded-lg bg-primary/5 px-3 py-2"
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

        {/* Source */}
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
