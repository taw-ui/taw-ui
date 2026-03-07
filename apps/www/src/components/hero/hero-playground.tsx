"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, isToolUIPart } from "ai"
import { motion, AnimatePresence } from "framer-motion"
import {
  KpiCard,
  DataTable,
  OptionList,
  InsightCard,
  AlertCard,
  cn,
  type TawToolPart,
} from "@taw-ui/react"

import { Shimmer } from "@/components/ai-elements/shimmer"
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"

import { promptChips } from "./hero-data"

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number]

const transport = new DefaultChatTransport({ api: "/api/chat" })

const componentMap: Record<
  string,
  React.ComponentType<{ part: TawToolPart; animate?: boolean }>
> = {
  getMetrics: KpiCard,
  showTable: DataTable,
  chooseAction: OptionList,
  analyzeData: InsightCard,
  checkAlerts: AlertCard,
}

const toolLabels: Record<string, { icon: string; component: string }> = {
  getMetrics: { icon: "◎", component: "KpiCard" },
  showTable: { icon: "▤", component: "DataTable" },
  chooseAction: { icon: "☰", component: "OptionList" },
  analyzeData: { icon: "◆", component: "InsightCard" },
  checkAlerts: { icon: "△", component: "AlertCard" },
}

// ─── Slash commands ─────────────────────────────────────────────────────────

const slashCommands = [
  { command: "/kpi-card", label: "KPI Card", description: "Revenue, users & metrics", prompt: "Show me this month's revenue and growth" },
  { command: "/data-table", label: "Data Table", description: "Compare campaigns side by side", prompt: "Compare the last 3 campaigns side by side" },
  { command: "/option-list", label: "Option List", description: "Suggest next steps", prompt: "Recommend what we should focus on next" },
  { command: "/insight-card", label: "Insight Card", description: "Summarize analysis", prompt: "Summarize the analysis and key findings" },
  { command: "/alert-card", label: "Alert Card", description: "Show urgent alerts", prompt: "Show me any urgent issues or alerts" },
] as const

// ─── Command Menu ───────────────────────────────────────────────────────────

function CommandMenu({
  filter,
  onSelect,
  selectedIndex,
}: {
  filter: string
  onSelect: (prompt: string) => void
  selectedIndex: number
}) {
  const filtered = slashCommands.filter(
    (c) =>
      c.command.includes(filter.toLowerCase()) ||
      c.label.toLowerCase().includes(filter.replace("/", "").toLowerCase()),
  )

  if (filtered.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.15 }}
      className="absolute bottom-full left-0 mb-2 w-full overflow-hidden rounded-xl border border-(--taw-border)/40 bg-(--taw-surface-raised) shadow-(--taw-shadow-md)"
    >
      {filtered.map((cmd, i) => (
        <button
          key={cmd.command}
          type="button"
          onMouseDown={(e) => {
            e.preventDefault()
            onSelect(cmd.prompt)
          }}
          className={cn(
            "flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors",
            i === selectedIndex
              ? "bg-(--taw-accent-subtle) text-(--taw-accent)"
              : "text-(--taw-text-secondary) hover:bg-(--taw-surface-sunken)",
          )}
        >
          <span className="font-mono text-[11px] text-(--taw-accent)">
            {cmd.command}
          </span>
          <span className="text-[12px]">{cmd.label}</span>
          <span className="ml-auto text-[11px] text-(--taw-text-muted)">
            {cmd.description}
          </span>
        </button>
      ))}
    </motion.div>
  )
}

// ─── Input ───────────────────────────────────────────────────────────────────

