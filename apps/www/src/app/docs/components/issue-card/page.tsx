"use client"

import { IssueCard } from "@taw-ui/react"
import { ComponentPreview } from "@/components/component-preview"
import { CodeBlock, InlineCode } from "@/components/code-block"
import {
  SchemaTable,
  FeatureGrid,
  RelatedComponents,
} from "@/components/docs-components"
import { issueCardFixtures, issueCardOptions, rawGithubIssueExample, rawLinearIssueExample } from "@/fixtures/issue-card"
import { ComponentNav } from "@/components/component-nav"
import { generateComponentCode } from "@/lib/code-gen"

export default function IssueCardDocs() {
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
          IssueCard
        </h1>
        <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-(--taw-text-secondary)">
          Canonical issue/ticket surface for GitHub, Linear, Jira, and any work-item
          provider. One component, multiple adapters — your app authenticates and fetches,
          taw-ui normalizes and renders.
        </p>
      </div>

      {/* ── Preview ─────────────────────────────────────────────────────── */}
      <section>
        <ComponentPreview
          fixtures={issueCardFixtures}
          options={issueCardOptions}
          chatMessages={({ component }) => [
            { role: "user", content: "Show me issue #58234 from next.js" },
            {
              role: "assistant",
              content: "Here\u2019s the issue:",
              tool: component,
            },
          ]}
          code={(part) => generateComponentCode("IssueCard", "@taw-ui/react", part)}
        >
          {(part) => <IssueCard part={part} />}
        </ComponentPreview>
      </section>

      {/* ── Installation ────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Installation
        </h2>
        <CodeBlock label="Terminal">{`npx taw-ui add issue-card`}</CodeBlock>
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
          <CodeBlock label="GitHub adapter">{`import { fromGithubIssue } from "taw-ui"

// Your app fetches (auth is yours)
const { data } = await octokit.issues.get({
  owner: "vercel",
  repo: "next.js",
  issue_number: 58234,
})

// taw-ui normalizes (pure transform)
const issueData = fromGithubIssue(data)

// Render
<IssueCard part={{
  id: "1",
  toolName: "getIssue",
  state: "output-available",
  input: {},
  output: issueData,
}} />`}</CodeBlock>
          <CodeBlock label="Linear adapter">{`import { fromLinearIssue } from "taw-ui"

// Your app fetches (auth is yours)
const issue = await linearClient.issue("issue-id")

// taw-ui normalizes (pure transform)
const issueData = fromLinearIssue(issue)

// Render
<IssueCard part={{
  id: "1",
  toolName: "getIssue",
  state: "output-available",
  input: {},
  output: issueData,
}} />`}</CodeBlock>
        </div>
      </section>

      {/* ── Usage as AI tool ────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Usage as AI Tool
        </h2>
        <p className="mb-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          IssueCard also works as a standard taw-ui tool output —
          let the AI populate the canonical schema directly.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <CodeBlock label="server — define tool">{`import { tool } from "ai"
import { IssueCardSchema } from "@/components/taw/issue-card"

export const getIssue = tool({
  description: "Look up an issue",
  parameters: z.object({
    owner: z.string(),
    repo: z.string(),
    number: z.number(),
  }),
  outputSchema: IssueCardSchema,
  execute: async ({ owner, repo, number }) => {
    const issue = await fetchIssue(owner, repo, number)
    return fromGithubIssue(issue)
  },
})`}</CodeBlock>
          <CodeBlock label="client — render">{`import { IssueCard } from "@/components/taw/issue-card"
import type { TawToolPart } from "taw-ui"

function ToolOutput({ part }: { part: TawToolPart }) {
  // Handles loading, error, and success states
  return <IssueCard part={part} />
}`}</CodeBlock>
        </div>
      </section>

      {/* ── Providers ───────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Providers
        </h2>
        <p className="mb-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          Switch between fixtures to see IssueCard rendering data from different providers.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {(["ready", "linear"] as const).map((key) => (
            <div key={key} className="overflow-hidden rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface-sunken) p-4">
              <span className="mb-2 block font-mono text-[11px] text-(--taw-text-muted)">
                {key === "ready" ? "GitHub" : "Linear"}
              </span>
              <IssueCard part={issueCardFixtures[key]!} animate={false} />
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
            title="IssueCardSchema"
            fields={[
              { field: "id", type: "string", req: true, desc: "Stable identifier (e.g. \"github:owner/repo#42\")" },
              { field: "provider", type: '"github" | "linear" | "jira" | "other"', req: true, desc: "Source provider for icon and branding" },
              { field: "title", type: "string", req: true, desc: "Issue title" },
              { field: "number", type: "number", desc: "Issue number (#123)" },
              { field: "status", type: "Status", req: true, desc: "Normalized status with optional color" },
              { field: "priority", type: '"urgent" | "high" | "medium" | "low" | "none"', desc: "Priority level — controls accent strip color" },
              { field: "assignee", type: "Assignee", desc: "Assigned person with optional avatar" },
              { field: "labels", type: "Label[]", desc: "Tags/labels with optional colors" },
              { field: "project", type: "string", desc: "Project or repository name" },
              { field: "url", type: "string (URL)", desc: "Link back to the issue in the provider" },
              { field: "createdAt", type: "string", desc: "Creation timestamp (ISO 8601 or relative)" },
              { field: "updatedAt", type: "string", desc: "Last update timestamp" },
              { field: "description", type: "string", desc: "Issue body (truncated for display)" },
              { field: "confidence", type: "number (0-1)", desc: "AI confidence in this data" },
              { field: "caveat", type: "string", desc: "Uncertainty note" },
              { field: "source", type: "Source", desc: "Data provenance" },
            ]}
          />
          <SchemaTable
            title="Status"
            fields={[
              { field: "label", type: "string", req: true, desc: "Display text (e.g. \"Open\", \"In Progress\")" },
              { field: "color", type: "string", desc: "CSS color for the status badge" },
            ]}
          />
          <SchemaTable
            title="Assignee"
            fields={[
              { field: "name", type: "string", req: true, desc: "Display name or username" },
              { field: "avatarUrl", type: "string (URL)", desc: "Avatar image URL" },
            ]}
          />
          <SchemaTable
            title="Label"
            fields={[
              { field: "name", type: "string", req: true, desc: "Label text" },
              { field: "color", type: "string", desc: "CSS color for the label chip" },
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
          return canonical <InlineCode>IssueCardData</InlineCode>. No auth, no API calls,
          no SDK imports.
        </p>
        <SchemaTable
          title="Available Adapters"
          fields={[
            { field: "fromGithubIssue(issue)", type: "IssueCardData", req: true, desc: "Maps GitHub REST API issue → canonical schema" },
            { field: "fromLinearIssue(issue)", type: "IssueCardData", req: true, desc: "Maps Linear GraphQL issue → canonical schema" },
          ]}
        />
        <p className="mt-3 text-[12px] leading-relaxed text-(--taw-text-muted)">
          Both adapters accept loose input types — you don&apos;t need{" "}
          <InlineCode>@octokit/types</InlineCode> or <InlineCode>@linear/sdk</InlineCode>.
          Any object with matching fields works.
        </p>
      </section>

      {/* ── Adapter examples ─────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Adapter Examples
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <CodeBlock label="raw GitHub issue">{JSON.stringify(rawGithubIssueExample, null, 2)}</CodeBlock>
          <CodeBlock label="raw Linear issue">{JSON.stringify(rawLinearIssueExample, null, 2)}</CodeBlock>
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-(--taw-text-muted)">
          Pass either of these to the corresponding adapter function to get canonical{" "}
          <InlineCode>IssueCardData</InlineCode> ready for rendering.
        </p>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Features
        </h2>
        <FeatureGrid
          features={[
            { icon: "diamond", title: "Provider icons", desc: "Native SVG icons for GitHub, Linear, Jira — plus a generic fallback" },
            { icon: "grid", title: "Priority accent strip", desc: "Left border colored by priority level for instant visual signal" },
            { icon: "shield", title: "Status + label badges", desc: "Color-coded status badge and label chips with provider colors" },
            { icon: "chat", title: "Rich metadata", desc: "Assignee avatar, relative timestamps, project name, issue number" },
            { icon: "alert", title: "Graceful degradation", desc: "Renders beautifully from minimal (4 fields) to fully populated data" },
            { icon: "zap", title: "Pure adapters", desc: "fromGithubIssue() and fromLinearIssue() — no auth, no SDK, no side effects" },
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
            { href: "/docs/components/insight-card", label: "InsightCard", desc: "Structured AI analysis" },
            { href: "/docs/components/alert-card", label: "AlertCard", desc: "Proactive AI notifications" },
          ]}
        />
      </section>
    </div>
  )
}
