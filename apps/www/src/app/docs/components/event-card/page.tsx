"use client"

import { EventCard } from "@/components/taw/event-card"
import { ComponentPreview } from "@/components/component-preview"
import { CodeBlock, InlineCode } from "@/components/code-block"
import {
  SchemaTable,
  FeatureGrid,
  RelatedComponents,
} from "@/components/docs-components"
import { eventCardFixtures, eventCardOptions } from "@/fixtures/event-card"
import { ComponentNav } from "@/components/component-nav"
import { generateComponentCode } from "@/lib/code-gen"

export default function EventCardDocs() {
  return (
    <div className="space-y-12">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-md bg-(--taw-accent-subtle) px-2 py-0.5 font-pixel text-[10px] uppercase tracking-wider text-(--taw-accent)">
            Domain Surface
          </span>
          <ComponentNav />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-(--taw-text-primary)">
          EventCard
        </h1>
        <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-(--taw-text-secondary)">
          Canonical calendar event surface for Google Calendar, Outlook, Cal.com, and any
          event provider. One component, any data source — your app authenticates, fetches,
          and maps to the canonical schema.
        </p>
      </div>

      {/* ── Preview ─────────────────────────────────────────────────────── */}
      <section>
        <ComponentPreview
          fixtures={eventCardFixtures}
          options={eventCardOptions}
          chatMessages={({ component }) => [
            { role: "user", content: "What's my next meeting?" },
            {
              role: "assistant",
              content: "Here\u2019s your next event:",
              tool: component,
            },
          ]}
          code={(part) => generateComponentCode("EventCard", "@/components/taw/event-card", part)}
        >
          {(part) => <EventCard part={part} />}
        </ComponentPreview>
      </section>

      {/* ── Installation ────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Installation
        </h2>
        <CodeBlock label="Terminal">{`npx shadcn@latest add "https://taw-ui.com/r/event-card.json"`}</CodeBlock>
        <p className="mt-3 text-[12px] leading-relaxed text-(--taw-text-muted)">
          This copies the component source and schema into your project.
          You own the code — customize anything.
        </p>
      </section>

      {/* ── Usage with Data Mapping ───────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Usage with Data Mapping
        </h2>
        <p className="mb-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          The recommended pattern: your app fetches data from the provider
          and maps it to the EventCard schema inline.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <CodeBlock label="Google Calendar mapping">{`// Your app fetches (auth is yours)
const { data: event } = await calendar.events.get({
  calendarId: "primary", eventId: "abc123",
})

// Map to the EventCard schema
const eventData = {
  id: \`google:\${event.id}\`,
  provider: "google",
  title: event.summary,
  startAt: event.start.dateTime ?? event.start.date,
  endAt: event.end.dateTime ?? event.end.date,
  // ... map remaining fields
}`}</CodeBlock>
          <CodeBlock label="Outlook mapping">{`// Your app fetches (auth is yours)
const event = await graphClient
  .api("/me/events/AAMk...").get()

// Map to the EventCard schema
const eventData = {
  id: \`outlook:\${event.id}\`,
  provider: "outlook",
  title: event.subject,
  startAt: event.start.dateTime,
  endAt: event.end.dateTime,
  // ... map remaining fields
}`}</CodeBlock>
        </div>
      </section>

      {/* ── Usage as AI tool ────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Usage as AI Tool
        </h2>
        <p className="mb-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          EventCard also works as a standard taw-ui tool output —
          let the AI populate the canonical schema directly.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <CodeBlock label="server — define tool">{`import { tool } from "ai"
import { EventCardSchema } from "@/components/taw/event-card"

export const getEvent = tool({
  description: "Look up a calendar event",
  parameters: z.object({
    query: z.string(),
  }),
  outputSchema: EventCardSchema,
  execute: async ({ query }) => {
    const event = await fetchNextEvent(query)
    return {
      id: \\\`google:\\\${event.id}\\\`,
      provider: "google",
      title: event.summary,
      startAt: event.start.dateTime,
      endAt: event.end.dateTime,
      // ... map remaining fields
    }
  },
})`}</CodeBlock>
          <CodeBlock label="client — render">{`import { EventCard } from "@/components/taw/event-card"
import type { ToolPart } from "@/components/taw/lib/types"

function ToolOutput({ part }: { part: ToolPart }) {
  // Handles loading, error, and success states
  return <EventCard part={part} />
}`}</CodeBlock>
        </div>
      </section>

      {/* ── Providers ───────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Providers
        </h2>
        <p className="mb-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          Switch between fixtures to see EventCard rendering data from different providers and states.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {(["ready", "outlook"] as const).map((key) => (
            <div key={key} className="overflow-hidden rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface-sunken) p-4">
              <span className="mb-2 block font-mono text-[11px] text-(--taw-text-muted)">
                {key === "ready" ? "Google Calendar" : "Outlook"}
              </span>
              <EventCard part={eventCardFixtures[key]!} animate={false} />
            </div>
          ))}
        </div>
      </section>

      {/* ── Props ───────────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Props
        </h2>
        <SchemaTable
          fields={[
            { field: "part", type: "ToolPart", req: true, desc: "Tool call lifecycle state — handles loading, error, and success" },
            { field: "animate", type: "boolean", desc: "Enable entrance animations (default: true)" },
            { field: "className", type: "string", desc: "Additional CSS classes on the wrapper" },
          ]}
        />
      </section>

      {/* ── Schema ──────────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Schema
        </h2>
        <div className="space-y-4">
          <SchemaTable
            title="EventCardSchema"
            fields={[
              { field: "id", type: "string", req: true, desc: "Stable identifier (e.g. \"google:abc123\")" },
              { field: "provider", type: '"google" | "outlook" | "calcom" | "other"', req: true, desc: "Source provider for icon and branding" },
              { field: "title", type: "string", req: true, desc: "Event title / summary" },
              { field: "startAt", type: "string", req: true, desc: "Start time (ISO 8601) or date (YYYY-MM-DD)" },
              { field: "endAt", type: "string", req: true, desc: "End time (ISO 8601) or date (YYYY-MM-DD)" },
              { field: "isAllDay", type: "boolean", desc: "Whether this is an all-day event" },
              { field: "description", type: "string", desc: "Event description (truncated for display)" },
              { field: "location", type: "string", desc: "Physical location or room name" },
              { field: "meetingUrl", type: "string (URL)", desc: "Video meeting link (Zoom, Meet, Teams)" },
              { field: "status", type: '"confirmed" | "tentative" | "cancelled"', desc: "Event status — controls accent strip color" },
              { field: "organizer", type: "Organizer", desc: "Event organizer" },
              { field: "attendees", type: "Attendee[]", desc: "List of attendees with RSVP status" },
              { field: "calendarName", type: "string", desc: "Calendar name (e.g. \"Work\", \"Personal\")" },
              { field: "url", type: "string (URL)", desc: "Link back to the event in the provider" },
              { field: "confidence", type: "number (0-1)", desc: "AI confidence in this data" },
              { field: "caveat", type: "string", desc: "Uncertainty note" },
              { field: "source", type: "Source", desc: "Data provenance" },
            ]}
          />
          <SchemaTable
            title="Organizer"
            fields={[
              { field: "name", type: "string", req: true, desc: "Display name" },
              { field: "email", type: "string", desc: "Email address (display only)" },
              { field: "avatarUrl", type: "string (URL)", desc: "Avatar image URL" },
            ]}
          />
          <SchemaTable
            title="Attendee"
            fields={[
              { field: "name", type: "string", req: true, desc: "Display name" },
              { field: "email", type: "string", desc: "Email address (display only)" },
              { field: "avatarUrl", type: "string (URL)", desc: "Avatar image URL" },
              { field: "responseStatus", type: '"accepted" | "declined" | "tentative" | "needsAction"', desc: "RSVP response — shown as colored dot on avatar" },
            ]}
          />
        </div>
      </section>

      {/* ── Data Mapping ──────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Data Mapping
        </h2>
        <p className="mb-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          Map your provider&apos;s API response to the <InlineCode>EventCardSchema</InlineCode> inline.
          No special adapters needed — just a plain object mapping.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <CodeBlock label="Google Calendar → EventCard">{`// Map Google Calendar API v3 fields
const eventData = {
  id: \`google:\${event.id}\`,
  provider: "google",
  title: event.summary,
  startAt: event.start.dateTime ?? event.start.date,
  endAt: event.end.dateTime ?? event.end.date,
  attendees: (event.attendees ?? []).map(a => ({
    name: a.displayName ?? a.email,
    email: a.email,
  })),
}`}</CodeBlock>
          <CodeBlock label="Outlook → EventCard">{`// Map Microsoft Graph API fields
const eventData = {
  id: \`outlook:\${event.id}\`,
  provider: "outlook",
  title: event.subject,
  startAt: event.start.dateTime,
  endAt: event.end.dateTime,
  location: event.location?.displayName,
  organizer: event.organizer
    ? { name: event.organizer.emailAddress.name }
    : undefined,
}`}</CodeBlock>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Features
        </h2>
        <FeatureGrid
          features={[
            { icon: "diamond", title: "Provider icons", desc: "Native icons for Google, Outlook, Cal.com — plus a generic calendar fallback" },
            { icon: "grid", title: "Status accent strip", desc: "Left border colored by event status: green (confirmed), yellow (tentative), red (cancelled)" },
            { icon: "shield", title: "Smart time formatting", desc: "Locale-aware time display with duration badges and all-day event support" },
            { icon: "chat", title: "Attendee avatars", desc: "Stacked avatar display with RSVP response status indicators" },
            { icon: "alert", title: "Graceful degradation", desc: "Renders beautifully from minimal (5 fields) to fully populated data" },
            { icon: "zap", title: "Inline data mapping", desc: "Map any provider's API response to the canonical schema — no adapters needed" },
          ]}
        />
      </section>

      {/* ── Important: Auth boundary ─────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Auth Boundary
        </h2>
        <div className="rounded-(--taw-radius-lg) border border-(--taw-warning)/20 bg-(--taw-warning)/6 p-4">
          <p className="text-[13px] leading-relaxed text-(--taw-text-secondary)">
            <strong className="text-(--taw-text-primary)">taw-ui does not handle authentication.</strong>{" "}
            OAuth flows, access tokens, refresh tokens, API clients, and data fetching
            are the responsibility of your application. taw-ui provides schemas, components,
            and validation — nothing more.
          </p>
          <p className="mt-2 text-[12px] text-(--taw-text-muted)">
            See <a href="/docs/domain-surfaces" className="text-(--taw-accent) underline decoration-dotted hover:decoration-solid">Domain Surfaces</a> for
            the full architecture explanation.
          </p>
        </div>
      </section>

      {/* ── Related ─────────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Related
        </h2>
        <RelatedComponents
          items={[
            { href: "/docs/domain-surfaces", label: "Domain Surfaces", desc: "Concept guide — what, why, and how" },
            { href: "/docs/components/issue-card", label: "IssueCard", desc: "Canonical issue/ticket surface" },
            { href: "/docs/components/alert-card", label: "AlertCard", desc: "Proactive AI notifications" },
          ]}
        />
      </section>
    </div>
  )
}
