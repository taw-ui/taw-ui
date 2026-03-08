"use client"

import { Check, X, HelpCircle, Monitor, MapPin, Clock, Repeat } from "lucide-react"
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
  eventCardSchema,
  type EventCardData,
  type EventProvider,
  type EventAttendee,
  type EventStatus,
} from "./event-card.schema"

// ─── Provider icons ─────────────────────────────────────────────────────────

function ProviderIcon({
  provider,
  className,
}: {
  provider: EventProvider
  className?: string
}) {
  const c = cn("h-4 w-4 shrink-0", className)

  switch (provider) {
    case "google":
      return (
        <svg viewBox="0 0 16 16" className={c}>
          <path fill="#4285F4" d="M14.5 8.18c0-.5-.04-.86-.13-1.24H8v2.25h3.73a3.22 3.22 0 01-1.39 2.11l2.13 1.65c1.24-1.15 1.96-2.84 1.96-4.77h.07z" />
          <path fill="#34A853" d="M8 15c1.93 0 3.55-.64 4.74-1.73l-2.13-1.65c-.64.43-1.48.73-2.61.73a4.56 4.56 0 01-4.3-3.14L1.42 10.9A8 8 0 008 15z" />
          <path fill="#FBBC05" d="M3.7 9.21a4.8 4.8 0 010-3.06l-2.28-1.7a8 8 0 000 6.46l2.28-1.7z" />
          <path fill="#EA4335" d="M8 3.01c1.08 0 2.05.37 2.82 1.1l2.1-2.1A7.15 7.15 0 008 0 8 8 0 001.42 4.45l2.28 1.7A4.56 4.56 0 018 3z" />
        </svg>
      )
    case "outlook":
      return (
        <svg viewBox="0 0 16 16" fill="currentColor" className={c}>
          <path d="M9.5 7.5v6l5.5-3V4.44L9.5 7.5zM1 3v10l7.5 2V1L1 3zm4.44 8.16c-1.5 0-2.26-1.36-2.26-2.72S3.92 5.7 5.44 5.7c1.56 0 2.25 1.4 2.25 2.74 0 1.36-.7 2.72-2.25 2.72zm.05-4.52c-.84 0-1.2.9-1.2 1.8s.32 1.78 1.16 1.78c.82 0 1.16-.9 1.16-1.8s-.3-1.78-1.12-1.78z" />
        </svg>
      )
    case "apple":
      return (
        <svg viewBox="0 0 16 16" fill="currentColor" className={c}>
          <path d="M12.15 8.57c-.02-1.94 1.58-2.87 1.65-2.91a3.57 3.57 0 00-2.81-1.44c-1.2-.12-2.33.7-2.94.7-.61 0-1.55-.69-2.56-.67a3.78 3.78 0 00-3.18 1.94c-1.36 2.35-.35 5.84.97 7.75.65.94 1.42 1.99 2.43 1.95 .98-.04 1.34-.63 2.52-.63 1.18 0 1.51.63 2.53.61 1.05-.02 1.72-.95 2.36-1.89a8.5 8.5 0 001.07-2.19 3.47 3.47 0 01-2.05-3.22h.01zM10.3 3.1A3.52 3.52 0 0011.12.5a3.58 3.58 0 00-2.31 1.2A3.34 3.34 0 008 4.23a2.95 2.95 0 002.3-1.13z" />
        </svg>
      )
    case "zoom":
      return (
        <svg viewBox="0 0 16 16" fill="currentColor" className={c}>
          <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm-2.5 5h4.17c.73 0 1.33.6 1.33 1.33v2.5L13 10.5V5.5l-2-1.67v2.5a1.33 1.33 0 01-1.33 1.34H5.5A1.33 1.33 0 014.17 6.33V5.5z" />
        </svg>
      )
    case "teams":
      return (
        <svg viewBox="0 0 16 16" fill="currentColor" className={c}>
          <path d="M10.07 4.52h3.86a.53.53 0 01.54.53v3.72a2.47 2.47 0 01-2.46 2.47h-.02a2.47 2.47 0 01-2.46-2.47V5.07c0-.3.24-.55.54-.55zm1.4-1.04a1.48 1.48 0 100-2.96 1.48 1.48 0 000 2.96zM8.2 3.52a1.76 1.76 0 100-3.52 1.76 1.76 0 000 3.52zM1.53 5.07h5.86c.29 0 .53.24.53.53v4.8A2.6 2.6 0 015.32 13H4.13A2.6 2.6 0 011 10.4V5.6c0-.3.24-.53.53-.53z" />
        </svg>
      )
    case "calendly":
      return (
        <svg viewBox="0 0 16 16" fill="currentColor" className={c}>
          <path d="M11.54 10.62a3.4 3.4 0 01-1.78.5H7.82A3.42 3.42 0 014.4 7.7V7.3a3.42 3.42 0 013.42-3.42h1.94a3.4 3.4 0 011.78.5 4.34 4.34 0 011.22-1.1A5.24 5.24 0 009.76 2H7.82A5.42 5.42 0 002.4 7.3v.4a5.42 5.42 0 005.42 5.42h1.94a5.24 5.24 0 003-1.28 4.34 4.34 0 01-1.22-1.1v-.12z" />
        </svg>
      )
  }
}

