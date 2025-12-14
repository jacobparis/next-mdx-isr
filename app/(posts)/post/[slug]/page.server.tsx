import { getAllSlugs } from "@/lib/mdx"
import PostPage from "./page.client"

export default async function PostPageServer({
  params,
}: {
  params: { slug: string }
}) {
  return <PostPage params={params} />
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}
