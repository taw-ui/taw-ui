"use client"

import { PostCard } from "@taw-ui/react"
import { ComponentPreview } from "@/components/component-preview"
import { CodeBlock, InlineCode } from "@/components/code-block"
import {
  SchemaTable,
  FeatureGrid,
  RelatedComponents,
} from "@/components/docs-components"
import { postCardFixtures, postCardOptions, rawXPostExample, rawInstagramPostExample } from "@/fixtures/post-card"
import { ComponentNav } from "@/components/component-nav"
import { generateComponentCode } from "@/lib/code-gen"

export default function PostCardDocs() {
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
          PostCard
        </h1>
        <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-(--taw-text-secondary)">
          Canonical social/content post surface for X, Instagram, LinkedIn, Threads, and any
          content provider. One component, multiple adapters — your app authenticates and fetches,
          taw-ui normalizes and renders.
        </p>
      </div>

      {/* ── Preview ─────────────────────────────────────────────────────── */}
      <section>
        <ComponentPreview
          fixtures={postCardFixtures}
          options={postCardOptions}
          chatMessages={({ component }) => [
            { role: "user", content: "Find the latest post about Next.js 15.5" },
            {
              role: "assistant",
              content: "Here\u2019s the post:",
              tool: component,
            },
          ]}
          code={(part) => generateComponentCode("PostCard", "@taw-ui/react", part)}
        >
          {(part) => <PostCard part={part} />}
        </ComponentPreview>
      </section>

      {/* ── Installation ────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Installation
        </h2>
        <CodeBlock label="Terminal">{`npx taw-ui add post-card`}</CodeBlock>
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
          <CodeBlock label="X adapter">{`import { fromXPost } from "taw-ui"

// Your app fetches (auth is yours)
const { data } = await xClient.tweets.findTweetById(
  "1234567890",
  { expansions: ["author_id"], ... }
)

// taw-ui normalizes (pure transform)
const postData = fromXPost(data)

// Render
<PostCard part={{
  id: "1",
  toolName: "getPost",
  state: "output-available",
  input: {},
  output: postData,
}} />`}</CodeBlock>
          <CodeBlock label="Instagram adapter">{`import { fromInstagramPost } from "taw-ui"

// Your app fetches (auth is yours)
const post = await ig.get(\`/\${postId}\`, {
  fields: "id,caption,timestamp,..."
})

// taw-ui normalizes (pure transform)
const postData = fromInstagramPost(post)

// Render
<PostCard part={{
  id: "1",
  toolName: "getPost",
  state: "output-available",
  input: {},
  output: postData,
}} />`}</CodeBlock>
        </div>
      </section>

      {/* ── Usage as AI tool ────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Usage as AI Tool
        </h2>
        <p className="mb-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          PostCard also works as a standard taw-ui tool output —
          let the AI populate the canonical schema directly.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <CodeBlock label="server — define tool">{`import { tool } from "ai"
import { PostCardSchema } from "@/components/taw/post-card"

export const getPost = tool({
  description: "Find a social media post",
  parameters: z.object({
    query: z.string(),
  }),
  outputSchema: PostCardSchema,
  execute: async ({ query }) => {
    const post = await searchPosts(query)
    return fromXPost(post)
  },
})`}</CodeBlock>
          <CodeBlock label="client — render">{`import { PostCard } from "@/components/taw/post-card"
import type { TawToolPart } from "taw-ui"

function ToolOutput({ part }: { part: TawToolPart }) {
  // Handles loading, error, and success states
  return <PostCard part={part} />
}`}</CodeBlock>
        </div>
      </section>

      {/* ── Providers ───────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Providers
        </h2>
        <p className="mb-4 text-[13px] leading-relaxed text-(--taw-text-muted)">
          Switch between fixtures to see PostCard rendering data from different providers.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {(["ready", "instagram"] as const).map((key) => (
            <div key={key} className="overflow-hidden rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface-sunken) p-4">
              <span className="mb-2 block font-mono text-[11px] text-(--taw-text-muted)">
                {key === "ready" ? "X" : "Instagram"}
              </span>
              <PostCard part={postCardFixtures[key]!} animate={false} />
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
            title="PostCardSchema"
            fields={[
              { field: "id", type: "string", req: true, desc: "Stable identifier (e.g. \"x:1234567890\")" },
              { field: "provider", type: '"x" | "instagram" | "linkedin" | "threads" | "other"', req: true, desc: "Source provider for icon and branding" },
              { field: "author", type: "Author", req: true, desc: "Post author" },
              { field: "body", type: "string", req: true, desc: "Post text / caption / body" },
              { field: "postedAt", type: "string", req: true, desc: "Publication timestamp (ISO 8601)" },
              { field: "media", type: "Media[]", desc: "Image or video attachments" },
              { field: "metrics", type: "Metrics", desc: "Engagement metrics (likes, comments, etc.)" },
              { field: "url", type: "string (URL)", desc: "Link back to the post in the provider" },
              { field: "status", type: '"published" | "draft" | "deleted"', desc: "Post status" },
              { field: "tags", type: "string[]", desc: "Hashtags or topic tags" },
              { field: "confidence", type: "number (0-1)", desc: "AI confidence in this data" },
              { field: "caveat", type: "string", desc: "Uncertainty note" },
              { field: "source", type: "Source", desc: "Data provenance" },
            ]}
          />
          <SchemaTable
            title="Author"
            fields={[
              { field: "name", type: "string", req: true, desc: "Display name" },
              { field: "handle", type: "string", desc: "Username / handle (e.g. \"@elonmusk\")" },
              { field: "avatarUrl", type: "string (URL)", desc: "Avatar image URL" },
              { field: "url", type: "string (URL)", desc: "Profile URL" },
              { field: "isVerified", type: "boolean", desc: "Whether the author is verified" },
            ]}
          />
          <SchemaTable
            title="Media"
            fields={[
              { field: "type", type: '"image" | "video"', req: true, desc: "Media type" },
              { field: "url", type: "string (URL)", req: true, desc: "Media URL" },
              { field: "alt", type: "string", desc: "Alt text for accessibility" },
              { field: "width", type: "number", desc: "Intrinsic width in pixels" },
              { field: "height", type: "number", desc: "Intrinsic height in pixels" },
            ]}
          />
          <SchemaTable
            title="Metrics"
            fields={[
              { field: "likes", type: "number", desc: "Like / favorite count" },
              { field: "comments", type: "number", desc: "Comment / reply count" },
              { field: "reposts", type: "number", desc: "Repost / share / retweet count" },
              { field: "views", type: "number", desc: "View / impression count" },
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
          return canonical <InlineCode>PostCardData</InlineCode>. No auth, no API calls,
          no SDK imports.
        </p>
        <SchemaTable
          title="Available Adapters"
          fields={[
            { field: "fromXPost(post)", type: "PostCardData", req: true, desc: "Maps X API v2 post → canonical schema" },
            { field: "fromInstagramPost(post)", type: "PostCardData", req: true, desc: "Maps Instagram Graph API post → canonical schema" },
          ]}
        />
        <p className="mt-3 text-[12px] leading-relaxed text-(--taw-text-muted)">
          Both adapters accept loose input types — you don&apos;t need any provider SDK.
          Any object with matching fields works.
        </p>
        <p className="mt-2 text-[12px] leading-relaxed text-(--taw-text-muted)">
          <strong className="text-(--taw-text-secondary)">Why <InlineCode>fromXPost</InlineCode>?</strong>{" "}
          Named to match X&apos;s current branding (formerly Twitter). The input type
          uses X API v2 field names.
        </p>
      </section>

      {/* ── Adapter examples ─────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Adapter Examples
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <CodeBlock label="raw X API v2 post">{JSON.stringify(rawXPostExample, null, 2)}</CodeBlock>
          <CodeBlock label="raw Instagram Graph API post">{JSON.stringify(rawInstagramPostExample, null, 2)}</CodeBlock>
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-(--taw-text-muted)">
          Pass either of these to the corresponding adapter function to get canonical{" "}
          <InlineCode>PostCardData</InlineCode> ready for rendering.
        </p>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Features
        </h2>
        <FeatureGrid
          features={[
            { icon: "diamond", title: "Provider icons", desc: "Native SVG icons for X, Instagram, LinkedIn, Threads — plus a generic fallback" },
            { icon: "grid", title: "Provider accent strip", desc: "Left border branded by provider: black for X, gradient for Instagram, blue for LinkedIn" },
            { icon: "shield", title: "Author identity", desc: "Avatar, display name, handle, and verified badge — all provider-agnostic" },
            { icon: "chat", title: "Engagement metrics", desc: "Likes, comments, reposts, and views with compact number formatting (1.2K, 3.4M)" },
            { icon: "alert", title: "Media support", desc: "Single images, multi-image grids, and video thumbnails with play overlay" },
            { icon: "zap", title: "Pure adapters", desc: "fromXPost() and fromInstagramPost() — no auth, no SDK, no side effects" },
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
            OAuth flows, API keys, bearer tokens, and data fetching
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
            { href: "/docs/components/event-card", label: "EventCard", desc: "Canonical calendar event surface" },
          ]}
        />
      </section>
    </div>
  )
}
