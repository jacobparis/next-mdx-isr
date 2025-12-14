import { ImageResponse } from "next/og"
import { getPostBySlug } from "@/lib/mdx"

export const runtime = "edge"
export const alt = "Blog post"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fafafa",
        }}
      >
        <div style={{ fontSize: "48px", color: "#71717a" }}>Post not found</div>
      </div>,
      { ...size },
    )
  }

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fafafa",
        padding: "60px 80px",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div style={{ fontSize: "36px", fontWeight: 600, color: "#18181b" }}>Blog</div>
        <div style={{ fontSize: "36px", color: "#d4d4d8" }}>|</div>
        <div style={{ fontSize: "36px", fontWeight: 600, color: "#ea580c" }}>Engineering</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px", flex: 1, justifyContent: "center" }}>
        <div
          style={{
            fontSize: "64px",
            fontWeight: 600,
            color: "#18181b",
            lineHeight: 1.1,
          }}
        >
          {post.title}
        </div>
        <div style={{ fontSize: "28px", color: "#71717a", lineHeight: 1.5 }}>{post.description}</div>
      </div>

      <div style={{ fontSize: "24px", color: "#a1a1aa" }}>
        {new Date(post.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </div>
    </div>,
    {
      ...size,
    },
  )
}
