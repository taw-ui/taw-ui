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

// Blocking script that sets .dark before first paint — prevents flash
const themeScript = `(function(){try{if(window.matchMedia('(prefers-color-scheme:dark)').matches)document.documentElement.classList.add('dark')}catch(e){}})()`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable} ${GeistPixelSquare.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