// ─── Time formatting ─────────────────────────────────────────────────────────

function formatTime(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

function isSameDay(a: string, b: string): boolean {
  const da = new Date(a)
  const db = new Date(b)
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  )
}

function isToday(dateStr: string): boolean {
  return isSameDay(dateStr, new Date().toISOString())
}

function isTomorrow(dateStr: string): boolean {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return isSameDay(dateStr, tomorrow.toISOString())
}

function getDateLabel(dateStr: string): string {
  if (isToday(dateStr)) return "Today"
  if (isTomorrow(dateStr)) return "Tomorrow"
  return formatDate(dateStr)
}

function getDuration(start: string, end: string): string {
  const diff = new Date(end).getTime() - new Date(start).getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  const remaining = mins % 60
  if (remaining === 0) return `${hours}h`
  return `${hours}h ${remaining}m`
}

// ─── Calendar date badge ─────────────────────────────────────────────────────

function DateBadge({ dateStr }: { dateStr: string }) {
  const d = new Date(dateStr)
  const month = d.toLocaleDateString(undefined, { month: "short" }).toUpperCase()
  const day = d.getDate()

  return (
    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg border bg-card">
      <span className="text-[9px] font-bold uppercase tracking-wider text-primary">
        {month}
      </span>
      <span className="text-lg font-bold leading-none text-foreground">
        {day}
      </span>
    </div>
  )
}

// ─── Attendee list ───────────────────────────────────────────────────────────

