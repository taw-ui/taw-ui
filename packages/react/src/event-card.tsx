"use client"

import { motion } from "framer-motion"
import {
  EventCard as EventCardContract,
  type EventCardData,
  type EventAttendeeData,
  type TawToolPart,
} from "taw-ui"

import { cn } from "./utils/cn"
import { getEnterProps, staggerParent, enterVariants } from "./motion"
import { SourceLabel, TawError, TawSkeleton, ConfidenceBadge } from "./shared"

// ─── Status config ──────────────────────────────────────────────────────────

const statusConfig = {
  confirmed: { strip: "bg-(--taw-success)", label: "Confirmed", dot: "bg-(--taw-success)" },
  tentative: { strip: "bg-(--taw-warning)", label: "Tentative", dot: "bg-(--taw-warning)" },
  cancelled: { strip: "bg-(--taw-error)", label: "Cancelled", dot: "bg-(--taw-error)" },
} as const

// ─── Provider icons (SVG) ───────────────────────────────────────────────────

function ProviderIcon({ provider, className }: { provider: string; className?: string }) {
  const size = 14
  const props = { width: size, height: size, viewBox: "0 0 16 16", fill: "currentColor", className }

  if (provider === "google") {
    return (
      <svg {...props} viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    )
  }

  if (provider === "outlook") {
    return (
      <svg {...props} viewBox="0 0 24 24">
        <path d="M24 7.387v10.478c0 .23-.08.424-.238.576a.806.806 0 01-.588.234h-8.42v-8.07l1.2.9 1.705-1.46V7.387h6.103c.23 0 .424.08.588.233.16.153.238.348.238.577zM16.92 10.238l-1.2-.9-.966.83v-2.18l2.166 2.25zM14.754 4.636v3.675l-1.564 1.35-.424-.312L8.282 5.82V4.636c0-.237.088-.44.263-.606a.866.866 0 01.616-.244h5.03a.82.82 0 01.563.244.83.83 0 01.263.606h-.263zM8.282 5.82l4.484 3.529-4.484 3.866V5.82zM15.174 19.35H1.463c-.207 0-.381-.069-.524-.206A.687.687 0 01.734 18.6V6.587c0-.207.068-.381.205-.524a.687.687 0 01.524-.206H6.78v7.897l1.502-1.29 4.472-3.857V18.6c0 .207-.069.383-.206.544a.765.765 0 01-.544.206h.17z" fill="#0078D4" />
      </svg>
    )
  }

  if (provider === "calcom") {
    return (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    )
  }

  // Generic fallback — calendar icon
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

// ─── Response status indicator ──────────────────────────────────────────────

const responseColors = {
  accepted: "bg-(--taw-success)",
  declined: "bg-(--taw-error)",
  tentative: "bg-(--taw-warning)",
  needsAction: "bg-(--taw-text-disabled)",
} as const

// ─── Time formatting ────────────────────────────────────────────────────────

function formatEventTime(startAt: string, endAt: string, isAllDay?: boolean): string {
  if (isAllDay) {
    return formatAllDayRange(startAt, endAt)
  }

  try {
    const start = new Date(startAt)
    const end = new Date(endAt)

    const sameDay = start.toDateString() === end.toDateString()
    const timeOpts: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" }
    const dateOpts: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" }

    if (sameDay) {
      const dateStr = start.toLocaleDateString(undefined, dateOpts)
      const startTime = start.toLocaleTimeString(undefined, timeOpts)
      const endTime = end.toLocaleTimeString(undefined, timeOpts)
      return `${dateStr} · ${startTime} – ${endTime}`
    }

    const startStr = start.toLocaleDateString(undefined, { ...dateOpts, ...timeOpts })
    const endStr = end.toLocaleDateString(undefined, { ...dateOpts, ...timeOpts })
    return `${startStr} – ${endStr}`
  } catch {
    return `${startAt} – ${endAt}`
  }
}

function formatAllDayRange(startAt: string, endAt: string): string {
  try {
    const dateOpts: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" }
    // All-day dates are YYYY-MM-DD; parse as UTC to avoid timezone shift
    const start = parseDate(startAt)
    const end = parseDate(endAt)

    // Google uses exclusive end date for all-day — if end is 1 day after start, it's a single day
    const diffDays = Math.round((end.getTime() - start.getTime()) / 86400000)
    if (diffDays <= 1) {
      return `${start.toLocaleDateString(undefined, dateOpts)} · All day`
    }

    // Subtract 1 from end to show inclusive range
    const endInclusive = new Date(end.getTime() - 86400000)
    return `${start.toLocaleDateString(undefined, dateOpts)} – ${endInclusive.toLocaleDateString(undefined, dateOpts)} · All day`
  } catch {
    return `${startAt} – ${endAt}`
  }
}

function parseDate(dateStr: string): Date {
  // Handle YYYY-MM-DD without timezone shift
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split("-").map(Number)
    return new Date(y!, m! - 1, d)
  }
  return new Date(dateStr)
}

