"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@taw-ui/react"

interface TocItem {
  id: string
  text: string
  level: number
}

function ListIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="15" y2="12" />
      <line x1="3" y1="18" x2="18" y2="18" />
    </svg>
  )
}

function ArrowUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="16 12 12 8 8 12" />
      <line x1="12" y1="16" x2="12" y2="8" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  )
}

function scanHeadings(): TocItem[] {
  const content = document.getElementById("docs-content")
  if (!content) return []

  const headings = content.querySelectorAll("h2, h3")
  const tocItems: TocItem[] = []

  headings.forEach((heading) => {
    if (!heading.id) {
      heading.id =
        heading.textContent
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") ?? ""
    }
    if (heading.id) {
      tocItems.push({
        id: heading.id,
        text: heading.textContent ?? "",
        level: heading.tagName === "H3" ? 3 : 2,
      })
    }
  })

  return tocItems
}

export function TableOfContents() {
  const pathname = usePathname()
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Scan headings when pathname changes. Use a small delay so the new
  // page content has time to mount, then fall back to a MutationObserver
  // in case the content renders later (e.g. suspended/lazy components).
  useEffect(() => {
    // Reset on navigation
    setItems([])
    setActiveId("")

    // Try immediately (SSR content is already in the DOM)
    const immediate = scanHeadings()
    if (immediate.length > 0) {
      setItems(immediate)
      setActiveId(immediate[0]!.id)
      return
    }

    // Content not yet in DOM — wait a tick for React to paint
    let cancelled = false
    const timer = setTimeout(() => {
      if (cancelled) return
      const found = scanHeadings()
      if (found.length > 0) {
        setItems(found)
        setActiveId(found[0]!.id)
        return
      }

      // Still nothing — watch for DOM mutations (covers lazy/suspended content)
      const target = document.getElementById("docs-content")
      if (!target) return

      const mo = new MutationObserver(() => {
        const headings = scanHeadings()
        if (headings.length > 0) {
          setItems(headings)
          setActiveId(headings[0]!.id)
          mo.disconnect()
        }
      })
      mo.observe(target, { childList: true, subtree: true })

      // Cleanup MutationObserver if component unmounts
      const cleanup = () => mo.disconnect()
      window.addEventListener("beforeunload", cleanup)
      return () => {
        mo.disconnect()
        window.removeEventListener("beforeunload", cleanup)
      }
    }, 50)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [pathname])

  // IntersectionObserver for active heading tracking
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const visibleEntries = entries.filter((e) => e.isIntersecting)
      if (visibleEntries.length > 0) {
        const sorted = visibleEntries.sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
        )
        setActiveId(sorted[0]!.target.id)
      }
    },
    [],
  )

  useEffect(() => {
    if (items.length === 0) return

    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin: "-80px 0px -70% 0px",
      threshold: 0,
    })

    items.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el) observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [items, handleIntersection])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const copyPageUrl = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  if (items.length === 0) return null

  return (
    <div className="flex h-full flex-col">
      {/* TOC */}
      <nav className="flex-1">
        <span className="mb-3 flex items-center gap-1.5 text-[11px] font-medium text-[--taw-text-muted]">
          <ListIcon />
          On this page
        </span>

        {/* Tree structure */}
        <div className="relative">
          {/* Vertical tree line */}
          <div className="absolute left-[5px] top-0 bottom-0 w-px bg-[--taw-border]" />

          <ul className="relative flex flex-col">
            {items.map((item) => {
              const isActive = activeId === item.id
              const isNested = item.level === 3

              return (
                <li key={item.id} className="relative">
                  {/* Active indicator — covers the tree line segment */}
                  {isActive && (
                    <div className="absolute left-[4px] top-0 h-full w-[3px] rounded-full bg-[--taw-text-primary]" />
                  )}

                  {/* Branch line for nested items */}
                  {isNested && (
                    <svg
                      className="absolute left-[5px] top-[12px] text-[--taw-border]"
                      width="10"
                      height="1"
                      viewBox="0 0 10 1"
                      fill="none"
                    >
                      <line x1="0" y1="0.5" x2="10" y2="0.5" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  )}

                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      const el = document.getElementById(item.id)
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "start" })
                        setActiveId(item.id)
                      }
                    }}
                    className={cn(
                      "block py-[5px] text-[12px] leading-snug transition-colors",
                      isNested ? "pl-6" : "pl-4",
                      isActive
                        ? "font-medium text-[--taw-text-primary]"
                        : "text-[--taw-text-muted] hover:text-[--taw-text-primary]",
                    )}
                  >
                    {item.text}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

      {/* Footer actions */}
      <div className="mt-6 border-t border-[--taw-border] pt-4">
        <ul className="flex flex-col gap-0.5">
          <li>
            <button
              onClick={scrollToTop}
              className="flex w-full items-center gap-2 rounded-lg px-1 py-1.5 text-[12px] text-[--taw-text-muted] transition-colors hover:text-[--taw-text-primary]"
            >
              <ArrowUpIcon />
              Scroll to top
            </button>
          </li>
          <li>
            <button
              onClick={copyPageUrl}
              className="flex w-full items-center gap-2 rounded-lg px-1 py-1.5 text-[12px] text-[--taw-text-muted] transition-colors hover:text-[--taw-text-primary]"
            >
              <CopyIcon />
              Copy page link
            </button>
          </li>
          <li>
            <a
              href="https://github.com/thiagomota/taw-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg px-1 py-1.5 text-[12px] text-[--taw-text-muted] transition-colors hover:text-[--taw-text-primary]"
            >
              <GitHubIcon />
              Edit on GitHub
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