function AttendeeList({ attendees }: { attendees: EventAttendee[] }) {
  if (attendees.length === 0) return null

  const organizer = attendees.find((a) => a.organizer)
  const others = attendees.filter((a) => !a.organizer)
  const shown = others.slice(0, 5)
  const overflow = others.length - 5

  const statusIcon = (status?: string) => {
    switch (status) {
      case "accepted":
        return <Check size={10} className="text-emerald-500" />
      case "declined":
        return <X size={10} className="text-destructive" />
      case "tentative":
        return <HelpCircle size={10} className="text-amber-500" />
      default:
        return (
          <span className="h-2.5 w-2.5 rounded-full border border-muted-foreground/30" />
        )
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      {organizer && (
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">
            {organizer.avatar ? (
              <img src={organizer.avatar} alt={organizer.name} className="h-full w-full rounded-full object-cover" />
            ) : (
              organizer.name.charAt(0).toUpperCase()
            )}
          </span>
          <span className="text-[11px] font-medium text-foreground">{organizer.name}</span>
          <span className="text-[9px] text-muted-foreground">(organizer)</span>
        </div>
      )}
      <div className="flex flex-wrap gap-1">
        {shown.map((a, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 rounded-full border bg-card px-2 py-0.5"
            title={`${a.name}${a.status ? ` - ${a.status}` : ""}`}
          >
            {statusIcon(a.status)}
            <span className="text-[10px] text-muted-foreground">{a.name}</span>
          </span>
        ))}
        {overflow > 0 && (
          <span className="inline-flex items-center rounded-full border bg-muted/50 px-2 py-0.5 text-[10px] text-muted-foreground">
            +{overflow} more
          </span>
        )}
      </div>
    </div>
  )
}

// ─── Location display ────────────────────────────────────────────────────────

function LocationDisplay({ location }: { location: NonNullable<EventCardData["location"]> }) {
  const icon =
    location.type === "virtual" ? (
      <Monitor size={14} className="shrink-0 text-muted-foreground" />
    ) : (
      <MapPin size={14} className="shrink-0 text-muted-foreground" />
    )

  return (
    <div className="flex items-start gap-1.5">
      {icon}
      <div className="flex flex-col">
        <span className="text-[11px] text-muted-foreground">
          {location.url ? (
            <a
              href={location.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-dotted hover:decoration-solid"
            >
              {location.name}
            </a>
          ) : (
            location.name
          )}
        </span>
        {location.address && (
          <span className="text-[10px] text-muted-foreground/70">{location.address}</span>
        )}
      </div>
    </div>
  )
}

// ─── Status badge ────────────────────────────────────────────────────────────

function EventStatusBadge({ status }: { status: EventStatus }) {
  if (status === "confirmed") return null

  const config: Record<string, { class: string; label: string }> = {
    tentative: {
      class: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      label: "Tentative",
    },
    cancelled: {
      class: "bg-destructive/10 text-destructive",
      label: "Cancelled",
    },
  }

  const c = config[status]
  if (!c) return null

  return (
    <Badge variant="secondary" className={cn("h-5 px-1.5 text-[10px] font-medium", c.class)}>
      {c.label}
    </Badge>
  )
}

// ─── EventCard ───────────────────────────────────────────────────────────────

export interface EventCardProps {
  part: ToolPart
  animate?: boolean | undefined
  className?: string | undefined
}

export function EventCard({
  part,
  animate = true,
  className,
}: EventCardProps) {
  if (
    part.state === "input-streaming" ||
    part.state === "input-available" ||
    (part.state === "output-available" && part.output == null)
  ) {
    return (
      <TawSkeleton
        lines={[
          ["12px", "80px"],
          ["18px", "200px"],
          ["12px", "140px"],
          ["10px", "100px"],
        ]}
        className={className}
      />
    )
  }

  if (part.state === "output-error") {
    return (
      <TawError
        title="EventCard"
        message={part.errorText}
        animate={animate}
        className={className}
      />
    )
  }

  const result = safeParse(eventCardSchema, part.output)
  if (!result.ok) {
    return (
      <TawError
        title="EventCard"
        message="Schema validation failed"
        issues={result.issues}
        animate={animate}
        className={className}
      />
    )
  }

  const data = result.data
  const isCancelled = data.status === "cancelled"

  return (
    <motion.div
      {...getEnterProps(animate)}
      variants={staggerParent}
    >
      <Card
        className={cn("relative gap-0 overflow-hidden py-0", isCancelled && "opacity-75", className)}
        data-taw="event-card"
      >
        {data.confidence !== undefined && (
          <ConfidenceBadge confidence={data.confidence} />
        )}

        {/* Color accent stripe */}
        {data.color && (
          <div
            className="absolute left-0 top-0 h-full w-1"
            style={{ backgroundColor: data.color }}
          />
        )}

        {/* Main content */}
        <div className={cn("flex gap-3 px-4 py-3", data.color && "pl-5")}>
          {/* Date badge */}
          <motion.div variants={enterVariants}>
            <DateBadge dateStr={data.startTime} />
          </motion.div>

          {/* Event details */}
          <motion.div variants={enterVariants} className="flex min-w-0 flex-1 flex-col gap-1.5">
            {/* Provider + calendar + status */}
            <div className="flex items-center gap-2">
              {data.provider && (
                <ProviderIcon provider={data.provider} className="text-muted-foreground" />
              )}
              {data.calendar && (
                <span className="text-[10px] font-medium text-muted-foreground">
                  {data.calendar}
                </span>
              )}
              <EventStatusBadge status={data.status ?? "confirmed"} />
            </div>

            {/* Title */}
            <h3 className={cn(
              "text-[13px] font-semibold leading-snug text-foreground",
              isCancelled && "line-through",
            )}>
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

            {/* Time */}
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Clock size={16} className="shrink-0" />
              {data.allDay ? (
                <span>{getDateLabel(data.startTime)} &middot; All day</span>
              ) : (
                <span>
                  {getDateLabel(data.startTime)} &middot; {formatTime(data.startTime)}
                  {data.endTime && (
                    <>
                      {" "}&ndash;{" "}
                      {isSameDay(data.startTime, data.endTime)
                        ? formatTime(data.endTime)
                        : `${getDateLabel(data.endTime)} ${formatTime(data.endTime)}`}
                      <span className="ml-1 text-muted-foreground/60">
                        ({getDuration(data.startTime, data.endTime)})
                      </span>
                    </>
                  )}
                </span>
              )}
            </div>

            {/* Recurrence */}
            {data.recurrence && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Repeat size={12} className="shrink-0" />
                {data.recurrence}
              </span>
            )}

            {/* Description */}
            {data.description && (
              <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                {data.description}
              </p>
            )}

            {/* Location */}
            {data.location && (
              <LocationDisplay location={data.location} />
            )}
          </motion.div>
        </div>

        {/* Attendees */}
        {data.attendees && data.attendees.length > 0 && (
          <motion.div
            variants={enterVariants}
            className="border-t px-4 py-2.5"
          >
            <AttendeeList attendees={data.attendees} />
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
