import type { ToolPart } from "@/components/taw/lib/types"

export const eventCardOptions = [
  { key: "description", label: "description", defaultOn: true },
  { key: "location", label: "location", defaultOn: true },
  { key: "attendees", label: "attendees", defaultOn: true },
  { key: "confidence", label: "confidence", defaultOn: false },
  { key: "caveat", label: "caveat", defaultOn: false },
  { key: "source", label: "source", defaultOn: false },
]

// ─── Example: Google Calendar event ──────────────────────────────────────────

export const googleEventFixture: ToolPart = {
  toolCallId: "gcal-1",
  toolName: "getEvent",
  input: { calendarId: "primary", eventId: "abc123" },
  state: "output-available",
  output: {
    id: "google:abc123def456",
    provider: "google",
    title: "Q1 Planning — Product & Engineering Sync",
    startTime: "2026-03-10T10:00:00-08:00",
    endTime: "2026-03-10T11:30:00-08:00",
    status: "confirmed",
    description: "Quarterly planning session to align on product roadmap priorities, engineering capacity, and key deliverables for Q1. Please review the pre-read doc before joining.",
    location: { name: "Conference Room 4B", type: "physical" },
    attendees: [
      { name: "Sarah Chen", email: "sarah@acme.com", organizer: true, status: "accepted" },
      { name: "James Wilson", email: "james@acme.com", status: "accepted" },
      { name: "Priya Patel", email: "priya@acme.com", status: "accepted" },
      { name: "Alex Kim", email: "alex@acme.com", status: "tentative" },
      { name: "Maria Garcia", email: "maria@acme.com", status: "pending" },
    ],
    calendar: "Work",
    url: "https://calendar.google.com/calendar/event?eid=abc123",
    source: { label: "Google Calendar", url: "https://calendar.google.com/calendar/event?eid=abc123" },
  },
}

// ─── Example: Outlook event ──────────────────────────────────────────────────

export const outlookEventFixture: ToolPart = {
  toolCallId: "outlook-1",
  toolName: "getEvent",
  input: { eventId: "AAMkAGI1..." },
  state: "output-available",
  output: {
    id: "outlook:AAMkAGI1AAA",
    provider: "outlook",
    title: "Design Review: New Dashboard Components",
    startTime: "2026-03-11T14:00:00-05:00",
    endTime: "2026-03-11T15:00:00-05:00",
    status: "confirmed",
    description: "Review the latest Figma mockups for the analytics dashboard redesign. Focus on the new chart components and data visualization patterns.",
    location: { name: "Microsoft Teams", url: "https://teams.microsoft.com/l/meetup-join/abc123", type: "virtual" },
    attendees: [
      { name: "David Park", email: "david@contoso.com", organizer: true, status: "accepted" },
      { name: "Emma Thompson", status: "accepted" },
      { name: "Raj Patel", status: "accepted" },
      { name: "Lisa Wang", status: "declined" },
    ],
    calendar: "Calendar",
    url: "https://outlook.office365.com/calendar/item/AAMkAGI1AAA",
    source: { label: "Outlook Calendar", url: "https://outlook.office365.com/calendar/item/AAMkAGI1AAA" },
  },
}

// ─── All-day event ──────────────────────────────────────────────────────────

export const allDayEventFixture: ToolPart = {
  toolCallId: "allday-1",
  toolName: "getEvent",
  input: { calendarId: "primary", eventId: "allday1" },
  state: "output-available",
  output: {
    id: "google:allday1",
    provider: "google",
    title: "Company Offsite — Mountain View",
    startTime: "2026-03-16",
    endTime: "2026-03-18",
    allDay: true,
    status: "confirmed",
    location: { name: "Googleplex, Mountain View, CA", type: "physical" },
    description: "Annual company offsite. Day 1: Strategy sessions. Day 2: Team building activities. Breakfast and lunch provided.",
    attendees: [
      { name: "HR Team", organizer: true },
    ],
    calendar: "Company Events",
    source: { label: "Google Calendar" },
  },
}

// ─── Tentative event ────────────────────────────────────────────────────────

export const tentativeEventFixture: ToolPart = {
  toolCallId: "tent-1",
  toolName: "getEvent",
  input: { eventId: "tent123" },
  state: "output-available",
  output: {
    id: "outlook:tent123",
    provider: "outlook",
    title: "1:1 with Manager",
    startTime: "2026-03-12T09:00:00-05:00",
    endTime: "2026-03-12T09:30:00-05:00",
    status: "tentative",
    location: { name: "Microsoft Teams", url: "https://teams.microsoft.com/l/meetup-join/tent123", type: "virtual" },
    attendees: [
      { name: "Kate Rodriguez", organizer: true },
    ],
    calendar: "Calendar",
  },
}

// ─── Cancelled event ────────────────────────────────────────────────────────

export const cancelledEventFixture: ToolPart = {
  toolCallId: "canc-1",
  toolName: "getEvent",
  input: { calendarId: "primary", eventId: "canc1" },
  state: "output-available",
  output: {
    id: "google:canc1",
    provider: "google",
    title: "Sprint Retrospective",
    startTime: "2026-03-13T16:00:00-08:00",
    endTime: "2026-03-13T17:00:00-08:00",
    status: "cancelled",
    attendees: [
      { name: "Mike Johnson", organizer: true },
    ],
    calendar: "Engineering",
  },
}

