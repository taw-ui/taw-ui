import { ZodSchema, ZodError } from "zod"

export interface ParseResult<T> {
  data: T | null
  error: TawParseError | null
  success: boolean
}

export interface TawParseError {
  message: string
  received: unknown
  issues: Array<{
    path: string
    expected: string
    received: string
    suggestion?: string
  }>
}

/**
 * Safely parse data with taw-ui's helpful error format.
 * Returns structured errors with field suggestions for mismatches.
 */
export function tawParse<T>(
  schema: ZodSchema<T>,
  data: unknown,
  componentName: string,
): ParseResult<T> {
  const result = schema.safeParse(data)

  if (result.success) {
    return { data: result.data, error: null, success: true }
  }

  const error = buildParseError(result.error, data, componentName)
  return { data: null, error, success: false }
}

function buildParseError(
  zodError: ZodError,
  received: unknown,
  componentName: string,
): TawParseError {
  const issues = zodError.issues.map((issue) => {
    const path = issue.path.join(".")
    const suggestion = findSuggestion(path, received)

    return {
      path,
      expected: issue.code,
      received: typeof received === "object" && received !== null
        ? JSON.stringify((received as Record<string, unknown>)[path])
        : String(received),
      suggestion,
    }
  })

  return {
    message: `taw-ui: ${componentName} received invalid data`,
    received,
    issues,
  }
}

/**
 * Simple field name similarity check for "Did you mean?" suggestions.
 */
function findSuggestion(fieldPath: string, data: unknown): string | undefined {
  if (typeof data !== "object" || data === null) return undefined

  const keys = Object.keys(data as Record<string, unknown>)
  const field = fieldPath.split(".").pop() ?? fieldPath

  // Check for common renames
  const commonRenames: Record<string, string[]> = {
    label: ["title", "name", "key", "text"],
    value: ["amount", "count", "total", "number", "val"],
    id: ["key", "uuid", "identifier", "_id"],
    description: ["desc", "subtitle", "note", "body"],
  }

  for (const [canonical, aliases] of Object.entries(commonRenames)) {
    if (field === canonical) {
      const match = keys.find((k) => aliases.includes(k))
      if (match) return `Did you mean "${match}" → "${canonical}"?`
    }
  }

  return undefined
}
