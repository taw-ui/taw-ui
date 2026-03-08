import { z } from "zod"
import { ConfidenceSchema, CaveatSchema, SourceSchema } from "./shared"
import { defineTawContract } from "../contract"

/**
 * Event attendee — minimal identity for display.
 * No full email or auth-related fields; taw-ui doesn't handle identity.
 */
const EventAttendeeSchema = z.object({
  /** Display name */
  name: z.string(),
  /** Email (for display only, not for auth) */
  email: z.string().optional(),
  /** Avatar image URL */
  avatarUrl: z.string().url().optional(),
  /** RSVP response status */
  responseStatus: z.enum(["accepted", "declined", "tentative", "needsAction"]).optional(),
})

/**
 * Event organizer — the person who created the event.
 */
const EventOrganizerSchema = z.object({
  name: z.string(),
  email: z.string().optional(),
  avatarUrl: z.string().url().optional(),
})

/**
 * Canonical event surface schema.
 *
 * Represents a calendar event from any provider
 * (Google Calendar, Outlook, Cal.com, etc.) in a normalized shape.
 *
 * Design principles:
 * - Provider-aware, not provider-dependent
 * - All display-only — no mutation, no auth
 * - Times are ISO 8601 strings (timezone encoded in the string)
 * - Optional fields degrade gracefully in the UI
 */
export const EventCardSchema = z.object({
  /** Stable identifier (e.g. "google:abc123", "outlook:AAMk...") */
  id: z.string(),

  /** Source provider */
  provider: z.enum(["google", "outlook", "calcom", "other"]),

  /** Event title / summary */
  title: z.string(),

  /** Start time (ISO 8601) or date string (YYYY-MM-DD) for all-day events */
  startAt: z.string(),

  /** End time (ISO 8601) or date string (YYYY-MM-DD) for all-day events */
  endAt: z.string(),

  /** Whether this is an all-day event */
  isAllDay: z.boolean().optional(),

  /** Event description / body (truncated for display) */
  description: z.string().optional(),

  /** Physical location or room name */
  location: z.string().optional(),

  /** Video meeting URL (Zoom, Meet, Teams, etc.) */
  meetingUrl: z.string().url().optional(),

  /** Event status */
  status: z.enum(["confirmed", "tentative", "cancelled"]).optional(),

  /** Event organizer */
  organizer: EventOrganizerSchema.optional(),

  /** Attendees list */
  attendees: z.array(EventAttendeeSchema).optional(),

  /** Calendar name (e.g. "Work", "Personal") */
  calendarName: z.string().optional(),

  /** URL back to the event in the provider */
  url: z.string().url().optional(),

  /** AI confidence in this data (0–1) */
  confidence: ConfidenceSchema,

  /** Human-readable uncertainty note */
  caveat: CaveatSchema,

  /** Data provenance */
  source: SourceSchema,
})

export const EventCard = defineTawContract("EventCard", EventCardSchema)

export type EventCardData = typeof EventCard.type
export type EventAttendeeData = z.infer<typeof EventAttendeeSchema>
export type EventOrganizerData = z.infer<typeof EventOrganizerSchema>
