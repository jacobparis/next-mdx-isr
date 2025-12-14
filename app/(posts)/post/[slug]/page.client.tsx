"use client"

import { notFound } from "next/navigation"
import { getPostBySlug, getNextPost } from "@/lib/mdx"
import { Markdown } from "@/components/markdown"
import { PostHeader } from "@/components/post-header"
import { SocialShare } from "@/components/social-share"
import { NextPost } from "@/components/next-post"
import { CacheProvider } from "@/components/cache-provider"

export default async function PostPage({
  params,
}: {
  params: { slug: string }
}) {
  const { slug } = params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const nextPost = await getNextPost(slug)

  return (
    <CacheProvider>
      <>
        <PostHeader title={post.title} date={post.date} />
        <Markdown source={post.content} />
        <div className="flex gap-x-4 mt-12">
          <SocialShare title={post.title} slug={slug} />
          <NextPost post={nextPost} />
        </div>
      </>
    </CacheProvider>
  )
}
