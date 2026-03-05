"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@taw-ui/react"
import { components, categories } from "@/lib/registry"
import { TableOfContents } from "./table-of-contents"

const navSections = [
  {
    title: "Get Started",
    items: [
      { label: "Overview", href: "/docs/overview" },
      { label: "Quick Start", href: "/docs/quick-start" },
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

function Logo() {
  return (
    <Link href="/docs/overview" className="group mb-8 flex items-center gap-3 px-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[--taw-accent] shadow-[0_1px_3px_oklch(0_0_0/0.2),inset_0_1px_0_oklch(1_0_0/0.15)]">
        <span className="font-pixel text-[11px] font-bold leading-none text-white">
          taw
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-[13px] font-semibold tracking-tight text-[--taw-text-primary]">
          taw-ui
        </span>
        <span className="text-[10px] text-[--taw-text-muted]">
          v0.0.1
        </span>
      </div>
    </Link>
  )
}

function ThemeToggle({ dark, setDark }: { dark: boolean; setDark: (d: boolean) => void }) {
  return (
    <button
      onClick={() => setDark(!dark)}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[--taw-border] bg-[--taw-surface] text-[--taw-text-muted] shadow-[--taw-shadow-sm] transition-all hover:border-[--taw-accent]/30 hover:text-[--taw-text-primary]"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}

export function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [dark, setDark] = useState(false)

  return (
    <div className={dark ? "dark" : ""}>
      <div className="flex min-h-screen bg-[--taw-surface-sunken]">
        {/* ─── Left sidebar ─── */}
        <aside className="sticky top-0 z-20 flex h-screen w-60 shrink-0 flex-col border-r border-[--taw-border] bg-[--taw-surface]">
          <div className="flex-1 overflow-y-auto px-3 pt-5 pb-4">
            <Logo />

            <nav className="flex flex-col gap-6">
              {navSections.map((section) => (
                <div key={section.title}>
                  <span className="mb-1 block px-2 font-pixel text-[10px] uppercase tracking-[0.15em] text-[--taw-text-muted]">
                    {section.title}
                  </span>
                  <ul className="flex flex-col gap-px">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className={cn(
                              "group relative flex items-center gap-2 rounded-lg px-2.5 py-[7px] text-[13px] transition-all",
                              isActive
                                ? "bg-[--taw-accent-subtle] font-medium text-[--taw-accent]"
                                : "text-[--taw-text-secondary] hover:bg-[--taw-surface-sunken] hover:text-[--taw-text-primary]",
                            )}
                          >
                            {isActive && (
                              <span className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-[--taw-accent]" />
                            )}
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
          </div>

          {/* Sidebar footer */}
          <div className="border-t border-[--taw-border] px-3 py-3">
            <div className="flex items-center justify-between px-2">
              <a
                href="https://github.com/thiagomota/taw-ui"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[--taw-text-muted] transition-colors hover:text-[--taw-text-primary]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <ThemeToggle dark={dark} setDark={setDark} />
            </div>
          </div>
        </aside>

        {/* ─── Main area ─── */}
        <div className="flex flex-1 flex-col">
          {/* Top bar */}
          <header className="sticky top-0 z-10 flex h-12 items-center justify-between border-b border-[--taw-border] bg-[--taw-surface-sunken]/80 px-6 backdrop-blur-md">
            <Breadcrumbs pathname={pathname} />
            <button className="flex h-7 items-center gap-2 rounded-lg border border-[--taw-border] bg-[--taw-surface] px-3 text-[12px] text-[--taw-text-muted] shadow-[--taw-shadow-sm] transition-all hover:border-[--taw-accent]/30 hover:text-[--taw-text-primary]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Search...
              <kbd className="ml-2 rounded border border-[--taw-border] bg-[--taw-surface-sunken] px-1 py-0.5 font-mono text-[10px] text-[--taw-text-muted]">
                /
              </kbd>
            </button>
          </header>

          <div className="flex flex-1">
            {/* Content */}
            <main className="flex-1 overflow-x-hidden">
              <div id="docs-content" className="mx-auto max-w-3xl px-8 py-10">
                {children}
              </div>
            </main>

            {/* Right TOC */}
            <aside className="sticky top-12 hidden h-[calc(100vh-3rem)] w-56 shrink-0 overflow-y-auto px-5 pt-8 xl:block">
              <TableOfContents />
            </aside>
          </div>
        </div>
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
    concepts: "Concepts",
    components: "Components",
    "kpi-card": "KpiCard",
    "data-table": "DataTable",
    "option-list": "OptionList",
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
