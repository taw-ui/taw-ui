"use client"

import { useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@taw-ui/react"
import { highlightCode } from "@/lib/syntax"
import { PixelIcon } from "./pixel-icon"

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

  const highlighted = useMemo(() => highlightCode(children), [children])

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
          <code>{highlighted}</code>
        </pre>
      </div>
    </div>
  )
}

function CopyButton({ copied, onCopy }: { copied: boolean; onCopy: () => void }) {
  return (
    <motion.button
      onClick={onCopy}
      whileTap={{ scale: 0.9 }}
      className="flex h-6 items-center gap-1 rounded-md border border-[--taw-border] bg-[--taw-surface] px-1.5 text-[10px] text-[--taw-text-muted] transition-colors hover:text-[--taw-text-primary]"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="flex items-center gap-1 text-[--taw-success]"
          >
            <PixelIcon name="check" size={12} />
            Copied
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="flex items-center"
          >
            <PixelIcon name="copy" size={12} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

export function InlineCode({ children }: { children: string }) {
  return (
    <code className="rounded-md border border-[--taw-border] bg-[--taw-surface] px-1.5 py-0.5 font-mono text-[12px] text-[--taw-accent]">
      {children}
    </code>
  )
}
