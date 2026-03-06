"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { TawReceipt } from "@taw-ui/react"
import { cn } from "@taw-ui/react"

interface ChatMessage {
  role: "user" | "assistant"
  content?: string
  tool?: React.ReactNode
}

interface ChatSimulationProps {
  messages: ChatMessage[] | ((opts: {
    onAction: (actionId: string, payload: unknown) => void
    receipt: TawReceipt | undefined
    pending: boolean
  }) => ChatMessage[])
}

export function ChatSimulation({ messages: messagesProp }: ChatSimulationProps) {
  const [receipt, setReceipt] = useState<TawReceipt | undefined>()
  const [pending, setPending] = useState(false)

  const handleAction = useCallback((_actionId: string, payload: unknown) => {
    const p = payload as { receipt?: TawReceipt }
    setPending(true)
    setTimeout(() => {
      if (p.receipt) setReceipt(p.receipt)
      setPending(false)
    }, 600)
  }, [])

  const resolvedMessages = typeof messagesProp === "function"
    ? messagesProp({ onAction: handleAction, receipt, pending })
    : messagesProp

  return (
    <div className="overflow-hidden rounded-(--taw-radius-lg) border border-(--taw-border) shadow-(--taw-shadow-md)">
      {/* Chat header */}
      <div className="flex items-center gap-2 border-b border-(--taw-border) bg-(--taw-surface) px-4 py-2.5">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-(--taw-accent-subtle)">
          <span className="text-[10px] text-(--taw-accent)">AI</span>
        </div>
        <span className="text-[12px] font-medium text-(--taw-text-primary)">Assistant</span>
        <span className="ml-auto text-[10px] text-(--taw-text-muted)">simulated</span>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-3 bg-(--taw-surface-sunken) p-4">
        <AnimatePresence mode="popLayout">
          {resolvedMessages.map((msg, i) => (
            <motion.div
              key={`${msg.role}-${i}-${receipt ? "receipt" : "live"}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className={cn(
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              {msg.role === "user" ? (
                <div className="max-w-[80%] rounded-2xl rounded-br-md bg-(--taw-accent) px-3.5 py-2 text-[13px] text-white">
                  {msg.content}
                </div>
              ) : msg.tool ? (
                <div className="w-full max-w-[95%]">
                  {msg.content && (
                    <p className="mb-2 text-[13px] leading-relaxed text-(--taw-text-primary)">
                      {msg.content}
                    </p>
                  )}
                  {msg.tool}
                </div>
              ) : (
                <div className="max-w-[85%] text-[13px] leading-relaxed text-(--taw-text-primary)">
                  {msg.content}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {receipt && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setReceipt(undefined)}
            className="self-start text-[10px] text-(--taw-text-muted) underline decoration-dotted hover:text-(--taw-text-primary)"
          >
            reset demo
          </motion.button>
        )}
      </div>

      {/* Fake input */}
      <div className="flex items-center gap-2 border-t border-(--taw-border) bg-(--taw-surface) px-4 py-2.5">
        <div className="flex-1 rounded-lg border border-(--taw-border) bg-(--taw-surface-sunken) px-3 py-1.5 text-[12px] text-(--taw-text-muted)">
          Type a message...
        </div>
      </div>
    </div>
  )
}
