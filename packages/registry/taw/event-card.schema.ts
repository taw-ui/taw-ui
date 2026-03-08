import { z } from "zod"
import { ConfidenceSchema, CaveatSchema, SourceSchema } from "./lib/types"

const EventProviderSchema = z.enum([
  "google",
  "outlook",
  "apple",
  "zoom",
  "teams",
  "calendly",
])

const EventStatusSchema = z.enum([
  "confirmed",
  "tentative",
  "cancelled",
])

const EventAttendeeSchema = z.object({
  name: z.string(),
  email: z.string().optional(),
  avatar: z.string().optional(),
  status: z.enum(["accepted", "declined", "tentative", "pending"]).optional(),
  organizer: z.boolean().optional(),
})

const EventLocationSchema = z.object({
  name: z.string(),
  address: z.string().optional(),
  url: z.string().optional(),
  type: z.enum(["physical", "virtual", "hybrid"]).optional(),
})

export const eventCardSchema = z.object({
  id: z.string(),
  provider: EventProviderSchema.optional(),
  title: z.string(),
  description: z.string().optional(),
  startTime: z.string(),
  endTime: z.string().optional(),
  allDay: z.boolean().optional(),
  status: EventStatusSchema.optional().default("confirmed"),
  location: EventLocationSchema.optional(),
  attendees: z.array(EventAttendeeSchema).max(20).optional(),
  calendar: z.string().optional(),
  color: z.string().optional(),
  recurrence: z.string().optional(),
  url: z.string().optional(),
  reasoning: z.string().optional(),
  confidence: ConfidenceSchema,
  caveat: CaveatSchema,
  source: SourceSchema,
})

export type EventCardData = z.infer<typeof eventCardSchema>
export type EventProvider = z.infer<typeof EventProviderSchema>
export type EventStatus = z.infer<typeof EventStatusSchema>
export type EventAttendee = z.infer<typeof EventAttendeeSchema>
export type EventLocation = z.infer<typeof EventLocationSchema>
