import type { ZodSchema } from "zod"
import { tawParse, type ParseResult, type TawParseError } from "./utils/parse"

/**
 * Creates a taw-ui schema contract — the single source of truth
 * for a component's data shape, validation, and type inference.
 *
 * @example
 * ```ts
 * const KpiCard = defineTawContract("KpiCard", KpiCardSchema)
 *
 * // Type inference
 * type KpiCardData = typeof KpiCard.type
 *
 * // Strict parse (returns { data, error, success })
 * const result = KpiCard.parse(output)
 *
 * // Lenient parse (returns data | null — for streaming)
 * const data = KpiCard.safeParse(output)
 * ```
 */
export function defineTawContract<T>(
  name: string,
  schema: ZodSchema<T>,
) {
  return {
    name,
    schema,

    /** Strict parse with structured errors and suggestions */
    parse(data: unknown): ParseResult<T> {
      return tawParse(schema, data, name)
    },

    /** Lenient parse — returns data or null. Use during streaming. */
    safeParse(data: unknown): T | null {
      const result = schema.safeParse(data)
      return result.success ? result.data : null
    },

    // Phantom type for inference: typeof contract.type
    type: undefined as unknown as T,
  } as const
}

export type TawContract<T> = ReturnType<typeof defineTawContract<T>>

export type { ParseResult, TawParseError }
