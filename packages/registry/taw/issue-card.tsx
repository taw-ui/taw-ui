"use client"

import { CircleCheck, CircleX, Circle, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  issueCardSchema,
  type IssueProvider,
  type IssuePriority,
  type IssueStatus,
  type IssueAssignee,
} from "./issue-card.schema"

// ─── Provider icons ─────────────────────────────────────────────────────────

function ProviderIcon({
  provider,
  className,
}: {
  provider: IssueProvider
  className?: string
}) {
  const c = cn("h-4 w-4 shrink-0", className)

  switch (provider) {
    case "github":
      return (
        <svg viewBox="0 0 16 16" fill="currentColor" className={c}>
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
      )
    case "gitlab":
      return (
        <svg viewBox="0 0 16 16" fill="currentColor" className={c}>
          <path d="M15.97 9.058l-.895-2.756L13.3.842a.37.37 0 00-.704 0L10.82 6.302H5.18L3.404.842a.37.37 0 00-.704 0L.924 6.302.03 9.058a.739.739 0 00.268.826L8 15.346l7.703-5.462a.739.739 0 00.268-.826" />
        </svg>
      )
    case "jira":
      return (
        <svg viewBox="0 0 16 16" fill="currentColor" className={c}>
          <path d="M15.62 7.33L8.7.4 8.02-.27l-5.4 5.4L.33 7.42a.45.45 0 000 .64l4.75 4.75 2.93 2.93 5.4-5.4.21-.22 2-1.79a.45.45 0 000-.64l-.01-.16zM8.02 10.2L5.56 7.74l2.46-2.46 2.46 2.46-2.46 2.46z" />
        </svg>
      )
    case "linear":
      return (
        <svg viewBox="0 0 16 16" fill="currentColor" className={c}>
          <path d="M.34 9.76a7.97 7.97 0 005.9 5.9L.34 9.76zm-.2-1.42a8.02 8.02 0 017.52-8.2L.14 8.34zm1.36 3.2l6.18-6.18a8.04 8.04 0 00-1.02-.7L.8 11.54c.2.26.43.5.7.7zm1.68 1.18L9.36 6.54a8.1 8.1 0 00-1.24-.46l-5.24 5.24c.14.44.32.86.54 1.24v.02l-.04-.02zm1.44.94l5.32-5.32a8 8 0 00-1.6-.22L3.62 13.84c.3.26.62.5.96.7l.04.02-.04-.1zm2.3.34a8 8 0 005.94-2.14L7.72 6.72a8 8 0 00-.8 6.28z" />
        </svg>
      )
    case "asana":
      return (
        <svg viewBox="0 0 16 16" fill="currentColor" className={c}>
          <path d="M11.6 7.22a3.4 3.4 0 100 6.8 3.4 3.4 0 000-6.8zm-7.2 0a3.4 3.4 0 100 6.8 3.4 3.4 0 000-6.8zM8 1.98a3.4 3.4 0 100 6.8 3.4 3.4 0 000-6.8z" />
        </svg>
      )
    case "shortcut":
      return (
        <svg viewBox="0 0 16 16" fill="currentColor" className={c}>
          <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm3.5 9.5a2 2 0 01-2 2h-3a2 2 0 01-2-2v-3a2 2 0 012-2h3a2 2 0 012 2v3z" />
        </svg>
      )
  }
}

// ─── Status indicator ────────────────────────────────────────────────────────

function StatusIndicator({ status }: { status: IssueStatus }) {
  const config: Record<IssueStatus, { color: string; label: string }> = {
    open: {
      color: "bg-emerald-500",
      label: "Open",
    },
    in_progress: {
      color: "bg-blue-500",
      label: "In Progress",
    },
    in_review: {
      color: "bg-violet-500",
      label: "In Review",
    },
    done: {
      color: "bg-emerald-500",
      label: "Done",
    },
    closed: {
      color: "bg-muted-foreground/40",
      label: "Closed",
    },
    cancelled: {
      color: "bg-muted-foreground/40",
      label: "Cancelled",
    },
  }

  const { color, label } = config[status]
  const isDone = status === "done" || status === "closed" || status === "cancelled"

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="relative flex h-2.5 w-2.5 items-center justify-center">
        {isDone ? (
          status === "done" ? (
            <CircleCheck size={10} className="text-emerald-500" />
          ) : status === "cancelled" ? (
            <CircleX size={10} className="text-muted-foreground/40" />
          ) : (
            <Circle size={10} className="fill-current text-muted-foreground/40" />
          )
        ) : (
          <>
            <span className={cn("h-2 w-2 rounded-full", color)} />
            {(status === "open" || status === "in_progress") && (
              <span className={cn("absolute h-2 w-2 animate-ping rounded-full opacity-40", color)} />
            )}
          </>
        )}
      </span>
      <span className="text-[11px] font-medium text-muted-foreground">
        {label}
      </span>
    </span>
  )
}

// ─── Priority icon ───────────────────────────────────────────────────────────

