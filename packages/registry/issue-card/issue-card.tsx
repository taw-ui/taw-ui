"use client"

import { motion } from "framer-motion"
import type { TawToolPart } from "taw-ui"
import { cn } from "../lib/utils"
import { getEnterProps, staggerParent, enterVariants } from "../lib/motion"
import { SourceLabel, TawError, TawSkeleton, ConfidenceBadge } from "../lib/shared"
import { parseIssueCard, type IssueCardData, type IssueLabelData } from "./schema"

// ─── Priority config ────────────────────────────────────────────────────────

const priorityConfig = {
  urgent: { strip: "bg-(--taw-error)", badge: "bg-(--taw-error)/12 text-(--taw-error)", label: "Urgent" },
  high: { strip: "bg-orange-500", badge: "bg-orange-500/12 text-orange-600 dark:text-orange-400", label: "High" },
  medium: { strip: "bg-(--taw-warning)", badge: "bg-(--taw-warning)/12 text-(--taw-warning)", label: "Medium" },
  low: { strip: "bg-(--taw-accent)", badge: "bg-(--taw-accent)/12 text-(--taw-accent)", label: "Low" },
  none: { strip: "bg-(--taw-border-subtle)", badge: "", label: "" },
} as const

// ─── Provider icons (SVG) ───────────────────────────────────────────────────

function ProviderIcon({ provider, className }: { provider: string; className?: string }) {
  const size = 14
  const props = { width: size, height: size, viewBox: "0 0 16 16", fill: "currentColor", className }

  if (provider === "github") {
    return (
      <svg {...props}>
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
      </svg>
    )
  }

  if (provider === "linear") {
    return (
      <svg {...props} viewBox="0 0 100 100">
        <path d="M1.22541 61.5228c-.97698-1.6679-.55558-3.8459.97738-5.0449L56.655 13.0203c1.2036-.9412 2.9053-.9412 4.1088 0l17.2375 13.4856 10.7577 8.418c1.5329 1.199 1.9543 3.377.9773 5.045L35.278 86.9797c-.9769 1.668-3.0867 2.166-4.7546 1.122L1.22541 61.5228z" />
      </svg>
    )
  }

  if (provider === "jira") {
    return (
      <svg {...props} viewBox="0 0 16 16">
        <path d="M15.04 1H7.59l3.83 3.83-6.42 6.42L1.17 7.42V15h7.46l-3.83-3.83 6.42-6.42L14.83 8.58V1z" />
      </svg>
    )
  }

  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

// ─── Status badge ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: IssueCardData["status"] }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium"
      style={{
        backgroundColor: status.color ? `${status.color}18` : undefined,
        color: status.color ?? undefined,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: status.color ?? "currentColor" }}
      />
      {status.label}
    </span>
  )
}

// ─── Label chip ─────────────────────────────────────────────────────────────

function LabelChip({ label }: { label: IssueLabelData }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium bg-(--taw-surface-sunken) text-(--taw-text-muted)"
      style={
        label.color
          ? { backgroundColor: `${label.color}18`, color: label.color }
          : undefined
      }
    >
      {label.color && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: label.color }}
        />
      )}
      {label.name}
    </span>
  )
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
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    if (days < 30) return `${days}d ago`
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
  } catch {
    return ts
  }
}

// ─── Skeleton ───────────────────────────────────────────────────────────────

function IssueCardSkeleton({ animate }: { animate: boolean }) {
  return (
    <TawSkeleton
      lines={[
        ["10px", "100px"],
        ["14px", "240px"],
        ["10px", "180px"],
        ["10px", "120px"],
      ]}
      animate={animate}
      className="min-w-[280px]"
    />
  )
}

// ─── IssueCard ──────────────────────────────────────────────────────────────

export interface IssueCardProps {
  part: TawToolPart<unknown, unknown>
  animate?: boolean | undefined
  className?: string | undefined
}

