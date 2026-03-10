"use client"

import React, { useState, useRef, useEffect, useCallback, useSyncExternalStore } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, isToolUIPart } from "ai"
import { motion, AnimatePresence } from "motion/react"
import type { ToolPart } from "@/components/taw/lib/types"
import { KpiCard } from "@/components/taw/kpi-card"
import { DataTable } from "@/components/taw/data-table"
import { OptionList } from "@/components/taw/option-list"
import { InsightCard } from "@/components/taw/insight-card"
import { AlertCard } from "@/components/taw/alert-card"
import { LinkCard } from "@/components/taw/link-card"
import { MemoryCard } from "@/components/taw/memory-card"
import { IssueCard } from "@/components/taw/issue-card"
import { EventCard } from "@/components/taw/event-card"
import { PostCard } from "@/components/taw/post-card"
import { cn } from "@/components/taw/lib/utils"
import { MetallicPaint } from "@/components/metallic-paint"

import { useStickToBottomContext } from "use-stick-to-bottom"
import { Shimmer } from "@/components/ai-elements/shimmer"
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation"

import { promptChips } from "./hero-data"

// ─── Spring presets (physical motion > duration-based) ──────────────────────
const spring = {
  /** Hero-level entrances: grand, slightly bouncy */
  hero: { type: "spring" as const, duration: 0.7, bounce: 0.15 },
  /** Content appearing: smooth, no bounce */
  content: { type: "spring" as const, duration: 0.5, bounce: 0 },
  /** UI elements: snappy, responsive */
  snappy: { type: "spring" as const, duration: 0.35, bounce: 0.1 },
  /** Micro-interactions: instant feel */
  micro: { type: "spring" as const, duration: 0.25, bounce: 0 },
  /** Layout shifts: smooth and deliberate */
  layout: { type: "spring" as const, duration: 0.6, bounce: 0.05 },
}

function subscribeToDark(cb: () => void) {
  const observer = new MutationObserver(cb)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
  return () => observer.disconnect()
}
function getIsDark() { return document.documentElement.classList.contains("dark") }

const transport = new DefaultChatTransport({ api: "/api/chat" })

const componentMap: Record<
  string,
  React.ComponentType<{ part: ToolPart; animate?: boolean }>
> = {
  getMetrics: KpiCard,
  showTable: DataTable,
  chooseAction: OptionList,
  analyzeData: InsightCard,
  checkAlerts: AlertCard,
  showLink: LinkCard,
  recallMemory: MemoryCard,
  showIssue: IssueCard,
  showEvent: EventCard,
  showPost: PostCard,
}

const toolLabels: Record<string, { icon: string; component: string }> = {
  getMetrics: { icon: "◎", component: "KpiCard" },
  showTable: { icon: "▤", component: "DataTable" },
  chooseAction: { icon: "☰", component: "OptionList" },
  analyzeData: { icon: "◆", component: "InsightCard" },
  checkAlerts: { icon: "△", component: "AlertCard" },
  showLink: { icon: "🔗", component: "LinkCard" },
  recallMemory: { icon: "🧠", component: "MemoryCard" },
  showIssue: { icon: "⚑", component: "IssueCard" },
  showEvent: { icon: "◷", component: "EventCard" },
  showPost: { icon: "✦", component: "PostCard" },
}

// ─── Slash commands ─────────────────────────────────────────────────────────

