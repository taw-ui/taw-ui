import { z } from "zod"
import { ConfidenceSchema, CaveatSchema, SourceSchema } from "taw-ui"
import { tawParse, type ParseResult } from "taw-ui"

const EventAttendeeSchema = z.object({
  name: z.string(),
  email: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  responseStatus: z.enum(["accepted", "declined", "tentative", "needsAction"]).optional(),
})

const EventOrganizerSchema = z.object({
  name: z.string(),
  email: z.string().optional(),
  avatarUrl: z.string().url().optional(),
})

export const EventCardSchema = z.object({
  id: z.string(),
  provider: z.enum(["google", "outlook", "calcom", "other"]),
  title: z.string(),
  startAt: z.string(),
  endAt: z.string(),
  isAllDay: z.boolean().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  meetingUrl: z.string().url().optional(),
  status: z.enum(["confirmed", "tentative", "cancelled"]).optional(),
  organizer: EventOrganizerSchema.optional(),
  attendees: z.array(EventAttendeeSchema).optional(),
  calendarName: z.string().optional(),
  url: z.string().url().optional(),
  confidence: ConfidenceSchema,
  caveat: CaveatSchema,
  source: SourceSchema,
})

export type EventCardData = z.infer<typeof EventCardSchema>
export type EventAttendeeData = z.infer<typeof EventAttendeeSchema>
export type EventOrganizerData = z.infer<typeof EventOrganizerSchema>

export function parseEventCard(data: unknown): ParseResult<EventCardData> {
  return tawParse(EventCardSchema, data, "EventCard")
}