function PromptInput({
  value,
  onChange,
  onSubmit,
  onCommandSelect,
  disabled,
}: {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  onCommandSelect: (prompt: string) => void
  disabled: boolean
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const isSlash = value.startsWith("/")
  const showMenu = menuOpen || isSlash

  const filtered = slashCommands.filter(
    (c) =>
      !isSlash ||
      c.command.includes(value.toLowerCase()) ||
      c.label.toLowerCase().includes(value.replace("/", "").toLowerCase()),
  )

  useEffect(() => {
    setSelectedIndex(0)
  }, [value])

  const handleSelect = useCallback(
    (prompt: string) => {
      setMenuOpen(false)
      onChange("")
      onCommandSelect(prompt)
    },
    [onChange, onCommandSelect],
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showMenu || filtered.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((i) => (i + 1) % filtered.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((i) => (i - 1 + filtered.length) % filtered.length)
    } else if (e.key === "Enter" && showMenu) {
      e.preventDefault()
      handleSelect(filtered[selectedIndex].prompt)
    } else if (e.key === "Escape") {
      setMenuOpen(false)
    }
  }

  return (
    <div className="relative">
      <AnimatePresence>
        {showMenu && (
          <CommandMenu
            filter={isSlash ? value : ""}
            onSelect={handleSelect}
            selectedIndex={selectedIndex}
          />
        )}
      </AnimatePresence>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (isSlash && filtered.length > 0) {
            handleSelect(filtered[selectedIndex].prompt)
          } else {
            onSubmit()
          }
        }}
        className={cn(
          "flex flex-col gap-2 rounded-2xl bg-(--taw-surface-raised) px-4 pb-3 pt-3 shadow-(--taw-shadow-md)",
          "ring-1 ring-(--taw-border)/30 transition-all",
          disabled && "opacity-50",
        )}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (isSlash) setMenuOpen(true)
          }}
          onBlur={() => {
            setTimeout(() => setMenuOpen(false), 150)
          }}
          disabled={disabled}
          placeholder="Ask for any interface or type / for commands..."
          className="w-full bg-transparent py-1 text-[14px] text-(--taw-text-primary) placeholder:text-(--taw-text-muted) outline-none! focus-visible:outline-none!"
        />
        <div className="flex items-center justify-between">
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              if (menuOpen) {
                setMenuOpen(false)
              } else {
                onChange("/")
                setMenuOpen(true)
                inputRef.current?.focus()
              }
            }}
            className={cn(
              "flex h-7 items-center gap-1.5 rounded-lg border px-2 text-[11px] transition-all",
              menuOpen
                ? "border-(--taw-accent)/30 text-(--taw-accent)"
                : "border-(--taw-border)/50 text-(--taw-text-muted) hover:border-(--taw-border) hover:text-(--taw-text-secondary)",
            )}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M9 2H4V4H9V2Z" />
              <path d="M9 13H4V15H9V13Z" />
              <path d="M20 2H15V4H20V2Z" />
              <path d="M9 9H4V11H9V9Z" />
              <path d="M9 20H4V22H9V20Z" />
              <path d="M20 9H15V11H20V9Z" />
              <path d="M11 4H9V9H11V4Z" />
              <path d="M11 15H9V20H11V15Z" />
              <path d="M22 4H20V9H22V4Z" />
              <path d="M4 4H2V9H4V4Z" />
              <path d="M4 15H2V20H4V15Z" />
              <path d="M15 4H13V9H15V4Z" />
              <path d="M19 14H17V22H19V14Z" />
              <path d="M22 19V17H14V19H22Z" />
            </svg>
            <span className="hidden sm:inline">Tools</span>
          </button>
          <button
            type="submit"
            disabled={disabled || !value.trim()}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-xl border transition-all",
              value.trim() && !disabled
                ? "border-transparent bg-(--taw-accent) text-white hover:bg-(--taw-accent-hover)"
                : "border-(--taw-border)/50 text-(--taw-text-disabled)",
            )}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M13 20H11V4H13V20Z" />
              <path d="M15 8H13V6H15V8Z" />
              <path d="M17 10H15V8H17V10Z" />
              <path d="M19 12H17V10H19V12Z" />
              <path d="M9 8H11V6H9V8Z" />
              <path d="M7 10L15 10V8H7V10Z" />
              <path d="M5 12L17 12V10L5 10V12Z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  )
}

// ─── Chip Icons ──────────────────────────────────────────────────────────────

