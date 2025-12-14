import Link from "next/link"
import { getAllPosts } from "@/lib/mdx"

// Revalidate every hour
export const revalidate = 3600

export default async function HomePage() {
  const posts = await getAllPosts()

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

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/post/${post.slug}`} className="block">
                <h2 className="text-3xl font-bold mb-3 group-hover:opacity-70 transition-opacity text-balance leading-tight">
                  {post.title}
                </h2>
                <p className="text-base text-muted-foreground text-pretty leading-relaxed">{post.description}</p>
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
