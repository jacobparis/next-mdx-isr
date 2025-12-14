import { notFound } from "next/navigation"
import Link from "next/link"
import { getPostBySlug } from "@/lib/mdx"
import { Markdown } from "@/components/markdown"

// Revalidate every hour
export const revalidate = 3600

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen">
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

      <article className="max-w-4xl mx-auto px-6 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-3 text-balance leading-tight">{post.title}</h1>
          <p className="text-lg text-muted-foreground text-pretty leading-relaxed">{post.description}</p>
        </header>

        <Markdown source={post.content} />
      </article>
    </div>
  )
}
