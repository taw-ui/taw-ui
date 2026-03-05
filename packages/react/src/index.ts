// Components
export { KpiCard } from "./kpi-card"
export type { KpiCardProps } from "./kpi-card"

export { DataTable } from "./data-table"
export type { DataTableProps } from "./data-table"

export { OptionList } from "./option-list"
export type { OptionListProps } from "./option-list"

// Renderer
export { TawRenderer, createTawRegistry } from "./renderer"
export type { TawRegistry, TawRendererProps } from "./renderer"

// Shared sub-components (for custom composition)
export { ConfidenceBadge, SourceLabel, TawError, TawSkeleton } from "./shared"

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
