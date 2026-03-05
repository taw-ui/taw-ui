"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@taw-ui/react"
import { components, categories } from "@/lib/registry"
import { TableOfContents } from "./table-of-contents"
import { SearchDialog } from "./search-dialog"
import { CopyPage } from "./copy-page"
import { PixelIcon } from "./pixel-icon"

const navSections = [
  {
    title: "Get Started",
    items: [
      { label: "Overview", href: "/docs/overview" },
      { label: "Quick Start", href: "/docs/quick-start" },
      { label: "Principles", href: "/docs/principles" },
      { label: "Concepts", href: "/docs/concepts" },
    ],
  },
  ...Object.entries(categories)
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([catId, cat]) => ({
      title: cat.label,
      items: components
        .filter((c) => c.category === catId)
        .map((c) => ({
          label: c.label,
          href: `/docs/components/${c.id}`,
          status: c.status,
        })),
    })),
]

function ThemeToggle({ dark, setDark }: { dark: boolean; setDark: (d: boolean) => void }) {
  return (
    <button
      onClick={() => setDark(!dark)}
      className="flex h-7 w-7 items-center justify-center rounded-lg text-[--taw-text-muted] transition-colors hover:text-[--taw-text-primary]"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? "sun" : "moon"}
          initial={{ scale: 0, rotate: -90, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex items-center justify-center"
        >
          <PixelIcon name={dark ? "sun" : "moon"} size={18} />
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

const searchItems = navSections.flatMap((section) =>
  section.items.map((item) => ({
    label: item.label,
    href: item.href,
    section: section.title,
  })),
)

/* ─── Sidebar Nav Content (shared between desktop and mobile) ─── */

function SidebarNav({
  pathname,
  onNavigate,
}: {
  pathname: string
  onNavigate?: () => void
}) {
  return (
    <nav className="flex flex-col gap-6">
      {navSections.map((section) => (
        <div key={section.title}>
          <span className="mb-1 block px-2 font-pixel text-[10px] uppercase tracking-[0.15em] text-[--taw-text-muted]">
            {section.title}
          </span>
          <ul className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href} className="relative">
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-lg bg-[--taw-accent-subtle]"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group relative flex items-center gap-2 rounded-lg px-2.5 py-[7px] text-[13px] transition-colors",
                      isActive
                        ? "font-medium text-[--taw-accent]"
                        : "text-[--taw-text-secondary] hover:bg-[--taw-surface-sunken] hover:text-[--taw-text-primary]",
                    )}
                  >
                    {item.label}
                    {"status" in item && item.status === "coming-soon" && (
                      <span className="ml-auto rounded-md bg-[--taw-border] px-1.5 py-0.5 font-pixel text-[8px] uppercase text-[--taw-text-muted]">
                        soon
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

/* ─── Layout ─── */

export function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const openSearch = useCallback(() => setSearchOpen(true), [])
  const closeSearch = useCallback(() => setSearchOpen(false), [])

  // Sync with system theme on mount
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    setDark(mq.matches)
    setMounted(true)
    const handler = (e: MediaQueryListEvent) => setDark(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  // Close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false)
  }, [pathname])

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    if (mobileNavOpen) {
      const prev = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [mobileNavOpen])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return

      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setSearchOpen(true)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className={cn("min-h-screen bg-[--taw-surface-sunken]", dark && "dark")} style={{ visibility: mounted ? "visible" : "hidden" }}>
      <div className="flex min-h-screen flex-col">
        {/* ─── Header (edge to edge) ─── */}
        <header className="sticky top-0 z-30 flex h-12 items-center justify-between border-b border-[--taw-border] bg-[--taw-surface]/80 px-4 backdrop-blur-md">
          {/* Left: Hamburger (mobile) + Logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileNavOpen((v) => !v)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[--taw-text-muted] transition-colors hover:text-[--taw-text-primary] lg:hidden"
              aria-label="Toggle navigation"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {mobileNavOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>

            <Link href="/docs/overview" className="group flex items-center gap-2.5">
              <motion.div
                whileHover={{ rotate: [0, -4, 4, -2, 0] }}
                transition={{ duration: 0.35 }}
              >
                <img
                  src="/taw-logo-light.svg"
                  alt="taw-ui"
                  className="block h-6 dark:hidden"
                />
                <img
                  src="/taw-logo-dark.svg"
                  alt="taw-ui"
                  className="hidden h-6 dark:block"
                />
              </motion.div>
              <span className="hidden rounded-md border border-[--taw-border] px-1.5 py-0.5 font-mono text-[10px] text-[--taw-text-muted] sm:inline">
                v0.0.1
              </span>
            </Link>
          </div>

          {/* Center: Breadcrumbs (hidden on mobile) */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
            <Breadcrumbs pathname={pathname} />
          </div>

          {/* Right: Search + GitHub + Theme */}
          <div className="flex items-center gap-2">
            <button
              onClick={openSearch}
              className="flex h-7 items-center gap-2 rounded-lg border border-[--taw-border] bg-[--taw-surface] px-2 text-[12px] text-[--taw-text-muted] shadow-[--taw-shadow-sm] transition-all hover:border-[--taw-accent]/30 hover:text-[--taw-text-primary] sm:px-3"
            >
              <PixelIcon name="search" size={12} />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="ml-1 hidden rounded border border-[--taw-border] bg-[--taw-surface-sunken] px-1 py-0.5 font-mono text-[10px] text-[--taw-text-muted] sm:inline">
                /
              </kbd>
            </button>
            <a
              href="https://github.com/taw-ui/taw-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[--taw-text-muted] transition-colors hover:text-[--taw-text-primary]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <ThemeToggle dark={dark} setDark={setDark} />
          </div>
        </header>

        {/* ─── Body: sidebar + content ─── */}
        <div className="flex flex-1">
          {/* Desktop sidebar */}
          <aside className="sticky top-12 z-20 hidden h-[calc(100vh-3rem)] w-60 shrink-0 flex-col border-r border-[--taw-border] bg-[--taw-surface] lg:flex">
            <div className="flex-1 overflow-y-auto px-3 pt-4 pb-4">
              <SidebarNav pathname={pathname} />
            </div>
          </aside>

          {/* Mobile sidebar overlay */}
          <AnimatePresence>
            {mobileNavOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="fixed inset-0 top-12 z-40 bg-[oklch(0_0_0/0.4)] backdrop-blur-sm lg:hidden"
                  onClick={() => setMobileNavOpen(false)}
                />
                <motion.aside
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  className="fixed left-0 top-12 z-50 h-[calc(100vh-3rem)] w-64 overflow-y-auto border-r border-[--taw-border] bg-[--taw-surface] px-3 pt-4 pb-4 lg:hidden"
                >
                  <SidebarNav
                    pathname={pathname}
                    onNavigate={() => setMobileNavOpen(false)}
                  />
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* Main area */}
          <div className="flex flex-1">
            {/* Content */}
            <main className="flex-1 overflow-x-hidden">
              <motion.div
                key={pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                id="docs-content"
                className="mx-auto max-w-3xl overflow-x-hidden px-5 py-8 sm:px-8 sm:py-10"
              >
                {children}
              </motion.div>
            </main>

            {/* Right TOC */}
            <aside className="sticky top-12 hidden h-[calc(100vh-3rem)] w-56 shrink-0 overflow-y-auto px-5 pt-8 xl:block">
              <TableOfContents />
            </aside>
          </div>
        </div>

        <SearchDialog items={searchItems} open={searchOpen} onClose={closeSearch} />
      </div>
    </div>
  )
}

/* ─── Breadcrumbs ─── */

function Breadcrumbs({ pathname }: { pathname: string }) {
  const parts = pathname.split("/").filter(Boolean)

  const labels: Record<string, string> = {
    docs: "Docs",
    overview: "Overview",
    "quick-start": "Quick Start",
    principles: "Principles",
    concepts: "Concepts",
    components: "Components",
    "kpi-card": "KpiCard",
    "data-table": "DataTable",
    "option-list": "OptionList",
    "link-card": "LinkCard",
    chart: "Chart",
  }

  return (
    <nav className="flex items-center gap-1 text-[12px]">
      {parts.map((part, i) => {
        const isLast = i === parts.length - 1
        return (
          <span key={`${part}-${i}`} className="flex items-center gap-1">
            {i > 0 && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[--taw-border]">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            )}
            <span className={isLast ? "font-medium text-[--taw-text-primary]" : "text-[--taw-text-muted]"}>
              {labels[part] ?? part}
            </span>
          </span>
        )
      })}
    </nav>
  )
}