const slashCommands = [
  { command: "/kpi-card", label: "KPI Card", description: "Revenue, users & metrics", prompt: "Show me this month's revenue and growth" },
  { command: "/data-table", label: "Data Table", description: "Compare campaigns side by side", prompt: "Compare the last 3 campaigns side by side" },
  { command: "/option-list", label: "Option List", description: "Suggest next steps", prompt: "Recommend what we should focus on next" },
  { command: "/insight-card", label: "Insight Card", description: "Summarize analysis", prompt: "Summarize the analysis and key findings" },
  { command: "/alert-card", label: "Alert Card", description: "Show urgent alerts", prompt: "Show me any urgent issues or alerts" },
  { command: "/link-card", label: "Link Card", description: "Preview a URL", prompt: "Preview the taw-ui documentation site" },
  { command: "/memory-card", label: "Memory Card", description: "What you remember", prompt: "What do you remember about me?" },
  { command: "/issue-card", label: "Issue Card", description: "Bugs & tickets", prompt: "Show me the latest high-priority bug" },
  { command: "/event-card", label: "Event Card", description: "Calendar events", prompt: "What's my next meeting?" },
  { command: "/post-card", label: "Post Card", description: "Social media posts", prompt: "Show me our latest post on X" },
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
      initial={{ opacity: 0, y: 6, scale: 0.98, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: 6, scale: 0.98, filter: "blur(4px)" }}
      transition={spring.snappy}
      className="absolute bottom-full left-0 mb-2 w-full overflow-hidden rounded-xl border border-(--taw-border)/40 bg-(--taw-surface-raised) shadow-(--taw-shadow-md)"
    >
      {filtered.map((cmd, i) => (
        <motion.button
          key={cmd.command}
          type="button"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...spring.micro, delay: i * 0.03 }}
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
        </motion.button>
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
      const selected = filtered[selectedIndex]
      if (selected) handleSelect(selected.prompt)
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
          if (isSlash && filtered.length > 0 && filtered[selectedIndex]) {
            handleSelect(filtered[selectedIndex].prompt)
          } else {
            onSubmit()
          }
        }}
        className={cn(
          "flex flex-col gap-2 rounded-2xl bg-(--taw-surface-raised) px-4 pb-3 pt-3 shadow-(--taw-shadow-md)",
          "ring-1 ring-(--taw-border)/30 transition-shadow duration-200 focus-within:ring-2 focus-within:ring-(--taw-accent)/40 focus-within:shadow-(--taw-shadow-lg)",
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
          className="w-full bg-transparent py-1 text-[16px] sm:text-[14px] text-(--taw-text-primary) placeholder:text-(--taw-text-muted) outline-none! focus-visible:outline-none!"
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
          <motion.button
            type="submit"
            disabled={disabled || !value.trim()}
            whileHover={value.trim() && !disabled ? { scale: 1.1 } : {}}
            whileTap={value.trim() && !disabled ? { scale: 0.9 } : {}}
            transition={spring.micro}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-xl border transition-[background-color,border-color]",
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
          </motion.button>
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
  "Preview a link": (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M10 6H4V8H10V6Z" fill="currentColor" />
      <path d="M4 8H2V16H4V8Z" fill="currentColor" />
      <path d="M10 16H4V18H10V18Z" fill="currentColor" />
      <path d="M12 8H10V16H12V8Z" fill="currentColor" />
      <path d="M14 6H20V8H14V6Z" fill="currentColor" />
      <path d="M20 8H22V16H20V8Z" fill="currentColor" />
      <path d="M14 16H20V18H14V18Z" fill="currentColor" />
      <path d="M12 8H14V16H12V8Z" fill="currentColor" />
    </svg>
  ),
  "What do you remember?": (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M8 2H16V4H8V2Z" fill="currentColor" />
      <path d="M6 4H8V6H6V4Z" fill="currentColor" />
      <path d="M4 6H6V14H4V6Z" fill="currentColor" />
      <path d="M16 4H18V6H16V4Z" fill="currentColor" />
      <path d="M18 6H20V14H18V6Z" fill="currentColor" />
      <path d="M6 14H8V16H6V14Z" fill="currentColor" />
      <path d="M16 14H18V16H16V14Z" fill="currentColor" />
      <path d="M8 16H10V18H8V16Z" fill="currentColor" />
      <path d="M14 16H16V18H14V16Z" fill="currentColor" />
      <path d="M10 18H14V20H10V18Z" fill="currentColor" />
      <path d="M10 8H14V12H10V8Z" fill="currentColor" />
    </svg>
  ),
  "Show an issue": (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M8 2H16V4H8V2Z" fill="currentColor" />
      <path d="M6 4H8V6H6V4Z" fill="currentColor" />
      <path d="M4 6H6V18H4V6Z" fill="currentColor" />
      <path d="M16 4H18V6H16V4Z" fill="currentColor" />
      <path d="M18 6H20V18H18V6Z" fill="currentColor" />
      <path d="M6 18H8V20H6V18Z" fill="currentColor" />
      <path d="M16 18H18V20H16V18Z" fill="currentColor" />
      <path d="M8 20H16V22H8V20Z" fill="currentColor" />
      <path d="M11 8H13V14H11V8Z" fill="currentColor" />
      <path d="M11 16H13V18H11V16Z" fill="currentColor" />
    </svg>
  ),
  "Next meeting": (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M4 4H20V6H4V4Z" fill="currentColor" />
      <path d="M2 6H4V20H2V6Z" fill="currentColor" />
      <path d="M20 6H22V20H20V6Z" fill="currentColor" />
      <path d="M4 20H20V22H4V20Z" fill="currentColor" />
      <path d="M7 2H9V6H7V2Z" fill="currentColor" />
      <path d="M15 2H17V6H15V2Z" fill="currentColor" />
      <path d="M4 8H20V10H4V8Z" fill="currentColor" />
      <path d="M6 12H10V14H6V12Z" fill="currentColor" />
      <path d="M6 16H10V18H6V16Z" fill="currentColor" />
    </svg>
  ),
  "Latest post": (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M4 4H20V6H4V4Z" fill="currentColor" />
      <path d="M2 6H4V18H2V6Z" fill="currentColor" />
      <path d="M20 6H22V18H20V6Z" fill="currentColor" />
      <path d="M4 18H20V20H4V18Z" fill="currentColor" />
      <path d="M6 8H12V10H6V8Z" fill="currentColor" />
      <path d="M6 12H18V14H6V12Z" fill="currentColor" />
      <path d="M6 16H14V18H6V16Z" fill="currentColor" />
    </svg>
  ),
}

// ─── Scroll bridge ──────────────────────────────────────────────────────────

function ScrollBridge({ scrollRef }: { scrollRef: React.MutableRefObject<(() => void) | null> }) {
  const { scrollToBottom } = useStickToBottomContext()
  useEffect(() => {
    scrollRef.current = scrollToBottom
  }, [scrollToBottom, scrollRef])
  return null
}

// ─── Hero Logo (theme-aware metallic) ────────────────────────────────────────

function HeroLogo() {
  const dark = useSyncExternalStore(subscribeToDark, getIsDark, () => false)

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.7, filter: "blur(8px)" },
        show: {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          transition: spring.hero,
        },
      }}
      className="relative mb-6 h-24 w-24 sm:h-28 sm:w-28"
    >
      <MetallicPaint
        imageSrc="/taw-icon.svg"
        tintColor={dark ? "#AD8DFD" : "#7E4ED7"}
        lightColor={dark ? "#d4c4ff" : "#ffffff"}
        darkColor={dark ? "#3a1d8e" : "#5b2da8"}
        brightness={dark ? 1.8 : 2.2}
        contrast={dark ? 0.6 : 0.45}
        chromaticSpread={0.15}
        speed={0.08}
        scale={3}
        liquid={0.25}
        waveAmplitude={0.25}
        noiseScale={0.15}
      />
    </motion.div>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────────────

