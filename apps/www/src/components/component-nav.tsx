"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { components, categories } from "@/lib/registry"
import { CopyPage } from "./copy-page"

// Match sidebar order: categories sorted by order, components in array order within each
const orderedComponents = Object.entries(categories)
  .sort(([, a], [, b]) => a.order - b.order)
  .flatMap(([catId]) =>
    components.filter((c) => c.category === catId && c.status === "ready")
  )

export function ComponentNav() {
  const pathname = usePathname()
  const currentId = pathname.split("/").pop()
  const currentIndex = orderedComponents.findIndex((c) => c.id === currentId)

  const prev = currentIndex > 0 ? orderedComponents[currentIndex - 1] : null
  const next =
    currentIndex < orderedComponents.length - 1
      ? orderedComponents[currentIndex + 1]
      : null

  return (
    <div className="flex items-center gap-1.5">
      <CopyPage />
      <div className="flex items-center">
        <Link
          href={prev ? `/docs/components/${prev.id}` : "#"}
          aria-disabled={!prev}
          aria-label={prev ? `Previous: ${prev.label}` : undefined}
          className={
            prev
              ? "flex items-center justify-center rounded-l-lg border border-(--taw-border) bg-(--taw-surface) p-1.5 text-(--taw-text-muted) shadow-(--taw-shadow-sm) transition-colors hover:text-(--taw-text-primary)"
              : "pointer-events-none flex items-center justify-center rounded-l-lg border border-(--taw-border) bg-(--taw-surface) p-1.5 text-(--taw-text-muted)/30 shadow-(--taw-shadow-sm)"
          }
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <Link
          href={next ? `/docs/components/${next.id}` : "#"}
          aria-disabled={!next}
          aria-label={next ? `Next: ${next.label}` : undefined}
          className={
            next
              ? "flex items-center justify-center rounded-r-lg border border-l-0 border-(--taw-border) bg-(--taw-surface) p-1.5 text-(--taw-text-muted) shadow-(--taw-shadow-sm) transition-colors hover:text-(--taw-text-primary)"
              : "pointer-events-none flex items-center justify-center rounded-r-lg border border-l-0 border-(--taw-border) bg-(--taw-surface) p-1.5 text-(--taw-text-muted)/30 shadow-(--taw-shadow-sm)"
          }
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
