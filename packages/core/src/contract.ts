import type { ZodSchema, ZodTypeAny } from "zod"
import { tawParse, type ParseResult, type TawParseError } from "./utils/parse"
import { strictify, coerceNulls, toStrictJSONSchema } from "./utils/strict"

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
 * // Parse (handles both strict-mode and regular output)
 * const result = KpiCard.parse(output)
 *
 * // Lenient parse (returns data | null — for streaming)
 * const data = KpiCard.safeParse(output)
 *
 * // Strict-mode schema for OpenAI / OpenRouter / Vercel AI SDK
 * const { object } = await generateObject({
 *   model: openai("gpt-4o"),
 *   schema: KpiCard.strict,
 *   prompt: "...",
 * })
 * ```
 */
export function defineTawContract<T>(
  name: string,
  schema: ZodSchema<T>,
) {
  let _strict: ZodTypeAny | undefined

  return {
    name,
    schema,

    /**
     * Strict-mode Zod schema — `.optional()` converted to `.nullable()`,
     * validation-only constraints stripped, `additionalProperties: false`.
     *
     * Pass this to `generateObject()`, `tool()`, or `zodResponseFormat()`
     * with any strict-mode provider (OpenAI, OpenRouter).
     *
     * @throws {StrictModeError} if the schema contains `z.record()` or `z.unknown()`
     */
    get strict(): ZodTypeAny {
      if (!_strict) _strict = strictify(schema as unknown as ZodTypeAny)
      return _strict
    },

    /**
     * Strict-mode JSON Schema object, ready for `response_format.json_schema.schema`.
     *
     * @example
     * ```ts
     * fetch("https://openrouter.ai/api/v1/chat/completions", {
     *   body: JSON.stringify({
     *     response_format: {
     *       type: "json_schema",
     *       json_schema: {
     *         name: "KpiCard",
     *         strict: true,
     *         schema: KpiCard.jsonSchema(),
     *       },
     *     },
     *   }),
     * })
     * ```
     */
    jsonSchema(): Record<string, unknown> {
      return toStrictJSONSchema(this.strict)
    },

    /**
     * Parse with null coercion — works with both strict-mode output
     * (fields are `null`) and regular output (fields are absent).
     *
     * Returns `{ data, error, success }` with structured error messages.
     */
    parse(data: unknown): ParseResult<T> {
      return tawParse(schema, coerceNulls(data), name)
    },

    /**
     * Lenient parse with null coercion — returns data or null.
     * Use during streaming when partial objects arrive.
     */
    safeParse(data: unknown): T | null {
      const result = schema.safeParse(coerceNulls(data))
      return result.success ? result.data : null
    },

    // Phantom type for inference: typeof contract.type
    type: undefined as unknown as T,
  } as const
}

export type TawContract<T> = ReturnType<typeof defineTawContract<T>>

export type { ParseResult, TawParseError }
