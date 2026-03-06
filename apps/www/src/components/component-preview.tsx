"use client"

import { useState, useMemo, useCallback, useId } from "react"
import type { TawToolPart, TawReceipt } from "@taw-ui/react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@taw-ui/react"
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
  code?: string
}

type ViewMode = "preview" | "chat" | "code"

// ─── View mode icons ────────────────────────────────────────────────────────

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

// ─── Chat simulation (inline) ────────────────────────────────────────────────

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
        delete output[opt.key]
      }
    }
    return { ...basePart, output }
  }, [basePart, hasOutput, options, toggles])

  const availableOptions = useMemo(() => {
    if (!options || !hasOutput) return []
    const output = basePart?.output as Record<string, unknown> | undefined
    if (!output) return []
    return options.filter((opt) => output[opt.key] !== undefined)
  }, [options, hasOutput, basePart])

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

  // Code highlight
  const highlighted = useMemo(() => (code ? highlightCode(code) : null), [code])
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(() => {
    if (!code) return
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  const modeIcons: Record<ViewMode, React.ReactNode> = {
    preview: <EyeIcon />,
    chat: <ChatIcon />,
    code: <CodeIcon />,
  }

  return (
    <div className="overflow-hidden rounded-(--taw-radius-lg) border border-(--taw-border) shadow-(--taw-shadow-md)">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-(--taw-border) bg-(--taw-surface) px-3 py-2">
        {/* View mode tabs — icon only */}
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

        {/* State tabs — visible in preview and chat modes */}
        {(viewMode === "preview" || viewMode === "chat") && entries.length > 1 && (
          <>
            {availableModes.length > 1 && <div className="mx-1 h-4 w-px bg-(--taw-border)" />}
            <div className="flex gap-px rounded-lg bg-(--taw-surface-sunken) p-0.5">
              {entries.map(([key]) => (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className={cn(
                    "relative rounded-md px-2.5 py-1 font-mono text-[11px] transition-colors",
                    active === key
                      ? "font-medium text-(--taw-text-primary)"
                      : "text-(--taw-text-muted) hover:text-(--taw-text-secondary)",
                  )}
                >
                  {active === key && (
                    <motion.div
                      layoutId={`preview-tab-${instanceId}`}
                      className="absolute inset-0 rounded-md bg-(--taw-surface-raised) shadow-(--taw-shadow-sm)"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="relative">{key}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Option toggles — only in preview mode */}
        {viewMode === "preview" && availableOptions.length > 0 && (
          <>
            <div className="mx-1 h-4 w-px bg-(--taw-border)" />
            <div className="flex flex-wrap gap-1">
              {availableOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => toggle(opt.key)}
                  className={cn(
                    "rounded-md border px-2 py-0.5 font-mono text-[10px] transition-all",
                    toggles[opt.key]
                      ? "border-(--taw-accent-subtle) bg-(--taw-accent-subtle) text-(--taw-accent)"
                      : "border-(--taw-border) text-(--taw-text-muted) hover:text-(--taw-text-secondary)",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Copy icon — only in code mode, right-aligned */}
        {viewMode === "code" && (
          <motion.button
            onClick={handleCopy}
            whileTap={{ scale: 0.9 }}
            className="ml-auto flex items-center justify-center rounded-md p-1 text-(--taw-text-muted) transition-colors hover:text-(--taw-text-primary)"
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

      {/* Content area */}
      <AnimatePresence mode="wait">
        {viewMode === "preview" && (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="relative bg-(--taw-surface-sunken) p-6"
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
            <div className="flex items-center gap-2 border-t border-(--taw-border) bg-(--taw-surface) px-4 py-2.5">
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
          >
            <pre className="overflow-x-auto bg-(--taw-surface-sunken) p-4 font-mono text-[12px] leading-[1.7] text-(--taw-text-primary)">
              <code>{highlighted}</code>
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
