import { ImageResponse } from "next/og"
import { getAllPosts } from "@/lib/mdx"

export const runtime = "edge"
export const alt = "Next MDX Content Site"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image() {
  const posts = await getAllPosts()
  const recentPosts = posts.slice(0, 3)

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fafafa",
        padding: "60px 80px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "60px",
        }}
      >
        <div style={{ fontSize: "48px", fontWeight: 600, color: "#18181b" }}>Blog</div>
        <div style={{ fontSize: "48px", color: "#d4d4d8" }}>|</div>
        <div style={{ fontSize: "48px", fontWeight: 600, color: "#ea580c" }}>Engineering</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        {recentPosts.map((post) => (
          <div key={post.slug} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div
              style={{
                fontSize: "32px",
                fontWeight: 500,
                color: "#18181b",
                lineHeight: 1.2,
              }}
            >
              {post.title}
            </div>
            <div style={{ fontSize: "20px", color: "#71717a" }}>{post.description}</div>
          </div>
        ))}
      </div>
    </div>,
    {
      ...size,
    },
  )
}
