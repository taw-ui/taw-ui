"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PixelIcon } from "./pixel-icon"

export function CopyPage() {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    const content = document.getElementById("docs-content")
    if (!content) return

    const text = content.innerText
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  return (
    <motion.button
      onClick={handleCopy}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-1.5 rounded-lg border border-(--taw-border) bg-(--taw-surface) px-2.5 py-1 text-[11px] text-(--taw-text-muted) shadow-(--taw-shadow-sm) transition-colors hover:text-(--taw-text-primary)"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="flex items-center gap-1.5 text-(--taw-success)"
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
            className="flex items-center gap-1.5"
          >
            <PixelIcon name="copy" size={12} />
            Copy page
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
