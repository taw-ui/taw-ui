"use client"

import { useState, useEffect } from "react"

interface TypewriterProps {
  text: string
  speed?: number
  animate?: boolean
  className?: string
}

export function Typewriter({
  text,
  speed = 40,
  animate = true,
  className,
}: TypewriterProps) {
  const [count, setCount] = useState(0)
  const [done, setDone] = useState(!animate)

  useEffect(() => {
    if (!animate || done) return

    const interval = 1000 / speed
    let i = 0
    const timer = setInterval(() => {
      i++
      setCount(i)
      if (i >= text.length) {
        setDone(true)
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [animate, done, text, speed])

  if (done) return <span className={className}>{text}</span>

  return (
    <span className={className}>
      {text.slice(0, count)}
    </span>
  )
}
