import { z, type ZodTypeAny } from "zod"

// ─── strictify ──────────────────────────────────────────────────────────────
// Transforms a Zod schema into a strict-mode-compatible variant:
//   .optional()        → .nullable()   (field stays required, accepts null)
//   .optional().default()  → .nullable()   (default stripped)
//   ZodObject           → .strict()     (additionalProperties: false)
//   ZodString/Number     → fresh instance (strips .url(), .min(), .max(), etc.)
//   ZodArray             → fresh array   (strips .min(), .max())
//   ZodRecord/ZodUnknown → throws
//
// The output schema is safe to pass to generateObject(), tool(), or
// zodResponseFormat() with any strict-mode provider (OpenAI, OpenRouter).

const UNSUPPORTED_TYPES = new Set(["ZodRecord", "ZodUnknown", "ZodAny", "ZodNever", "ZodVoid", "ZodUndefined"])

/**
 * Recursively transforms a Zod schema for strict-mode structured outputs.
 *
 * Converts `.optional()` to `.nullable()`, strips `.default()`,
 * adds `additionalProperties: false` to all objects, and removes
 * validation-only constraints that strict mode doesn't support.
 *
 * @throws {StrictModeError} if the schema contains `z.record()` or `z.unknown()`
 */
export function strictify(schema: ZodTypeAny): ZodTypeAny {
  return walk(schema)
}

function walk(s: ZodTypeAny): ZodTypeAny {
  const tn = s._def.typeName as string

  if (UNSUPPORTED_TYPES.has(tn)) {
    throw new StrictModeError(
      `${tn} is not compatible with strict-mode structured outputs. ` +
      `Strict mode requires a fixed set of known properties on every object.`,
    )
  }

  switch (tn) {
    // ── Wrappers ────────────────────────────────────────────────────────
    case "ZodOptional": {
      const inner = walk(s._def.innerType)
      return isNullable(inner) ? inner : inner.nullable()
    }

    case "ZodDefault": {
      // ZodDefault always wraps ZodOptional — unwrap both, make nullable
      return walk(s._def.innerType)
    }

    case "ZodNullable": {
      const inner = walk(s._def.innerType)
      return isNullable(inner) ? inner : inner.nullable()
    }

    // ── Composites ──────────────────────────────────────────────────────
    case "ZodObject": {
      const shape = (s as z.ZodObject<z.ZodRawShape>).shape
      const newShape: z.ZodRawShape = {}

      for (const [key, field] of Object.entries(shape)) {
        try {
          newShape[key] = walk(field as ZodTypeAny)
        } catch (e) {
          // If the field is optional and can't be strictified (e.g. z.record()),
          // omit it from the strict schema rather than failing entirely
          if (isOptionalLike(field as ZodTypeAny)) continue
          throw e
        }
      }

      return z.object(newShape).strict()
    }

    case "ZodArray":
      return z.array(walk(s._def.type))

    case "ZodUnion": {
      const options = (s._def.options as ZodTypeAny[]).map(walk)
      return z.union(options as [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]])
    }

    case "ZodDiscriminatedUnion": {
      const disc: string = (s as z.ZodDiscriminatedUnion<string, z.ZodDiscriminatedUnionOption<string>[]>).discriminator
      const options = (s as z.ZodDiscriminatedUnion<string, z.ZodDiscriminatedUnionOption<string>[]>).options.map(
        (o) => walk(o) as z.ZodDiscriminatedUnionOption<string>,
      )
      return z.discriminatedUnion(disc, options as [z.ZodDiscriminatedUnionOption<string>, ...z.ZodDiscriminatedUnionOption<string>[]])
    }

    case "ZodTuple": {
      const items = (s._def.items as ZodTypeAny[]).map(walk)
      return z.tuple(items as [ZodTypeAny, ...ZodTypeAny[]])
    }

    // ── Effects (.superRefine, .refine, .transform) ─────────────────────
    case "ZodEffects": {
      // Strip refinements — they are runtime-only and don't affect JSON Schema.
      // The base schema's parse() still applies them.
      return walk(s._def.schema)
    }

    // ── Primitives (return fresh instances without validation checks) ────
    case "ZodString":
      return z.string()

    case "ZodNumber":
      return z.number()

    case "ZodBoolean":
      return z.boolean()

    case "ZodEnum":
      return z.enum(s._def.values)

    case "ZodLiteral":
      return z.literal(s._def.value)

    case "ZodNull":
      return z.null()

    // ── Intersection ─────────────────────────────────────────────────────
    case "ZodIntersection":
      return z.intersection(walk(s._def.left), walk(s._def.right))

    // ── Passthrough for anything else ────────────────────────────────────
    default:
      return s
  }
}

