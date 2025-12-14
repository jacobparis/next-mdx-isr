import { MdxComponents, Callout } from "@/components/mdx-components"
import { PostHeader } from "@/components/post-header"
import { SocialShare } from "@/components/social-share"
import { NextPost } from "@/components/next-post"

export default function FakePostPage() {
  const { a, h2, h3, p, ul, li, code, pre } = MdxComponents

  const mockNextPost = {
    slug: "fake-post",
    title: "Understanding ISR and Webhooks",
    description:
      "Learn how Incremental Static Regeneration works with GitHub webhooks to keep your content fresh without full rebuilds.",
    date: new Date().toISOString(),
  }

  return (
    <>
      <PostHeader title="Getting Started with MDX Blog" date={new Date().toISOString()} />

      <div className="prose-custom">
        {p({
          children:
            "Welcome to your new MDX blog! This template uses Incremental Static Regeneration (ISR) to keep content fresh without rebuilding your entire site.",
        })}

        {h2({ children: "Key Features" })}

        {ul({
          children: [
            li({
              children: [
                "Write content in MDX format with full React component support. ",
                a({ href: "https://mdxjs.com/", children: "Learn more about MDX" }),
              ],
            }),
            li({
              children: [
                "Automatic revalidation via GitHub webhooks. ",
                a({ href: "https://docs.github.com/en/webhooks", children: "Learn more about GitHub webhooks" }),
              ],
            }),
            li({ children: "Smart build optimization that skips deploys for content-only changes" }),
            li({ children: "Custom MDX components like Callout and ImageGrid" }),
          ],
        })}

        {h3({ children: "Using Custom Components" })}

        {p({ children: "You can use custom components in your MDX files. Here's an example of a callout:" })}

        <Callout type="info">
          {p({
            children:
              "This is a callout component! It's perfect for highlighting important information in your blog posts.",
          })}
        </Callout>

        {h3({ children: "Code Blocks" })}

        {p({ children: "Code syntax is fully supported with proper styling:" })}

        {pre({
          children: code({
            children: `export function greet(name: string) {
  return \`Hello, \${name}!\`
}`,
          }),
        })}

        {p({ children: "Add your content to the GitHub repository and watch it automatically sync to your blog!" })}
      </div>

      <div className="flex gap-x-4 mt-12">
      <SocialShare title="Getting Started with MDX Blog" slug="fake-post" />
      <NextPost post={mockNextPost} />
      </div>
    </>
  )
}
