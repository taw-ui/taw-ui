"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useCallback, useSyncExternalStore } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Drawer } from "vaul"
import { cn } from "@/lib/cn"
import { components, categories } from "@/lib/registry"
import { version } from "@/lib/version"
import { TableOfContents } from "./table-of-contents"
import { SearchDialog } from "./search-dialog"
import { PixelIcon } from "./pixel-icon"

const navSections = [
  {
    title: "Get Started",
    items: [
      { label: "Overview", href: "/docs/overview" },
      { label: "Quick Start", href: "/docs/quick-start" },
      { label: "Concepts", href: "/docs/concepts" },
      { label: "Principles", href: "/docs/principles" },
      { label: "Theming", href: "/docs/theming" },
      { label: "Domain Surfaces", href: "/docs/domain-surfaces" },
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

// ─── Theme: direct DOM, no React state ───────────────────────────────────────
// The blocking <script> in layout.tsx sets .dark before paint.
// We toggle it directly on <html> so every CSS variable updates in one repaint.
// useSyncExternalStore keeps the icon in sync without causing the toggle itself.

function subscribeToDark(cb: () => void) {
  const observer = new MutationObserver(cb)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
  return () => observer.disconnect()
}

function getIsDark() {
  return document.documentElement.classList.contains("dark")
}

function getServerDark() {
  return false
}

function toggleTheme() {
  const next = !document.documentElement.classList.contains("dark")
  document.documentElement.classList.toggle("dark", next)
  localStorage.setItem("taw-theme", next ? "dark" : "light")
  // Enable transitions after first user toggle (not on initial load)
  document.documentElement.classList.add("theme-ready")
}

function ThemeToggle() {
  const dark = useSyncExternalStore(subscribeToDark, getIsDark, getServerDark)

  return (
    <button
      onClick={toggleTheme}
      className="flex h-7 w-7 items-center justify-center rounded-full border border-(--taw-border) bg-(--taw-surface-raised) text-(--taw-text-muted) transition-colors hover:text-(--taw-text-primary)"
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
          {dark ? (
            <PixelIcon name="sun" size={18} />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
              <path d="M18 22H8V20H18V22ZM8 20H6V18H8V20ZM20 20H18V18H20V20ZM6 18H4V16H6V18ZM22 18H20V14H18V12H20V10H22V18ZM4 16H2V6H4V16ZM18 16H12V14H18V16ZM12 14H10V12H12V14ZM10 12H8V6H10V12ZM6 6H4V4H6V6ZM14 4H12V6H10V4H6V2H14V4Z" fill="currentColor" />
            </svg>
          )}
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
          <span className="mb-1 block px-2 font-pixel text-[10px] uppercase tracking-[0.15em] text-(--taw-text-muted)">
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
                      className="absolute inset-0 rounded-lg bg-(--taw-accent-subtle)"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group relative flex items-center gap-2 rounded-lg px-2.5 py-[7px] text-[13px] transition-colors",
                      isActive
                        ? "font-medium text-(--taw-accent)"
                        : "text-(--taw-text-secondary) hover:bg-(--taw-surface-sunken) hover:text-(--taw-text-primary)",
                    )}
                  >
                    {item.label}
                    {"status" in item && item.status === "coming-soon" && (
                      <span className="ml-auto rounded-md bg-(--taw-cyan)/12 px-1.5 py-0.5 font-pixel text-[8px] uppercase text-(--taw-cyan)">
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
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const openSearch = useCallback(() => setSearchOpen(true), [])
  const closeSearch = useCallback(() => setSearchOpen(false), [])

  // Listen for system theme changes — only if user hasn't set a preference
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("taw-theme")) {
        document.documentElement.classList.toggle("dark", e.matches)
      }
    }
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
    <div className="min-h-screen bg-(--taw-surface-sunken)">
      <div className="flex min-h-screen flex-col">
        {/* ─── Header (edge to edge) ─── */}
        <header className="sticky top-0 z-30 grid h-12 grid-cols-3 items-center border-b border-(--taw-border) bg-(--taw-surface)/80 px-4 backdrop-blur-md lg:flex lg:justify-between">
          {/* Mobile: Left — GitHub | Desktop: Left — Logo */}
          <div className="flex items-center justify-start">
            <a
              href="https://github.com/taw-ui/taw-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-(--taw-border) bg-(--taw-surface-raised) text-(--taw-text-muted) transition-colors hover:text-(--taw-text-primary) lg:hidden"
              aria-label="GitHub"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <path d="M5 2H9V4H7V6H5V2Z" fill="currentColor" />
                <path d="M5 12H3V6H5V12Z" fill="currentColor" />
                <path d="M7 14H5V12H7V14Z" fill="currentColor" />
                <path fillRule="evenodd" clipRule="evenodd" d="M9 16V14H7V16H3V14H1V16H3V18H7V22H9V18H11V16H9ZM9 16V18H7V16H9Z" fill="currentColor" />
                <path d="M15 4V6H9V4H15Z" fill="currentColor" />
                <path d="M19 6H17V4H15V2H19V6Z" fill="currentColor" />
                <path d="M19 12V6H21V12H19Z" fill="currentColor" />
                <path d="M17 14V12H19V14H17Z" fill="currentColor" />
                <path d="M15 16V14H17V16H15Z" fill="currentColor" />
                <path d="M15 18H13V16H15V18Z" fill="currentColor" />
                <path d="M15 18H17V22H15V18Z" fill="currentColor" />
              </svg>
            </a>
            <Link href="/docs/overview" className="group hidden items-center gap-2.5 lg:flex">
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
              <span className="rounded-md border border-(--taw-border) px-1.5 py-0.5 font-mono text-[10px] text-(--taw-text-muted)">
                v{version}
              </span>
            </Link>
          </div>

          {/* Mobile: Center — Logo | Desktop: Center — Breadcrumbs */}
          <div className="flex justify-center lg:absolute lg:left-1/2 lg:-translate-x-1/2">
            <Link href="/docs/overview" className="group flex items-center gap-2.5 lg:hidden">
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
            </Link>
            <div className="hidden md:block">
              <Breadcrumbs pathname={pathname} />
            </div>
          </div>

          {/* Mobile: Right — Theme | Desktop: Right — Search + GitHub + Theme */}
          <div className="flex items-center justify-end gap-2">
            <div className="lg:hidden">
              <ThemeToggle />
            </div>
            <div className="hidden lg:flex lg:items-center lg:gap-2">
              <button
                onClick={openSearch}
                className="flex h-7 items-center gap-2 rounded-lg border border-(--taw-border) bg-(--taw-surface) px-3 text-[12px] text-(--taw-text-muted) shadow-(--taw-shadow-sm) transition-all hover:border-(--taw-accent)/30 hover:text-(--taw-text-primary)"
              >
                <PixelIcon name="search" size={12} />
                <span className="hidden sm:inline">Search...</span>
                <kbd className="ml-1 rounded border border-(--taw-border) bg-(--taw-surface-sunken) px-1 py-0.5 font-mono text-[10px] text-(--taw-text-muted)">
                  /
                </kbd>
              </button>
              <a
                href="https://github.com/taw-ui/taw-ui"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-(--taw-border) bg-(--taw-surface-raised) text-(--taw-text-muted) transition-colors hover:text-(--taw-text-primary)"
                aria-label="GitHub"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                  <path d="M5 2H9V4H7V6H5V2Z" fill="currentColor" />
                  <path d="M5 12H3V6H5V12Z" fill="currentColor" />
                  <path d="M7 14H5V12H7V14Z" fill="currentColor" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M9 16V14H7V16H3V14H1V16H3V18H7V22H9V18H11V16H9ZM9 16V18H7V16H9Z" fill="currentColor" />
                  <path d="M15 4V6H9V4H15Z" fill="currentColor" />
                  <path d="M19 6H17V4H15V2H19V6Z" fill="currentColor" />
                  <path d="M19 12V6H21V12H19Z" fill="currentColor" />
                  <path d="M17 14V12H19V14H17Z" fill="currentColor" />
                  <path d="M15 16V14H17V16H15Z" fill="currentColor" />
                  <path d="M15 18H13V16H15V18Z" fill="currentColor" />
                  <path d="M15 18H17V22H15V18Z" fill="currentColor" />
                </svg>
              </a>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* ─── Body: sidebar + content ─── */}
        <div className="flex min-w-0 flex-1">
          {/* Desktop sidebar */}
          <aside className="sticky top-12 z-20 hidden h-[calc(100vh-3rem)] w-60 shrink-0 flex-col border-r border-(--taw-border) bg-(--taw-surface) lg:flex">
            <div className="flex-1 overflow-y-auto px-3 pt-4 pb-4">
              <SidebarNav pathname={pathname} />
            </div>
          </aside>

          {/* Mobile nav drawer (Vaul) — only rendered on mobile */}
          <div className="lg:hidden">
            <Drawer.Root
              open={mobileNavOpen}
              onOpenChange={setMobileNavOpen}
              direction="bottom"
            >
              <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 z-40 bg-[oklch(0_0_0/0.4)] backdrop-blur-sm" />
                <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 flex max-h-[85vh] flex-col rounded-t-2xl border-t border-(--taw-border) bg-(--taw-surface) outline-none">
                  <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-(--taw-border)" />
                  <div className="flex-1 overflow-y-auto px-4 pb-8 pt-2">
                    <SidebarNav
                      pathname={pathname}
                      onNavigate={() => setMobileNavOpen(false)}
                    />
                  </div>
                </Drawer.Content>
              </Drawer.Portal>
            </Drawer.Root>
          </div>

          {/* Main area */}
          <div className="flex min-w-0 flex-1">
            {/* Content */}
            <main className="min-w-0 flex-1 overflow-x-hidden">
              <motion.div
                key={pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                id="docs-content"
                className="mx-auto w-full max-w-3xl overflow-x-hidden px-4 py-8 pb-24 sm:px-8 sm:py-10 sm:pb-10"
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

        {/* ─── Mobile bottom nav (floating capsule) + fade ─── */}
        <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden">
          {/* Linear fade so content fades as it approaches the nav */}
          <div
            className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-(--taw-surface-sunken) to-transparent pointer-events-none"
            aria-hidden
          />
          <div className="relative flex justify-center pb-3 pt-4">
            <div className="flex items-center rounded-full border border-(--taw-accent) bg-(--taw-accent) px-1 py-1.5 shadow-(--taw-shadow-md)">
            <button
              onClick={openSearch}
              className="flex flex-1 items-center gap-2 rounded-full px-4 py-2 text-[13px] text-white transition-colors hover:bg-white/20"
            >
              <PixelIcon name="search" size={14} />
              <span className="font-pixel">Find...</span>
            </button>
            <div className="h-6 w-px bg-white/30" />
            <button
              onClick={() => setMobileNavOpen(true)}
              className="flex items-center justify-center rounded-full px-4 py-2 text-white transition-colors hover:bg-white/20"
              aria-label="Open menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <path d="M22 5H10V7H22V5Z" fill="currentColor" />
                <path d="M18 9H10V11H18V9Z" fill="currentColor" />
                <path d="M22 13H10V15H22V13Z" fill="currentColor" />
                <path d="M18 17H10V19H18V17Z" fill="currentColor" />
                <path d="M4 7V9H6V7H4ZM8 11H2V5H8V11Z" fill="currentColor" />
                <path d="M8 13H2V15H8V13Z" fill="currentColor" />
                <path d="M8 17H2V19H8V17Z" fill="currentColor" />
                <path d="M2 15V17H4V15H2Z" fill="currentColor" />
                <path d="M6 15V17H8V15H6Z" fill="currentColor" />
              </svg>
            </button>
            </div>
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
    theming: "Theming",
    components: "Components",
    "kpi-card": "KpiCard",
    "data-table": "DataTable",
    "option-list": "OptionList",
    "link-card": "LinkCard",
    "memory-card": "MemoryCard",
    "insight-card": "InsightCard",
    "alert-card": "AlertCard",
    "issue-card": "IssueCard",
    "domain-surfaces": "Domain Surfaces",
    chart: "Chart",
  }

  return (
    <nav className="flex items-center gap-1 text-[12px]">
      {parts.map((part, i) => {
        const isLast = i === parts.length - 1
        return (
          <span key={`${part}-${i}`} className="flex items-center gap-1">
            {i > 0 && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-(--taw-border)">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            )}
            <span className={isLast ? "font-medium text-(--taw-text-primary)" : "text-(--taw-text-muted)"}>
              {labels[part] ?? part}
            </span>
          </span>
        )
      })}
    </nav>
  )
}
