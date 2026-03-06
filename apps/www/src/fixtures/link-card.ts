import type { TawToolPart } from "@taw-ui/react"

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
      caveat: "Documentation may reference canary features not yet stable",
      source: { label: "React Docs", freshness: "current" },
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

export const linkCardOptions = [
  { key: "image", label: "image", defaultOn: true },
  { key: "description", label: "description", defaultOn: true },
  { key: "reason", label: "reason", defaultOn: true },
  { key: "caveat", label: "caveat", defaultOn: false },
  { key: "favicon", label: "favicon", defaultOn: true },
  { key: "publishedAt", label: "date", defaultOn: true },
  { key: "source", label: "source", defaultOn: true },
]
