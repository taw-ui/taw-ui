"use client"

import { useState } from "react"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [dark, setDark] = useState(true)

  return (
    <html lang="en" className={dark ? "dark" : ""}>
      <body
        className={`min-h-screen font-sans antialiased ${
          dark ? "bg-zinc-950 text-zinc-100" : "bg-white text-zinc-900"
        }`}
      >
        <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-6 py-3 backdrop-blur">
          <a href="/" className="text-sm font-semibold tracking-tight">
            taw-ui playground
          </a>
          <button
            onClick={() => setDark((d) => !d)}
            className="rounded-md border border-zinc-700 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-zinc-800"
          >
            {dark ? "Light Mode" : "Dark Mode"}
          </button>
        </nav>
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </body>
    </html>
  )
}
