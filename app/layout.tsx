import type React from "react"
import type { Metadata } from "next"

import { Analytics } from "@vercel/analytics/next"
import Link from "next/link"
import "./globals.css"

import { Geist, Geist_Mono, Geist as V0_Font_Geist, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

// Initialize fonts
const _geist = V0_Font_Geist({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ["100","200","300","400","500","600","700","800","900"] })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ["200","300","400","500","600","700","800","900"] })

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Next MDX Content Site",
  description: "A hyper-minimal blog built with Next.js and MDX",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} style={{ scrollbarGutter: "stable" }}>
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <header className="border-b border-border/50">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center gap-3 text-xl">
              <Link href="/" className="font-bold text-foreground hover:opacity-70 transition-opacity">
                Blog
              </Link>
              <span className="text-muted-foreground">|</span>
              <span className="font-bold text-accent">Engineering</span>
            </div>
          </div>
        </header>

        <div className="flex-1">{children}</div>

        <footer className="border-t border-border/50 mt-16">
          <div className="max-w-4xl mx-auto px-6 text-center py-3">
            <p className="text-sm text-muted-foreground">
              Built by{" "}
              <a
                href="https://x.com/jacobmparis"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                @jacobmparis
              </a>{" "}
              in{" "}
              <a
                href="https://v0.app/templates/next-mdx-content-site-jVoZMYqbqdZ?ref=N52E9N"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                v0
              </a>
              {" · "}
              <a
                href="https://github.com/jacobparis/next-mdx-content-template"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                GitHub
              </a>
            </p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  )
}
