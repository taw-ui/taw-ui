"use client"

import Link from "next/link"
import { useEffect, useSyncExternalStore } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PixelIcon } from "@/components/pixel-icon"
import { version } from "@/lib/version"
import { HeroPlayground } from "@/components/hero/hero-playground"

// ─── Theme (same approach as docs-layout) ────────────────────────────────────

function subscribeToDark(cb: () => void) {
  const observer = new MutationObserver(cb)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  })
  return () => observer.disconnect()
}

function getIsDark() {
  return document.documentElement.classList.contains("dark")
}

function toggleTheme() {
  const next = !document.documentElement.classList.contains("dark")
  document.documentElement.classList.toggle("dark", next)
  localStorage.setItem("taw-theme", next ? "dark" : "light")
  document.documentElement.classList.add("theme-ready")
}

function ThemeToggle() {
  const dark = useSyncExternalStore(subscribeToDark, getIsDark, () => false)

  return (
    <button
      onClick={toggleTheme}
      className="flex h-7 w-7 items-center justify-center rounded-lg text-(--taw-text-muted) transition-colors hover:text-(--taw-text-primary)"
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

// ─── Header ──────────────────────────────────────────────────────────────────

function HomeHeader() {
  return (
    <header className="z-30 flex h-14 shrink-0 items-center justify-between border-b border-(--taw-border)/50 bg-(--taw-surface-sunken)/80 px-6 backdrop-blur-xl sm:px-8">
      <div className="flex items-center gap-3">
        <Link href="/" className="group flex items-center gap-2.5">
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
          <span className="hidden rounded-md border border-(--taw-border) px-1.5 py-0.5 font-mono text-[10px] text-(--taw-text-muted) sm:inline">
            v{version}
          </span>
        </Link>
      </div>

      <nav className="flex items-center gap-4">
        <Link
          href="/docs/overview"
          className="text-[13px] text-(--taw-text-secondary) transition-colors hover:text-(--taw-text-primary)"
        >
          Docs
        </Link>
        <Link
          href="/docs/components/kpi-card"
          className="hidden text-[13px] text-(--taw-text-secondary) transition-colors hover:text-(--taw-text-primary) sm:inline"
        >
          Components
        </Link>
        <a
          href="https://github.com/taw-ui/taw-ui"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-(--taw-text-muted) transition-colors hover:text-(--taw-text-primary)"
          aria-label="GitHub"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>
        <ThemeToggle />
        <Link
          href="/docs/quick-start"
          className="hidden items-center gap-1.5 rounded-full bg-(--taw-accent) px-4 py-1.5 text-[12px] font-semibold text-white shadow-sm transition-all hover:bg-(--taw-accent-hover) hover:shadow-md sm:inline-flex"
        >
          Get Started
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </nav>
    </header>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
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

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-(--taw-surface-sunken)">
      <HomeHeader />
      <main className="flex min-h-0 flex-1 flex-col">
        <HeroPlayground />
      </main>
    </div>
  )
}
