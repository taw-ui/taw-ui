// Re-export core (so docs site can import from @taw-ui/react)
export * from "taw-ui"

// Components
export { KpiCard } from "./kpi-card"
export type { KpiCardProps } from "./kpi-card"

export { DataTable } from "./data-table"
export type { DataTableProps } from "./data-table"

export { OptionList } from "./option-list"
export type { OptionListProps } from "./option-list"

export { LinkCard } from "./link-card"
export type { LinkCardProps } from "./link-card"

export { MemoryCard } from "./memory-card"
export type { MemoryCardProps } from "./memory-card"

export { InsightCard } from "./insight-card"
export type { InsightCardProps } from "./insight-card"

export { AlertCard } from "./alert-card"
export type { AlertCardProps } from "./alert-card"

export { IssueCard } from "./issue-card"
export type { IssueCardProps } from "./issue-card"

// Renderer
export { TawRenderer, createTawRegistry } from "./renderer"
export type { TawRegistry, TawRendererProps } from "./renderer"

// Shared sub-components (for custom composition)
export { SourceLabel, TawError, TawSkeleton, Typewriter } from "./shared"

// Motion system
export {
  transitions,
  enterVariants,
  hoverVariants,
  pressProps,
  shimmerAnimation,
  staggerParent,
  getEnterProps,
} from "./motion"

// Utilities
export { cn } from "./utils/cn"
