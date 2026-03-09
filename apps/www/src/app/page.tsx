"use client"

import Link from "next/link"
import { useEffect, useSyncExternalStore } from "react"
import { motion, AnimatePresence } from "motion/react"
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
          className="flex h-7 w-7 items-center justify-center rounded-full border border-(--taw-border) bg-(--taw-surface-raised) text-(--taw-text-muted) transition-colors hover:text-(--taw-text-primary)"
          aria-label="GitHub"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 2H9V4H7V6H5V2Z" />
            <path d="M5 12H3V6H5V12Z" />
            <path d="M7 14H5V12H7V14Z" />
            <path fillRule="evenodd" clipRule="evenodd" d="M9 16V14H7V16H3V14H1V16H3V18H7V22H9V18H11V16H9ZM9 16V18H7V16H9Z" />
            <path d="M15 4V6H9V4H15Z" />
            <path d="M19 6H17V4H15V2H19V6Z" />
            <path d="M19 12V6H21V12H19Z" />
            <path d="M17 14V12H19V14H17Z" />
            <path d="M15 16V14H17V16H15Z" />
            <path d="M15 18H13V16H15V18Z" />
            <path d="M15 18H17V22H15V18Z" />
          </svg>
        </a>
        <ThemeToggle />
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
    <div className="flex h-dvh flex-col overflow-hidden bg-(--taw-surface-sunken)">
      <HomeHeader />
      <main className="flex min-h-0 flex-1 flex-col">
        <HeroPlayground />
      </main>
    </div>
  )
}
