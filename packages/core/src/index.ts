// Contract
export { defineTawContract } from "./contract"
export type { TawContract } from "./contract"

// Shared schemas (used by all component schemas)
export {
  ConfidenceSchema,
  CaveatSchema,
  SourceSchema,
} from "./schemas/shared"
export type { SourceData } from "./schemas/shared"

// Component schemas (also co-located in registry components)
export * from "./schemas/kpi-card"
export * from "./schemas/option-list"
export * from "./schemas/data-table"
export * from "./schemas/chart"
export * from "./schemas/link-card"
export * from "./schemas/memory-card"
export * from "./schemas/insight-card"
export * from "./schemas/alert-card"

// Actions & Receipts
export {
  TawActionSchema,
  TawReceiptSchema,
  NEGATORY_ACTION_IDS,
  resolveActionVariant,
  createReceipt,
} from "./actions"
export type {
  TawAction,
  TawReceipt,
  TawReceiptOutcome,
  TawInteractiveProps,
} from "./actions"

// Parse utilities
export { tawParse } from "./utils/parse"
export type { ParseResult, TawParseError } from "./utils/parse"

// Theme tokens
export {
  TAW_TOKENS,
  TAW_TOKEN_CATEGORIES,
  tawVar,
  tawVarRef,
} from "./tokens"
export type { TawToken } from "./tokens"

// Types
export type {
  TawPartState,
  TawToolPart,
  TawPartMeta,
  TawBaseProps,
  TawComponentProps,
  TawComponent,
} from "./types"
