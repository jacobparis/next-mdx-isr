import { getAllPosts } from "@/lib/mdx"
import { Suspense } from "react"
import { FakePostCard } from "@/components/fake-post-card"
import { Navigable } from "@/components/navigable"
import type { Metadata } from "next"

// Added metadata for OG tags
export const metadata: Metadata = {
	title: "Blog | Engineering",
	description: "Technical blog covering engineering topics, architecture, and web development",
}

export default async function HomePage() {
	const posts = await getAllPosts()

	return (
		<div>
			<main className="max-w-4xl mx-auto px-6 py-11">
				<div className="space-y-8">
					<Suspense fallback={null}>
						<FakePostCard />
					</Suspense>
					{posts.map((post) => (
						<Navigable.Root key={post.slug} className="group" href={`/post/${post.slug}`} asChild>
							<article>
								<Navigable.Link>
									<h2 className="mt-3 group-hover:opacity-70 transition-opacity text-balance leading-tight text-2xl font-medium">
										{post.title}
									</h2>
								</Navigable.Link>
								<time className="text-sm text-muted-foreground block mt-0">
									{new Date(post.date).toLocaleDateString("en-US", {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</time>
								<p className="text-base text-muted-foreground text-pretty leading-relaxed mt-2">
									{post.description}
								</p>
							</article>
						</Navigable.Root>
					))}
				</div>
			</main>
		</div>
	)
}
