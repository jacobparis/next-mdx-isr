import { HoverPrefetchLink } from "@/components/hover-prefetch-link"
import type { PostMetadata } from "@/lib/mdx"

export function NextPost({ post }: { post: PostMetadata | null }) {
	if (!post) return null

	return (
		<div className="flex-1">
			<div className="mt-2 text-base text-foreground font-medium">Next post</div>
			<HoverPrefetchLink
				href={`/post/${post.slug}`}
				className="block text-2xl font-semibold text-foreground hover:text-accent transition-colors"
			>
				{post.title}
			</HoverPrefetchLink>
		</div>
	)
}