// ─── Minimal event ──────────────────────────────────────────────────────────

export const minimalEventFixture: ToolPart = {
  toolCallId: "min-1",
  toolName: "getEvent",
  input: { eventId: "xyz" },
  state: "output-available",
  output: {
    id: "google:xyz",
    provider: "google",
    title: "Lunch with Alex",
    startTime: "2026-03-10T12:00:00Z",
    endTime: "2026-03-10T13:00:00Z",
  },
}

// ─── Event with caveat / confidence ─────────────────────────────────────────

export const eventWithCaveatFixture: ToolPart = {
  toolCallId: "cav-1",
  toolName: "getEvent",
  input: { calendarId: "primary", eventId: "maybe1" },
  state: "output-available",
  output: {
    id: "google:maybe1",
    provider: "google",
    title: "Vendor Demo — Observability Platform",
    startTime: "2026-03-14T11:00:00-08:00",
    endTime: "2026-03-14T12:00:00-08:00",
    status: "confirmed",
    location: { name: "Zoom", url: "https://zoom.us/j/123456789", type: "virtual" },
    attendees: [
      { name: "Procurement Team", organizer: true },
      { name: "You", status: "accepted" },
      { name: "CTO", status: "tentative" },
    ],
    confidence: 0.68,
    caveat: "This event was inferred from an email thread — it may not be on your calendar yet.",
    source: { label: "Google Calendar" },
  },
}

// ─── All fixtures for ComponentPreview ───────────────────────────────────────

export const eventCardFixtures: Record<string, ToolPart> = {
  ready: googleEventFixture,
  outlook: outlookEventFixture,
  "all-day": allDayEventFixture,
  tentative: tentativeEventFixture,
  cancelled: cancelledEventFixture,
  minimal: minimalEventFixture,
  caveat: eventWithCaveatFixture,
  loading: {
    toolCallId: "ec-load",
    toolName: "getEvent",
    input: { calendarId: "primary", eventId: "loading" },
    state: "input-available",
  },
  error: {
    toolCallId: "ec-err",
    toolName: "getEvent",
    input: { calendarId: "primary", eventId: "999" },
    state: "output-error",
    errorText: "Event not found or access denied",
  },
}

// ─── Raw provider examples (for adapter documentation) ──────────────────────

/**
 * Example raw Google Calendar API v3 response shape.
 */
export const rawGoogleCalendarEventExample = {
  id: "abc123def456",
  summary: "Q1 Planning — Product & Engineering Sync",
  description: "Quarterly planning session to align on product roadmap priorities, engineering capacity, and key deliverables for Q1.",
  location: "Conference Room 4B",
  status: "confirmed",
  htmlLink: "https://calendar.google.com/calendar/event?eid=abc123",
  hangoutLink: "https://meet.google.com/abc-defg-hij",
  start: {
    dateTime: "2026-03-10T10:00:00-08:00",
    timeZone: "America/Los_Angeles",
  },
  end: {
    dateTime: "2026-03-10T11:30:00-08:00",
    timeZone: "America/Los_Angeles",
  },
  organizer: {
    email: "sarah@acme.com",
    displayName: "Sarah Chen",
  },
  attendees: [
    { email: "james@acme.com", displayName: "James Wilson", responseStatus: "accepted" },
    { email: "priya@acme.com", displayName: "Priya Patel", responseStatus: "accepted" },
    { email: "alex@acme.com", displayName: "Alex Kim", responseStatus: "tentative" },
    { email: "sarah@acme.com", displayName: "Sarah Chen", responseStatus: "accepted", organizer: true },
  ],
  creator: {
    email: "sarah@acme.com",
    displayName: "Sarah Chen",
  },
}

/**
 * Example raw Microsoft Graph API response shape.
 */
export const rawOutlookEventExample = {
  id: "AAMkAGI1AAA",
  subject: "Design Review: New Dashboard Components",
  bodyPreview: "Review the latest Figma mockups for the analytics dashboard redesign.",
  start: {
    dateTime: "2026-03-11T14:00:00.0000000",
    timeZone: "Eastern Standard Time",
  },
  end: {
    dateTime: "2026-03-11T15:00:00.0000000",
    timeZone: "Eastern Standard Time",
  },
  isAllDay: false,
  location: {
    displayName: "",
  },
  webLink: "https://outlook.office365.com/calendar/item/AAMkAGI1AAA",
  isOnlineMeeting: true,
  onlineMeeting: {
    joinUrl: "https://teams.microsoft.com/l/meetup-join/abc123",
  },
  organizer: {
    emailAddress: {
      name: "David Park",
      address: "david@contoso.com",
    },
  },
  attendees: [
    { emailAddress: { name: "Emma Thompson", address: "emma@contoso.com" }, status: { response: "accepted" } },
    { emailAddress: { name: "Raj Patel", address: "raj@contoso.com" }, status: { response: "accepted" } },
    { emailAddress: { name: "Lisa Wang", address: "lisa@contoso.com" }, status: { response: "declined" } },
  ],
}