const chipIcons: Record<string, React.ReactNode> = {
  "Show KPIs": (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M22 20H4V22H22V20Z" fill="currentColor" />
      <path d="M4 2H2V20H4V2Z" fill="currentColor" />
      <path d="M8 12H6V14H8V12Z" fill="currentColor" />
      <path d="M10 10H8V12H10V10Z" fill="currentColor" />
      <path d="M12 8H10V10H12V8Z" fill="currentColor" />
      <path d="M14 10H12V12H14V10Z" fill="currentColor" />
      <path d="M16 12H14V14H16V12Z" fill="currentColor" />
      <path d="M18 10H16V12H18V10Z" fill="currentColor" />
      <path d="M20 8H18V10H20V8Z" fill="currentColor" />
      <path d="M22 6H20V8H22V6Z" fill="currentColor" />
    </svg>
  ),
  "Compare campaigns": (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M4 4H6V20H4V4Z" fill="currentColor" />
      <path d="M6 2H16V4H6V2Z" fill="currentColor" />
      <path d="M18 6H20V20H18V6Z" fill="currentColor" />
      <path d="M6 20H18V22H6V20Z" fill="currentColor" />
      <path d="M18 4H16V6H18V4Z" fill="currentColor" />
      <path d="M14 4H12V10H14V4Z" fill="currentColor" />
      <path d="M18 8H12V10H18V8Z" fill="currentColor" />
      <path d="M10 16H8V18H10V16Z" fill="currentColor" />
      <path d="M13 12H11V18H13V12Z" fill="currentColor" />
      <path d="M16 14H14V18H16V14Z" fill="currentColor" />
    </svg>
  ),
  "Suggest next steps": (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect x="10" y="5" width="12" height="2" fill="currentColor" />
      <rect x="10" y="9" width="8" height="2" fill="currentColor" />
      <rect x="10" y="13" width="12" height="2" fill="currentColor" />
      <rect x="10" y="17" width="8" height="2" fill="currentColor" />
      <path d="M6 11H4V9H6V11ZM4 9H2V7H4V9ZM8 9H6V7H8V9ZM6 7H4V5H6V7Z" fill="currentColor" />
      <rect x="4" y="13" width="2" height="2" fill="currentColor" />
      <rect x="4" y="17" width="2" height="2" fill="currentColor" />
      <rect x="2" y="17" width="2" height="2" transform="rotate(-90 2 17)" fill="currentColor" />
      <rect x="6" y="17" width="2" height="2" transform="rotate(-90 6 17)" fill="currentColor" />
    </svg>
  ),
  "Summarize insights": (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M20 4H4V6H20V4Z" fill="currentColor" />
      <path d="M20 18H4V20H20V18Z" fill="currentColor" />
      <path d="M4 6H2V18H4V6Z" fill="currentColor" />
      <path d="M22 6H20V18H22V6Z" fill="currentColor" />
      <path d="M10 8H6V12H10V8Z" fill="currentColor" />
      <path d="M18 14H6V16H18V14Z" fill="currentColor" />
    </svg>
  ),
  "Show alerts": (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="10" width="2" height="2" fill="currentColor" />
      <rect width="2" height="2" transform="matrix(1 0 0 -1 2 14)" fill="currentColor" />
      <rect width="2" height="2" transform="matrix(-1 0 0 1 22 10)" fill="currentColor" />
      <rect x="22" y="14" width="2" height="2" transform="rotate(180 22 14)" fill="currentColor" />
      <rect x="4" y="8" width="2" height="2" fill="currentColor" />
      <rect width="2" height="2" transform="matrix(1 0 0 -1 4 16)" fill="currentColor" />
      <rect width="2" height="2" transform="matrix(-1 0 0 1 20 8)" fill="currentColor" />
      <rect x="20" y="16" width="2" height="2" transform="rotate(180 20 16)" fill="currentColor" />
      <rect x="6" y="6" width="2" height="2" fill="currentColor" />
      <rect width="2" height="2" transform="matrix(1 0 0 -1 6 18)" fill="currentColor" />
      <rect width="2" height="2" transform="matrix(-1 0 0 1 18 6)" fill="currentColor" />
      <rect x="18" y="18" width="2" height="2" transform="rotate(180 18 18)" fill="currentColor" />
      <rect x="8" y="4" width="2" height="2" fill="currentColor" />
      <rect width="2" height="2" transform="matrix(1 0 0 -1 8 20)" fill="currentColor" />
      <rect width="2" height="2" transform="matrix(-1 0 0 1 16 4)" fill="currentColor" />
      <rect x="16" y="20" width="2" height="2" transform="rotate(180 16 20)" fill="currentColor" />
      <rect x="10" y="2" width="2" height="2" fill="currentColor" />
      <rect width="2" height="2" transform="matrix(1 0 0 -1 10 22)" fill="currentColor" />
      <rect width="2" height="2" transform="matrix(-1 0 0 1 14 2)" fill="currentColor" />
      <rect x="14" y="22" width="2" height="2" transform="rotate(180 14 22)" fill="currentColor" />
      <rect width="2" height="2" transform="matrix(1 0 0 -1 11 17)" fill="currentColor" />
      <rect width="2" height="6" transform="matrix(1 0 0 -1 11 13)" fill="currentColor" />
    </svg>
  ),
}

