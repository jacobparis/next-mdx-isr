import { notFound } from "next/navigation"
import { getPostBySlug, getNextPost } from "@/lib/mdx"
import { Markdown } from "@/components/markdown"
import { PostHeader } from "@/components/post-header"
import { SocialShare } from "@/components/social-share"
import { NextPost } from "@/components/next-post"

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

  const nextPost = await getNextPost(slug)

  return (
    <>
      <PostHeader title={post.title} date={post.date} />
      <Markdown source={post.content} />
      <div className="flex gap-x-4 mt-12">
        <SocialShare title={post.title} slug={slug} />
        <NextPost post={nextPost} />
      </div>
    </>
  )
}