function isNullable(s: ZodTypeAny): boolean {
  return s._def.typeName === "ZodNullable"
}

function isOptionalLike(s: ZodTypeAny): boolean {
  const tn = s._def.typeName as string
  if (tn === "ZodOptional") return true
  if (tn === "ZodDefault") return true
  if (tn === "ZodNullable") return isOptionalLike(s._def.innerType)
  return false
}

// ─── coerceNulls ────────────────────────────────────────────────────────────
// Pre-processes strict-mode output so it validates against .optional() schemas.
// Strict mode emits `null` for omitted fields; .optional() expects absent keys.

/**
 * Recursively converts `null` values to absent keys in an object tree.
 *
 * Strict-mode providers emit `{ title: null }` for omitted fields.
 * taw-ui's base schemas use `.optional()` which expects the key to be absent.
 * This bridges the two: `{ title: null }` → `{}`.
 *
 * Call this before passing strict-mode output to `schema.safeParse()`.
 */
export function coerceNulls(data: unknown): unknown {
  if (data === null || data === undefined) return undefined

  if (Array.isArray(data)) {
    return data.map(coerceNulls)
  }

  if (typeof data === "object") {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      const coerced = coerceNulls(value)
      if (coerced !== undefined) {
        result[key] = coerced
      }
    }
    return result
  }

  return data
}

// ─── JSON Schema export ─────────────────────────────────────────────────────

// Keywords that strict mode does not support.
// These are validation-only in Zod and get stripped from the JSON Schema.
const STRIP_KEYWORDS = new Set([
  "default",
  "format",
  "minimum",
  "maximum",
  "exclusiveMinimum",
  "exclusiveMaximum",
  "minLength",
  "maxLength",
  "minItems",
  "maxItems",
  "uniqueItems",
  "minProperties",
  "maxProperties",
  "pattern",
  "multipleOf",
])

/**
 * Convert a strict Zod schema to a plain JSON Schema object
 * ready for `response_format.json_schema.schema`.
 *
 * Uses `zod-to-json-schema` internally (lazy-loaded to avoid
 * bundling it for users who only need `strictify` or `coerceNulls`).
 */
export function toStrictJSONSchema(strictSchema: ZodTypeAny): Record<string, unknown> {
  // Lazy require to avoid pulling zod-to-json-schema into the bundle
  // for users who never call jsonSchema(). Tree-shaking can't eliminate
  // top-level imports, so this keeps the base bundle lean.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { zodToJsonSchema } = require("zod-to-json-schema") as typeof import("zod-to-json-schema")

  const raw = zodToJsonSchema(strictSchema, { $refStrategy: "none" })
  const { $schema: _, ...schema } = raw as Record<string, unknown>
  return stripUnsupported(schema)
}

function stripUnsupported(node: unknown): Record<string, unknown> {
  if (typeof node !== "object" || node === null) return node as Record<string, unknown>

  if (Array.isArray(node)) {
    return node.map(stripUnsupported) as unknown as Record<string, unknown>
  }

  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(node)) {
    if (STRIP_KEYWORDS.has(key)) continue
    if (typeof value === "object" && value !== null) {
      out[key] = Array.isArray(value)
        ? value.map(stripUnsupported)
        : stripUnsupported(value)
    } else {
      out[key] = value
    }
  }
  return out
}

// ─── Error class ────────────────────────────────────────────────────────────

export class StrictModeError extends Error {
  constructor(message: string) {
    super(`taw-ui strict mode: ${message}`)
    this.name = "StrictModeError"
  }
}
