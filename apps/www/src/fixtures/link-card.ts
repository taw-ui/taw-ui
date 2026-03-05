import type { TawToolPart } from "@taw-ui/core"

export const linkCardFixtures: Record<string, TawToolPart> = {
  ready: {
    id: "link-1",
    toolName: "showLink",
    input: { url: "https://react.dev/reference/rsc/server-components" },
    state: "output-available",
    output: {
      id: "react-rsc",
      url: "https://react.dev/reference/rsc/server-components",
      title: "React Server Components",
      description:
        "Server Components are a new type of Component that renders ahead of time, before bundling, in an environment separate from your client app or SSR server.",
      image: "https://react.dev/images/og-home.png",
      domain: "react.dev",
      favicon: "https://react.dev/favicon-32x32.png",
      reason: "This explains the RSC pattern you asked about",
      publishedAt: "Dec 2024",
      confidence: 0.94,
      source: { label: "React Docs", freshness: "current" },
    },
  },
  "no-image": {
    id: "link-2",
    toolName: "showLink",
    input: { url: "https://zod.dev" },
    state: "output-available",
    output: {
      id: "zod-docs",
      url: "https://zod.dev",
      title: "Zod – TypeScript-first schema validation with static type inference",
      description:
        "Zod is a TypeScript-first schema declaration and validation library. Define a schema, and Zod will ensure your data matches it.",
      domain: "zod.dev",
      confidence: 0.88,
    },
  },
  "with-reason": {
    id: "link-3",
    toolName: "showLink",
    input: { url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API" },
    state: "output-available",
    output: {
      id: "mdn-fetch",
      url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API",
      title: "Fetch API - Web APIs | MDN",
      description:
        "The Fetch API provides an interface for fetching resources across the network.",
      domain: "developer.mozilla.org",
      favicon: "https://developer.mozilla.org/favicon-48x48.png",
      reason:
        "Since you're building a custom data fetcher, this covers the Fetch API patterns you'll need",
      publishedAt: "Jan 2025",
      source: { label: "MDN Web Docs" },
    },
  },
  loading: {
    id: "link-4",
    toolName: "showLink",
    input: { url: "https://example.com" },
    state: "input-available",
  },
  error: {
    id: "link-5",
    toolName: "showLink",
    input: { url: "https://example.com" },
    state: "output-error",
    error: "Failed to fetch Open Graph metadata for this URL.",
  },
}
