"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@taw-ui/react"

// ─── Types ─────────────────────────────────────────────────────────────────────

interface TocItem {
  id: string
  text: string
  level: number
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const X_ROOT = 0.5     // center of 1px line for h2
const X_NESTED = 10.5  // center of 1px line for h3
const PAD_ROOT = 14    // text padding for h2
const PAD_NESTED = 26  // text padding for h3
const SVG_WIDTH = 12

// ─── Heading scanner ───────────────────────────────────────────────────────────

function scanHeadings(): TocItem[] {
  const content = document.getElementById("docs-content")
  if (!content) return []

  const headings = content.querySelectorAll("h2, h3")
  const tocItems: TocItem[] = []
  const usedIds = new Set<string>()

  headings.forEach((heading) => {
    if (!heading.id) {
      heading.id =
        heading.textContent
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") ?? ""
    }
    // Deduplicate IDs
    if (heading.id && usedIds.has(heading.id)) {
      let n = 2
      while (usedIds.has(`${heading.id}-${n}`)) n++
      heading.id = `${heading.id}-${n}`
    }
    if (heading.id) {
      usedIds.add(heading.id)
      tocItems.push({
        id: heading.id,
        text: heading.textContent ?? "",
        level: heading.tagName === "H3" ? 3 : 2,
      })
    }
  })

  return tocItems
}

// ─── Build the SVG path from measured DOM positions ────────────────────────────
// Uses cubic bezier curves (C) for smooth transitions between indent levels.

interface TreeGeometry {
  path: string
  totalHeight: number
  itemPositions: Array<{ top: number; height: number; centerY: number }>
}

function buildTreeGeometry(
  items: TocItem[],
  container: HTMLElement,
): TreeGeometry | null {
  const links = Array.from(
    container.querySelectorAll<HTMLElement>("[data-toc-id]"),
  )
  if (links.length !== items.length || links.length === 0) return null

  const containerRect = container.getBoundingClientRect()

  const itemPositions = links.map((el) => {
    const rect = el.getBoundingClientRect()
    const top = rect.top - containerRect.top
    return {
      top,
      height: rect.height,
      centerY: top + rect.height / 2,
    }
  })

  // Build SVG path
  const segments: string[] = []

  for (let i = 0; i < items.length; i++) {
    const x = items[i]!.level === 3 ? X_NESTED : X_ROOT
    const y = itemPositions[i]!.centerY

    if (i === 0) {
      segments.push(`M${x} ${y}`)
      continue
    }

    const prevX = items[i - 1]!.level === 3 ? X_NESTED : X_ROOT

    if (x !== prevX) {
      // Smooth cubic bezier curve between indent levels
      const prevY = itemPositions[i - 1]!.centerY
      const midY = (prevY + y) / 2
      segments.push(`C${prevX} ${midY}, ${x} ${midY}, ${x} ${y}`)
    } else {
      segments.push(`L${x} ${y}`)
    }
  }

  return {
    path: segments.join(" "),
    totalHeight: container.scrollHeight,
    itemPositions,
  }
}

// ─── Encode SVG path as a data URL for CSS mask ────────────────────────────────

function pathToMaskUrl(path: string, height: number, strokeWidth: number): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SVG_WIDTH} ${height}"><path d="${path}" stroke="black" stroke-width="${strokeWidth}" fill="none" stroke-linecap="round"/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function TableOfContents() {
  const pathname = usePathname()
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [copied, setCopied] = useState(false)
  const linksRef = useRef<HTMLDivElement>(null)
  const [geometry, setGeometry] = useState<TreeGeometry | null>(null)

  // ─── Scan headings on navigation ──────────────────────────────────────────

  useEffect(() => {
    setItems([])
    setActiveId("")
    setGeometry(null)

    const immediate = scanHeadings()
    if (immediate.length > 0) {
      setItems(immediate)
      setActiveId(immediate[0]!.id)
      return
    }

    let cancelled = false
    const timer = setTimeout(() => {
      if (cancelled) return
      const found = scanHeadings()
      if (found.length > 0) {
        setItems(found)
        setActiveId(found[0]!.id)
        return
      }

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
      return () => mo.disconnect()
    }, 50)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [pathname])

  // ─── Build tree geometry after links render ───────────────────────────────

  useEffect(() => {
    if (!linksRef.current || items.length === 0) return

    // Wait one frame for layout to settle
    const raf = requestAnimationFrame(() => {
      const geo = buildTreeGeometry(items, linksRef.current!)
      setGeometry(geo)
    })

    return () => cancelAnimationFrame(raf)
  }, [items])

  // ─── IntersectionObserver ─────────────────────────────────────────────────

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const visible = entries.filter((e) => e.isIntersecting)
      if (visible.length > 0) {
        const sorted = visible.sort(
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

  // ─── Active indicator position ────────────────────────────────────────────
  // The indicator is a full-width colored div inside a masked container.
  // The mask clips it to the tree path shape, so it follows curves naturally.

  const activeIndex = items.findIndex((item) => item.id === activeId)
  const activePos = geometry?.itemPositions[activeIndex]

  const indicatorTop = activePos
    ? activePos.centerY - 10
    : 0
  const indicatorHeight = 20

  // ─── CSS mask from tree path ──────────────────────────────────────────────

  const maskUrl = geometry
    ? pathToMaskUrl(geometry.path, geometry.totalHeight, 2)
    : undefined

  // ─── Actions ──────────────────────────────────────────────────────────────

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  const copyPageUrl = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (items.length === 0) return null

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <h3 className="mb-4 flex items-center gap-1.5 text-[12px] font-medium text-[--taw-text-muted]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
          <path d="M15 18H3" />
          <path d="M17 6H3" />
          <path d="M21 12H3" />
        </svg>
        On this page
      </h3>

      {/* Scrollable tree */}
      <div
        className="relative min-h-0 flex-1 overflow-y-auto text-[12px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        style={{
          maskImage: "linear-gradient(to bottom, transparent, white 16px, white calc(100% - 16px), transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, white 16px, white calc(100% - 16px), transparent)",
        }}
      >
        <div ref={linksRef} className="relative py-1">
          {geometry && (
            <>
              {/* Tree line (muted) */}
              <svg
                width={SVG_WIDTH}
                height={geometry.totalHeight}
                viewBox={`0 0 ${SVG_WIDTH} ${geometry.totalHeight}`}
                className="pointer-events-none absolute left-0 top-0"
                fill="none"
              >
                <path
                  d={geometry.path}
                  stroke="var(--taw-border-subtle)"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
              </svg>

              {/* Active indicator — masked to the tree path shape */}
              {activePos && maskUrl && (
                <div
                  className="pointer-events-none absolute left-0 top-0"
                  style={{
                    width: SVG_WIDTH,
                    height: geometry.totalHeight,
                    maskImage: maskUrl,
                    WebkitMaskImage: maskUrl,
                    maskSize: `${SVG_WIDTH}px ${geometry.totalHeight}px`,
                    WebkitMaskSize: `${SVG_WIDTH}px ${geometry.totalHeight}px`,
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                  }}
                >
                  <div
                    className="w-full bg-[--taw-accent] transition-all duration-200 ease-out"
                    style={{
                      marginTop: indicatorTop,
                      height: indicatorHeight,
                    }}
                  />
                </div>
              )}
            </>
          )}

          {/* Links */}
          {items.map((item) => {
            const isActive = activeId === item.id
            const isNested = item.level === 3

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                data-toc-id={item.id}
                data-active={isActive}
                onClick={(e) => {
                  e.preventDefault()
                  const el = document.getElementById(item.id)
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "start" })
                    setActiveId(item.id)
                  }
                }}
                className={cn(
                  "relative block py-1.5 leading-snug transition-colors duration-150",
                  "text-[--taw-text-muted] hover:text-[--taw-text-primary]",
                  "data-[active=true]:text-[--taw-accent]",
                )}
                style={{ paddingInlineStart: isNested ? PAD_NESTED : PAD_ROOT }}
              >
                {item.text}
              </a>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 flex flex-col gap-2 border-t border-[--taw-border] pt-3 pb-6">
        <a
          href={`https://github.com/thiagomota/taw-ui/edit/main/apps/www/src/app${pathname}/page.tsx`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[12px] text-[--taw-text-muted] transition-colors hover:text-[--taw-text-primary]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 opacity-70">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          Edit on GitHub
        </a>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 text-[12px] text-[--taw-text-muted] transition-colors hover:text-[--taw-text-primary]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-70">
            <circle cx="12" cy="12" r="10" />
            <path d="m16 12-4-4-4 4" />
            <path d="M12 16V8" />
          </svg>
          Scroll to top
        </button>

        <button
          onClick={copyPageUrl}
          className="flex items-center gap-1.5 text-[12px] text-[--taw-text-muted] transition-colors hover:text-[--taw-text-primary]"
        >
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--taw-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span style={{ color: "var(--taw-success)" }}>Copied!</span>
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-70">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
              Copy page link
            </>
          )}
        </button>
      </div>
    </div>
  )
}
