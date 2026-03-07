"use client"

import { useState, useMemo, useCallback, useId, useRef, useEffect } from "react"
import type { TawToolPart, TawReceipt } from "taw-ui"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/cn"
import { highlightCode } from "@/lib/syntax"
import { PixelIcon } from "./pixel-icon"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface PreviewOption {
  key: string
  label: string
  defaultOn?: boolean
}

export interface ChatMessage {
  role: "user" | "assistant"
  content?: string
  tool?: React.ReactNode
}

interface ComponentPreviewProps {
  fixtures: Record<string, TawToolPart>
  options?: PreviewOption[]
  children: (part: TawToolPart, key: string) => React.ReactNode
  chatMessages?: (opts: {
    part: TawToolPart
    component: React.ReactNode
    onAction: (actionId: string, payload: unknown) => void
    receipt: TawReceipt | undefined
    pending: boolean
  }) => ChatMessage[]
  code?: string | ((part: TawToolPart) => string)
}

type ViewMode = "preview" | "chat" | "code"

// ─── Icons ───────────────────────────────────────────────────────────────────

function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  )
}

function CodeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

function TuneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  )
}

// ─── State Dropdown ──────────────────────────────────────────────────────────

function StateDropdown({
  entries,
  active,
  onSelect,
}: {
  entries: [string, TawToolPart][]
  active: string
  onSelect: (key: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  // Categorize entries
  const errorKeys = new Set<string>()
  const errorStates = entries.filter(([key, part]) => {
    if (part.state === "output-error" || key.includes("parse") || key.includes("invalid") || key.includes("error")) {
      errorKeys.add(key)
      return true
    }
    return false
  })
  const successStates = entries.filter(([key]) => !errorKeys.has(key))

  const showCategories = errorStates.length > 0

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-mono text-[11px] transition-all",
          open
            ? "bg-(--taw-surface-raised) text-(--taw-text-primary) shadow-(--taw-shadow-sm)"
            : "text-(--taw-text-muted) hover:text-(--taw-text-primary)",
        )}
      >
        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-(--taw-accent)" />
        {active}
        <ChevronDownIcon className={cn("transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="absolute right-0 top-full z-50 mt-1.5 min-w-[160px] overflow-hidden rounded-xl border border-(--taw-border) bg-(--taw-surface) p-1 shadow-(--taw-shadow-md)"
          >
            {showCategories ? (
              <>
                {successStates.length > 0 && (
                  <div>
                    <span className="block px-2.5 pb-1 pt-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-(--taw-text-muted)/60">
                      States
                    </span>
                    {successStates.map(([key]) => (
                      <DropdownItem
                        key={key}
                        label={key}
                        active={active === key}
                        onClick={() => { onSelect(key); setOpen(false) }}
                      />
                    ))}
                  </div>
                )}
                {errorStates.length > 0 && (
                  <div className="mt-1 border-t border-(--taw-border-subtle) pt-1">
                    <span className="block px-2.5 pb-1 pt-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-(--taw-text-muted)/60">
                      Errors
                    </span>
                    {errorStates.map(([key]) => (
                      <DropdownItem
                        key={key}
                        label={key}
                        active={active === key}
                        onClick={() => { onSelect(key); setOpen(false) }}
                        variant="error"
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              entries.map(([key]) => (
                <DropdownItem
                  key={key}
                  label={key}
                  active={active === key}
                  onClick={() => { onSelect(key); setOpen(false) }}
                />
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DropdownItem({
  label,
  active,
  onClick,
  variant,
}: {
  label: string
  active: boolean
  onClick: () => void
  variant?: "error"
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left font-mono text-[11px] transition-colors",
        active
          ? "bg-(--taw-accent-subtle) text-(--taw-accent)"
          : variant === "error"
            ? "text-(--taw-text-muted) hover:bg-(--taw-error)/5 hover:text-(--taw-error)"
            : "text-(--taw-text-muted) hover:bg-(--taw-surface-raised) hover:text-(--taw-text-primary)",
      )}
    >
      {active && <span className="inline-flex h-1 w-1 rounded-full bg-(--taw-accent)" />}
      {label}
    </button>
  )
}

// ─── Chat simulation ────────────────────────────────────────────────────────

function MiniChat({ messages, onReset }: { messages: ChatMessage[]; onReset?: () => void }) {
  return (
    <div className="flex flex-col gap-3">
      {messages.map((msg, i) => (
        <div
          key={`${msg.role}-${i}`}
          className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
        >
          {msg.role === "user" ? (
            <div className="max-w-[80%] rounded-2xl rounded-br-md bg-(--taw-accent) px-3.5 py-2 text-[13px] text-white">
              {msg.content}
            </div>
          ) : msg.tool ? (
            <div className="w-full max-w-[95%]">
              {msg.content && (
                <p className="mb-2 text-[13px] leading-relaxed text-(--taw-text-primary)">
                  {msg.content}
                </p>
              )}
              {msg.tool}
            </div>
          ) : (
            <div className="max-w-[85%] text-[13px] leading-relaxed text-(--taw-text-primary)">
              {msg.content}
            </div>
          )}
        </div>
      ))}
      {onReset && (
        <button
          onClick={onReset}
          className="self-start text-[10px] text-(--taw-text-muted) underline decoration-dotted hover:text-(--taw-text-primary)"
        >
          reset demo
        </button>
      )}
    </div>
  )
}

// ─── Component ──────────────────────────────────────────────────────────────

export function ComponentPreview({
  fixtures,
  options,
  children,
  chatMessages,
  code,
}: ComponentPreviewProps) {
  const instanceId = useId()
  const entries = Object.entries(fixtures)
  const [active, setActive] = useState(entries[0]?.[0] ?? "")
  const basePart = fixtures[active]

  const availableModes: ViewMode[] = ["preview"]
  if (chatMessages) availableModes.push("chat")
  if (code) availableModes.push("code")

  const [viewMode, setViewMode] = useState<ViewMode>("preview")

  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    if (!options) return {}
    const init: Record<string, boolean> = {}
    for (const opt of options) {
      init[opt.key] = opt.defaultOn ?? true
    }
    return init
  })

  const toggle = (key: string) =>
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }))

  const hasOutput =
    basePart?.state === "output-available" && basePart.output != null

  const activePart = useMemo(() => {
    if (!basePart || !hasOutput || !options) return basePart

    const output = { ...(basePart.output as Record<string, unknown>) }
    for (const opt of options) {
      if (!toggles[opt.key]) {
        // Handle nested keys inside stats array (e.g. "diff" lives on each stat)
        if (opt.key === "diff" && Array.isArray(output.stats)) {
          output.stats = (output.stats as Record<string, unknown>[]).map((s) => {
            const { diff: _, ...rest } = s
            return rest
          })
        } else {
          delete output[opt.key]
        }
      }
    }
    return { ...basePart, output }
  }, [basePart, hasOutput, options, toggles])

  const availableOptions = useMemo(() => {
    if (!options || !hasOutput) return []
    const output = basePart?.output as Record<string, unknown> | undefined
    if (!output) return []
    return options.filter((opt) => {
      if (opt.key === "diff" && Array.isArray(output.stats)) {
        return (output.stats as Record<string, unknown>[]).some((s) => s.diff !== undefined)
      }
      return output[opt.key] !== undefined
    })
  }, [options, hasOutput, basePart])

  const [showOptions, setShowOptions] = useState(false)
  const [codeExpanded, setCodeExpanded] = useState(false)

  // Chat state
  const [receipt, setReceipt] = useState<TawReceipt | undefined>()
  const [pending, setPending] = useState(false)

  const handleAction = useCallback((_actionId: string, payload: unknown) => {
    const p = payload as { receipt?: TawReceipt }
    setPending(true)
    setTimeout(() => {
      if (p.receipt) setReceipt(p.receipt)
      setPending(false)
    }, 600)
  }, [])

  const renderedComponent = activePart ? children(activePart, active) : null

  const resolvedChatMessages = chatMessages && activePart
    ? chatMessages({ part: activePart, component: renderedComponent, onAction: handleAction, receipt, pending })
    : []

  // Code — resolve function or string, reactive to active part
  const resolvedCode = useMemo(() => {
    if (!code) return null
    if (typeof code === "function") return activePart ? code(activePart) : null
    return code
  }, [code, activePart])

  const highlighted = useMemo(() => (resolvedCode ? highlightCode(resolvedCode) : null), [resolvedCode])

  // Reset expand when code changes
  useEffect(() => { setCodeExpanded(false) }, [resolvedCode])
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(() => {
    if (!resolvedCode) return
    navigator.clipboard.writeText(resolvedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [resolvedCode])

  const modeIcons: Record<ViewMode, React.ReactNode> = {
    preview: <EyeIcon />,
    chat: <ChatIcon />,
    code: <CodeIcon />,
  }

  const isContentView = viewMode === "preview" || viewMode === "chat"

  return (
    <div className="rounded-(--taw-radius-lg) border border-(--taw-border) shadow-(--taw-shadow-md)">
      {/* Toolbar */}
      <div className="relative flex items-center justify-between rounded-t-(--taw-radius-lg) border-b border-(--taw-border) bg-(--taw-surface) px-3 py-2">
        {/* Left: view mode tabs */}
        <div className="flex items-center gap-2">
          {availableModes.length > 1 && (
            <div className="flex gap-px rounded-lg bg-(--taw-surface-sunken) p-0.5">
              {availableModes.map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    "relative flex items-center justify-center rounded-md p-1.5 transition-colors",
                    viewMode === mode
                      ? "text-(--taw-text-primary)"
                      : "text-(--taw-text-muted) hover:text-(--taw-text-secondary)",
                  )}
                >
                  {viewMode === mode && (
                    <motion.div
                      layoutId={`view-mode-tab-${instanceId}`}
                      className="absolute inset-0 rounded-md bg-(--taw-surface-raised) shadow-(--taw-shadow-sm)"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="relative flex">{modeIcons[mode]}</span>
                </button>
              ))}
            </div>
          )}

          {/* Tune icon — toggles options strip */}
          {isContentView && availableOptions.length > 0 && (
            <>
              <div className="mx-0.5 h-4 w-px bg-(--taw-border)" />
              <button
                onClick={() => setShowOptions(!showOptions)}
                className={cn(
                  "flex items-center justify-center rounded-md p-1.5 transition-colors",
                  showOptions
                    ? "bg-(--taw-accent-subtle) text-(--taw-accent)"
                    : "text-(--taw-text-muted) hover:text-(--taw-text-secondary)",
                )}
              >
                <TuneIcon />
              </button>
            </>
          )}
        </div>

        {/* Right: state dropdown + copy */}
        <div className="flex items-center gap-2">
          {isContentView && entries.length > 1 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-(--taw-text-muted)/50">
                State
              </span>
              <StateDropdown
                entries={entries as [string, TawToolPart][]}
                active={active}
                onSelect={setActive}
              />
            </div>
          )}

          {viewMode === "code" && (
            <motion.button
              onClick={handleCopy}
              whileTap={{ scale: 0.9 }}
              className="flex items-center justify-center rounded-md p-1 text-(--taw-text-muted) transition-colors hover:text-(--taw-text-primary)"
            >
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.1 }}>
                    <PixelIcon name="check" size={14} />
                  </motion.span>
                ) : (
                  <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.1 }}>
                    <PixelIcon name="copy" size={14} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </div>
      </div>

      {/* Options strip — below toolbar */}
      <AnimatePresence>
        {showOptions && isContentView && availableOptions.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="overflow-hidden border-b border-(--taw-border-subtle)"
          >
            <div className="flex flex-wrap items-center gap-1.5 bg-(--taw-surface) px-3 py-2">
              <span className="mr-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-(--taw-text-muted)/50">
                Toggle
              </span>
              {availableOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => toggle(opt.key)}
                  className={cn(
                    "rounded-md border px-2 py-0.5 font-mono text-[10px] transition-all",
                    toggles[opt.key]
                      ? "border-(--taw-accent)/20 bg-(--taw-accent-subtle) text-(--taw-accent)"
                      : "border-(--taw-border) text-(--taw-text-muted) line-through decoration-(--taw-text-muted)/30 hover:text-(--taw-text-secondary)",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content area */}
      <AnimatePresence mode="wait">
        {viewMode === "preview" && (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="relative overflow-hidden rounded-b-(--taw-radius-lg) bg-(--taw-surface-sunken) p-6"
          >
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(circle, oklch(0.5 0 0 / 0.12) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={`${active}-${JSON.stringify(toggles)}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="relative"
              >
                {renderedComponent}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {viewMode === "chat" && (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            <div className="bg-(--taw-surface-sunken) p-4">
              <MiniChat
                messages={resolvedChatMessages}
                onReset={receipt ? () => setReceipt(undefined) : undefined}
              />
            </div>
            <div className="flex items-center gap-2 overflow-hidden rounded-b-(--taw-radius-lg) border-t border-(--taw-border) bg-(--taw-surface) px-4 py-2.5">
              <div className="flex-1 rounded-lg border border-(--taw-border) bg-(--taw-surface-sunken) px-3 py-1.5 text-[12px] text-(--taw-text-muted)">
                Type a message…
              </div>
            </div>
          </motion.div>
        )}

        {viewMode === "code" && highlighted && (
          <motion.div
            key="code"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="relative overflow-hidden rounded-b-(--taw-radius-lg) bg-(--taw-surface-sunken)"
          >
            <motion.div
              animate={{ maxHeight: codeExpanded ? 2000 : 200 }}
              initial={false}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-[1.7] text-(--taw-text-primary)">
                <code>{highlighted}</code>
              </pre>
            </motion.div>
            <AnimatePresence>
              {!codeExpanded && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-x-0 bottom-0 flex items-end justify-center rounded-b-(--taw-radius-lg)"
                >
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-(--taw-surface-sunken) to-transparent" />
                  <motion.button
                    onClick={() => setCodeExpanded(true)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative mb-3 rounded-lg border border-(--taw-border) bg-(--taw-surface) px-3 py-1 font-mono text-[11px] text-(--taw-text-muted) shadow-(--taw-shadow-sm) transition-colors hover:border-(--taw-accent)/30 hover:text-(--taw-text-primary)"
                  >
                    Expand
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