export function IssueCard({
  part,
  animate = true,
  className,
}: IssueCardProps) {
  const { state, output, error } = part

  if (state === "input-available" || state === "streaming") {
    return <IssueCardSkeleton animate={animate} />
  }

  if (state === "output-error") {
    return <TawError error={error} animate={animate} />
  }

  const result = parseIssueCard(output)
  if (!result.success) {
    return <TawError parseError={result.error} animate={animate} />
  }

  const data = result.data as IssueCardData
  const priority = data.priority ?? "none"
  const pConfig = priorityConfig[priority]

  return (
    <motion.div
      {...getEnterProps(animate)}
      variants={staggerParent}
      className={cn(
        "relative overflow-hidden rounded-(--taw-radius-lg) border shadow-(--taw-shadow-sm)",
        "bg-(--taw-surface) border-(--taw-border)",
        className,
      )}
      data-taw-component="issue-card"
      data-taw-id={data.id}
    >
      {/* Priority accent strip */}
      <div className={cn("absolute left-0 top-0 h-full w-1", pConfig.strip)} />

      {/* Confidence badge */}
      {data.confidence != null && <ConfidenceBadge confidence={data.confidence} />}

      <div className="flex flex-col gap-3 py-4 pr-4 pl-5">
        {/* Provider + project + number */}
        <motion.div variants={enterVariants} className="flex items-center gap-2">
          <span className="text-(--taw-text-muted)">
            <ProviderIcon provider={data.provider} />
          </span>
          {data.project && (
            <span className="text-[11px] font-medium text-(--taw-text-muted)">
              {data.project}
            </span>
          )}
          {data.number != null && (
            <span className="font-mono text-[11px] text-(--taw-text-muted)">
              #{data.number}
            </span>
          )}
        </motion.div>

        {/* Title */}
        <motion.div variants={enterVariants}>
          {data.url ? (
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-(--taw-text-primary) hover:text-(--taw-accent) transition-colors"
            >
              {data.title}
            </a>
          ) : (
            <h3 className="text-sm font-semibold text-(--taw-text-primary)">
              {data.title}
            </h3>
          )}
        </motion.div>

        {/* Status + Priority + Labels row */}
        <motion.div variants={enterVariants} className="flex flex-wrap items-center gap-1.5">
          <StatusBadge status={data.status} />

          {priority !== "none" && pConfig.label && (
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", pConfig.badge)}>
              {pConfig.label}
            </span>
          )}

          {data.labels?.map((label) => (
            <LabelChip key={label.name} label={label} />
          ))}
        </motion.div>

        {/* Description */}
        {data.description && (
          <motion.p
            variants={enterVariants}
            className="line-clamp-2 text-[12px] leading-relaxed text-(--taw-text-muted)"
          >
            {data.description}
          </motion.p>
        )}

        {/* Assignee + timestamps row */}
        <motion.div variants={enterVariants} className="flex items-center gap-3">
          {data.assignee && (
            <div className="flex items-center gap-1.5">
              {data.assignee.avatarUrl ? (
                <img
                  src={data.assignee.avatarUrl}
                  alt=""
                  className="h-4 w-4 rounded-full"
                />
              ) : (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-(--taw-surface-sunken) text-[8px] font-bold uppercase text-(--taw-text-muted)">
                  {data.assignee.name.charAt(0)}
                </span>
              )}
              <span className="text-[11px] text-(--taw-text-muted)">
                {data.assignee.name}
              </span>
            </div>
          )}

          {data.createdAt && (
            <span className="text-[10px] text-(--taw-text-muted)">
              {formatTimestamp(data.createdAt)}
            </span>
          )}

          {data.updatedAt && (
            <>
              <span className="text-[10px] text-(--taw-border)">·</span>
              <span className="text-[10px] text-(--taw-text-muted)">
                updated {formatTimestamp(data.updatedAt)}
              </span>
            </>
          )}
        </motion.div>

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
