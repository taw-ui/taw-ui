"use client"

import type { SourceData } from "taw-ui"

type Source = NonNullable<SourceData>

export function SourceLabel({ source }: { source: Source }) {
  return (
    <span className="mt-1 text-[10px] text-(--taw-text-muted)">
      {source.url ? (
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-dotted hover:decoration-solid"
        >
          {source.label}
        </a>
      ) : (
        source.label
      )}
      {source.freshness && (
        <span className="ml-1 opacity-60">&middot; {source.freshness}</span>
      )}
    </span>
  )
}
