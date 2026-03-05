/**
 * The lifecycle state of a tool call part.
 * Mirrors Vercel AI SDK v5 part states.
 */
export type TawPartState =
  | "input-available"
  | "streaming"
  | "output-available"
  | "output-error"

/**
 * Generic tool call part — SDK-agnostic representation.
 * Adapters (vercel-ai, anthropic, openai) convert their native
 * part format into this shape.
 */
export interface TawToolPart<TInput = unknown, TOutput = unknown> {
  id: string
  toolName: string
  input: TInput
  output?: TOutput | undefined
  error?: Error | string | undefined
  state: TawPartState
  meta?: TawPartMeta | undefined
}

export interface TawPartMeta {
  startedAt?: number | undefined
  completedAt?: number | undefined
  durationMs?: number | undefined
}

/**
 * Base props shared by all taw-ui components.
 */
export interface TawBaseProps {
  /** Additional CSS classes */
  className?: string | undefined
  /** Whether to animate entrance. Default: true */
  animate?: boolean | undefined
}

/**
 * Props for a taw-ui component that renders a tool call part.
 */
export interface TawComponentProps<TOutput = unknown> extends TawBaseProps {
  part: TawToolPart<unknown, TOutput>
}

/**
 * A taw-ui component function signature.
 */
export type TawComponent<TOutput = unknown> = (
  props: TawComponentProps<TOutput>,
) => React.ReactElement