export function HeroPlayground() {
  const [inputValue, setInputValue] = useState("")
  const scrollToBottomRef = useRef<(() => void) | null>(null)

  const { messages, sendMessage, status } = useChat({ transport })

  const hasInteracted = messages.length > 0
  const isLoading = status === "streaming" || status === "submitted"

  const handleSubmit = () => {
    const text = inputValue.trim()
    if (!text || isLoading) return
    sendMessage({ text })
    setInputValue("")
    scrollToBottomRef.current?.()
  }

  const handleCommandSelect = useCallback(
    (prompt: string) => {
      if (isLoading) return
      sendMessage({ text: prompt })
      scrollToBottomRef.current?.()
    },
    [isLoading, sendMessage],
  )

  const handleChipClick = (prompt: string) => {
    if (isLoading) return
    sendMessage({ text: prompt })
    scrollToBottomRef.current?.()
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
              initial="hidden"
              animate="show"
              exit={{
                opacity: 0,
                scale: 0.97,
                filter: "blur(10px)",
                transition: spring.content,
              }}
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.2,
                    delayChildren: 0.1,
                  },
                },
              }}
              className="mb-8 flex flex-col items-center px-6 text-center sm:mb-10"
            >
              <HeroLogo />

              <motion.h1
                variants={{
                  hidden: { opacity: 0, scale: 1.06, filter: "blur(10px)" },
                  show: {
                    opacity: 1,
                    scale: 1,
                    filter: "blur(0px)",
                    transition: { type: "spring", duration: 0.7, bounce: 0 },
                  },
                }}
                className="max-w-xl origin-center text-[clamp(2.25rem,6vw,3.75rem)] leading-[1.06] font-bold tracking-tight text-(--taw-text-primary)"
              >
                Build the UI your AI{" "}
                <span
                  className="animate-color-shift font-pixel bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, var(--taw-accent), var(--taw-pink), var(--taw-accent), var(--taw-pink), var(--taw-accent))",
                  }}
                >
                  should have returned
                </span>
              </motion.h1>

              <motion.p
                variants={{
                  hidden: { opacity: 0, scale: 1.06, filter: "blur(8px)" },
                  show: {
                    opacity: 1,
                    scale: 1,
                    filter: "blur(0px)",
                    transition: { type: "spring", duration: 0.5, bounce: 0 },
                  },
                }}
                className="mt-4 max-w-xs origin-center text-[14px] leading-relaxed text-(--taw-text-secondary)"
              >
                Schema-first components that turn structured AI outputs into
                beautiful, actionable interfaces.
              </motion.p>

              <motion.a
                href="/docs/quick-start"
                variants={{
                  hidden: { opacity: 0, scale: 1.12, filter: "blur(8px)" },
                  show: {
                    opacity: 1,
                    scale: 1,
                    filter: "blur(0px)",
                    transition: { type: "spring", duration: 0.5, bounce: 0.1 },
                  },
                }}
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="group mt-6 inline-flex items-center gap-1.5 rounded-full bg-(--taw-accent) px-5 py-2 text-[13px] font-semibold text-white shadow-sm transition-[background-color,box-shadow] hover:bg-(--taw-accent-hover) hover:shadow-md"
              >
                Get Started
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-200 group-hover:translate-x-0.5">
                  <rect width="2" height="16" transform="matrix(4.37114e-08 1 1 -4.37114e-08 4 11)" fill="currentColor" />
                  <rect width="2" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 16 13)" fill="currentColor" />
                  <rect width="2" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 14 15)" fill="currentColor" />
                  <rect width="2" height="2" transform="matrix(4.37114e-08 1 1 -4.37114e-08 12 17)" fill="currentColor" />
                  <rect x="16" y="11" width="2" height="2" transform="rotate(-90 16 11)" fill="currentColor" />
                  <rect x="14" y="15" width="8" height="2" transform="rotate(-90 14 15)" fill="currentColor" />
                  <rect x="12" y="17" width="12" height="2" transform="rotate(-90 12 17)" fill="currentColor" />
                </svg>
              </motion.a>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Conversation — scrolls internally, fills available space */}
      {hasInteracted && (
        <Conversation className="w-full min-h-0 flex-1">
          <ConversationContent className="mx-auto max-w-[768px] gap-6 p-0 px-5 pb-4 pt-8 sm:px-8">
            {messages.map((message) => {
              if (message.role === "user") {
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 12, scale: 0.97, filter: "blur(3px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    transition={spring.snappy}
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
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={spring.content}
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
                                    toolCallId: `loading-${part.toolCallId}`,
                                    toolName,
                                    input: part.input ?? {},
                                    state: "input-streaming",
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
                            <motion.div
                              initial={{ opacity: 0, y: 8, scale: 0.98, filter: "blur(6px)" }}
                              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                              transition={{ ...spring.content, delay: 0.08 }}
                            >
                              <Component
                                part={{
                                  toolCallId: part.toolCallId,
                                  toolName,
                                  input: part.input ?? {},
                                  state: "output-available",
                                  output: part.output,
                                }}
                                animate
                              />
                            </motion.div>
                            {label && (
                              <span className="font-mono text-[10px] text-(--taw-text-muted)">
                                <span className="text-(--taw-accent)">
                                  {label.icon}
                                </span>{" "}
                                rendered with {label.component}
                              </span>
                            )}
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
                initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(4px)" }}
                transition={spring.micro}
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
          <ScrollBridge scrollRef={scrollToBottomRef} />
        </Conversation>
      )}

      {/* Composer */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ ...spring.content, delay: 0.9 }}
        className="w-full max-w-[768px] shrink-0 px-5 pb-6 sm:px-8"
      >
        {/* Quick-start chips — landing only, single row with edge fade */}
        {!hasInteracted && (
          <div className="relative mb-3">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-linear-to-r from-(--taw-surface-sunken) to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-(--taw-surface-sunken) to-transparent" />
            <div className="no-scrollbar flex gap-2 overflow-x-auto px-2">
              {promptChips.map((chip, i) => (
                <motion.button
                  key={chip.label}
                  initial={{ opacity: 0, filter: "blur(6px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ ...spring.content, delay: 1 + i * 0.04 }}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleChipClick(chip.prompt)}
                  disabled={isLoading}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-[12px] transition-[border-color,color]",
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
