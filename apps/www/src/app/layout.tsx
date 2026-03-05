import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { GeistPixelSquare } from "geist/font/pixel"
import "./globals.css"

export const metadata: Metadata = {
  title: "taw-ui — AI Tool UI Components",
  description:
    "Production-grade React components for rendering AI tool call outputs. Schema-first, motion-native, SDK-agnostic.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
