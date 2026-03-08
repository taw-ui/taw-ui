"use client"

import { EventCard } from "@taw-ui/react"
import { ComponentPreview } from "@/components/component-preview"
import { CodeBlock, InlineCode } from "@/components/code-block"
import {
  SchemaTable,
  FeatureGrid,
  RelatedComponents,
} from "@/components/docs-components"
import { eventCardFixtures, eventCardOptions, rawGoogleCalendarEventExample, rawOutlookEventExample } from "@/fixtures/event-card"
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
          event provider. One component, multiple adapters — your app authenticates and fetches,
          taw-ui normalizes and renders.
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
          code={(part) => generateComponentCode("EventCard", "@taw-ui/react", part)}
        >
          {(part) => <EventCard part={part} />}
        </ComponentPreview>
      </section>

      {/* ── Installation ────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Installation
        </h2>
        <CodeBlock label="Terminal">{`npx taw-ui add event-card`}</CodeBlock>
        <p className="mt-3 text-[12px] leading-relaxed text-(--taw-text-muted)">
          This copies the component source and schema into your project.
          You own the code — customize anything.
        </p>
      </section>

      {/* ── Usage with adapters ──────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Usage with Adapters
        </h2>
        <p className="mb-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          The recommended pattern: your app fetches data from the provider,
          taw-ui&apos;s adapter normalizes it, and the component renders it.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <CodeBlock label="Google Calendar adapter">{`import { fromGoogleCalendarEvent } from "taw-ui"

// Your app fetches (auth is yours)
const { data } = await calendar.events.get({
  calendarId: "primary",
  eventId: "abc123",
})

// taw-ui normalizes (pure transform)
const eventData = fromGoogleCalendarEvent(data)

// Render
<EventCard part={{
  id: "1",
  toolName: "getEvent",
  state: "output-available",
  input: {},
  output: eventData,
}} />`}</CodeBlock>
          <CodeBlock label="Outlook adapter">{`import { fromOutlookEvent } from "taw-ui"

// Your app fetches (auth is yours)
const event = await graphClient
  .api("/me/events/AAMk...")
  .get()

// taw-ui normalizes (pure transform)
const eventData = fromOutlookEvent(event)

// Render
<EventCard part={{
  id: "1",
  toolName: "getEvent",
  state: "output-available",
  input: {},
  output: eventData,
}} />`}</CodeBlock>
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
    return fromGoogleCalendarEvent(event)
  },
})`}</CodeBlock>
          <CodeBlock label="client — render">{`import { EventCard } from "@/components/taw/event-card"
import type { TawToolPart } from "taw-ui"

function ToolOutput({ part }: { part: TawToolPart }) {
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
            { field: "part", type: "TawToolPart", req: true, desc: "Tool call lifecycle state — handles loading, error, and success" },
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

      {/* ── Adapters ─────────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Adapters
        </h2>
        <p className="mb-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          Adapters are pure transformation functions. They take raw provider data and
          return canonical <InlineCode>EventCardData</InlineCode>. No auth, no API calls,
          no SDK imports.
        </p>
        <SchemaTable
          title="Available Adapters"
          fields={[
            { field: "fromGoogleCalendarEvent(event)", type: "EventCardData", req: true, desc: "Maps Google Calendar API v3 event → canonical schema" },
            { field: "fromOutlookEvent(event)", type: "EventCardData", req: true, desc: "Maps Microsoft Graph API event → canonical schema" },
          ]}
        />
        <p className="mt-3 text-[12px] leading-relaxed text-(--taw-text-muted)">
          Both adapters accept loose input types — you don&apos;t need{" "}
          <InlineCode>googleapis</InlineCode> or <InlineCode>@microsoft/microsoft-graph-types</InlineCode>.
          Any object with matching fields works.
        </p>
      </section>

      {/* ── Adapter examples ─────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Adapter Examples
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <CodeBlock label="raw Google Calendar event">{JSON.stringify(rawGoogleCalendarEventExample, null, 2)}</CodeBlock>
          <CodeBlock label="raw Outlook event">{JSON.stringify(rawOutlookEventExample, null, 2)}</CodeBlock>
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-(--taw-text-muted)">
          Pass either of these to the corresponding adapter function to get canonical{" "}
          <InlineCode>EventCardData</InlineCode> ready for rendering.
        </p>
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
            { icon: "zap", title: "Pure adapters", desc: "fromGoogleCalendarEvent() and fromOutlookEvent() — no auth, no SDK, no side effects" },
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
            validation, and pure adapter functions — nothing more.
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