// ─── Hero ────────────────────────────────────────────────────────────────────

export function HeroPlayground() {
  const [inputValue, setInputValue] = useState("")

  const { messages, sendMessage, status } = useChat({ transport })

  const hasInteracted = messages.length > 0
  const isLoading = status === "streaming" || status === "submitted"

  const handleSubmit = () => {
    const text = inputValue.trim()
    if (!text || isLoading) return
    sendMessage({ text })
    setInputValue("")
  }

  const handleCommandSelect = useCallback(
    (prompt: string) => {
      if (isLoading) return
      sendMessage({ text: prompt })
    },
    [isLoading, sendMessage],
  )

  const handleChipClick = (prompt: string) => {
    if (isLoading) return
    sendMessage({ text: prompt })
  }

  const showThinking = (() => {
    if (!isLoading) return false
    const lastMsg = messages[messages.length - 1]
    return !(
      lastMsg?.role === "assistant" &&
      lastMsg.parts.some(
        (p) => (p.type === "text" && p.text.trim()) || isToolUIPart(p),
      )
    )
  })()

  return (
    <section className="flex min-h-0 flex-1 flex-col items-center">
      {/* Landing state — vertically centered */}
      {!hasInteracted && (
        <div className="flex flex-1 flex-col items-center justify-center">
          <AnimatePresence>
            <motion.div
              key="hero-heading"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16, transition: { duration: 0.25, ease } }}
              transition={{ duration: 0.5, ease }}
              className="mb-8 flex flex-col items-center px-6 text-center sm:mb-10"
            >
              <div className="mb-5 flex items-center gap-2.5">
                <motion.span
                  className="text-lg text-(--taw-accent)"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  ✦
                </motion.span>
                <span className="font-pixel text-[13px] tracking-[0.15em] text-(--taw-text-muted)">
                  The interface layer for the HAI era
                </span>
              </div>

              <h1 className="max-w-xl text-[clamp(2.25rem,6vw,3.75rem)] leading-[1.06] font-bold tracking-tight text-(--taw-text-primary)">
                Build the UI your AI{" "}
                <span
                  className="animate-color-shift font-pixel bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, var(--taw-accent), var(--taw-pink), var(--taw-yellow), var(--taw-cyan), var(--taw-accent), var(--taw-pink))",
                  }}
                >
                  should have returned
                </span>
              </h1>

              <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-(--taw-text-secondary)">
                Schema-first components that turn structured AI outputs into
                beautiful, actionable interfaces.
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Conversation — scrolls internally, fills available space */}
      {hasInteracted && (
        <Conversation className="w-full max-w-[768px] min-h-0 flex-1 px-5 pt-8 sm:px-8">
          <ConversationContent className="gap-6 p-0 pb-4">
            {messages.map((message) => {
              if (message.role === "user") {
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[75%] rounded-2xl rounded-br-md bg-(--taw-accent) px-4 py-2.5 text-[13px] leading-relaxed text-white">
                      {message.parts
                        .filter((p) => p.type === "text")
                        .map((p) => (p.type === "text" ? p.text : ""))
                        .join("")}
                    </div>
                  </motion.div>
                )
              }

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease }}
                  className="flex flex-col gap-3"
                >
                  {message.parts.map((part, i) => {
                    if (part.type === "text" && part.text.trim()) {
                      return (
                        <p
                          key={`${message.id}-text-${i}`}
                          className="text-[14px] leading-relaxed text-(--taw-text-primary)"
                        >
                          {part.text}
                        </p>
                      )
                    }

                    if (isToolUIPart(part)) {
                      const toolName =
                        "toolName" in part
                          ? (part.toolName as string)
                          : part.type.replace("tool-", "")
                      const Component = componentMap[toolName]
                      const label = toolLabels[toolName]

                      if (
                        part.state === "input-streaming" ||
                        part.state === "input-available"
                      ) {
                        return (
                          <div
                            key={part.toolCallId}
                            className="flex flex-col gap-2"
                          >
                            {label && (
                              <span className="font-mono text-[10px] text-(--taw-text-muted)">
                                <span className="text-(--taw-accent)">
                                  {label.icon}
                                </span>{" "}
                                rendering {label.component}…
                              </span>
                            )}
                            {Component && (
                              <div className="pointer-events-none opacity-60">
                                <Component
                                  part={{
                                    id: `loading-${part.toolCallId}`,
                                    toolName,
                                    input: part.input ?? {},
                                    state: "streaming",
                                    output: undefined,
                                  }}
                                  animate={false}
                                />
                              </div>
                            )}
                          </div>
                        )
                      }

                      if (part.state === "output-available" && Component) {
                        return (
                          <div
                            key={part.toolCallId}
                            className="flex flex-col gap-2"
                          >
                            {label && (
                              <span className="font-mono text-[10px] text-(--taw-text-muted)">
                                <span className="text-(--taw-accent)">
                                  {label.icon}
                                </span>{" "}
                                rendered with {label.component}
                              </span>
                            )}
                            <motion.div
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.35, delay: 0.1, ease }}
                              className="pointer-events-none"
                            >
                              <Component
                                part={{
                                  id: part.toolCallId,
                                  toolName,
                                  input: part.input ?? {},
                                  state: "output-available",
                                  output: part.output,
                                }}
                                animate={false}
                              />
                            </motion.div>
                          </div>
                        )
                      }

                      if (part.state === "output-error") {
                        return (
                          <div
                            key={part.toolCallId}
                            className="rounded-lg bg-red-500/10 px-3 py-2 text-[13px] text-red-500"
                          >
                            Error rendering component
                          </div>
                        )
                      }
                    }

                    return null
                  })}
                </motion.div>
              )
            })}

            {showThinking && (
              <motion.div
                key="thinking"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease }}
                className="flex items-center gap-2"
              >
                <Shimmer
                  as="span"
                  className="text-[13px] font-medium"
                  duration={1.5}
                >
                  Thinking...
                </Shimmer>
              </motion.div>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      )}

      {/* Composer */}
      <motion.div
        layout
        transition={{ layout: { duration: 0.45, ease } }}
        className="w-full max-w-[768px] shrink-0 px-5 pb-6 sm:px-8"
      >
        {/* Quick-start chips — landing only, single row with edge fade */}
        {!hasInteracted && (
          <div className="relative mb-3">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-(--taw-surface-sunken) to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-(--taw-surface-sunken) to-transparent" />
            <div className="no-scrollbar flex gap-2 overflow-x-auto px-2">
              {promptChips.map((chip, i) => (
                <motion.button
                  key={chip.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.3 + i * 0.07, ease }}
                  onClick={() => handleChipClick(chip.prompt)}
                  disabled={isLoading}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-[12px] transition-all",
                    "border-(--taw-border)/60 bg-(--taw-surface) text-(--taw-text-secondary) hover:border-(--taw-accent)/20 hover:text-(--taw-text-primary)",
                    isLoading && "pointer-events-none opacity-50",
                  )}
                >
                  {chipIcons[chip.label]}
                  {chip.label}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        <PromptInput
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleSubmit}
          onCommandSelect={handleCommandSelect}
          disabled={isLoading}
        />
      </motion.div>
    </section>
  )
}