function formatDuration(startAt: string, endAt: string, isAllDay?: boolean): string | null {
  if (isAllDay) return null
  try {
    const ms = new Date(endAt).getTime() - new Date(startAt).getTime()
    if (ms <= 0) return null
    const mins = Math.round(ms / 60000)
    if (mins < 60) return `${mins}m`
    const hrs = Math.floor(mins / 60)
    const rem = mins % 60
    return rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`
  } catch {
    return null
  }
}

// ─── Skeleton ───────────────────────────────────────────────────────────────

function EventCardSkeleton({ animate }: { animate: boolean }) {
  return (
    <TawSkeleton
      lines={[
        ["10px", "100px"],
        ["14px", "220px"],
        ["10px", "200px"],
        ["10px", "140px"],
        ["10px", "100px"],
      ]}
      animate={animate}
      className="min-w-[280px]"
    />
  )
}

// ─── EventCard ──────────────────────────────────────────────────────────────

export interface EventCardProps {
  part: TawToolPart<unknown, unknown>
  animate?: boolean | undefined
  className?: string | undefined
}

export function EventCard({
  part,
  animate = true,
  className,
}: EventCardProps) {
  const { state, output, error } = part

  if (state === "input-available" || state === "streaming") {
    return <EventCardSkeleton animate={animate} />
  }

  if (state === "output-error") {
    return <TawError error={error} animate={animate} />
  }

  const result = EventCardContract.parse(output)
  if (!result.success) {
    return <TawError parseError={result.error} animate={animate} />
  }

  const data = result.data as EventCardData
  const status = data.status ?? "confirmed"
  const sConfig = statusConfig[status]
  const duration = formatDuration(data.startAt, data.endAt, data.isAllDay)
  const attendeeCount = data.attendees?.length ?? 0

  return (
    <motion.div
      {...getEnterProps(animate)}
      variants={staggerParent}
      className={cn(
        "relative overflow-hidden rounded-(--taw-radius-lg) border shadow-(--taw-shadow-sm)",
        "bg-(--taw-surface) border-(--taw-border)",
        className,
      )}
      data-taw-component="event-card"
      data-taw-id={data.id}
    >
      {/* Status accent strip */}
      <div className={cn("absolute left-0 top-0 h-full w-1", sConfig.strip)} />

      {/* Confidence badge */}
      {data.confidence != null && <ConfidenceBadge confidence={data.confidence} />}

      <div className="flex flex-col gap-3 py-4 pr-4 pl-5">
        {/* Provider + calendar name */}
        <motion.div variants={enterVariants} className="flex items-center gap-2">
          <span className="text-(--taw-text-muted)">
            <ProviderIcon provider={data.provider} />
          </span>
          {data.calendarName && (
            <span className="text-[11px] font-medium text-(--taw-text-muted)">
              {data.calendarName}
            </span>
          )}
          {status === "cancelled" && (
            <span className="rounded-full bg-(--taw-error)/12 px-2 py-0.5 text-[10px] font-medium text-(--taw-error)">
              Cancelled
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
              className={cn(
                "text-sm font-semibold transition-colors hover:text-(--taw-accent)",
                status === "cancelled"
                  ? "text-(--taw-text-muted) line-through"
                  : "text-(--taw-text-primary)",
              )}
            >
              {data.title}
            </a>
          ) : (
            <h3 className={cn(
              "text-sm font-semibold",
              status === "cancelled"
                ? "text-(--taw-text-muted) line-through"
                : "text-(--taw-text-primary)",
            )}>
              {data.title}
            </h3>
          )}
        </motion.div>

        {/* Time block */}
        <motion.div variants={enterVariants} className="flex items-center gap-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-(--taw-text-muted)">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="text-[12px] font-medium text-(--taw-text-secondary)">
            {formatEventTime(data.startAt, data.endAt, data.isAllDay)}
          </span>
          {duration && (
            <span className="rounded-full bg-(--taw-surface-sunken) px-1.5 py-0.5 text-[10px] font-medium text-(--taw-text-muted)">
              {duration}
            </span>
          )}
          {data.isAllDay && (
            <span className="rounded-full bg-(--taw-accent-subtle) px-1.5 py-0.5 text-[10px] font-medium text-(--taw-accent)">
              All day
            </span>
          )}
        </motion.div>

        {/* Location + meeting URL */}
        {(data.location || data.meetingUrl) && (
          <motion.div variants={enterVariants} className="flex flex-col gap-1.5">
            {data.location && (
              <div className="flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-(--taw-text-muted)">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="text-[12px] text-(--taw-text-muted)">
                  {data.location}
                </span>
              </div>
            )}
            {data.meetingUrl && (
              <div className="flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-(--taw-accent)">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
                <a
                  href={data.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] font-medium text-(--taw-accent) hover:underline"
                >
                  Join meeting
                </a>
              </div>
            )}
          </motion.div>
        )}

        {/* Status badge (for tentative only — confirmed is default, cancelled shown in header) */}
        {status === "tentative" && (
          <motion.div variants={enterVariants}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-(--taw-warning)/12 px-2 py-0.5 text-[10px] font-medium text-(--taw-warning)">
              <span className={cn("h-1.5 w-1.5 rounded-full", sConfig.dot)} />
              {sConfig.label}
            </span>
          </motion.div>
        )}

        {/* Organizer + attendees */}
        {(data.organizer || attendeeCount > 0) && (
          <motion.div variants={enterVariants} className="flex items-center gap-3">
            {data.organizer && (
              <div className="flex items-center gap-1.5">
                {data.organizer.avatarUrl ? (
                  <img src={data.organizer.avatarUrl} alt="" className="h-4 w-4 rounded-full" />
                ) : (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-(--taw-accent-subtle) text-[8px] font-bold uppercase text-(--taw-accent)">
                    {data.organizer.name.charAt(0)}
                  </span>
                )}
                <span className="text-[11px] text-(--taw-text-muted)">
                  {data.organizer.name}
                </span>
              </div>
            )}

            {attendeeCount > 0 && (
              <div className="flex items-center gap-1">
                {/* Show up to 4 attendee avatars */}
                <div className="flex -space-x-1">
                  {data.attendees!.slice(0, 4).map((a, i) => (
                    <AttendeeAvatar key={i} attendee={a} />
                  ))}
                </div>
                {attendeeCount > 4 && (
                  <span className="text-[10px] text-(--taw-text-muted)">
                    +{attendeeCount - 4}
                  </span>
                )}
                {attendeeCount <= 4 && (
                  <span className="ml-1 text-[10px] text-(--taw-text-muted)">
                    {attendeeCount} attendee{attendeeCount !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Description */}
        {data.description && (
          <motion.p
            variants={enterVariants}
            className="line-clamp-2 text-[12px] leading-relaxed text-(--taw-text-muted)"
          >
            {data.description}
          </motion.p>
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

// ─── Attendee avatar with response status ───────────────────────────────────

function AttendeeAvatar({ attendee }: { attendee: EventAttendeeData }) {
  const statusColor = attendee.responseStatus
    ? responseColors[attendee.responseStatus]
    : undefined

  return (
    <span className="relative" title={attendee.name}>
      {attendee.avatarUrl ? (
        <img src={attendee.avatarUrl} alt="" className="h-5 w-5 rounded-full ring-2 ring-(--taw-surface)" />
      ) : (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--taw-surface-sunken) text-[8px] font-bold uppercase text-(--taw-text-muted) ring-2 ring-(--taw-surface)">
          {attendee.name.charAt(0)}
        </span>
      )}
      {statusColor && (
        <span className={cn("absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ring-1 ring-(--taw-surface)", statusColor)} />
      )}
    </span>
  )
}