function PriorityIcon({ priority }: { priority: IssuePriority }) {
  if (priority === "none") return null

  const colors: Record<string, string> = {
    critical: "text-red-600 dark:text-red-400",
    high: "text-amber-600 dark:text-amber-400",
    medium: "text-blue-600 dark:text-blue-400",
    low: "text-muted-foreground",
  }

  const labels: Record<string, string> = {
    critical: "Critical",
    high: "High",
    medium: "Medium",
    low: "Low",
  }

  return (
    <span
      className={cn("inline-flex items-center gap-1", colors[priority])}
      title={`Priority: ${labels[priority]}`}
    >
      {priority === "critical" ? (
        <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M7 2v6M7 11v.5" />
          <circle cx="7" cy="7" r="6" />
        </svg>
      ) : (
        <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="currentColor">
          {priority === "high" && (
            <>
              <rect x="1" y="2" width="2.5" height="10" rx="0.5" />
              <rect x="5.5" y="2" width="2.5" height="10" rx="0.5" />
              <rect x="10" y="2" width="2.5" height="10" rx="0.5" />
            </>
          )}
          {priority === "medium" && (
            <>
              <rect x="1" y="5" width="2.5" height="7" rx="0.5" />
              <rect x="5.5" y="2" width="2.5" height="10" rx="0.5" />
              <rect x="10" y="5" width="2.5" height="7" rx="0.5" opacity="0.3" />
            </>
          )}
          {priority === "low" && (
            <>
              <rect x="1" y="8" width="2.5" height="4" rx="0.5" />
              <rect x="5.5" y="8" width="2.5" height="4" rx="0.5" opacity="0.3" />
              <rect x="10" y="8" width="2.5" height="4" rx="0.5" opacity="0.3" />
            </>
          )}
        </svg>
      )}
    </span>
  )
}

// ─── Avatar stack ────────────────────────────────────────────────────────────

function AvatarStack({ assignees }: { assignees: IssueAssignee[] }) {
  if (assignees.length === 0) return null

  return (
    <div className="flex -space-x-1.5">
      {assignees.slice(0, 4).map((a, i) => (
        <span
          key={i}
          className="relative inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-card bg-muted text-[9px] font-medium text-muted-foreground"
          title={a.name}
        >
          {a.avatar ? (
            <img
              src={a.avatar}
              alt={a.name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            a.name.charAt(0).toUpperCase()
          )}
        </span>
      ))}
      {assignees.length > 4 && (
        <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-card bg-muted text-[8px] font-medium text-muted-foreground">
          +{assignees.length - 4}
        </span>
      )}
    </div>
  )
}

// ─── Relative time ───────────────────────────────────────────────────────────

function relativeTime(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = now - then
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 30) return `${days}d ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

// ─── IssueCard ───────────────────────────────────────────────────────────────

export interface IssueCardProps {
  part: ToolPart
  animate?: boolean | undefined
  className?: string | undefined
}

export function IssueCard({
  part,
  animate = true,
  className,
}: IssueCardProps) {
  if (
    part.state === "input-streaming" ||
    part.state === "input-available" ||
    (part.state === "output-available" && part.output == null)
  ) {
    return (
      <TawSkeleton
        lines={[
          ["14px", "100px"],
          ["18px", "240px"],
          ["12px", "180px"],
          ["10px", "60px"],
        ]}
        className={className}
      />
    )
  }

  if (part.state === "output-error") {
    return (
      <TawError
        title="IssueCard"
        message={part.errorText}
        animate={animate}
        className={className}
      />
    )
  }

  const result = safeParse(issueCardSchema, part.output)
  if (!result.ok) {
    return (
      <TawError
        title="IssueCard"
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
        data-taw="issue-card"
      >
        {data.confidence !== undefined && (
          <ConfidenceBadge confidence={data.confidence} />
        )}

        {/* Header: provider + identifier + status */}
        <motion.div
          variants={enterVariants}
          className="flex items-center gap-2 border-b px-4 py-2.5"
        >
          <ProviderIcon
            provider={data.provider}
            className="text-muted-foreground"
          />

          {data.repository && (
            <span className="text-[11px] text-muted-foreground">
              {data.repository}
            </span>
          )}
          {data.project && !data.repository && (
            <span className="text-[11px] text-muted-foreground">
              {data.project}
            </span>
          )}

          <span className="font-mono text-[11px] font-medium text-muted-foreground">
            {data.identifier}
          </span>

          <span className="ml-auto">
            <StatusIndicator status={data.status} />
          </span>
        </motion.div>

        {/* Body */}
        <motion.div variants={enterVariants} className="flex flex-col gap-2 px-4 py-3">
          {/* Title */}
          <div className="flex items-start gap-2">
            {data.priority && <PriorityIcon priority={data.priority} />}
            <h3 className="flex-1 text-[13px] font-semibold leading-snug text-foreground">
              {data.url ? (
                <a
                  href={data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {data.title}
                </a>
              ) : (
                data.title
              )}
            </h3>
          </div>

          {/* Description */}
          {data.description && (
            <p className="line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">
              {data.description}
            </p>
          )}

          {/* Labels */}
          {data.labels && data.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {data.labels.map((label, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="h-5 px-1.5 text-[10px] font-medium"
                  style={
                    label.color
                      ? {
                          backgroundColor: `${label.color}18`,
                          color: label.color,
                          borderColor: `${label.color}30`,
                        }
                      : undefined
                  }
                >
                  {label.name}
                </Badge>
              ))}
            </div>
          )}
        </motion.div>

        {/* Footer: author, assignees, comments, timestamps */}
        <motion.div
          variants={enterVariants}
          className="flex items-center gap-3 border-t px-4 py-2"
        >
          {data.author && (
            <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              {data.author.avatar ? (
                <img
                  src={data.author.avatar}
                  alt={data.author.name}
                  className="h-3.5 w-3.5 rounded-full"
                />
              ) : (
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-muted text-[8px] font-medium">
                  {data.author.name.charAt(0).toUpperCase()}
                </span>
              )}
              {data.author.name}
            </span>
          )}

          {data.commentCount !== undefined && data.commentCount > 0 && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <MessageSquare size={12} />
              {data.commentCount}
            </span>
          )}

          {data.createdAt && (
            <span className="text-[10px] text-muted-foreground">
              {relativeTime(data.createdAt)}
            </span>
          )}

          {data.assignees && data.assignees.length > 0 && (
            <span className="ml-auto">
              <AvatarStack assignees={data.assignees} />
            </span>
          )}
        </motion.div>

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
