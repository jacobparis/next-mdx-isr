import Link from "next/link"
import type { PostMetadata } from "@/lib/mdx"

export function NextPost({ post }: { post: PostMetadata | null }) {
  if (!post) return null

  return (
    <div className="flex-1">
      <div className="mt-2 text-base text-foreground font-medium">Next post</div>
      <Link href={`/post/${post.slug}`} className="block group">
        <h3 className="text-2xl font-semibold text-foreground group-hover:text-accent transition-colors">
          {post.title}
        </h3>
      </Link>
    </div>
  )
}
