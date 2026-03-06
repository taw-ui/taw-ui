"use client"

import { LinkCard } from "@taw-ui/react"
import { ComponentPreview } from "@/components/component-preview"
import { CodeBlock } from "@/components/code-block"
import {
  SchemaTable,
  FeatureGrid,
  RelatedComponents,
} from "@/components/docs-components"
import { linkCardFixtures, linkCardOptions } from "@/fixtures/link-card"
import { CopyPage } from "@/components/copy-page"

export default function LinkCardDocs() {
  return (
    <div className="space-y-10">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-md bg-(--taw-accent-subtle) px-2 py-0.5 font-pixel text-[10px] uppercase tracking-wider text-(--taw-accent)">
            Display
          </span>
          <CopyPage />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-(--taw-text-primary)">
          LinkCard
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-(--taw-text-secondary)">
          Rich link preview with Open Graph metadata, favicon, domain,
          and optional AI reasoning. Turns a bare URL into a visual,
          trustworthy reference.
        </p>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Preview
        </h2>
        <ComponentPreview
          fixtures={linkCardFixtures}
          options={linkCardOptions}
          chatMessages={({ component }) => [
            { role: "user", content: "Find me the React docs on hooks" },
            {
              role: "assistant",
              content: "Here\u2019s the best reference I found:",
              tool: component,
            },
          ]}
          code={`import { LinkCard } from "@/components/taw/link-card"

<LinkCard part={part} />`}
        >
          {(part) => <LinkCard part={part} />}
        </ComponentPreview>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Define the Tool
        </h2>
        <CodeBlock label="Vercel AI SDK">{`import { tool } from "ai"
import { LinkCardSchema } from "@/components/taw/link-card"

export const showLink = tool({
  description: "Show a rich link preview",
  parameters: z.object({ url: z.string().url() }),
  outputSchema: LinkCardSchema,
  execute: async ({ url }) => {
    const og = await fetchOpenGraph(url)
    return {
      id: slugify(url),
      url,
      title: og.title,
      description: og.description,
      image: og.image,
      domain: new URL(url).hostname,
      favicon: og.favicon,
      reason: "Relevant to your question about RSC",
      confidence: 0.94,
      source: { label: "Web Search" },
    }
  },
})`}</CodeBlock>
      </section>

      {/* Features */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Features
        </h2>
        <FeatureGrid
          features={[
            { icon: "schema", title: "OG metadata", desc: "Title, description, and image from Open Graph tags" },
            { icon: "shield", title: "Favicon + domain", desc: "Visual trust signal with site identity" },
            { icon: "chat", title: "AI reasoning", desc: "Optional callout explaining why this link matters" },
            { icon: "diamond", title: "Confidence scoring", desc: "Visual indicator of link relevance" },
            { icon: "zap", title: "Auto domain extraction", desc: "Parses domain from URL if not provided" },
            { icon: "circle-dot", title: "Hover interaction", desc: "Border glow + image scale on hover" },
          ]}
        />
      </section>

      {/* Schema */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Schema
        </h2>
        <SchemaTable
          title="LinkCardSchema"
          fields={[
            { field: "id", type: "string", req: true, desc: "Stable identifier" },
            { field: "url", type: "string", req: true, desc: "Target URL" },
            { field: "title", type: "string", req: true, desc: "Page title" },
            { field: "description", type: "string", desc: "Meta description or excerpt" },
            { field: "image", type: "string", desc: "Open Graph image URL" },
            { field: "favicon", type: "string", desc: "Site favicon URL" },
            { field: "domain", type: "string", desc: "Display domain (auto-extracted if omitted)" },
            { field: "reason", type: "string", desc: "Why the AI is sharing this link" },
            { field: "publishedAt", type: "string", desc: "Publication date" },
            { field: "confidence", type: "number (0-1)", desc: "AI confidence this link is relevant" },
            { field: "source", type: "Source", desc: "Data provenance (label + freshness)" },
          ]}
        />
      </section>

      {/* Related */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-(--taw-text-primary)">
          Related
        </h2>
        <RelatedComponents
          items={[
            { href: "/docs/components/kpi-card", label: "KpiCard", desc: "Animated metric display" },
            { href: "/docs/components/data-table", label: "DataTable", desc: "Sortable rich tables" },
            { href: "/docs/concepts", label: "Concepts", desc: "Lifecycle, receipts, actions" },
          ]}
        />
      </section>
    </div>
  )
}
