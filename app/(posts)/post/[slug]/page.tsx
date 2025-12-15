import { notFound } from "next/navigation"
import { getPostBySlug, getNextPost } from "@/lib/mdx"
import { Markdown } from "@/components/markdown"
import { PostHeader } from "@/components/post-header"
import { SocialShare } from "@/components/social-share"
import { NextPost } from "@/components/next-post"
import type { Metadata } from "next"
import { cacheTag, cacheLife } from "next/cache"

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>
}): Promise<Metadata> {
	"use cache"
	const { slug } = await params
	cacheTag(`post-${slug}`)
	cacheLife("max")

	const post = await getPostBySlug(slug)

	if (!post) {
		return {}
	}

	return {
		title: post.title,
		description: post.description,
	}
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
	"use cache"
	const { slug } = await params
	cacheTag(`post-${slug}`)
	cacheLife("max")

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
