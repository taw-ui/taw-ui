import type { EventCardData } from "../schemas/event-card"

// ─── Microsoft Graph API types (subset) ─────────────────────────────────────
// These are intentionally loose — we don't import @microsoft/microsoft-graph-types
// so there's no SDK lock-in. Any object with these fields works.

export interface OutlookEvent {
  id: string
  subject?: string | null
  bodyPreview?: string | null
  body?: {
    contentType?: string
    content?: string
  } | null
  start?: {
    dateTime: string // ISO 8601 (always present in Graph API)
    timeZone?: string
  } | null
  end?: {
    dateTime: string
    timeZone?: string
  } | null
  isAllDay?: boolean
  location?: {
    displayName?: string
    address?: unknown
  } | null
  locations?: Array<{
    displayName?: string
  }> | null
  webLink?: string | null
  onlineMeeting?: {
    joinUrl?: string | null
  } | null
  onlineMeetingUrl?: string | null
  isOnlineMeeting?: boolean
  showAs?: string // "free" | "tentative" | "busy" | "oof" | "workingElsewhere" | "unknown"
  isCancelled?: boolean
  organizer?: {
    emailAddress?: {
      name?: string
      address?: string
    }
  } | null
  attendees?: Array<{
    emailAddress?: {
      name?: string
      address?: string
    }
    type?: string // "required" | "optional" | "resource"
    status?: {
      response?: string // "none" | "organizer" | "tentativelyAccepted" | "accepted" | "declined" | "notResponded"
    }
  }> | null
  calendar?: string | null
}

/**
 * Transform a Microsoft Graph API event object into canonical EventCard data.
 *
 * This is a pure transformation — no API calls, no auth, no side effects.
 * Your app fetches the event; taw-ui normalizes and renders it.
 *
 * @example
 * ```ts
 * // Your app fetches the data
 * const event = await graphClient.api("/me/events/AAMk...")
 *   .select("id,subject,start,end,location,attendees,organizer")
 *   .get()
 *
 * // taw-ui normalizes it
 * const eventData = fromOutlookEvent(event)
 *
 * // taw-ui renders it
 * <EventCard part={{ id: "1", toolName: "getEvent", state: "output-available", input: {}, output: eventData }} />
 * ```
 */
export function fromOutlookEvent(event: OutlookEvent): EventCardData {
  return {
    id: `outlook:${event.id}`,
    provider: "outlook",
    title: event.subject ?? "Untitled event",
    startAt: event.start?.dateTime ?? "",
    endAt: event.end?.dateTime ?? "",
    isAllDay: event.isAllDay || undefined,
    description: event.bodyPreview ? truncate(event.bodyPreview, 200) : undefined,
    location: event.location?.displayName ?? event.locations?.[0]?.displayName ?? undefined,
    meetingUrl: extractOutlookMeetingUrl(event),
    status: mapOutlookStatus(event),
    organizer: event.organizer?.emailAddress
      ? {
          name: event.organizer.emailAddress.name ?? event.organizer.emailAddress.address ?? "Organizer",
          email: event.organizer.emailAddress.address,
        }
      : undefined,
    attendees: event.attendees
      ?.filter((a) => a.status?.response !== "organizer")
      .map((a) => ({
        name: a.emailAddress?.name ?? a.emailAddress?.address ?? "Unknown",
        email: a.emailAddress?.address,
        responseStatus: mapOutlookResponseStatus(a.status?.response),
      })),
    url: event.webLink ?? undefined,
    source: {
      label: "Outlook Calendar",
      url: event.webLink ?? undefined,
    },
  }
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function mapOutlookStatus(event: OutlookEvent): EventCardData["status"] {
  if (event.isCancelled) return "cancelled"
  if (event.showAs === "tentative") return "tentative"
  return "confirmed"
}

function mapOutlookResponseStatus(response?: string): "accepted" | "declined" | "tentative" | "needsAction" | undefined {
  switch (response) {
    case "accepted": return "accepted"
    case "declined": return "declined"
    case "tentativelyAccepted": return "tentative"
    case "none":
    case "notResponded": return "needsAction"
    default: return undefined
  }
}

function extractOutlookMeetingUrl(event: OutlookEvent): string | undefined {
  return event.onlineMeeting?.joinUrl ?? event.onlineMeetingUrl ?? undefined
}

function truncate(str: string, max: number): string {
  const clean = str.replace(/\r\n/g, "\n").trim()
  if (clean.length <= max) return clean
  return clean.slice(0, max).trimEnd() + "…"
}
