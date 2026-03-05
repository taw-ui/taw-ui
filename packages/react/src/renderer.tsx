"use client"

import type { TawToolPart, TawComponent } from "@taw-ui/core"

// ─── Registry ─────────────────────────────────────────────────────────────────

export type TawRegistry = Record<string, TawComponent>

export function createTawRegistry(
  components: Record<string, TawComponent>,
): TawRegistry {
  return components
}

// ─── Renderer ─────────────────────────────────────────────────────────────────

export interface TawRendererProps {
  registry: TawRegistry
  part: TawToolPart
  fallback?: React.ReactNode | undefined
}

export function TawRenderer({ registry, part, fallback }: TawRendererProps) {
  const Component = registry[part.toolName]

  if (!Component) {
    if (fallback !== undefined) return <>{fallback}</>
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[taw-ui] No component registered for tool "${part.toolName}". ` +
          `Available: ${Object.keys(registry).join(", ")}`,
      )
    }
    return null
  }

  return <Component part={part} />
}
