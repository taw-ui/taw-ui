import type { EventCardData } from "../schemas/event-card"

// ─── Google Calendar API v3 types (subset) ──────────────────────────────────
// These are intentionally loose — we don't import googleapis
// so there's no SDK lock-in. Any object with these fields works.

export interface GoogleCalendarEvent {
  id: string
  summary?: string
  description?: string | null
  location?: string | null
  status?: string // "confirmed" | "tentative" | "cancelled"
  htmlLink?: string
  hangoutLink?: string | null
  start?: {
    dateTime?: string // ISO 8601 with timezone
    date?: string // YYYY-MM-DD for all-day events
    timeZone?: string
  }
  end?: {
    dateTime?: string
    date?: string
    timeZone?: string
  }
  organizer?: {
    email?: string
    displayName?: string
    self?: boolean
  } | null
  attendees?: Array<{
    email?: string
    displayName?: string
    responseStatus?: string // "accepted" | "declined" | "tentative" | "needsAction"
    self?: boolean
    organizer?: boolean
  }> | null
  conferenceData?: {
    entryPoints?: Array<{
      entryPointType?: string
      uri?: string
    }>
  } | null
  creator?: {
    email?: string
    displayName?: string
  } | null
  calendar?: string | null
}

/**
 * Transform a Google Calendar API v3 event object into canonical EventCard data.
 *
 * This is a pure transformation — no API calls, no auth, no side effects.
 * Your app fetches the event; taw-ui normalizes and renders it.
 *
 * @example
 * ```ts
 * // Your app fetches the data
 * const { data } = await calendar.events.get({
 *   calendarId: "primary",
 *   eventId: "abc123",
 * })
 *
 * // taw-ui normalizes it
 * const eventData = fromGoogleCalendarEvent(data)
 *
 * // taw-ui renders it
 * <EventCard part={{ id: "1", toolName: "getEvent", state: "output-available", input: {}, output: eventData }} />
 * ```
 */
export function fromGoogleCalendarEvent(event: GoogleCalendarEvent): EventCardData {
  const isAllDay = !event.start?.dateTime && !!event.start?.date

  return {
    id: `google:${event.id}`,
    provider: "google",
    title: event.summary ?? "Untitled event",
    startAt: event.start?.dateTime ?? event.start?.date ?? "",
    endAt: event.end?.dateTime ?? event.end?.date ?? "",
    isAllDay: isAllDay || undefined,
    description: event.description ? truncate(event.description, 200) : undefined,
    location: event.location ?? undefined,
    meetingUrl: extractMeetingUrl(event),
    status: mapGoogleStatus(event.status),
    organizer: event.organizer
      ? {
          name: event.organizer.displayName ?? event.organizer.email ?? "Organizer",
          email: event.organizer.email,
        }
      : event.creator
        ? {
            name: event.creator.displayName ?? event.creator.email ?? "Organizer",
            email: event.creator.email,
          }
        : undefined,
    attendees: event.attendees
      ?.filter((a) => !a.organizer)
      .map((a) => ({
        name: a.displayName ?? a.email ?? "Unknown",
        email: a.email,
        responseStatus: mapGoogleResponseStatus(a.responseStatus),
      })),
    url: event.htmlLink,
    source: {
      label: "Google Calendar",
      url: event.htmlLink,
    },
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function mapGoogleStatus(status?: string): EventCardData["status"] {
  switch (status) {
    case "confirmed": return "confirmed"
    case "tentative": return "tentative"
    case "cancelled": return "cancelled"
    default: return undefined
  }
}

function mapGoogleResponseStatus(status?: string): "accepted" | "declined" | "tentative" | "needsAction" | undefined {
  switch (status) {
    case "accepted": return "accepted"
    case "declined": return "declined"
    case "tentative": return "tentative"
    case "needsAction": return "needsAction"
    default: return undefined
  }
}

function extractMeetingUrl(event: GoogleCalendarEvent): string | undefined {
  // Prefer hangoutLink (Google Meet)
  if (event.hangoutLink) return event.hangoutLink
  // Fall back to conferenceData entry points
  const videoEntry = event.conferenceData?.entryPoints?.find(
    (ep) => ep.entryPointType === "video" && ep.uri,
  )
  return videoEntry?.uri ?? undefined
}

function truncate(str: string, max: number): string {
  const clean = str.replace(/\r\n/g, "\n").trim()
  if (clean.length <= max) return clean
  return clean.slice(0, max).trimEnd() + "…"
}
