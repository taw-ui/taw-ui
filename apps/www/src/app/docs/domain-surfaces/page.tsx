"use client"

import { IssueCard } from "@taw-ui/react"
import { CodeBlock, InlineCode } from "@/components/code-block"
import { CopyPage } from "@/components/copy-page"
import { githubIssueFixture } from "@/fixtures/issue-card"

export default function DomainSurfacesPage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-md bg-(--taw-accent-subtle) px-2 py-0.5 font-pixel text-[10px] uppercase tracking-wider text-(--taw-accent)">
            Concept
          </span>
          <CopyPage />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-(--taw-text-primary)">
          Domain Surfaces
        </h1>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-(--taw-text-secondary)">
          Canonical UI surfaces for real-world entity types. Provider adapters underneath.
        </p>
        <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-(--taw-text-muted)">
          taw-ui started with generic AI tool result components — KpiCard, DataTable, InsightCard.
          Domain Surfaces extend this into integration-ready surfaces for specific entity categories:
          issues, events, posts, contacts, and more.
        </p>
      </div>

      {/* What are Domain Surfaces */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          What are Domain Surfaces?
        </h2>
        <p className="mb-3 text-[13px] leading-relaxed text-(--taw-text-muted)">
          A domain surface is a canonical UI component for a category of real-world entities.
          Instead of building provider-specific components (GithubIssueCard, LinearIssueCard),
          we build one canonical surface per entity type and layer provider adapters underneath.
        </p>
        <div className="rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface) p-4 shadow-(--taw-shadow-sm)">
          <div className="space-y-3 text-[12px] text-(--taw-text-muted)">
            <div className="flex items-center gap-3">
              <span className="w-24 shrink-0 font-mono font-medium text-(--taw-accent)">IssueCard</span>
              <span>GitHub Issues, Linear Issues, Jira Tickets</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-24 shrink-0 font-mono font-medium text-(--taw-text-muted)/50">EventCard</span>
              <span className="opacity-50">Google Calendar, Outlook, Cal.com (coming soon)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-24 shrink-0 font-mono font-medium text-(--taw-text-muted)/50">PostCard</span>
              <span className="opacity-50">Blog posts, social media, RSS (coming soon)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Architecture
        </h2>
        <p className="mb-3 text-[13px] leading-relaxed text-(--taw-text-muted)">
          Each domain surface consists of three layers:
        </p>
        <div className="space-y-3">
          <div className="rounded-(--taw-radius) border border-(--taw-border) bg-(--taw-surface) px-4 py-3">
            <span className="text-[12px] font-semibold text-(--taw-text-primary)">1. Canonical Schema</span>
            <p className="mt-1 text-[11px] text-(--taw-text-muted)">
              A Zod schema defining the normalized shape for the entity type.
              Provider-agnostic, validated at render time. This is the contract.
            </p>
          </div>
          <div className="rounded-(--taw-radius) border border-(--taw-border) bg-(--taw-surface) px-4 py-3">
            <span className="text-[12px] font-semibold text-(--taw-text-primary)">2. React Component</span>
            <p className="mt-1 text-[11px] text-(--taw-text-muted)">
              A polished, motion-native component that renders the canonical data.
              Provider-aware (shows GitHub/Linear icons) but not provider-dependent.
            </p>
          </div>
          <div className="rounded-(--taw-radius) border border-(--taw-border) bg-(--taw-surface) px-4 py-3">
            <span className="text-[12px] font-semibold text-(--taw-text-primary)">3. Provider Adapters</span>
            <p className="mt-1 text-[11px] text-(--taw-text-muted)">
              Pure transformation functions that map raw provider data into the canonical schema.
              No auth, no API calls, no side effects. Your app fetches; taw-ui normalizes.
            </p>
          </div>
        </div>
      </section>

      {/* The boundary */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          taw-ui vs. Your App
        </h2>
        <p className="mb-3 text-[13px] leading-relaxed text-(--taw-text-muted)">
          taw-ui is intentionally not an auth library. The boundary is clear:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-(--taw-radius-lg) border border-(--taw-accent)/20 bg-(--taw-accent-subtle) p-4">
            <span className="mb-2 block font-mono text-[11px] font-medium text-(--taw-accent)">taw-ui handles</span>
            <ul className="space-y-1 text-[12px] text-(--taw-text-secondary)">
              <li>Canonical schemas & types</li>
              <li>React components & rendering</li>
              <li>Schema validation</li>
              <li>Provider adapters (pure transforms)</li>
              <li>Motion & visual polish</li>
              <li>Loading, error, and streaming states</li>
            </ul>
          </div>
          <div className="rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface) p-4">
            <span className="mb-2 block font-mono text-[11px] font-medium text-(--taw-text-primary)">Your app handles</span>
            <ul className="space-y-1 text-[12px] text-(--taw-text-secondary)">
              <li>OAuth / authentication</li>
              <li>Access & refresh tokens</li>
              <li>API clients & SDKs</li>
              <li>Data fetching</li>
              <li>Permissions & scopes</li>
              <li>Error handling & retries</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Flow */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          How It Works
        </h2>
        <CodeBlock label="integration flow">{`// 1. Your app authenticates with the provider
const octokit = new Octokit({ auth: userToken })

// 2. Your app fetches the data
const { data: issue } = await octokit.issues.get({
  owner: "vercel",
  repo: "next.js",
  issue_number: 58234,
})

// 3. taw-ui normalizes it (pure transform, no side effects)
import { fromGithubIssue } from "taw-ui"
const issueData = fromGithubIssue(issue)

// 4. taw-ui renders it
<IssueCard part={{
  id: "1",
  toolName: "getIssue",
  state: "output-available",
  input: {},
  output: issueData,
}} />`}</CodeBlock>
      </section>

      {/* Live example */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Live Example
        </h2>
        <div className="overflow-hidden rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface-sunken) p-5 shadow-(--taw-shadow-sm)">
          <IssueCard part={githubIssueFixture} />
        </div>
      </section>

      {/* Design philosophy */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Design Philosophy
        </h2>
        <div className="space-y-3 text-[13px] leading-relaxed text-(--taw-text-muted)">
          <p>
            <strong className="text-(--taw-text-primary)">Category first, provider second.</strong>{" "}
            We start with a canonical <InlineCode>IssueCard</InlineCode>, not a{" "}
            <InlineCode>GithubIssueCard</InlineCode>. The schema defines what an issue looks
            like across all providers. Adapters handle the differences.
          </p>
          <p>
            <strong className="text-(--taw-text-primary)">Pure transformations.</strong>{" "}
            Adapters like <InlineCode>fromGithubIssue()</InlineCode> are pure functions.
            No network calls, no auth, no side effects. They take raw provider data in
            and return canonical data out.
          </p>
          <p>
            <strong className="text-(--taw-text-primary)">Graceful degradation.</strong>{" "}
            Every field beyond <InlineCode>id</InlineCode>, <InlineCode>provider</InlineCode>,{" "}
            <InlineCode>title</InlineCode>, and <InlineCode>status</InlineCode> is optional.
            The component renders beautifully with minimal data and gets richer as more fields are provided.
          </p>
          <p>
            <strong className="text-(--taw-text-primary)">No SDK lock-in.</strong>{" "}
            Adapter input types are loose interfaces, not imports from{" "}
            <InlineCode>@octokit/types</InlineCode> or <InlineCode>@linear/sdk</InlineCode>.
            Any object with the right shape works.
          </p>
        </div>
      </section>

      {/* Available surfaces */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Available Surfaces
        </h2>
        <div className="space-y-3">
          <a
            href="/docs/components/issue-card"
            className="group flex items-center gap-3 rounded-(--taw-radius-lg) border border-(--taw-accent)/40 bg-(--taw-surface) px-4 py-3.5 shadow-(--taw-shadow-sm) transition-all hover:border-(--taw-accent) hover:shadow-(--taw-shadow-md)"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--taw-accent) text-white">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <span className="block text-[13px] font-medium text-(--taw-text-primary)">IssueCard</span>
              <span className="text-[11px] text-(--taw-text-muted)">Issues, tickets, work items — GitHub, Linear, Jira adapters</span>
            </div>
          </a>
        </div>
      </section>
    </div>
  )
}
