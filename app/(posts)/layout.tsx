import type React from "react"
import Link from "next/link"

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <article className="max-w-4xl mx-auto px-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>←</span>
          <span>Back to all posts</span>
        </Link>

        {children}
      </article>
    </div>
  )
}
