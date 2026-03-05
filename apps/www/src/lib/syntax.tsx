import React from "react"

/**
 * Lightweight regex-based syntax highlighter for JS/TS/CSS code.
 * Uses CSS variables (--taw-syn-*) that switch between Dracula/Alucard.
 */

type TokenType =
  | "keyword"
  | "string"
  | "comment"
  | "type"
  | "function"
  | "number"
  | "operator"
  | "property"
  | "tag"
  | "attr"
  | "punctuation"
  | "plain"

interface Token {
  type: TokenType
  value: string
}

const KEYWORDS = new Set([
  "import", "export", "from", "default", "const", "let", "var",
  "function", "return", "if", "else", "for", "while", "do",
  "switch", "case", "break", "continue", "new", "delete", "typeof",
  "instanceof", "in", "of", "class", "extends", "super", "this",
  "async", "await", "yield", "try", "catch", "finally", "throw",
  "true", "false", "null", "undefined", "void",
  "type", "interface", "enum", "as", "is",
])

const TYPE_WORDS = new Set([
  "string", "number", "boolean", "object", "unknown", "any", "never",
  "void", "null", "undefined", "Array", "Record", "Promise",
  "React", "ReactNode", "ReactElement",
])

// Order matters — first match wins
const TOKEN_RULES: Array<{ type: TokenType; pattern: RegExp }> = [
  // Comments
  { type: "comment", pattern: /\/\/[^\n]*/ },
  { type: "comment", pattern: /\/\*[\s\S]*?\*\// },

  // Strings (double, single, backtick)
  { type: "string", pattern: /"(?:[^"\\]|\\.)*"/ },
  { type: "string", pattern: /'(?:[^'\\]|\\.)*'/ },
  { type: "string", pattern: /`(?:[^`\\]|\\.)*`/ },

  // JSX tags: <Component, </Component, <div, </div, />
  { type: "tag", pattern: /<\/?\w[\w.-]*/ },
  { type: "tag", pattern: /\/>/ },

  // Numbers
  { type: "number", pattern: /\b\d+\.?\d*(?:e[+-]?\d+)?\b/ },

  // Operators
  { type: "operator", pattern: /=>|===|!==|==|!=|>=|<=|&&|\|\||[+\-*/%]=?|\.{3}/ },

  // Punctuation
  { type: "punctuation", pattern: /[{}()[\];:,.<>?!&|=]/ },

  // Words (identifiers, keywords, types)
  { type: "plain", pattern: /[a-zA-Z_$][\w$]*/ },

  // Whitespace/other
  { type: "plain", pattern: /\s+/ },
  { type: "plain", pattern: /./ },
]

// Combined regex
const MASTER_REGEX = new RegExp(
  TOKEN_RULES.map((r) => `(${r.pattern.source})`).join("|"),
  "gm",
)

function classifyWord(word: string, prevToken: Token | null): TokenType {
  if (KEYWORDS.has(word)) return "keyword"
  if (TYPE_WORDS.has(word)) return "type"

  // Word after ":" or "extends" or in generic position → type
  if (prevToken && (prevToken.value === ":" || prevToken.value === "extends" || prevToken.value === "<")) {
    // Capitalize check — PascalCase is likely a type
    if (word[0] === word[0]?.toUpperCase() && word[0] !== word[0]?.toLowerCase()) {
      return "type"
    }
  }

  // Word followed by ( → function (we can't look ahead, but PascalCase components are types)
  if (word[0] === word[0]?.toUpperCase() && word[0] !== word[0]?.toLowerCase()) {
    return "type"
  }

  return "plain"
}

function tokenize(code: string): Token[] {
  const tokens: Token[] = []
  let match: RegExpExecArray | null

  MASTER_REGEX.lastIndex = 0
  while ((match = MASTER_REGEX.exec(code)) !== null) {
    const value = match[0]
    if (!value) continue

    // Find which group matched
    let type: TokenType = "plain"
    for (let i = 0; i < TOKEN_RULES.length; i++) {
      if (match[i + 1] !== undefined) {
        type = TOKEN_RULES[i]!.type
        break
      }
    }

    // Refine "plain" tokens that are words
    if (type === "plain" && /^[a-zA-Z_$]/.test(value)) {
      const prevNonWs = tokens.findLast((t) => t.value.trim() !== "")
      type = classifyWord(value, prevNonWs ?? null)
    }

    tokens.push({ type, value })
  }

  return tokens
}

// Post-process: detect function calls (word followed by "(")
function postProcess(tokens: Token[]): Token[] {
  for (let i = 0; i < tokens.length - 1; i++) {
    const current = tokens[i]!
    // Find next non-whitespace token
    let nextIdx = i + 1
    while (nextIdx < tokens.length && tokens[nextIdx]!.value.trim() === "") {
      nextIdx++
    }
    const next = tokens[nextIdx]

    if (
      current.type === "plain" &&
      next &&
      next.value === "(" &&
      !KEYWORDS.has(current.value)
    ) {
      current.type = "function"
    }

    // Detect property keys: word followed by ":" (but not in ternary)
    if (
      current.type === "plain" &&
      next &&
      next.value === ":" &&
      // Quick heuristic: if the previous meaningful token is { or , it's an object key
      (() => {
        const prev = tokens.slice(0, i).findLast((t) => t.value.trim() !== "")
        return prev && (prev.value === "{" || prev.value === "," || prev.value === "\n")
      })()
    ) {
      current.type = "property"
    }

    // JSX attribute: word followed by "=" inside a tag context
    if (
      current.type === "plain" &&
      next &&
      next.value === "="
    ) {
      // Check if we're after a tag
      const prevTags = tokens.slice(Math.max(0, i - 10), i)
      if (prevTags.some((t) => t.type === "tag")) {
        current.type = "attr"
      }
    }
  }

  return tokens
}

const TOKEN_COLORS: Record<TokenType, string> = {
  keyword: "var(--taw-syn-keyword)",
  string: "var(--taw-syn-string)",
  comment: "var(--taw-syn-comment)",
  type: "var(--taw-syn-type)",
  function: "var(--taw-syn-function)",
  number: "var(--taw-syn-number)",
  operator: "var(--taw-syn-operator)",
  property: "var(--taw-syn-property)",
  tag: "var(--taw-syn-tag)",
  attr: "var(--taw-syn-attr)",
  punctuation: "var(--taw-syn-punctuation)",
  plain: "inherit",
}

export function highlightCode(code: string): React.ReactNode[] {
  const tokens = postProcess(tokenize(code))
  const elements: React.ReactNode[] = []

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]!
    if (token.type === "plain" || token.type === "punctuation") {
      elements.push(token.value)
    } else {
      elements.push(
        <span key={i} style={{ color: TOKEN_COLORS[token.type] }}>
          {token.value}
        </span>,
      )
    }
  }

  return elements
}
