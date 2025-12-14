import Link from "next/link"
import { getAllPosts } from "@/lib/mdx"
import { headers } from "next/headers"

// Revalidate every hour
export const revalidate = 3600

export default async function HomePage() {
  const posts = await getAllPosts()

  const headersList = await headers()
  const host = headersList.get("host") || ""
  const showFakePost = host.includes("vusercontent.net")

  const fakePost = {
    slug: "fake-post",
    title: "Fake post for development",
    description:
      "Welcome to your new MDX blog! This template uses Incremental Static Regeneration (ISR) to keep content fresh without rebuilding your entire site.",
    date: new Date().toISOString(),
  }

  return (
    <div>
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {showFakePost && (
            <article key={fakePost.slug} className="group">
              <Link href={`/${fakePost.slug}`} className="block">
                <h2 className="mt-3 group-hover:opacity-70 transition-opacity text-balance leading-tight font-semibold text-2xl">
                  {fakePost.title}
                </h2>
                <time className="text-sm text-muted-foreground block mt-0">
                  {new Date(fakePost.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <p className="text-base text-muted-foreground text-pretty leading-relaxed mt-2">
                  {fakePost.description}
                </p>
              </Link>
            </article>
          )}

          {posts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/post/${post.slug}`} className="block">
                <h2 className="mt-3 group-hover:opacity-70 transition-opacity text-balance leading-tight font-semibold text-2xl">
                  {post.title}
                </h2>
                <time className="text-sm text-muted-foreground block mt-0">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <p className="text-base text-muted-foreground text-pretty leading-relaxed mt-2">{post.description}</p>
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
