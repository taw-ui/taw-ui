"use client"

import type { TawToolPart, TawComponent } from "@taw-ui/core"

// ─── Registry ─────────────────────────────────────────────────────────────────

export type TawRegistry = Record<string, TawComponent>

export interface CreateTawRegistryOptions {
  [toolName: string]: TawComponent
}

export function createTawRegistry(
  components: CreateTawRegistryOptions,
): TawRegistry {
  return components
}

// ─── Renderer ─────────────────────────────────────────────────────────────────

export interface TawRendererProps {
  registry: TawRegistry
  part: TawToolPart
  /** Fallback rendered when no component is registered for this tool */
  fallback?: React.ReactNode
}

/**
 * Routes a tool call part to the appropriate taw-ui component.
 *
 * @example
 * ```tsx
 * const registry = createTawRegistry({
 *   getMetrics: KpiCard,
 *   showTable: DataTable,
 *   chooseAction: OptionList,
 * })
 *
 * <TawRenderer registry={registry} part={part} />
 * ```
 */
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
