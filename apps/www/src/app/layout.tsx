import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { GeistPixelSquare } from "geist/font/pixel"
import "./globals.css"
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "taw-ui — AI Tool UI Components",
  description:
    "Production-grade React components for rendering AI tool call outputs. Schema-first, motion-native, SDK-agnostic.",
  icons: { icon: "/favicon.svg" },
}

// Blocking script that sets .dark before first paint — prevents flash
const themeScript = `(function(){try{var t=localStorage.getItem('taw-theme');var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches);if(d)document.documentElement.classList.add('dark')}catch(e){}})()`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(GeistSans.variable, GeistMono.variable, GeistPixelSquare.variable, "font-sans", geist.variable)}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
