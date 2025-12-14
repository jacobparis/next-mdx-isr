import type React from "react"
import type { Metadata } from "next"
import { getPostBySlug } from "@/lib/mdx"

// Added generateMetadata for OG tags
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {}
  }

  return {
    title: post.title,
    description: post.description,
  }
}

export default function PostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
