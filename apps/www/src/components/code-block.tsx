"use client"

import { useState, useCallback } from "react"
import { cn } from "@taw-ui/react"

interface CodeBlockProps {
  children: string
  label?: string | undefined
  className?: string | undefined
}

export function CodeBlock({ children, label, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [children])

  return (
    <div className={cn("code-block group", className)}>
      {label && (
        <div className="code-block-header">
          <span className="code-block-label">{label}</span>
          <CopyButton copied={copied} onCopy={handleCopy} />
        </div>
      )}
      <div className="relative">
        {!label && (
          <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
            <CopyButton copied={copied} onCopy={handleCopy} />
          </div>
        )}
        <pre className="overflow-x-auto p-4 font-mono text-[12px] leading-[1.7] text-[--taw-text-primary]">
          {children}
        </pre>
      </div>
    </div>
  )
}

function CopyButton({ copied, onCopy }: { copied: boolean; onCopy: () => void }) {
  return (
    <button
      onClick={onCopy}
      className="flex h-6 items-center gap-1 rounded-md border border-[--taw-border] bg-[--taw-surface] px-1.5 text-[10px] text-[--taw-text-muted] transition-all hover:border-[--taw-accent]/30 hover:text-[--taw-text-primary]"
    >
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="oklch(0.65 0.17 150)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="text-[oklch(0.65_0.17_150)]">Copied</span>
        </>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
      )}
    </button>
  )
}

export function InlineCode({ children }: { children: string }) {
  return (
    <code className="rounded-md border border-[--taw-border] bg-[--taw-surface] px-1.5 py-0.5 font-mono text-[12px] text-[--taw-accent]">
      {children}
    </code>
  )
}
