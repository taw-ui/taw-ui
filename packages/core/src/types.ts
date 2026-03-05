/**
 * The lifecycle state of a tool call part.
 * Mirrors Vercel AI SDK v5 part states.
 */
export type TawPartState =
  | "input-available"   // Tool called, waiting for execution
  | "streaming"         // Tool is executing, data arriving
  | "output-available"  // Execution complete, data ready
  | "output-error"      // Execution failed

/**
 * Generic tool call part — SDK-agnostic representation.
 * Adapters (vercel-ai, anthropic, openai) convert their native
 * part format into this shape.
 */
export interface TawToolPart<TInput = unknown, TOutput = unknown> {
  /** Unique ID for this tool call */
  id: string
  /** The name of the tool that was called */
  toolName: string
  /** The input arguments passed to the tool */
  input: TInput
  /** The output returned by the tool (undefined if not yet available) */
  output?: TOutput
  /** Error if execution failed */
  error?: Error | string
  /** Current lifecycle state */
  state: TawPartState
  /** Execution metadata */
  meta?: {
    startedAt?: number
    completedAt?: number
    durationMs?: number
  }
}

/**
 * A taw-ui component that accepts a tool part.
 */
export interface TawComponent<TOutput = unknown> {
  (props: { part: TawToolPart<unknown, TOutput> }): React.ReactElement | null
}
