"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@taw-ui/react"
import { PixelIcon } from "./pixel-icon"

interface SearchItem {
  label: string
  href: string
  section: string
}

interface SearchDialogProps {
  items: SearchItem[]
  open: boolean
  onClose: () => void
}

export function SearchDialog({ items, open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const filtered = query.trim()
    ? items.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.section.toLowerCase().includes(query.toLowerCase()),
      )
    : items

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [open])

  // Reset on open
  useEffect(() => {
    if (open) {
      setQuery("")
      setActiveIndex(0)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])

  // Reset active index when query changes
  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  // Scroll active item into view
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const active = list.children[activeIndex] as HTMLElement | undefined
    active?.scrollIntoView({ block: "nearest" })
  }, [activeIndex])

  function navigate(href: string) {
    onClose()
    router.push(href)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      const item = filtered[activeIndex]
      if (item) navigate(item.href)
    } else if (e.key === "Escape") {
      e.preventDefault()
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-[oklch(0_0_0/0.4)] backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ type: "spring", stiffness: 500, damping: 32 }}
            className="relative w-full max-w-lg overflow-hidden rounded-(--taw-radius-lg) border border-(--taw-border) bg-(--taw-surface) shadow-(--taw-shadow-md)"
          >
            {/* Input */}
            <div className="flex items-center gap-2 border-b border-(--taw-border) px-4 py-3">
              <PixelIcon name="search" size={16} className="shrink-0 text-(--taw-text-muted)" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search docs..."
                className="flex-1 bg-transparent text-[14px] text-(--taw-text-primary) outline-none placeholder:text-(--taw-text-muted)"
              />
              <kbd className="rounded border border-(--taw-border) bg-(--taw-surface-sunken) px-1.5 py-0.5 font-mono text-[10px] text-(--taw-text-muted)">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[300px] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="px-3 py-6 text-center text-[13px] text-(--taw-text-muted)">
                  No results found.
                </div>
              ) : (
                filtered.map((item, i) => (
                  <button
                    key={item.href}
                    onClick={() => navigate(item.href)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={cn(
                      "relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                      i === activeIndex
                        ? "text-(--taw-accent)"
                        : "text-(--taw-text-secondary) hover:bg-(--taw-surface-sunken)",
                    )}
                  >
                    {i === activeIndex && (
                      <motion.div
                        layoutId="search-active"
                        className="absolute inset-0 rounded-lg bg-(--taw-accent-subtle)"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                    <PixelIcon name="schema" size={14} className="relative shrink-0 opacity-50" />
                    <div className="relative flex flex-col">
                      <span className="text-[13px] font-medium">{item.label}</span>
                      <span className="text-[11px] opacity-60">{item.section}</span>
                    </div>
                    {i === activeIndex && (
                      <kbd className="relative ml-auto rounded border border-(--taw-border) bg-(--taw-surface-sunken) px-1.5 py-0.5 font-mono text-[10px] text-(--taw-text-muted)">
                        Enter
                      </kbd>
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
