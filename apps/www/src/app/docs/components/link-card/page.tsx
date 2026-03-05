"use client"

import { LinkCard } from "@taw-ui/react"
import { ComponentPreview } from "@/components/component-preview"
import { CodeBlock, InlineCode } from "@/components/code-block"
import { linkCardFixtures } from "@/fixtures/link-card"
import { CopyPage } from "@/components/copy-page"

export default function LinkCardDocs() {
  return (
    <div className="space-y-10">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-md bg-[--taw-accent-subtle] px-2 py-0.5 font-pixel text-[10px] uppercase tracking-wider text-[--taw-accent]">
            Display
          </span>
          <CopyPage />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[--taw-text-primary]">
          LinkCard
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-[--taw-text-secondary]">
          Rich link preview card with Open Graph metadata, favicon, domain,
          and optional AI reasoning. Turns a bare URL into a visual,
          trustworthy reference — like Slack or iMessage embeds, but with
          confidence scoring and provenance.
        </p>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-[--taw-text-primary]">
          Preview
        </h2>
        <ComponentPreview fixtures={linkCardFixtures}>
          {(part) => <LinkCard part={part} />}
        </ComponentPreview>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-[--taw-text-primary]">
          Usage
        </h2>
        <CodeBlock label="usage.tsx">{`import { LinkCard } from "@taw-ui/react"

<LinkCard part={part} />`}</CodeBlock>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-[--taw-text-primary]">
          Define the Tool
        </h2>
        <CodeBlock label="Vercel AI SDK">{`import { tool } from "ai"
import { LinkCardSchema } from "@taw-ui/core"

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

      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-[--taw-text-primary]">
          AI-Native: The Reason Field
        </h2>
        <p className="text-[13px] leading-relaxed text-[--taw-text-muted]">
          Every link shared by an AI needs context. Why is the AI showing this?
          The optional <InlineCode>reason</InlineCode> field renders as an
          accent-colored callout below the description — a one-line explanation
          that turns a random link into a purposeful reference.
        </p>
        <div className="mt-4 overflow-hidden rounded-[--taw-radius-lg] border border-[--taw-border] bg-[--taw-surface-sunken] p-5">
          <LinkCard part={linkCardFixtures["with-reason"]!} />
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-[--taw-text-primary]">
          Schema
        </h2>
        <div className="overflow-x-auto rounded-[--taw-radius-lg] border border-[--taw-border] shadow-[--taw-shadow-sm]">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[--taw-border] bg-[--taw-surface]">
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-[--taw-text-muted]">Field</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-[--taw-text-muted]">Type</th>
                <th className="px-4 py-2.5 text-left text-[11px] font-medium text-[--taw-text-muted]">Description</th>
              </tr>
            </thead>
            <tbody className="bg-[--taw-surface-raised]">
              {[
                ["id", "string", "Stable identifier (required)"],
                ["url", "string", "Target URL (required)"],
                ["title", "string", "Page title (required)"],
                ["description", "string?", "Meta description or excerpt"],
                ["image", "string?", "Open Graph image URL"],
                ["favicon", "string?", "Site favicon URL"],
                ["domain", "string?", "Display domain (auto-extracted if omitted)"],
                ["reason", "string?", "Why the AI is sharing this link"],
                ["publishedAt", "string?", "Publication date"],
                ["confidence", "0–1?", "AI confidence this link is relevant"],
                ["source", "Source?", "Data provenance (label + freshness)"],
              ].map(([field, type, desc]) => (
                <tr key={field} className="border-b border-[--taw-border] last:border-0">
                  <td className="px-4 py-2.5 font-mono text-[12px] text-[--taw-accent]">{field}</td>
                  <td className="px-4 py-2.5 font-mono text-[12px] text-[--taw-text-muted]">{type}</td>
                  <td className="px-4 py-2.5 text-[12px] text-[--taw-text-muted]">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-[--taw-text-primary]">
          Features
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: "OG metadata", desc: "Title, description, and image from Open Graph tags" },
            { title: "Favicon + domain", desc: "Visual trust signal with site identity" },
            { title: "AI reasoning", desc: "Optional callout explaining why this link matters" },
            { title: "Confidence scoring", desc: "Visual indicator of link relevance" },
            { title: "Auto domain extraction", desc: "Parses domain from URL if not provided" },
            { title: "Hover interaction", desc: "Border glow + image scale on hover" },
          ].map(({ title, desc }) => (
            <div key={title} className="rounded-[--taw-radius-lg] border border-[--taw-border] bg-[--taw-surface] px-4 py-3 shadow-[--taw-shadow-sm]">
              <span className="block text-[13px] font-medium text-[--taw-text-primary]">{title}</span>
              <p className="mt-0.5 text-[12px] text-[--taw-text-muted]">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
